var cheerio = require("cheerio");
var axios = require("axios");

// First, tell the console what server.js is doing
console.log("\n******************************************\n" +
    "Look at the headlines of front page of Bostong Globe   
    "\n******************************************\n");

// Make request via axios to grab the HTML from `awwards's` clean website section
axios.get("https://www.bostonglobe.com/").then(function (response) {

    // Load the HTML into cheerio
    var $ = cheerio.load(response.data);

    // Make an empty array for saving our scraped info
    var results = [];

    // With cheerio, look at each story, enclosed in "div" tags with the class name "story"
    $("div.story").each(function (i, element) {
        // Save the text of the h2-tag as "title"
        var title = $(element).find("h2").text();

        // Find the h2 tag's a-tag, and save it's href value as "link"
        var link = $(element).find("a").attr("href");

        // Find the div tag with class excerpt to get the summary and save as "summary"

        var summary = $(element).find("div.excerpt").text();
        // Find the img tag to get the photo

        var imgLink = $(element).find("img").attr("src");
        // Find the p tag with class hed-cat to get the byline"

        var hedCat = $(element).find("p.hed-cat").text();



        // Make an object with data we scraped for this h4 and push it to the results array
        results.push({
            title: title,
            hedCat: hedCat,
            link: link,
            summary: summary,
            imgLink: imgLink
        });

        // After looping through each element found, log the results to the console
        console.log(results);
    });
});
