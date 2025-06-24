const pool = require("../database/db");

// Tambah komentar ke komik
exports.tambahKomentarKomik = async (request, h) => {
  const { komikId } = request.params;
  const { isi } = request.payload;
  const { user_id, username } = request.auth.credentials;

  if (!isi) {
    return h.response({ message: "Isi komentar wajib diisi." }).code(400);
  }

  const result = await pool.query(
    `INSERT INTO komentar (komik_id, user_id, username, isi)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [komikId, user_id, username, isi],
  );

  return h
    .response({
      message: "Komentar berhasil ditambahkan",
      komentar: result.rows[0],
    })
    .code(201);
};

// Tambah komentar ke chapter
exports.tambahKomentarChapter = async (request, h) => {
  const { komikId, chapterId } = request.params;
  const { isi } = request.payload;
  const { user_id, username } = request.auth.credentials;

  if (!isi) {
    return h.response({ message: "Isi komentar wajib diisi." }).code(400);
  }

  const result = await pool.query(
    `INSERT INTO komentar (komik_id, chapter_id, user_id, username, isi)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [komikId, chapterId, user_id, username, isi],
  );

  return h
    .response({
      message: "Komentar berhasil ditambahkan",
      komentar: result.rows[0],
    })
    .code(201);
};

// Ambil semua komentar di komik (bukan per chapter)
exports.getKomentarKomik = async (request, h) => {
  const { komikId } = request.params;

  const result = await pool.query(
    `SELECT * FROM komentar WHERE komik_id = $1 AND chapter_id IS NULL ORDER BY created_at ASC`,
    [komikId],
  );

  return h.response(result.rows).code(200);
};

// Ambil semua komentar di chapter
exports.getKomentarChapter = async (request, h) => {
  const { komikId, chapterId } = request.params;

  const result = await pool.query(
    `SELECT * FROM komentar WHERE komik_id = $1 AND chapter_id = $2 ORDER BY created_at ASC`,
    [komikId, chapterId],
  );

  return h.response(result.rows).code(200);
};
