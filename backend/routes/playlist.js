const {protect} = require("../middleware/authMiddleware");
const {addPlaylist, getPlaylist} = require("../controllers/playlistController");
const router = require('express').Router();

router.route("/").get(protect,getPlaylist).post(protect, addPlaylist)



module.exports = router