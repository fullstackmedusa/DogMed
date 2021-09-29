const mongoose = require('mongoose');

// The factSchema is used to embedded docs in as tudent doc.
// There is no model and no 'facts' collection
const factSchema = new mongoose.Schema({
  text: String
}, {
  timestamps: true
});
// One student has many facts, facts belong to one student
// Student model, is basically going to be like your user model, in your app, 
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  cohort: String,
  avatar: String,
  facts: [factSchema],
  googleId: String // <-- This property needs to be on your user model for your project

}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);