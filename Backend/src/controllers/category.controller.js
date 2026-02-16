const Category = require("../models/category.model");
const { validateCreateCategory } = require("../validators/category.validator");


/* ============================================
   CREATE CATEGORY
============================================ */

exports.createCategory = async (req, res, next) => {
  try {
    validateCreateCategory(req.body);

    const category = await Category.create({
      userId: req.user.id,
      name: req.body.name,
      budgetLimit: req.body.budgetLimit
    });

    res.status(201).json(category);

  } catch (err) {
    next(err);
  }
};


/* ============================================
   GET ALL CATEGORIES
============================================ */

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAllByUser(req.user.id);
    res.json(categories);

  } catch (err) {
    next(err);
  }
};


/* ============================================
   UPDATE CATEGORY
============================================ */

exports.update = async (req, res, next) => {
  try {
    const category = await Category.update(
      req.params.id,
      req.user.id,
      req.body
    );

    res.json(category);

  } catch (err) {
    next(err);
  }
};


/* ============================================
   DELETE CATEGORY (SOFT DELETE)
============================================ */

exports.delete = async (req, res, next) => {
  try {
    await Category.softDelete(
      req.params.id,
      req.user.id
    );

    res.json({ message: "Category deleted" });

  } catch (err) {
    next(err);
  }
};
