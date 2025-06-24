const Joi = require("joi");
const { registerHandler, loginHandler } = require("../handler/authHandlers");

module.exports = [
  {
    method: "POST",
    path: "/register",
    options: {
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().min(6).required(),
          confirm_password: Joi.string().min(6).required(),
          is_admin: Joi.boolean().optional(),
        }),
      },
      handler: registerHandler,
    },
  },
  {
    method: "POST",
    path: "/login",
    options: {
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
      handler: loginHandler,
    },
  },
];
