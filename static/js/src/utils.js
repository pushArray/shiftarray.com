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
const getCSSPrefix = () => {
  var styles = win.getComputedStyle(doc.documentElement, '');
  var pre = (slice.call(styles).join('').match(/-(moz|webkit|ms)-/) ||
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
    var nodeEl = doc.createElement(node);
    for (var attr in attrs) {
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
   * @param {Date|string} date
   * @returns {string}
   */
  timeAgo(date) {
    if (typeof date === 'string') {
      date = new Date(Date.parse(date.replace(/(\+)/, ' UTC$1')));
    }
    const diff = parseInt((new Date().getTime() - date.getTime()) / 1000, 10);
    const periods = {
      decade: 315360000,
      year: 31536000,
      month: 2628000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var ret = '';
    if (diff > periods.month) {
      ret = months[date.getMonth()] + ' ' + date.getDate();
      if (date.getFullYear() !== new Date().getFullYear()) {
        ret += ', ' + String(date.getFullYear());
      }
    } else {
      for (let prop in periods) {
        if (periods.hasOwnProperty(prop)) {
          let val = periods[prop];
          if (diff >= val) {
            var time = parseInt(diff / val, 10);
            ret += time + ' ' + (time > 1 ? prop + 's' : prop);
            break;
          }
        }
      }
      ret += ' ago';
    }

    return ret;
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
    return str.substring(0, length - 3) + '...';
  }
}
