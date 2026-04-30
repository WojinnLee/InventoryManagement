# EZ-Inventory Backend API

Tài liệu này mô tả các endpoint backend đã triển khai cho phần việc Backend Engineer.

## Base URL

- Local: `http://localhost:5000`
- Prefix API: `/api`

## 1. Health Check

### `GET /api/health`

Kiểm tra backend có chạy hay không.

Response `200`:

```json
{
  "ok": true
}
```

Ví dụ:

```bash
curl http://localhost:5000/api/health
```

## 2. Items API

### `GET /api/items`

Lấy danh sách sản phẩm.

Response `200`:

```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "name": "Bút bi Thiên Long",
      "sku": "BTL-001",
      "description": "Bút bi mực xanh",
      "quantity": 10,
      "unit": "cái",
      "status": "active",
      "createdAt": "2026-04-27T08:00:00.000Z",
      "updatedAt": "2026-04-27T08:00:00.000Z"
    }
  ]
}
```

### `POST /api/items`

Tạo sản phẩm mới.

Request body:

```json
{
  "name": "Bút bi Thiên Long",
  "sku": "BTL-001",
  "description": "Bút bi mực xanh",
  "quantity": 10,
  "unit": "cái",
  "status": "active"
}
```

Response `201`:

```json
{
  "ok": true,
  "data": {
    "id": 1,
    "name": "Bút bi Thiên Long",
    "sku": "BTL-001",
    "description": "Bút bi mực xanh",
    "quantity": 10,
    "unit": "cái",
    "status": "active",
    "createdAt": "2026-04-27T08:00:00.000Z",
    "updatedAt": "2026-04-27T08:00:00.000Z"
  }
}
```

Lỗi thường gặp:

- `400`: thiếu `name`, `sku`, `unit` hoặc `quantity` không hợp lệ
- `400`: `status` không phải `active` hoặc `inactive`
- `409`: `sku` đã tồn tại

### `PUT /api/items/:id`

Cập nhật sản phẩm theo `id`.

Request body (tất cả các trường đều optional):

```json
{
  "name": "Bút bi Thiên Long đỏ",
  "sku": "BTL-001-RED",
  "description": "Bút bi mực đỏ",
  "quantity": 15,
  "unit": "cây",
  "status": "active"
}
```

Response `200`:

```json
{
  "ok": true,
  "data": {
    "id": 1,
    "name": "Bút bi Thiên Long đỏ",
    "sku": "BTL-001-RED",
    "description": "Bút bi mực đỏ",
    "quantity": 15,
    "unit": "cây",
    "status": "active",
    "createdAt": "2026-04-27T08:00:00.000Z",
    "updatedAt": "2026-04-27T08:10:00.000Z"
  }
}
```

Ghi chú:

- Backend cũng hỗ trợ `PUT /api/items` nếu truyền `id` trong body để dễ tương thích lúc test thủ công.

Lỗi thường gặp:

- `400`: `id` không hợp lệ hoặc body không có field cập nhật
- `404`: không tìm thấy sản phẩm
- `409`: `sku` bị trùng

### `DELETE /api/items/:id`

Xóa sản phẩm theo `id`.

Response `200`:

```json
{
  "ok": true,
  "message": "Item deleted successfully"
}
```

Lỗi thường gặp:

- `400`: `id` không hợp lệ
- `404`: không tìm thấy sản phẩm

## 3. Stock API

### `POST /api/stock/import`

Nhập kho, tăng `items.quantity` và tạo bản ghi trong `stock_logs`.

Request body:

```json
{
  "itemId": 1,
  "quantity": 20,
  "note": "Nhập thêm đợt 1"
}
```

Response `200`:

```json
{
  "ok": true,
  "message": "Stock imported successfully",
  "data": {
    "item": {
      "id": 1,
      "name": "Bút bi Thiên Long",
      "sku": "BTL-001",
      "quantity": 30,
      "createdAt": "2026-04-27T08:00:00.000Z",
      "updatedAt": "2026-04-27T08:15:00.000Z"
    },
    "stockLog": {
      "id": 1,
      "itemId": 1,
      "type": "IMPORT",
      "quantity": 20,
      "note": "Nhập thêm đợt 1",
      "createdAt": "2026-04-27T08:15:00.000Z"
    }
  }
}
```

Lỗi thường gặp:

- `400`: `itemId` hoặc `quantity` không hợp lệ
- `404`: không tìm thấy sản phẩm

### `POST /api/stock/export`

Xuất kho, giảm `items.quantity` và tạo bản ghi trong `stock_logs`.

Request body:

```json
{
  "itemId": 1,
  "quantity": 5,
  "note": "Xuất cho đơn hàng A01"
}
```

Response `200`:

```json
{
  "ok": true,
  "message": "Stock exported successfully",
  "data": {
    "item": {
      "id": 1,
      "name": "Bút bi Thiên Long",
      "sku": "BTL-001",
      "quantity": 25,
      "createdAt": "2026-04-27T08:00:00.000Z",
      "updatedAt": "2026-04-27T08:20:00.000Z"
    },
    "stockLog": {
      "id": 2,
      "itemId": 1,
      "type": "EXPORT",
      "quantity": 5,
      "note": "Xuất cho đơn hàng A01",
      "createdAt": "2026-04-27T08:20:00.000Z"
    }
  }
}
```

Lỗi thường gặp:

- `400`: `itemId` hoặc `quantity` không hợp lệ
- `400`: không đủ hàng, trả message `Insufficient stock`
- `404`: không tìm thấy sản phẩm

### `GET /api/stock/logs`

Lấy lịch sử nhập xuất kho.

Response `200`:

```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "itemId": 1,
      "type": "IMPORT",
      "quantity": 20,
      "note": "Nhập thêm đợt 1",
      "createdAt": "2026-04-27T08:15:00.000Z",
      "item": {
        "name": "Bút bi Thiên Long",
        "sku": "BTL-001"
      }
    }
  ]
}
```

## 4. Format lỗi chung

Khi API lỗi, backend trả JSON dạng:

```json
{
  "ok": false,
  "message": "Error message here"
}
```

Ví dụ route sai:

```json
{
  "ok": false,
  "message": "Route not found"
}
```

## 5. Gợi ý test nhanh bằng curl

Tạo item:

```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Bút bi Thiên Long\",\"sku\":\"BTL-001\",\"quantity\":10}"
```

Lấy danh sách:

```bash
curl http://localhost:5000/api/items
```

Nhập kho:

```bash
curl -X POST http://localhost:5000/api/stock/import \
  -H "Content-Type: application/json" \
  -d "{\"itemId\":1,\"quantity\":20,\"note\":\"Nhập thêm đợt 1\"}"
```

Xuất kho:

```bash
curl -X POST http://localhost:5000/api/stock/export \
  -H "Content-Type: application/json" \
  -d "{\"itemId\":1,\"quantity\":5,\"note\":\"Xuất cho đơn hàng A01\"}"
```

Lấy lịch sử nhập xuất:

```bash
curl http://localhost:5000/api/stock/logs
```
