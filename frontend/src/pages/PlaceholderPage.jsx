import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
  Settings,
} from 'lucide-react';

const PAGES = {
  products: { icon: Package, title: 'Sản phẩm', desc: 'Quản lý danh sách sản phẩm, mã SKU và phân loại.' },
  'stock-in': { icon: ArrowDownToLine, title: 'Nhập kho', desc: 'Tạo phiếu nhập và cập nhật tồn kho.' },
  'stock-out': { icon: ArrowUpFromLine, title: 'Xuất kho', desc: 'Tạo đơn xuất kho và kiểm tra tồn.' },
  transactions: { icon: ClipboardList, title: 'Lịch sử kho', desc: 'Xem toàn bộ lịch sử nhập/xuất kho.' },
  settings: { icon: Settings, title: 'Cài đặt', desc: 'Cấu hình hệ thống và tài khoản.' },
};

export default function PlaceholderPage({ pageKey }) {
  const page = PAGES[pageKey] || { icon: Package, title: 'Trang', desc: '' };
  const Icon = page.icon;

  return (
    <div className="page-placeholder">
      <Icon className="page-placeholder__icon" size={48} strokeWidth={1.2} />
      <span className="page-placeholder__title">{page.title}</span>
      <span className="text-caption" style={{ maxWidth: 320, textAlign: 'center' }}>
        {page.desc}
      </span>
      <span style={{
        marginTop: 'var(--space-2)',
        fontSize: 'var(--font-size-caption)',
        color: 'var(--color-text-tertiary)',
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '4px 12px',
      }}>
        Đang phát triển
      </span>
    </div>
  );
}
