const Joi = require('joi')

module.exports.hospitalSchema = Joi.object({
    hospital: Joi.object({
        Name: Joi.number().required(),
        City: Joi.string().required(),
        Image: Joi.string(),
    }).required()
})