var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// scraping tools
// Axios is a promised-based http library
// It works on the client and on the server
var axios = require("axios");

//Cheerio will parse the data returned from scraping
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

//Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Routes

//get the home page route

app.get("/", function (req, res) {
  res.render("home");
});


// A GET route for scraping the Boston Globe website
app.get("/scraped", function (req, res) {
  // First, get the body of the html with axios
  axios.get("https://www.bostonglobe.com/")
    .then(function (response) {
      // Then, load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      let articles = []
      // Now, get every div with a class of story and do the following:
      $("div.story").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the headline, href of every link, summary (excerpt), and IMG link and save them as properties of the result object
        result.headline = $(this)
          .find("h2")
          .text();
        result.link = $(this)
          .find("a")
          .attr("href");
        result.summary = $(this)
          .find("div.excerpt")
          .text();
        result.imgLink = $(this)
          .find("img")
          .attr("src");
        result.hedCat = $(this)
          .find("p.hed-cat")
          .text();
        //check if image link is blank
        // Create a new Article in the mongoheadlines db using the `result` object built from scraping
        //save articles in an array to be used to display
        articles.push(result);
         db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);

          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(`in error - duplicate`)
             console.log(err);
          });

      });
      console.log(`scrape complete`);
      res.json(articles);

    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
      };
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      let hbsObject = {
        articles: dbArticle
      }
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", hbsObject);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's comments
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the comments associated with it
    .populate("comments")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);

    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      console.log(`error in get article and populate`, err);
      res.json(err);
    });
});

// Route for saving/updating an Article's associated comment
app.post("/articles/:id", function (req, res) {
  // Create a new comment and pass the req.body to the entry
  db.Comments.create(req.body)
    .then(function (dbComment) {
      // If a Comment was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Comment
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push:{ comments: dbComment._id }}, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      console.log(`error in create`, err);
      res.json(err);
    });
});
// Remove a comment from an article
app.post("/delarticles/:id/:commentId", function (req, res) {
 // Find the comment and delete it from the comments collection and the related article comments array 
 db.Comments.findByIdAndDelete(req.params.commentId)
   .then(function (dbComment) {
     // If a comment was deleted successfully from comments collection, find one Article with an `_id` equal to `req.params.id`. Update the Article to remove Note
     // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
     // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
     return db.Article.findOneAndUpdate({ _id: req.params.id }, { $pull: { comments: req.params.commentId} }, { new: true });

   })
   .then(function (dbArticle) {
     // If we were able to successfully update an Article, send it back to the client
     res.json(dbArticle);
   })
   .catch(function (err) {
     // If an error occurred, send it to the client
     console.log(`error in delete`, err);
     res.json(err);
   });
});


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
