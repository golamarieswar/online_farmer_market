import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FarmerDashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    console.log("TOKEN CHECK:", token);

    if (!token) {
      alert("Please login first");
      navigate("/farmer-login");
      return;
    }

    getProfile();
    getProducts();
  }, []);

  const getProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/farmer/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(res.data.farmer);
    } catch (err) {
      console.log(err);
    }
  };

  const getProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/product/farmer/my-products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Farmer Dashboard</h2>

      {profile && (
        <div className="card p-3 mb-3">
          <h5>{profile.fullName}</h5>
          <p>{profile.email}</p>
        </div>
      )}

      <button
  className="btn btn-dark ms-2"
  onClick={() => navigate("/farmer-orders")}
>
  View Orders
</button>

      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate("/add-product")}
      >
        Add Product
      </button>

      <h4>My Products</h4>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((p) => (
          <div key={p._id} className="card p-2 mb-2">
            <strong>{p.productName}</strong>
            <div>Status: {p.verificationStatus}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default FarmerDashboard;