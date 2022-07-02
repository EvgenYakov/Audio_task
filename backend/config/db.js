const mongoose = require('mongoose')

MONGO_URI = "mongodb+srv://evgen:aUAqEDC8PmmgW6rE@cluster1.agwws.mongodb.net/audio_task?retryWrites=true&w=majority"

const connectDB = async ()=>{
    try{
        const conn = await  mongoose.connect(MONGO_URI, {useNewUrlParser:true})
        console.log(`MongoDB Connected: ${conn}`)
    }catch (err){
        console.log(err)
    }
}


module.exports = connectDB