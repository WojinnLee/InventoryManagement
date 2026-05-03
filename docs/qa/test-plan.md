# QA - Test Plan

## Phạm vi kiểm thử

Kiểm tra toàn bộ flow chính của hệ thống EZ-Inventory: từ frontend → backend → database.

---

## Test Cases

| Mã | Tình huống | Bước thực hiện | Kết quả mong muốn | Trạng thái |
|---|---|---|---|---|
| TC01 | Health check backend | Gọi `GET /api/health` | Trả `{ ok: true }` | ⬜ |
| TC02 | Thêm sản phẩm | Nhập name, sku, quantity, unit rồi submit | Sản phẩm được lưu vào DB, hiển thị trong danh sách | ⬜ |
| TC03 | Xem danh sách sản phẩm | Mở trang Items | Danh sách lấy từ API hiển thị đúng | ⬜ |
| TC04 | Nhập kho | Chọn sản phẩm, quantity 20 | Tồn kho tăng thêm 20, có log IMPORT | ⬜ |
| TC05 | Xuất kho hợp lệ | Chọn sản phẩm, quantity 5 (nhỏ hơn tồn) | Tồn kho giảm 5, có log EXPORT | ⬜ |
| TC06 | Xuất kho vượt tồn | Xuất số lượng lớn hơn tồn kho | Backend trả lỗi 400, tồn kho không âm | ⬜ |
| TC07 | Frontend production | Mở URL public frontend | Trang load được, không lỗi console | ⬜ |
| TC08 | Docker run | Chạy `docker compose up -d` | 3 container running | ⬜ |

---

## Checklist UI

- [ ] Dashboard hiển thị stat cards đúng số liệu
- [ ] Dashboard cảnh báo tồn kho khi sản phẩm ≤ 10
- [ ] Dashboard giao dịch gần đây hiển thị đúng loại (IN/OUT)
- [ ] Products: tìm kiếm theo tên và SKU hoạt động
- [ ] Products: filter trạng thái "Đang bán" / "Ngừng bán" hoạt động
- [ ] Products: form tạo mới validate required fields
- [ ] Products: form sửa load đúng data hiện tại
- [ ] Products: xóa có confirm dialog
- [ ] Stock In: dropdown hiển thị đủ sản phẩm active
- [ ] Stock In: hint "Sau khi nhập: X" hiển thị đúng
- [ ] Stock Out: không cho xuất quá tồn kho (backend validate)
- [ ] Transactions: hiển thị đầy đủ lịch sử IMPORT và EXPORT
- [ ] Không lỗi console trong bất kỳ trang nào

---

## Checklist API (dùng Postman hoặc curl)

```bash
# Health
curl http://localhost:5000/api/health

# Lấy danh sách items
curl http://localhost:5000/api/items

# Tạo item mới
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test SP","sku":"TEST-001","unit":"cái","quantity":50}'

# Nhập kho
curl -X POST http://localhost:5000/api/stock-logs/in \
  -H "Content-Type: application/json" \
  -d '{"itemId":1,"quantity":10,"note":"Test nhập"}'

# Xuất kho vượt tồn (phải lỗi 400)
curl -X POST http://localhost:5000/api/stock-logs/out \
  -H "Content-Type: application/json" \
  -d '{"itemId":1,"quantity":99999}'
```
