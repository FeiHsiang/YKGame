function fbLogin(loginBtn, logoutBtn) {
  FB.login(function(loginResponse) {
    if (loginResponse.status === 'connected') {
      // Logged into your webpage and Facebook.
      loginBtn.style.display = 'none';
      console.log('登入臉書成功');
      FB.api('/me', 'GET', {"fields":"id,name,email,picture"}, function(response) {
        console.log(response);
      });
      logoutBtn.style.display = 'inline';
    } else {
      // The person is not logged into your webpage or we are unable to tell.
      console.log('登入臉書失敗， status 為', loginResponse.status);
    }
  }, {scope: 'public_profile,email'});
}

function fbRevokePermission(loginBtn, logoutBtn) {
  FB.api('/me/permissions', 'DELETE', {}, function(response) {
    // Reload to clear the access token error.
    // There is no need to change the styles of the buttons.
    console.log(response);
    location.reload();
  });
}

function fbShare() {
  FB.ui({
    method: 'share',
    href: 'https://ssl-api-makar-apps.miflyservice.com:8080/',
    hashtag: '#makar',
    quote: 'A testing string.',
  }, function(response){console.log(response);});
}

export {fbLogin, fbRevokePermission, fbShare};