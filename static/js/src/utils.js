export const utils = {};

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
const timeMatchRegExp = /^w+(w+)(d+)([d:]+)+0000(d+)$/;

/**
 * Queries all elements by specified selector.
 * @param {string} str - Element selector.
 * @param {HTMLElement} element - Parent element.
 * @returns {NodeList}
 */
utils.queryAll = function(str, element) {
  element = element || doc;
  return element.querySelectorAll(str);
};

/**
 * Queries DOM elements by id.
 * @param {string} id
 * @returns {Element}
 */
utils.getId = function(id) {
  return doc.getElementById(id);
};

/**
 * Creates HTML element.
 * @param {string} node - HTML element tag name.
 * @param {Object<string, string|number|boolean>=} attrs - Map of element attributes.
 * @returns {Element}
 */
utils.createNode = function(node, attrs) {
  var nodeEl = doc.createElement(node);
  for (var attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      nodeEl.setAttribute(attr, attrs[attr]);
    }
  }
  return nodeEl;
};

/**
 * Replaces HTML entities with HTML characters.
 * @param {string} s - HTML string.
 * @returns {string}
 */
utils.replaceHtmlEntites = function(s) {
  return s.replace(htmlCharRegExp, (match, entity) => {
    return htmlCharMap[entity];
  });
};

/**
 * Returns formatted date object as string.
 * Forked from http://stackoverflow.com/a/1229594
 * @param {Date|string} date
 * @returns {string}
 */
utils.timeAgo = function(date) {
  if (typeof date === 'string') {
    date = new Date(date.replace(timeMatchRegExp, '$1 $2 $4 $3 UTC'));
  }
  var diff = parseInt((new Date().getTime() - date.getTime()) / 1000, 10);
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
    return ret;
  }
  for (let prop in periods) {
    if (periods.hasOwnProperty(prop)) {
      let val = periods[prop];
      if (diff >= val) {
        var time = parseInt(diff / val);
        ret += time + ' ' + (time > 1 ? prop + 's' : prop);
        break;
      }
    }
  }
  return ret + ' ago';
};

/**
 * Returns string truncated to the length specified.
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
utils.limitString = function(str, length) {
  if (str.length <= length) {
    return str;
  }
  return str.substring(0, length - 3) + '...';
};

/**
 * Returns an object representing browser specific CSS prefix.
 * Forked from http://davidwalsh.name/vendor-prefix
 * @type {{
 *     dom: string,
 *     lowercase: string,
 *     css: string,
 *     js: string
 *   }}
 */
utils.cssPrefix = function() {
  var styles = win.getComputedStyle(doc.documentElement, '');
  var pre = (slice.call(styles).join('').match(/-(moz|webkit|ms)-/) ||
    styles.OLink === '' && ['', 'o'])[1];
  var dom = 'WebKit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
}();
