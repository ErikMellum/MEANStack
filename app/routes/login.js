var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
require('../config/passport');

router.get('/login', function(req, res) {
  res.render('partials/login', { message: req.flash('loginMessage') }); 
});

router.get('/signup', function(req, res) {
  res.render('partials/signup', { message: req.flash('signupMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('partials/profile', {
    user : req.user
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/#/profile', // redirect to the secure profile section
  failureRedirect : '/#/signup', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/#/profile', // redirect to the secure profile section
  failureRedirect : '/#/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/#/',  {message: 'Please login before visiting profile page!'});
};

module.exports = router;
