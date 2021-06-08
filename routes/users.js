const express = require('express')
const router = express.Router();
const catchAsync = require('../utilities/catchAsync')
const User = require('../models/user')
const passport = require('passport')
const users = require('../controllers/users')
const passportLocal = require('passport-local')



router.route('/register')
    .get((users.registerForm))
    .post(catchAsync(users.registerUser))
router.route('/login')
    .get((users.loginUser))
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (users.authUser))

router.get('/logout', (users.logoutUser))

module.exports = router