var mongoose = require("mongoose");
//require plug-in to be used for unique-validation
var uniqueValidator = require('mongoose-unique-validator');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, creates a new ArticleSchema object
var ArticleSchema = new Schema({
  // `headline` is headline of article, is required and of type String
  headline: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  // `link` is the URL to the article, is required and of type String
  link: {
    type: String,
    trim: true
  },
  //`summary` is a short summary of the article
  summary: {
      type: String,
      trim: true
  },
  //`image` is an image associated with the headline
  imgLink: {
      type: String,
      trim: true
  },
  hedCat: {
      type: String,
      trim: true
  },
  // `comments` is an object that stores a Comment id
  // The ref property links the ObjectId to the Comment model
  // This allows us to populate the Article with an associated Comment
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comments"
  }]
});
ArticleSchema.plugin(uniqueValidator);



// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
