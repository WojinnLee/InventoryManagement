# Test Plan - Inventory Management System

**QA / SRE Engineer**: Thành viên 5
**Project**: Inventory Management System

## 1. Frontend Test Checklist

| ID | Category | Scenario | Expected Result | Status |
|----|----------|----------|-----------------|--------|
| FE-01 | UI/UX | Dashboard displays total products and recent transactions | Accurate summary visible | [ ] |
| FE-02 | Add Product | Submit valid product info (Name, SKU, Unit, Quantity) | Product added, redirects/updates list | [ ] |
| FE-03 | Add Product | Submit product with missing required fields | Validation errors displayed | [ ] |
| FE-04 | Add Product | Submit product with duplicate SKU | Conflict error message displayed | [ ] |
| FE-05 | Stock In | Successfully import items for existing product | Quantity increases, transaction logged | [ ] |
| FE-06 | Stock Out | Successfully export items (quantity <= current) | Quantity decreases, transaction logged | [ ] |
| FE-07 | Stock Out | Attempt export exceeding current inventory | "Insufficient stock" error displayed | [ ] |
| FE-08 | Transactions | View history of stock movements | All logs visible with correct timestamps | [ ] |
| FE-09 | SRE | Console inspection | No red errors or leak warnings | [ ] |


## 2. API Test Checklist

| ID | Endpoint | Method | Scenario | Expected Result | Status |
|----|----------|--------|----------|-----------------|--------|
| API-01 | `/api/items` | GET | Fetch all items | Returns 200 OK with item list | [ ] |
| API-02 | `/api/items` | POST | Create new item | Returns 201 Created | [ ] |
| API-03 | `/api/items` | POST | Create item with existing SKU | Returns 409 Conflict | [ ] |
| API-04 | `/api/stock/import` | POST | Positive quantity import | Returns 200 OK, stock increases | [ ] |
| API-05 | `/api/stock/export` | POST | Valid quantity export | Returns 200 OK, stock decreases | [ ] |
| API-06 | `/api/stock/export` | POST | Exceeding quantity export | Returns 400 Bad Request (Insufficient stock) | [ ] |
| API-07 | `/api/stock/import` | POST | Negative quantity | Returns 400 Bad Request | [ ] |
| API-08 | `/api/health` | GET | Health check | Returns 200 OK `{ "ok": true }` | [ ] |

## 3. Execution Evidence (Placeholders)

*Evidence will be captured during execution and stored in `docs/test-evidence/`.*
