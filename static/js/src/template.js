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
    let color = d.profileColor;
    let headBody = `
        <div class="user-card">
          <div class="user-avatar"
               style="background: ${color} url(${d.userImage});">
          </div>
          <div class="user">
            <div class="username"
                 style="color: ${color}">
                ${d.username}
            </div>
            <div class="screenname">
                @${d.screenName}
            </div>
          </div>
        </div>
        <div class="timestamp"
             title="${d.fullDate}">
            ${d.shortDate}
        </div>`;
    let head = '';
    if (d.protected) {
      head = `
        <span class="user-container">
           ${headBody}
        </span>
      `;
    } else {
      head = `
          <a href="${d.url}"
             target="_blank"
             class="user-container">
              ${headBody}
          </a>`;
    }
    let template = `
        ${head}
        <div class="media"></div>
        <div class="text"
             style="border-color: ${color}">
          ${this.data.text}
        </div>`;
    this.template = template.trim();
    return this.template;
  }
}
