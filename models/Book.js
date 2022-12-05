const mongoose = require('mongoose');



// if something is embedded keep it in the same file as what it is being into
const commentSchema = new mongoose.Schema({
	text: String,
	userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	userName: String
})

// One student has many facts, facts belong to one student
// Student model, is basically going to be like your user model, in your app, 
const bookSchema = new mongoose.Schema({
  // <-- This property needs to be on your user model for your project
	userRecommending: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	title: String,
	isbn: String,
	usersReading: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], // <just like movies and performers
	comments: [commentSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);