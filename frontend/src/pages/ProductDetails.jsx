import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/product/${id}`
      );
      setProduct(res.data.product);
    } catch (error) {
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <h3 className="container mt-5">Loading...</h3>;
  if (!product) return <h3 className="container mt-5">Not found</h3>;

  return (
    <div className="container mt-5">
      <div className="card p-4">

        <img
          src={`http://localhost:5000/${product.productImage}`}
          width="250"
          alt=""
        />

        <h2>{product.productName}</h2>
        <p>{product.description}</p>
        <h4>₹ {product.price}</h4>

        <button className="btn btn-success" onClick={addToCart}>
          Add To Cart
        </button>

      </div>
    </div>
  );
}

export default ProductDetails;