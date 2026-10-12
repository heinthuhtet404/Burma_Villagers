import AdminTopbar from "../AdminTopbar";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../../lib/admin";

export default function AdminProductNew() {
  return (
    <>
      <AdminTopbar title="NEW PRODUCT" />
      <div className="admin-content">
        <ProductForm
          onSubmit={createProduct}
          submitLabel="CREATE PRODUCT"
        />
      </div>
    </>
  );
}