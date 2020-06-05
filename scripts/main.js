function isFacebookApp() {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
}

// 檢查使用者是否使用 Facebook App 開啟網頁
switch (location.pathname) {
  case '/change-your-browser/':
  case '/change-your-browser/index':
  case '/change-your-browser/index.html':
    if (!isFacebookApp()) {
      location.replace(`${location.protocol}//${location.host}/`);
    }
    break;
  default:
    if (isFacebookApp()) {
      location.replace(`${location.protocol}//${location.host}/change-your-browser/`);
    }
    break;
}

switch (location.pathname) {
  case '/change-your-browser/':
  case '/change-your-browser/index':
  case '/change-your-browser/index.html':
    // do nothing
    break;
  case '/':
  case '/index':
  case '/index.html':
    let fbLoginButton = document.getElementById('fb-login-button');
    let fbShareButton = document.getElementById('fb-share-button');
    fbLoginButton.addEventListener('click', fbLogin, false);
    fbShareButton.addEventListener('click', fbShare, false);
    break;
  case '/game-introduction/':
  case '/game-introduction/index':
  case '/game-introduction/index.html':
  case '/game-start/':
  case '/game-start/index':
  case '/game-start/index.html':
  case '/get-prize/':
  case '/get-prize/index':
  case '/get-prize/index.html':
  case '/prize-list/':
  case '/prize-list/index':
  case '/prize-list/index.html':
  default:
    let logout = document.getElementById('logout');
    logout.addEventListener('click', checkWhichIsLoggedIn, false);
    break;
}