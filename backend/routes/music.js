const router = require('express').Router();
require('dotenv').config();
const {addTrack, getTracks, deleteTrack, putTrack,changeLike, addView, getTrack, addComments} = require("../controllers/audioController")
const {protect, protectAdmin, protectGuest} = require('../middleware/authMiddleware')



router.route('/').get(protectGuest,getTracks).post(protectAdmin, addTrack)
router.route('/:id').delete(protectAdmin, deleteTrack).put(protectAdmin,putTrack)

router.route('/like/:id').post(protect,changeLike)
router.route('/view/:id').post(addView)
router.route('/track/:id').get(getTrack)
router.route('/comments/:id').post(protect,addComments)

module.exports = router