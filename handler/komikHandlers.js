const pool = require("../database/db");

// Tambah komik
const addKomikHandler = async (request, h) => {
  const { title, status, genre, deskripsi, thumbnail, gambar } =
    request.payload;
  const result = await pool.query(
    `INSERT INTO komik (title, status, genre, deskripsi, thumbnail, gambar)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, status, genre, deskripsi, thumbnail, gambar]
  );
  return h.response(result.rows[0]).code(201);
};

// Edit komik
const editKomikHandler = async (request, h) => {
  const { id } = request.params;
  const { title, status, genre, deskripsi, thumbnail, gambar } =
    request.payload;
  const result = await pool.query(
    `UPDATE komik SET title=$1, status=$2, genre=$3, deskripsi=$4, thumbnail=$5, gambar=$6 WHERE id=$7 RETURNING *`,
    [title, status, genre, deskripsi, thumbnail, gambar, id]
  );
  if (result.rows.length === 0) {
    return h.response({ message: "Komik tidak ditemukan" }).code(404);
  }
  return h.response(result.rows[0]);
};

// Melihat semua komik
const getAllKomikHandler = async (request, h) => {
  const result = await pool.query("SELECT * FROM komik");
  return h.response(result.rows);
};

// Melihat satu komik dengan chapters
const getKomikByIdHandler = async (request, h) => {
  const { id } = request.params;

  // Get komik data
  const komikResult = await pool.query("SELECT * FROM komik WHERE id = $1", [
    id,
  ]);
  if (komikResult.rows.length === 0) {
    return h.response({ message: "Komik tidak ditemukan" }).code(404);
  }

  // Get chapters for this komik
  const chapterResult = await pool.query(
    "SELECT * FROM chapter WHERE komik_id = $1 ORDER BY id ASC",
    [id]
  );

  const komik = komikResult.rows[0];
  komik.chapters = chapterResult.rows;

  return h.response(komik);
};

// Hapus komik
const deleteKomikHandler = async (request, h) => {
  const { id } = request.params;
  const result = await pool.query(
    "DELETE FROM komik WHERE id = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0) {
    return h.response({ message: "Komik tidak ditemukan" }).code(404);
  }
  return h.response({ message: "Komik berhasil dihapus" });
};

module.exports = {
  addKomikHandler,
  editKomikHandler,
  getAllKomikHandler,
  getKomikByIdHandler,
  deleteKomikHandler,
};
