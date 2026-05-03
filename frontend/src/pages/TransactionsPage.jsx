import { useState, useEffect, useCallback } from 'react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  RefreshCw,
  ClipboardList,
  Filter,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import * as api from '../services/api';

export default function TransactionsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getStockLogs();
      setLogs(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filtered = logs.filter((l) => {
    const matchSearch =
      (l.item?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.item?.sku || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.note || '').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || l.type === typeFilter;
    return matchSearch && matchType;
  });

  // Group by date
  const grouped = {};
  filtered.forEach((log) => {
    const dateKey = new Date(log.createdAt).toLocaleDateString('vi-VN');
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(log);
  });

  const totalIn = filtered.filter((l) => l.type === 'IMPORT').reduce((s, l) => s + l.quantity, 0);
  const totalOut = filtered.filter((l) => l.type === 'EXPORT').reduce((s, l) => s + l.quantity, 0);

  return (
    <div className="transactions-page">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar__left">
          <div className="toolbar__search">
            <Search size={16} className="toolbar__search-icon" />
            <input type="text" placeholder="Tìm sản phẩm, SKU, ghi chú..." value={search} onChange={(e) => setSearch(e.target.value)} className="toolbar__search-input" id="tx-search" />
          </div>
          <div className="toolbar__filter">
            <Filter size={14} />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="toolbar__select" id="type-filter">
              <option value="all">Tất cả</option>
              <option value="IMPORT">Nhập kho</option>
              <option value="EXPORT">Xuất kho</option>
            </select>
          </div>
        </div>
        <div className="toolbar__right">
          <div className="toolbar__summary">
            <span className="text-success" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ArrowDownToLine size={14} /> +{totalIn}</span>
            <span className="text-warning" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ArrowUpFromLine size={14} /> -{totalOut}</span>
          </div>
          <span className="text-caption">{filtered.length} giao dịch</span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="table-loading"><RefreshCw size={20} className="spin" /> Đang tải...</div>
      ) : error ? (
        <div className="table-error"><AlertTriangle size={20} /><span>{error}</span><button className="btn btn--secondary btn--sm" onClick={fetchLogs}><RefreshCw size={14} /> Thử lại</button></div>
      ) : filtered.length === 0 ? (
        <div className="table-empty">
          <ClipboardList size={48} strokeWidth={1} />
          <span className="table-empty__title">{logs.length === 0 ? 'Chưa có giao dịch nào' : 'Không tìm thấy kết quả'}</span>
          <span className="text-caption">Các giao dịch nhập/xuất kho sẽ hiển thị tại đây</span>
        </div>
      ) : (
        <div className="tx-timeline">
          {Object.entries(grouped).map(([date, groupLogs]) => (
            <div key={date} className="tx-group">
              <div className="tx-group__date">
                <Calendar size={14} /> {date}
                <span className="text-caption">({groupLogs.length} giao dịch)</span>
              </div>
              <div className="log-list">
                {groupLogs.map((log) => (
                  <div key={log.id} className="log-item">
                    <div className={`log-item__type ${log.type === 'IMPORT' ? 'log-item__type--in' : 'log-item__type--out'}`}>
                      {log.type === 'IMPORT' ? <ArrowDownToLine size={14} /> : <ArrowUpFromLine size={14} />}
                    </div>
                    <div className="log-item__info">
                      <span className="log-item__name">{log.item?.name || `Item #${log.itemId}`}</span>
                      <span className="log-item__meta">
                        <code className="sku-code" style={{ fontSize: 11 }}>{log.item?.sku}</code>
                        {log.note && <> · {log.note}</>}
                      </span>
                    </div>
                    <div className="log-item__qty">
                      <span className={log.type === 'IMPORT' ? 'text-success' : 'text-warning'}>
                        {log.type === 'IMPORT' ? '+' : '-'}{log.quantity} {log.item?.unit}
                      </span>
                      <span className="log-item__time">
                        {new Date(log.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
