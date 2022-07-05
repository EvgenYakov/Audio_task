const asyncHandler = require("express-async-handler");
const User = require("../models/user")
const Track = require("../models/music");
const bcrypt = require("bcrypt");

const getUsers = asyncHandler(async (req,res)=>{
        try {
            const users = await User.find({role:"user"});
            res.status(200).json(users)
        }catch (e){
            res.status(400)
            throw new Error(e)
        }
        }
    )

const putUser = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(400)
        throw new Error('Пользователь не был найден' )
    }
    if (req.body.password===""){
        req.body.password=user.password
    }
    else
    if (!(await bcrypt.compare(req.body.password,user.password))){
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser= await User.findByIdAndUpdate(req.params.id, req.body, {new:true})
    res.status(200).json(updatedUser)
})


const addUser = asyncHandler(async (req,res)=>{
    const {name,email,password} = req.body;
    const candidate = await  User.findOne({email});
    if(candidate){
        res.status(400);
        throw new Error('Пользователь с таким email уже существует')
    } else {
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashPassword, role:'user'})
        if (user){
            res.status(201).json(user)
        }
    }
})

const deleteUser = asyncHandler(async (req,res)=>{
    const user = await  User.findById(req.params.id);
    if(!user){
        res.status(400);
        throw new Error('Пользователь уже удален')
    } else {
        user.remove()
        res.status(201).json({id:req.params.id})
    }
})


module.exports = {
    getUsers,
    putUser,
    addUser,
    deleteUser
}