const Review = require('../models/review');
const hospitaldata2 = require('../models/hospitals')
const User = require('../models/user')
const express = require('exPress')


module.exports.createReview = async(req, res) => {
    const id = req.params.id
    const hospital = await hospitaldata2.findById(id)
    const review = new Review(req.body.Review)
    hospital.Reviews.push(review)
    await review.save()
    await hospital.save()
    res.redirect(`/show/${hospital._id}`)
}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params; //the only param is the id 
    await hospitaldata2.findByIdAndUpdate(id, { $pull: { Reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully deleted") //! FLASH MESSAGES ARE NOT WIORKING 
    res.redirect(`/show/${id}`); // redirect back to home
}