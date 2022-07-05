const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Track = require("../models/music");

const register = asyncHandler(async (req,res)=>{
    const {name,email,password} = req.body;
    const candidate = await  User.findOne({email});
    if(candidate){
        res.status(400);
        throw new Error('Пользователь с таким email уже существует')
    } else {
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashPassword, role:'user'})
        if (user){
            res.status(201).json({
                data:{
                    _id:user.id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                    liked:user.liked,
                    token:generateToken(user.id)
                }
            })
        }
    }
})


function generateToken (id) {
    return jwt.sign({id}, process.env.SECRET, {expiresIn: "1h"})
}


const loginUser = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    const user = await  User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password))){
        res.status(200).json({
            data:{
                _id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
                liked:user.liked,
                playlists:user.playlists,
                token:generateToken(user.id)
            }
        })
    } else {
        res.status(400)
        throw new Error('Введенные данные не верны')
    }
})



module.exports = {
    register,
    loginUser
}