const Joi = require("joi");
const {
  addKomikHandler,
  editKomikHandler,
  getAllKomikHandler,
  getKomikByIdHandler,
  deleteKomikHandler,
} = require("../handler/komikHandlers");
const { adminAuthMiddleware } = require("../middleware/authMiddleware");

module.exports = [
  // Tambah komik (admin)
  {
    method: "POST",
    path: "/komik",
    options: {
      pre: [{ method: adminAuthMiddleware }],
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          status: Joi.string().required(),
          genre: Joi.string().required(),
          deskripsi: Joi.string().required(),
          thumbnail: Joi.string().uri().required(),
          gambar: Joi.array().items(Joi.string().uri()).min(1).required(),
        }),
      },
      handler: addKomikHandler,
    },
  },
  // Edit komik (admin)
  {
    method: "PUT",
    path: "/komik/{id}",
    options: {
      pre: [{ method: adminAuthMiddleware }],
      validate: {
        params: Joi.object({ id: Joi.number().integer().required() }),
        payload: Joi.object({
          title: Joi.string().required(),
          status: Joi.string().required(),
          genre: Joi.string().required(),
          deskripsi: Joi.string().required(),
          thumbnail: Joi.string().uri().required(),
          gambar: Joi.array().items(Joi.string().uri()).min(1).required(),
        }),
      },
      handler: editKomikHandler,
    },
  },
  // Melihat semua komik (admin)
  {
    method: "GET",
    path: "/komik",
    options: {
      pre: [{ method: adminAuthMiddleware }],
      handler: getAllKomikHandler,
    },
  },
  // Melihat satu komik (admin)
  {
    method: "GET",
    path: "/komik/{id}",
    options: {
      pre: [{ method: adminAuthMiddleware }],
      validate: {
        params: Joi.object({ id: Joi.number().integer().required() }),
      },
      handler: getKomikByIdHandler,
    },
  },
  // Hapus komik (admin)
  {
    method: "DELETE",
    path: "/komik/{id}",
    options: {
      pre: [{ method: adminAuthMiddleware }],
      validate: {
        params: Joi.object({ id: Joi.number().integer().required() }),
      },
      handler: deleteKomikHandler,
    },
  },
];
