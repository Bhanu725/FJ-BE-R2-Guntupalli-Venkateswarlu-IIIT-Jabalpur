const Category = require('../models/category.model');
const { validateCreateCategory } = require('../validators/category.validator');

exports.createCategory = async (req, res, next) => {
  try {
    validateCreateCategory(req.body);

    const category = await Category.create({
      userId: req.user.id,
      ...req.body
    });

    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAllByUser(req.user.id);
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
