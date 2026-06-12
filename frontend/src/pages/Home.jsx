import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="container hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Non-perishable farm goods</span>
          <h1>FarmLink Market</h1>
          <p>
            A verified marketplace where customers can buy shelf-stable farm products and approved farmers can manage listings, orders, and stock.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-success btn-lg"
              onClick={() => navigate("/customer-login")}
            >
              Shop Products
            </button>

            <button
              className="btn btn-outline-success btn-lg"
              onClick={() => navigate("/farmer-login")}
            >
              Farmer Login
            </button>
          </div>
        </div>

        <div className="hero-panel" aria-label="Marketplace summary">
          <div>
            <span>Verified</span>
            <strong>Farmers</strong>
          </div>
          <div>
            <span>Approved</span>
            <strong>Products</strong>
          </div>
          <div>
            <span>Tracked</span>
            <strong>Orders</strong>
          </div>
        </div>
      </section>

      <div className="container role-grid">
        <button className="role-card" onClick={() => navigate("/customer-register")}>
          <span>Customer</span>
          <strong>Create account</strong>
          <small>Browse, cart, checkout, and order tracking.</small>
        </button>

        <button className="role-card" onClick={() => navigate("/farmer-register")}>
          <span>Farmer</span>
          <strong>Apply to sell</strong>
          <small>Submit documents, upload products, and fulfill orders.</small>
        </button>

        <button className="role-card" onClick={() => navigate("/admin-login")}>
          <span>Admin</span>
          <strong>Review queue</strong>
          <small>Approve farmers and products before they go live.</small>
        </button>
      </div>
    </div>
  );
}

export default Home;
