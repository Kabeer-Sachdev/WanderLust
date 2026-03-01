const Joi = require("joi");

module.exports.listingschema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.object({
            filename: Joi.string().allow(null, ""),
            url: Joi.string().allow(null, ""),
        }).optional(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        category: Joi.string().required(),
    }).required(),
});
module.exports.reviewschema = Joi.object({
    review: Joi.object({
       rating:Joi.number().required().min(1).max(5),
       comment:Joi.string().required()
    }).required(),
});
