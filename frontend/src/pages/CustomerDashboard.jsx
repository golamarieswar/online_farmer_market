import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import API, { assetUrl } from "../services/api";

function CustomerDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get("/api/product/all");

      setProducts(res.data.products);
    } catch {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = async (keyword) => {
  const res = await API.get(`/api/product/search?keyword=${encodeURIComponent(keyword)}`);

  setProducts(res.data.products);
};
  return (
    <div className="container page-section">
      <div className="page-header">
        <div>
          <span className="eyebrow">Marketplace</span>
          <h2>Available Products</h2>
        </div>
        <button className="btn btn-outline-success" onClick={() => navigate("/cart")}>
          View Cart
        </button>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="row mt-4">
        {products.length === 0 ? (
          <div className="empty-state">
            <h4>No approved products yet</h4>
            <p>Products will appear here after admin verification.</p>
          </div>
        ) : products.map((product) => (
          <div
            key={product._id}
            className="col-md-4 mb-4"
          >
            <div className="card product-card">
              <img
                src={assetUrl(product.productImage)}
                alt={product.productName}
                className="product-image"
              />

              <div className="card-body">
                <h5>{product.productName}</h5>
                <p className="text-muted">{product.category}</p>
                <div className="product-meta">
                  <strong>₹ {product.price}</strong>
                  <span>{product.quantity} in stock</span>
                </div>

                <button
                  className="btn btn-success w-100"
                  onClick={() =>
                    navigate(`/product/${product._id}`)
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerDashboard;
