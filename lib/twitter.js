require('colors');
const fs = require('fs');
const https = require('https');
const Twitter = require('twitter');

/**
 * @typedef {{
 *   message: string,
 *   code: number
 * }} TwitterError
 */

/**
 * Twitter user id used to retrieve tweets.
 * @private {number}
 */
const userId = 111507370;

/**
 * Milliseconds per minute.
 * @private {number}
 */
const msPerMinute = 60 * 1000;

/**
 * Minimum number of tweets per request.
 * @private {number}
 */
const minCount = 300;

/**
 * Indicates active Twitter connection.
 * @private {boolean}
 */
var pendingData = false;

/**
 * Tweets data.
 * @private {Array<Object>}
 */
var tweetData = [];

/**
 * Twitter request parameters.
 * @private {Object}
 */
var restParams = {
  user_id: userId,
  exclude_replies: true,
  include_rts: true,
  count: minCount
};

/**
 * OS Environment variables.
 * @private {Object<string, string>}
 */
var env = process.env;

/**
 * Twitter client.
 * @private {Twitter}
 */
const client = new Twitter({
  consumer_key: env.TWITTER_CONSUMER_KEY,
  consumer_secret: env.TWITTER_CONSUMER_SECRET,
  access_token_key: env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: env.TWITTER_ACCESS_TOKEN_SECRET
});

/**
 * Checks if current data contains tweet with specified id.
 * @param {string|number} tweetId Tweet id.
 * @returns {boolean} True if current data contains tweet with specified id.
 * @private
 */
function hasTweetId(tweetId) {
  if (!tweetId) {
    return false;
  }
  for (var i = tweetData.length; i-- > 0;) {
    var tweet = tweetData[i];
    if (tweet.id === tweetId || tweet.id_str === tweetId) {
      return true;
    }
  }
  return false;
}

/**
 * Delay data request.
 * @param {number=} delay Delay in milliseconds. Default is 30 min.
 * @private
 */
function delayRequest(delay) {
  delay = delay || 30 * msPerMinute;
  setTimeout(getUserTimeline, delay);
}

/**
 * Logs Twitter API errors to console.
 * @param {Array<TwitterError>|TwitterError} errors
 */
function logErrors(errors) {
  if (Array.isArray(errors)) {
    var i = 0;
    var l = errors.length;
    for (; i < l; i++) {
      var error = errors[i];
      logError(error);
    }
  } else {
    logError(errors);
  }
}

/**
 * Logs Twitter API error to console.
 * @param {TwitterError} error
 */
function logError(error) {
  if (error && error.message) {
    console.warn(error.message.red);
  }
}

function userTimelineHandler(error, data) {
  pendingData = false;
  if (!error) {
    tweetData = [];
    for (var i = 0; i < data.length; i++) {
      var datum = data[i];
      tweetData.push(datum);
    }
    delayRequest();
  } else {
    logErrors(error);
    delayRequest();
  }
}

/**
 * Downloads user timeline based on parameters from {@link restParams}.
 * @private
 */
function getUserTimeline() {
  if (pendingData) {
    return;
  }
  pendingData = true;
  client.get('statuses/user_timeline', restParams, userTimelineHandler);
}

/**
 *
 * @param {string|number} maxId
 * @param {number} count
 * @returns {Array}
 */
function getMaxId(maxId, count) {
  var data = [];
  var i = 0;
  var l = tweetData.length;
  for (; i < l; i++) {
    var tweet = tweetData[i];
    var id_str = '';
    var id = 0;
    if (tweet.retweeted) {
      id_str = tweet.retweeted_status.id_str;
      id = tweet.retweeted_status.id;
    } else {
      id_str = tweet.id_str;
      id = tweet.id;
    }
    if (id === maxId || id_str === maxId) {
      data = tweetData.slice(i + 1, i + count + 1);
      break;
    }
  }
  return data;
}

/**
 * Transforms Twitter REST response object into a simple data structure.
 * @param {Array} tweets - Twitter data.
 * @returns {Array}
 */
function minifyTweets(tweets) {
  return tweets.map(function(tweet) {
    tweet = tweet.retweeted ? tweet.retweeted_status : tweet;
    var user = tweet.user;
    return {
      id: tweet.id_str,
      username: user.name,
      url: `https://twitter.com/${user.screen_name}/statuses/${tweet.id_str}`,
      timestamp: tweet.created_at,
      screenName: user.screen_name,
      text: tweet.text,
      userImage: user.profile_image_url_https,
      profileColor: `#${user.profile_link_color}`,
      entities: tweet.entities,
      protected: user.protected
    }
  });
}

/**
 * Public method for {@link getUserTimeline}.
 */
module.exports.getUserTimeline = getUserTimeline;

/**
 * Returns downloaded tweet data.
 * @returns {Array}
 */
module.exports.getTweetData = () => {
  return tweetData.concat();
};

module.exports.userTimelineHandler = userTimelineHandler;
module.exports.hasTweetId = hasTweetId;
module.exports.getMaxId = getMaxId;
module.exports.minifyTweets = minifyTweets;
