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
    aGoogleAuth.isSignedIn.listen(googleSignedinChanged);
    aGoogleAuth.currentUser.listen(googleUserChanged);
    if (aGoogleAuth.isSignedIn.get()) {
      aGoogleAuth.signIn();
    }
    // https://developers.google.com/identity/sign-in/web/listeners
    refreshValues();
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

function googleRevokeAllScopes() {
  aGoogleAuth.disconnect();
  location.replace(`${location.protocol}//${location.host}/`);
}

function googleSignedinChanged(isLoggedIn) {
  console.log('googleSignedinChanged()');
  isGoogleLoggedIn = isLoggedIn;
  if (isLoggedIn) {
    console.log('已經登入 Google 了');
    switch (location.pathname) {
      case '/':
      case '/index':
      case '/index.html':
        location.replace(`${location.protocol}//${location.host}/game-introduction/`);
        break;
      default:
        // do nothing
        break;
    }
  }
  else {
    console.log('尚未登入 Google');
  }
}

function googleUserChanged(user) {
  console.log('User now: ', user);
  aGoogleUser = user;
}

function refreshValues() {
  if (aGoogleAuth){
    console.log('Refreshing values...');
    aGoogleUser = aGoogleAuth.currentUser.get();
  }
}