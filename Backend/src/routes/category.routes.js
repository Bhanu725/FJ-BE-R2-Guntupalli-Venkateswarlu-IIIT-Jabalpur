const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const categoryController = require('../controllers/category.controller');

router.post('/', authMiddleware, categoryController.createCategory);
router.get('/', authMiddleware, categoryController.getCategories);
router.put('/:id', authMiddleware, categoryController.update);
router.delete('/:id', authMiddleware, categoryController.delete);

module.exports = router;
