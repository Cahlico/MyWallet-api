const joi = require('joi');

const signUp = joi.object({
    email: joi.string().email().required(),
    username: joi.string().alphanum().min(3).max(15).required(),
    password: joi.string().min(3).max(18).required(),
    passwordConfirmation: joi.ref('password')
});

const signIn = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

module.exports = {
    signUp,
    signIn
};