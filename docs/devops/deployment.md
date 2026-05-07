# Hướng dẫn Deploy & Redeploy — EZ-Inventory

## Tổng quan hệ thống

| Thành phần | Công nghệ | Platform | URL |
|---|---|---|---|
| Frontend | React + Vite | Render Static Site | https://ez-inventory-frontend.onrender.com |
| Backend | Node.js + Express + Prisma | Render Web Service | https://ez-inventory-backend1.onrender.com |
| Database | PostgreSQL 16 | Render PostgreSQL | Internal (không public) |

---

## Kiến trúc Deploy

```
User (Browser)
    │
    ▼
Frontend — Render Static Site
(React + Vite, build ra static files, serve bằng CDN)
    │
    │ HTTPS API calls
    ▼
Backend — Render Web Service
(Node.js + Express + Prisma, chạy trong Docker container)
    │
    │ Internal Network
    ▼
PostgreSQL — Render Database
(ez_inventory_db, chỉ accessible trong Render private network)
```

---

## Biến môi trường

### Backend

| Biến | Giá trị | Mô tả |
|---|---|---|
| `DATABASE_URL` | `postgresql://...@dpg-.../ez_inventory_db` | Internal URL từ Render PostgreSQL |
| `PORT` | `5000` | Port backend lắng nghe |
| `NODE_ENV` | `production` | Môi trường chạy |
| `FRONTEND_URL` | `https://ez-inventory-frontend.onrender.com` | Dùng cho CORS config |

### Frontend

| Biến | Giá trị | Mô tả |
|---|---|---|
| `VITE_API_URL` | `https://ez-inventory-backend1.onrender.com` | URL backend API |

> ⚠️ Không commit file `.env` lên GitHub. Chỉ commit `.env.example`.

---

## Lần đầu Deploy (Setup từ đầu)

### Bước 1 — Tạo PostgreSQL Database

1. Vào [dashboard.render.com](https://dashboard.render.com)
2. Nhấn **New** → **PostgreSQL**
3. Điền thông tin:
   ```
   Name:    ez-inventory-db
   Region:  Singapore
   Plan:    Free
   ```
4. Nhấn **Create Database**
5. Vào tab **Info** → copy **Internal Database URL**

### Bước 2 — Deploy Backend

1. Nhấn **New** → **Web Service**
2. Kết nối GitHub repo → chọn `InventoryManagement`
3. Điền thông tin:
   ```
   Name:         ez-inventory-backend1
   Region:       Singapore
   Branch:       main
   Root Dir:     backend
   Language:     Docker
   Plan:         Free
   ```
4. Thêm Environment Variables:
   ```
   DATABASE_URL  = (Internal URL từ bước 1)
   PORT          = 5000
   NODE_ENV      = production
   FRONTEND_URL  = (điền sau khi có URL frontend)
   ```
5. Nhấn **Create Web Service**
6. Copy URL backend sau khi deploy xong

### Bước 3 — Deploy Frontend

1. Nhấn **New** → **Static Site**
2. Kết nối cùng repo
3. Điền thông tin:
   ```
   Name:         ez-inventory-frontend
   Branch:       main
   Root Dir:     frontend
   Build Cmd:    npm ci && npm run build
   Publish Dir:  dist
   ```
4. Thêm Environment Variables:
   ```
   VITE_API_URL = (URL backend từ bước 2)
   ```
5. Nhấn **Create Static Site**

### Bước 4 — Cập nhật CORS

1. Vào **ez-inventory-backend1** → tab **Environment**
2. Cập nhật:
   ```
   FRONTEND_URL = (URL frontend từ bước 3)
   ```
3. Nhấn **Save** → Render tự redeploy

### Bước 5 — Kiểm tra

```bash
# Test backend health
curl https://ez-inventory-backend1.onrender.com/api/health
# Kết quả mong đợi: {"ok":true}
```

Mở browser → `https://ez-inventory-frontend.onrender.com` → không lỗi API.

---

## Redeploy

### Tự động (khi push code mới)

```bash
# Làm việc trên nhánh feature
git checkout feature/ten-feature
# ... code ...
git add .
git commit -m "feat: mô tả thay đổi"
git push origin feature/ten-feature

# Merge vào main để trigger redeploy
git checkout main
git merge feature/ten-feature
git push origin main
```

Render sẽ **tự động detect** push lên `main` và redeploy cả backend lẫn frontend.

### Thủ công (Manual Deploy)

1. Vào [dashboard.render.com](https://dashboard.render.com)
2. Chọn service cần redeploy (`ez-inventory-backend1` hoặc `ez-inventory-frontend`)
3. Vào tab **Deploys**
4. Nhấn **Manual Deploy** → **Deploy latest commit**
5. Theo dõi log trong tab **Logs**

### Thứ tự redeploy khi thay đổi cả backend lẫn frontend

```
1. Push lên main
2. Render tự build Backend trước (~3-5 phút)
3. Render tự build Frontend (~2-3 phút)
4. Kiểm tra: curl /api/health
5. Kiểm tra: mở browser frontend
```

---

## Kiểm tra sau mỗi lần Deploy

```bash
# 1. Health check backend
curl https://ez-inventory-backend1.onrender.com/api/health

# 2. Mở frontend trên browser
# https://ez-inventory-frontend.onrender.com

# 3. Kiểm tra Console (F12) — không có lỗi đỏ

# 4. Thử thêm 1 sản phẩm → lưu thành công
```

---

## Xem Log khi có lỗi

### Log Backend trên Render

1. Vào **ez-inventory-backend1** → tab **Logs**
2. Tìm dòng màu đỏ để xác định lỗi

### Log Database

1. Vào **ez-inventory-db** → tab **Logs**

### Debug theo layer

| Layer | Lỗi thường gặp | Cách kiểm tra |
|---|---|---|
| L4 Frontend | UI không load, VITE_API_URL sai | DevTools Console |
| L3 Backend | API 500, CORS error | Render Logs tab |
| L2 Database | Table not found, connection failed | `curl /api/health` + Render DB Logs |
| L1 Infrastructure | Container crash, build failed | Render Deploys tab |

---

## Lưu ý Render Free Tier

| Hạn chế | Chi tiết |
|---|---|
| Backend "ngủ" | Sau 15 phút không có request, lần đầu vào sẽ chậm 30-60s |
| Database tồn tại | 90 ngày kể từ ngày tạo |
| Build time | Khoảng 3-5 phút mỗi lần deploy |

---

## Liên hệ

| STT | Vai trò | Thành viên | MSSV | Phụ trách |
|---|---|---|---|---|
| 1 | Infrastructure Engineer | Lê Ngọc Ánh | 2251220067 | Docker, Deploy, file này |
| 2 | DevOps Engineer | Lê Văn Hậu | 2251220053 | CI/CD, GitHub Actions |
| 3 | QA / SRE Engineer | Lê Toàn Trung | 2251220086 | Test, Debug, Incident |
| 4 | Frontend Engineer | Lê Minh Hoài Thương | 2251220283 | UI, VITE config |
| 5 | Backend Engineer | Thái Hữu Long Vũ | 2251220216 | API, Database schema |