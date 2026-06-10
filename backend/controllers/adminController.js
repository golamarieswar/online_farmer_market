const Admin = require("../models/Admin");
const Farmer = require("../models/Farmer");
const Product = require("../models/Product");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
ADMIN LOGIN
*/

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({
      email,
      isActive: true,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const match = await bcrypt.compare(
      password,
      admin.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
GET ALL PENDING FARMERS
*/

exports.getPendingFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find({
      verificationStatus: "pending",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: farmers.length,
      farmers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
APPROVE FARMER
*/

exports.approveFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(
      req.params.id
    );

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    farmer.verificationStatus = "approved";
    farmer.rejectionReason = "";

    await farmer.save();

    res.status(200).json({
      success: true,
      message: "Farmer approved successfully",
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
REJECT FARMER
*/

exports.rejectFarmer = async (req, res) => {
  try {
    const { reason } = req.body;

    const farmer = await Farmer.findById(
      req.params.id
    );

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    farmer.verificationStatus = "rejected";
    farmer.rejectionReason =
      reason || "Verification failed";

    await farmer.save();

    res.status(200).json({
      success: true,
      message: "Farmer rejected",
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
GET PENDING PRODUCTS
*/

exports.getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      verificationStatus: "pending",
    })
      .populate(
        "farmerId",
        "fullName email mobileNumber"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
APPROVE PRODUCT
*/

exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.verificationStatus = "approved";
    product.rejectionReason = "";
    product.isAvailable = true;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product approved",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
REJECT PRODUCT
*/

exports.rejectProduct = async (req, res) => {
  try {
    const { reason } = req.body;

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.verificationStatus = "rejected";

    product.rejectionReason =
      reason ||
      "Rejected by admin. Product may be perishable or image quality is insufficient.";

    product.isAvailable = false;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product rejected",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
ADMIN DASHBOARD SUMMARY
*/

exports.getDashboardStats = async (req, res) => {
  try {
    const pendingFarmers =
      await Farmer.countDocuments({
        verificationStatus: "pending",
      });

    const approvedFarmers =
      await Farmer.countDocuments({
        verificationStatus: "approved",
      });

    const pendingProducts =
      await Product.countDocuments({
        verificationStatus: "pending",
      });

    const approvedProducts =
      await Product.countDocuments({
        verificationStatus: "approved",
      });

    res.status(200).json({
      success: true,
      stats: {
        pendingFarmers,
        approvedFarmers,
        pendingProducts,
        approvedProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};