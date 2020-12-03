const joi = require('joi');

const moveAccount = joi.object({
    userId: joi.number().required(),
    value: joi.string().required(),
    description: joi.string().min(3).required(),
    entry: joi.boolean.required()
});

module.exports = {
    moveAccount
};