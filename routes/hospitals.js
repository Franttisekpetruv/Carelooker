const express = require('express')
const router = express.Router();
const catchAsync = require("../utilities/catchAsync.js")
const hospitaldata2 = require('../models/hospitals')
const Review = require('../models/review');
const isLoggedIn = require('../middleware')

router.post('/', isLoggedIn, catchAsync(async(req, res) => {
    const hospital = new hospitaldata2(req.body.hospital)
    await hospital.save();
    req.flash('sucess', 'Succesfully done it')
    console.log('I WORK');
    res.redirect(`/show/${hospital._id}`)
}))

router.get('/:id', catchAsync(async(req, res) => {
        const id = req.params.id
        const hospital = await hospitaldata2.findById(id).populate('Reviews')
        if (!hospital) {
            req.flash('error', 'Hospital does not exists')
            return res.redirect('/hospitals')

        }
        console.log(hospital);
        res.render('show.ejs', { hospital });
    }))
    //add validatereview
router.post('/:id/reviews', isLoggedIn, catchAsync(async(req, res) => {
    const id = req.params.id
    const hospital = await hospitaldata2.findById(id)
    const review = new Review(req.body.Review)
    hospital.Reviews.push(review)
    await review.save()
    await hospital.save()
    res.redirect(`/show/${hospital._id}`)
}))

router.put('/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const hospital = await hospitaldata2.findByIdAndUpdate(id, {...req.body.hospital })
    res.redirect(`/show/${hospital._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params; //the only param is the id 
    await hospitaldata2.findByIdAndDelete(id);
    res.redirect('/hospitals'); // redirect back to home
}))

router.delete('/:id/reviews/:reviewId', isLoggedIn, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params; //the only param is the id 
    await hospitaldata2.findByIdAndUpdate(id, { $pull: { Reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully deleted") //! FLASH MESSAGES ARE NOT WIORKING 
    res.redirect(`/show/${id}`); // redirect back to home
}))

module.exports = router;