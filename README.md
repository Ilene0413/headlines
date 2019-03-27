# bostonglobe

This app lets users view and leave comments on the latest news from the **Boston Globe**. The app uses **Cheerio** to scrape news from the **Boston Globe** website. Articles should not be duplicated.

Whenever a user visits the site, the app scrapes stories from the **Boston Globe** website and displays them for the user. Each scraped article is saved in the **Mongo database**. The app scrapes and displays the following information for each article:

**Headline** - the title of the article

**Summary** - a short summary of the article

**URL** - the url to the original article

**Image** if one exists

**Hed Category** - may be byline, writer, section of Newspaper it can be found, etc.

Users can leave comments on the articles displayed and revisit them later. The comments are saved to the database as well and associated with their articles. Users can also delete comments left on articles. All stored comments are visible to every user.

The app uses **express**, **express-handlebars**, **mongoose**, **cheerio**, **axios**, **ajax**, **jquery**, and **mongoose-unique-validator**.

Pictures are found their google searches and come from different sites.

Developed by Ilene Cohen.
email: ilene413@icloud.com

