// 臉書是否登入
let isFbLoggedIn = false;
// Google 是否登入
let isGoogleLoggedIn = false;
// 臉書是否判斷過登入狀況
let isFbChecked = false;
// Google 是否判斷過登入
let isGoogleChecked = false;
let aGoogleAuth;
let aGoogleUser;
let checkWhichIsLoggedIn = function() {
  if (isFbLoggedIn && !isGoogleLoggedIn) {
    FB.api('/me/permissions', 'DELETE', {}, function(response) {
      console.log(response);
      location.replace(`${location.protocol}//${location.host}/`);
    });
  }
  else if (!isFbLoggedIn && isGoogleLoggedIn) {
    aGoogleAuth.disconnect();
    location.replace(`${location.protocol}//${location.host}/`);
  }
  else if (!isFbLoggedIn && !isGoogleLoggedIn) {
    // 都沒登入，應該要另外處理
    alert('請先登入');
    location.replace(`${location.protocol}//${location.host}/`);
  }
  else {
    alert('帳號重複登入');
    aGoogleAuth.disconnect();
    FB.api('/me/permissions', 'DELETE', {}, function(response) {
      console.log(response);
      location.replace(`${location.protocol}//${location.host}/`);
    });
  }
};