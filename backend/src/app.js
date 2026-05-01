const express = require("express");
const cors = require("cors");

const { errorHandler, notFoundHandler } = require("./middlewares/error-handler");
const requestLogger = require("./middlewares/request-logger");

const itemsRoutes = require("./routes/items.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const stockLogsRoutes = require("./routes/stock-logs.routes");

// Legacy alias kept temporarily so existing integrations don't break
const stockRoutes = require("./routes/stock.routes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);
app.use(requestLogger);
app.use(express.json());

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// ── Primary routes ────────────────────────────────────────────────────────────
app.use("/api/items", itemsRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/stock-logs", stockLogsRoutes);

// ── Legacy alias (kept for backward compat, remove after FE migration) ─────────
app.use("/api/stock", stockRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
