function fbLogin() {
  FB.login(function(loginResponse) {
    if (loginResponse.status === 'connected') {
      // Logged into your webpage and Facebook.
      console.log('登入臉書成功');
      location.replace(`${location.protocol}//${location.host}/game-introduction/`);
    } else {
      // The person is not logged into your webpage or we are unable to tell.
      console.log('登入臉書失敗， status 為', loginResponse.status);
    }
  }, {scope: 'public_profile,email'});
}

function fbShare() {
  FB.ui({
    method: 'share',
    href: 'https://ssl-api-makar-apps.miflyservice.com:8080/',
    hashtag: '#makar',
    quote: 'A testing string.',
  }, function(response){console.log(response);});
}