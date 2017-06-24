const CHAR_SPACE = 32;

function rank(consecutive, start, distance) {
  return (consecutive * 4 + start) * distance;
}

function transform(str) {
  return str.toLowerCase().trim();
}

function fuzzy(term, text, offset, ignore) {
  term = transform(term);
  text = transform(text);
  let termLen = term.length;
  let textLen = text.length;
  if (!termLen || !textLen) {
    return 0;
  } else if (termLen > textLen) {
    return 0;
  } else if (termLen === textLen && term === text) {
    return rank(textLen, textLen, 1, 1, termLen, textLen);
  }
  let pConsecutive = 0;
  let pDistance = 0;
  let pStart = 0;
  let p = -2;
  let c = 0;
  let j = offset || 0;
  let i = 0;

  outer: for (; i < termLen; i++) {
    const termChar = term.charCodeAt(i);
    txt: while (j < textLen) {
      for (let k = 0; k < ignore.length; k += 2) {
        const p1 = ignore[k];
        const p2 = ignore[k + 1];
        if (j >= p1 && j <= p2) {
          j = p2 + 1;
          continue txt;
        }
      }
      const textChar = text.charCodeAt(j++);
      if (textChar === CHAR_SPACE) {
        break outer;
      } else if (termChar === textChar) {
        if (j - 1 === p) {
          pConsecutive = c === 0 ? pConsecutive + 2 : pConsecutive + 1;
          c = 1;
        } else {
          c = 0;
        }
        if (j === 1) {
          pStart = 1;
        }
        if (!pDistance) {
          pDistance = 1 - j / (textLen - 1);
        }
        p = j;
        continue outer;
      }
    }
    return 0;
  }

  if (i < termLen) {
    pConsecutive = 0;
    pStart = 0;
    pDistance = 0;
  }

  const rk = rank(pConsecutive, pStart, pDistance);
  const fz = fuzzy(term, text, j, ignore);

  return rk + fz;
}

module.exports.search = (term, text, ignore) => fuzzy(term, text, 0, ignore);
