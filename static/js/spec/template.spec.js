import sharedTestData from './sharedtestdata';
import Template from '../src/template';

describe('template.js', () => {

  it('create template for protected tweet', () => {
    let tweetData = sharedTestData.getTweetWithUrls();
    let template = Template.create(tweetData);
    let templateString = template.get();
    expect(templateString).to.contain(tweetData.username);
    expect(templateString).to.contain(tweetData.screenName);
    expect(templateString).to.contain(tweetData.profileColor);
  });

  it('create template for unprotected tweet', () => {
    let tweetData = sharedTestData.getTweetWithHashtags();
    let template = Template.create(tweetData);
    let templateString = template.get();
    expect(templateString).to.contain(tweetData.username);
    expect(templateString).to.contain(tweetData.screenName);
    expect(templateString).to.contain(tweetData.profileColor);
    expect(templateString).to.contain(tweetData.url);
  });
});
