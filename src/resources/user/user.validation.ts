import Joi from 'joi';

/**
 * Register
 */
const register = Joi.object({
    name: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

/**
 * Login
 */
const login = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

export default { register, login }