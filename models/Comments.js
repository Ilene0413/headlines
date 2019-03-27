var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var CommentsSchema = new Schema({
  //title is type string
  title: String,
  // `body` is of type String
  body: { 
  type: String,
  trim: true,
  required: true
  }
});

// This creates our model from the above schema, using mongoose's model method
var Comments = mongoose.model("Comments", CommentsSchema);

// Export the Note model
module.exports = Comments;

