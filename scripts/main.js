switch (location.pathname) {
  case '/':
  case '/index':
  case '/index.html':
    let fbLoginButton = document.getElementById('fb-login-button');
    let fbShareButton = document.getElementById('fb-share-button');

    fbLoginButton.addEventListener('click', fbLogin, false);

    fbShareButton.addEventListener('click', fbShare, false);

    break;
  default:
    let logout = document.getElementById('logout');

    let checkWhichIsLoggedIn = function() {
      if (isFbLoggedIn && !isGoogleLoggedIn) {
        fbRevokePermission();
      }
      else if (!isFbLoggedIn && isGoogleLoggedIn) {
        googleRevokeAllScopes();
      }
      else if (!isFbLoggedIn && !isGoogleLoggedIn) {
        // 都沒登入，應該要另外處理
        alert('請先登入');
        location.replace(`${location.protocol}//${location.host}/`);
      }
      else {
        alert('帳號重複登入');
      }
    };

    logout.addEventListener('click', checkWhichIsLoggedIn, false);

    break;
}