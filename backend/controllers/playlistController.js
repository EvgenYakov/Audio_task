const asyncHandler = require("express-async-handler");
const {Types} = require("mongoose");
const Playlist = require("../models/playlist");
const Track = require("../models/music");
const User = require("../models/user");
const mongodb = require("mongodb");


const addPlaylist = asyncHandler(async (req,res)=>{
    try {
    const {label,url,tracks} = req.body;
    let category;
    if (req.user.role == "admin"){
        category = true
    }else{
        category = false
    }
    const plist = await new Playlist({label, url,category, tracks})
        req.user.playlists.push(plist._id);
        await User.findByIdAndUpdate(req.user._id, req.user, {new:true})
        await plist.save()
        res.status(200).json(plist)
    }catch (e) {
        res.status(400)
        throw new Error(e)
    }
})

const getPlaylist = asyncHandler(async (req,res)=>{
    try {
        let category=true;
        const user = await req.user.populate('playlists')
        const categoryPlaylist = await Playlist.find({category})
        if (req.user.role === 'user')
            res.status(200).json(categoryPlaylist.concat(user.playlists))
        else
            res.status(200).json(categoryPlaylist)
    }catch (e) {
        res.status(400)
        throw new Error(e)
    }

})

const putPlaylist = asyncHandler(async (req,res)=>{
    try {
        const plist = await Playlist.findById(req.params.id)
        if (!plist) {
            res.status(400)
            throw new Error('Track not found')
        }

        if (!req.user) {
            res.status(401)
            throw new Error('User not found')
        }

        const updatedPlist= await Playlist.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.status(200).json(updatedPlist)
    }catch (e) {
        console.log(e)
    }

})

const deletePlaylist = asyncHandler(async (req,res)=>{
    try {
        const plst = await Playlist.findById(req.params.id);
        if (!plst) {
            res.status(400)
            throw new Error('Такого плейлиста уже нет')
        }
        await plst.remove();
        res.status(200).json({ id: req.params.id })
    }catch (e) {
        console.log(e)
    }
})





module.exports = {
    addPlaylist,
    getPlaylist,
    putPlaylist,
    deletePlaylist
}