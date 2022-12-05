const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const Student = require("../models/student");
// this will be your User model in your project ^

// this file is required in our server.js, right our db
// configuring Passport!

// Method to plug in an instaance of the Oauth (new GoogleStrategy)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET, // <--- the info that we registerd with the provideder (google) to identify our app
      callbackURL: process.env.GOOGLE_CALLBACK,
    },

    function (accessToken, refreshToken, profile, cb) {
      // <- verify callback function, this function is called
      // whenever the user has been logged in using the oAuth
      console.log(profile, "<----- Profile"); // <--- Is going to be the users that just logged information from google

      // Search you database and see if the user exists
      // User.findOne({'googleId': profile.id})
      Student.findOne({ googleId: profile.id }, function (err, studentDoc) {
        if (err) return cb(err); // if there is an error use the callback to proceed to the next line in middleware

        if (studentDoc) {
          // if the user exists
            // cb signature is - cb
          return cb(null, studentDoc); // send the user doc to the next a middleware function in passport
          // cb is verify callback that will pass  our information to passport.serializeUser at the bottom of the file
          // cb(error, SuccessWhichIsYourUserDocument)
        } else {
          // Create the user in the db
          const newStudent = new Student({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });

          newStudent.save(function (err) {
            if (err) return cb(err);
            return cb(null, newStudent); // success, pass that student doc to the next place in the middleware chain,p
          });

          // The above is equivelant to
          // Student.create(
          //   {
          //     name: profile.displayName,
          //     email: profile.emails[0].value, // THis object should match the keys and values in our schema, be sure to include the
          //     // googleId
          //     googleId: profile.id,
          //   },
          //   function (err, newStudentDoc) {
          //     if (err) return cb(err);
          //     return cb(null, newStudent);
          //   }
          // );
        }
      });
    }
  )
);


// First argument is, is going to be the document that you passed to your cb(null, studentDoc)
passport.serializeUser(function(student, done) { // whats called after the verify callback cb(null, mongooseDocument)
  // student, (maybe in your app, you call user), but is the document from the db

  // second argument, done, is given to us by passport, and this is where passport adds the users id to the session cookie, (Connect.sid),
  // that tracks who the user is that is making the request from the browser
  done(null, student.id); // done(err, passTheDocumentIdOfTheUserHere)
  // we just store the users id in the cookie
});

passport.deserializeUser(function(id, done) {// On every request when the user is logged in this function will be called
  // The id is coming from our session cookie, its the id from line 73 
  Student.findById(id, function (err, studentDoc) { // search our databases for the user, with the id from the session
    done(err, studentDoc); // when we call done here pass in the studentDoc,  This is where req.user = studentDoc
  });
});
