class GoogleAuth {
  static async checkAuthStatus() {
    return new Promise((resolve) => {
      chrome.identity.getAuthToken({ interactive: false }, (token) => {
        resolve(!!token);
      });
    });
  }

  static async getUserInfo() {
    const token = await new Promise((resolve) => {
      chrome.identity.getAuthToken({ interactive: true }, resolve);
    });

    if (!token) return null;

    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.json();
  }

  static async getUnreadEmailCount() {
    const token = await new Promise((resolve) => {
      chrome.identity.getAuthToken({ interactive: false }, resolve);
    });

    if (!token) return null;

    const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    return data.resultSizeEstimate;
  }
}