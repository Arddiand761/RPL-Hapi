"use strict";

const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const komentarRoutes = require("./routes/komentar");
const komikRoutes = require("./routes/komik");
const chapterRoutes = require("./routes/chapter");
const authRoutes = require("./routes/auth");
const jwt = require("hapi-auth-jwt2");
const validate = require("./auth/validate");
const Path = require("path");
const fs = require("fs");
const Vision = require("@hapi/vision");
require("dotenv").config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 4000,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: ["*"], // supaya frontend bisa akses API
      },
    },
  });

  // Register plugin
  await server.register([Inert, Vision, jwt]);

  // Serve static files (misal gambar upload)
  server.route({
    method: "GET",
    path: "/uploads/{param*}",
    handler: {
      directory: {
        path: "public/uploads",
        listing: false,
      },
    },
    options: { auth: false }, // akses gambar tanpa login
  });

  // Upload route
  server.route({
    method: "POST",
    path: "/upload",
    options: {
      auth: false,
      payload: {
        maxBytes: 10 * 1024 * 1024, // 10MB
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
    handler: async (request, h) => {
      console.log(request.payload); // Tambahkan ini
      const { file } = request.payload;
      if (!file) {
        return h.response({ message: "No file uploaded" }).code(400);
      }
      // Sanitize filename - replace spaces and special characters
      const originalFilename = file.hapi.filename;
      const sanitizedFilename = originalFilename.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      );
      const filename = `${Date.now()}-${sanitizedFilename}`;
      const uploadPath = Path.join(__dirname, "public", "uploads", filename);

      // Simpan file ke disk
      const fileStream = fs.createWriteStream(uploadPath);
      await new Promise((resolve, reject) => {
        file.pipe(fileStream);
        file.on("end", resolve);
        file.on("error", reject);
      });

      // Kembalikan URL file
      const url = `${request.server.info.uri}/uploads/${filename}`;
      return { url };
    },
  });

  // Auth strategy (JWT)
  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET || "supersecret", // ganti dengan secret aslimu
    validate,
    verifyOptions: { algorithms: ["HS256"] },
  });
  server.auth.default("jwt"); // semua route butuh auth kecuali yang di-exclude

  // Register API routes
  server.route([...authRoutes]); // misal login/register, boleh tanpa auth
  server.route([...komikRoutes]);
  server.route([...chapterRoutes]);
  server.route([...komentarRoutes]);

  // Add error logging
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;
    if (response.isBoom && response.output.statusCode >= 400) {
      console.log("Error details:", {
        method: request.method,
        path: request.path,
        statusCode: response.output.statusCode,
        error: response.message,
        payload: request.payload,
        auth: request.auth,
      });
    }
    return h.continue;
  });

  // Start server
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
