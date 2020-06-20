function fbLogin() {
  FB.login(function(loginResponse) {
    if (loginResponse.status === 'connected') {
      checkLoginState();
    } else {
      // The person is not logged into your webpage or we are unable to tell.
      console.log('登入臉書失敗， status 為', loginResponse.status);
    }
  }, {scope: 'public_profile'});
}

function checkLoginState() {
  FB.getLoginStatus(function(statusResponse) {
    isFbChecked = true;
    // 有登入
    if (statusResponse.status === 'connected') {
      handleFbIsLoggedIn();
    }
    // 沒登入
    else {
      handleFbIsNotLoggedIn();
    }
  });
}

function handleFbIsLoggedIn() {
  isFbLoggedIn = true;
  // 檢查 Google 是否登入，若有則全部取消授權（也代表， Google 已經載入完成）
  console.log('FB is checking google.');
  if (isGoogleChecked && isGoogleLoggedIn) {
    handleDuplicateLogin();
  }
  else {
    console.log('已經登入臉書了');
    FB.api('/me', 'GET', {"fields":"id,name,picture"}, function(response) {
      console.log('寫入 ID 以及姓名');
      userID = response.id + '@facebook';
      userName = response.name;
      selectProgramToRun();
    });
  }
}

function handleFbIsNotLoggedIn() {
  isFbLoggedIn = false;
  console.log('尚未登入臉書');
  // 檢查 Google 是否登入，若無則導向到登入頁面
  console.log('FB is checking google.');
  if (isGoogleChecked && !isGoogleLoggedIn) {
    switch (location.pathname) {
      case '/':
      case '/index':
      case '/index.html':
        showLoginButton();
        break;
      default:
        console.log('兩者皆未登入');
        location.replace(`${location.protocol}//${location.host}/`);
        break;
    }
  }
};

function fbShare() {
  FB.ui({
    method: 'share',
    href: 'https://ssl-api-makar-apps.miflyservice.com:8080/',
    hashtag: '#makar',
    quote: 'A testing string.',
  }, function(response){console.log(response);});
}