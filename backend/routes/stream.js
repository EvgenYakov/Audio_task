const multer = require("multer");
const {uploadFile, streamFile} = require("../config/streaming");
const {protectAdmin} = require("../middleware/authMiddleware");
require('dotenv').config();
const router = require('express').Router();


const storage = multer.memoryStorage()
const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 600000000, files: 1, parts: 2 }});
router.post('/upload', protectAdmin,  upload.single('file'), uploadFile);
router.get('/:id', streamFile)



module.exports = router