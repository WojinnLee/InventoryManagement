# Frontend - Tổng quan và Trạng thái

## Công nghệ sử dụng

| Thành phần | Phiên bản |
|---|---|
| React | 19 |
| Vite | 6 |
| React Router | 7 |
| Tailwind CSS | 4 |
| Lucide React | (icons) |

## Cấu trúc thư mục

```text
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   └── layout/
│   │       ├── Header.jsx       ← header với toggle sidebar, trạng thái kết nối API
│   │       ├── Layout.jsx       ← layout wrapper chứa sidebar + content
│   │       └── Sidebar.jsx      ← sidebar navigation
│   ├── pages/
│   │   ├── DashboardPage.jsx    ← trang tổng quan (stat cards, giao dịch gần đây, cảnh báo tồn kho)
│   │   ├── ProductsPage.jsx     ← quản lý sản phẩm CRUD (tìm kiếm, lọc, slide-over form)
│   │   ├── StockInPage.jsx      ← form nhập kho + lịch sử nhập gần đây
│   │   ├── StockOutPage.jsx     ← form xuất kho + lịch sử xuất gần đây
│   │   ├── TransactionsPage.jsx ← lịch sử toàn bộ giao dịch với filter
│   │   └── PlaceholderPage.jsx  ← trang giữ chỗ cho Settings
│   ├── services/
│   │   └── api.js               ← wrapper fetch tất cả API calls
│   ├── App.jsx                  ← routes chính
│   ├── App.css                  ← CSS components (data table, form, modal, toast...)
│   ├── index.css                ← design tokens, base styles, layout
│   └── main.jsx                 ← entry point
├── index.html
├── vite.config.js
├── package.json
└── .env.example
```

## Các trang đã hoàn thành

| Trang | Route | Trạng thái |
|---|---|---|
| Dashboard | `/` | ✅ Hoàn thành |
| Quản lý sản phẩm | `/products` | ✅ Hoàn thành |
| Nhập kho | `/stock-in` | ✅ Hoàn thành |
| Xuất kho | `/stock-out` | ✅ Hoàn thành |
| Lịch sử giao dịch | `/transactions` | ✅ Hoàn thành |
| Settings | `/settings` | ⚠️ Placeholder (chưa có chức năng) |

## Các chức năng API đã kết nối

| API | Phương thức | Trang sử dụng |
|---|---|---|
| `/api/health` | GET | Dashboard |
| `/api/items` | GET | Dashboard, Products, StockIn, StockOut |
| `/api/items` | POST | Products |
| `/api/items/:id` | PUT | Products |
| `/api/items/:id` | DELETE | Products |
| `/api/stock-logs` | GET | Dashboard, StockIn, StockOut, Transactions |
| `/api/stock-logs/in` | POST | StockIn |
| `/api/stock-logs/out` | POST | StockOut |
| `/api/inventory` | GET | (sẵn sàng, chưa dùng trong UI) |

## Biến môi trường

| Biến | Mô tả | Ví dụ |
|---|---|---|
| `VITE_API_URL` | URL của backend API | `http://localhost:5000` |

Xem file `.env.example` để biết giá trị mặc định.

## Cách chạy local

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend chạy tại `http://localhost:5173`.

## Còn thiếu / Cần hoàn thiện

Xem chi tiết tại [frontend-todo.md](./frontend-todo.md).
