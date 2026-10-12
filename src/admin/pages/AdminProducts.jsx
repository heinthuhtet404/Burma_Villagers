import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminTopbar from "../AdminTopbar";
import { getAllProductsForAdmin, deleteProduct } from "../../lib/admin";
import { formatPrice } from "../../lib/format";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllProductsForAdmin();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setConfirmDelete(null);
      setProducts((list) => list.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <>
      <AdminTopbar title="PRODUCTS" />

      <div className="admin-content">
        <div className="admin-toolbar">
          <p className="admin-toolbar-count">
            {loading ? "LOADING…" : `${products.length} PRODUCT${products.length === 1 ? "" : "S"}`}
          </p>
          <Link to="/admin/products/new" className="admin-btn-primary">
            + NEW PRODUCT
          </Link>
        </div>

        {error && <p className="admin-form-error">{error}</p>}

        {!loading && products.length === 0 && (
          <div className="admin-placeholder">
            <p>NO PRODUCTS YET</p>
            <Link to="/admin/products/new" className="admin-btn-primary">
              + ADD FIRST PRODUCT
            </Link>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>NAME</th>
                  <th>SLUG</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-table-thumb">
                        {p.images[0] ? (
                          <img src={p.images[0]} alt="" />
                        ) : (
                          <span />
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="admin-table-name">{p.name}</span>
                      {p.isNew && (
                        <span className="admin-table-badge">NEW</span>
                      )}
                    </td>
                    <td>
                      <code className="admin-table-code">{p.slug}</code>
                    </td>
                    <td>{formatPrice(p.price, p.currency)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span
                        className={`admin-table-status ${
                          p.isActive ? "is-active" : "is-inactive"
                        }`}
                      >
                        {p.isActive ? "ACTIVE" : "HIDDEN"}
                      </span>
                    </td>
                    <td className="admin-table-actions">
                      <Link
                        to={`/admin/products/${p.id}`}
                        className="admin-table-btn"
                      >
                        EDIT
                      </Link>
                      <button
                        className="admin-table-btn admin-table-btn--danger"
                        onClick={() => setConfirmDelete(p)}
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <p className="admin-modal-title">DELETE PRODUCT?</p>
            <p className="admin-modal-text">
              <strong>{confirmDelete.name}</strong> will be permanently removed.
            </p>
            <div className="admin-modal-actions">
              <button
                className="admin-form-btn admin-form-btn--ghost"
                onClick={() => setConfirmDelete(null)}
              >
                CANCEL
              </button>
              <button
                className="admin-form-btn admin-form-btn--danger"
                onClick={() => handleDelete(confirmDelete.id)}
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}