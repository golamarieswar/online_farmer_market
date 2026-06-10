const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

/*
PLACE ORDER
*/

exports.placeOrder = async (req, res) => {
  try {
    const customerId = req.user.id;

    const {
      productId,
      quantity,
      deliveryAddress,
      paymentMethod,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      product.verificationStatus !== "approved" ||
      !product.isAvailable
    ) {
      return res.status(400).json({
        success: false,
        message: "Product unavailable",
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    /*
      Save customer address if first order
    */

    if (
      deliveryAddress &&
      customer.address !== deliveryAddress
    ) {
      customer.address = deliveryAddress;
      await customer.save();
    }

    const totalAmount =
      Number(product.price) * Number(quantity);

    const order = await Order.create({
      customerId,
      farmerId: product.farmerId,
      productId: product._id,

      quantity,
      unitPrice: product.price,
      totalAmount,

      deliveryAddress,

      paymentMethod:
        paymentMethod || "cod",

      paymentStatus:
        paymentMethod === "online"
          ? "paid"
          : "pending",

      orderStatus: "placed",
    });

    /*
      Reduce Stock
    */

    product.quantity =
      product.quantity - quantity;

    if (product.quantity <= 0) {
      product.quantity = 0;
      product.isAvailable = false;
    }

    await product.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
CUSTOMER ORDERS
*/

exports.getCustomerOrders = async (
  req,
  res
) => {
  try {
    const customerId = req.user.id;

    const orders = await Order.find({
      customerId,
    })
      .populate(
        "productId",
        "productName productImage price"
      )
      .populate(
        "farmerId",
        "fullName email"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
FARMER ORDERS
*/

exports.getFarmerOrders = async (
  req,
  res
) => {
  try {
    const farmerId = req.user.id;

    const orders = await Order.find({
      farmerId,
    })
      .populate(
        "productId",
        "productName productImage"
      )
      .populate(
        "customerId",
        "fullName email mobileNumber"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
ORDER DETAILS
*/

exports.getOrderById = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    )
      .populate("productId")
      .populate("customerId")
      .populate("farmerId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
FARMER ACCEPT ORDER
*/

exports.acceptOrder = async (
  req,
  res
) => {
  try {
    const farmerId = req.user.id;

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.farmerId.toString() !==
      farmerId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    order.orderStatus = "accepted";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order accepted",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
UPDATE ORDER STATUS
*/

exports.updateOrderStatus = async (
  req,
  res
) => {
  try {
    const farmerId = req.user.id;

    const { orderStatus } = req.body;

    const allowedStatuses = [
      "accepted",
      "packed",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];

    if (
      !allowedStatuses.includes(orderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.farmerId.toString() !==
      farmerId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    order.orderStatus = orderStatus;

    if (
      orderStatus === "delivered" &&
      order.paymentMethod === "cod"
    ) {
      order.paymentStatus = "paid";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
CUSTOMER TRACK ORDER
*/

exports.trackOrder = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    )
      .populate(
        "productId",
        "productName productImage"
      )
      .populate(
        "farmerId",
        "fullName"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      tracking: {
        orderId: order._id,
        status: order.orderStatus,
        paymentStatus:
          order.paymentStatus,
        updatedAt: order.updatedAt,
      },
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
ADMIN VIEW ALL ORDERS
*/

exports.getAllOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find()
      .populate(
        "customerId",
        "fullName email"
      )
      .populate(
        "farmerId",
        "fullName email"
      )
      .populate(
        "productId",
        "productName"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};