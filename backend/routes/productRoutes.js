const express = require("express");
const router = express.Router();

const {
  addProduct,
  getFarmerProducts,
  getApprovedProducts,
  getProductById,
  searchProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const upload = require(
  "../middleware/uploadMiddleware"
);
const validateObjectId = require("../middleware/validateObjectId");

router.param("id", validateObjectId);

/*
Farmer
*/

router.post(
  "/add",
  authMiddleware,
  upload.single("productImage"),
  addProduct
);

router.get(
  "/farmer/my-products",
  authMiddleware,
  getFarmerProducts
);

router.put(
  "/update/:id",
  authMiddleware,
  upload.single("productImage"),
  updateProduct
);

router.delete(
  "/delete/:id",
  authMiddleware,
  deleteProduct
);

/*
Customer
*/

router.get(
  "/all",
  getApprovedProducts
);

router.get(
  "/search",
  searchProducts
);

router.get(
  "/:id",
  getProductById
);

module.exports = router;
