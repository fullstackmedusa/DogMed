const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Student = require('../models/student');
// this will be your User model in your project ^


// configuring Passport!
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  // this function gets called when we login 
  // after oauth consent screen
  function(accessToken, refreshToken, profile, cb) { // verify callback
    // a user has logged in via OAuth!
    console.log(profile, "<----- Profile")
    // profile will have the googleId attached to it
    // Fetch the User from the database and provide them back to passport 

    // Check to see if a User exists with the googleId in our database
    // if they do lets just setup the user and call the cb function
    // proceed in the middleware chain
    // profile.id is the googleId
    Student.findOne({'googleId': profile.id}, function(err, studentDoc){
      //googleId is a property on the model that we are searching for the value
      if(err) return cb(err);

      if(studentDoc){
        // If that user exists 
        // lets proceed in the middleware chain to passport!
        // signature for the cb function is cb(error, UserDocument)
        return cb(null, studentDoc)
      } else {
          // if the user doesn't exist we want to create a new User
           // and save them to our database and include that actually googleId to identify the user
           const newStudent = new Student({
             name: profile.displayName,
             email: profile.emails[0].value,
             googleId: profile.id
           })

           newStudent.save(function(err){
            if(err) return cb(err);
            // cb provides the information to passport and pass along in the middleware chain
            return cb(null, newStudent)

           });
      }
    });
  }
));

// This function is called in order to setup our session
// which is a cookie, which will store the database id of our logged in user
passport.serializeUser(function(student, done){
  // student is the document from cb(null, newStudent) or cb(null, student) from the above function
  done(null, student.id); // same signature as cb above, student.id would be the database id
  // we are storing in our cookie to identify who the user with each browser request
})


//The passport.deserializeUser method 
//is used to provide Passport with the user from the db 
//we want assigned to the req.user object. Put it below the passport.serializeUser method:

// decoding the sesssion cookie
passport.deserializeUser(function(id, done){
  // Want to look up the users document by the id, from the session cookie

  Student.findById(id, function(err, studentDoc){
    done(err, studentDoc);

    // req.user = studentDoc
  })
})