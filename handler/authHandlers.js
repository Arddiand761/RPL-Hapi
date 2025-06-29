const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/db");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// Handler untuk register admin/user
const registerHandler = async (request, h) => {
  const {
    username,
    email, // tambahkan email
    password,
    confirm_password,
    is_admin = false,
  } = request.payload;

  // Konfirmasi password
  if (password !== confirm_password) {
    return h
      .response({ message: "Password dan konfirmasi password tidak sama" })
      .code(400);
  }

  // Cek apakah username atau email sudah terdaftar
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE username = $1 OR email = $2",
    [username, email]
  );
  if (rows.length > 0) {
    return h
      .response({ message: "Username atau email sudah terdaftar" })
      .code(400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user baru
  const result = await pool.query(
    "INSERT INTO users (username, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, username, email, is_admin",
    [username, email, hashedPassword, is_admin]
  );

  return h
    .response({
      id: result.rows[0].id,
      username: result.rows[0].username,
      email: result.rows[0].email,
      is_admin: result.rows[0].is_admin,
    })
    .code(201);
};

// Handler untuk login (tidak berubah)
const loginHandler = async (request, h) => {
  const { username, email, password } = request.payload;

  // Cari user berdasarkan username atau email
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE username = $1 OR email = $2",
    [username || "", email || ""]
  );
  if (rows.length === 0) {
    return h.response({ message: "User tidak ditemukan" }).code(404);
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return h.response({ message: "Password salah" }).code(401);
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username, is_admin: user.is_admin },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  // Sertakan is_admin di response
  return h.response({
    access_token: token,
    is_admin: user.is_admin,
    username: user.username,
    email: user.email,
  });
};

module.exports = {
  registerHandler,
  loginHandler,
};
