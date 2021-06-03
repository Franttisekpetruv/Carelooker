//require mongoose
const mongoose = require('mongoose')
const Schema = mongoose.Schema
    //define a constant of the schema as a new schema which follows the bellow defined 
const reviewSchema = new Schema({

    Title: {
        type: String
    },
    User: { type: String },
    Rating: { type: Number },
    Body: { type: String },
    Tags: { type: String },
    Date: { type: Number }

})

//create a Product which follows the model product schema and name it the same


//export the Product so other files can access the schema 
module.exports = mongoose.model('Review', reviewSchema);