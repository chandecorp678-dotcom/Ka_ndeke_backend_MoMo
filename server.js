require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { initDb, pool } = require("./db");
const routes = require("./routes");

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

// ----------------- HEALTH ENDPOINT (UPDATED) -----------------
// This endpoint now explicitly returns "connected" in the same format
// the frontend expects to show the green "connected" indicator.
app.get("/health", (req, res) => {
  res.json({ ok: true, status: "connected" });
});

// ----------------- Start Server -----------------
(async () => {
  try {
    await initDb();        // Test Postgres connection
    app.locals.db = pool; // Attach DB to app

    // Mount API routes
    app.use("/api", routes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("Ka Ndeke backend running on port", PORT);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
