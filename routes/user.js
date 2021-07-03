const express = require('express')
const router = express.Router()
const user = require('../controllers/user')


router.route('/signUp')
    .get(user.renderSignUp)
    .post(user.signUp)   

router.route('/login')
    .get(user.renderLogin)
    .post(user.login)

module.exports = router