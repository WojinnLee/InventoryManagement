const express = require("express");

const {
  exportStock,
  importStock,
} = require("../controllers/stock-controller");

const router = express.Router();

router.post("/import", importStock);
router.post("/export", exportStock);

module.exports = router;
