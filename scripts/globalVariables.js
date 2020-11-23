let aGoogleAuth;
let aGoogleUser;
let aNetworkAgent = new NetworkAgent();
let aUI = new UI();
window.aUI = aUI;
let userID;
let userName;
let rewardID;
let postData;
let seconds = 300;
let intervalId;

let checkWhichIsLoggedIn = function() {
  localStorage.clear();
  location.replace(`${location.protocol}//${location.host}/`);
};

let openIframe = function() {
  postData = {
    ID: userID,
    name: userName,
    request: 'read',
    requestItem: 'hasDrawn'
  };
  aNetworkAgent.sendPost(postData).then(myJson => {
    if (myJson[0]) {
      // 可以玩
      postData.request = 'draw';
      postData.requestItem = '';
      startCoreIframe(postData, aNetworkAgent);
    }
    else {
      // 不可以玩
      aUI.showPlayedToday();
    }
  });
};

//// 假如今日還沒玩過，載入 XR iframe
var startCoreIframe = window.startCoreIframe = function(postBody, NAClass){
  if (document.getElementById("xrIframe")) document.getElementById("xrIframe").remove();
  let jsonObj = window.jsonObj = postBody;
  let aNAClass = window.aNAClass = NAClass;

  var ifrm = document.createElement("iframe");
  ifrm.setAttribute("id", "xrIframe" ); 
  ifrm.setAttribute("src", "makarXR_clean.html");  
  ifrm.style.position = "absolute";
  //// set the style
  ifrm.style.border = "0px";
  ifrm.style.width = "100%";
  ifrm.style.height = "100%";
  ifrm.style.top = "0px";
  ifrm.style.left = "0%";
  ifrm.style.zIndex = 2;
  document.body.appendChild(ifrm);
  
};

//// 由 iframe內部呼叫來關閉 iframe
var closeCoreIframe = window.closeCoreIframe = function( test ){
  console.log("game-start: closeCoreIframe test=", test );
  
  document.getElementById("xrIframe").remove();
  
};

let getCertainPrizeInfo = function() {
  rewardID = localStorage.getItem('rewardID');
  postData = {
    ID: rewardID,
    name: '',
    request: 'read',
    requestItem: 'prizeData'
  };
  aNetworkAgent.sendPost(postData).then(myJson2 => {
    aUI.showPrizeInfo(myJson2);
  });
};

let listAllUserPrize = function() {
  postData = {
    ID: userID,
    name: userName,
    request: 'read',
    requestItem: 'userPrizeList'
  };
  aNetworkAgent.sendPost(postData).then(myJson => {
    aUI.showAllCoupons(myJson);
  });
};

let selectProgramToRun = function() {
  switch (location.pathname) {
    case '/':
    case '/index':
    case '/index.html':

//[start-20201120- fei - 0001-adddebug]//
      // var currectDate = new Date();
      // console.log(" date over: " , currectDate.getMonth() , currectDate.getDate() );
      // if ( currectDate.getMonth() > 7 || currectDate.getDate() > 9 ){ //// 月 0-11 日 1-31
      //   console.log(" date over: "  );
      //   if ( document.getElementById("after-login").children[0].getAttribute("href") == "./game-start/"  ){
      //     document.getElementById("after-login").children[0].style.pointerEvents = "none";
      //     document.getElementById("gameStartImg").style.opacity = 0.5;
      //   }
      // }
//[end---20201120- fei - 0001-adddebug]//

      aUI.showAfterLogin();
      break;
    case '/get-prize/':
    case '/get-prize/index':
    case '/get-prize/index.html':
      getCertainPrizeInfo();
      break;
    case '/prize-list/':
    case '/prize-list/index':
    case '/prize-list/index.html':
      listAllUserPrize();
      break;
    default:
      console.log("globalVariabiles.js: the location unknown, back home ");
      location.replace(`${location.protocol}//${location.host}/`);
    }
};

window.requestDeviceMotionPermission = function (){
  if (typeof(DeviceMotionEvent) !== 'undefined' && typeof(DeviceMotionEvent.requestPermission) === 'function') {
    DeviceMotionEvent.requestPermission().then(response => {
      console.log("globalVariables.js: requestPermission response =", response );
      if (response == 'granted') {
        window.addEventListener('devicemotion', (e) => {
        })
      }
    }).catch(console.error)
  }else {
    console.log("globalVariables.js: requestPermission: DeviceMotionEvent is not defined "  );
  }
}

if (document.getElementById("gameStartlink")){
  document.getElementById("gameStartlink").onclick = function(){
    console.log(" gameStartlink click ");
    requestDeviceMotionPermission();
  }
}