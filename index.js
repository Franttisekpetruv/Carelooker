if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

//! NPM PACKAGES
//require mongoose
const mongoose = require("mongoose");
//get the function for catching errors from catchAsyc.js
const catchAsync = require("./utilities/catchAsync.js");
//Require express
const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utilities/ExpressError");
const passport = require("passport");
const passportLocal = require("passport-local");
const multer = require("multer");
// const dbUrl = process.env.dbURL;
const dbUrl = process.env.dbURL || "mongodb://localhost:27017/hospitals";
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbToken });

//! VARIABLES
//Get all variables and models for mongoose and express
const Variables = require("./models/Variables");
const hospitaldata2 = require("./models/hospitals");
const methodOverride = require("method-override");
const hospital_profile = require("./models/hospitals");
const Joi = require("joi");
const Review = require("./models/review");
//require schemas for te hospital and review
const { hospitalSchema, reviewSchema } = require("./schemas.js");
//require a route for structure froom the routes file
const show = require("./routes/hospitals");
const User = require("./models/user");
const userRouter = require("./routes/users");
const { isLoggedIn } = require("./middleware");
const MongoDBStore = require("connect-mongo")(session);
const secret = process.env.SECRET || "secret";
//! MONGOOSE CONNECTION
//mognoose connection established
mongoose
    .connect(dbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database open");
    })
    .catch(() => {
        console.log("Database error");
        console.log(err);
    });

//! EXPRESS & MIDDLEWARE
// Set the express engine to run EJS (embedded JS)
app.engine("ejs", ejsMate);

//Set static file route for css,js and Images
app.use(express.static(path.join(__dirname, "public")));

//This allows methods DELETE
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("method"));

//Set different directories for the EJS engine and files
app.set("views", "./views");
app.set("view engine", "ejs");

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
});
store.on("error", function(e) {
    console.log("session store erroe", e);
});
const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 100 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));
app.use(passport.initialize());
//This is for persistent sessions
app.use(passport.session());
app.use(flash());
//Use local strategy from model User and method authenticate )STATIC METHOD)
passport.use(new passportLocal(User.authenticate()));
//How to store and unstore from mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//Set the route for /show routes from refactoring
app.use("/", userRouter);
app.use("/show", show);

//Render the main page when accessing /

app.get("/", (req, res) => {
    // res.render('header.ejs', { navbar })
    res.render("header.ejs");
});

//Find all hospitals from hd2 and render them into the template
//In case this does not work log the error
app.get(
    "/hospitals",
    catchAsync(async(req, res, next) => {
        const hospitals = await hospitaldata2.find({});

        res.render("hospitals.ejs", { hospitals });
    })
);

//Render the template
app.get("/new", isLoggedIn, (req, res) => {
    res.render("new.ejs");
});

//Get the id from the requested parameters (If you deconstructed just use req.params)
//Then find it by the id in the mongodv and render in the template
app.get(
    "/edit/:id",
    isLoggedIn,
    catchAsync(async(req, res) => {
        const id = req.params.id;
        const hospital = await hospital_profile.findById(id);
        res.render("edit.ejs", { hospital });
    })
);

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});
//Next for when something goes wrong
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);
});
const port = process.env.PORT || 3003
app.listen(port, () => {
    console.log("listening on {port}");
});

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