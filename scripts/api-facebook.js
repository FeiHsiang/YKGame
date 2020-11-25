function fbLogin() {
  FB.login(function(loginResponse) {
    console.log("FB.login: loginResponse=" , loginResponse);
    if (loginResponse.status === 'connected') {
      console.log("FB.login: connected, loginResponse=", loginResponse);
      localStorage.setItem('token', loginResponse.authResponse.accessToken);
      localStorage.setItem('userID', loginResponse.authResponse.userID);
      localStorage.setItem('vendor', 'facebook');
      // FB.api(`/${loginResponse.authResponse.userID}`, 'GET', {"fields":"id,name,email"}, function(response) {
      FB.api('/me?fields=id,name,email', function(response) {
        console.log('寫入 ID 以及姓名' , response );
        userID = response.id + '@facebook';
        userName = response.name;
        email = response.email? response.email: "";
        postData = {
          ID: userID,
          name: userName,
          email: email,
          request: 'login',
          requestItem: ''
        };
        aNetworkAgent.sendPost(postData).then(myJson => {
          console.log(myJson[0]);
        });
        selectProgramToRun();
      });
    } else {
      // The person is not logged into your webpage or we are unable to tell.
      console.log('登入臉書失敗， status 為', loginResponse.status);
    }
  }, {scope: 'public_profile'});
}