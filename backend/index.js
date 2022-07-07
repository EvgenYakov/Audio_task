const express = require("express")
const mongoose = require('mongoose')
const connectDB = require('./config/db.js')
const dotenv = require('dotenv').config()

const addRouter = require('./routes/music.js')
const authRouter = require('./routes/auth.js')
const playlistRouter = require('./routes/playlist.js')
const userRouter = require('./routes/user.js')
const streamRouter = require('./routes/stream.js')

const bodyParser = require('body-parser');
const {errorHandler} = require("./middleware/errorMiddleware");

const PORT = process.env.PORT || 3001
const app = express();



//app.use(multer({dest:"uploads"}).single("filedata"));

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

//app.use('/music',addRouter);
app.use('/auth',authRouter);
app.use('/music',addRouter);
app.use('/playlist',playlistRouter)
app.use('/user',userRouter);
app.use('/stream',streamRouter);



app.use(errorHandler)


app.listen(PORT, () => console.log(`Server started on port ${PORT}`))