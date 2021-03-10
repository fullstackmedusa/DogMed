const Student = require('../models/student');

module.exports = {
  index,
  addFact
};

function addFact(req, res){
  console.log(req.user, ' req.user');

  // req.user is the mongoose document of our logged in user
  req.user.facts.push(req.body);
  // if mutate a document we have to save it
  req.user.save(function(err) {
    res.redirect('/students')
  })
}

function index(req, res, next) {
  console.log(req.query)
  // Make the query object to use with Student.find based up
  // the user has submitted the search form or now
  let modelQuery = req.query.name ? {name: new RegExp(req.query.name, 'i')} : {};
  // Default to sorting by name
  let sortKey = req.query.sort || 'name';
  Student.find(modelQuery)
  .sort(sortKey).exec(function(err, students) {
    if (err) return next(err);
    // Passing search values, name & sortKey, for use in the EJS
    res.render('students/index', {
      students,
      user: req.user,
      name: req.query.name,
      sortKey
    });
  });
}


