//require mongoose
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')
    //define a constant of the schema as a new schema which follows the bellow defined 
const Hospitalschema = new Schema({

    Name: {
        type: String
    },
    City: { type: String },
    Image: { type: String },
    StaffedBeds: { type: String },
    TotalDischarges: { type: String },
    GrossPatientRevenue: { type: String },
    PatientDays: { type: String },
    Reviews: [{
        //Specify that the type of this is object ID and reference the model which it comes from
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    Owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})
Hospitalschema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.Reviews
            }
        })
    }

})

//create a Product which follows the model product schema and name it the same
const hospital_profile = mongoose.model('hospitaldata2', Hospitalschema);

//export the Product so other files can access the schema 
module.exports = hospital_profile;