const Product = require("../models/Product");
const Farmer = require("../models/Farmer");

/*
ADD PRODUCT
Farmer Uploads Product
Status = Pending
Admin Must Approve
*/



exports.addProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      category,
      price,
      quantity,
    } = req.body;

    const farmerId = req.user.id;

    const farmer = await Farmer.findById(farmerId);

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
          "Farmer account is not approved by admin",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const product = await Product.create({
      farmerId,
      productName,
      description,
      category,
      price,
      quantity,
      productImage: req.file.path,

      verificationStatus: "pending",
      isAvailable: false,
    });

    res.status(201).json({
      success: true,
      message:
        "Product submitted for admin approval",
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
FARMER PRODUCTS
*/

exports.getFarmerProducts = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const products = await Product.find({
      farmerId,
    }).sort({
      createdAt: -1,
    });

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
GET ALL APPROVED PRODUCTS
Customer View
*/

exports.getApprovedProducts = async (
  req,
  res
) => {
  try {
    const products = await Product.find({
      verificationStatus: "approved",
      isAvailable: true,
    })
      .populate(
        "farmerId",
        "fullName email"
      )
      .sort({
        createdAt: -1,
      });

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
GET PRODUCT DETAILS
*/

exports.getProductById = async (
  req,
  res
) => {
  try {
    const product = await Product.findById(
      req.params.id
    ).populate(
      "farmerId",
      "fullName email mobileNumber"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
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
SEARCH PRODUCTS
*/

exports.searchProducts = async (
  req,
  res
) => {
  try {
    const keyword = req.query.keyword || "";

    const products = await Product.find({
      verificationStatus: "approved",
      isAvailable: true,

      $or: [
        {
          productName: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          category: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

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
UPDATE PRODUCT
Only Farmer Owner
*/

exports.updateProduct = async (
  req,
  res
) => {
  try {
    const farmerId = req.user.id;

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      product.farmerId.toString() !==
      farmerId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedData = {
      productName:
        req.body.productName ||
        product.productName,

      description:
        req.body.description ||
        product.description,

      category:
        req.body.category ||
        product.category,

      price:
        req.body.price || product.price,

      quantity:
        req.body.quantity ||
        product.quantity,

      verificationStatus: "pending",
      isAvailable: false,
    };

    if (req.file) {
      updatedData.productImage =
        req.file.path;
    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        updatedData,
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Updated. Waiting for admin approval.",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
DELETE PRODUCT
Only Product Owner
*/

exports.deleteProduct = async (
  req,
  res
) => {
  try {
    const farmerId = req.user.id;

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      product.farmerId.toString() !==
      farmerId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
UPDATE PRODUCT STOCK
Used After Order Placement
*/

exports.updateProductStock =
  async (productId, quantityPurchased) => {
    const product =
      await Product.findById(productId);

    if (!product) return;

    product.quantity =
      product.quantity - quantityPurchased;

    if (product.quantity <= 0) {
      product.quantity = 0;
      product.isAvailable = false;
    }

    await product.save();
  };