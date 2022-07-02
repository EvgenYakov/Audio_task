const Router = require('express')
const router = Router();

router.route('/').get(protect, getHome)