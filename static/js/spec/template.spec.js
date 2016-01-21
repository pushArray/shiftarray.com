import Template from '../src/template';
import sharedTestData from './sharedtestdata';

describe('template.js', () => {
  var tweetData;

  beforeEach(() => {
    tweetData = sharedTestData.getTweetData();
  });

  it('test static method', () => {
    var template = Template.create(tweetData);
    var templateString = template.get();
    expect(templateString).to.contain(tweetData.username);
    expect(templateString).to.contain(tweetData.screenName);
    expect(templateString).to.contain(tweetData.profileColor);
    expect(templateString).to.contain(tweetData.url);
  });
});
