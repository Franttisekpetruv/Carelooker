const Review = require('../models/review');
const hospitaldata2 = require('../models/hospitals')

module.exports.createReview = async(req, res) => {
    const id = req.params.id
    const hospital = await hospitaldata2.findById(id)
    const review = new Review(req.body.Review)
    console.log('still in front');
    review.Owner = req.user._id
    console.log('got past it');
    hospital.Reviews.push(review)
    console.log(review);
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