const Joi = require('joi');

const sendPostSchema = Joi.object({ 
            content: Joi.string()
            .allow(null,'')
            .max(1200),

            image: Joi.any(),

            movie: Joi.any()
})
    module.exports = sendPostSchema;
