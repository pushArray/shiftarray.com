import utils from '../src/utils';

describe('utils tests', () => {
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

  it('timeAgo', () => {
    expect(utils.timeAgo(new Date(1970, 0, 1))).to.equal('Jan 1, 1970');
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
    expect(utils.timeAgo(testDate)).to.equal('1 day ago');
    testDate = new Date(
      currDate.getFullYear(),
      currDate.getMonth(),
      currDate.getDate() - 2,
      currDate.getHours(),
      currDate.getMinutes(),
      currDate.getSeconds(),
      currDate.getSeconds()
    );
    expect(utils.timeAgo(testDate)).to.equal('2 days ago');
    testDate = new Date(
      currDate.getFullYear(),
      currDate.getMonth(),
      currDate.getDate() - 7,
      currDate.getHours(),
      currDate.getMinutes(),
      currDate.getSeconds(),
      currDate.getSeconds()
    );
    expect(utils.timeAgo(testDate)).to.equal('1 week ago');
  });

  it('limitString', () => {
    let str = 'Lorem ipsum dolor sit amet';

    let limitedStr = utils.limitString(str, 6);
    expect(limitedStr).to.equal('Lor...');
    expect(limitedStr.length).to.equal(6);

    limitedStr = utils.limitString(str, 10);
    expect(limitedStr).to.equal('Lorem i...');
    expect(limitedStr.length).to.equal(10);

    limitedStr = utils.limitString(str, str.length);
    expect(limitedStr).to.equal(str);
    expect(limitedStr.length).to.equal(str.length);

    limitedStr = utils.limitString(str, 17);
    expect(limitedStr).to.equal('Lorem ipsum do...');
    expect(limitedStr.length).to.equal(17);
  });
});
