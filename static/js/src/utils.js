const doc = document;
const htmlCharRegExp = /&(nbsp|amp|quot|lt|gt);/g;
const htmlCharMap = {
  'nbsp': ' ',
  'amp': '&',
  'quot': '\'',
  'lt': '<',
  'gt': '>'
};
const pn = [2628000, 604800, 86400, 3600, 60, 1];
const ps = ['M', 'w', 'd', 'h', 'm', 's'];
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default {
  /**
   * Queries DOM elements by id.
   * @param {string} id
   * @returns {Element}
   */
  getId(id) {
    return doc.getElementById(id);
  },

  /**
   * @param {string} str - Element selector.
   * @param {HTMLElement} element - Parent element.
   * @returns {NodeList}
   */
  query(str, element = doc) {
    return element.querySelector(str);
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
    if (diff > pn[0]) {
      ret = `${months[date.getMonth()]} ${date.getDate()}`;
      if (date.getFullYear() !== currDate.getFullYear()) {
        ret += ', ' + date.getFullYear();
      }
    } else {
      for (let i = 0; i < pn.length; i++) {
        let val = pn[i];
        if (diff >= val) {
          ret += parseInt(diff / val, 10) + ps[i];
          break;
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
  }
}
