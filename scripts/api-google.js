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
    // // https://developers.google.com/identity/sign-in/web/listeners
    // aGoogleAuth.currentUser.listen(googleUserChanged);
    switch (location.pathname) {
      case '/':
      case '/index':
      case '/index.html':
        aGoogleAuth.attachClickHandler(document.getElementById('g-login-button'), {}, googleOnSignIn, function(error) {
          console.log(error);
        });
        break;
      case '/games/':
      case '/games/index':
      case '/games/index.html':
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
  localStorage.setItem('token', user.getAuthResponse().id_token);
  localStorage.setItem('userID', user.getBasicProfile().getId());
  localStorage.setItem('userName', user.getBasicProfile().getName());
  localStorage.setItem('vendor', 'google');
  postData = {
    ID: user.getBasicProfile().getId() + '@google',
    name: profile.getName(),
    email: profile.getEmail(),
    request: 'login',
    requestItem: ''
  };
  aNetworkAgent.sendPost(postData).then(myJson => {
    console.log(myJson[0]);
  });
  checkLogin();
}

function googleOnFailure(error) {
  console.log(error);
}