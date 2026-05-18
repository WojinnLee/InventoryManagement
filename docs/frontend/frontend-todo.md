# Frontend - Danh sách việc cần hoàn thiện

## Trạng thái tổng quan

> Cập nhật: 2026-05-03

Frontend đã có đủ các trang và kết nối API cơ bản theo yêu cầu trong tài liệu phân chia nhiệm vụ. Tuy nhiên còn một số điểm chưa hoàn thiện để đạt tiêu chí bàn giao.

---

## 🔴 Bắt buộc (Critical)

### 1. Thiếu file `.env.example`

- **Vấn đề**: File `.env.example` chưa được tạo trong thư mục `frontend/`.
- **Yêu cầu trong tài liệu**: "Có `.env.example` commit lên repo."
- **Cách fix**:
  ```bash
  # Tạo file frontend/.env.example
  echo "VITE_API_URL=http://localhost:5050" > frontend/.env.example
  git add frontend/.env.example
  git commit -m "chore: add frontend .env.example"
  ```

### 2. Không có `console.error` / không có lỗi console khi chạy production

- **Vấn đề**: Cần kiểm tra không có lỗi console khi chạy `npm run build` và mở bản production.
- **Cách kiểm tra**:
  ```bash
  cd frontend
  npm run build
  npm run preview  # hoặc serve dist/
  ```
  Mở DevTools → Console, kiểm tra không có lỗi đỏ.

### 3. Trang `/settings` còn là placeholder

- **Vấn đề**: `PlaceholderPage.jsx` không có chức năng gì. Nếu demo trực tiếp, người dùng có thể click vào và thấy trang trống.
- **Mức độ**: Không ảnh hưởng chức năng chính, nhưng cần ghi chú rõ trong README hoặc thêm nội dung cơ bản.
- **Cách xử lý nhanh**: Thêm thông báo "Tính năng đang phát triển" hoặc hiển thị cài đặt ngôn ngữ đơn giản.

---

## 🟡 Nên làm (Recommended)

### 4. Chưa có test cho frontend

- **Vấn đề**: Tài liệu yêu cầu pipeline CI có bước `test`. Hiện tại frontend pipeline chỉ có lint và build.
- **Đề xuất**: Thêm ít nhất 1 test file đơn giản với Vitest.
  ```bash
  # Ví dụ: kiểm tra hàm formatTime trong DashboardPage
  ```
- **Tài liệu tham khảo**: `docs/qa/test-plan.md` (cần tạo)

### 5. DashboardPage: `ClipboardIcon` component nên tách ra

- **Vấn đề**: Component `ClipboardIcon` đang định nghĩa inline trong `DashboardPage.jsx`.
- **Cách fix**: Chuyển sang `src/components/icons/` hoặc dùng `ClipboardList` từ lucide-react.

### 6. Thiếu xử lý trường hợp `VITE_API_URL` bị undefined lúc build

- **Vấn đề**: Nếu quên set env khi build production, URL hiển thị sẽ là `undefined/api/items`.
  - Đây chính là **INC04** trong tài liệu incident!
- **Cách fix hiện tại**: `api.js` đã có fallback `|| 'http://localhost:5050'` nhưng `DashboardPage.jsx` hiển thị `import.meta.env.VITE_API_URL` trực tiếp có thể thấy `undefined`.
- **Cách fix tốt hơn**: Hiển thị fallback URL thay vì biến env thô:
  ```jsx
  <span className="text-caption">
    API: {import.meta.env.VITE_API_URL || 'http://localhost:5050'}
  </span>
  ```

### 7. StockOut: Cần kiểm tra validate xuất quá số lượng tồn phía frontend

- **Vấn đề**: Backend đã có validate (lỗi 400 khi xuất quá tồn), nhưng frontend chỉ hiển thị error message từ API.
- **Cải thiện UX**: Thêm hint phía frontend cho biết số lượng tối đa có thể xuất (tương tự StockIn đã có "Sau khi nhập: X đơn vị").
- **Đây là TC06** trong test plan.

### 8. TransactionsPage: Chưa có filter theo ngày

- **Vấn đề**: Trang lịch sử giao dịch có thể cần filter theo khoảng thời gian để dễ demo.
- **Độ ưu tiên**: Thấp, trang hiện tại đã đủ để demo.

---

## 🟢 Tùy chọn (Nice to have)

### 9. Thêm `<title>` động theo từng trang

- **Vấn đề**: `index.html` có title cố định. Mỗi trang nên có title riêng.
- **Cách fix**: Dùng `useEffect` để set `document.title` trong mỗi page component.

### 10. Responsive mobile

- **Vấn đề**: Layout sidebar + content có thể cần điều chỉnh trên màn hình nhỏ.
- **Ưu tiên**: Thấp (dự án demo trên máy tính).

---

## Checklist bàn giao Frontend Engineer

Theo tài liệu phân chia nhiệm vụ, Frontend Engineer cần bàn giao:

- [ ] `frontend/` source code đầy đủ ✅ (đã có)
- [ ] UI pages hoạt động: Dashboard, Items, Stock Form, Stock Logs ✅ (đã có)
- [ ] `services/api.js` kết nối backend ✅ (đã có)
- [ ] `.env.example` ❌ (chưa có)
- [ ] Không lỗi console khi thao tác ⚠️ (cần kiểm tra)
- [ ] Giao diện thao tác được, không lỗi console ⚠️ (cần verify production build)
