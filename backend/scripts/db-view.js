require("dotenv").config();

const prisma = require("../src/lib/prisma");

async function main() {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (items.length === 0) {
    console.log("No items found in table Item.");
    return;
  }

  console.table(
    items.map((item) => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
  );
}

main()
  .catch((error) => {
    console.error("Failed to read items from database.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
