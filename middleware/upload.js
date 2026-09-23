const multer = require("multer");
const path = require("path");

// ek hi function se resume-uploader aur photo-uploader dono ban jaate hain,
// bas folder/allowed-types/size alag de do.
function makeUploader(folder, allowedExts, maxSizeMB) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "..", "uploads", folder));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${req.user.userid}-${Date.now()}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Sirf ${allowedExts.join(", ")} allowed hai`));
    }
  };

  return multer({ storage, fileFilter, limits: { fileSize: maxSizeMB * 1024 * 1024 } });
}

const resumeUpload = makeUploader("resumes", [".pdf", ".doc", ".docx"], 5);
const photoUpload = makeUploader("photos", [".jpg", ".jpeg", ".png"], 2);

module.exports = { resumeUpload, photoUpload };
