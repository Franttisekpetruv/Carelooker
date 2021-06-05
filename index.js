//! NPM PACKAGES
//require mongoose
const mongoose = require('mongoose');
//get the function for catching errors from catchAsyc.js
const catchAsync = require("./utilities/catchAsync.js")
    //Require express
const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utilities/ExpressError')
    //! VARIABLES
    //Get all variables and models for mongoose and express
const Variables = require('./models/Variables')
const hospitaldata2 = require('./models/hospitals')
const methodOverride = require('method-override');
const hospital_profile = require('./models/hospitals');
const Joi = require('joi');
const Review = require('./models/review');
//require schemas for te hospital and review
const { hospitalSchema, reviewSchema } = require('./schemas.js');
//require a route for structure froom the routes file 
const show = require('./routes/hospitals');

//! MONGOOSE CONNECTION
//mognoose connection established
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

//! EXPRESS & MIDDLEWARE
// Set the express engine to run EJS (embedded JS)
app.engine('ejs', ejsMate)

//Set static file route for css,js and Images
app.use(express.static(path.join(__dirname, 'public')))

//This allows methods DELETE 
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('method'))

//Set different directories for the EJS engine and files
app.set('views', './views');
app.set('view engine', 'ejs')

const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 10000,
        maxAge: 10000

    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

//Set the route for /show routes from refactoring
app.use('/show', show)

//! ROUTES
//Render the main page when accessing /


app.get('/', (req, res) => {

    // res.render('header.ejs', { navbar })
    res.render('header.ejs')
})

//Find all hospitals from hd2 and render them into the template
//In case this does not work log the error
app.get('/hospitals', catchAsync(async(req, res, next) => {
    const hospitals = await hospitaldata2.find({})
    res.render('hospitals.ejs', { hospitals })
}))

//Render the template
app.get('/new', (req, res) => {

    res.render('new.ejs');
    ``
})

//Get the id from the requested parameters (If you deconstructed just use req.params)
//Then find it by the id in the mongodv and render in the template
app.get('/edit/:id', catchAsync(async(req, res) => {
    const id = req.params.id
    const hospital = await hospital_profile.findById(id)
    res.render('edit.ejs', { hospital })
}))

app.all('*', (req, res, next) => {
        next(new ExpressError('Page Not Found', 404))
    })
    //Next for when something goes wrong
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).send(message)

})

app.listen(3003, () => {
    console.log('listening');
})

//* CODE WHICH CAN BE USED LATER FOR VALIDATION
// const validateReview = (reapp.use('/show', show)q, res, next) => {

//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 500)

//     } else {
//         next()
//     }
// }

//*This allows us to validate proper input but I am going to fix the data first
// const validateHospital = (req, res, next) => {

//     const { error } = hospitalSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 500)

//     } else {
//         next()
//     }
// }