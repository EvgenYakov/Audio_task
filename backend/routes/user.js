const {protect, protectAdmin} = require("../middleware/authMiddleware");
const {putUser,getUsers, addUser,deleteUser} = require("../controllers/userController");
const router = require('express').Router();



router.route('/').get(protectAdmin,getUsers).post(protectAdmin,addUser)
router.route('/:id').put(protectAdmin,putUser).delete(protectAdmin,deleteUser)


module.exports = router