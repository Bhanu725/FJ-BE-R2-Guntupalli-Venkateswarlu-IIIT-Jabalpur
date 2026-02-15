const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const transactionController = require('../controllers/transaction.controller');

router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/', authMiddleware, transactionController.getAll);
router.put('/:id', authMiddleware, transactionController.update);
router.delete('/:id', authMiddleware, transactionController.delete);
router.get('/dashboard', authMiddleware, transactionController.dashboard);
router.get('/monthly', authMiddleware, transactionController.monthlyReport);
router.get('/budget', authMiddleware, transactionController.budgetProgress);
router.get('/category-breakdown',authMiddleware, transactionController.categoryBreakdown);

module.exports = router;
