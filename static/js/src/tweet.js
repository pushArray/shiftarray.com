import Template from './template';
import utils from './utils';

export default class Tweet {
  /**
   * Creates and returns container element for tweet line.
   * @returns {Element}
   */
  static createLine() {
    let el = utils.createNode('div');
    el.setAttribute('class', 'line inline');
    return el;
  }

  /**
   * @param {SimpleTweet} data - Tweet data object.
   * @param {Element} parent - Parent element where Tweet instance element will be attached.
   */
  constructor(data, parent) {
    /** @type {SimpleTweet} */
    this.data = data;
    this.data.text = utils.replaceHtmlEntities(data.text);
    this.data.timestamp = utils.timeAgo(data.timestamp);
    /** @type {Element} */
    this.parent = parent;
    /** @type {Template} */
    this.template = new Template(data);
    /** @type {Element} */
    this.element_ = this.createDOM();
  }

  get element() {
    return this.element_;
  }

  /**
   * Creates initial Tweet DOM structure.
   * @returns {Element} Tweet DOM element.
   */
  createDOM() {
    let el = utils.createNode('div', {
      'class': 'tweet'
    });
    el.innerHTML = this.template.get();
    this.parent.style.borderColor = this.data.profileColor;
    this.parent.appendChild(el);
    return el;
  }

  /**
   * Renders text line elements. Tweet element has to be part of the DOM.
   */
  render() {
    let data = this.data;
    let text = data.text.replace(/(\n|\r)/gm, ' ');
    let {hashtags, urls, user_mentions: userMentions, media} = data.entities;
    urls.forEach(url => {
      text = text.replace(url.url, url.display_url);
    });

    if (Array.isArray(media)) {
      media.forEach(media => {
        text = text.replace(media.url, '');
      });
    }

    let fontSize = 36;
    let lineEl = this.element.querySelector('.text');
    lineEl.textContent = '';
    lineEl.style.fontSize = fontSize + 'px';

    let containerWidth = lineEl.offsetWidth;

    if (+containerWidth === 0) {
      throw new Error('Line container width must be greater than zero.');
    }

    let lineStr = '';
    let maxLineLen = 26;
    let minLineLen = 12;
    let testStr = '';
    let currLine = Tweet.createLine();
    let linesArr = [lineEl.appendChild(currLine)];
    let wordsArr = text.split(' ');
    for (let i = 0, l = wordsArr.length; i < l; i++) {
      let word = wordsArr[i];
      if (!word) {
        continue;
      }
      word = utils.limitString(word, maxLineLen);
      testStr = lineStr + ' ' + word;
      testStr = testStr.trim();
      currLine.textContent = testStr;
      let lastWord = i === l - 1;
      if (testStr.length > maxLineLen) {
        if (lineStr.length < minLineLen || lastWord && word.length < minLineLen) {
          lineStr = testStr;
        } else {
          currLine.textContent = lineStr.trim();
          currLine = Tweet.createLine();
          linesArr.push(lineEl.appendChild(currLine));
          lineStr = '';
          i--;
        }
      } else {
        lineStr = testStr;
      }
    }

    let lineCount = linesArr.length;
    linesArr.forEach((line, index) => {
      line.style.lineHeight =
        line.style.fontSize = fontSize * containerWidth / line.offsetWidth + 'px';
      line.style.zIndex = lineCount - index;
      let s = containerWidth / line.offsetWidth;
      if (s !== 1) {
        let w = line.offsetWidth;
        let h = line.offsetHeight;
        let tx = s * (containerWidth - w) * 0.5;
        let ty = h - s * h;
        line.style[utils.cssPrefix + 'transform'] =
          line.style.transform = `matrix(${s}, 0, 0, ${s}, ${tx}, ${ty}`;
      }
      line.setAttribute('class', 'line');
    });

    let linkColor = data.profileColor;
    urls.forEach(url => {
      let str = utils.limitString(url.display_url, maxLineLen);
      let content = `
        <a style="color:${linkColor};"
           href="${url.expanded_url}">
            ${str}
        </a>`;
      lineEl.innerHTML = lineEl.innerHTML.replace(str, content);
    });
    userMentions.forEach(mention => {
      let str = utils.limitString('@' + mention.screen_name, maxLineLen);
      let content = `
        <a style="color:${linkColor};"
           href="//twitter.com/${mention.screen_name}">
            ${str}
        </a>`;
      lineEl.innerHTML = lineEl.innerHTML.replace(str, content);
    });
    hashtags.forEach(hash => {
      let str = utils.limitString('#' + hash.text, maxLineLen);
      let content = `
        <a style="color:${linkColor};"
           href="//twitter.com/search?q=%23${hash.text}&src=hash">
            ${str}
        </a>`;
      lineEl.innerHTML = lineEl.innerHTML.replace(str, content);
    });
  }
}
