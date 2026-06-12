const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadRoot = path.join(__dirname, "..", "uploads");

/*
Create folders automatically
*/

const folders = [
  "aadhaar",
  "farmercards",
  "products",
];

folders.forEach((folder) => {
  const fullPath = path.join(uploadRoot, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

/*
Storage
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "aadhaarImage") {
      cb(null, path.join(uploadRoot, "aadhaar"));
    } else if (file.fieldname === "farmerCardImage") {
      cb(null, path.join(uploadRoot, "farmercards"));
    } else if (file.fieldname === "productImage") {
      cb(null, path.join(uploadRoot, "products"));
    } else {
      cb(null, uploadRoot);
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
