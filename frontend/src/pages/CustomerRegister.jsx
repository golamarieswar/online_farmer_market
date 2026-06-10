import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FarmerDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
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
    } catch (error) {
      console.error(error);
      alert("Failed to load profile");
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
    } catch (error) {
      console.error(error);
      alert("Failed to load products");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Farmer Dashboard</h2>

      {profile && (
        <div className="card p-3 mb-4">
          <h4>{profile.fullName}</h4>

          <p>
            <strong>Email:</strong>{" "}
            {profile.email}
          </p>

          <p>
            <strong>Mobile:</strong>{" "}
            {profile.mobileNumber}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {profile.verificationStatus}
          </p>
        </div>
      )}

      <button
        className="btn btn-primary mb-4"
        onClick={() =>
          navigate("/add-product")
        }
      >
        Add Product
      </button>

      <h4>My Products</h4>

      {products.length === 0 ? (
        <div className="alert alert-info">
          No products added yet.
        </div>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            className="card p-3 mb-3"
          >
            <h5>{product.productName}</h5>

            <p>
              <strong>Price:</strong> ₹
              {product.price}
            </p>

            <p>
              <strong>Quantity:</strong>{" "}
              {product.quantity}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {product.verificationStatus}
            </p>

            {product.productImage && (
              <img
                src={`http://localhost:5000/${product.productImage}`}
                alt={product.productName}
                width="200"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default FarmerDashboard;