const router = require('express').Router();
const multer = require('multer');
require('dotenv').config();
const {uploadFile, addTrack, getTracks, deleteTrack, putTrack, streamFile} = require("../controllers/audioController")
const {protect} = require('../middleware/authMiddleware')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 600000000, files: 1, parts: 2 }});
router.post('/upload', upload.single('file'), uploadFile);
router.get('/stream/:id', streamFile)


router.route('/').get(getTracks).post(protect, addTrack)
router.route('/:id').delete(protect, deleteTrack).put(protect,putTrack)



module.exports = router