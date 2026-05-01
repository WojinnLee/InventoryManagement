# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased] — 2026-05-01

### Added

**CI/CD (DevOps)**
- `.github/workflows/ci.yml` — GitHub Actions pipeline chạy tự động khi push và pull request vào `main`/`dev`
  - Job `backend-ci`: install → lint → test → build check
  - Job `frontend-ci`: install → lint → build (dùng `--if-present` cho đến khi frontend hoàn chỉnh)
  - Cache `~/.npm` để tăng tốc pipeline
- `backend/eslint.config.js` — ESLint flat config cho Node.js CommonJS, rule `no-unused-vars`, `no-undef`
- `backend/tests/health.test.js` — Jest + Supertest test kiểm tra `GET /api/health` trả `200 { ok: true }`
- `docs/git-workflow.md` — Quy tắc branch, commit convention, hướng dẫn Pull Request cho cả nhóm

### Changed

- `backend/package.json` — thêm scripts `lint`, `lint:fix`, `test`; thêm devDependencies `eslint`, `@eslint/js`, `globals`, `jest`, `supertest`
- `backend/src/middlewares/error-handler.js` — đổi tham số `next` thành `_next` để đúng ESLint rule `argsIgnorePattern: ^_`
- `backend/src/controllers/stock-logs-controller.js` — bỏ import `Prisma` không dùng

---

## [Unreleased] — 2026-04-30


### Added

**Routes & Controllers**
- `GET /api/inventory` — trả về snapshot tồn kho (id, name, sku, quantity, unit, status, updatedAt)
- `GET /api/stock-logs` — lịch sử nhập/xuất kho, mới nhất trước, kèm thông tin item
- `POST /api/stock-logs/in` — nhập kho (thay thế `/api/stock/import`)
- `POST /api/stock-logs/out` — xuất kho race-condition safe (thay thế `/api/stock/export`)
- `backend/src/controllers/inventory-controller.js`
- `backend/src/controllers/stock-logs-controller.js`
- `backend/src/routes/inventory.routes.js`
- `backend/src/routes/stock-logs.routes.js`

**Utilities**
- `backend/src/utils/parse-validate.js` — shared helpers `parsePositiveInt`, `parseNonNegativeInt`, `parseOptionalNonNegativeInt`

**Seed**
- `backend/scripts/seed.js` — 5 sản phẩm mẫu + log nhập/xuất kho
- `npm run db:seed` trong `backend/package.json`
- `npm run prisma:reset` trong `backend/package.json`

**Documentation**
- `docs/api.md` — viết lại đầy đủ theo routes mới
- `docs/architecture.md` — mới, mô tả kiến trúc backend
- `README.md` — hướng dẫn chạy backend, env, migrate, seed, test

### Changed

- `backend/src/controllers/items-controller.js` — sử dụng shared parse helpers; bắt lỗi Prisma P2002/P2025 thay vì pre-query check → không còn trả 500 khi trùng SKU hoặc item không tồn tại
- `backend/src/routes/items.routes.js` — chỉ giữ routes chuẩn với `:id` trong params
- `backend/src/routes/stock.routes.js` — chuyển thành legacy alias, delegate sang `stock-logs-controller`
- `backend/src/app.js` — mount routes mới, giữ legacy `/api/stock` alias với comment

### Fixed

- **Race condition xuất kho**: trước đây đọc tồn kho → validate → trừ theo 2 bước riêng lẻ, dẫn đến tồn kho có thể bị âm khi có nhiều request đồng thời. Đã sửa bằng atomic SQL `UPDATE WHERE quantity >= requested` trong `$transaction`.
- **Trả 500 khi trùng SKU**: đã bắt Prisma error code P2002 và trả 409 đúng chuẩn.
- **Trả 500 khi không tìm thấy item**: đã bắt Prisma error code P2025 và trả 404 đúng chuẩn.

---

## [0.1.0] — 2026-04-29

### Added

- Backend boilerplate với Express và Prisma
- Prisma schema: model `Item` và `StockLog`
- Items API: GET, POST, PUT, DELETE `/api/items`
- Stock API (legacy): POST `/api/stock/import` và `/api/stock/export`
- Error handling middleware
- Request logging middleware
- Health check endpoint `GET /api/health`
