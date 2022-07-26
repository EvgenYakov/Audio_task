const asyncHandler = require("express-async-handler");
const mongodb = require('mongodb')
const {Types} = require("mongoose");
const Track = require("../models/music");
const User = require("../models/user");
const ObjectId = require('mongodb').ObjectId;



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



const changeLike = asyncHandler(async (req,res)=>{
    try {
        const track = await Track.findById(req.params.id)
        if (req.body.like===true){
            req.user.liked.push(track._id);
            const likes = ++track.numOfLks;
            await User.updateOne({_id:req.user._id}, {$set:{liked:req.user.liked}})
            await Track.updateOne({_id:track._id}, {$set:{numOfLks:likes}})
            res.status(202).json(track.select('-comments'))
        }
        if(req.body.like===false){
            const newLiked = req.user.liked.filter(id => id.toString()!==track._id.toString())
            await User.updateOne({_id:req.user._id}, {$set:{liked:newLiked}})
            const likes = --track.numOfLks;
            await Track.updateOne({_id:track._id}, {$set:{numOfLks:likes}})
            res.status(202).json(track.select('-comments'))
        }
    }catch (e) {
        res.status(400)
        throw new Error(e)
    }
})

const addView = asyncHandler(async (req,res)=>{
    try{
        console.log(132312)
        const track = await Track.findById(req.params.id).select('-comments')
        await Track.updateOne({_id:track._id}, {$set:{numOfAud: ++track.numOfAud}})
        console.log(track)
        res.status(202).json(track)
    }catch (e) {
        res.status(400)
        console.log(e)
        throw new Error(e)
    }

})

const getComments = asyncHandler(async (req,res)=>{
    try {
        const track = await Track.findById(req.params.id)
        res.status(202).json(track.comments.items)
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
        console.log(items)
        await Track.updateOne({_id:req.params.id}, {$set:{comments:{items}}})
        res.status(202).json(req.body)
    }catch (e){
        res.status(400)
        throw new Error(e)
        console.log(e)
    }
})


module.exports = {
    addTrack,
    getTracks,
    deleteTrack,
    putTrack,
    changeLike,
    addView,
    getComments,
    addComments
}