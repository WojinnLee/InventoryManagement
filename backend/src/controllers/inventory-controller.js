const prisma = require("../lib/prisma");

// ─── GET /api/inventory ───────────────────────────────────────────────────────
// Trả về tồn kho hiện tại của tất cả sản phẩm.

async function getInventory(req, res) {
  const inventory = await prisma.item.findMany({
    select: {
      id: true,
      name: true,
      sku: true,
      quantity: true,
      unit: true,
      status: true,
      updatedAt: true,
    },
    orderBy: { name: "asc" },
  });

  res.status(200).json({ ok: true, data: inventory });
}

module.exports = { getInventory };
