const Joi = require('joi');

const updateUserSchema = Joi.object({
        firstname: Joi.string()
        .max(20)
        .allow(null,''),

        lastname: Joi.string()
        .max(20)
        .allow(null,''),

        email: Joi.string().email({minDomainSegments: 2, tlds:{allow:['fr','com', 'net']}})
        .allow(null,''),

        datebirth: Joi.string()
        .allow(null,'')
        .max(40),

        image: Joi.any()
        .allow(null,'')
    })
    module.exports = updateUserSchema;

