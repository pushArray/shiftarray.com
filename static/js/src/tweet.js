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
    let date = utils.utcToDate(data.timestamp);
    this.data.shortDate = utils.getShortDate(date);
    this.data.fullDate = utils.getFullDate(date);
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
   * Renders text line elements.
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

    let lineEl = this.element.querySelector('.text');
    let linkColor = data.profileColor;
    urls.forEach(url => {
      let str = url.display_url;
      let content = `
        <a style="color:${linkColor};"
           href="${url.expanded_url}">
            ${str}
        </a>`;
      text = text.replace(str, content);
    });
    userMentions.forEach(mention => {
      let str = `@${mention.screen_name}`;
      let content = `
        <a style="color:${linkColor};"
           href="//twitter.com/${mention.screen_name}">
            ${str}
        </a>`;
      text = text.replace(str, content);
    });
    hashtags.forEach(hash => {
      let str = `#${hash.text}`;
      let content = `
        <a style="color:${linkColor};"
           href="//twitter.com/search?q=%23${hash.text}&src=hash">
            ${str}
        </a>`;
      text = text.replace(str, content);
    });

    lineEl.innerHTML = text;
    lineEl.classList.add('rendered');
  }
}
