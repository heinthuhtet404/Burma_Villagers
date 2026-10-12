import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopbar from "../AdminTopbar";
import ProductForm from "../components/ProductForm";
import { getProductForAdmin, updateProduct } from "../../lib/admin";

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getProductForAdmin(id);
        if (!data) throw new Error("Product not found");
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <>
        <AdminTopbar title="EDIT PRODUCT" />
        <div className="admin-content">
          <p className="admin-placeholder">LOADING…</p>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <AdminTopbar title="EDIT PRODUCT" />
        <div className="admin-content">
          <p className="admin-form-error">{error || "Not found"}</p>
          <button
            className="admin-btn-primary"
            onClick={() => navigate("/admin/products")}
          >
            ← BACK
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title="EDIT PRODUCT" />
      <div className="admin-content">
        <ProductForm
          initial={product}
          onSubmit={(data) => updateProduct(id, data)}
          submitLabel="SAVE CHANGES"
        />
      </div>
    </>
  );
}