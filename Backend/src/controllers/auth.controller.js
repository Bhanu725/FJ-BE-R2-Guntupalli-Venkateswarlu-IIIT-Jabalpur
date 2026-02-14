const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await User.createUser({
      name,
      email,
      passwordHash
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser
    });

  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user || !user.password_hash) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token
    });

  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res) => {
  res.json(req.user);
};
