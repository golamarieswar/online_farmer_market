import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function FarmerLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login/farmer",
        form
      );

      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data.token;

      if (!token) {
        alert("Login failed: Token not received");
        return;
      }

      localStorage.setItem("token", token);

      console.log("TOKEN SAVED:", token);

      navigate("/farmer-dashboard");
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>Farmer Login</h2>

      <form onSubmit={login}>
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

        <button className="btn btn-primary">
          Login
        </button>
      </form>

      <p className="mt-3">
        No Account?
        <Link to="/farmer-register">
          {" "}
          Register
        </Link>
      </p>
    </div>
  );
}

export default FarmerLogin;