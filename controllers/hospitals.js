const hospitaldata2 = require('../models/hospitals')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mbToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mbToken })

module.exports.new = async(req, res, next) => {
    const geodata = await geocoder.forwardGeocode({
        query: req.body.hospital.City,
        limit: 1
    }).send()
    const hospital = new hospitaldata2(req.body.hospital)

    hospital.geometry = geodata.body.features[0].geometry
    console.log(hospital.geometry);
    hospital.Image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    console.log(hospital.Owner);
    await hospital.save();
    console.log(hospital);
    req.flash('sucess', 'Succesfully done it')
    res.redirect(`/show/${hospital._id}`)
}
module.exports.updateHospital = async(req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const hospital = await hospitaldata2.findByIdAndUpdate(id, {...req.body.hospital })
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    hospital.Image.push(...images)
    await hospital.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await hospital.updateOne({ $pull: { Image: { filename: { $in: req.body.deleteImages } } } })
    }

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
    const geodata = await geocoder.forwardGeocode({
        query: hospital.City,
        limit: 1
    }).send()
    hospital.geometry = geodata.body.features[0].geometry


    if (!hospital) {
        req.flash('error', 'Hospital does not exists')
        return res.redirect('/hospitals')

    }

    res.render('show.ejs', { hospital });
}