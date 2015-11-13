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
    var template = `
      <a href="${this.data.url}"
         target="_self"
         class="user-container"
         style="color: ${this.data.profileColor}">
        <div class="user-avatar"
             style="background: ${this.data.profileColor} url(${this.data.userImage});">
        </div>
        <div class="flex-box no-wrap">
            <div class="username">
                ${this.data.username}
            </div>
            <div class="screenname">
                @${this.data.screenName}
            </div>
            <div class="timestamp">
                ${this.data.timestamp}
            </div>
        </div>
      </a>
      <div class="text">
        ${this.data.body}
      </div>`;
    this.template = template.trim();
    return template;
  }
}
