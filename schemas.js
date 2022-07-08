const Joi = require("joi");

module.exports.recordsSchema = Joi.object({
    record: Joi.object({
        name: Joi.string().required(),
        disease: Joi.string().required(),
        symptoms: Joi.string().required(),
        treatment: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
});

module.exports.forumSchema = Joi.object({
    forum: Joi.object({
        body: Joi.string().required(),
    }).required(),
});
