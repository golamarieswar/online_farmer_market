import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1>Online Farmers Market</h1>

      <p className="mt-3">
        Buy and Sell Non-Perishable Agricultural Products
      </p>

      <div className="mt-5">
        <button
          className="btn btn-success me-3"
          onClick={() => navigate("/customer-login")}
        >
          BUY
        </button>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/farmer-login")}
        >
          SELL
        </button>
      </div>
    </div>
  );
}

export default Home;