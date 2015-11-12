export class Template {
  constructor(data) {
    this.data = data;
    this.template = `
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
      <div class="text">${this.data.body}</div>`;

    this.template = this.template.trim();
  }

  get() {
    return this.template;
  }

  static create(data) {
    return new Template(data);
  }
}
