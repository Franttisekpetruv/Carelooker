module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Please sign in')
        return res.redirect('/login')
    }
    next()
}
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const hospital = await hospitaldata2.findById(id)
    if (!hospital.Owner.equal(req.user._id)) {
        req.flash('error', "NO REMISSION")
        res.redirect(`/show/${hospital._id}`)
    }
    next()
}