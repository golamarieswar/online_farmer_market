import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function FarmerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    aadhaarNumber: "",
    address: "",
  });

  const [aadhaarImage, setAadhaarImage] =
    useState(null);

  const [farmerCardImage, setFarmerCardImage] =
    useState(null);

  const submit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    data.append(
      "aadhaarImage",
      aadhaarImage
    );

    data.append(
      "farmerCardImage",
      farmerCardImage
    );

    try {
      await API.post("/api/auth/register/farmer", data);

      alert(
        "Registration submitted for verification"
      );

      navigate("/farmer-login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div className="container page-section form-page">
      <span className="eyebrow">Seller onboarding</span>
      <h2>Farmer Registration</h2>

      <p className="text-muted">
        Only Non-Perishable Goods Allowed
      </p>

      <form onSubmit={submit} className="card form-card">
        <input
          className="form-control mb-3"
          placeholder="Full Name"
          onChange={(e) =>
            setForm({
              ...form,
              fullName: e.target.value,
            })
          }
        />

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
          placeholder="Mobile Number"
          onChange={(e) =>
            setForm({
              ...form,
              mobileNumber:
                e.target.value,
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

        <input
          className="form-control mb-3"
          placeholder="Aadhaar Number"
          onChange={(e) =>
            setForm({
              ...form,
              aadhaarNumber:
                e.target.value,
            })
          }
        />

        <textarea
          className="form-control mb-3"
          placeholder="Address"
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value,
            })
          }
        />

        <label>Aadhaar Upload</label>

        <input
          className="form-control mb-3"
          type="file"
          onChange={(e) =>
            setAadhaarImage(
              e.target.files[0]
            )
          }
        />

        <label>Farmer Card Upload</label>

        <input
          className="form-control mb-3"
          type="file"
          onChange={(e) =>
            setFarmerCardImage(
              e.target.files[0]
            )
          }
        />

        <button className="btn btn-success">
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default FarmerRegister;
