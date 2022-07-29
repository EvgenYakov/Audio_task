const asyncHandler = require("express-async-handler");
const mongodb = require('mongodb')
const {Types} = require("mongoose");
const Track = require("../models/music");
const User = require("../models/user");
const {MongoClient} = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

let db;
const mongoURI = "mongodb+srv://evgen:aUAqEDC8PmmgW6rE@cluster1.agwws.mongodb.net/audio_task?retryWrites=true&w=majority";
MongoClient.connect(mongoURI, (err, client) => {
    if (err) {
        console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
        process.exit(1);
    }
    db = client.db('audios');
});



const addTrack = asyncHandler(async (req,res)=>{
    const {label, author,id,url} = req.body;
    const fileId = Types.ObjectId(id)
    const track = await new Track({label,author, fileId, url})
    await track.save();
    res.status(200).json(track)
})

const getTracks = asyncHandler(async (req,res)=>{
    try {
        const tracks = await Track.find().select('-comments');
        if (req.user === "guest"){
            res.status(200).json(tracks.slice(0,10))
            return
        }
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
            res.status(404)
            throw new Error('Такой песни уже нет')
        }
        await new mongodb.GridFSBucket(db).delete(track.fileId)
        await track.remove();
        res.status(200).json({ id: req.params.id })
    }catch (e) {
        res.status(400)
        throw new Error(e)
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
        const updatedTrack= await Track.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.status(200).json(updatedTrack)
})



const changeLike = asyncHandler(async (req,res)=>{
    try {
        const track = await Track.findById(req.params.id).select('-comments')
        if (req.body.like===true){
            req.user.liked.push(track._id);
            const likes = ++track.numOfLks;
            await User.updateOne({_id:req.user._id}, {$set:{liked:req.user.liked}})
            await Track.updateOne({_id:track._id}, {$set:{numOfLks:likes}})
            res.status(202).json(track)
        }
        if(req.body.like===false){
            const newLiked = req.user.liked.filter(id => id.toString()!==track._id.toString())
            await User.updateOne({_id:req.user._id}, {$set:{liked:newLiked}})
            const likes = --track.numOfLks;
            await Track.updateOne({_id:track._id}, {$set:{numOfLks:likes}})
            res.status(202).json(track)
        }
    }catch (e) {
        console.log(e)
        res.status(400)
        throw new Error(e)
    }
})

const addView = asyncHandler(async (req,res)=>{
    try{
        const track = await Track.findById(req.params.id).select('-comments')
        await Track.updateOne({_id:track._id}, {$set:{numOfAud: ++track.numOfAud}})
        res.status(202).json(track)
    }catch (e) {
        res.status(400)
        console.log(e)
        throw new Error(e)
    }

})

const getTrack = asyncHandler(async (req,res)=>{
    try {
        const track = await Track.findById(req.params.id)
        res.status(202).json(track)
    }catch (e) {
        res.status(400)
        throw new Error(e)
    }
})


const addComments = asyncHandler(async (req,res)=>{
    try {
        const track = await Track.findById(req.params.id)
        const items = [...track.comments.items]
        items.push(req.body)
        const upTrack = await Track.findByIdAndUpdate({_id:req.params.id}, {comments:{items}},{new:true})
        res.status(202).json(upTrack)
    }catch (e){
        console.log(e)
        res.status(400)
        throw new Error(e)
    }
})


module.exports = {
    addTrack,
    getTracks,
    deleteTrack,
    putTrack,
    changeLike,
    addView,
    getTrack,
    addComments
}