$(document).ready(function () {
    console.log(`document ready`);


    //when the home page button is clicked, directed to scrape articles
    $(document).on("click", "#viewArticles", function () {
        event.preventDefault();

        // Now make an ajax call to scrape the articles
        $.ajax({
            method: "GET",
            url: "/scraped/"
        })
            // With that done, add the articles to the page
            .then(function (data) {
                window.location = "/articles";
            });
    });

    // Whenever someone wants to read and/or add comments tag
    $(document).on("click", ".readComments", function () {
         event.preventDefault();

        // Empty the comments from the comment section
        $("#comments").empty();
        // Save the id 
        var thisId = $(this).attr("data-id");

        // make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
            // Add the comment information to the page
            .then(function (data) {

                $("#mainPage").empty();
                $("#articleInfo").append(`
                        <h2> ${data.headline}</h2>
                        <img src="${data.imgLink}">
                        <p> ${data.summary}</p>`);
                // display all previous comments, save id of article and id of comment to delete button
                $("#articleComments").append(`<h1>Comments</h1>`);
                for (let i = 0; i < data.comments.length; i++) {
                    $("#articleComments").append(`<p>${data.comments[i].body}`);
                    $("#articleComments").append(`<button type="button" id="deleteComment" class="btn btn-info btn-sm"
                        article-id=${data._id} comment-id=${data.comments[i]._id}>
                        Delete Comment</button></p><br>`);
                }
                $("#articleComments").append(`<textarea id="commentInput" name="body"></textarea><br>`);
                //  A button to submit a new comment, with the id of the articlesaved to it
                $("#articleComments").append(`<button class="btn btn-info btn-sm" data-id=${data._id} id='saveComment'>Add a comment</button>`);

            });
    });

    // When you click the savecomment button
    $(document).on("click", "#saveComment", function () {
        event.preventDefault();
        // Get the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");
        // Run a POST request to change the comment, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from comment textarea
                body: $("#commentInput").val()
            }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // reload articles page
                window.location = "/articles";
            });

    });
    $(document).on("click", "#deleteComment", function () {
        event.preventDefault();
        // Get the id associated with the article from the submit button
        var articleId = $(this).attr("article-id");
        var commentId = $(this).attr("comment-id");

        // Run a POST request to change the comment, using what's entered in the inputs
        $.ajax({
            method: "POST",
            // url: "/delarticles/" + articleId + "/" + commentId,
            url: "/delarticles/" + $(this).attr("article-id") + "/" + $(this).attr("comment-id")
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // reload articles page
                window.location = "/articles";
            });

    });

});