const express = require("express");
const router = express.Router();

const {
  registerCustomer,
  registerFarmer,
  loginCustomer,
  loginFarmer,
} = require("../controllers/authController");

const upload = require("../middleware/uploadMiddleware");

/*
Customer
*/

router.post(
  "/register/customer",
  registerCustomer
);

router.post(
  "/login/customer",
  loginCustomer
);

/*
Farmer
*/

router.post(
  "/register/farmer",
  upload.fields([
    {
      name: "aadhaarImage",
      maxCount: 1,
    },
    {
      name: "farmerCardImage",
      maxCount: 1,
    },
  ]),
  registerFarmer
);

router.post(
  "/login/farmer",
  loginFarmer
);

module.exports = router;