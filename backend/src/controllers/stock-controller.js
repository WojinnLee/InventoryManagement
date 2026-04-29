const { StockLogType } = require("@prisma/client");

const prisma = require("../lib/prisma");
const AppError = require("../utils/app-error");

function parsePositiveInt(value, fieldName) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new AppError(400, `${fieldName} must be a positive integer`);
  }

  return value;
}

function normalizeNote(value) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new AppError(400, "Note must be a string");
  }

  const trimmed = value.trim();
  return trimmed || null;
}

async function importStock(req, res) {
  const itemId = parsePositiveInt(Number(req.body.itemId), "Item id");
  const quantity = parsePositiveInt(req.body.quantity, "Quantity");
  const note = normalizeNote(req.body.note);

  const result = await prisma.$transaction(async (tx) => {
    const item = await tx.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new AppError(404, "Item not found");
    }

    const updatedItem = await tx.item.update({
      where: { id: itemId },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });

    const stockLog = await tx.stockLog.create({
      data: {
        itemId,
        type: StockLogType.IMPORT,
        quantity,
        note,
      },
    });

    return { item: updatedItem, stockLog };
  });

  res.status(200).json({
    ok: true,
    message: "Stock imported successfully",
    data: result,
  });
}

async function exportStock(req, res) {
  const itemId = parsePositiveInt(Number(req.body.itemId), "Item id");
  const quantity = parsePositiveInt(req.body.quantity, "Quantity");
  const note = normalizeNote(req.body.note);

  const result = await prisma.$transaction(async (tx) => {
    const item = await tx.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new AppError(404, "Item not found");
    }

    if (item.quantity < quantity) {
      throw new AppError(400, "Insufficient stock");
    }

    const updatedItem = await tx.item.update({
      where: { id: itemId },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    const stockLog = await tx.stockLog.create({
      data: {
        itemId,
        type: StockLogType.EXPORT,
        quantity,
        note,
      },
    });

    return { item: updatedItem, stockLog };
  });

  res.status(200).json({
    ok: true,
    message: "Stock exported successfully",
    data: result,
  });
}

module.exports = {
  exportStock,
  importStock,
};
