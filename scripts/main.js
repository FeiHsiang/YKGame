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
    let os = ['iPhone', 'Android'];
    let browser = ['Safari', 'Chrome'];
    let content1 = ' 用戶請先於選單（箭頭指引處）選擇 ';
    let content2 = ' 瀏覽器進行遊戲'
    let hint = new Image();
    if (navigator.platform === 'iPhone' || navigator.platform === 'iPad') {
      hint.src = '../images/ios.jpg';
      hint.alt = os[0] + content1 + browser[0] + content2;
    }
    else {
      hint.src = '../images/android.jpg';
      hint.alt = os[1] + content1 + browser[1] + content2;
    }
    document.body.insertBefore(hint, document.body.children[0]);
    break;
  case '/':
  case '/index':
  case '/index.html':
    let fbLoginButton = document.getElementById('fb-login-button');
    fbLoginButton.addEventListener('click', fbLogin, false);
    break;
  case '/prize-list/':
  case '/prize-list/index':
  case '/prize-list/index.html':
    let logout = document.getElementById('logout');
    logout.addEventListener('click', checkWhichIsLoggedIn, false);
    break;
}