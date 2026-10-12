import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/account", label: "OVERVIEW", end: true },
  { to: "/account/orders", label: "ORDERS" },
  { to: "/account/addresses", label: "ADDRESSES" },
  { to: "/account/settings", label: "SETTINGS" },
];

export default function AccountLayout() {
  const { profile, user } = useAuth();

  return (
    <section className="account">
      <div className="container">
        {/* Header */}
        <div className="account-head">
          <p className="section-eyebrow">MY ACCOUNT</p>
          <h1 className="account-title">
            {profile?.name
              ? `HI, ${profile.name.split(" ")[0].toUpperCase()}.`
              : "WELCOME."}
          </h1>
          <p className="account-sub">{user?.email}</p>
        </div>

        {/* Nav */}
        <nav className="account-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `account-nav-link ${isActive ? "is-active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Content */}
        <div className="account-body">
          <Outlet />
        </div>
      </div>
    </section>
  );
}