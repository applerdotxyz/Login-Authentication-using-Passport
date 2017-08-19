const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, ((req, email, password, done) => {
      process.nextTick(() => {
        User.findOne({ 'local.username': email }, (err, user) => {
          if (err) { return done(err); }
          if (user) {
            return done(null, false, req.flash('signupMessage', 'That email already taken'));
          }
          const newUser = new User();
          newUser.local.username = email;
          newUser.local.password = password;

          newUser.save((err) => {
            if (err) { throw err; }
            return done(null, newUser);
          });
        });
      });
    })));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, ((req, email, password, done) => {
      process.nextTick(() => {
        User.findOne({ 'local.username': email }, (err, user) => {
          if (err) { return done(err); }
          if (!user) { return done(null, false, req.flash('loginMessage', 'No User found')); }
          if (user.local.password !== password) {
            return done(null, false, req.flash('loginMessage', 'inavalid password'));
          }
          return done(null, user);
        });
      });
    }),
  ));
};
