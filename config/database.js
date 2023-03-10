const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/students', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

// database connection event
db.on('connected', function () {
  console.log(`Mongoose connected to: ${db.host}:${db.port}`);
});

db.on('error', function(err){
  console.log(err)
})