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
          // 未來也許紀錄錯誤，可能存到 DB
          alert(JSON.stringify(error, undefined, 2));
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
  isGoogleChecked = true;
  aGoogleUser = user;
  if (user.isSignedIn()) {
    switch (location.pathname) {
      case '/':
      case '/index':
      case '/index.html':
        location.replace(`${location.protocol}//${location.host}/game-introduction/`);
        break;
      default:
        isGoogleLoggedIn = user.isSignedIn();
        // 檢查臉書是否登入，若有則全部取消授權（也代表，臉書已經載入完成）
        console.log('Google is checking facebook.');
        if (isFbChecked && isFbLoggedIn) {
          alert('帳號重複登入');
          aGoogleAuth.disconnect();
          FB.api('/me/permissions', 'DELETE', {}, function(response) {
            console.log(response);
            location.replace(`${location.protocol}//${location.host}/`);
          });
        }
        else {
          console.log('已經登入 Google 了');
        }
        break;
    }
  }
  else {
    console.log('尚未登入 Google');
    switch (location.pathname) {
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
        // 檢查 Facebook 是否登入，若無則導向到登入頁面
        console.log('Google is checking facebook.');
        if (isFbChecked && !isFbLoggedIn) {
          alert('請先登入');
          location.replace(`${location.protocol}//${location.host}/`);
        }
        break;
      default:
        break;
    }
  }
}