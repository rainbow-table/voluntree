const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport'), 
  FacebookStrategy = require('passport-facebook').Strategy;

const app = express();

const mySecret = process.env.MY_SECRET;
const appId = process.env.FACEBOOK_APP_ID;
const appSecret = process.env.FACEBOOK_APP_SECRET;
// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(express.session({ secret: mySecret }));
app.use(passport.initialize());
app.use(passport.session());

app.listen(3000, function() {
  console.log('listening on 3000');
});

// passport.use(new FacebookStrategy({
//   clientID: appId,
//   clientSecret: appSecret,
//   callbackURL: 'http://localhost:3000/auth/facebook/callback',
// },

//   function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate({ 'facebook.id': profile.id }, function(err, user) {
//       if (err) { return done(err); }
//       done(null, user);
//     });
//   },
// ));

// app.get('/auth/facebook', passport.authenticate('facebook'))
// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { successRedirect: '/',
//                                       failureRedirect: '/login' }));
