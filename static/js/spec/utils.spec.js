import utils from '../src/utils';

describe('utils tests', () => {
  it('createNode', () => {
    var el = utils.createNode('div', {
      'id': 'foo',
      'class': 'my class'
    });
    expect(el.nodeName).to.equal('DIV');
    expect(el.nodeType).to.equal(Node.ELEMENT_NODE);
    expect(el.getAttribute('id')).to.equal('foo');
    expect(el.getAttribute('class')).to.equal('my class');
  });

  it('replaceHtmlEntities', () => {
    var html = '&lt;foo&gt;';
    expect(utils.replaceHtmlEntities(html)).to.equal('<foo>');
  });

  it('timeAgo', () => {
    expect(utils.timeAgo(new Date(1970, 0, 1))).to.equal('Jan 1, 1970');
  });

  it('limitString', () => {
    var str = 'Lorem ipsum dolor sit amet';

    var limitedStr = utils.limitString(str, 6);
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
