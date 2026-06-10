import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "../components/SearchBar";

function CustomerDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/product/all"
      );

      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (keyword) => {
  const res = await axios.get(
    `http://localhost:5000/api/product/search?keyword=${keyword}`
  );

  setProducts(res.data.products);
};
  return (
    <div className="container mt-4">
      <h2>Customer Dashboard</h2>

      <SearchBar onSearch={handleSearch} />

      <div className="row mt-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="col-md-4 mb-4"
          >
            <div className="card">
              <img
                src={`http://localhost:5000/${product.productImage}`}
                alt={product.productName}
                height="200"
              />

              <div className="card-body">
                <h5>{product.productName}</h5>

                <p>₹ {product.price}</p>

                <button
  className="btn btn-success"
  onClick={() =>
    navigate(`/product/${product._id}`)
  }
>
  View
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