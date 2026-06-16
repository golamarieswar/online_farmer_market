import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { assetUrl, authHeader } from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      const headers = authHeader();
      const [statsRes, farmersRes, productsRes] = await Promise.all([
        API.get("/api/admin/dashboard", { headers }),
        API.get("/api/admin/farmers/pending", { headers }),
        API.get("/api/admin/products/pending", { headers }),
      ]);

      setStats(statsRes.data.stats);
      setFarmers(farmersRes.data.farmers);
      setProducts(productsRes.data.products);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/admin-login");
      return;
    }

    loadDashboard();
  }, [loadDashboard, navigate]);

  const updateFarmer = async (id, action) => {
    const reason = action === "reject" ? prompt("Reason for rejection?") : "";
    await API.put(
      `/api/admin/farmers/${action}/${id}`,
      { reason },
      { headers: authHeader() }
    );
    loadDashboard();
  };

  const updateProduct = async (id, action) => {
    const reason = action === "reject" ? prompt("Reason for rejection?") : "";
    await API.put(
      `/api/admin/products/${action}/${id}`,
      { reason },
      { headers: authHeader() }
    );
    loadDashboard();
  };

  const formatDate = (value) => {
    if (!value) return "Not available";

    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return <div className="container mt-5">Loading admin dashboard...</div>;
  }

  return (
    <div className="container page-section text-start">
      <div className="page-header">
        <div>
          <span className="eyebrow">Verification</span>
          <h2>Admin Dashboard</h2>
        </div>
        <button
          className="btn btn-outline-danger"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      {stats && (
        <div className="row g-3 mb-4">
          {Object.entries(stats).map(([key, value]) => (
            <div className="col-md-3" key={key}>
              <div className="card p-3">
                <small className="text-muted text-capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </small>
                <h3 className="mb-0">{value}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      <h4>Pending Farmers</h4>
      {farmers.length === 0 ? (
        <div className="empty-state compact">No pending farmers.</div>
      ) : (
        farmers.map((farmer) => (
          <div key={farmer._id} className="card review-row farmer-review-row">
            <div className="review-content">
              <div className="review-title-row">
                <div>
                  <h5>{farmer.fullName}</h5>
                  <p>{farmer.email} · {farmer.mobileNumber}</p>
                </div>
                <span className="status-pill">{farmer.verificationStatus}</span>
              </div>

              <div className="detail-grid">
                <div>
                  <span>Aadhaar Number</span>
                  <strong>{farmer.aadhaarNumber}</strong>
                </div>
                <div>
                  <span>Address</span>
                  <strong>{farmer.address}</strong>
                </div>
                <div>
                  <span>Registered</span>
                  <strong>{formatDate(farmer.createdAt)}</strong>
                </div>
                <div>
                  <span>Farmer ID</span>
                  <strong>{farmer._id}</strong>
                </div>
              </div>

              <div className="document-grid">
                <a
                  href={assetUrl(farmer.aadhaarImage)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={assetUrl(farmer.aadhaarImage)} alt="Aadhaar document" />
                  <span>Aadhaar Document</span>
                </a>
                <a
                  href={assetUrl(farmer.farmerCardImage)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={assetUrl(farmer.farmerCardImage)} alt="Farmer card" />
                  <span>Farmer Card</span>
                </a>
              </div>
            </div>
            <div className="review-actions">
              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => updateFarmer(farmer._id, "approve")}
              >
                Approve
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => updateFarmer(farmer._id, "reject")}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}

      <h4 className="mt-4">Pending Products</h4>
      {products.length === 0 ? (
        <div className="empty-state compact">No pending products.</div>
      ) : (
        products.map((product) => (
          <div key={product._id} className="card review-row">
            <div>
              <h5>{product.productName}</h5>
              <p>
                Farmer: {product.farmerId?.fullName} · {product.category} · ₹ {product.price}
              </p>
            </div>
            <div>
              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => updateProduct(product._id, "approve")}
              >
                Approve
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => updateProduct(product._id, "reject")}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
