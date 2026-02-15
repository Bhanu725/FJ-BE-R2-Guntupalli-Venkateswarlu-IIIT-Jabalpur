const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/error.middleware');

const categoryRoutes = require('./routes/category.routes');
const transactionRoutes = require('./routes/transaction.routes');
const passport = require('./config/passport');
const receiptRoutes = require('./routes/receipt.routes');





const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(passport.initialize());

app.use('/api/auth', authRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/transactions', transactionRoutes);

app.use('/api/receipts', receiptRoutes);

app.use(errorHandler);

module.exports = app;
