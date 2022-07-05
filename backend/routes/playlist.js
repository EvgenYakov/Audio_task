const {protect} = require("../middleware/authMiddleware");
const {addPlaylist, getPlaylist,putPlaylist,deletePlaylist} = require("../controllers/playlistController");
const router = require('express').Router();

router.route("/").get(protect,getPlaylist).post(protect, addPlaylist)
router.route('/:id').delete(protect, deletePlaylist).put(protect,putPlaylist)


module.exports = router