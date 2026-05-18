# EZ-Inventory Backend API

Tài liệu mô tả toàn bộ endpoint backend đã triển khai.

## Base URL

| Môi trường | URL                      |
|------------|--------------------------|
| Local      | `http://localhost:5050`  |
| Prefix API | `/api`                   |

## Format Response chung

**Thành công:**
```json
{ "ok": true, "data": {} }
```

**Thất bại:**
```json
{ "ok": false, "message": "Mô tả lỗi" }
```

---

## 1. Health Check

### `GET /api/health`

Kiểm tra backend có chạy hay không.

**Response `200`:**
```json
{ "ok": true }
```

```bash
curl http://localhost:5050/api/health
```

---

## 2. Items API — Quản lý sản phẩm

### `GET /api/items`

Lấy danh sách tất cả sản phẩm, mới nhất lên đầu.

**Response `200`:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "name": "Bút bi Thiên Long",
      "sku": "BTL-001",
      "description": "Bút bi mực xanh",
      "quantity": 255,
      "unit": "cái",
      "status": "active",
      "createdAt": "2026-04-27T08:00:00.000Z",
      "updatedAt": "2026-04-27T08:00:00.000Z"
    }
  ]
}
```

```bash
curl http://localhost:5050/api/items
```

---

### `POST /api/items`

Tạo sản phẩm mới.

**Request body:**
| Field         | Type     | Required | Mô tả                              |
|---------------|----------|----------|------------------------------------|
| `name`        | string   | ✅       | Tên sản phẩm                       |
| `sku`         | string   | ✅       | Mã SKU (tự động uppercase)         |
| `unit`        | string   | ✅       | Đơn vị tính (cái, ram, hộp, ...)   |
| `description` | string   | ❌       | Mô tả sản phẩm                     |
| `quantity`    | integer  | ❌       | Số lượng ban đầu (mặc định: `0`)   |
| `status`      | string   | ❌       | `active` hoặc `inactive` (mặc định: `active`) |

```json
{
  "name": "Bút bi Thiên Long",
  "sku": "BTL-001",
  "description": "Bút bi mực xanh, ngòi 0.5mm",
  "quantity": 100,
  "unit": "cái",
  "status": "active"
}
```

**Response `201`:**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "name": "Bút bi Thiên Long",
    "sku": "BTL-001",
    "description": "Bút bi mực xanh, ngòi 0.5mm",
    "quantity": 100,
    "unit": "cái",
    "status": "active",
    "createdAt": "2026-04-27T08:00:00.000Z",
    "updatedAt": "2026-04-27T08:00:00.000Z"
  }
}
```

**Lỗi thường gặp:**
| Code | Mô tả |
|------|-------|
| `400` | Thiếu `name`, `sku`, `unit`; `quantity` âm; `status` không hợp lệ |
| `409` | `sku` đã tồn tại |

```bash
curl -X POST http://localhost:5050/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Bút bi Thiên Long","sku":"BTL-001","unit":"cái","quantity":100}'
```

---

### `PUT /api/items/:id`

Cập nhật thông tin sản phẩm. Tất cả các trường trong body đều optional — chỉ gửi trường cần thay đổi.

**Request body (tất cả optional):**
```json
{
  "name": "Bút bi Thiên Long đỏ",
  "sku": "BTL-001-RED",
  "description": "Bút bi mực đỏ",
  "quantity": 150,
  "unit": "cây",
  "status": "active"
}
```

**Response `200`:**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "name": "Bút bi Thiên Long đỏ",
    "sku": "BTL-001-RED",
    "description": "Bút bi mực đỏ",
    "quantity": 150,
    "unit": "cây",
    "status": "active",
    "createdAt": "2026-04-27T08:00:00.000Z",
    "updatedAt": "2026-04-27T08:30:00.000Z"
  }
}
```

**Lỗi thường gặp:**
| Code | Mô tả |
|------|-------|
| `400` | `id` không hợp lệ hoặc không có field nào được gửi |
| `404` | Không tìm thấy sản phẩm |
| `409` | `sku` mới bị trùng với sản phẩm khác |

```bash
curl -X PUT http://localhost:5050/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity":150}'
```

---

### `DELETE /api/items/:id`

Xóa sản phẩm. Các stock log liên quan sẽ bị xóa theo (cascade).

**Response `200`:**
```json
{ "ok": true, "message": "Item deleted successfully" }
```

**Lỗi thường gặp:**
| Code | Mô tả |
|------|-------|
| `400` | `id` không hợp lệ |
| `404` | Không tìm thấy sản phẩm |

```bash
curl -X DELETE http://localhost:5050/api/items/1
```

---

## 3. Inventory API — Tồn kho hiện tại

### `GET /api/inventory`

Lấy snapshot tồn kho hiện tại của tất cả sản phẩm. Sắp xếp theo tên.

**Response `200`:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "name": "Bút bi Thiên Long",
      "sku": "BTL-001",
      "quantity": 255,
      "unit": "cái",
      "status": "active",
      "updatedAt": "2026-04-27T09:00:00.000Z"
    }
  ]
}
```

```bash
curl http://localhost:5050/api/inventory
```

---

## 4. Stock Logs API — Lịch sử giao dịch kho

### `GET /api/stock-logs`

Lấy toàn bộ lịch sử nhập/xuất kho, mới nhất lên đầu, kèm thông tin sản phẩm.

**Response `200`:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 2,
      "itemId": 1,
      "type": "EXPORT",
      "quantity": 45,
      "note": "Xuất cho phòng Kế Toán",
      "createdAt": "2026-04-27T09:30:00.000Z",
      "item": {
        "id": 1,
        "name": "Bút bi Thiên Long",
        "sku": "BTL-001",
        "unit": "cái"
      }
    },
    {
      "id": 1,
      "itemId": 1,
      "type": "IMPORT",
      "quantity": 200,
      "note": "Nhập hàng đầu tháng 4",
      "createdAt": "2026-04-27T08:00:00.000Z",
      "item": {
        "id": 1,
        "name": "Bút bi Thiên Long",
        "sku": "BTL-001",
        "unit": "cái"
      }
    }
  ]
}
```

```bash
curl http://localhost:5050/api/stock-logs
```

---

### `POST /api/stock-logs/in`

Nhập kho: tăng `quantity` của sản phẩm và ghi log `IMPORT`.

**Request body:**
| Field    | Type    | Required | Mô tả                        |
|----------|---------|----------|------------------------------|
| `itemId` | integer | ✅       | ID sản phẩm                  |
| `quantity` | integer | ✅     | Số lượng nhập (> 0)          |
| `note`   | string  | ❌       | Ghi chú                      |

```json
{
  "itemId": 1,
  "quantity": 50,
  "note": "Nhập hàng đợt 2"
}
```

**Response `200`:**
```json
{
  "ok": true,
  "message": "Stock imported successfully",
  "data": {
    "item": {
      "id": 1,
      "name": "Bút bi Thiên Long",
      "sku": "BTL-001",
      "quantity": 305,
      "unit": "cái",
      "status": "active",
      "createdAt": "2026-04-27T08:00:00.000Z",
      "updatedAt": "2026-04-27T10:00:00.000Z"
    },
    "stockLog": {
      "id": 3,
      "itemId": 1,
      "type": "IMPORT",
      "quantity": 50,
      "note": "Nhập hàng đợt 2",
      "createdAt": "2026-04-27T10:00:00.000Z",
      "item": { "id": 1, "name": "Bút bi Thiên Long", "sku": "BTL-001", "unit": "cái" }
    }
  }
}
```

**Lỗi thường gặp:**
| Code | Mô tả |
|------|-------|
| `400` | `itemId` hoặc `quantity` không hợp lệ (phải > 0) |
| `404` | Không tìm thấy sản phẩm |

```bash
curl -X POST http://localhost:5050/api/stock-logs/in \
  -H "Content-Type: application/json" \
  -d '{"itemId":1,"quantity":50,"note":"Nhập hàng đợt 2"}'
```

---

### `POST /api/stock-logs/out`

Xuất kho: giảm `quantity` của sản phẩm và ghi log `EXPORT`.

> ⚠️ **Race condition safe**: cập nhật atomic bằng SQL `WHERE quantity >= requested` — đảm bảo tồn kho không bị âm dù nhiều request đồng thời.

**Request body:** (giống `/in`)
```json
{
  "itemId": 1,
  "quantity": 20,
  "note": "Xuất cho phòng Hành Chính"
}
```

**Response `200`:** (tương tự `/in`, `type: "EXPORT"`)

**Lỗi thường gặp:**
| Code | Mô tả |
|------|-------|
| `400` | `itemId` hoặc `quantity` không hợp lệ |
| `400` | Tồn kho không đủ (`Insufficient stock`) |
| `404` | Không tìm thấy sản phẩm |

```bash
curl -X POST http://localhost:5050/api/stock-logs/out \
  -H "Content-Type: application/json" \
  -d '{"itemId":1,"quantity":20,"note":"Xuất cho phòng Hành Chính"}'
```

---

## 5. Legacy Aliases (deprecated)

Các route sau vẫn hoạt động nhưng sẽ bị xóa sau khi frontend chuyển sang route mới:

| Route cũ                    | Route mới                  |
|-----------------------------|----------------------------|
| `POST /api/stock/import`    | `POST /api/stock-logs/in`  |
| `POST /api/stock/export`    | `POST /api/stock-logs/out` |
