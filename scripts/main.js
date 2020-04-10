let getStatus = document.getElementById('get-status');
let login = document.getElementById('login');
let logout = document.getElementById('logout');

getStatus.addEventListener('click', function() {
  FB.getLoginStatus(function(statusResponse) {
    if (statusResponse.status === 'connected') {
      console.log('已經登入了');
      FB.api('/me', 'GET', {"fields":"id,name,email"}, function(response) {
        console.log(response);
      });
    }
    else {
      console.log('沒登入， status 為', statusResponse.status);
    }
  });
});

login.addEventListener('click', function() {
  FB.login(function(loginResponse) {
    if (loginResponse.status === 'connected') {
      // Logged into your webpage and Facebook.
      console.log('登入成功');
      FB.api('/me', 'GET', {"fields":"id,name,email"}, function(response) {
        console.log(response);
      });
    } else {
      // The person is not logged into your webpage or we are unable to tell.
      console.log('登入失敗， status 為', loginResponse.status);
    }
  }, {scope: 'public_profile,email'});
});

logout.addEventListener('click', function() {
  FB.logout(function(logoutResponse) {
    console.log(logoutResponse);
  });
});