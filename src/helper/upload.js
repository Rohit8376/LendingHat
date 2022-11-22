const multer = require("multer");
const path = require("path");

// multer confi for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file)
    cb(null, "public/uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-"+file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  if (
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png"
  ) {
    cb(null, true);
  } else {
    req.fileValidation = "false";
    cb(null, new Error("Please Uplode valid file"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3, // max size of img mb
  },
  //fileFilter: fileFilter,
});
module.exports = upload;
