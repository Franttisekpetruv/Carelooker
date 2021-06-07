const express = require('express')
const router = express.Router();
const catchAsync = require('../utilities/catchAsync')
const User = require('../models/user')
const passport = require('passport')

router.get('/register', (req, res) => {
    res.render('register.ejs')
})

router.post('/register', catchAsync(async(req, res) => {
    const { email, username, password } = req.body
    console.log(req.body);
    const newUser = new User({
        email,
        username
    })
    const registereduser = await User.register(newUser, password);
    console.log(registereduser);
    req.flash('success', 'welcome')
    res.redirect('/hospitals')
}))
router.get('/login', (req, res) => {
    res.render('login.ejs')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (async(req, res) => {
    req.flash('success', 'welcome back')
    res.redirect('/hospitals')

}))
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'logged out')
    res.redirect('/')
})

module.exports = router