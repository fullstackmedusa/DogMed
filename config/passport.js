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
 
  function(accessToken, refreshToken, profile, cb) { 
    console.log(profile, "<----- Profile")
   
    Student.findOne({'googleId': profile.id}, function(err, studentDoc){
      
      if(err) return cb(err);

      if(studentDoc){
      
        return cb(null, studentDoc)
      } else {
         
           const newStudent = new Student({
             name: profile.displayName,
             email: profile.emails[0].value,
             googleId: profile.id
           })

           newStudent.save(function(err){
            if(err) return cb(err);
            return cb(null, newStudent)

           });
      }
    });
  }
));


passport.serializeUser(function(student, done){

  done(null, student.id); 
})


passport.deserializeUser(function(id, done){


  Student.findById(id, function(err, studentDoc){
    done(err, studentDoc);

  })
})