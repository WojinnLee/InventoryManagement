const prisma = require("../lib/prisma");
const AppError = require("../utils/app-error");

const VALID_STATUSES = ["active", "inactive"];

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSku(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function parseOptionalQuantity(value) {
  if (value === undefined) {
    return undefined;
  }

  if (!Number.isInteger(value) || value < 0) {
    throw new AppError(400, "Quantity must be a non-negative integer");
  }

  return value;
}

async function getItems(req, res) {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    ok: true,
    data: items,
  });
}

async function createItem(req, res) {
  const name = normalizeString(req.body.name);
  const sku = normalizeSku(req.body.sku);
  const description = req.body.description !== undefined
    ? normalizeString(req.body.description) || null
    : null;
  const quantity = req.body.quantity ?? 0;
  const unit = normalizeString(req.body.unit);
  const status = req.body.status ?? "active";

  if (!name) {
    throw new AppError(400, "Name is required");
  }

  if (!sku) {
    throw new AppError(400, "SKU is required");
  }

  if (!unit) {
    throw new AppError(400, "Unit is required");
  }

  if (!VALID_STATUSES.includes(status)) {
    throw new AppError(400, `Status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new AppError(400, "Quantity must be a non-negative integer");
  }

  const existingItem = await prisma.item.findUnique({
    where: { sku },
  });

  if (existingItem) {
    throw new AppError(409, "SKU already exists");
  }

  const item = await prisma.item.create({
    data: {
      name,
      sku,
      description,
      quantity,
      unit,
      status,
    },
  });

  res.status(201).json({
    ok: true,
    data: item,
  });
}

async function updateItem(req, res) {
  const rawId = req.params.id ?? req.body.id;
  const itemId = Number(rawId);

  if (!Number.isInteger(itemId) || itemId <= 0) {
    throw new AppError(400, "Valid item id is required");
  }

  const name = req.body.name !== undefined ? normalizeString(req.body.name) : undefined;
  const sku = req.body.sku !== undefined ? normalizeSku(req.body.sku) : undefined;
  const description = req.body.description !== undefined
    ? (normalizeString(req.body.description) || null)
    : undefined;
  const quantity = parseOptionalQuantity(req.body.quantity);
  const unit = req.body.unit !== undefined ? normalizeString(req.body.unit) : undefined;
  const status = req.body.status;

  if (name !== undefined && !name) {
    throw new AppError(400, "Name cannot be empty");
  }

  if (sku !== undefined && !sku) {
    throw new AppError(400, "SKU cannot be empty");
  }

  if (unit !== undefined && !unit) {
    throw new AppError(400, "Unit cannot be empty");
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    throw new AppError(400, `Status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const existingItem = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!existingItem) {
    throw new AppError(404, "Item not found");
  }

  if (sku && sku !== existingItem.sku) {
    const duplicateSku = await prisma.item.findUnique({
      where: { sku },
    });

    if (duplicateSku) {
      throw new AppError(409, "SKU already exists");
    }
  }

  const data = {};

  if (name !== undefined) data.name = name;
  if (sku !== undefined) data.sku = sku;
  if (description !== undefined) data.description = description;
  if (quantity !== undefined) data.quantity = quantity;
  if (unit !== undefined) data.unit = unit;
  if (status !== undefined) data.status = status;

  if (Object.keys(data).length === 0) {
    throw new AppError(400, "At least one field must be provided for update");
  }

  const item = await prisma.item.update({
    where: { id: itemId },
    data,
  });

  res.status(200).json({
    ok: true,
    data: item,
  });
}

async function deleteItem(req, res) {
  const rawId = req.params.id ?? req.body.id;
  const itemId = Number(rawId);

  if (!Number.isInteger(itemId) || itemId <= 0) {
    throw new AppError(400, "Valid item id is required");
  }

  const existingItem = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!existingItem) {
    throw new AppError(404, "Item not found");
  }

  await prisma.item.delete({
    where: { id: itemId },
  });

  res.status(200).json({
    ok: true,
    message: "Item deleted successfully",
  });
}

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
