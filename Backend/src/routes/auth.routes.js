const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const passport = require('../config/passport');
const { generateToken } = require('../utils/jwt');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = generateToken(req.user.id);
    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
    );
  }
);



module.exports = router;




