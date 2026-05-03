import { useState, useEffect, useCallback } from 'react';
import {
  ArrowDownToLine,
  Check,
  AlertTriangle,
  RefreshCw,
  Package,
} from 'lucide-react';
import * as api from '../services/api';

export default function StockInPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ itemId: '', quantity: '', note: '' });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, logsRes] = await Promise.all([api.getItems(), api.getStockLogs()]);
      setItems((itemsRes.data || []).filter((i) => i.status === 'active'));
      setRecentLogs((logsRes.data || []).filter((l) => l.type === 'IMPORT').slice(0, 5));
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const selectedItem = items.find((i) => i.id === Number(formData.itemId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const res = await api.stockIn({ itemId: Number(formData.itemId), quantity: Number(formData.quantity), note: formData.note });
      setToast({ msg: `Nhập ${formData.quantity} ${selectedItem?.unit || ''} "${selectedItem?.name}" thành công`, type: 'success' });
      setFormData({ itemId: '', quantity: '', note: '' });
      fetchData();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="stock-page">
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="stock-page__grid">
        {/* Form */}
        <div className="stock-form-card">
          <div className="stock-form-card__header stock-form-card__header--in">
            <ArrowDownToLine size={20} />
            <h2>Nhập kho</h2>
          </div>

          <form onSubmit={handleSubmit} className="stock-form">
            {formError && <div className="form-error"><AlertTriangle size={14} /> {formError}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="stock-in-item">Sản phẩm *</label>
              <select id="stock-in-item" className="form-input" required value={formData.itemId} onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}>
                <option value="">Chọn sản phẩm...</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>{item.name} ({item.sku}) — Tồn: {item.quantity} {item.unit}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="stock-in-qty">Số lượng nhập *</label>
              <input id="stock-in-qty" type="number" className="form-input" min="1" required value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} placeholder="0" />
              {selectedItem && formData.quantity && (
                <span className="form-hint">
                  Sau khi nhập: {selectedItem.quantity + Number(formData.quantity)} {selectedItem.unit}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="stock-in-note">Ghi chú</label>
              <textarea id="stock-in-note" className="form-input form-textarea" rows={2} value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} placeholder="Ví dụ: Nhập hàng đợt 2 tháng 5" />
            </div>

            <button type="submit" className="btn btn--primary" style={{ width: '100%' }} disabled={formLoading}>
              {formLoading ? <><RefreshCw size={14} className="spin" /> Đang xử lý...</> : <><ArrowDownToLine size={16} /> Xác nhận nhập kho</>}
            </button>
          </form>
        </div>

        {/* Recent */}
        <div className="stock-recent">
          <h3 className="text-title" style={{ marginBottom: 'var(--space-4)' }}>Nhập kho gần đây</h3>
          {loading ? (
            <div className="table-loading"><RefreshCw size={16} className="spin" /></div>
          ) : recentLogs.length === 0 ? (
            <div className="dashboard-empty" style={{ minHeight: 200 }}>
              <Package size={32} strokeWidth={1} style={{ color: 'var(--color-border-strong)' }} />
              <span className="text-caption">Chưa có lịch sử nhập kho</span>
            </div>
          ) : (
            <div className="log-list">
              {recentLogs.map((log) => (
                <div key={log.id} className="log-item">
                  <div className="log-item__type log-item__type--in"><ArrowDownToLine size={14} /></div>
                  <div className="log-item__info">
                    <span className="log-item__name">{log.item?.name}</span>
                    <span className="log-item__meta">{log.note || 'Không có ghi chú'}</span>
                  </div>
                  <div className="log-item__qty">
                    <span className="text-success">+{log.quantity} {log.item?.unit}</span>
                    <span className="log-item__time">{new Date(log.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
