import {Template} from './template';
import {utils} from './utils';

const html = document.documentElement;

export class Tweet {
  /**
   * Tweet constructor function.
   * @param {SimpleTweet} data Tweet data object.
   * @param {Element} parent Parent element where Tweet instance element will be attached.
   */
  constructor(data, parent) {
    /** @type {SimpleTweet} */
    this.data = data;
    /** @type {Element} */
    this.parent = parent;
    /** @type {Template} */
    this.template = new Template(data);
    this.createDOM();
  }

  /**
   * Creates and returns container element for tweet line.
   * @returns {Element}
   */
  static createLine() {
    var el = utils.createNode('div');
    el.setAttribute('class', 'line inline');
    return el;
  }

  /**
   * Creates initial Tweet DOM structure.
   * @returns {Element} Tweet DOM element.
   */
  createDOM() {
    let data = this.data;
    this.element = utils.createNode('div', {
      'class': 'tweet'
    });
    this.element.innerHTML = this.template.get();
    data.text = utils.replaceHtmlEntites(data.text);
    data.timestamp = utils.timeAgo(data.timestamp);
    this.parent.style.borderColor = this.data.profileColor;
    this.parent.appendChild(this.element);
    return this.element;
  }

  /**
   * Renders Tweet text elements. Tweet element has to be attached to DOM.
   */
  render() {
    if (!html.contains(this.element)) {
      throw new Error('Cannot render Tweet unless element is part of DOM');
    }

    /** @type {SimpleTweet} */
    var data = this.data;
    var text = data.text.replace(/(\n|\r)/gm, ' ');
    /** @type {TweetEntity} */
    var entities = data.entities;
    var urls = entities.urls;
    urls.forEach(url => {
      text = text.replace(url.url, url.display_url);
    });

    var media = entities.media;
    if (Array.isArray(media)) {
      media.forEach(media => {
        text = text.replace(media.url, '');
      });
    }

    var fontSize = 36;
    var lineEl = this.element.querySelector('.text');
    lineEl.textContent = '';
    lineEl.style.fontSize = fontSize + 'px';

    // Get parent width before adding any lines
    var parentWidth = lineEl.offsetWidth;
    var lineStr = '';
    var maxLineLen = 26;
    var minLineLen = 8;
    var testStr = '';
    var currLine = Tweet.createLine();
    var linesArr = [lineEl.appendChild(currLine)];
    var wordsArr = text.split(' ');
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

    var lineCount = linesArr.length;
    linesArr.forEach((line, index) => {
      line.style.lineHeight =
        line.style.fontSize = fontSize * parentWidth / line.offsetWidth + 'px';
      line.style.zIndex = lineCount - index;
      let s = parentWidth / line.offsetWidth;
      if (s !== 1) {
        let w = line.offsetWidth;
        let h = line.offsetHeight;
        let tx = s * (parentWidth - w) * 0.5;
        let ty = h - s * h;
        line.style[utils.cssPrefix.css + 'transform'] =
          line.style.transform = `matrix(${s}, 0, 0, ${s}, ${tx}, ${ty}`;
      }
      line.setAttribute('class', 'line');
    });

    var linkColor = data.profileColor;
    urls.forEach(url => {
      var str = utils.limitString(url.display_url, maxLineLen);
      var content = `
        <a style="color:${linkColor};"
           href="${url.expanded_url}">
            ${str}
        </a>`;
      lineEl.innerHTML = lineEl.innerHTML.replace(str, content);
    });
    entities.user_mentions.forEach(mention => {
      var str = utils.limitString('@' + mention.screen_name, maxLineLen);
      var content = `
        <a style="color:${linkColor};"
           href="//twitter.com/${mention.screen_name}">
            ${str}
        </a>`;
      lineEl.innerHTML = lineEl.innerHTML.replace(str, content);
    });
    entities.hashtags.forEach(hash => {
      var str = utils.limitString('#' + hash.text, maxLineLen);
      var content = `
        <a style="color:${linkColor};"
           href="//twitter.com/search?q=%23${hash.text}&src=hash">
            ${str}
        </a>`;
      lineEl.innerHTML = lineEl.innerHTML.replace(str, content);
    });
  }
}
