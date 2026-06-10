import { useEffect, useState } from "react";
import axios from "axios";

function FarmerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/order/farmer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data.orders);
    } catch (err) {
      console.log(err);
      alert("Failed to load farmer orders");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Farmer Orders</h2>

      {orders.length === 0 ? (
        <p>No orders received yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card p-3 mb-2">

            <h5>Product: {order.productId?.productName}</h5>

            <p>Customer: {order.customerId?.fullName}</p>

            <p>Quantity: {order.quantity}</p>

            <p>Status: {order.orderStatus}</p>

            <p>Payment: {order.paymentStatus}</p>

          </div>
        ))
      )}
    </div>
  );
}

export default FarmerOrders;