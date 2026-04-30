const express = require("express");

const {
  exportStock,
  importStock,
  getStockLogs,
} = require("../controllers/stock-controller");

const router = express.Router();

router.get("/logs", getStockLogs);
router.post("/import", importStock);
router.post("/export", exportStock);

module.exports = router;
