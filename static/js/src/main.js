import Tweet from './tweet';
import utils from './utils';
import http from './http';

const win = window;
const doc = document;
const baseUrl = '/tweets';

let resizeTimer = 0;
let idCache = [];
let tweets = [];
let listEl = utils.getId('list');
let windowSize = {
  width: win.innerWidth,
  height: win.innerHeight
};

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
    let sideEl = utils.createNode('div');
    let tweet = new Tweet(datum, sideEl);
    let entryEl = utils.createNode('div');
    sideEl.setAttribute('class', 'side right');
    entryEl.setAttribute('class', 'entry');
    listEl.appendChild(entryEl);
    entryEl.appendChild(sideEl);
    tweets.push(tweet);
    tweet.render();
  }
  if (listEl.offsetHeight < win.innerHeight) {
    let url = http.buildUrl(baseUrl, idCache[idCache.length - 1], 10);
    http.request(url, responseHandler);
  }
}

function windowScroll() {
  let threshold = win.pageYOffset >= (doc.documentElement.scrollHeight - win.innerHeight) * 0.80;
  if (!http.busy && threshold) {
    var url = http.buildUrl(baseUrl, idCache[idCache.length - 1], 10);
    http.request(url, responseHandler);
  }
}

function renderTweets() {
  let [ww, wh] = [win.innerWidth, win.innerHeight];
  if (windowSize.width !== ww || windowSize.height !== wh) {
    for (let i = tweets.length; i-- > 0;) {
      tweets[i].render();
    }
  }
  windowSize.width = ww;
  windowSize.height = wh;
}

function windowResize() {
  clearInterval(resizeTimer);
  resizeTimer = setTimeout(renderTweets, 500);
}

function loaded() {
  win.removeEventListener('load', loaded);
  win.addEventListener('scroll', windowScroll);
  win.addEventListener('resize', windowResize);
  http.request(baseUrl + '/0/10', responseHandler);
}

if (doc.readyState === 'complete') {
  loaded();
} else {
  win.addEventListener('load', loaded);
}
