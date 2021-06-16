var router = require('express').Router();
const passport = require('passport');

// The root route renders our only view
router.get('/', function(req, res) {
  res.redirect('/students');
});

// Triggers the login
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email']}// < scope you have to lookup with each provider
));

// Google Oauth Callback router
// After the login, where do you want the user redirected after the 
// ouath consent screen
router.get('/oauth2callback', passport.authenticate(
  'google', 
  {
    successRedirect: '/students', // < the route you want to go to after the user logins
    failureRedirect: '/students' // where do you want the user to go if they didn't login 
  }
))


router.get('/logout', function(req, res){
  // passport gives us req.logout()
  req.logout(); // deletes our session cookie, so the browser will need to re login
  // to req authenticate
  res.redirect('/students'); // redirect to whereever you want to go
})


module.exports = router;