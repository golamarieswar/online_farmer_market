import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { authHeader } from "../services/api";

function FarmerDashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);

  const getProfile = useCallback(async () => {
    try {
      const res = await API.get("/api/farmer/profile", {
        headers: authHeader(),
      });

      setProfile(res.data.farmer);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load profile");
    }
  }, []);

  const getProducts = useCallback(async () => {
    try {
      const res = await API.get("/api/product/farmer/my-products", {
        headers: authHeader(),
      });

      setProducts(res.data.products);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load products");
    }
  }, []);

  useEffect(() => {
    if (!token) {
      alert("Please login first");
      navigate("/farmer-login");
      return;
    }

    getProfile();
    getProducts();
  }, [getProducts, getProfile, navigate, token]);

  return (
    <div className="container page-section">
      <div className="page-header">
        <div>
          <span className="eyebrow">Seller workspace</span>
          <h2>Farmer Dashboard</h2>
        </div>
      </div>

      {profile && (
        <div className="profile-card mb-4">
          <div>
            <h5>{profile.fullName}</h5>
            <p>{profile.email}</p>
          </div>
          <span className="status-pill">{profile.verificationStatus}</span>
        </div>
      )}

      <div className="dashboard-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/add-product")}
        >
          Add Product
        </button>

        <button
          className="btn btn-dark"
          onClick={() => navigate("/farmer-orders")}
        >
          View Orders
        </button>
      </div>

      <h4>My Products</h4>

      {products.length === 0 ? (
        <div className="empty-state">
          <h4>No products found</h4>
          <p>Add your first product and wait for admin approval.</p>
        </div>
      ) : (
        products.map((p) => (
          <div key={p._id} className="card order-row">
            <div>
              <strong>{p.productName}</strong>
              <p className="mb-0 text-muted">₹ {p.price} · Qty {p.quantity}</p>
            </div>
            <span className="status-pill">{p.verificationStatus}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default FarmerDashboard;
