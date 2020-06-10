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
let aNetworkAgent = new NetworkAgent();
let userID;
let userName;

let checkWhichIsLoggedIn = function() {
  if (isFbLoggedIn && !isGoogleLoggedIn) {
    FB.api('/me/permissions', 'DELETE', {}, function(response) {
      console.log(response);
      location.replace(`${location.protocol}//${location.host}/`);
    });
  }
  else if (!isFbLoggedIn && isGoogleLoggedIn) {
    console.log('取消授權中 ...');
    aGoogleAuth.disconnect();
    console.log('取消授權完成');
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

let openIframe = function() {
  let postData = {
    ID: userID,
    name: userName,
    request: 'draw',
    requestItem: ''
  };
  aNetworkAgent.sendPost(postData).then(myJson => {
    if (!myJson[1]) {
      alert('今天遊戲次數到上限囉！\n歡迎明天再來挑戰！');
      console.log(myJson);
      location.replace(`${location.protocol}//${location.host}/get-prize/`);
    }
    else {
      startCoreIframe(parseInt(myJson[0]));
    }
  });
  //// 假如今日還沒玩過，載入 XR iframe 
      
  var startCoreIframe = window.startCoreIframe = function(prizeNum){
    if (document.getElementById("xrIframe")) document.getElementById("xrIframe").remove();

    //// 抽獎  暫時以 random 暫代，必定為 1 - 5 ， 假如這邊 getAward 不設值，則iframe內部會每次點擊random一次
    // let getAward = window.getAward = Math.floor(Math.random() * 5 ) + 1;
    let getAward = window.getAward = prizeNum;

    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("id", "xrIframe" ); 
    ifrm.setAttribute("src", "makarXR_clean.html");  
    ifrm.style.position = "absolute";
    //// set the style
    ifrm.style.border = "0px";
    ifrm.style.width = "100%";
    ifrm.style.height = "70%";
    // ifrm.style.top = "23%";
    ifrm.style.left = "0%";
    ifrm.style.zIndex = 2;
    document.body.appendChild(ifrm);
    
  }

  //// 由 iframe內部呼叫來關閉 iframe
  var closeCoreIframe = window.closeCoreIframe = function( test ){
    console.log("game-start: closeCoreIframe test=", test );
    
    document.getElementById("xrIframe").remove();
    
  }
};

let getTodayNewestPrizeInfo = function() {
  let postData = {
    ID: userID,
    name: userName,
    request: 'read',
    requestItem: 'userPrizeList'
  };
  aNetworkAgent.sendPost(postData).then(myJson => {
    myJson.forEach(element => {
      postData = {
        // 最新的獎項放在最後
        ID: element[element.length - 1],
        name: '',
        request: 'read',
        requestItem: 'prizeData'
      };
      aNetworkAgent.sendPost(postData).then(myJson2 => {
        console.log(postData, myJson2);
      })
    });
  });
};