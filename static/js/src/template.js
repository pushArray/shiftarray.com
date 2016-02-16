export default class Template {
  /**
   * Returns new instance of {@link Template}.
   * @param {SimpleTweet} data
   * @returns {Template}
   */
  static create(data) {
    return new Template(data);
  }

  /**
   * @param {SimpleTweet} data - Tweet data.
   */
  constructor(data) {
    this.data = data;
    this.template = this.parse();
  }

  /**
   * Returns previously parsed string.
   * @returns {string|*}
   */
  get() {
    return this.template;
  }

  /**
   * Recreates template string with latest {@link Template#data} changes.
   * @returns {string}
   */
  parse() {
    let d = this.data;
    let headBody = `
        <div class="user-avatar"
             style="background: ${d.profileColor} url(${d.userImage});">
        </div>
        <div class="flex-box no-wrap">
            <div class="username">
                ${d.username}
            </div>
            <div class="screenname">
                @${d.screenName}
            </div>
            <div class="timestamp">
                ${d.timestamp}
            </div>
        </div>`;
    let head = '';
    if (d.protected) {
      head = `
        <span class="user-container"
              style="color: ${d.profileColor}">
           ${headBody}
        </span>
      `;
    } else {
      head = `
          <a href="${d.url}"
             target="_self"
             class="user-container"
             style="color: ${d.profileColor}">
              ${headBody}
          </a>`;
    }
    let template = `
        ${head}
        <div class="text">
          ${this.data.text}
        </div>`;
    this.template = template.trim();
    return this.template;
  }
}
