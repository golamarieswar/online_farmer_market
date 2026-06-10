const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      default: "",
    },

    noReturnPolicyAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    password: {
  type: String,
  required: true,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);