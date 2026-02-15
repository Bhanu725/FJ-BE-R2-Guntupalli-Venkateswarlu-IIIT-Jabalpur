const Transaction = require('../models/transaction.model');
const { validateCreateTransaction } = require('../validators/transaction.validator');
const { checkBudgetOverrun } = require('../services/budget.service');

exports.createTransaction = async (req, res, next) => {
  try {
    validateCreateTransaction(req.body);

    const transaction = await Transaction.create({
      userId: req.user.id,
      ...req.body
    });

    await checkBudgetOverrun(req.user, transaction.category_id);

    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

exports.dashboard = async (req, res, next) => {
  try {
    const summary = await Transaction.getDashboardSummary(req.user.id);

    const savings =
      Number(summary.total_income) -
      Number(summary.total_expense);

    res.json({ ...summary, savings });
  } catch (err) {
    next(err);
  }
};

exports.monthlyReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const report = await Transaction.getMonthlyReport(
      req.user.id,
      month,
      year
    );

    res.json(report);
  } catch (err) {
    next(err);
  }
};

exports.budgetProgress = async (req, res, next) => {
  try {
    const progress = await Transaction.getBudgetProgress(req.user.id);
    res.json(progress);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const transactions = await Transaction.findAll(
      req.user.id,
      limit,
      offset
    );

    res.json(transactions);
  } catch (err) {
    next(err);
  }
};


exports.update = async (req, res, next) => {
  try {
    const transaction = await Transaction.update(
      req.params.id,
      req.user.id,
      req.body
    );

    res.json(transaction);
  } catch (err) {
    next(err);
  }
};


exports.delete = async (req, res, next) => {
  try {
    await Transaction.delete(req.params.id, req.user.id);
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    next(err);
  }
};