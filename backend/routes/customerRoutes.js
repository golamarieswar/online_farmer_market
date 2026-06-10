const express = require("express");
const router = express.Router();

const {
  getCustomerProfile,
  updateCustomerProfile,
  saveAddress,
  getCustomerDashboard,
} = require("../controllers/customerController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

router.get(
  "/profile",
  authMiddleware,
  getCustomerProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateCustomerProfile
);

router.put(
  "/address",
  authMiddleware,
  saveAddress
);

router.get(
  "/dashboard",
  authMiddleware,
  getCustomerDashboard
);

module.exports = router;