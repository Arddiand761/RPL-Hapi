// Validasi JWT untuk Hapi (gampang, cuma cek payload/jwt)
module.exports = async function (decoded, request, h) {
  // biasanya decoded adalah hasil decode JWT, misal { id, username }
  // bisa juga query user ke database jika mau validasi lebih lanjut
  if (!decoded || !decoded.id) {
    return { isValid: false };
  }

  // bisa tambahkan pengecekan lain di sini kalau mau
  return { isValid: true, credentials: decoded };
};
