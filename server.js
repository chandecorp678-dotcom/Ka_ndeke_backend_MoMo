require("dotenv").config();
const express = require("express");
const cors = require("cors");

const users = require("./users");

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- LOGGING ---------- */
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

/* ---------- CONNECTION RESPONSE ---------- */
const CONNECTED = {
  status: "connected",
  connected: true,
  ok: true,
  service: "ka-ndeke-backend"
};

/* ---------- CONNECTION / PROBE ENDPOINTS ---------- */
app.get("/", (req, res) => res.json(CONNECTED));
app.get("/health", (req, res) => res.json(CONNECTED));
app.get("/status", (req, res) => res.json(CONNECTED));
app.get("/ping", (req, res) => res.json(CONNECTED));

app.get("/api", (req, res) => res.json(CONNECTED));
app.get("/api/health", (req, res) => res.json(CONNECTED));
app.get("/api/status", (req, res) => res.json(CONNECTED));

/* ---------- USER ROUTES (ROOT + API) ---------- */
app.use("/", users);
app.use("/api", users);

/* ---------- 404 JSON (NO HTML EVER) ---------- */
app.use((req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    ...CONNECTED
  });
});

/* ---------- START ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Ka Ndeke backend running on port", PORT);
});
