import { useEffect, useState } from "react";
import API, { authHeader } from "../services/api";

function Cart() {
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const getTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const placeOrderFromCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      return;
    }

    if (!deliveryAddress.trim()) {
      alert("Delivery address is required");
      return;
    }

    try {
      for (let item of cart) {
        await API.post(
          "/api/order/place",
          {
            productId: item._id,
            quantity: item.quantity,
            deliveryAddress,
            paymentMethod: "cod",
          },
          { headers: authHeader() }
        );
      }

      alert("Order placed successfully");

      localStorage.removeItem("cart");
      setCart([]);
    } catch (err) {
      alert(
        err.response?.data?.message || "Order failed"
      );
    }
  };

  return (
    <div className="container page-section">
      <div className="page-header">
        <div>
          <span className="eyebrow">Checkout</span>
          <h2>My Cart</h2>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <h4>Cart is empty</h4>
          <p>Add products from the marketplace to place an order.</p>
        </div>
      ) : (
        <div className="checkout-grid">
          <div>
            {cart.map((item) => (
              <div key={item._id} className="card cart-row">
                <div>
                  <h5>{item.productName}</h5>
                  <p>₹ {item.price} x {item.quantity}</p>
                </div>

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <aside className="card checkout-summary">
            <span className="eyebrow">Order Summary</span>
            <h4>Total: ₹ {getTotal()}</h4>

            <textarea
              className="form-control mt-3"
              placeholder="Delivery address"
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              required
            />

            <button
              className="btn btn-success mt-3 w-100"
              onClick={placeOrderFromCart}
            >
              Place COD Order
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
