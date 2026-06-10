import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="card h-100">

      <img
        src={`http://localhost:5000/${product.productImage}`}
        className="card-img-top"
        alt={product.productName}
        height="220"
      />

      <div className="card-body">

        <h5>{product.productName}</h5>

        <p>
          ₹ {product.price}
        </p>

        <p>
          Stock: {product.quantity}
        </p>

        <button
          className="btn btn-success"
          onClick={() =>
            navigate(`/product/${product._id}`)
          }
        >
          View Details
        </button>

      </div>
    </div>
  );
}

export default ProductCard;