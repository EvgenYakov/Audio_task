const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Track = require("../models/music");
const Tokens = require("../models/tokens");

const register = asyncHandler(async (req,res)=>{
    const {name,email,password} = req.body;
    const candidate = await  User.findOne({email});
    if(candidate){
        res.status(400);
        throw new Error('Пользователь с таким email уже существует')
    } else {
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashPassword, role:'user'})
        const accessToken = generateToken(user._id, process.env.SECRET, "10m")
        const refreshToken = generateToken(user._id,process.env.JWT_REFRESH_SECRET,"1d")
        await Tokens.create({userId: user._id, refreshToken});
        res.cookie('refreshToken', refreshToken, {maxAge:  Date.now() + 86400e3, httpOnly: true})
        if (user){
            res.status(201).json({
                    _id:user.id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                    liked:user.liked,
                    token:accessToken
            })
        }
    }
})


function generateToken (id,secret,time) {
    return jwt.sign({id},secret, {expiresIn: time})
}


const loginUser = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    const user = await  User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password))){
        try {
            const accessToken = generateToken(user._id, process.env.SECRET, "10m")
            const refreshToken = generateToken(user._id,process.env.JWT_REFRESH_SECRET,"1d")
            await Tokens.create({userId: user._id, refreshToken});
            res.cookie('refreshToken', refreshToken, {maxAge:  Date.now() + 86400e3, httpOnly: true})
            res.status(200).json({
                name:user.name,
                email:user.email,
                role:user.role,
                liked:user.liked,
                playlists:user.playlists,
                token:accessToken
            })
        }catch (e) {
            console.log(e)
        }
    } else {
        res.status(400)
        throw new Error('Введенные данные не верны')
    }
})

const refresh = asyncHandler(async (req, res)=>{
    const {refreshToken} = req.cookies;
    const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const tokenData = await Tokens.findOne({refreshToken})
    if (!userData || !tokenData) {
        console.log(userData)
        console.log(tokenData)
        res.status(401)
        throw new Error('Вы не авторизованы')
    }
    try{
        const user = await User.findById(userData.id)
        const newAccessToken = generateToken(user._id,process.env.SECRET, "10m")
        const newRefreshToken = generateToken(user._id,process.env.JWT_REFRESH_SECRET,"1d")
        tokenData.refreshToken = newRefreshToken;
        tokenData.save();
        res.cookie('refreshToken', newRefreshToken, {maxAge:  Date.now() + 86400e3, httpOnly: true})
        res.status(200).json({
            name:user.name,
            email:user.email,
            role:user.role,
            liked:user.liked,
            playlists:user.playlists,
            token:newAccessToken
        })
    }catch (e) {
        res.status(500)
        throw new Error(e.message)
    }
})

const logout = async (req, res)=>{
    try{
        const {refreshToken} = req.cookies;
        const token = await Tokens.deleteMany({refreshToken})
        res.clearCookie('refreshToken');
        return res.json(token)
    }catch (e) {
        res.status(500)
        throw new Error(e.message)
    }
}



module.exports = {
    register,
    loginUser,
    refresh,
    logout
}