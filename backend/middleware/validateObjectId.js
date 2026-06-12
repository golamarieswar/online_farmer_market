const mongoose = require("mongoose");

const validateObjectId = (req, res, next, value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return res.status(400).json({
      success: false,
      message: "Invalid resource id",
    });
  }

  next();
};

module.exports = validateObjectId;
