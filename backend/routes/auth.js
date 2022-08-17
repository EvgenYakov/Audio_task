const Router = require('express')
const router = Router();
const {register, loginUser,refresh,logout} = require("../controllers/authController");



router.post('/register',register)
router.post('/login',loginUser)
router.post('/refresh', refresh)
router.post('/logout',logout)

module.exports = router