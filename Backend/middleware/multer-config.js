const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image") && MIME_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb("Fichiers image jpg, jpeg, png seulement", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },

  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_").split(".")[0];

    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage, fileFilter: imageFilter }).single(
  "image"
);
