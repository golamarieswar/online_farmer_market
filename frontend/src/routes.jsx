import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import FarmerOrders from "./pages/FarmerOrders";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegister";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import FarmerLogin from "./pages/FarmerLogin";
import FarmerRegister from "./pages/FarmerRegister";
import FarmerDashboard from "./pages/FarmerDashboard";

import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

import ProductForm from "./components/ProductForm";

function AppRoutes() {
  return (
    <Routes>

      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* CUSTOMER */}
      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/customer-register" element={<CustomerRegister />} />
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />

      {/* ADMIN */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      {/* FARMER */}
      <Route path="/farmer-login" element={<FarmerLogin />} />
      <Route path="/farmer-register" element={<FarmerRegister />} />
      <Route path="/farmer-dashboard" element={<FarmerDashboard />} />

      {/* PRODUCT */}
      <Route path="/product/:id" element={<ProductDetails />} />

      {/* CART */}
      <Route path="/cart" element={<Cart />} />

      {/* ORDERS */}
      <Route path="/orders" element={<Orders />} />
<Route path="/farmer-orders" element={<FarmerOrders />} />
      {/* ADD PRODUCT */}
      <Route path="/add-product" element={<ProductForm />} />

    </Routes>
  );
}

export default AppRoutes;
