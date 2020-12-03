const joi = require('joi');

const moveAccount = joi.object({
    userId: joi.number().required(),
    value: joi.number().required(),
    description: joi.string().min(3).required(),
    entry: joi.boolean().required()
});

module.exports = {
    moveAccount
};