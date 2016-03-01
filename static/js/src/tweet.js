import Template from './template';
import utils from './utils';

export default class Tweet {

  static createLink(text, url, title, color) {
    return `
        <a style="color:${color};"
           title="${title || text}"
           target="_blank"
           href="${url}">
            ${text}
        </a>`;
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

    if (Array.isArray(media) && media.length) {
      let mediaEl = utils.query('.media', this.parent);
      mediaEl.style.backgroundImage = `url(${media[0].media_url})`;
      mediaEl.classList.add('rendered');
      media.forEach(media => {
        text = text.replace(media.url, '');
      });
    }

    let lineEl = this.element.querySelector('.text');
    let linkColor = data.profileColor;
    urls.forEach(url => {
      let str = url.display_url;
      text = text.replace(str, Tweet.createLink(str, url.expanded_url, str, linkColor));
    });
    userMentions.forEach(mention => {
      let str = `@${mention.screen_name}`;
      let url = `//twitter.com/${mention.screen_name}`;
      text = text.replace(str, Tweet.createLink(str, url, str, linkColor));
    });
    hashtags.forEach(hash => {
      let str = `#${hash.text}`;
      let url = `//twitter.com/search?q=%23${hash.text}&src=hash`;
      text = text.replace(str, Tweet.createLink(str, url, str, linkColor));
    });

    lineEl.innerHTML = text;
    lineEl.classList.add('rendered');
  }
}
