# EZ-Inventory

EZ-Inventory là project quản lý kho full-stack gồm frontend quản trị, backend REST API và cơ sở dữ liệu PostgreSQL. Project được xây dựng để thực hành phát triển ứng dụng web kết hợp với quy trình DevOps cơ bản.

![CI](https://github.com/WojinnLee/InventoryManagement/actions/workflows/ci.yml/badge.svg)

## Giới thiệu

Project tập trung vào các chức năng chính:
- quản lý sản phẩm trong kho
- nhập kho và xuất kho
- theo dõi tồn kho hiện tại
- xem lịch sử giao dịch nhập/xuất

Ngoài phần chức năng, project cũng có:
- database chạy local bằng Docker Compose
- migration và seed dữ liệu bằng Prisma
- CI pipeline bằng GitHub Actions

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | React 19, Vite 8, React Router 7, Tailwind CSS 4 |
| Backend | Node.js 20, Express 5 |
| ORM | Prisma 6 |
| Database | PostgreSQL 16 |
| Kiểm thử | Jest, Supertest |
| CI/CD | GitHub Actions |

## Chức năng đã làm

### Frontend
- Dashboard tổng quan tồn kho và giao dịch gần đây
- Quản lý sản phẩm: thêm, sửa, xóa, tìm kiếm, lọc trạng thái
- Nhập kho
- Xuất kho
- Lịch sử giao dịch nhập/xuất
- Giao diện quản trị với sidebar, header và nhiều trang

### Backend
- `GET /api/health`
- CRUD sản phẩm qua `GET/POST/PUT/DELETE /api/items`
- `GET /api/inventory`
- `GET /api/stock-logs`
- `POST /api/stock-logs/in`
- `POST /api/stock-logs/out`
- Seed dữ liệu mẫu để test nhanh

## Cấu trúc project

```text
InventoryManagement/
├── .github/workflows/
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
├── CHANGELOG.md
└── README.md
```

## Yêu cầu môi trường

- Node.js 20+
- npm 10+
- Docker Desktop

## Hướng dẫn chạy project

### 1. Chạy database

```bash
docker compose up -d
```

PostgreSQL chạy ở `localhost:5433`.

### 2. Chạy backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

Backend chạy tại `http://localhost:5050`.

Biến môi trường mẫu:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ez_inventory
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Chạy frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend mặc định chạy tại `http://localhost:5173`.

Biến môi trường mẫu:

```env
VITE_API_URL=http://localhost:5050
```

## Các trang chính của frontend

- `/` — Dashboard
- `/products` — Quản lý sản phẩm
- `/stock-in` — Nhập kho
- `/stock-out` — Xuất kho
- `/transactions` — Lịch sử kho
- `/settings` — Trang placeholder

## Luồng test nhanh

Sau khi chạy backend và frontend, có thể kiểm tra nhanh theo thứ tự:

1. Mở dashboard để kiểm tra hệ thống hoạt động
2. Tạo một sản phẩm mới ở trang `Products`
3. Thực hiện nhập kho ở `Stock In`
4. Thực hiện xuất kho ở `Stock Out`
5. Kiểm tra lịch sử giao dịch ở `Transactions`

## API chính

| Method | Route | Mô tả |
|---|---|---|
| `GET` | `/api/health` | Kiểm tra trạng thái server |
| `GET` | `/api/items` | Lấy danh sách sản phẩm |
| `POST` | `/api/items` | Tạo sản phẩm mới |
| `PUT` | `/api/items/:id` | Cập nhật sản phẩm |
| `DELETE` | `/api/items/:id` | Xóa sản phẩm |
| `GET` | `/api/inventory` | Lấy tồn kho hiện tại |
| `GET` | `/api/stock-logs` | Lấy lịch sử giao dịch |
| `POST` | `/api/stock-logs/in` | Nhập kho |
| `POST` | `/api/stock-logs/out` | Xuất kho |

Chi tiết xem tại `docs/api.md`.

## Tài liệu tham khảo

| File | Nội dung |
|---|---|
| `docs/README.md` | Index toàn bộ tài liệu |
| `docs/frontend/frontend-overview.md` | Tổng quan frontend |
| `docs/frontend/frontend-todo.md` | Danh sách việc cần hoàn thiện frontend |
| `docs/backend/api.md` | Tài liệu API chi tiết |
| `docs/backend/architecture.md` | Kiến trúc backend |
| `docs/devops/git-workflow.md` | Quy ước branch và commit |
| `docs/devops/deployment.md` | Hướng dẫn deploy |
| `docs/qa/test-plan.md` | Test cases và checklist |
| `docs/qa/incidents.md` | Ghi chú sự cố và cách xử lý |
| `docs/project/task-planning.docx` | Phân chia nhiệm vụ (tài liệu gốc) |
| `CHANGELOG.md` | Lịch sử thay đổi |
