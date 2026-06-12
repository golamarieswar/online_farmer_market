import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { authHeader } from "../services/api";

function ProductForm() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    productName: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    productImage: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, productImage: e.target.files[0] });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Login required");
      return;
    }

    const data = new FormData();

    data.append("productName", form.productName);
    data.append("description", form.description);
    data.append("category", form.category);
    data.append("price", form.price);
    data.append("quantity", form.quantity);
    data.append("productImage", form.productImage);

    try {
      const res = await API.post(
        "/api/product/add",
        data,
        {
          headers: {
            ...authHeader(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message || "Product Added");

      navigate("/farmer-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Add Product Failed");
    }
  };

  return (
    <div className="container page-section form-page">
      <span className="eyebrow">Inventory</span>
      <h2>Add Product</h2>

      <form onSubmit={submit} className="card form-card">
        <input
          name="productName"
          placeholder="Product Name"
          className="form-control mb-2"
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Description"
          className="form-control mb-2"
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          className="form-control mb-2"
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Price"
          className="form-control mb-2"
          onChange={handleChange}
        />

        <input
          name="quantity"
          placeholder="Quantity"
          className="form-control mb-2"
          onChange={handleChange}
        />

        <input
          type="file"
          className="form-control mb-3"
          onChange={handleFile}
        />

        <button className="btn btn-success">
          Submit For Approval
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
