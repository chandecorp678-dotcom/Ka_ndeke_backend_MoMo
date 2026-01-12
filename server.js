require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const users = require("./users"); // your users.js

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({ origin: "*"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

/* ---------------- STATIC ---------------- */
app.use(express.static(path.join(__dirname, "public")));

/* ---------------- HEALTH (ALL VARIANTS) ---------------- */
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/game/health", (req, res) => {
  res.json({ ok: true });
});

/* ---------------- API ROUTES ---------------- */
app.use("/api", users);
app.use("/", users);

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
