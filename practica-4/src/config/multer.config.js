import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //Define destination folder based on fileType
    const fileType = req.body.fileType || "documents";
    const uploadPath = `uploads/${fileType}`;
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    //Assign a unique name to file
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });
export default upload;
