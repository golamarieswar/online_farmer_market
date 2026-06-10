require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const farmerRoutes = require("./routes/farmerRoutes");
const customerRoutes =
  require("./routes/customerRoutes");

const app = express();

/*
==========================
CONNECT DATABASE
==========================
*/

connectDB();

/*
==========================
MIDDLEWARE
==========================
*/

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
==========================
UPLOAD FOLDER
==========================
*/

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

/*
==========================
API ROUTES
==========================
*/

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/product",
  productRoutes
);

app.use(
  "/api/order",
  orderRoutes
);

app.use(
  "/api/farmer",
  farmerRoutes
);

app.use(
  "/api/customer",
  customerRoutes
);

/*
==========================
TEST ROUTE
==========================
*/

app.get(
  "/",
  (req, res) => {
    res.json({
      message:
        "Online Farmers Market API Running",
    });
  }
);

/*
==========================
404
==========================
*/

app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});
/*
==========================
START SERVER
==========================
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});