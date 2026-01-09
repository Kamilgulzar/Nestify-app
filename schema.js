const Joi = require('joi');

module.exports.ListingSchema = Joi.object({
    Listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    country: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string().uri().allow("", null),
    geometry: Joi.object({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array().items(Joi.number()).required()
    }).required()
  }).required()
});

module.exports.ReviewSchema = Joi.object({
   review: Joi.object({
      rating: Joi.number().min(1).max(5).required(),
      comment: Joi.string().required(),
   }).required()
});

