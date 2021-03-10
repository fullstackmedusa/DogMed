const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Student = require('../models/student');

// This function happens when the user logs in
// configuring Passport!
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  function(accessToken, refreshToken, profile, cb) { // verify callback
    // a user has logged in via OAuth!
    // console.log(profile, "<----- Profile")
    // Fetch the User from the database and provide them back to passport 
    Student.findOne({'googleId': profile.id}, function(err, student){
      if(err) return cb(err);

      if(student){

        // cb(error, documentFromMongoose)
        return cb(null, student);
      } else {
        // if we didn't find the studnet(user) go ahead create them
        const newStudent = new Student({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id
        })

        // save it 
        newStudent.save(function(err){
          if(err) return cb(err);
          return cb(null, newStudent)
        })
      }
    })

      // or we want to create a usre // and provide them back to passport 
  }
));


// Set up our session
passport.serializeUser(function(studentDocument, done){
  // studentDocument is coming from above the cb(null, newStudent) or the cb(null, student)
  // What do we want to store in the session
  done(null, studentDocument.id) // null is for the error if there is one, 
  // studentDocument.id is the mongo id that we're storing in our session
})

// Is called on every single request after the user is logged in 
// that is a form submission, Going to another page, etc
passport.deserializeUser(function(id, done){
  Student.findById(id, function(err, student) {
    done(err, student);// this assings our student document to req.user, which we can use 
    // in our controller functions to figure who is logged in
  })
})








