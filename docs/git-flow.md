# Git Flow cho dự án InventoryManagement

## Mục tiêu

Tài liệu này quy định cách làm việc với Git cho repo `InventoryManagement` để:

- giữ `main` luôn ổn định để demo, nộp bài hoặc triển khai bản đã duyệt
- dùng `dev` làm nhánh tích hợp chung cho cả nhóm
- cô lập từng đầu việc trên branch riêng để review và rollback dễ hơn
- buộc mọi thay đổi quan trọng đi qua Pull Request và CI

Git flow dưới đây được viết theo đúng trạng thái hiện tại của repo:

- đã có `main`, `dev` và các nhánh `feature/*`
- đã có GitHub Actions tại `.github/workflows/ci.yml`
- CI đang chạy cho cả `backend` và `frontend` khi `push` lên `main`, `dev`, `feature/**` và khi mở PR vào `main` hoặc `dev`

## Mô hình branch

### `main`

- Chứa mã ổn định nhất.
- Chỉ nhận code đã được kiểm tra và duyệt.
- Dùng cho các mốc bàn giao, demo hoặc release chính thức.
- Không commit trực tiếp lên `main`.

### `dev`

- Là nhánh tích hợp chung của team.
- Mọi tính năng thông thường được merge vào `dev` trước.
- Là nhánh mặc định để test tích hợp giữa `backend`, `frontend`, docs và cấu hình CI/CD.
- Không nên code trực tiếp trên `dev`, trừ khi cần xử lý cực nhỏ và đã được thống nhất trong nhóm.

### `feature/*`

- Dùng cho một chức năng hoặc một đầu việc cụ thể.
- Luôn tách từ `dev`.
- Ví dụ:
  - `feature/auth-api`
  - `feature/product-table-ui`
  - `feature/ci-cd`

### `fix/*`

- Dùng cho bug thông thường, chưa cần can thiệp trực tiếp vào `main`.
- Luôn tách từ `dev`.
- Ví dụ:
  - `fix/login-validation`
  - `fix/api-error-format`

### `docs/*`

- Dùng khi chỉ sửa tài liệu trong thư mục `docs/`, `README.md` hoặc hướng dẫn vận hành.
- Luôn tách từ `dev`.
- Ví dụ:
  - `docs/git-flow`
  - `docs/deployment-guide`

### `chore/*`

- Dùng cho việc bảo trì không thay đổi logic nghiệp vụ: cấu hình, scaffolding, refactor nhỏ, cải tiến tooling.
- Luôn tách từ `dev`.
- Ví dụ:
  - `chore/docker-compose`
  - `chore/eslint-config`

### `hotfix/*`

- Chỉ dùng khi `main` đang có lỗi cần sửa gấp cho demo hoặc release.
- Tách trực tiếp từ `main`.
- Sau khi merge vào `main`, bắt buộc merge ngược lại `dev` để tránh lệch lịch sử.
- Ví dụ:
  - `hotfix/demo-login-crash`

## Quy tắc chọn branch gốc

| Loại công việc | Tạo từ branch | Merge vào branch |
| --- | --- | --- |
| Tính năng mới | `dev` | `dev` |
| Sửa bug thông thường | `dev` | `dev` |
| Sửa tài liệu | `dev` | `dev` |
| Cấu hình / bảo trì | `dev` | `dev` |
| Lỗi khẩn cấp trên bản ổn định | `main` | `main`, sau đó đồng bộ về `dev` |

## Quy trình làm việc chuẩn

### 1. Đồng bộ branch nền

Trước khi bắt đầu task mới:

```bash
git checkout dev
git pull origin dev
```

Nếu làm hotfix:

```bash
git checkout main
git pull origin main
```

### 2. Tạo branch theo đúng mục đích

Ví dụ tạo feature branch:

```bash
git checkout -b feature/product-api
```

Ví dụ tạo docs branch:

```bash
git checkout -b docs/git-flow
```

### 3. Phát triển và commit theo lô nhỏ

- Mỗi branch chỉ nên xử lý một đầu việc chính.
- Commit theo từng bước có ý nghĩa, tránh gom quá nhiều thay đổi không liên quan.
- Không trộn sửa tài liệu, refactor, fix bug và feature lớn trong cùng một commit nếu có thể tách ra.

### 4. Tự kiểm tra trước khi push

Repo hiện có CI cho cả `backend` và `frontend`, nên trước khi mở PR cần ưu tiên chạy kiểm tra tương ứng với phần mình sửa.

Kiểm tra backend:

```bash
cd backend
npm install
npm run lint --if-present
npm test --if-present
npm run build --if-present
```

Kiểm tra frontend:

```bash
cd frontend
npm install
npm run lint --if-present
npm test --if-present
npm run build --if-present
```

Lưu ý:

- Do repo đang ở giai đoạn khởi tạo, một số script có thể chưa tồn tại; CI hiện dùng `--if-present` nên sẽ bỏ qua script chưa khai báo.
- Dù vậy, khi module đã có `package.json` và script tương ứng, người mở PR phải đảm bảo các lệnh này chạy được.

### 5. Commit theo quy ước thống nhất

Áp dụng Conventional Commits ở mức đơn giản:

- `feat`: thêm tính năng
- `fix`: sửa lỗi
- `docs`: cập nhật tài liệu
- `chore`: cấu hình, dependency, tooling, scaffolding
- `refactor`: cải tổ code nhưng không đổi hành vi mong đợi
- `test`: thêm hoặc sửa test
- `ci`: thay đổi pipeline CI/CD

Mẫu commit:

```bash
git add .
git commit -m "feat: add inventory product API"
```

Nên viết message theo tiếng Anh ngắn gọn, mô tả đúng thay đổi. Ví dụ:

- `feat: add login endpoint`
- `fix: handle empty product quantity`
- `docs: rewrite git flow guide`
- `ci: add frontend and backend workflow`

### 6. Push branch lên remote

```bash
git push -u origin feature/product-api
```

Với các lần push sau:

```bash
git push origin feature/product-api
```

### 7. Tạo Pull Request

Quy tắc đích của PR:

- `feature/*`, `fix/*`, `docs/*`, `chore/*` mở PR vào `dev`
- `hotfix/*` mở PR vào `main`

Nội dung PR nên có tối thiểu:

- mục tiêu thay đổi
- phạm vi ảnh hưởng: `backend`, `frontend`, `docs`, CI, infra
- cách kiểm tra
- ảnh chụp màn hình nếu thay đổi UI
- issue hoặc task liên quan nếu có

### 8. Chờ CI và review

PR chỉ được merge khi:

- không còn conflict
- CI pass
- người tạo PR đã tự review diff của mình
- nếu là thay đổi lớn, có ít nhất một người khác review

CI hiện tại sẽ chạy:

- `backend-ci` trên Node.js 20
- `frontend-ci` trên Node.js 20
- các bước `install`, `lint`, `test`, `build` trong từng thư mục tương ứng

### 9. Merge branch

Ưu tiên một trong hai cách sau:

- `Squash and merge` cho feature nhỏ hoặc commit history lộn xộn
- `Create a merge commit` khi muốn giữ rõ chuỗi commit của một nhánh lớn

Không khuyến khích rebase trực tiếp lên branch remote nếu cả nhóm chưa thống nhất cách dùng.

Sau khi merge:

```bash
git checkout dev
git pull origin dev
git branch -d feature/product-api
```

Nếu branch remote không còn cần:

```bash
git push origin --delete feature/product-api
```

## Quy trình release từ `dev` sang `main`

Khi nhóm chốt một mốc ổn định để demo hoặc bàn giao:

1. Đảm bảo `dev` đã qua kiểm tra tích hợp.
2. Mở PR từ `dev` vào `main`.
3. Kiểm tra lại CI trên PR.
4. Merge sau khi xác nhận bản đó là mốc ổn định.
5. Gắn tag nếu cần, ví dụ `v0.1.0`, `v1.0.0`.

Ví dụ:

```bash
git checkout main
git pull origin main
git merge origin/dev
git push origin main
```

Trong thực tế nhóm nên ưu tiên merge qua Pull Request thay vì merge thẳng bằng lệnh.

## Quy trình hotfix

Khi `main` có lỗi khẩn cấp:

1. Tạo branch từ `main`.
2. Sửa lỗi tối thiểu cần thiết.
3. Mở PR `hotfix/*` vào `main`.
4. Sau khi merge `main`, đồng bộ lại `dev`.

Ví dụ:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/demo-login-crash
```

Sau khi hotfix đã vào `main`, đồng bộ ngược:

```bash
git checkout dev
git pull origin dev
git merge origin/main
git push origin dev
```

## Quy tắc bảo vệ repository

- Không commit file bí mật như `.env`.
- Không commit thư mục build hoặc dependency đã có trong `.gitignore` như `node_modules`, `dist`, `build`, `coverage`.
- Không force-push lên `main` hoặc `dev`.
- Không merge PR đang đỏ CI trừ khi cả nhóm chấp nhận rủi ro và có lý do rõ ràng.
- Không để một PR chứa nhiều mục tiêu khác nhau.

## Mẫu thao tác đầy đủ

Ví dụ làm một task tài liệu:

```bash
git checkout dev
git pull origin dev
git checkout -b docs/git-flow

# chỉnh sửa file
git add docs/git-flow.md
git commit -m "docs: rewrite git flow guide"
git push -u origin docs/git-flow
```

Sau đó tạo PR `docs/git-flow -> dev`.

## Tóm tắt ngắn

- Làm việc hằng ngày trên branch riêng, không code trực tiếp lên `main`.
- Hầu hết công việc đi từ `feature/*`, `fix/*`, `docs/*`, `chore/*` vào `dev`.
- Chỉ đưa `dev` sang `main` khi đã ổn định.
- Chỉ dùng `hotfix/*` khi cần vá gấp trên `main`.
- Commit rõ nghĩa, PR rõ phạm vi, CI pass trước khi merge.
