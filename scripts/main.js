function isFacebookApp() {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
}

// 檢查登入
let checkLogin = function() {
  console.log('checkLogin()');
  if (localStorage.getItem('token') !== null && localStorage.getItem('userID') !== null && localStorage.getItem('vendor') !== null) {
    // 有登入，進行驗證
    switch(localStorage.getItem('vendor')) {
      case 'facebook':
        fetch(`https://graph.facebook.com/${localStorage.getItem('userID')}?fields=id,name&access_token=${localStorage.getItem('token')}`).then(function(response) {
          return response.json();
        }).then(function(myJson) {
          userID = `${myJson.id}@${localStorage.getItem('vendor')}`;
          userName = myJson.name;
          // 驗證完成
          if (userID !== undefined && userName !== undefined) {
            selectProgramToRun();
          }
          else {
            alert('登入時效已過，請重新登入！');
            localStorage.clear();
            location.replace(`${location.protocol}//${location.host}/`);
          }
        });
        break;
      case 'google':
        fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${localStorage.getItem('token')}`).then(function(response) {
          return response.json();
        }).then(function(myJson) {
          userID = `${myJson.sub}@${localStorage.getItem('vendor')}`;
          userName = myJson.name;
          // 驗證完成
          if (userID !== undefined && userName !== undefined) {
            selectProgramToRun();
          }
          else {
            alert('登入時效已過，請重新登入！');
            localStorage.clear();
            location.replace(`${location.protocol}//${location.host}/`);
          }
        });
        break;
      default:
        alert('供應商不存在！');
        localStorage.clear();
        location.replace(`${location.protocol}//${location.host}/`);
        break;
    }
  }
  else {
//[start-20201119- fei -0001-debug]//
    // console.log("main.js: call selectProgramToRun ");
    // selectProgramToRun();
    // return;
//[end---20201119- fei -0001-debug]//

    // 沒登入
    switch (location.pathname) {
      case '/':
      case '/index':
      case '/index.html':
        aUI.showLoginButton();
        break;
      case '/change-your-browser/':
      case '/change-your-browser/index':
      case '/change-your-browser/index.html':
        // do nothing
        break;
      default:
        alert('請先登入！');
        location.replace(`${location.protocol}//${location.host}/`);
        break;
    }
  }
};

let isChangeBrowserPage;

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
    isChangeBrowserPage = true;
    aUI.showChangeBrowserPage();
    break;
  case '/':
  case '/index':
  case '/index.html':
    isChangeBrowserPage = false;
    let fbLoginButton = document.getElementById('fb-login-button');
    fbLoginButton.addEventListener('click', fbLogin, false);

//[start-20201123- fei -0001-adddebug]//
    gameStartImg.addEventListener('click', function(){
      aUI.startGameIframe("");
    },false);

    game1.addEventListener('click', function(){
      aUI.startGameIframe("shooting");
    },false);
    
    game2.addEventListener('click', function(){
      aUI.startGameIframe("baseballNine");
    },false);

//[end---20201123- fei -0001-adddebug]//


    break;
  case '/prize-list/':
  case '/prize-list/index':
  case '/prize-list/index.html':
    isChangeBrowserPage = false;
    let logout = document.getElementById('logout');
    logout.addEventListener('click', checkWhichIsLoggedIn, false);
    break;
  default:
    isChangeBrowserPage = false;
    break;
}

if (!isChangeBrowserPage) {
  checkLogin();
}