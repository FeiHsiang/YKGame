function fbLogin() {
  FB.login(function(loginResponse) {
    if (loginResponse.status === 'connected') {
      // Logged into your webpage and Facebook.
      console.log('登入臉書成功');
      FB.api('/me', 'GET', {"fields":"id,name,email,picture"}, function(response) {
        postData = {
          ID: response.id + '@facebook',
          name: response.name,
          request: 'init',
          requestItem: ''
        };
        aNetworkAgent.sendPost(postData).then(myJson => {
          console.log(myJson[0]);
          changeLoginPageUI();
        });
      });
    } else {
      // The person is not logged into your webpage or we are unable to tell.
      console.log('登入臉書失敗， status 為', loginResponse.status);
    }
  }, {scope: 'public_profile'});
}

function fbShare() {
  FB.ui({
    method: 'share',
    href: 'https://ssl-api-makar-apps.miflyservice.com:8080/',
    hashtag: '#makar',
    quote: 'A testing string.',
  }, function(response){console.log(response);});
}