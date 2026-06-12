import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function CustomerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    noReturnPolicyAccepted: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const register = async (event) => {
    event.preventDefault();

    if (!form.noReturnPolicyAccepted) {
      alert("Please accept the no-return policy.");
      return;
    }

    try {
      await API.post("/api/auth/register/customer", form);
      alert("Customer registered successfully");
      navigate("/customer-login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container auth-page">
      <span className="eyebrow">Customer access</span>
      <h2>Customer Registration</h2>

      <form onSubmit={register} className="card form-card">
        <input
          className="form-control mb-3"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={form.mobileNumber}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength="6"
        />

        <label className="form-check mb-3 text-start">
          <input
            className="form-check-input"
            name="noReturnPolicyAccepted"
            type="checkbox"
            checked={form.noReturnPolicyAccepted}
            onChange={handleChange}
          />
          <span className="form-check-label ms-2">
            I understand orders for non-perishable farm products cannot be returned.
          </span>
        </label>

        <button className="btn btn-success w-100">Register</button>
      </form>

      <p className="mt-3">
        Already have an account? <Link to="/customer-login">Login</Link>
      </p>
    </div>
  );
}

export default CustomerRegister;
