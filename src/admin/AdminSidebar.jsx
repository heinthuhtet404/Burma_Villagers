import { NavLink } from "react-router-dom";

const NAV = [
  { to: "/admin", label: "DASHBOARD", end: true },
  { to: "/admin/products", label: "PRODUCTS" },
  { to: "/admin/orders", label: "ORDERS" },
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span className="admin-sidebar-brand-mark">BV</span>
        <div>
          <p className="admin-sidebar-brand-name">BURMA VILLAGERS</p>
          <p className="admin-sidebar-brand-tag">ADMIN</p>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "is-active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-foot">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="admin-sidebar-link"
        >
          VIEW STORE ↗
        </a>
      </div>
    </aside>
  );
}