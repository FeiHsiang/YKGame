let getStatus = document.getElementById('get-status');
let login = document.getElementById('login');
let logout = document.getElementById('logout');

getStatus.addEventListener('click', checkLoginState, false);

login.addEventListener('click', fbLogin, false);

logout.addEventListener('click', fbLogout, false);

function checkLoginState() {
  FB.getLoginStatus(function(statusResponse) {
    if (statusResponse.status === 'connected') {
      console.log('已經登入了');
      getStatus.style.display = 'none';
      FB.api('/me', 'GET', {"fields":"id,name,email,picture"}, function(response) {
        console.log(response);
      });
      logout.style.display = 'inline';
    }
    else {
      login.style.display = 'inline';
    }
  });
}

function fbLogin() {
  FB.login(function(loginResponse) {
    if (loginResponse.status === 'connected') {
      // Logged into your webpage and Facebook.
      getStatus.style.display = 'none';
      login.style.display = 'none';
      console.log('登入成功');
      FB.api('/me', 'GET', {"fields":"id,name,email,picture"}, function(response) {
        console.log(response);
      });
      logout.style.display = 'inline';
    } else {
      // The person is not logged into your webpage or we are unable to tell.
      console.log('登入失敗， status 為', loginResponse.status);
    }
  }, {scope: 'public_profile,email'});
}

function fbLogout() {
  FB.logout(function(logoutResponse) {
    logout.style.display = 'none';
    getStatus.style.display = 'inline';
  });
}