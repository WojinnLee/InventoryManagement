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
- Dockerfile riêng cho backend và frontend
- tài liệu API, kiến trúc, deployment, QA và git workflow trong thư mục `docs/`

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | React 19, Vite 8, React Router 7, Tailwind CSS 4 |
| Backend | Node.js 20, Express 5 |
| ORM | Prisma 6 |
| Database | PostgreSQL 16 |
| Kiểm thử backend | Jest, Supertest |
| Kiểm thử frontend | Vitest, Testing Library |
| Container | Docker, Docker Compose, Nginx cho frontend production |
| CI/CD | GitHub Actions, Render deployment |

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
- Alias cũ `POST /api/stock/import` và `POST /api/stock/export` để tương thích tạm thời
- Validate input và chuẩn hóa SKU về uppercase
- Xử lý lỗi tập trung qua middleware
- Chống xuất kho âm bằng cập nhật tồn kho dạng atomic trong transaction
- Seed dữ liệu mẫu để test nhanh

## Trạng thái hệ thống hiện tại

| Phần | Trạng thái |
|---|---|
| Frontend | Đã có layout quản trị, dashboard, sản phẩm, nhập kho, xuất kho, lịch sử giao dịch và placeholder settings |
| Backend | Đã có REST API cho item, inventory, stock logs, health check và alias legacy |
| Database | PostgreSQL với 2 model chính: `Item` và `StockLog` |
| Local Docker | `docker-compose.yml` chạy PostgreSQL, backend và frontend |
| CI | Tách 2 job backend/frontend: install, lint, test, build/smoke check |
| Test hiện có | Backend health test; frontend sanity test |

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

### Cấu trúc backend chính

```text
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── scripts/
│   ├── seed.js
│   └── db-view.js
├── src/
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   ├── lib/
│   └── utils/
└── tests/
```

### Cấu trúc frontend chính

```text
frontend/
├── public/
├── src/
│   ├── components/layout/
│   ├── pages/
│   ├── services/api.js
│   ├── App.jsx
│   └── main.jsx
├── Dockerfile
├── nginx.conf
└── vite.config.js
```

## Yêu cầu môi trường

- Node.js 20+
- npm 10+
- Docker Desktop

## Hướng dẫn chạy project

### Cách 1: Chạy toàn bộ bằng Docker Compose

```bash
docker compose up --build
```

Sau khi các container chạy xong:

| Service | URL local |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:5050` |
| PostgreSQL | `localhost:5433` |

Docker Compose sẽ:
- chạy PostgreSQL 16 với database `ez_inventory`
- build backend từ `backend/Dockerfile`
- chạy `prisma migrate deploy` trước khi start backend
- build frontend bằng Vite và serve static file qua Nginx

### Cách 2: Chạy local từng phần

#### 1. Chạy database

```bash
docker compose up -d postgres
```

PostgreSQL chạy ở `localhost:5433`.

> Nếu chỉ muốn chạy database bằng Docker khi dev local, có thể để backend/frontend chạy trực tiếp bằng `npm run dev`.

#### 2. Chạy backend

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
PORT=5050
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ez_inventory
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

#### 3. Chạy frontend

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

## Script thường dùng

### Backend

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy backend bằng Nodemon |
| `npm start` | Chạy backend production/local bằng Node |
| `npm run lint` | Kiểm tra ESLint cho `src/` |
| `npm run lint:fix` | Tự sửa lỗi ESLint có thể sửa |
| `npm test` | Chạy Jest/Supertest |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Chạy migration dev |
| `npm run prisma:deploy` | Apply migration production |
| `npm run prisma:reset` | Reset database dev |
| `npm run db:seed` | Seed dữ liệu mẫu |
| `npm run db:view` | Xem nhanh dữ liệu DB |

### Frontend

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy Vite dev server |
| `npm run build` | Build production |
| `npm run preview` | Preview bản build |
| `npm run lint` | Kiểm tra ESLint |
| `npm test` | Chạy Vitest |

## Các trang chính của frontend

- `/` — Dashboard
- `/products` — Quản lý sản phẩm
- `/stock-in` — Nhập kho
- `/stock-out` — Xuất kho
- `/transactions` — Lịch sử kho
- `/settings` — Trang placeholder

## Mô hình dữ liệu hiện tại

### `Item`

| Field | Ghi chú |
|---|---|
| `id` | Khóa chính, tự tăng |
| `name` | Tên sản phẩm |
| `sku` | Mã SKU, unique, backend chuẩn hóa uppercase |
| `description` | Mô tả, có thể null |
| `quantity` | Tồn kho hiện tại, mặc định `0` |
| `unit` | Đơn vị tính |
| `status` | `active` hoặc `inactive` |
| `createdAt`, `updatedAt` | Thời gian tạo/cập nhật |

### `StockLog`

| Field | Ghi chú |
|---|---|
| `id` | Khóa chính, tự tăng |
| `itemId` | Khóa ngoại tới `Item` |
| `type` | `IMPORT` hoặc `EXPORT` |
| `quantity` | Số lượng nhập/xuất |
| `note` | Ghi chú, có thể null |
| `createdAt` | Thời gian tạo log |

Quan hệ: một `Item` có nhiều `StockLog`; khi xóa item, stock log liên quan bị xóa theo cascade.

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
| `POST` | `/api/stock/import` | Alias cũ cho nhập kho |
| `POST` | `/api/stock/export` | Alias cũ cho xuất kho |

Format response chung:

```json
{ "ok": true, "data": {} }
```

Khi lỗi:

```json
{ "ok": false, "message": "Mô tả lỗi" }
```

Chi tiết xem tại `docs/backend/api.md`.

## CI/CD và deployment

GitHub Actions hiện chạy khi push lên `main`, `dev`, `feature/**` và khi mở pull request vào `main` hoặc `dev`.

Pipeline gồm:
- Backend CI: `npm ci`, `npm run lint`, `npm test`, smoke check load Express app
- Frontend CI: `npm ci`, `npm run lint`, `npm test`, `npm run build`

Deployment production được mô tả trong `docs/devops/deployment.md`:
- Frontend: Render Static Site
- Backend: Render Web Service
- Database: Render PostgreSQL

## Lưu ý vận hành

- Không commit file `.env`; chỉ commit `.env.example`.
- Local database dùng port host `5433` để tránh đụng PostgreSQL local ở `5432`.
- Backend local dùng `PORT=5050`; trong Docker container backend lắng nghe `5000` và được map ra `localhost:5050`.
- Frontend tự thêm prefix `/api` nếu `VITE_API_URL` chưa kết thúc bằng `/api`.
- API chính hiện tại là `/api/stock-logs/*`; `/api/stock/*` chỉ là alias tạm để tránh gãy tích hợp cũ.

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
