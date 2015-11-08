/**
 * @fileoverview Modified version of https://github.com/download13/blockies
 */
(function(global) {
'use strict';

var randseed = 0;
var hsl;

/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {string} key ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */
function murmurHash3(key, seed) {
  var remainder = key.length & 3; // key.length % 4
  var bytes = key.length - remainder;
  var h1 = seed;
  var c1 = 0xcc9e2d51;
  var c2 = 0x1b873593;
  var i = 0;

  var k1;
  while (i < bytes) {
    k1 = ((key.charCodeAt(i) & 0xff)) |
         ((key.charCodeAt(++i) & 0xff) << 8) |
         ((key.charCodeAt(++i) & 0xff) << 16) |
         ((key.charCodeAt(++i) & 0xff) << 24);

    ++i;

    k1 = ((((k1 & 0xffff) * c1) +
      ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = ((((k1 & 0xffff) * c2) +
      ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

    h1 ^= k1;
    h1  = (h1 << 13) | (h1 >>> 19);
    var h1b = ((((h1 & 0xffff) * 5) +
      ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
    h1  = (((h1b & 0xffff) + 0x6b64) +
      ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
  }

  k1 = 0;

  if (remainder > 0 && remainder < 4) {
    if (remainder > 2) {
      k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
    }

    if (remainder > 1) {
      k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
    }

    k1 ^= (key.charCodeAt(i) & 0xff);

    k1 = (((k1 & 0xffff) * c1) +
      ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = (((k1 & 0xffff) * c2) +
      ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
    h1 = k1;
  }

  h1 ^= key.length;

  h1 ^= h1 >>> 16;
  h1 = (((h1 & 0xffff) * 0x85ebca6b) +
    ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
  h1 ^= h1 >>> 13;
  h1 = ((((h1 & 0xffff) * 0xc2b2ae35) +
    ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}

function rand() {
  // Move range from -1 - 1 to 0 - 1
  var n = (Math.sin(randseed++) + 1) / 2;
  // Remove first few digits since they tend to have low entropy
  var r = n * 10000;
  n = r - Math.floor(r);
  return n;
}

function createColor() {
  var h = Math.floor(rand() * 360);
  var s = 100;
  var l = 50;

  hsl = {h: h, s: s, l: l};

  return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

function createImageData(size) {
  var width = size; // Only support square icons for now
  var height = size;

  var dataWidth = Math.ceil(width / 2);
  var mirrorWidth = width - dataWidth;

  var data = [];
  for (var y = 0; y < height; y++) {
    var row = [];
    for (var x = 0; x < dataWidth; x++) {
      row[x] = rand() >= 0.5;
    }

    var r = row.slice(0, mirrorWidth);
    r.reverse();
    row = row.concat(r);

    for (var i = 0; i < row.length; i++) {
      data.push(row[i]);
    }
  }

  return data;
}

function createCanvas(imageData, color, scale, bgcolor) {
  var c = document.createElement('canvas');
  var width = Math.sqrt(imageData.length);
  c.width = c.height = width * scale + 2;

  var cc = c.getContext('2d');
  cc.fillStyle = bgcolor;
  cc.fillRect(0, 0, c.width, c.height);
  cc.lineWidth = 1;
  cc.strokeStyle = hsl ? 'hsl(' + hsl.h + ',' + hsl.s + '%,' +
    (Math.max(0, hsl.l - 30)) + '%)' : '#000';
  cc.fillStyle = color;

  for (var i = 0; i < imageData.length; i++) {
    var row = Math.floor(i / width);
    var col = i % width;

    if (imageData[i]) {
      cc.strokeRect(col * (scale) + 1, row * (scale) + 1, scale - 1, scale - 1);
      cc.fillRect(col * (scale) + 1, row * (scale) + 1, scale - 1, scale - 1);
    }
  }

  return c;
}

global.blockies = {
  create: function(opts) {
    opts = opts || {};
    var size = opts.size || 10;
    var scale = opts.scale || 5;
    var seed = opts.seed || Math.random().toString(36).substr(2);
    var bgcolor = opts.bgcolor || '#fff';
    randseed = murmurHash3(seed, 31);
    var color = opts.color || createColor();
    var imageData = createImageData(size);
    return createCanvas(imageData, color, scale, bgcolor);
  }
};
})(window);
