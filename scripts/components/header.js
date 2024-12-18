class Header {
  static async init() {
    const userInfo = await GoogleAuth.getUserInfo();
    if (userInfo) {
      this.renderUserInfo(userInfo);
      this.initGmailCounter();
    }
  }

  static renderUserInfo(userInfo) {
    const userInfoEl = document.getElementById('user-info');
    userInfoEl.innerHTML = `
      <img src="${userInfo.picture}" alt="Profile" class="profile-pic">
      <span>${userInfo.email}</span>
    `;
  }

  static async initGmailCounter() {
    const updateGmailCount = async () => {
      const count = await GoogleAuth.getUnreadEmailCount();
      const gmailCounter = document.getElementById('gmail-counter');
      gmailCounter.innerHTML = count ? `${count} unread emails` : '';
    };

    await updateGmailCount();
    setInterval(updateGmailCount, CONFIG.GMAIL_CHECK_INTERVAL);
  }
}