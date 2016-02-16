import sharedTestData from './sharedtestdata';
import Tweet from '../src/tweet';

describe('tweet tests', () => {

  let doc = document;
  let body = doc.body;

  afterEach(() => {
    let fc = body.firstChild;
    while (fc) {
      body.removeChild(fc);
      fc = body.firstChild;
    }
  });

  function isValidTweet(tweet, data) {
    let tweetElement = tweet.element;
    if (!data.protected) {
      let statusUrl = tweetElement.querySelector('a.user-container');
      expect(statusUrl.href).to.equal(
        `https://twitter.com/${data.screenName}/statuses/${data.id}`);
    }
    let usernameEl = tweetElement.querySelector('.username');
    expect(usernameEl.textContent.trim()).to.equal(data.username);
    let screeNameEl = tweetElement.querySelector('.screenname');
    expect(screeNameEl.textContent.trim()).to.equal(`@${data.screenName}`);
  }

  it('check tweet with URLs', () => {
    let data = sharedTestData.getTweetWithUrls();
    let tweet = new Tweet(data, body);
    tweet.render();
    isValidTweet(tweet, data);
  });

  it('check tweet with hashtags', () => {
    let data = sharedTestData.getTweetWithHashtags();
    let tweet = new Tweet(data, body);
    tweet.render();
    isValidTweet(tweet, data);
  });

  it('check tweet with user mentions', () => {
    let data = sharedTestData.getTweetWithUserMentions();
    let tweet = new Tweet(data, body);
    tweet.render();
    isValidTweet(tweet, data);
  });
});
