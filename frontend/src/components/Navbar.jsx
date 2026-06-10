import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");

    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">

        <Link
          className="navbar-brand"
          to="/"
        >
          Online Farmers Market
        </Link>

        <div className="ms-auto">

          <Link
            className="btn btn-light me-2"
            to="/customer-dashboard"
          >
            Products
          </Link>

          <Link
            className="btn btn-light me-2"
            to="/cart"
          >
            Cart
          </Link>

          <Link
            className="btn btn-light me-2"
            to="/orders"
          >
            Orders
          </Link>

          <button
            className="btn btn-danger"
            onClick={logout}
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;