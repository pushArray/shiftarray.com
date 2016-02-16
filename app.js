require('colors');
const express = require('express');
const twitter = require('./twitter');

/**
 * Port number.
 * @private {number}
 */
const port = 8080;

/**
 * Page title.
 * @private {string}
 */
const pageTitle = 'shiftArray(com)';

function tweetsHandler(req, res) {
  var maxId = req.params.maxId;
  var count = parseInt(req.params.count, 10) || 10;
  var data = twitter.getMaxId(maxId, count);
  if (!data.length) {
    data = twitter.getTweetData().slice(0, count);
  }
  res.send(twitter.minifyTweets(data));
}

/**
 * Express application.
 * @private {Express}
 */
const app = express();
app.use(express.static(__dirname + '/static'));
app.use(function(req, res, next) {
  res.set('X-Frame-Options', 'SAMEORIGIN');
  next();
});
app.set('views', 'templates');
app.set('view engine', 'jade');
app.get('/tweets/:maxId?/:count?', tweetsHandler);
app.get('/:search?', function(req, res) {
  res.render('index', {
    pageTitle: pageTitle
  });
});
app.use(function(req, res) {
  res.redirect('/');
});


module.exports.start = function() {
  twitter.getUserTimeline();
  app.listen(port);
  console.log('Server running...'.green);
};


