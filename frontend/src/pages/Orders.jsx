import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/order/customer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data.orders);
    } catch (err) {
      console.log(err);
      alert("Failed to load orders");
    }
  };

  return (
    <div className="container mt-4">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card p-3 mb-2">

            <h5>{order.productId?.productName}</h5>

            <p>Status: {order.orderStatus}</p>

            <p>Payment: {order.paymentStatus}</p>

          </div>
        ))
      )}
    </div>
  );
}

export default Orders;