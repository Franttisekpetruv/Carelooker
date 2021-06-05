const Joi = require('joi')

module.exports.hospitalSchema = Joi.object({
    hospital: Joi.object({
        Name: Joi.number().required(),
        City: Joi.string().required(),
        Image: Joi.string(),
    }).required()
})
//
// module.exports.reviewSchema = Joi.object({

//     reveiew: Joi.object({
//         Title: Joi.string(),
//         User: Joi.string(),
//         Rating: Joi.number() ,
//         Body: Joi.string(),
//         Tags: Joi.string(),
//         Date: Joi.string()


//     }).required()


// })