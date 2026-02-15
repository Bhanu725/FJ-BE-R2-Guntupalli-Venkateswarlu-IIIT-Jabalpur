const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const receiptController = require('../controllers/receipt.controller');

router.post(
  '/',
  authMiddleware,
  upload.single('receipt'),
  receiptController.uploadReceipt
);

module.exports = router;


