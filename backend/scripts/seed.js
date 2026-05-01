require("dotenv").config();

const prisma = require("../src/lib/prisma");

const ITEMS = [
  {
    name: "Bút bi Thiên Long",
    sku: "BTL-001",
    description: "Bút bi mực xanh, ngòi 0.5mm",
    quantity: 0,
    unit: "cái",
    status: "active",
  },
  {
    name: "Giấy A4 Double A",
    sku: "A4-DOUBLEA-500",
    description: "Giấy A4 80gsm, 500 tờ/ram",
    quantity: 0,
    unit: "ram",
    status: "active",
  },
  {
    name: "Balo laptop 15.6 inch",
    sku: "BAG-LP-156",
    description: "Balo chống sốc, chống nước, màu đen",
    quantity: 0,
    unit: "cái",
    status: "active",
  },
  {
    name: "Chuột không dây Logitech M185",
    sku: "MSE-LOG-M185",
    description: "Chuột USB nano receiver, pin AA",
    quantity: 0,
    unit: "cái",
    status: "active",
  },
  {
    name: "Stapler B8",
    sku: "STPLR-B8",
    description: "Dập ghim mini, dùng ghim 26/6",
    quantity: 0,
    unit: "cái",
    status: "inactive",
  },
];

// Log entries: [itemSku, type, quantity, note]
const LOG_PLAN = [
  ["BTL-001", "IMPORT", 200, "Nhập hàng đầu tháng 4"],
  ["A4-DOUBLEA-500", "IMPORT", 50, "Nhập kho Q2/2026"],
  ["BAG-LP-156", "IMPORT", 30, "Nhập theo đơn PO-2026-04"],
  ["MSE-LOG-M185", "IMPORT", 60, "Nhập hàng mới"],
  ["STPLR-B8", "IMPORT", 100, "Nhập tồn kho"],
  ["BTL-001", "EXPORT", 45, "Xuất cho phòng Kế Toán"],
  ["A4-DOUBLEA-500", "EXPORT", 12, "Xuất cho phòng Hành Chính"],
  ["BAG-LP-156", "EXPORT", 5, "Xuất cho nhân viên mới"],
  ["MSE-LOG-M185", "EXPORT", 8, "Xuất cho IT Support"],
  ["BTL-001", "IMPORT", 100, "Nhập bổ sung lần 2"],
  ["A4-DOUBLEA-500", "IMPORT", 20, "Nhập thêm do hết hàng"],
  ["BAG-LP-156", "EXPORT", 3, "Xuất thêm đợt 2"],
];

async function main() {
  console.log("🌱 Starting seed...\n");

  // Clear existing data (cascade on StockLog via onDelete: Cascade)
  await prisma.stockLog.deleteMany();
  await prisma.item.deleteMany();
  console.log("✅ Cleared existing data");

  // Create items
  const createdItems = {};
  for (const itemData of ITEMS) {
    const item = await prisma.item.create({ data: itemData });
    createdItems[item.sku] = item;
    console.log(`  + Item created: ${item.sku} — ${item.name}`);
  }

  // Apply log plan: update quantity and create stock logs in order
  console.log("\n📦 Creating stock logs...");
  for (const [sku, type, qty, note] of LOG_PLAN) {
    const item = createdItems[sku];

    if (type === "IMPORT") {
      await prisma.item.update({
        where: { id: item.id },
        data: { quantity: { increment: qty } },
      });
    } else {
      await prisma.item.update({
        where: { id: item.id },
        data: { quantity: { decrement: qty } },
      });
    }

    await prisma.stockLog.create({
      data: { itemId: item.id, type, quantity: qty, note },
    });

    console.log(`  + StockLog: [${type}] ${qty}x ${sku} — "${note}"`);
  }

  // Print final state
  console.log("\n📊 Final inventory:");
  const finalItems = await prisma.item.findMany({ orderBy: { sku: "asc" } });
  console.table(
    finalItems.map((i) => ({
      sku: i.sku,
      name: i.name,
      quantity: i.quantity,
      unit: i.unit,
      status: i.status,
    }))
  );

  console.log("\n✅ Seed completed successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
