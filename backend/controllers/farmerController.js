const Farmer = require("../models/Farmer");
const Product = require("../models/Product");
const Order = require("../models/Order");

/*
GET FARMER PROFILE
*/

exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.id).select("-password");

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    res.status(200).json({
      success: true,
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
UPDATE FARMER PROFILE
*/

exports.updateFarmerProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    farmer.fullName =
      req.body.fullName || farmer.fullName;

    farmer.mobileNumber =
      req.body.mobileNumber || farmer.mobileNumber;

    farmer.address =
      req.body.address || farmer.address;

    await farmer.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
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
FARMER DASHBOARD
*/

exports.getFarmerDashboard = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const totalProducts =
      await Product.countDocuments({
        farmerId,
      });

    const approvedProducts =
      await Product.countDocuments({
        farmerId,
        verificationStatus: "approved",
      });

    const pendingProducts =
      await Product.countDocuments({
        farmerId,
        verificationStatus: "pending",
      });

    const totalOrders =
      await Order.countDocuments({
        farmerId,
      });

    res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        approvedProducts,
        pendingProducts,
        totalOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};