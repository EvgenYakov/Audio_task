const asyncHandler = require("express-async-handler");
const mongodb = require('mongodb')
const {Readable } = require('stream');
const {Types} = require("mongoose");
const Track = require("../models/music");
const User = require("../models/user");
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const mongoURI = "mongodb+srv://evgen:aUAqEDC8PmmgW6rE@cluster1.agwws.mongodb.net/audio_task?retryWrites=true&w=majority";

let db;
MongoClient.connect(mongoURI, (err, client) => {
    if (err) {
        console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
        process.exit(1);
    }
    db = client.db('audios');
});


const uploadFile = asyncHandler(async (req,res)=>{
    let trackName = req.file.originalname;
    const file = await db.collection('fs.files').findOne({filename:trackName})
    if (file){
        res.status(400);
        throw new Error('Такая аудиозапись уже существует')
    } else {
        const readableTrackStream = new Readable();
        readableTrackStream.push(req.file.buffer);
        readableTrackStream.push(null);
        let bucket = new mongodb.GridFSBucket(db);
        let uploadStream = bucket.openUploadStream(trackName);
        let id = uploadStream.id;
        readableTrackStream.pipe(uploadStream);
        uploadStream.on('error', () => {
            return res.status(500).json({ message: "Ошибка загрузки файла" });
        });
        uploadStream.on('finish', () => {

            return res.status(201).json({ message: "Файл успешно загружен ", trackId:id });
        });
    }
})

const streamFile = asyncHandler(async (req,res)=>{
        mongodb.MongoClient.connect(mongoURI, (err,client) => {
            if (err){
                res.status(500).json(err);
                return;
            }
            const range = req.headers.range;
            if (!range){
                res.status(400).send("Crash header")
            }
            const db = client.db('audios')
            const id  = ObjectId(req.params.id)
            db.collection('fs.files').findOne({_id:id}, (err,video) => {
                try {
                    if (!video){
                        res.status(404).send("Error in upload");
                        return;
                    }
                    const audioSize  = video.length;
                    const start = Number(range.replace(/\D/g, ""));
                    const end =audioSize-1;
                    const contentLength  = end - start +1;
                    const { length } = video;
                    const headers = {
                        "Content-Range": `bytes ${start}-${end}/${audioSize}`,
                        "Accept-Ranges": "bytes",
                        "Content-Length": contentLength,
                        "Content-Type": "audio/mp3",
                    }
                    res.writeHead(206,headers)
                    const bucket = new mongodb.GridFSBucket(db);
                    const downloadStream = bucket.openDownloadStreamByName(video.filename,{
                        start,
                        end:length
                    })
                    downloadStream.pipe(res);
                }catch (e) {
                    console.log(e)
                }

            })

        })

})






const addTrack = asyncHandler(async (req,res)=>{
    const {label, author,id,url} = req.body;
    const fileId = Types.ObjectId(id)
    const track = await new Track({label,author, fileId, url})
    await track.save();
    res.status(200).json(track)
})

const getTracks = asyncHandler(async (req,res)=>{
    try {
        const tracks = await Track.find();
        res.status(200).json(tracks)
    }catch (e){
        res.status(400)
        throw new Error(e)
    }
})


const deleteTrack = asyncHandler(async (req,res)=>{
    try {
        const track = await Track.findById(req.params.id);
        if (!track) {
            res.status(400)
            throw new Error('Такой песни уже нет')
        }
        await new mongodb.GridFSBucket(db).delete(track.fileId)
        await track.remove();
        res.status(200).json({ id: req.params.id })
    }catch (e) {
        console.log(e)
    }
})


const putTrack = asyncHandler(async (req,res)=>{
        const track = await Track.findById(req.params.id)
        if (!track) {
            res.status(400)
            throw new Error('Track not found')
        }

        if (!req.user) {
            res.status(401)
            throw new Error('User not found')
        }
        if(track.numOfLks<req.body.numOfLks){
            req.user.liked.push(track._id);
            await User.updateOne({_id:req.user._id}, {$set:{liked:req.user.liked}})
        }
        if(track.numOfLks>req.body.numOfLks){
            const newLiked = [...req.user.liked].filter(id => id.toString()!==track._id.toString())
            await User.updateOne({_id:req.user._id}, {$set:{liked:newLiked}})
        }
        const updatedTrack= await Track.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.status(200).json(updatedTrack)

})


module.exports = {
    uploadFile,
    addTrack,
    getTracks,
    deleteTrack,
    putTrack,
    streamFile
}