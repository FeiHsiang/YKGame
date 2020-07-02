class UI {
  constructor() {}

  showAfterLogin() {
    document.getElementById('before-login').style.display = 'none';
    document.getElementById('after-login').style.display = 'flex';
    document.getElementById('account-info').textContent = `Hello ${userName}. ${userID}`;
  }

  showLoginButton() {
    document.getElementById('before-login').style.display = 'flex';
  }
}