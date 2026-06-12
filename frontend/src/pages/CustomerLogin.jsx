import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function CustomerLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/login/customer", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "customer");

      navigate("/customer-dashboard");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div className="container auth-page">
      <span className="eyebrow">Customer access</span>
      <h2>Customer Login</h2>

      <form onSubmit={login} className="card form-card">
        <input
          className="form-control mb-3"
          placeholder="Email"
          type="email"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Password"
          type="password"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button className="btn btn-success w-100">
          Login
        </button>
      </form>

      <p className="mt-3">
        No Account?
        <Link to="/customer-register">
          {" "}
          Register
        </Link>
      </p>
    </div>
  );
}

export default CustomerLogin;
