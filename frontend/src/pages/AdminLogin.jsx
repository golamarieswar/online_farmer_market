import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/admin/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "admin");

      alert("Admin Login Success");

      navigate("/admin-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="container auth-page">
      <span className="eyebrow">Admin access</span>
      <h2>Admin Login</h2>

      <form onSubmit={login} className="card form-card">
        <input
          className="form-control mb-2"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="btn btn-dark w-100">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
