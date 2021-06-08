const express = require('express')
const router = express.Router();
const catchAsync = require("../utilities/catchAsync.js")
const hospitaldata2 = require('../models/hospitals')
const Review = require('../models/review');
const { isLoggedIn, isAuthor } = require('../middleware')
const hospitals = require('../controllers/hospitals')
const reviews = require('../controllers/reviews')
const passport = require('passport')
const users = require('../controllers/users')
const passportLocal = require('passport-local')

//! BEWARE OF ERROR DUE TP CONTROLLERS
router.route('/:id')
    .get(catchAsync(hospitals.showHospitals))
    .put(isLoggedIn, isAuthor, catchAsync(hospitals.updateHospital))
    .delete(isLoggedIn, isAuthor, catchAsync(hospitals.deleteHospital))



router.post('/', isLoggedIn, catchAsync(hospitals.new))
    //add validaterevie
router.post('/:id/reviews', catchAsync(reviews.createReview))
router.delete('/:id/reviews/:reviewId', isLoggedIn, catchAsync(reviews.deleteReview))

module.exports = router;