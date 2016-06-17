$(document).ready(getNYTNews());
// Function to make the AJAX request.
function getNYTNews() {
    var url = "https://api.nytimes.com/svc/topstories/v1/";
    url += 'health.json';
    url += '?' + $.param({
      'api-key': secretKey.key
    });
    $.ajax({
      url: url,
      dataType: 'json',
      method: 'GET',
    }).done(function(result) {
        var selectedNews = chooseThreeStories(result);
        renderArticles(selectedNews);
    }).fail(function(err) {
        // TODO: Learn about dealing with response errors.
        var error = $('.templates .error').clone();
        error.find('p');
        $('.container').append(error);
      // throw err;
    });
}
// Function to do the final rendering to the DOM.
function renderArticles(articles) {
    console.log(articles);
    var title, url, abstract, byline, date, image;
    $.each(articles, function(i, article) {
        title = article.title;
        url = article.url;
        abstract = article.abstract;
        byline = article.byline;
        date = article.created_date;
        // Sometimes the image url isn't available.
        if ((Array.isArray(article.multimedia)) &&
            (article.multimedia.length > 1) &&
            (article.multimedia[1].hasOwnProperty('url'))) {
            image = article.multimedia['1']['url'];
        } else {
            image = 'images/default.png';
        }

        // Clone the template and fill in the data.
        var result = $('.templates .article').clone();

        var imgElem = result.find('img.thumb');
        imgElem.attr('src', image);
        imgElem.attr('alt', title);

        var titleElem = result.find('h2.title');
        titleElem.text(title);

        var abstractElem = result.find('.abstract');
        abstractElem.text(abstract);

        var bylineElem = result.find('.byline');
        bylineElem.text(byline);

        var linkElem = result.find('.link a');
        linkElem.attr('href', url);
        // Append the article to the page container.
        $('.container').append(result);
    });
}
// Get the length of the result so I can determine the max
// possible number of articles from which to choose.
function chooseThreeStories(result) {
    var numberArticles = result.results.length;
    var articleIds = getThreeIndexes(numberArticles);
    var news = getNews(articleIds, result.results);
    return news;
}
// Function to elicit a pseudo random number.
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
// Using the randomly generated indices, get the corresponding articles.
function getNews(indices, articles) {
    var list = [];
    indices.forEach( function(item, index) {
        list.push(articles[item]);
    });
    return list;
}
// Function to make sure that three unique indices are chosen.
function getThreeIndexes(number) {
    // Get three random numbers.
    var indices = [];
    for (var i = 0; i < 3; i++) {
        var randNum = getRandomInt(0, number);
        var pos = indices.indexOf(randNum);
        if (pos != -1) {
            i -= 1;
            continue;
        } else {
            indices.push(randNum);
        }
    }
    return indices;
}
