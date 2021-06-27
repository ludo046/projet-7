const Joi = require('joi');

const registerSchema = Joi.object({
        firstName: Joi.string()
        .min(2)
        .max(20),

        lastName: Joi.string()
        .min(2)
        .max(20),

        password: Joi.string()
        .min(8)
        .max(16),

        email: Joi.string().email({minDomainSegments: 2, tlds:{allow:['fr','com', 'net']}})
        
    })
    module.exports = registerSchema;

