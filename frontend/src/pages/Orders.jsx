import { useCallback, useEffect, useState } from "react";
import API, { authHeader } from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/api/order/customer", {
        headers: authHeader(),
      });

      setOrders(res.data.orders);
    } catch {
      alert("Failed to load orders");
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="container page-section">
      <div className="page-header">
        <div>
          <span className="eyebrow">Purchases</span>
          <h2>My Orders</h2>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h4>No orders found</h4>
          <p>Your order history will appear after checkout.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card order-row">

            <h5>{order.productId?.productName}</h5>

            <span className="status-pill">{order.orderStatus}</span>

            <p>Payment: {order.paymentStatus}</p>

          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
