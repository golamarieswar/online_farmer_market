const Farmer = require("../models/Farmer");
const Customer = require("../models/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const uploadPath = (folder, file) =>
  path.posix.join("uploads", folder, file.filename);

/*
CUSTOMER REGISTER
*/

exports.registerCustomer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      password,
      noReturnPolicyAccepted,
    } = req.body;

    const customerExists = await Customer.findOne({ email });
    const farmerExists = await Farmer.findOne({ email });

    if (customerExists || farmerExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      noReturnPolicyAccepted,
    });

    res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
FARMER REGISTER
*/

exports.registerFarmer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      password,
      aadhaarNumber,
      address,
    } = req.body;

    const customerExists = await Customer.findOne({ email });
    const farmerExists = await Farmer.findOne({ email });

    if (customerExists || farmerExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const aadhaarFile =
      req.files?.aadhaarImage?.[0];

    const farmerCardImage =
      req.files?.farmerCardImage?.[0];

    if (!aadhaarFile || !farmerCardImage) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar image and farmer card image are required",
      });
    }

    const farmer = await Farmer.create({
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      aadhaarNumber,
      aadhaarImage: uploadPath("aadhaar", aadhaarFile),
      farmerCardImage: uploadPath("farmercards", farmerCardImage),
      address,
    });

    res.status(201).json({
      success: true,
      message:
        "Registration submitted for admin verification",
      farmer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
CUSTOMER LOGIN
*/

exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email }).select("+password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const match = await bcrypt.compare(
      password,
      customer.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: customer._id,
        role: "customer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
FARMER LOGIN
*/

exports.loginFarmer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const farmer = await Farmer.findOne({ email }).select("+password");

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    if (farmer.verificationStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          "Farmer account not approved by admin",
      });
    }

    const match = await bcrypt.compare(
      password,
      farmer.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: farmer._id,
        role: "farmer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      farmer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
