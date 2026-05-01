const express = require("express");

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/items-controller");

const router = express.Router();

router.get("/", getItems);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
