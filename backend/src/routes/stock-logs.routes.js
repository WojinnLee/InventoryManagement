const express = require("express");

const {
  getStockLogs,
  stockIn,
  stockOut,
} = require("../controllers/stock-logs-controller");

const router = express.Router();

router.get("/", getStockLogs);
router.post("/in", stockIn);
router.post("/out", stockOut);

module.exports = router;
