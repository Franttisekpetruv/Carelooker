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
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

//! BEWARE OF ERROR DUE TP CONTROLLERS
router.route('/:id')
    .get((hospitals.showHospitals))
    .patch(upload.array('Image'), hospitals.updateHospital)
    .delete(isLoggedIn, isAuthor, catchAsync(hospitals.deleteHospital))



router.route('/')
    .post(upload.array('Image'), (hospitals.new))


//add validaterevie
router.post('/:id/reviews', (reviews.createReview))
router.delete('/:id/reviews/:reviewId', isLoggedIn, catchAsync(reviews.deleteReview))

module.exports = router;