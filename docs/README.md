# Tài liệu dự án EZ-Inventory

## Cấu trúc thư mục docs

```text
docs/
├── project/
│   └── task-planning.docx          ← Phân chia nhiệm vụ và kế hoạch dự án (tài liệu gốc)
│
├── frontend/
│   ├── frontend-overview.md        ← Tổng quan frontend: cấu trúc, trang, API đã kết nối
│   └── frontend-todo.md            ← Danh sách việc cần hoàn thiện cho Frontend Engineer
│
├── backend/
│   ├── api.md                      ← Tài liệu API chi tiết (endpoints, request/response)
│   └── architecture.md             ← Kiến trúc backend: layer, middleware, error handling
│
├── devops/
│   ├── git-workflow.md             ← Quy ước branch, commit message, pull request
│   └── deployment.md               ← Hướng dẫn deploy và redeploy
│
└── qa/
    ├── test-plan.md                ← Test cases, checklist UI và API
    └── incidents.md                ← Báo cáo incident (hiện tượng, layer, nguyên nhân, fix)
```

## Ai cần đọc gì

| Vai trò | File cần đọc |
|---|---|
| Frontend Engineer | `frontend/frontend-overview.md`, `frontend/frontend-todo.md`, `backend/api.md` |
| Backend Engineer | `backend/architecture.md`, `backend/api.md` |
| DevOps Engineer | `devops/git-workflow.md`, `devops/deployment.md` |
| Infrastructure Engineer | `devops/deployment.md` |
| QA / SRE Engineer | `qa/test-plan.md`, `qa/incidents.md` |
| Cả nhóm | `project/task-planning.docx` |
