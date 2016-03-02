import utils from '../src/utils';

describe('utils.js', () => {
  it('createNode', () => {
    let el = utils.createNode('div', {
      'id': 'foo',
      'class': 'my class'
    });
    expect(el.nodeName).to.equal('DIV');
    expect(el.nodeType).to.equal(Node.ELEMENT_NODE);
    expect(el.getAttribute('id')).to.equal('foo');
    expect(el.getAttribute('class')).to.equal('my class');
  });

  it('replaceHtmlEntities', () => {
    let html = '&lt;foo&gt;';
    expect(utils.replaceHtmlEntities(html)).to.equal('<foo>');
  });

  it('getShortDate', () => {
    expect(utils.getShortDate(new Date(1970, 0, 1))).to.equal('Jan 1, 1970');
    let currDate = new Date();
    let testDate = new Date(
      currDate.getFullYear(),
      currDate.getMonth(),
      currDate.getDate(),
      currDate.getHours() - 25,
      currDate.getMinutes(),
      currDate.getSeconds(),
      currDate.getSeconds()
    );
    expect(utils.getShortDate(testDate)).to.equal('1d');
    testDate = new Date(
      currDate.getFullYear(),
      currDate.getMonth(),
      currDate.getDate(),
      currDate.getHours() - 50,
      currDate.getMinutes(),
      currDate.getSeconds(),
      currDate.getSeconds()
    );
    expect(utils.getShortDate(testDate)).to.equal('2d');
    testDate = new Date(
      currDate.getFullYear(),
      currDate.getMonth(),
      currDate.getDate() - 7,
      currDate.getHours(),
      currDate.getMinutes(),
      currDate.getSeconds(),
      currDate.getSeconds()
    );
    expect(utils.getShortDate(testDate)).to.equal('1w');
  });

  it('utcToDate', () => {
    let date = utils.utcToDate('Fri Feb 12 19:37:55 +0000 2016');
    expect(date.getUTCFullYear()).to.equal(2016);
    expect(date.getUTCMonth()).to.equal(1);
    expect(date.getUTCDate()).to.equal(12);
    expect(date.getUTCHours()).to.equal(19);
    expect(date.getUTCMinutes()).to.equal(37);
    expect(date.getUTCSeconds()).to.equal(55);
  });

  it('getFullDate', () => {
    let date = utils.getFullDate(new Date(2016, 1, 23, 11, 25, 50));
    expect(date).to.equal('23 Feb, 2016 - 11:25');
  });
});
