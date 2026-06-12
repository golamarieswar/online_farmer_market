const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getCustomerOrders,
  getFarmerOrders,
  getOrderById,
  acceptOrder,
  updateOrderStatus,
  trackOrder,
  getAllOrders,
} = require("../controllers/orderController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const adminMiddleware = require(
  "../middleware/adminMiddleware"
);
const validateObjectId = require("../middleware/validateObjectId");

router.param("id", validateObjectId);

/*
Customer
*/

router.post(
  "/place",
  authMiddleware,
  placeOrder
);

router.get(
  "/customer",
  authMiddleware,
  getCustomerOrders
);

router.get(
  "/track/:id",
  authMiddleware,
  trackOrder
);

/*
Farmer
*/

router.get(
  "/farmer",
  authMiddleware,
  getFarmerOrders
);

router.put(
  "/accept/:id",
  authMiddleware,
  acceptOrder
);

router.put(
  "/status/:id",
  authMiddleware,
  updateOrderStatus
);

/*
Admin
*/

router.get(
  "/admin/all",
  adminMiddleware,
  getAllOrders
);

/*
Shared
*/

router.get(
  "/:id",
  authMiddleware,
  getOrderById
);

module.exports = router;
