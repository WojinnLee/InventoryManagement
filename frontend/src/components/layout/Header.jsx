import { useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  ChevronRight,
} from 'lucide-react';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/products': 'Sản phẩm',
  '/stock-in': 'Nhập kho',
  '/stock-out': 'Xuất kho',
  '/transactions': 'Lịch sử giao dịch',
  '/settings': 'Cài đặt',
};

export default function Header({ onMobileMenuToggle }) {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || 'EZ-Inventory';

  return (
    <header className="header" role="banner">
      <div className="header__left">
        <button
          className="header__icon-btn header__mobile-menu-btn"
          onClick={onMobileMenuToggle}
          aria-label="Mở menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="text-caption" style={{ color: 'var(--color-text-tertiary)' }}>
            EZ-Inventory
          </span>
          <ChevronRight size={14} style={{ color: 'var(--color-text-tertiary)' }} />
          <h1 className="header__page-title">{pageTitle}</h1>
        </div>
      </div>

      <div className="header__search">
        <Search size={16} className="header__search-icon" />
        <input
          type="search"
          className="header__search-input"
          placeholder="Tìm sản phẩm, SKU..."
          aria-label="Tìm kiếm"
          id="global-search"
        />
        <kbd className="header__search-shortcut">⌘K</kbd>
      </div>

      <div className="header__right">
        <button
          className="header__icon-btn"
          aria-label="Trợ giúp"
          id="help-btn"
        >
          <HelpCircle size={20} />
        </button>

        <button
          className="header__icon-btn"
          aria-label="Thông báo"
          id="notifications-btn"
        >
          <Bell size={20} />
          <span className="header__notification-dot" aria-label="Có thông báo mới" />
        </button>

        <div className="header__divider" />

        <button className="header__user" aria-label="Menu người dùng" id="user-menu-btn">
          <div className="header__avatar" aria-hidden="true">QT</div>
          <div className="header__user-info">
            <span className="header__user-name">Quản trị viên</span>
            <span className="header__user-role">Admin</span>
          </div>
        </button>
      </div>
    </header>
  );
}
