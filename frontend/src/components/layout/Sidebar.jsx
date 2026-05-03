import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
  Settings,
  ChevronsLeft,
  Box,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'Tổng quan',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Nghiệp vụ',
    items: [
      { to: '/products', icon: Package, label: 'Sản phẩm', badge: null },
      { to: '/stock-in', icon: ArrowDownToLine, label: 'Nhập kho' },
      { to: '/stock-out', icon: ArrowUpFromLine, label: 'Xuất kho' },
      { to: '/transactions', icon: ClipboardList, label: 'Lịch sử giao dịch' },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { to: '/settings', icon: Settings, label: 'Cài đặt' },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar__mobile-overlay ${mobileOpen ? 'sidebar__mobile-overlay--visible' : ''}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${mobileOpen ? 'sidebar--mobile-open' : ''}`}
        role="navigation"
        aria-label="Menu chính"
      >
        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__brand-icon" aria-hidden="true">
            <Box size={18} strokeWidth={2.5} />
          </div>
          <div className="sidebar__brand-text">
            <span className="sidebar__brand-name">EZ-Inventory</span>
            <span className="sidebar__brand-tagline">Quản lý kho</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div className="sidebar__section-label">{section.label}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                    onClick={onMobileClose}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="sidebar__link-icon">
                      <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                    </span>
                    <span className="sidebar__link-label">{item.label}</span>
                    {item.badge != null && (
                      <span className="sidebar__badge">{item.badge}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer: Collapse toggle */}
        <div className="sidebar__footer">
          <button
            className="sidebar__collapse-btn"
            onClick={onToggle}
            aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            <ChevronsLeft size={18} className="sidebar__collapse-icon" />
            <span className="sidebar__link-label">Thu gọn</span>
          </button>
        </div>
      </aside>
    </>
  );
}
