var router = require('express').Router();
var studentsCtrl = require('../controllers/students');
const student = require('../models/student');

// GET /students
router.get('/students', studentsCtrl.index);
router.post('/facts', isLoggedIn, studentsCtrl.addFact);


// custom authorization middleware function
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    // req.isAuthenticated function is given to us by passport
    res.redirect('/auth/google')
}


module.exports = router;
