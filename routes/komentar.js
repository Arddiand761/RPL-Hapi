const komentarHandlers = require("../handler/komentarHandlers");

module.exports = [
  // Komentar per komik
  {
    method: "POST",
    path: "/komik/{komikId}/komentar",
    handler: komentarHandlers.tambahKomentarKomik,
    options: { auth: "jwt" }, // jika perlu login
  },
  {
    method: "GET",
    path: "/komik/{komikId}/komentar",
    handler: komentarHandlers.getKomentarKomik,
  },

  // Komentar per chapter
  {
    method: "POST",
    path: "/komik/{komikId}/chapter/{chapterId}/komentar",
    handler: komentarHandlers.tambahKomentarChapter,
    options: { auth: "jwt" }, // jika perlu login
  },
  {
    method: "GET",
    path: "/komik/{komikId}/chapter/{chapterId}/komentar",
    handler: komentarHandlers.getKomentarChapter,
  },
];
