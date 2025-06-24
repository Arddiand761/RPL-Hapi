"use strict";

const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const komentarRoutes = require("./routes/komentar");
const komikRoutes = require("./routes/komik");
const authRoutes = require("./routes/auth");
const jwt = require("hapi-auth-jwt2");
const validate = require("./auth/validate"); // <=== ini yang benar

const init = async () => {
  const server = Hapi.server({
    port: 4000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"], // supaya frontend bisa akses API
      },
    },
  });

  // Register plugin
  await server.register([Inert, jwt]);

  // Auth strategy (JWT)
  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET || "supersecret", // ganti dengan secret aslimu
    validate,
    verifyOptions: { algorithms: ["HS256"] },
  });
  server.auth.default("jwt"); // semua route butuh auth kecuali yang di-exclude

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

  // Register API routes
  server.route([...authRoutes]); // misal login/register, boleh tanpa auth
  server.route([...komikRoutes]);

  server.route([...komentarRoutes]);

  // Start server
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
