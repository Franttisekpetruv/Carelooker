const hospitaldata2 = require('../models/hospitals')

module.exports.new = async(req, res) => {
    const hospital = new hospitaldata2(req.body.hospital)
    hospital.Owner = req.user._id
    console.log(hospital.Owner);
    await hospital.save();
    req.flash('sucess', 'Succesfully done it')
    res.redirect(`/show/${hospital._id}`)
}
module.exports.updateHospital = async(req, res) => {
    const { id } = req.params;
    const hospital = await hospitaldata2.findByIdAndUpdate(id, {...req.body.hospital })
    res.redirect(`/show/${hospital._id}`)
}
module.exports.deleteHospital = async(req, res) => {
    const { id } = req.params;
    const hospital = await hospitaldata2.findById(id)
    if (!hospital.Owner.equal(req.user._id)) {
        req.flash('error', "NO REMISSION")
        res.redirect(`/show/${hospital._id}`)
    }
    await hospitaldata2.findByIdAndDelete(id);
    res.redirect('/hospitals'); // redirect back to home
}

module.exports.showHospitals = async(req, res) => {
    const id = req.params.id
    const hospital = await hospitaldata2.findById(id).populate('Reviews')
    if (!hospital) {
        req.flash('error', 'Hospital does not exists')
        return res.redirect('/hospitals')

    }
    console.log(hospital);
    res.render('show.ejs', { hospital });
}