const Joi = require("joi");
const {
  getAllChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
} = require("../handler/chapterHandlers");
const { adminAuthMiddleware } = require("../middleware/authMiddleware");

module.exports = [
  // Get all chapters for a comic
  {
    method: "GET",
    path: "/komik/{komikId}/chapter",
    handler: getAllChapters,
  },

  // Get specific chapter
  {
    method: "GET",
    path: "/komik/{komikId}/chapter/{chapterId}",
    handler: getChapterById,
  },

  // Add chapter to a specific comic
  {
    method: "POST",
    path: "/komik/{komikId}/chapter",
    options: {
      pre: [{ method: adminAuthMiddleware }],
      validate: {
        params: Joi.object({ komikId: Joi.number().integer().required() }),
        payload: Joi.object({
          judul: Joi.string().required(),
          gambar: Joi.array().items(Joi.string().uri()).min(1).required(),
        }),
      },
      handler: createChapter,
    },
  },

  // Update chapter
  {
    method: "PUT",
    path: "/komik/{komikId}/chapter/{chapterId}",
    options: {
      pre: [{ method: adminAuthMiddleware }],
      validate: {
        params: Joi.object({
          komikId: Joi.number().integer().required(),
          chapterId: Joi.number().integer().required(),
        }),
        payload: Joi.object({
          judul: Joi.string().required(),
          gambar: Joi.array().items(Joi.string().uri()).min(1),
        }),
      },
      handler: updateChapter,
    },
  },

  // Delete chapter
  {
    method: "DELETE",
    path: "/komik/{komikId}/chapter/{chapterId}",
    options: {
      pre: [{ method: adminAuthMiddleware }],
      validate: {
        params: Joi.object({
          komikId: Joi.number().integer().required(),
          chapterId: Joi.number().integer().required(),
        }),
      },
      handler: deleteChapter,
    },
  },
];
