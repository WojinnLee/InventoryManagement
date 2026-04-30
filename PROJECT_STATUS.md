# Trạng thái Dự án (Project Status)

Dưới đây là danh sách các tính năng và thành phần đã được triển khai trong hệ thống Inventory Management.

## 1. Backend (Node.js + Express + Prisma)

### Cấu trúc cơ bản
- [x] Khởi tạo server với Express.
- [x] Kết nối cơ sở dữ liệu PostgreSQL qua Prisma.
- [x] Hệ thống xử lý lỗi tập trung (Error Handler).
- [x] Middleware ghi log request (Request Logger).
- [x] Cấu hình CORS.

### API Endpoints
- **Items (Sản phẩm)**
    - [x] `GET /api/items`: Liệt kê danh sách sản phẩm (mới nhất lên đầu).
    - [x] `POST /api/items`: Tạo mới sản phẩm (validate SKU, name, unit, status).
    - [x] `PUT /api/items/:id`: Cập nhật thông tin sản phẩm.
    - [x] `DELETE /api/items/:id`: Xóa sản phẩm.
- **Stock (Kho hàng)**
    - [x] `POST /api/stock/import`: Nhập kho (tự động cập nhật số lượng và lưu log).
    - [x] `POST /api/stock/export`: Xuất kho (kiểm tra hàng tồn, cập nhật số lượng và lưu log).
- **Hệ thống**
    - [x] `GET /api/health`: Kiểm tra trạng thái server.

### Cơ sở dữ liệu (Prisma Schema)
- [x] Model `Item`: Quản lý thông tin sản phẩm (tên, mã SKU, mô tả, số lượng, đơn vị tính, trạng thái).
- [x] Model `StockLog`: Quản lý lịch sử nhập/xuất kho.

## 2. Documentation & Tracking
- [x] `docs/api.md`: Tài liệu hướng dẫn sử dụng API (Đã cập nhật các trường mới: description, unit, status).
- [x] `CHANGELOG.md`: Nhật ký thay đổi dự án.
- [x] `README.md`: File giới thiệu tổng quan.

## 3. Frontend
- [ ] Hiện tại chỉ mới có file `.env.example`, chưa có code giao diện.

---

**Câu hỏi về "File list api":**
Bạn có muốn mình triển khai thêm API để liệt kê các file tài liệu/ảnh đính kèm không? (Hiện tại chưa có tính năng upload file). Hay ý bạn là API liệt kê lịch sử nhập xuất (Stock Logs)?
