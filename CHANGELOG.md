# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Backend boilerplate with Express and Prisma.
- Prisma schema with `Item` and `StockLog` models.
- Items API:
    - `GET /api/items`: List all items.
    - `POST /api/items`: Create a new item (with `name`, `sku`, `description`, `quantity`, `unit`, `status`).
    - `PUT /api/items/:id`: Update item details.
    - `DELETE /api/items/:id`: Delete an item.
- Stock API:
    - `POST /api/stock/import`: Increase item quantity and log transaction.
    - `POST /api/stock/export`: Decrease item quantity and log transaction (with insufficient stock check).
- Error handling middleware for consistent API responses.
- Request logging middleware.
- API Documentation (`docs/api.md`).

### Fixed
- Improved `Items API` documentation to include all schema fields (`description`, `unit`, `status`).
- Added `DELETE /api/items/:id` endpoint to documentation.
