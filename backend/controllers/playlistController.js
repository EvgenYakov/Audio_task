const asyncHandler = require("express-async-handler");
const {Types} = require("mongoose");
const Playlist = require("../models/playlist");


const addPlaylist = asyncHandler(async (req,res)=>{
    const {label,url,tracks} = req.body;
    console.log(req.body)
    let category;
    if (req.user.role == "admin"){
        category = true
    }else{
        category = false
    }
    const plist = await new Playlist({label, url,category, tracks})
    console.log(plist)
    await plist.save()
    res.status(200).json(plist)
})

const getPlaylist = asyncHandler(async (req,res)=>{
    let category=true;
    const categoryPlaylist = await Playlist.find({category})
    res.status(200).json(categoryPlaylist)
})




module.exports = {
    addPlaylist,
    getPlaylist

}