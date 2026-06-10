const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getPendingFarmers,
  approveFarmer,
  rejectFarmer,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  getDashboardStats,
} = require("../controllers/adminController");

const adminMiddleware = require(
  "../middleware/adminMiddleware"
);

/*
Admin Login
*/

router.post(
  "/login",
  adminLogin
);

/*
Dashboard
*/

router.get(
  "/dashboard",
  adminMiddleware,
  getDashboardStats
);

/*
Farmer Verification
*/

router.get(
  "/farmers/pending",
  adminMiddleware,
  getPendingFarmers
);

router.put(
  "/farmers/approve/:id",
  adminMiddleware,
  approveFarmer
);

router.put(
  "/farmers/reject/:id",
  adminMiddleware,
  rejectFarmer
);

/*
Product Verification
*/

router.get(
  "/products/pending",
  adminMiddleware,
  getPendingProducts
);

router.put(
  "/products/approve/:id",
  adminMiddleware,
  approveProduct
);

router.put(
  "/products/reject/:id",
  adminMiddleware,
  rejectProduct
);

module.exports = router;