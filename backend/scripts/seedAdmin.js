require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const seedAdmin = async () => {
  const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before seeding.");
  }

  await mongoose.connect(MONGO_URI);

  const password = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await Admin.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    {
      email: ADMIN_EMAIL.toLowerCase(),
      password,
      role: "admin",
      isActive: true,
    },
    { upsert: true, new: true }
  );

  console.log(`Admin user ready: ${ADMIN_EMAIL}`);
};

seedAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
