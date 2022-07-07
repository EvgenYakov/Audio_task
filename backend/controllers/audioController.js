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
    addTrack,
    getTracks,
    deleteTrack,
    putTrack
}