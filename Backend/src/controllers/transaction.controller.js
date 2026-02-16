const Transaction = require("../models/transaction.model");
const { validateCreateTransaction } = require("../validators/transaction.validator");
const { checkBudgetOverrun } = require("../services/budget.service");
const { convertToUSD, convertCurrency } = require("../services/currency.service");


/* ============================================
   CREATE TRANSACTION
============================================ */

exports.createTransaction = async (req, res, next) => {
  try {
    validateCreateTransaction(req.body);

    const {
      categoryId,
      type,                // NEW
      amount,
      currency,
      transactionDate,
      description,
      receiptUrl
    } = req.body;

    // Convert entered amount to USD before storing
    const usdAmount = await convertToUSD(
      Number(amount),
      currency || "USD"
    );

    const transaction = await Transaction.create({
      userId: req.user.id,
      categoryId,
      type,                        // NEW
      amount: usdAmount,
      currencyCode: "USD",
      transactionDate,
      description,
      receiptUrl
    });
    try{
    await checkBudgetOverrun(req.user.id, categoryId,req.user.email);
    }
    catch(err){
        console.error("Budget overrun check failed:", err);
    }
    res.status(201).json(transaction);

  } catch (err) {
    next(err);
  }
};


/* ============================================
   GET ALL TRANSACTIONS (WITH DISPLAY CURRENCY)
============================================ */

exports.getAll = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const displayCurrency = req.query.currency || "USD";

    const limit = 10;
    const offset = (page - 1) * limit;

    let transactions = await Transaction.findAll(
      req.user.id,
      limit,
      offset
    );

    // Optimize: fetch rate only once
    if (displayCurrency !== "USD") {
      const rate = await convertCurrency(
        1,
        "USD",
        displayCurrency
      );

      transactions = transactions.map(t => ({
        ...t,
        amount: Number(t.amount) * rate
      }));
    }

    res.json(transactions);

  } catch (err) {
    next(err);
  }
};


/* ============================================
   DASHBOARD (BASED ON TRANSACTION TYPE)
============================================ */

exports.dashboard = async (req, res, next) => {
  try {
    const summary = await Transaction.getDashboardSummary(req.user.id);

    const totalIncome = Number(summary.total_income || 0);
    const totalExpense = Number(summary.total_expense || 0);

    const savings = totalIncome - totalExpense;

    res.json({
      total_income: totalIncome,
      total_expense: totalExpense,
      savings
    });

  } catch (err) {
    next(err);
  }
};


/* ============================================
   MONTHLY REPORT
============================================ */

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


/* ============================================
   BUDGET PROGRESS
============================================ */

exports.budgetProgress = async (req, res, next) => {
  try {
    const progress = await Transaction.getBudgetProgress(req.user.id);
    res.json(progress);

  } catch (err) {
    next(err);
  }
};


/* ============================================
   CATEGORY BREAKDOWN
============================================ */

exports.categoryBreakdown = async (req, res, next) => {
  try {
    const breakdown = await Transaction.categoryBreakdown(req.user.id);
    res.json(breakdown);

  } catch (err) {
    next(err);
  }
};


/* ============================================
   UPDATE TRANSACTION
============================================ */

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


/* ============================================
   DELETE TRANSACTION
============================================ */

exports.delete = async (req, res, next) => {
  try {
    await Transaction.delete(
      req.params.id,
      req.user.id
    );

    res.json({ message: "Transaction deleted" });

  } catch (err) {
    next(err);
  }
};
