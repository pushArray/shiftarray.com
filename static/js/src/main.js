(function(win, doc) {
'use strict';

var Tweet = using('tweet');
var utils = using('utils');
var appReady = false;

function main() {
  win.removeEventListener('load', main, false);
  if (appReady) {
    return;
  }

  var resizeTimer = 0;
  var listEl = utils.getId('list');
  var busy = false;
  var template = '';
  var windowSize = {
      width: win.innerWidth,
      height: win.innerHeight
    };
  var tweets = [];
  var idCache = [];

  function request(callback, params) {
    busy = true;
    var url = '/tweets/';
    if (params) {
      url += params;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.status === 200 && xhr.readyState === 4) {
        busy = false;
        callback.call(xhr, xhr);
        doc.body.classList.remove('busy');
      }
    };

    doc.body.classList.add('busy');
    xhr.send();
  }

  function responseHandler(xhr) {
    /** @type {TwitterError|Array<SimpleTweet>} */
    var data = JSON.parse(xhr.responseText);
    if (data.errors) {
      win.alert(data.errors[0].message);
      return;
    }

    if (!data.length) {
      win.removeEventListener('scroll', windowScroll);
      return;
    }

    for (var i = 0; i < data.length; i++) {
      /** @type {SimpleTweet} */
      var datum = data[i];
      if (!!~idCache.indexOf(datum.id)) {
        continue;
      }
      idCache.push(datum.id);
      var sideEl = utils.createNode('div');
      sideEl.setAttribute('class', 'side right');
      var tweet = new Tweet(datum, sideEl, template);
      var entryEl = utils.createNode('div');
      entryEl.setAttribute('class', 'entry');
      listEl.appendChild(entryEl);
      entryEl.appendChild(sideEl);
      tweets.push(tweet);
      tweet.render();
    }

    if (listEl.offsetHeight < win.innerHeight) {
      request(responseHandler);
    }
  }

  function windowScroll() {
    if (!busy && win.pageYOffset >= (doc.documentElement.scrollHeight - win.innerHeight) * 0.80) {
      request(responseHandler, idCache[idCache.length - 1]);
    }
  }

  function renderTweets() {
    var ww = win.innerWidth;
    var wh = win.innerHeight;
    if (windowSize.width !== ww || windowSize.height !== wh) {
      for (var i = tweets.length; i-- > 0;) {
        tweets[i].render();
      }
    }
    windowSize.width = ww;
    windowSize.height = wh;
  }

  function windowResize() {
    clearInterval(resizeTimer);
    resizeTimer = setTimeout(renderTweets, 500);
  }

  (function init() {
    template = utils.getId('tweet-template');
    template = template.textContent;
    request(responseHandler);
    win.addEventListener('scroll', windowScroll);
    win.addEventListener('resize', windowResize);
  })();

  appReady = true;
}

if (doc.readyState !== 'complete') {
  win.addEventListener('load', main, false);
} else {
  main.call(win);
}
})(window, document);
