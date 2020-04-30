function googleInit() {
  // Not using `gapi.auth2.getAuthInstance().isSignedIn.get()`
  // because it will always return false
  gapi.auth2.getAuthInstance().isSignedIn.listen(googleSignedinChanged);
  gapi.auth2.getAuthInstance().currentUser.listen(googleUserChanged);
}

function googleOnSignIn(aGoogleUser) {
  var profile = aGoogleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  // The ID token you need to pass to your backend:
  var id_token = aGoogleUser.getAuthResponse().id_token;
  console.log('ID Token: ' + id_token);
  switch (location.pathname) {
    case '/':
    case '/index':
    case '/index.html':
      location.replace(`${location.protocol}//${location.host}/game-introduction/`);
      break;
    default:
      isGoogleLoggedIn = true;
      // console.log('已經登入臉書了');
      // FB.api('/me', 'GET', {"fields":"id,name,email,picture"}, function(response) {
      //   console.log(response);
      // });
      break;
  }
  // isGoogleLoggedIn = true;
  // location.replace(`${location.protocol}//${location.host}/game-introduction/`);
}

function googleOnFailure(error) {
  console.log(error);
}

function googleRevokeAllScopes() {
  var aGoogleAuth = gapi.auth2.getAuthInstance();
  aGoogleAuth.disconnect();
  location.replace(`${location.protocol}//${location.host}/`);
}

function googleSignedinChanged(isLoggedIn) {
  console.log(isLoggedIn);
  isGoogleLoggedIn = isLoggedIn;
  if (isLoggedIn) {
    // location.replace(`${location.protocol}//${location.host}/game-introduction/`);
  }
}

function googleUserChanged(aGoogleUser) {
  // console.log('User now: ', aGoogleUser);
}