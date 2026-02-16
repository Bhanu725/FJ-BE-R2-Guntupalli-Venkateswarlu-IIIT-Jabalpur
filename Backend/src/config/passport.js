const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;

      let user = await User.findByEmail(email);

      if (!user) {
        user = await User.createUser({
          name: profile.displayName,
          email,
          passwordHash: null,
          googleId: profile.id
        });
      }

      return done(null, user);

    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;
