function googleInit() {
  // Not using `gapi.auth2.getAuthInstance().isSignedIn.get()`
  // because it will always return false
  gapi.load('auth2', function() {
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    // https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
    aGoogleAuth = gapi.auth2.init({
      client_id: '923953148455-n97vk70pi4dor1eo3o50680ecu9kb06i.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      fetch_basic_profile: true,
      ux_mode: 'popup'
    });
    // https://developers.google.com/identity/sign-in/web/listeners
    aGoogleAuth.currentUser.listen(googleUserChanged);
    switch (location.pathname) {
      case '/':
      case '/index':
      case '/index.html':
        aGoogleAuth.attachClickHandler(document.getElementById('g-login-button'), {}, googleOnSignIn, function(error) {
          console.log(error);
        });
        break;
      default:
        // do nothing
        break;
    }
  });
}

function googleOnSignIn(user) {
  var profile = user.getBasicProfile();
  // Do not send to your backend! Use an ID token instead.
  console.log('ID: ' + profile.getId());
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log('Image URL: ' + profile.getImageUrl());
  // This is null if the 'email' scope is not present.
  console.log('Email: ' + profile.getEmail());
  // The ID token you need to pass to your backend:
  var id_token = user.getAuthResponse().id_token;
  console.log('ID Token: ' + id_token);
}

function googleOnFailure(error) {
  console.log(error);
}

function googleUserChanged(user) {
  console.log('googleUserChanged()');
  isGoogleChecked = true;
  aGoogleUser = user;
  if (user.isSignedIn()) {
    handleGoogleIsLoggedIn();
  }
  else {
    handleGoogleIsNotLoggedIn();
  }
}

function handleGoogleIsLoggedIn() {
  isGoogleLoggedIn = true;
  // 檢查臉書是否登入，若有則全部取消授權（也代表，臉書已經載入完成）
  console.log('Google is checking facebook.');
  if (isFbChecked && isFbLoggedIn) {
    handleDuplicateLogin();
  }
  else {
    console.log('已經登入 Google 了，寫入 ID 以及姓名');
    userID = aGoogleUser.getBasicProfile().getId() + '@google';
    userName = aGoogleUser.getBasicProfile().getName();
    selectProgramToRun();
  }
}

function handleGoogleIsNotLoggedIn() {
  isGoogleLoggedIn = false;
  console.log('尚未登入 Google');
  // 檢查 Facebook 是否登入，若無則導向到登入頁面
  console.log('Google is checking facebook.');
  if (isFbChecked && !isFbLoggedIn) {
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
}