import { useCallback, useEffect, useState } from "react";
import API, { authHeader } from "../services/api";

function FarmerOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/api/order/farmer", {
        headers: authHeader(),
      });

      setOrders(res.data.orders);
    } catch {
      alert("Failed to load farmer orders");
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId, orderStatus) => {
    try {
      await API.put(
        `/api/order/status/${orderId}`,
        { orderStatus },
        { headers: authHeader() }
      );
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order");
    }
  };

  return (
    <div className="container page-section">
      <div className="page-header">
        <div>
          <span className="eyebrow">Fulfillment</span>
          <h2>Farmer Orders</h2>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h4>No orders received yet</h4>
          <p>Customer orders for approved products will appear here.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card fulfillment-row">

            <div>
              <h5>{order.productId?.productName}</h5>
              <p>Customer: {order.customerId?.fullName}</p>
              <p>Quantity: {order.quantity} · Payment: {order.paymentStatus}</p>
            </div>

            <select
              className="form-select"
              value={order.orderStatus}
              onChange={(event) => updateStatus(order._id, event.target.value)}
            >
              <option value="placed" disabled>
                Placed
              </option>
              <option value="accepted">Accepted</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for delivery</option>
              <option value="delivered">Delivered</option>
            </select>

          </div>
        ))
      )}
    </div>
  );
}

export default FarmerOrders;
