const Boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const adminAuthMiddleware = async (request, h) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw Boom.unauthorized("Token tidak ditemukan");
    }

    const token = authHeader.replace("Bearer ", "");

    // Verifikasi JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Cek apakah user adalah admin
    if (!decoded.is_admin) {
      throw Boom.forbidden("Hanya admin yang boleh melakukan aksi ini");
    }

    // Simpan data user ke request.auth (opsional)
    request.auth = decoded;

    return h.continue;
  } catch (err) {
    // Tangani error JWT atau forbidden
    if (err.isBoom) throw err;
    throw Boom.unauthorized("Token tidak valid atau expired");
  }
};

module.exports = { adminAuthMiddleware };
