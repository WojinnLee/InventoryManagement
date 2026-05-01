# EZ-Inventory

Hệ thống quản lý kho hàng đơn giản, gồm backend REST API và frontend (đang phát triển).

---

## Yêu cầu

- **Node.js** 20+
- **PostgreSQL** 15+
- **npm** 9+

---

## Cấu trúc dự án

```
InventoryManagement/
├── backend/    # REST API (Express + Prisma + PostgreSQL)
├── frontend/   # Giao diện (đang phát triển)
└── docs/       # Tài liệu dự án
```

---

## Chạy Backend Local

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình môi trường

Copy file `.env.example` thành `.env` và điền đúng thông tin:

```bash
cp .env.example .env
```

Nội dung `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ez_inventory"
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. Chạy migration (tạo bảng trong DB)

```bash
cd backend
npm run prisma:migrate
```

> Lần đầu chạy, Prisma sẽ hỏi tên migration. Đặt tên ví dụ: `init`

### 4. Seed dữ liệu demo

```bash
cd backend
npm run db:seed
```

Seed sẽ tạo 5 sản phẩm mẫu và các log nhập/xuất kho. **Lưu ý: seed sẽ xóa toàn bộ data cũ trước khi chạy.**

### 5. Khởi động server

```bash
cd backend
npm run dev
```

Server chạy tại `http://localhost:5000`.

---

## Scripts Backend

| Script                  | Mô tả                                         |
|-------------------------|-----------------------------------------------|
| `npm run dev`           | Chạy dev server với nodemon (auto-restart)    |
| `npm run start`         | Chạy production server                        |
| `npm run db:seed`       | Seed dữ liệu demo vào database                |
| `npm run db:view`       | Xem nhanh danh sách items trong DB            |
| `npm run prisma:migrate`| Chạy migration (tạo/cập nhật bảng)           |
| `npm run prisma:generate` | Regenerate Prisma Client                   |
| `npm run prisma:reset`  | Reset toàn bộ database và chạy lại migration |

---

## API Endpoints

| Method | Route                    | Mô tả                          |
|--------|--------------------------|--------------------------------|
| GET    | `/api/health`            | Kiểm tra server                |
| GET    | `/api/items`             | Danh sách sản phẩm             |
| POST   | `/api/items`             | Tạo sản phẩm mới               |
| PUT    | `/api/items/:id`         | Cập nhật sản phẩm              |
| DELETE | `/api/items/:id`         | Xóa sản phẩm                   |
| GET    | `/api/inventory`         | Tồn kho hiện tại               |
| GET    | `/api/stock-logs`        | Lịch sử giao dịch kho          |
| POST   | `/api/stock-logs/in`     | Nhập kho                       |
| POST   | `/api/stock-logs/out`    | Xuất kho                       |

Xem chi tiết tại [`docs/api.md`](docs/api.md).

---

## Test nhanh bằng curl

```bash
# Health check
curl http://localhost:5000/api/health

# Danh sách sản phẩm
curl http://localhost:5000/api/items

# Tồn kho
curl http://localhost:5000/api/inventory

# Lịch sử giao dịch
curl http://localhost:5000/api/stock-logs

# Tạo sản phẩm mới
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","sku":"TEST-001","unit":"cái","quantity":10}'

# Nhập kho
curl -X POST http://localhost:5000/api/stock-logs/in \
  -H "Content-Type: application/json" \
  -d '{"itemId":1,"quantity":50,"note":"Nhập hàng đợt 1"}'

# Xuất kho
curl -X POST http://localhost:5000/api/stock-logs/out \
  -H "Content-Type: application/json" \
  -d '{"itemId":1,"quantity":10,"note":"Xuất cho phòng Hành Chính"}'
```

---

## Kiến trúc

Xem chi tiết tại [`docs/architecture.md`](docs/architecture.md).