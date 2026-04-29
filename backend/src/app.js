const express = require("express");
const cors = require("cors");

const { errorHandler, notFoundHandler } = require("./middlewares/error-handler");
const requestLogger = require("./middlewares/request-logger");
const itemsRoutes = require("./routes/items.routes");
const stockRoutes = require("./routes/stock.routes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  }),
);
app.use(requestLogger);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/items", itemsRoutes);
app.use("/api/stock", stockRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
