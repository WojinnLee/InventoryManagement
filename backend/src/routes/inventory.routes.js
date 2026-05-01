const express = require("express");

const { getInventory } = require("../controllers/inventory-controller");

const router = express.Router();

router.get("/", getInventory);

module.exports = router;
