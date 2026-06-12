import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { assetUrl } from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await API.get(`/api/product/${id}`);
      setProduct(res.data.product);
    } catch {
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        _id: product._id,
        productName: product.productName,
        price: product.price,
        productImage: product.productImage,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart");

    navigate("/cart"); // IMPORTANT FIX
  };

  if (loading) return <div className="container page-section">Loading product...</div>;
  if (!product) return <div className="container page-section">Product not found.</div>;

  return (
    <div className="container page-section">
      <div className="product-detail">

        <img
          src={assetUrl(product.productImage)}
          alt={product.productName}
        />

        <div>
          <span className="eyebrow">{product.category}</span>
          <h2>{product.productName}</h2>
          <p className="lead">{product.description}</p>
          <div className="product-meta detail-meta">
            <strong>₹ {product.price}</strong>
            <span>{product.quantity} in stock</span>
          </div>

          <button className="btn btn-success btn-lg" onClick={addToCart}>
            Add To Cart
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;
