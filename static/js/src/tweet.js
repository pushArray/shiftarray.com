provide('tweet', function() {
  'use strict';

  var doc = document;
  var html = doc.documentElement;
  var utils = using('utils');

  /**
   * Tweet constructor function.
   * @param {SimpleTweet} data Tweet data object.
   * @param {Element} parentEl Parent element where Tweet instance element will be attached.
   * @param {string} template Template used to create Tweet instance DOM.
   * @constructor
   */
  function Tweet(data, parentEl, template) {
    /** @private {SimpleTweet} */
    this.data_ = data;

    /** @public {Element} */
    this.element = Tweet.createDom_(template, parentEl, data);

    Object.seal(this);
  }

  /**
   * Creates initial Tweet DOM structure.
   * @param {string} template - Template from which Tweet DOM will be created.
   * @param {Element} parent - Parent element.
   * @param {SimpleTweet} data - Tweet data.
   * @return {Element} Tweet DOM element.
   * @private @static @const
   */
  Tweet.createDom_ = function(template, parent, data) {
    data.text = utils.replaceHtmlEntites(data.text);
    data.timestamp = utils.timeAgo(data.timestamp);
    var el = utils.createNode('div');
    el.innerHTML = Mustache.render(template.trim(), data);
    el = el.firstChild;
    parent.style.borderColor = data.profileColor;
    parent.appendChild(el);
    return el;
  };

  /**
   * Creates and returns container element for tweet line.
   * @return {Element}
   * @private
   */
  Tweet.prototype.createLine_ = function() {
    var el = utils.createNode('div');
    el.setAttribute('class', 'line inline');
    return el;
  };

  /**
   * Renders Tweet text elements. Tweet element has to be attached to DOM.
   */
  Tweet.prototype.render = function() {
    if (!html.contains(this.element)) {
      throw new Error('Cannot render Tweet unless element is part of DOM');
    }

    /** @type {SimpleTweet} */
    var data = this.data_;
    var text = data.text.replace(/(\n|\r)/gm, ' ');
    /** @type {TweetEntity} */
    var entities = data.entities;
    var urls = entities.urls;
    var hasURLs = !!urls.length;
    var i = 0;
    var u;
    if (hasURLs) {
      for (; i < urls.length; i++) {
        u = urls[i];
        text = text.replace(u.url, u.display_url);
      }
    }

    var hasMeds = !!entities.media && !!entities.media.length;
    if (hasMeds) {
      for (i = 0; i < entities.media.length; i++) {
        u = entities.media[i];
        text = text.replace(u.url, '');
      }
    }

    var fontSize = 36;
    var lineEl = this.element.querySelector('.text');
    lineEl.textContent = '';
    lineEl.style.fontSize = fontSize + 'px';

    // Get parent width before adding any lines
    var parentWidth = lineEl.offsetWidth;
    var lineStr = '';
    var maxLineLen = 26;
    var minLineLen = 8;
    var testStr = '';
    var currLine = this.createLine_();
    var linesArr = [lineEl.appendChild(currLine)];
    var wordsArr = text.split(' ');
    var l = wordsArr.length;
    for (i = 0; i < l; i++) {
      var word = wordsArr[i];
      if (!word) {
        continue;
      }

      word = utils.limitString(word, maxLineLen);
      testStr = lineStr + ' ' + word;
      testStr = testStr.trim();
      currLine.textContent = testStr;
      var lastWord = i === l - 1;
      if (testStr.length > maxLineLen) {
        if (lineStr.length < minLineLen || lastWord && word.length < minLineLen) {
          lineStr = testStr;
        } else {
          currLine.textContent = lineStr.trim();
          currLine = this.createLine_();
          linesArr.push(lineEl.appendChild(currLine));
          lineStr = '';
          i--;
        }
      } else {
        lineStr = testStr;
      }
    }
    var n = linesArr.length;
    var s = 1;
    var w = 0;
    var h = 0;
    for (i = 0; i < n; i++) {
      l = linesArr[i];
      l.style.lineHeight =
      l.style.fontSize = fontSize * parentWidth / l.offsetWidth + 'px';
      l.style.zIndex = n - i;
      s = parentWidth / l.offsetWidth;
      if (s !== 1) {
        w = l.offsetWidth;
        h = l.offsetHeight;
        l.style[utils.cssPrefix.css + 'transform'] = l.style.transform = 'matrix(' + s + ',0,0,' +
          s + ',' + s * (parentWidth - w) * 0.5 + ',' + (h - s * h) + ')';
      }

      l.setAttribute('class', 'line');
    }

    var content = '';
    var linkColor = data.profileColor;
    if (hasURLs) {
      for (i = 0; i < urls.length; i++) {
        u = urls[i];
        testStr = utils.limitString(u.display_url, maxLineLen);
        content = '<a style="color:' + linkColor + ';" href="' + u.expanded_url + '">' +
          testStr + '</a>';
        lineEl.innerHTML = lineEl.innerHTML.replace(testStr, content);
      }
    }

    var userMentions = entities.user_mentions;
    var hasUsrs = !!userMentions.length;
    if (hasUsrs) {
      for (i = 0; i < userMentions.length; i++) {
        u = userMentions[i];
        testStr = utils.limitString('@' + u.screen_name, maxLineLen);
        content = '<a style="color:' + linkColor + ';" href="//twitter.com/' +
          u.screen_name + '">' + testStr + '</a>';
        lineEl.innerHTML = lineEl.innerHTML.replace(testStr, content);
      }
    }

    var hashTags = entities.hashtags;
    var hasHash = !!hashTags.length;
    if (hasHash) {
      for (i = 0; i < hashTags.length; i++) {
        u = hashTags[i];
        testStr = utils.limitString('#' + u.text, maxLineLen);
        content = '<a style="color:' + linkColor + ';" href="//twitter.com/search?q=%23' +
          u.text + '&src=hash">' + testStr + '</a>';
        lineEl.innerHTML = lineEl.innerHTML.replace(testStr, content);
      }
    }
  };

  Object.seal(Tweet);
  return Tweet;
});
