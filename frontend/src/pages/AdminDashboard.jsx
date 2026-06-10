import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/all-products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
      alert("Admin fetch failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>

      {products.length === 0 ? (
        <p>No products</p>
      ) : (
        products.map((p) => (
          <div key={p._id} className="card p-3 mb-2">
            <h5>{p.productName}</h5>
            <p>Status: {p.verificationStatus}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;