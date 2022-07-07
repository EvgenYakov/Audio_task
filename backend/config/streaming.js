const {MongoClient, ObjectId} = require("mongodb");
const asyncHandler = require("express-async-handler");
const {Readable} = require("stream");
const mongodb = require("mongodb");

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

module.exports = {
    streamFile,
    uploadFile
}