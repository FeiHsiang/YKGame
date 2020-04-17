window.fbAsyncInit = function() {
  FB.init({
    appId      : '790562841436344',
    cookie     : true,
    xfbml      : true,
    version    : 'v6.0'
  });

  FB.AppEvents.logPageView();

  FB.getLoginStatus(function(statusResponse) {
    if (statusResponse.status === 'connected') {
      console.log('已經登入了');
      FB.api('/me', 'GET', {"fields":"id,name,email,picture"}, function(response) {
        console.log(response);
      });
      document.getElementById('login').style.display = 'none';
      document.getElementById('logout').style.display = 'inline';
    }
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/zh_TW/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));