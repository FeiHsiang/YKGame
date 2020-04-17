function fbLogin(loginBtn, logoutBtn) {
  FB.login(function(loginResponse) {
    if (loginResponse.status === 'connected') {
      // Logged into your webpage and Facebook.
      loginBtn.style.display = 'none';
      console.log('登入成功');
      FB.api('/me', 'GET', {"fields":"id,name,email,picture"}, function(response) {
        console.log(response);
      });
      logoutBtn.style.display = 'inline';
    } else {
      // The person is not logged into your webpage or we are unable to tell.
      console.log('登入失敗， status 為', loginResponse.status);
    }
  }, {scope: 'public_profile,email'});
}

function fbLogout(loginBtn, logoutBtn) {
  FB.logout(function() {
    loginBtn.style.display = 'inline';
    logoutBtn.style.display = 'none';
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

export {fbLogin, fbLogout, fbShare};