# EZ-Inventory — Backend Architecture

Tài liệu mô tả kiến trúc, luồng dữ liệu và các quyết định thiết kế của phần backend.

---

## 1. Technology Stack

| Layer          | Công nghệ                  | Vai trò                                              |
|----------------|----------------------------|------------------------------------------------------|
| Runtime        | **Node.js 20+**            | JavaScript runtime cho server                        |
| Web Framework  | **Express 5**              | HTTP server, routing, middleware                     |
| ORM            | **Prisma 6**               | Kết nối và truy vấn PostgreSQL, quản lý migration    |
| Database       | **PostgreSQL 15+**         | Lưu trữ dữ liệu sản phẩm và lịch sử giao dịch       |
| Dev server     | **Nodemon**                | Tự động restart khi code thay đổi                   |

---

## 2. Cấu trúc thư mục

```
backend/
├── prisma/
│   ├── schema.prisma          # Định nghĩa models và quan hệ
│   └── migrations/            # Lịch sử migration (auto-generated)
├── scripts/
│   ├── seed.js                # Seed dữ liệu demo
│   └── db-view.js             # Script xem nhanh dữ liệu DB
└── src/
    ├── app.js                 # Khởi tạo Express, mount routes, middleware
    ├── server.js              # Điểm khởi động server (PORT)
    ├── controllers/
    │   ├── items-controller.js        # CRUD sản phẩm
    │   ├── inventory-controller.js    # Snapshot tồn kho
    │   └── stock-logs-controller.js   # Nhập/xuất kho và lịch sử
    ├── routes/
    │   ├── items.routes.js            # /api/items
    │   ├── inventory.routes.js        # /api/inventory
    │   ├── stock-logs.routes.js       # /api/stock-logs
    │   └── stock.routes.js            # /api/stock (legacy alias)
    ├── middlewares/
    │   ├── error-handler.js           # Xử lý lỗi tập trung
    │   └── request-logger.js          # Ghi log mỗi request
    ├── lib/
    │   └── prisma.js                  # Singleton PrismaClient
    └── utils/
        ├── app-error.js               # Custom error class
        └── parse-validate.js          # Shared helpers parse/validate
```

---

## 3. Luồng Request — Response

```
Client (FE / curl / Postman)
    |
    v
Express App (app.js)
    |-- cors middleware
    |-- requestLogger middleware
    |-- express.json() parser
    |
    v
Router (routes/*.routes.js)
    |
    v
Controller (controllers/*.js)
    |-- Validate & parse input (parse-validate.js)
    |-- Business logic
    |-- Prisma queries
    |
    v
PrismaClient (lib/prisma.js)
    |
    v
PostgreSQL Database
    |
    v
Controller --> JSON Response
    |
    v
errorHandler middleware (neu co loi)
    |
    v
Client
```

---

## 4. Database Schema

### Model `Item`

| Column        | Type            | Ghi chú                            |
|---------------|-----------------|------------------------------------|
| `id`          | Int (PK)        | Auto increment                     |
| `name`        | String          | Tên sản phẩm                       |
| `sku`         | String (Unique) | Mã SKU — tự động uppercase         |
| `description` | String?         | Mô tả (nullable)                   |
| `quantity`    | Int             | Tồn kho hiện tại (default: 0)      |
| `unit`        | String          | Đơn vị tính                        |
| `status`      | ItemStatus      | `active` / `inactive`              |
| `createdAt`   | DateTime        | Auto                               |
| `updatedAt`   | DateTime        | Auto update                        |

### Model `StockLog`

| Column      | Type          | Ghi chú                              |
|-------------|---------------|--------------------------------------|
| `id`        | Int (PK)      | Auto increment                       |
| `itemId`    | Int (FK)      | Liên kết đến `Item`                  |
| `type`      | StockLogType  | `IMPORT` (nhập) / `EXPORT` (xuất)   |
| `quantity`  | Int           | Số lượng giao dịch                   |
| `note`      | String?       | Ghi chú (nullable)                   |
| `createdAt` | DateTime      | Auto                                 |

**Quan hệ:** `Item` 1 — N `StockLog` (cascade delete)

---

## 5. Luồng nhập kho (Stock In)

```
POST /api/stock-logs/in
    |
    |-- 1. Parse & validate: itemId (int > 0), quantity (int > 0)
    |
    |-- 2. Mo Prisma $transaction
    |       |-- Tim item theo id -> 404 neu khong ton tai
    |       |-- UPDATE item SET quantity = quantity + N (atomic increment)
    |       `-- INSERT StockLog { type: IMPORT, quantity, note }
    |
    `-- 3. Tra ve item da cap nhat + stockLog
```

---

## 6. Luồng xuất kho (Stock Out) — Race Condition Safe

Lỗi phổ biến: đọc tồn kho → kiểm tra đủ → trừ kho theo 2 bước riêng lẻ.
Nếu 2 request đến gần như đồng thời, cả 2 đều thấy tồn kho đủ và cùng trừ → **tồn kho bị âm**.

**Cách khắc phục:** Dùng raw SQL với điều kiện atomic trong một câu UPDATE duy nhất:

```sql
UPDATE "Item"
SET    "quantity"  = "quantity" - $quantity,
       "updatedAt" = NOW()
WHERE  "id"        = $itemId
  AND  "quantity" >= $quantity
```

Nếu 0 row bị ảnh hưởng (không đủ tồn kho hoặc item không tồn tại) → trả lỗi 400/404 ngay, không ghi log.

---

## 7. Xử lý lỗi

Tất cả lỗi được xử lý qua `errorHandler` middleware:

| Loại lỗi | Cách xử lý |
|----------|------------|
| `AppError` (nghiệp vụ) | Throw trực tiếp trong controller → errorHandler trả JSON |
| Prisma `P2002` (unique) | Bắt trong try/catch → 409 SKU already exists |
| Prisma `P2025` (not found) | Bắt trong try/catch → 404 Item not found |
| Lỗi không xác định | Fallback → 500 Internal Server Error |

---

## 8. Validate Input

Helper dùng chung ở `src/utils/parse-validate.js`:

| Helper | Mô tả |
|--------|-------|
| `parsePositiveInt(v, field)` | Parse và validate số nguyên > 0 |
| `parseNonNegativeInt(v, field)` | Parse và validate số nguyên >= 0 |
| `parseOptionalNonNegativeInt(v, field)` | Như trên nhưng trả `undefined` nếu không có giá trị |

Tất cả đều dùng `Number(value)` nên hỗ trợ cả số và chuỗi số từ form data.
