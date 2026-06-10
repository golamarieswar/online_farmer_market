function CartItem({ item, removeFromCart }) {
  return (
    <div className="card p-3 mb-3">
      <div className="row">

        <div className="col-md-3">
          <img
            src={`http://localhost:5000/${item.productImage}`}
            alt={item.productName}
            width="100%"
          />
        </div>

        <div className="col-md-6">
          <h5>{item.productName}</h5>

          <p>Quantity: {item.quantity}</p>

          <p>Price: ₹{item.price}</p>
        </div>

        <div className="col-md-3">
          <button
            className="btn btn-danger"
            onClick={() => removeFromCart(item._id)}
          >
            Remove
          </button>
        </div>

      </div>
    </div>
  );
}

export default CartItem;