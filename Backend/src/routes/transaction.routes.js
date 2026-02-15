const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const transactionController = require('../controllers/transaction.controller');

router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/dashboard', authMiddleware, transactionController.dashboard);
router.get('/monthly', authMiddleware, transactionController.monthlyReport);
router.get('/budget', authMiddleware, transactionController.budgetProgress);

module.exports = router;
