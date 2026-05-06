import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Package,
  AlertTriangle,
  Check,
  RefreshCw,
  Filter,
} from 'lucide-react';
import * as api from '../services/api';

export default function ProductsPage() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(location.state?.openForm || false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', sku: '', unit: 'cái', description: '', quantity: 0, status: 'active' });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getItems();
      setItems(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', sku: '', unit: 'cái', description: '', quantity: 0, status: 'active' });
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, sku: item.sku, unit: item.unit, description: item.description || '', quantity: item.quantity, status: item.status });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      if (editingItem) {
        await api.updateItem(editingItem.id, formData);
        showToast(`Đã cập nhật "${formData.name}"`);
      } else {
        await api.createItem(formData);
        showToast(`Đã thêm "${formData.name}"`);
      }
      closeForm();
      fetchItems();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteItem(id);
      showToast('Đã xóa sản phẩm');
      setDeleteConfirm(null);
      fetchItems();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="products-page">
      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar__left">
          <div className="toolbar__search">
            <Search size={16} className="toolbar__search-icon" />
            <input
              type="text"
              placeholder="Tìm tên hoặc SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="toolbar__search-input"
              id="product-search"
            />
          </div>
          <div className="toolbar__filter">
            <Filter size={14} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="toolbar__select" id="status-filter">
              <option value="all">Tất cả</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Ngừng bán</option>
            </select>
          </div>
        </div>
        <div className="toolbar__right">
          <span className="text-caption">{filtered.length} sản phẩm</span>
          <button className="btn btn--primary" onClick={openCreate} id="add-product-btn">
            <Plus size={16} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="table-loading"><RefreshCw size={20} className="spin" /> Đang tải...</div>
      ) : error ? (
        <div className="table-error">
          <AlertTriangle size={20} />
          <span>{error}</span>
          <button className="btn btn--secondary btn--sm" onClick={fetchItems}><RefreshCw size={14} /> Thử lại</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="table-empty">
          <Package size={48} strokeWidth={1} />
          <span className="table-empty__title">{items.length === 0 ? 'Chưa có sản phẩm nào' : 'Không tìm thấy kết quả'}</span>
          <span className="text-caption">{items.length === 0 ? 'Bắt đầu bằng cách thêm sản phẩm đầu tiên' : 'Thử tìm kiếm với từ khóa khác'}</span>
          {items.length === 0 && (
            <button className="btn btn--primary" onClick={openCreate} style={{ marginTop: 'var(--space-3)' }}>
              <Plus size={16} /> Thêm sản phẩm
            </button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table" id="products-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>SKU</th>
                <th>Tồn kho</th>
                <th>Đơn vị</th>
                <th>Trạng thái</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="product-cell">
                      <span className="product-cell__name">{item.name}</span>
                      {item.description && <span className="product-cell__desc">{item.description}</span>}
                    </div>
                  </td>
                  <td><code className="sku-code">{item.sku}</code></td>
                  <td>
                    <span className={item.quantity <= 10 ? 'text-danger' : item.quantity <= 30 ? 'text-warning' : ''}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>{item.unit}</td>
                  <td>
                    <span className={`status-badge ${item.status === 'active' ? 'status-badge--success' : 'status-badge--danger'}`}>
                      <span className="status-badge__dot" />
                      {item.status === 'active' ? 'Đang bán' : 'Ngừng'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => openEdit(item)} aria-label="Sửa"><Edit2 size={15} /></button>
                      <button className="table-action-btn table-action-btn--danger" onClick={() => setDeleteConfirm(item)} aria-label="Xóa"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal__icon modal__icon--danger"><Trash2 size={24} /></div>
            <h3 className="modal__title">Xóa sản phẩm?</h3>
            <p className="modal__desc">Xóa "{deleteConfirm.name}" và toàn bộ lịch sử kho liên quan. Hành động này không thể hoàn tác.</p>
            <div className="modal__actions">
              <button className="btn btn--secondary" onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className="btn btn--danger" onClick={() => handleDelete(deleteConfirm.id)}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit slide-over panel */}
      {showForm && (
        <div className="slide-overlay" onClick={closeForm}>
          <div className="slide-panel" onClick={(e) => e.stopPropagation()}>
            <div className="slide-panel__header">
              <h2 className="slide-panel__title">{editingItem ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button className="header__icon-btn" onClick={closeForm} aria-label="Đóng"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="slide-panel__body">
              {formError && <div className="form-error"><AlertTriangle size={14} /> {formError}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="product-name">Tên sản phẩm *</label>
                <input id="product-name" className="form-input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ví dụ: Bút bi Thiên Long" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="product-sku">Mã SKU *</label>
                  <input id="product-sku" className="form-input" required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })} placeholder="BTL-001" style={{ fontFamily: 'monospace' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="product-unit">Đơn vị *</label>
                  <input id="product-unit" className="form-input" required value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="cái, ram, hộp..." />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="product-desc">Mô tả</label>
                <textarea id="product-desc" className="form-input form-textarea" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Mô tả ngắn về sản phẩm..." rows={3} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="product-qty">Số lượng ban đầu</label>
                  <input id="product-qty" type="number" className="form-input" min="0" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="product-status">Trạng thái</label>
                  <select id="product-status" className="form-input" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="active">Đang bán</option>
                    <option value="inactive">Ngừng bán</option>
                  </select>
                </div>
              </div>

              <div className="slide-panel__footer">
                <button type="button" className="btn btn--secondary" onClick={closeForm}>Hủy</button>
                <button type="submit" className="btn btn--primary" disabled={formLoading}>
                  {formLoading ? <><RefreshCw size={14} className="spin" /> Đang lưu...</> : editingItem ? 'Cập nhật' : 'Thêm sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
