# EZ-Inventory

Hệ thống quản lý kho hàng đơn giản — Backend REST API (Node.js + Express + PostgreSQL) với CI/CD tự động qua GitHub Actions.

![CI](https://github.com/WojinnLee/InventoryManagement/actions/workflows/ci.yml/badge.svg)

---

## Tech Stack

| Tầng | Công nghệ |
|------|-----------|
| Backend API | Node.js 20 + Express 5 |
| ORM | Prisma 6 |
| Database | PostgreSQL 16 (Docker) |
| Lint | ESLint 9 (flat config) |
| Test | Jest + Supertest |
| CI/CD | GitHub Actions |

---

## Cấu trúc dự án

```
InventoryManagement/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI pipeline
├── backend/                # REST API (Express + Prisma + PostgreSQL)
│   ├── eslint.config.js    # ESLint config
│   ├── tests/              # Jest test suite
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── middlewares/
│       └── lib/
├── frontend/               # Giao diện (đang phát triển)
├── docs/                   # Tài liệu dự án
│   ├── api.md
│   ├── architecture.md
│   ├── git-workflow.md
│   ├── deployment.md
│   └── incidents.md
├── docker-compose.yml      # PostgreSQL container
├── CHANGELOG.md
└── README.md
```

---

## Chạy Backend Local

### Bước 1 — Khởi động database bằng Docker

```bash
docker compose up -d
```

> Container postgres chạy ở port `5433` (để tránh xung đột với postgres local nếu có).

### Bước 2 — Cài đặt dependencies

```bash
cd backend
npm install
```

### Bước 3 — Cấu hình môi trường

Copy file `.env.example` thành `.env`:

```bash
cp backend/.env.example backend/.env
```

Nội dung `.env` mặc định:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/ez_inventory"
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Bước 4 — Chạy migration (tạo bảng trong DB)

```bash
cd backend
npm run prisma:migrate
```

### Bước 5 — Seed dữ liệu demo

```bash
cd backend
npm run db:seed
```

Seed sẽ tạo **5 sản phẩm mẫu** và **12 log nhập/xuất kho**.  
⚠️ **Lưu ý:** seed xóa toàn bộ data cũ trước khi chạy.

### Bước 6 — Khởi động server

```bash
cd backend
npm run dev
```

Server chạy tại `http://localhost:5000`.

---

## Scripts Backend

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy dev server với nodemon (auto-restart) |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra lỗi ESLint |
| `npm run lint:fix` | Tự động sửa lỗi ESLint |
| `npm test` | Chạy Jest test suite |
| `npm run db:seed` | Seed dữ liệu demo vào database |
| `npm run db:view` | Xem nhanh danh sách items trong DB |
| `npm run prisma:migrate` | Chạy migration (tạo/cập nhật bảng) |
| `npm run prisma:generate` | Regenerate Prisma Client |
| `npm run prisma:reset` | Reset toàn bộ database và chạy lại migration |

---

## API Endpoints

| Method | Route | Mô tả |
|--------|-------|-------|
| `GET` | `/api/health` | Kiểm tra server |
| `GET` | `/api/items` | Danh sách sản phẩm |
| `POST` | `/api/items` | Tạo sản phẩm mới |
| `PUT` | `/api/items/:id` | Cập nhật sản phẩm |
| `DELETE` | `/api/items/:id` | Xóa sản phẩm |
| `GET` | `/api/inventory` | Tồn kho hiện tại |
| `GET` | `/api/stock-logs` | Lịch sử giao dịch kho |
| `POST` | `/api/stock-logs/in` | Nhập kho |
| `POST` | `/api/stock-logs/out` | Xuất kho |

Xem chi tiết request/response tại [`docs/api.md`](docs/api.md).

---

## Test nhanh bằng curl

```bash
# Health check
curl http://localhost:5000/api/health

# Danh sách sản phẩm
curl http://localhost:5000/api/items

# Tồn kho hiện tại
curl http://localhost:5000/api/inventory

# Lịch sử giao dịch
curl http://localhost:5000/api/stock-logs

# Tạo sản phẩm mới
curl -X POST http://localhost:5000/api/items -H "Content-Type: application/json" -d '{"name":"Test Item","sku":"TEST-001","unit":"cai","quantity":10}'

# Nhập kho
curl -X POST http://localhost:5000/api/stock-logs/in -H "Content-Type: application/json" -d '{"itemId":1,"quantity":50,"note":"Nhap hang dot 1"}'

# Xuất kho
curl -X POST http://localhost:5000/api/stock-logs/out -H "Content-Type: application/json" -d '{"itemId":1,"quantity":10,"note":"Xuat cho phong Hanh Chinh"}'
```

---

## CI/CD

Pipeline GitHub Actions chạy tự động khi:
- Push lên `main`, `dev`, `feature/**`
- Tạo Pull Request vào `main` hoặc `dev`

**Các bước pipeline:**

```
install → lint → test → build check
```

Xem chi tiết tại [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

---

## Quy tắc Git

Xem hướng dẫn branch, commit convention và quy trình Pull Request tại [`docs/git-workflow.md`](docs/git-workflow.md).

---

## Tài liệu

| File | Nội dung |
|------|---------|
| [`docs/api.md`](docs/api.md) | Chi tiết tất cả API endpoints |
| [`docs/architecture.md`](docs/architecture.md) | Kiến trúc hệ thống, database schema |
| [`docs/git-workflow.md`](docs/git-workflow.md) | Quy tắc branch và commit |
| [`docs/deployment.md`](docs/deployment.md) | Hướng dẫn deploy |
| [`docs/incidents.md`](docs/incidents.md) | Danh sách incident và cách xử lý |
| [`CHANGELOG.md`](CHANGELOG.md) | Lịch sử thay đổi |