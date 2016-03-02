import http from './http';
import Tweet from './tweet';
import utils from './utils';

const win = window;
const doc = document;
const baseUrl = '/tweets';

let idCache = [];
let tweets = [];
let list = utils.getId('list');

function loadNext() {
  let url = http.buildUrl(baseUrl, idCache[idCache.length - 1], 10);
  http.request(url, responseHandler);
}

/**
 * @param {TwitterError|Array<SimpleTweet>} data - Tweets data.
 */
function responseHandler(data) {
  if (data.errors) {
    win.alert(data.errors[0].message);
    return;
  }
  if (!data.length) {
    win.removeEventListener('scroll', windowScroll);
    return;
  }
  for (let i = 0; i < data.length; i++) {
    /** @type {SimpleTweet} */
    let datum = data[i];
    if (!!~idCache.indexOf(datum.id)) {
      continue;
    }
    idCache.push(datum.id);
    let entry = utils.createNode('div');
    entry.setAttribute('class', 'entry');
    let tweet = new Tweet(datum, entry);
    list.appendChild(entry);
    tweets.push(tweet);
    tweet.render();
  }
  if (list.offsetHeight < win.innerHeight) {
    loadNext();
  }
}

function windowScroll() {
  let threshold = win.pageYOffset >= (doc.documentElement.scrollHeight - win.innerHeight) * 0.80;
  if (!http.busy && threshold) {
    loadNext();
  }
}

function loaded() {
  win.removeEventListener('load', loaded);
  win.addEventListener('scroll', windowScroll);
  http.request(`${baseUrl}/0/10`, responseHandler);
}

if (doc.readyState === 'complete') {
  loaded();
} else {
  win.addEventListener('load', loaded);
}
