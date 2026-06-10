const express = require("express");
const router = express.Router();

const {
  getFarmerProfile,
  updateFarmerProfile,
  getFarmerDashboard,
} = require("../controllers/farmerController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

router.get(
  "/profile",
  authMiddleware,
  getFarmerProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateFarmerProfile
);

router.get(
  "/dashboard",
  authMiddleware,
  getFarmerDashboard
);

module.exports = router;