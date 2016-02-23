const doc = document;

class Http {

  constructor() {
    this._busy = false;
  }

  get busy() {
    return this._busy;
  }

  buildUrl(url, ...rest) {
    return `${url}/${rest.join('/')}`;
  }

  request(url, callback, method) {
    method = method || 'GET';
    this._busy = true;
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        this._busy = false;
        callback.call(null, JSON.parse(xhr.responseText));
        doc.body.classList.remove('busy');
      }
    };
    doc.body.classList.add('busy');
    xhr.send();
  }
}

export default new Http();
