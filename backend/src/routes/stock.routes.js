/**
 * LEGACY ALIAS — kept for backward compatibility only.
 * Primary routes are now under /api/stock-logs (see stock-logs.routes.js).
 * Remove this file once frontend migrates to the new routes.
 */
const express = require("express");

const { stockIn, stockOut } = require("../controllers/stock-logs-controller");

const router = express.Router();

router.post("/import", stockIn);
router.post("/export", stockOut);

module.exports = router;
