$(document).ready(getNYTNews());

function getNYTNews() {
    var url = "https://api.nytimes.com/svc/topstories/v1/";
    url += 'health.json';
    url += '?' + $.param({
      'api-key': "bec3721eb32743b0a2bb27d97dcf1272"
    });
    $.ajax({
      url: url,
      dataType: 'json',
      method: 'GET',
    }).done(function(result) {
        console.log(result);
        var selectedNews = chooseThreeStories(result);
        renderArticles(selectedNews);
    }).fail(function(err) {
      throw err;
    });
}

function renderArticles(articles) {
    var title, url, abstract, byline, date, image;
    $.each(articles, function(i, article) {
        console.log(article);
        title = article.title;
        url = article.url;
        abstract = article.abstract;
        byline = article.byline;
        date = article.created_date;
        try {
            image = article.multimedia['1']['url'];
        } catch (e) {
            if (e instanceof TypeError) {
                image = 'images/default.png';
            }
        }
        console.log(image);


    });
}

function chooseThreeStories(result) {
    var numberArticles = result.results.length;
    var articleIds = getThreeIndexes(numberArticles);
    var news = getNews(articleIds, result.results);
    return news;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getNews(indices, articles) {
    var list = [];
    indices.forEach( function(item, index) {
        list.push(articles[item]);
    });
    return list;
}

function getThreeIndexes(number) {
    // Get three random numbers.
    var indices = [];
    for (var i = 0; i < 3; i++) {
        var randNum = getRandomInt(0, number);
        indices.push(randNum);
    }
    return indices;
}
