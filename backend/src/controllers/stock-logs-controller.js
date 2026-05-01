// Prisma client instance is used via prisma (lib/prisma), not the Prisma namespace

const AppError = require("../utils/app-error");
const prisma = require("../lib/prisma");
const { parsePositiveInt } = require("../utils/parse-validate");

// Shared select for item info inside a log entry
const ITEM_SELECT = {
  id: true,
  name: true,
  sku: true,
  unit: true,
};

function normalizeNote(value) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") throw new AppError(400, "Note must be a string");
  return value.trim() || null;
}

// ─── GET /api/stock-logs ──────────────────────────────────────────────────────

async function getStockLogs(req, res) {
  const logs = await prisma.stockLog.findMany({
    include: {
      item: { select: ITEM_SELECT },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ ok: true, data: logs });
}

// ─── POST /api/stock-logs/in (nhập kho) ───────────────────────────────────────

async function stockIn(req, res) {
  const itemId = parsePositiveInt(req.body.itemId, "Item id");
  const quantity = parsePositiveInt(req.body.quantity, "Quantity");
  const note = normalizeNote(req.body.note);

  const result = await prisma.$transaction(async (tx) => {
    // Verify item exists
    const item = await tx.item.findUnique({ where: { id: itemId } });
    if (!item) throw new AppError(404, "Item not found");

    // Atomic increment
    const updatedItem = await tx.item.update({
      where: { id: itemId },
      data: { quantity: { increment: quantity } },
    });

    const stockLog = await tx.stockLog.create({
      data: { itemId, type: "IMPORT", quantity, note },
      include: { item: { select: ITEM_SELECT } },
    });

    return { item: updatedItem, stockLog };
  });

  res.status(200).json({
    ok: true,
    message: "Stock imported successfully",
    data: result,
  });
}

// ─── POST /api/stock-logs/out (xuất kho) ──────────────────────────────────────
// Fix race condition: atomic conditional update thay vì đọc-kiểm-ghi riêng lẻ.

async function stockOut(req, res) {
  const itemId = parsePositiveInt(req.body.itemId, "Item id");
  const quantity = parsePositiveInt(req.body.quantity, "Quantity");
  const note = normalizeNote(req.body.note);

  const result = await prisma.$transaction(async (tx) => {
    // Atomic decrement — chỉ cập nhật nếu quantity hiện tại đủ
    // Dùng updateMany với điều kiện WHERE quantity >= requested.
    // Nếu 0 row bị ảnh hưởng → tồn kho không đủ.
    const updated = await tx.$executeRaw`
      UPDATE "Item"
      SET    "quantity"  = "quantity" - ${quantity},
             "updatedAt" = NOW()
      WHERE  "id"        = ${itemId}
        AND  "quantity" >= ${quantity}
    `;

    if (updated === 0) {
      // Kiểm tra xem item có tồn tại không để trả lỗi đúng
      const item = await tx.item.findUnique({ where: { id: itemId } });
      if (!item) throw new AppError(404, "Item not found");
      throw new AppError(400, "Insufficient stock");
    }

    // Lấy item đã cập nhật
    const updatedItem = await tx.item.findUnique({ where: { id: itemId } });

    const stockLog = await tx.stockLog.create({
      data: { itemId, type: "EXPORT", quantity, note },
      include: { item: { select: ITEM_SELECT } },
    });

    return { item: updatedItem, stockLog };
  });

  res.status(200).json({
    ok: true,
    message: "Stock exported successfully",
    data: result,
  });
}

module.exports = { getStockLogs, stockIn, stockOut };
