const {protect} = require("../middleware/authMiddleware");
const {putUser,getUsers, addUser,deleteUser} = require("../controllers/userController");
const router = require('express').Router();



router.route('/').get(protect,getUsers).post(protect,addUser)
router.route('/:id').put(protect,putUser).delete(protect,deleteUser)


module.exports = router