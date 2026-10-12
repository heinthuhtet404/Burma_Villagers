import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import AdminTopbar from "../AdminTopbar";
import { formatPrice } from "../../lib/format";
import { getLowStockProducts } from "../../lib/products";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    variants: 0,
    orders: 0,
    revenue: 0,
    pending: 0,
  });
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [productsRes, variantsRes, ordersRes, lowStockData] =
          await Promise.all([
            supabase
              .from("products")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("variants")
              .select("id", { count: "exact", head: true }),
            supabase.from("orders").select("id, total, status"),
            getLowStockProducts(10),
          ]);

        const orders = ordersRes.data || [];
        const revenue = orders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + (o.total || 0), 0);
        const pending = orders.filter(
          (o) => o.status === "pending"
        ).length;

        if (!mounted) return;

        setStats({
          products: productsRes.count || 0,
          variants: variantsRes.count || 0,
          orders: orders.length,
          revenue,
          pending,
        });
        setLowStock(lowStockData);
      } catch (err) {
        console.error("dashboard error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <AdminTopbar title="DASHBOARD" />

      <div className="admin-content">
        <div className="admin-stats">
          <div className="admin-stat">
            <p className="admin-stat-key">PRODUCTS</p>
            <p className="admin-stat-value">
              {loading ? "—" : stats.products}
            </p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat-key">VARIANTS</p>
            <p className="admin-stat-value">
              {loading ? "—" : stats.variants}
            </p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat-key">ORDERS</p>
            <p className="admin-stat-value">
              {loading ? "—" : stats.orders}
            </p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat-key">REVENUE</p>
            <p className="admin-stat-value">
              {loading ? "—" : formatPrice(stats.revenue, "MMK")}
            </p>
          </div>
        </div>

        {/* Low stock alerts */}
        {!loading && lowStock.length > 0 && (
          <div className="admin-alert">
            <p className="admin-alert-title">
              ⚠ LOW STOCK — {lowStock.length} PRODUCT{lowStock.length !== 1 ? "S" : ""}
            </p>
            <div className="admin-alert-list">
              {lowStock.map((p) => (
                <Link
                  key={p.id}
                  to={`/admin/products/${p.id}`}
                  className="admin-alert-item"
                >
                  <span className="admin-alert-item-name">
                    {p.name}
                  </span>
                  <span className="admin-alert-item-stock">
                    {p.totalStock} LEFT
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pending orders alert */}
        {!loading && stats.pending > 0 && (
          <div className="admin-alert admin-alert--info">
            <p className="admin-alert-title">
              📦 {stats.pending} PENDING ORDER{stats.pending !== 1 ? "S" : ""}
            </p>
            <Link to="/admin/orders" className="admin-btn-primary">
              VIEW ORDERS →
            </Link>
          </div>
        )}

        <div className="admin-panel">
          <p className="admin-panel-title">QUICK ACTIONS</p>
          <div className="admin-actions">
            <Link to="/admin/products" className="admin-action">
              MANAGE PRODUCTS →
            </Link>
            <Link to="/admin/orders" className="admin-action">
              VIEW ORDERS →
            </Link>
            <Link to="/admin/products/new" className="admin-action">
              + NEW PRODUCT
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}