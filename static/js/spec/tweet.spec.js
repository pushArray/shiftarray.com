import Tweet from '../src/tweet';
import sharedTestData from './sharedtestdata';

describe('tweet tests', () => {
  var tweet;
  var tweetData;

  beforeEach(() => {
    tweetData = sharedTestData.getTweetData();
    tweet = new Tweet(tweetData, document.body);
  });

  it('check DOM structure', () => {
    var tweetElement = tweet.element;
    var statusUrl = tweetElement.querySelector('a.user-container');
    expect(statusUrl.href).to.equal('https://twitter.com/' + tweetData.screenName +
      '/statuses/' + tweetData.id);
    var usernameEl = tweetElement.querySelector('.username');
    expect(usernameEl.textContent.trim()).to.equal(tweetData.username);
    var screeNameEl = tweetElement.querySelector('.screenname');
    expect(screeNameEl.textContent.trim()).to.equal('@' + tweetData.screenName);
    var textEl = tweetElement.querySelector('.text');
    expect(textEl.textContent.trim()).to.equal(tweetData.text);
  });

  it('render tweet', () => {
    tweet.render();
  });
});
