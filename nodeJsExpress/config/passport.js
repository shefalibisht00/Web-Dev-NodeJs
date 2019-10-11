var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
var models = require('../models/index');

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  models.Users
  .findOne({ where: { email: email } })
  .then(function(user) { // successful query to database
    if(!user) {
      return done(null, false, { message: 'Invalid Email'});
    }
    else if (!user.validPassword(password)) {
      return done(null, false, {
        message: "Invalid password."
      });
    }
      return done(null, user);
    
  })
  .catch(function(err) { // something went wrong with query to db
    console.log("Error on 22\n"+ err);
    done(err);
  });
}));

passport.serializeUser((user, done) =>{
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null,obj);
});

module.exports = passport;