const Joi = require("joi");
const { registerHandler, loginHandler } = require("../handler/authHandlers");

module.exports = [
  {
    method: "POST",
    path: "/register",
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          email: Joi.string().email().required(), // tambahkan validasi email
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
      auth: false,
      validate: {
        payload: Joi.object({
          username: Joi.string().optional(),
          email: Joi.string().email().optional(),
          password: Joi.string().required(),
        }).or("username", "email"), // minimal salah satu harus ada
      },
      handler: loginHandler,
    },
  },
];
