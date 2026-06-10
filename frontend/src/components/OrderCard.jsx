function OrderCard({ order }) {
  return (
    <div className="card p-3 mb-3">

      <h5>
        {order.productId?.productName}
      </h5>

      <p>
        Quantity:
        {order.quantity}
      </p>

      <p>
        Amount:
        ₹ {order.totalAmount}
      </p>

      <p>
        Status:
        <strong>
          {" "}
          {order.orderStatus}
        </strong>
      </p>

      <p>
        Payment:
        {order.paymentStatus}
      </p>

      <p>
        Delivery Address:
      </p>

      <small>
        {order.deliveryAddress}
      </small>

    </div>
  );
}

export default OrderCard;