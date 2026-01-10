require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { initDb, pool } = require("./db");
const routes = require("./users"); // your users.js file

const app = express();

// ----------------- Middleware -----------------
app.use(cors());
app.use(express.json());

// Basic request logging
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// Serve static frontend (if any)
app.use(express.static(path.join(__dirname, "public")));

// ----------------- HEALTH ENDPOINT -----------------
app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "connected" });
});

// ----------------- Mount all routes under /api -----------------
app.use("/api", routes);

// ----------------- Start Server -----------------
(async () => {
  try {
    await initDb();          // Test Postgres connection
    app.locals.db = pool;    // Attach DB to app

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("Ka Ndeke backend running on port", PORT);
      console.log("Health endpoint: /api/health");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
