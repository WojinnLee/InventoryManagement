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
router.put("/", updateItem); // Support ID in body
router.put("/:id", updateItem); // Support ID in params
router.delete("/:id", deleteItem); // DELETE /api/items/123
router.delete("/", deleteItem); // Support ID in body (optional)

module.exports = router;
