const win = window;
const doc = document;
const slice = Array.prototype.slice;
const htmlCharRegExp = /&(nbsp|amp|quot|lt|gt);/g;
const htmlCharMap = {
  'nbsp': ' ',
  'amp': '&',
  'quot': '\'',
  'lt': '<',
  'gt': '>'
};
const periods = {
  month: 2628000,
  w: 604800,
  d: 86400,
  h: 3600,
  m: 60,
  s: 1
};
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const getCSSPrefix = () => {
  let styles = win.getComputedStyle(doc.documentElement, '');
  let pre = (slice.call(styles).join('').match(/-(moz|webkit|ms)-/) ||
    styles.OLink === '' && ['', 'o'])[1];
  return '-' + pre + '-';
};

export default {
  cssPrefix: getCSSPrefix(),

  /**
   * Queries all elements by specified selector.
   * @param {string} str - Element selector.
   * @param {HTMLElement} element - Parent element.
   * @returns {NodeList}
   */
  queryAll(str, element = doc) {
    return element.querySelectorAll(str);
  },

  /**
   * Queries DOM elements by id.
   * @param {string} id
   * @returns {Element}
   */
  getId(id) {
    return doc.getElementById(id);
  },

  /**
   * Creates HTML element.
   * @param {string} node - HTML element tag name.
   * @param {Object<string, string|number|boolean>=} attrs - Map of element attributes.
   * @returns {Element}
   */
  createNode(node, attrs) {
    let nodeEl = doc.createElement(node);
    for (let attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        nodeEl.setAttribute(attr, attrs[attr]);
      }
    }
    return nodeEl;
  },

  /**
   * Replaces HTML entities with HTML characters.
   * @param {string} htmlString - HTML string.
   * @returns {string}
   */
  replaceHtmlEntities(htmlString) {
    return htmlString.replace(htmlCharRegExp, (match, entity) => {
      return htmlCharMap[entity];
    });
  },

  /**
   * Returns formatted date object as string.
   * Forked from http://stackoverflow.com/a/1229594
   * @param {Date} date
   * @returns {string}
   */
  getShortDate(date) {
    let currDate = new Date();
    const diff = parseInt((currDate.getTime() - date.getTime()) / 1000, 10);
    let ret = '';
    if (diff > periods.month) {
      ret = months[date.getMonth()] + ' ' + date.getDate();
      if (date.getFullYear() !== currDate.getFullYear()) {
        ret += ', ' + String(date.getFullYear());
      }
    } else {
      for (let prop in periods) {
        if (periods.hasOwnProperty(prop)) {
          let val = periods[prop];
          if (diff >= val) {
            let time = parseInt(diff / val, 10);
            ret += time + prop;
            break;
          }
        }
      }
    }
    return ret;
  },

  /**
   * @param {string} utcDate
   */
  utcToDate(utcDate) {
    return new Date(Date.parse(utcDate.replace(/(\+)/, ' UTC$1')));
  },

  /**
   * @param {Date} date
   * @returns {string}
   */
  getFullDate(date) {
    let monthDate = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return `${monthDate} ${month}, ${year} - ${hours}:${minutes}`;
  },

  /**
   * Returns string truncated to the length specified.
   * @param {string} str
   * @param {number} length
   * @returns {string}
   */
  limitString(str, length) {
    if (str.length <= length) {
      return str;
    }
    return str.substring(0, length - 3) + '…';
  }
}
