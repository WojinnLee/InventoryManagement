import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  Activity,
  TrendingUp,
  RefreshCw,
  Plus,
  ArrowRight,
} from 'lucide-react';
import * as api from '../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [itemsRes, logsRes] = await Promise.all([
        api.getItems(),
        api.getStockLogs(),
      ]);
      setItems(itemsRes.data || []);
      setLogs(logsRes.data || []);

      try {
        await api.checkHealth();
        setHealth('online');
      } catch {
        setHealth('offline');
      }
    } catch (err) {
      setError(err.message);
      setHealth('offline');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const todayLogs = logs.filter((l) => {
    const today = new Date().toDateString();
    return new Date(l.createdAt).toDateString() === today;
  });
  const todayIn = todayLogs.filter((l) => l.type === 'IMPORT').reduce((s, l) => s + l.quantity, 0);
  const todayOut = todayLogs.filter((l) => l.type === 'EXPORT').reduce((s, l) => s + l.quantity, 0);
  const lowStock = items.filter((i) => i.quantity <= 10 && i.status === 'active');

  const STATS = [
    { label: 'Tổng sản phẩm', value: items.length, icon: Package, color: 'var(--color-primary)', bg: 'var(--color-primary-subtle)' },
    { label: 'Nhập kho hôm nay', value: todayIn, icon: ArrowDownToLine, color: 'var(--color-success)', bg: 'var(--color-success-subtle)' },
    { label: 'Xuất kho hôm nay', value: todayOut, icon: ArrowUpFromLine, color: 'var(--color-warning)', bg: 'var(--color-warning-subtle)' },
    { label: 'Sắp hết hàng', value: lowStock.length, icon: AlertTriangle, color: 'var(--color-danger)', bg: 'var(--color-danger-subtle)' },
  ];

  const recentLogs = logs.slice(0, 8);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <RefreshCw size={24} className="spin" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {error && (
        <div className="dashboard-error">
          <AlertTriangle size={16} />
          <span>Không thể kết nối API: {error}</span>
          <button className="btn btn--secondary" onClick={fetchData} style={{ marginLeft: 'auto', padding: '4px 12px', fontSize: '12px' }}>
            <RefreshCw size={14} /> Thử lại
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="dashboard-stats">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className="stat-card__icon" style={{ background: stat.bg }}>
                <Icon size={22} style={{ color: stat.color }} />
              </div>
              <div className="stat-card__info">
                <span className="stat-card__label">{stat.label}</span>
                <span className="stat-card__value">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two columns */}
      <div className="dashboard-grid">
        {/* Recent transactions */}
        <div className="dashboard-panel">
          <div className="dashboard-panel__header">
            <h3 className="dashboard-panel__title">
              <Activity size={18} style={{ color: 'var(--color-primary)' }} />
              Giao dịch gần đây
            </h3>
            <button className="btn btn--secondary btn--sm" onClick={() => navigate('/transactions')}>
              Xem tất cả <ArrowRight size={14} />
            </button>
          </div>
          {recentLogs.length === 0 ? (
            <div className="dashboard-empty">
              <ClipboardIcon />
              <span>Chưa có giao dịch nào</span>
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                <button className="btn btn--primary btn--sm" onClick={() => navigate('/stock-in')}>
                  <ArrowDownToLine size={14} /> Nhập kho
                </button>
              </div>
            </div>
          ) : (
            <div className="log-list">
              {recentLogs.map((log) => (
                <div key={log.id} className="log-item">
                  <div className={`log-item__type ${log.type === 'IMPORT' ? 'log-item__type--in' : 'log-item__type--out'}`}>
                    {log.type === 'IMPORT' ? <ArrowDownToLine size={14} /> : <ArrowUpFromLine size={14} />}
                  </div>
                  <div className="log-item__info">
                    <span className="log-item__name">{log.item?.name || `#${log.itemId}`}</span>
                    <span className="log-item__meta">
                      {log.item?.sku} · {log.note || 'Không có ghi chú'}
                    </span>
                  </div>
                  <div className="log-item__qty">
                    <span className={log.type === 'IMPORT' ? 'text-success' : 'text-warning'}>
                      {log.type === 'IMPORT' ? '+' : '-'}{log.quantity} {log.item?.unit}
                    </span>
                    <span className="log-item__time">{formatTime(log.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock */}
        <div className="dashboard-panel">
          <div className="dashboard-panel__header">
            <h3 className="dashboard-panel__title">
              <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />
              Cảnh báo tồn kho
            </h3>
          </div>
          {lowStock.length === 0 ? (
            <div className="dashboard-empty">
              <div className="dashboard-empty__icon dashboard-empty__icon--success">
                <TrendingUp size={24} />
              </div>
              <span>Tồn kho ổn định</span>
            </div>
          ) : (
            <div className="log-list">
              {lowStock.map((item) => (
                <div key={item.id} className="log-item">
                  <div className="log-item__type log-item__type--warn">
                    <AlertTriangle size={14} />
                  </div>
                  <div className="log-item__info">
                    <span className="log-item__name">{item.name}</span>
                    <span className="log-item__meta">{item.sku}</span>
                  </div>
                  <div className="log-item__qty">
                    <span className="text-danger">{item.quantity} {item.unit}</span>
                    <button className="btn btn--primary btn--sm" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => navigate('/stock-in')}>
                      Nhập thêm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <button className="btn btn--primary" onClick={() => navigate('/products', { state: { openForm: true } })}>
          <Plus size={16} /> Thêm sản phẩm
        </button>
        <button className="btn btn--secondary" onClick={() => navigate('/stock-in')}>
          <ArrowDownToLine size={16} /> Nhập kho
        </button>
        <button className="btn btn--secondary" onClick={() => navigate('/stock-out')}>
          <ArrowUpFromLine size={16} /> Xuất kho
        </button>
      </div>

      {/* Health bar */}
      <div className="dashboard-health">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span className={`status-badge ${health === 'online' ? 'status-badge--success' : 'status-badge--danger'}`}>
            <span className="status-badge__dot" />
            {health === 'online' ? 'Hệ thống hoạt động' : 'Mất kết nối'}
          </span>
          <span className="text-caption">API: {import.meta.env.VITE_API_URL || 'http://localhost:5000'}</span>
        </div>
        <button className="btn btn--secondary btn--sm" onClick={fetchData}>
          <RefreshCw size={14} /> Làm mới
        </button>
      </div>
    </div>
  );
}

function formatTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Vừa xong';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
  return d.toLocaleDateString('vi-VN');
}

function ClipboardIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-border-strong)' }}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" />
    </svg>
  );
}
