let logout = document.getElementById('logout');

logout.addEventListener('click', checkWhichIsLoggedIn, false);

function checkWhichIsLoggedIn() {
  if (isFbLoggedIn && !isGoogleLoggedIn) {
    fbRevokePermission();
  }
  else if (!isFbLoggedIn && isGoogleLoggedIn) {
    googleRevokeAllScopes();
  }
  else if (!isFbLoggedIn && !isGoogleLoggedIn) {
    // 都沒登入，應該要另外處理
    alert('請先登入');
    location.replace(`${location.protocol}//${location.host}/`);
  }
  else {
    alert('帳號重複登入');
  }
}