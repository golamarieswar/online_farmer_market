import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("cart");

    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg app-nav">
      <div className="container">

        <Link
          className="navbar-brand"
          to="/"
        >
          FarmLink Market
        </Link>

        <div className="ms-auto nav-actions">
          {!token && (
            <>
              <Link className="btn btn-outline-success" to="/customer-login">
                Customer
              </Link>
              <Link className="btn btn-success" to="/farmer-login">
                Farmer
              </Link>
            </>
          )}

          {role === "customer" && (
            <>
              <Link className="btn btn-outline-success" to="/customer-dashboard">
                Products
              </Link>
              <Link className="btn btn-outline-success" to="/cart">
                Cart
              </Link>
              <Link className="btn btn-outline-success" to="/orders">
                Orders
              </Link>
            </>
          )}

          {role === "farmer" && (
            <>
              <Link className="btn btn-outline-success" to="/farmer-dashboard">
                Dashboard
              </Link>
              <Link className="btn btn-outline-success" to="/farmer-orders">
                Orders
              </Link>
            </>
          )}

          {role === "admin" && (
            <Link className="btn btn-outline-success" to="/admin-dashboard">
              Admin
            </Link>
          )}

          {token && (
            <button
              className="btn btn-outline-danger"
              onClick={logout}
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
