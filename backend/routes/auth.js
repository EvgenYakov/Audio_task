const Router = require('express')
const router = Router();
const {register, loginUser, putUser,getMe} = require("../controllers/authController");
const {protect} = require("../middleware/authMiddleware");


router.post('/register',register)
router.post('/login',loginUser)

module.exports = router