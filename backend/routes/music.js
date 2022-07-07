const router = require('express').Router();
require('dotenv').config();
const {addTrack, getTracks, deleteTrack, putTrack} = require("../controllers/audioController")
const {protect} = require('../middleware/authMiddleware')



router.route('/').get(getTracks).post(protect, addTrack)
router.route('/:id').delete(protect, deleteTrack).put(protect,putTrack)



module.exports = router