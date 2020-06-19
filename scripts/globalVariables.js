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
let rewardID;
let postData;
let seconds = 10;
let intervalId;

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
      alert('今天遊戲次數到上限囉！\n歡迎明天再來挑戰！');
      // TODO
      location.replace(`${location.protocol}//${location.host}/prize-list/`);
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
  ifrm.style.height = "70%";
  // ifrm.style.top = "23%";
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
    let prizeDescription = new Image();
    prizeDescription.src = '/images/description-' + myJson2[0].prizeLevel + '.jpg';
    document.getElementById('prize-description').appendChild(prizeDescription);
    let exchangePrize = document.getElementById('exchange-prize');
    if (myJson2[0].hasExchanged) {
      exchangePrize.style.opacity = '0.5';
    }
    else {
      exchangePrize.classList.add('clickable-button');
      exchangePrize.addEventListener('click', function() {
        let password = prompt('密碼兌換', '5285');
        if (password === null) {
          console.log('取消輸入');
        }
        else if (password === '5285') {
          console.log(rewardID);
          postData = {
            ID: rewardID,
            name: '',
            request: 'exchange',
            requestItem: ''
          };
          aNetworkAgent.sendPost(postData).then(myJson => {
            console.log(myJson);
            if (myJson[0]) {
              document.getElementById('before-exchange').style.display = 'none';
              document.getElementById('after-exchange').style.display = 'block';
              let qrcode = new Image();
              qrcode.id = 'qrcode'
              qrcode.src = '/images/qrcode-' + myJson[1] + '.jpg';
              document.getElementById('qrcode').appendChild(qrcode);
              qrcode.addEventListener('load', function() {
                document.getElementById("clock").textContent = '00:' + seconds;
                intervalId = setInterval(myTimer, 1000);
                console.log('qrcode loaded');
                sessionStorage.removeItem('rewardID');
                window.scrollTo(0, document.body.scrollHeight);
              });
            }
          });
        }
        else {
          console.log('密碼錯誤');
        }
      });
    }
  });
};

let myTimer = function() {
  seconds--;
  let clockString = ('0' + seconds).slice(-2);
  document.getElementById("clock").textContent = '00:' + clockString;
  if (seconds <= 0) {
    clearInterval(intervalId);
    location.replace(`${location.protocol}//${location.host}/prize-list/`);
  }
};

let listAllUserPrize = function() {
  postData = {
    ID: userID,
    name: userName,
    request: 'read',
    requestItem: 'userPrizeList'
  };
  aNetworkAgent.sendPost(postData).then(myJson => {
    myJson[0].forEach((currentValue, index) => {
      let prizeBtn = new Image();
      prizeBtn.src = '/images/button-' + myJson[1][index].prizeLevel + '.jpg';
      prizeBtn.dataset.prizeLevel = myJson[1][index].prizeLevel;
      prizeBtn.dataset.prizeId = currentValue;
      prizeBtn.dataset.hasExchanged = myJson[1][index].hasExchanged;
      prizeBtn.dataset.drawDate = myJson[1][index].drawDate;
      prizeBtn.dataset.exchangeDate = myJson[1][index].exchangeDate;
      if (myJson[1][index].hasExchanged) {
        // 已經兌換過
        prizeBtn.style.opacity = '0.5';
      }
      else {
        prizeBtn.classList.add('clickable-button');
        prizeBtn.addEventListener('click', function() {
          localStorage.setItem('rewardID', currentValue);
          location.assign(`${location.protocol}//${location.host}/get-prize/`);
        });
      }
      document.getElementById('user-prize-list').appendChild(prizeBtn);
    });
    if (myJson[0].length === 0) {
      logout.style.display = 'initial';
    }
    else {
      document.getElementById('user-prize-list').children[0].onload = function(event) {
        logout.style.width = 'auto';
        logout.style.maxHeight = event.target.height + 'px';
        logout.style.display = 'initial';
        event.target.style.marginTop = event.target.height + 'px';
      }
    }
  });
};

let changeLoginPageUI = function() {
  document.getElementById('before-login').style.display = 'none';
  document.getElementById('after-login').style.display = 'flex';
};

let selectProgramToRun = function() {
  switch (location.pathname) {
    case '/':
    case '/index':
    case '/index.html':
      changeLoginPageUI();
      break;
    case '/game-start/':
    case '/game-start/index':
    case '/game-start/index.html':
      openIframe();
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
  }
};