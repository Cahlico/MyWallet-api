const joi = require('joi');

const signUp = joi.object({
    email: joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(15).required(),
    password: Joi.string().min(3).max(18).required(),
    passwordConfirmation: Joi.ref('password')
});

const signIn = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = {
    signUp,
    signIn
}; 