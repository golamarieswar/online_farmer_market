const Customer = require("../models/Customer");
const Order = require("../models/Order");

/*
GET CUSTOMER PROFILE
*/

exports.getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(
      req.user.id
    ).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
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
UPDATE CUSTOMER PROFILE
*/

exports.updateCustomerProfile = async (
  req,
  res
) => {
  try {
    const customer = await Customer.findById(
      req.user.id
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    customer.fullName =
      req.body.fullName || customer.fullName;

    customer.mobileNumber =
      req.body.mobileNumber ||
      customer.mobileNumber;

    customer.address =
      req.body.address || customer.address;

    await customer.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
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
SAVE DELIVERY ADDRESS
*/

exports.saveAddress = async (req, res) => {
  try {
    const { address } = req.body;

    const customer = await Customer.findById(
      req.user.id
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    customer.address = address;

    await customer.save();

    res.status(200).json({
      success: true,
      message: "Address saved successfully",
      address: customer.address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
CUSTOMER DASHBOARD
*/

exports.getCustomerDashboard = async (
  req,
  res
) => {
  try {
    const customerId = req.user.id;

    const totalOrders =
      await Order.countDocuments({
        customerId,
      });

    const deliveredOrders =
      await Order.countDocuments({
        customerId,
        orderStatus: "delivered",
      });

    const pendingOrders =
      await Order.countDocuments({
        customerId,
        orderStatus: {
          $ne: "delivered",
        },
      });

    res.status(200).json({
      success: true,
      dashboard: {
        totalOrders,
        deliveredOrders,
        pendingOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};