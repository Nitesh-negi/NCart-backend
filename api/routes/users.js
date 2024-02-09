const express = require('express')
const router = express.Router()

const UserController = require('../controllers/users')

router.post('/login', UserController.login_user)

router.post('/signup', UserController.signup_user)

router.get('/get-all-users', UserController.get_all_users)

module.exports = router