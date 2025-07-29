import multer from "multer";

const storage = multer.memoryStorage();

const filename = (req, file, cd) => {
  if (file.mimetype.startsWith("image")) {
    cd(null, true);
  } else {
    cd(new Error("only image can be sent"));
  }
};

export default multer({
  storage: storage,
  fileFilter: filename,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});
