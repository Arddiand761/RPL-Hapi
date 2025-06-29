const pool = require("../database/db");

// List semua chapter untuk komik tertentu
exports.getAllChapters = async (request, h) => {
  const { komikId } = request.params;
  const result = await pool.query(
    "SELECT * FROM chapter WHERE komik_id = $1 ORDER BY id ASC",
    [komikId]
  );
  return h.response(result.rows).code(200);
};

// Detail satu chapter
exports.getChapterById = async (request, h) => {
  const { komikId, chapterId } = request.params;
  const result = await pool.query(
    "SELECT * FROM chapter WHERE komik_id = $1 AND id = $2",
    [komikId, chapterId]
  );
  if (result.rowCount === 0)
    return h.response({ message: "Chapter tidak ditemukan" }).code(404);
  return h.response(result.rows[0]).code(200);
};

// Tambah chapter baru
exports.createChapter = async (request, h) => {
  const { komikId } = request.params;
  const { judul, gambar } = request.payload;
  const result = await pool.query(
    "INSERT INTO chapter (komik_id, judul, gambar) VALUES ($1, $2, $3) RETURNING *",
    [komikId, judul, gambar]
  );
  return h.response(result.rows[0]).code(201);
};

// Edit chapter
exports.updateChapter = async (request, h) => {
  const { komikId, chapterId } = request.params;
  const { judul, gambar } = request.payload;
  const result = await pool.query(
    "UPDATE chapter SET judul = $1, gambar = $2 WHERE komik_id = $3 AND id = $4 RETURNING *",
    [judul, gambar, komikId, chapterId]
  );
  if (result.rowCount === 0)
    return h.response({ message: "Chapter tidak ditemukan" }).code(404);
  return h.response(result.rows[0]).code(200);
};

// Hapus chapter
exports.deleteChapter = async (request, h) => {
  const { komikId, chapterId } = request.params;
  const result = await pool.query(
    "DELETE FROM chapter WHERE komik_id = $1 AND id = $2 RETURNING *",
    [komikId, chapterId]
  );
  if (result.rowCount === 0)
    return h.response({ message: "Chapter tidak ditemukan" }).code(404);
  return h.response({ message: "Chapter berhasil dihapus" }).code(200);
};
