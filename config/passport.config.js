const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load user model
const User = mongoose.model('users');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  (email, password, done) => {
    // match user
    User.findOne({email: email})
    .then((user) => {
      if (!user) {
        return done(null, false, {message: 'No user found'});
      } else {
        // match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err)
            throw err;
          if (isMatch) {
            return done(null, user);
          }
          else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      }
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
