var router = require('express').Router();
const passport = require('passport');

// The root route renders our only view
router.get('/', function(req, res) {
  res.redirect('/students');
});

// Triggers the login
// This brings us to the consent screen
router.get('/auth/google', passport.authenticate(
  'google', 
  {scope: ['profile', 'email']}// the scope is from teh google peoples api that we implemented for our app
));

// Setup our redirect URI route
// Oauth callback
// this should match what we have in our env variables
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/students', // Where do you want the user to go after the consent screen
    failureRedirect: '/students' // where do you want the user to go if the login failed
  }
))

// The ouath logout route
router.get('/logout', function(req, res){
  req.logout(); // the logout method is attached to the request object by passport
  // logout destroys the session
  res.redirect('/students')
})




module.exports = router;