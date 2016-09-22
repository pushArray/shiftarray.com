require('colors');
const express = require('express');
const path = require('path');
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

/**
 * Express application.
 * @private {Express}
 */
const app = express();

app.use(express.static('static'));
app.use((req, res, next) => {
  res.set('X-Frame-Options', 'SAMEORIGIN');
  next();
});

app.set('views', 'templates');
app.set('view engine', 'jade');

app.get('/tweets/:maxId?/:count?', (req, res) => {
  var maxId = req.params.maxId;
  var count = parseInt(req.params.count, 10) || 10;
  var data = twitter.getMaxId(maxId, count);
  if (!data.length && maxId === '0') {
    data = twitter.getTweetData().slice(0, count);
  }
  res.send(twitter.minifyTweets(data));
});

app.get('/:search?', (req, res) => {
  res.render('index', {
    pageTitle: pageTitle
  });
});

app.use((req, res) => {
  res.redirect('/');
});

module.exports.start = () => {
  twitter.getUserTimeline();
  app.listen(port);
  console.log('Server running...'.green);
};


