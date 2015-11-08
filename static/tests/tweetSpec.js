describe('tweet tests', function() {
  'use strict';

  var Tweet = using('tweet');
  var tweet;
  var tweetTemplate = '<div class="tweet">' +
    '<a href="{{url}}" target="_self" class="user-container" style="color: {{profileColor}}">' +
    '<div class="user-avatar" style="background-image: url({{userimage}}); background-color: {{profileColor}}"></div>' +
    '<div class="flex-box no-wrap"><div class="username">{{username}}</div>' +
    '<div class="screenname">@{{screenName}}</div><div class="timestamp">{{timestamp}}</div></div></a>' +
    '<div class="text">{{text}}</div></div>';
  var tweetData = {
    "id": "663161444813279232",
    "username": "Alex Logashov",
    "url": "https://twitter.com/logashoff/statuses/663161444813279232",
    "timestamp": "Sun Nov 08 01:09:44 +0000 2015",
    "screenName": "logashoff",
    "text": "JavaScript in one picture: https://t.co/QbRwpZTh83",
    "userImage": "/images/twitter/logashoff.jpg",
    "profileColor": "#1F98C7",
    "entities": {
      "hashtags": [],
      "symbols": [],
      "user_mentions": [],
      "urls": [
        {
          "url": "https://t.co/QbRwpZTh83",
          "expanded_url": "https://github.com/coodict/javascript-in-one-pic",
          "display_url": "github.com/coodict/javasc…",
          "indices": [
            27,
            50
          ]
        }
      ]
    }
  };

  beforeEach(function() {
    tweet = new Tweet(tweetData, document.body, tweetTemplate);
  });

  afterEach(function() {
    tweet = null;
  });

  it('check DOM structure', function() {
    var tweetElement = tweet.element;
    var statusUrl = tweetElement.querySelector('a.user-container');
    expect(statusUrl.href).toBe('https://twitter.com/' + tweetData.screenName + '/statuses/' + tweetData.id);
    var usernameEl = tweetElement.querySelector('.username');
    expect(usernameEl.textContent).toBe(tweetData.username);
    var screeNameEl = tweetElement.querySelector('.screenname');
    expect(screeNameEl.textContent).toBe('@' + tweetData.screenName);
    var textEl = tweetElement.querySelector('.text');
    expect(textEl.textContent).toBe(tweetData.text);
  });

  it('render tweet', function() {
    tweet.render();
  });
});