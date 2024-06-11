const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users')
const checkAuth = require('../middleware/check-auth')

router.post('/signup', UsersController.signup_users)

router.post('/login', UsersController.login_users)

router.delete('/:userId', checkAuth, UsersController.delete_users)

module.exports = router;