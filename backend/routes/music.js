const router = require('express').Router();
require('dotenv').config();
const {addTrack, getTracks, deleteTrack, putTrack,changeLike, addView, getComments, addComments} = require("../controllers/audioController")
const {protect, protectAdmin, protectGuest} = require('../middleware/authMiddleware')



router.route('/').get(protectGuest,getTracks).post(protectAdmin, addTrack)
router.route('/:id').delete(protectAdmin, deleteTrack).put(protect,putTrack)

router.route('/like/:id').post(protect,changeLike)
router.route('/view/:id').post(addView)
router.route('/comments/:id').get(getComments)
router.route('/comments/:id').post(addComments)
// router.route('/comment/:id').put(addComment)
//


module.exports = router