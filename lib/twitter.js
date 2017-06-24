require('colors');
const Twitter = require('twitter');
const search = require('./search');

/**
 * @typedef {{
 *   message: string,
 *   code: number
 * }} TwitterError
 */

const RATE_LIMIT_HEADER = 'x-rate-limit-remaining';
const RATE_RESET_HEADER = 'x-rate-limit-reset';

/**
 * Twitter user id used to retrieve tweets.
 * @private {number}
 * @const
 */
const USER_ID = 111507370;

/**
 * @type {number}
 * @const
 */
const POLL_INTERVAL = 10000;

/**
 * Tweets data.
 * @private {Array<Object>}
 */
let tweetData = [];

/**
 * Twitter request parameters.
 * @private {Object}
 */
const restParams = {
  user_id: USER_ID,
  exclude_replies: true,
  include_rts: true,
  count: 3200
};

/**
 * OS Environment variables.
 * @private {Object<string, string>}
 */
const env = process.env;

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
  for (let i = tweetData.length; i-- > 0;) {
    const tweet = tweetData[i];
    if (tweet.id === tweetId || tweet.id_str === tweetId) {
      return true;
    }
  }
  return false;
}

/**
 * Logs Twitter API errors to console.
 * @param {Array<TwitterError>|TwitterError} errors
 */
function logErrors(errors) {
  if (Array.isArray(errors)) {
    for (let i = 0; i < errors.length; i++) {
      logError(errors[i]);
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
    process.stdout.write(error.message.red);
  }
}

function userTimelineHandler(error, data, response) {
  const {headers} = response;
  const remaining = +headers[RATE_LIMIT_HEADER];
  const resetTime = +headers[RATE_RESET_HEADER];

  if (!error) {
    tweetData = [];
    for (let i = 0; i < data.length; i++) {
      let datum = data[i];
      tweetData.push(datum);
    }
  } else {
    logErrors(error);
  }

  const now = new Date().getTime();
  const diff = new Date(resetTime * 1000) - now;
  const delay = remaining > 0 ? POLL_INTERVAL :  diff;
  setTimeout(getUserTimeline, delay);
}

/**
 * Downloads user timeline based on parameters from {@link restParams}.
 * @private
 */
function getUserTimeline() {
  client.get('statuses/user_timeline', restParams, userTimelineHandler);
}

/**
 *
 * @param {string|number} maxId
 * @param {number} count
 * @returns {Array}
 */
function getMaxId(maxId, count) {
  let data = [];
  for (let i = 0; i < tweetData.length; i++) {
    const tweet = getOriginalTweet(tweetData[i]);
    const idStr = tweet.id_str;
    const {id} = tweet;
    if (id === maxId || idStr === maxId) {
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
  return tweets.map((tweet) => {
    tweet = getOriginalTweet(tweet);
    const {user} = tweet;
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

function getOriginalTweet(tweet) {
  return tweet.retweeted ? tweet.retweeted_status : tweet;
}

function getIndicies(entity) {
  if (entity) {
    let ret = [];
    for (let i = 0; i < entity.length; i++) {
      ret = ret.concat(entity[i].indices);
    }
    return ret;
  }
}

function sortRank(ranks) {
  ranks.sort((a, b) => a.rank > b.rank ? -1 : a.rank < b.rank ? 1 : 0);
}

module.exports.search = (term) => {
  const ranks = [];
  tweetData.forEach((tweet) => {
    const t = getOriginalTweet(tweet);
    const urls = getIndicies(t.entities.urls);
    const media = getIndicies(t.entities.media);
    let ignore = [];
    if (Array.isArray(urls)) {
      ignore = ignore.concat(urls);
    }
    if (Array.isArray(media)) {
      ignore = ignore.concat(media);
    }
    const rank = search.search(term, t.text, ignore);
    if (rank > 0) {
      ranks.push({rank, tweet})
    }
  });

  sortRank(ranks);

  return ranks.map(rank => rank.tweet);
};

/**
 * Public method for {@link getUserTimeline}.
 */
module.exports.getUserTimeline = getUserTimeline;

/**
 * Returns downloaded tweet data.
 * @returns {Array}
 */
module.exports.getTweetData = () => tweetData.concat();

module.exports.userTimelineHandler = userTimelineHandler;
module.exports.hasTweetId = hasTweetId;
module.exports.getMaxId = getMaxId;
module.exports.minifyTweets = minifyTweets;
