exports.uploadReceipt = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      message: "Receipt uploaded successfully",
      filePath: req.file.path
    });

  } catch (error) {
    next(error);
  }
};
