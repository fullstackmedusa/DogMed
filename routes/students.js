var router = require('express').Router();
var studentsCtrl = require('../controllers/students');

// GET /students
router.get('/', studentsCtrl.index);





module.exports = router;
