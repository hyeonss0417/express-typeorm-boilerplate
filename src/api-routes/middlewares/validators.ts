import { celebrate, Joi } from "celebrate";

export default {
  shortenUrl: celebrate({
    body: Joi.object({
      url: Joi.string().required().uri(),
      accessKey: Joi.string()
        .min(1)
        .max(100)
        .regex(/^[\w-]+$/),
    }),
  }),
  signUp: celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  signIn: celebrate({
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
};
