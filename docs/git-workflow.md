# Quy tắc Branch và Commit — EZ-Inventory

## 1. Cấu trúc Branch

| Branch | Mục đích | Ai được push |
|--------|---------|-------------|
| `main` | Phiên bản ổn định để demo/deploy | Chỉ merge từ `dev` qua PR |
| `dev` | Nhánh tích hợp tính năng | Merge từ `feature/*` qua PR |
| `feature/<tên>` | Nhánh riêng cho từng chức năng | Mỗi thành viên tự push |

### Ví dụ đặt tên branch:
```
feature/backend-items
feature/frontend-dashboard
feature/docker-compose
feature/ci-cd
```

---

## 2. Quy trình làm việc hằng ngày

```
1. Đảm bảo bạn đang ở nhánh feature của mình
   git checkout feature/<tên-của-bạn>

2. Lấy code mới nhất từ dev trước khi làm việc
   git pull origin dev --rebase

3. Làm việc, commit nhỏ theo từng phần
   git add .
   git commit -m "feat: add create item API"

4. Push branch lên GitHub
   git push origin feature/<tên-của-bạn>

5. Tạo Pull Request vào dev trên GitHub
   - Vào GitHub → Pull requests → New pull request
   - base: dev ← compare: feature/<tên-của-bạn>
   - Ghi mô tả những gì đã làm

6. Chờ CI chạy qua lint/test/build
   - Xem tab Actions trên GitHub

7. Review nhanh, sau đó merge vào dev
```

---

## 3. Quy tắc Commit Convention

Mỗi commit message phải theo format: `<type>: <mô tả ngắn>`

| Type | Ý nghĩa | Ví dụ |
|------|---------|-------|
| `feat` | Tính năng mới | `feat: add create item API` |
| `fix` | Sửa lỗi | `fix: handle insufficient stock error` |
| `chore` | Công việc phụ trợ | `chore: add docker compose services` |
| `ci` | CI/CD | `ci: add github actions workflow` |
| `docs` | Tài liệu | `docs: update deployment guide` |
| `refactor` | Cải thiện code, không thêm tính năng | `refactor: extract validation helper` |
| `test` | Thêm/sửa test | `test: add health check test` |

### Quy tắc viết commit:
- ✅ Commit nhỏ theo từng phần, không commit một lần cuối
- ✅ Dùng tiếng Anh cho commit message
- ❌ Không commit file `.env` hoặc `node_modules`
- ❌ Không dùng message chung chung như `update`, `fix bug`, `wip`

---

## 4. Hướng dẫn tạo Pull Request

### Bước 1: Push branch lên GitHub
```bash
git push origin feature/<tên-của-bạn>
```

### Bước 2: Vào GitHub tạo PR
1. Mở repo trên GitHub
2. Click **"Pull requests"** → **"New pull request"**
3. Chọn:
   - **base**: `dev`
   - **compare**: `feature/<tên-của-bạn>`
4. Click **"Create pull request"**

### Bước 3: Điền thông tin PR
```
Title: feat: [mô tả ngắn những gì đã làm]

Description:
## Đã làm gì?
- [ ] API GET /api/items
- [ ] API POST /api/items

## Test như thế nào?
- curl http://localhost:5050/api/items

## Checklist
- [ ] CI pipeline pass
- [ ] Không commit .env
```

### Bước 4: Chờ CI và merge
- Đợi GitHub Actions chạy xong (tab **Actions**)
- Nếu CI pass (màu xanh ✅) → merge vào `dev`
- Nếu CI fail (màu đỏ ❌) → xem log lỗi → sửa → push lại

---

## 5. Quy trình merge lên `main`

Khi `dev` ổn định và đã test đầy đủ:

```
1. Tạo Pull Request từ dev → main
2. Cả nhóm review
3. CI pass → merge
4. Tag version nếu cần: git tag v1.0.0
```

---

## 6. Lệnh Git hay dùng

```bash
# Xem nhánh hiện tại
git branch

# Tạo và chuyển sang nhánh mới
git checkout -b feature/<tên>

# Lấy code mới nhất từ dev (khuyến nghị dùng rebase)
git pull origin dev --rebase

# Xem trạng thái file
git status

# Xem log commit gọn
git log --oneline -10

# Hủy thay đổi chưa commit của 1 file
git checkout -- <file>

# Stash thay đổi tạm thời
git stash
git stash pop
```
