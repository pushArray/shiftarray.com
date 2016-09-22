const chai = require('chai');
const mockFs = require('mock-fs');
const tweets1 = require('./data/tweets1.json');
const tweets2 = require('./data/tweets2.json');
const twitter = require('../lib/twitter');

const expect = chai.expect;

describe('twitter.js', () => {
  var json1 = JSON.stringify(tweets1);
  var json2 = JSON.stringify(tweets2);
  var data1 = [];
  var data2 = [];
  var setTimeoutMock = setTimeout;

  before(() => {
    process.env.TWITTER_CONSUMER_KEY =
      process.env.TWITTER_CONSUMER_SECRET =
        process.env.TWITTER_ACCESS_TOKEN_KEY =
          process.env.TWITTER_ACCESS_TOKEN_SECRET = '';
    setTimeout = (fn, delay) => {};
    mockFs({
      './static/images/twitter/': mockFs.directory()
    })
  });

  beforeEach(() => {
    data1 = JSON.parse(json1);
    data2 = JSON.parse(json2);
  });

  after(() => {
    setTimeout = setTimeoutMock;
    mockFs.restore();
  });

  describe('getUserTimeline without errors', () => {
    beforeEach(() => {
      twitter.userTimelineHandler(null, data1);
    });

    it('tweets have to be defined', () => {
      var arr = twitter.getTweetData();
      expect(arr.length).to.equal(data1.length);
    });

    it('handle tweet', () => {
      expect(twitter.handleTweet(data1[0])).to.be.not.ok;
      expect(twitter.handleTweet(data1[1])).to.be.not.ok;
      expect(twitter.handleTweet(data1[2])).to.be.not.ok;
      expect(twitter.handleTweet(data2[0])).to.be.ok;
      expect(twitter.handleTweet(data2[1])).to.be.ok;
      expect(twitter.handleTweet(data2[2])).to.be.ok;
    });

    it('check tweet by id', () => {
      expect(twitter.hasTweetId(0)).to.be.not.ok;
      expect(twitter.hasTweetId(1)).to.be.not.ok;
      expect(twitter.hasTweetId(2)).to.be.not.ok;
      expect(twitter.hasTweetId(698297854645784600)).to.be.ok;
      expect(twitter.hasTweetId(698229565580308500)).to.be.ok;
      expect(twitter.hasTweetId(673918966771793900)).to.be.ok;
      expect(twitter.hasTweetId('689119204688007168')).to.be.ok;
      expect(twitter.hasTweetId('688226544360140800')).to.be.ok;
    });

    it('get tweets by maxId', () => {
      expect(twitter.getMaxId(669047488330895400, 10).length).to.equal(0);
      expect(twitter.getMaxId('669047488330895362').length).to.equal(0);
      var res = twitter.getMaxId(694624456711405600, 10);
      expect(res.length).to.equal(10);
      expect(res[0].id).to.equal(694564282525089800);
      expect(res[0].id_str).to.equal('694564282525089792');
      expect(res[9].id).to.equal(689119204688007200);
      expect(res[9].id_str).to.equal('689119204688007168');
    });

    it('convert tweets', () => {
      var res1 = twitter.getMaxId(694624456711405600, 10);
      var res2 = twitter.minifyTweets(res1);
      var t1 = res2[0];
      expect(t1.id).to.equal('694535245908021249');
      expect(t1.username).to.equal('JavaScript Live');
      expect(t1.url).to.equal('https://twitter.com/JavaScriptDaily/statuses/694535245908021249');
      expect(t1.timestamp).to.equal('Tue Feb 02 14:58:01 +0000 2016');
      expect(t1.screenName).to.equal('JavaScriptDaily');
      expect(t1.text).to.equal('Simple Code Examples to Help You Understand ES6: https://t.co/V1qKStefHK https://t.co/uIVocXlJDl');
      expect(t1.userImage).to.equal('/images/twitter/JavaScriptDaily.jpg');
      expect(t1.profileColor).to.equal('#177A6E');
      expect(t1.entities).to.be.defined;
      expect(t1.protected).to.be.not.ok;
      var t2 = res2[1];
      expect(t2.id).to.equal('694397640096624640');
      expect(t2.username).to.equal('Alex Logashov');
      expect(t2.url).to.equal('https://twitter.com/logashoff/statuses/694397640096624640');
      expect(t2.timestamp).to.equal('Tue Feb 02 05:51:13 +0000 2016');
      expect(t2.screenName).to.equal('logashoff');
      expect(t2.text).to.equal('Run Windows 95 in your browser: https://t.co/I5xUw5Op2T');
      expect(t2.userImage).to.equal('/images/twitter/logashoff.jpg');
      expect(t2.profileColor).to.equal('#1F98C7');
      expect(t2.entities).to.be.defined;
      expect(t2.protected).to.be.ok;
    })
  });
});
