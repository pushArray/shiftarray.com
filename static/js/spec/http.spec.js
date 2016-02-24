import chaiSpy from 'chai-spies';
import sharedTestData from './shared_test_data';
import sinon from 'sinon';
import http from '../src/http';

chai.use(chaiSpy);

describe('http.js', () => {

  it('build URL from params', () => {
    expect(http.buildUrl('http://site.com')).to.equal('http://site.com/');
    expect(http.buildUrl('//site.com')).to.equal('//site.com/');
    expect(http.buildUrl('site.com')).to.equal('site.com/');
    expect(http.buildUrl('site.com', 1, 2, 3, 4)).to.equal('site.com/1/2/3/4');
    expect(http.buildUrl('site.com', 1, 2, 3)).to.equal('site.com/1/2/3');
    expect(http.buildUrl('//site.com', 1, 2)).to.equal('//site.com/1/2');
    expect(http.buildUrl('https://site.com', 1)).to.equal('https://site.com/1');
    expect(http.buildUrl('http://site.com', 'foo')).to.equal('http://site.com/foo');
    expect(http.buildUrl('site.com', 'foo', 'bar')).to.equal('site.com/foo/bar');
    expect(http.buildUrl('site.com', 'foo', 'bar', 'baz')).to.equal('site.com/foo/bar/baz');
    expect(http.buildUrl('', 'foo', 'bar', 'baz')).to.equal('/foo/bar/baz');
    expect(http.buildUrl('/api', 'foo', 'bar', 'baz')).to.equal('/api/foo/bar/baz');
  });

  describe('http.request', () => {
    let server;
    let requests;

    before(() => {
      server = sinon.fakeServer.create();
      requests = [];
      server.onCreate = (req) => {
        requests.push(req);
      };
    });

    after(() => {
      server.restore();
    });

    it('make request', () => {
      let spy = chai.spy(() => {});
      let json = JSON.stringify(sharedTestData.getTweetWithUrls());
      expect(http.busy).to.equal(false);
      http.request('/get/tweet', spy, 'GET');
      expect(http.busy).to.equal(true);
      server.requests[0].respond(200, {'Content-Type': 'application/json'}, json);
      expect(http.busy).to.equal(false);
      expect(spy).to.have.been.called.min(1);
    });
  });
});
