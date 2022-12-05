var router = require('express').Router();
const passport = require('passport');

router.get('/', function(req, res) {
  res.redirect('/students'); // in this app our home route is localhost:3000/students so if someone goes to localhost:3000 they are redirect to /students
});

router.get('/auth/google', passport.authenticate( // The route the client makes a request to, to login, in this case the login with Google a tag, in the index.ejs
  'google',
  { scope: ['profile', 'email']} // our app redirects the user to the google login page, step 2 in the oauth flow diagram
  // In the lesson Oauth Vocabulary, scope, 
));

router.get('/oauth2callback', passport.authenticate(
  'google', 
  {
    successRedirect: '/students', // <-- this you'll have to decide, redirect to the your home page for you app, maybe your index route for your main resource
    failureRedirect: '/students' // <--- this you'll have to decide
  }
))


router.get('/logout', function(req, res){
  // the client can make a request <a href="/logout">logout</a> in your ejs anywhere
  req.logout(); // passport attaches this .logout() function to the request object that we can call at it destroys session cookie, connect.sid
 
  res.redirect('/students');
})


module.exports = router;