const multer = require("multer");
const path = require("path");
const fs = require("fs");

/*
Create folders automatically
*/

const folders = [
  "uploads/aadhaar",
  "uploads/farmercards",
  "uploads/products",
];

folders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

/*
Storage
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "aadhaarImage") {
      cb(null, "uploads/aadhaar");
    } else if (file.fieldname === "farmerCardImage") {
      cb(null, "uploads/farmercards");
    } else if (file.fieldname === "productImage") {
      cb(null, "uploads/products");
    } else {
      cb(null, "uploads");
    }
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

/*
File Filter
*/

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".pdf",
  ];

  const ext = path.extname(
    file.originalname
  ).toLowerCase();

  if (!allowedTypes.includes(ext)) {
    return cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP and PDF files are allowed."
      ),
      false
    );
  }

  cb(null, true);
};

/*
Upload Object
*/

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

module.exports = upload;