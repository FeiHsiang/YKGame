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
      switch (location.pathname) {
        case '/':
        case '/index':
        case '/index.html':
          // 準備跳轉頁面，有沒有設成 `true` 已經沒差了
          location.replace(`${location.protocol}//${location.host}/game-introduction/`);
          break;
        default:
          isFbLoggedIn = true;
          console.log('已經登入臉書了');
          FB.api('/me', 'GET', {"fields":"id,name,email,picture"}, function(response) {
            console.log(response);
          });
          break;
      }
    }
    else {
      isFbLoggedIn = false;
      console.log('尚未登入臉書');
      switch (location.pathname) {
        case '/game-introduction/':
        case '/game-introduction/index':
        case '/game-introduction/index.html':
          // alert('請先登入');
          // location.replace(`${location.protocol}//${location.host}/`);
          break;
        default:
          break;
      }
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