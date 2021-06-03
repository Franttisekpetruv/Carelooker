const mongoose = require('mongoose');
//get Product from product.js
const catchAsync = require("./views/catchAsync.js")
const express = require('express');
const app = express();
const path = require('path');
const Variables = require('./models/Variables') // This might be wrong
const hospitaldata2 = require('./models/hospitals')
const methodOverride = require('method-override');
const hospital_profile = require('./models/hospitals');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const { hospitalSchema, reviewSchema } = require('./schemas.js');
const Review = require('./models/review.js');

var navbar = ['hospitals', 'home', 'methods', 'about', 'story']



mongoose.connect('mongodb://localhost:27017/hospitals', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database open");
}).catch(() => {
    console.log('Database error');
    console.log(err);
})

app.engine('ejs', ejsMate)

app.use(express.static('public'))
app.use('/public', express.static(__dirname + 'public'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('method'))

app.set('views', './views');
app.set('view engine', 'ejs')

const validateHospital = (req, res, next) => {

    const { error } = hospitalSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 500)

    } else {
        next()
    }
}

// const validateReview = (req, res, next) => {

//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 500)

//     } else {
//         next()
//     }
// }



app.get('/', (req, res) => {
    res.render('header.ejs', { navbar })
})

app.get('/hospitals', async(req, res, next) => {
    try {
        const hospitals = await hospitaldata2.find({})
        res.render('hospitals.ejs', { hospitals })
    } catch (err) {
        next(err)
    }
})

app.get('/show/:id', async(req, res) => {
        const id = req.params.id
        const hospital = await hospitaldata2.findById(id).populate('Reviews')
        console.log(hospital);
        res.render('show.ejs', { hospital });
    })
    //add validatereview
app.post('/show/:id/reviews', async(req, res) => {
    const id = req.params.id
    const hospital = await hospitaldata2.findById(id)
    const review = new Review(req.body.Review)
    hospital.Reviews.push(review)
    await review.save()
    await hospital.save()
    res.redirect(`/show/${hospital._id}`)
})





app.get('/new', (req, res) => {
    res.render('new.ejs');
})

app.post('/show', catchAsync(async(req, res) => {
    const hospital = new hospitaldata2(req.body.hospital)
    await hospital.save();
    res.redirect(`/show/${hospital._id}`)
}))

app.get('/edit/:id', async(req, res) => {
    const id = req.params.id
    const hospital = await hospital_profile.findById(id)
    res.render('edit.ejs', { hospital })
})

app.put('/show/:id', async(req, res) => {
    const { id } = req.params;
    const hospital = await hospital_profile.findByIdAndUpdate(id, {...req.body.hospital })
    res.redirect(`/show/${hospital._id}`)
})

app.delete('/show/:id', async(req, res) => {
    const { id } = req.params; //the only param is the id 
    await hospital_profile.findByIdAndDelete(id);
    res.redirect('/hospitals'); // redirect back to home
})
app.delete('/show/:id/reviews/:reviewId', async(req, res) => {
    const { id, reviewId } = req.params; //the only param is the id 
    await hospital_profile.findByIdAndUpdate(id, { $pull: { Reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/show/${id}`); // redirect back to home
})

app.use((err, req, res, next) => {
    res.send('Wrong stuff')

})
app.listen(3003, () => {
    console.log('listening');
})