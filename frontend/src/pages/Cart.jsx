import { useEffect, useState } from "react";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  };

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

    try {
      for (let item of cart) {
        await axios.post(
          "http://localhost:5000/api/order/place",
          {
            productId: item._id,
            quantity: item.quantity,
            deliveryAddress: "Default Address",
            paymentMethod: "cod",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
    <div className="container mt-5">
      <h2>My Cart</h2>

      {cart.length === 0 ? (
        <h4>Cart is Empty</h4>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="card p-3 mb-2">
              <h5>{item.productName}</h5>
              <p>₹ {item.price}</p>
              <p>Qty: {item.quantity}</p>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeItem(item._id)}
              >
                Remove
              </button>
            </div>
          ))}

          <hr />

          <h4>Total: ₹ {getTotal()}</h4>

          <button
            className="btn btn-success mt-3"
            onClick={placeOrderFromCart}
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;