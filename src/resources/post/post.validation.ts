import Joi from 'joi';
import { join } from 'path';

const create = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required()
});

// const update = Joi.object({
//     title:Joi.string().required(),
//     body:Joi.string().required()
// })

export default { create };