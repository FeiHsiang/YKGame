function isFacebookApp() {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf("Line") > -1) ;
}

// 檢查登入
let checkLogin = function() {
  console.log('checkLogin()');
  if (localStorage.getItem('token') !== null && localStorage.getItem('userID') !== null && localStorage.getItem('vendor') !== null) {
    // 有登入，進行驗證
    switch(localStorage.getItem('vendor')) {
      case 'facebook':
        fetch(`https://graph.facebook.com/${localStorage.getItem('userID')}?fields=id,name&access_token=${localStorage.getItem('token')}`).then(function(response) {
          return response.json();
        }).then(function(myJson) {
          userID = `${myJson.id}@${localStorage.getItem('vendor')}`;
          userName = myJson.name;
          // 驗證完成
          if (userID !== undefined && userName !== undefined) {
            selectProgramToRun();
          }
          else {
            alert('登入時效已過，請重新登入！');
            localStorage.clear();
            location.replace(`${location.protocol}//${location.host}/`);
          }
        });
        break;
      case 'google':
        fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${localStorage.getItem('token')}`).then(function(response) {
          return response.json();
        }).then(function(myJson) {
          userID = `${myJson.sub}@${localStorage.getItem('vendor')}`;
          userName = myJson.name;
          // 驗證完成
          if (userID !== undefined && userName !== undefined) {
            selectProgramToRun();
          }
          else {
            alert('登入時效已過，請重新登入！');
            localStorage.clear();
            location.replace(`${location.protocol}//${location.host}/`);
          }
        });
        break;
      default:
        alert('供應商不存在！');
        localStorage.clear();
        location.replace(`${location.protocol}//${location.host}/`);
        break;
    }
  }
  else {
//[start-20201119- fei -0001-debug]//
    //// 測試：不論登入與否，直接顯示
    // console.log("main.js: call selectProgramToRun " , typeof(selectProgramToRun) );
    // if (typeof(selectProgramToRun) == "function" ){
    //   selectProgramToRun(); 
    // }
    // return;

    //// 假如超過 12/27 取消『檢查登入』並且開啟『選擇遊戲清單』
    let currectDate = new Date();
    let y = currectDate.getYear();
    let m = currectDate.getMonth() + 1;
    let d = currectDate.getDate()  + 0;
    if (y == "120" && m == 12 && d < 28 ){
      //// 什麼都不用作
    }else{
      if (typeof(selectProgramToRun) == "function" ){
        selectProgramToRun(); 
      }
      return;
    }

//[end---20201119- fei -0001-debug]//

    // 沒登入
    switch (location.pathname) {
      case '/':
      case '/index':
      case '/index.html':
        aUI.showLoginButton();
        break;
      case '/games/':
      case '/games/index':
      case '/games/index.html':
        aUI.showLoginButton();
        break;
 
      case '/change-your-browser/':
      case '/change-your-browser/index':
      case '/change-your-browser/index.html':
        // do nothing
        break;
      default:
        alert('請先登入！');
        location.replace(`${location.protocol}//${location.host}/`);
        break;
    }
  }
};

let isChangeBrowserPage;

// 檢查使用者是否使用 Facebook App 開啟網頁
switch (location.pathname) {
  case '/change-your-browser/':
  case '/change-your-browser/index':
  case '/change-your-browser/index.html':
    
    // break;
    if (!isFacebookApp()) {
      location.replace(`${location.protocol}//${location.host}/`);
    }
    break;
  default:
    if (isFacebookApp()) {
      location.replace(`${location.protocol}//${location.host}/change-your-browser/`);
    }
    break;
}

switch (location.pathname) {
  case '/change-your-browser/':
  case '/change-your-browser/index':
  case '/change-your-browser/index.html':
    isChangeBrowserPage = true;
    aUI.showChangeBrowserPage();
    break;
  case '/':
  case '/index':
  case '/index.html':
    isChangeBrowserPage = false;
    let fbLoginButton = document.getElementById('fb-login-button');
    fbLoginButton.addEventListener('click', fbLogin, false);

//[start-20201123- fei -0001-adddebug]//
    //// 點擊開啟『介紹遊玩方式』
    gameStartImg.addEventListener('click', function(){
      aUI.showStartGameIntro();
      gameIntroModal.style.display = "block";
    },false);
    //// 點擊開啟『介紹遊玩方式』
    gameStartIntro.addEventListener('click', function(){
      gameInfoModalDiv.style.display = "block";
    },false);
    //// 點擊關閉『介紹遊玩方式』
    gameInfoModalCancel.onclick = function(){
      gameInfoModalDiv.style.display = "none";
    }
    gameInfoModalComfirmImg.onclick = function(){
      gameInfoModalDiv.style.display = "none";
    }

    //// 點擊關閉『開始遊戲前導區』
    gameIntroModalCancel.onclick = function(){
      gameIntroModal.style.display = "none";
    }
    //// 點擊跳轉『遊戲場景』
    gameIntroModalComfirm.onclick = function(){
      aUI.startTodayGame();
    }
    //// 點擊跳轉『兌換區』
    myCouponImg.addEventListener('click', function(){
      location.replace("/prize-list");
    });
    //// 點擊開啟『介紹獎項兌換』
    myCouponIntro.onclick = function(){
      exchangeIntroModalDiv.style.display = "block";
    }
    //// 點擊關閉『介紹獎項兌換』
    exchangeIntroCancel.onclick = function(){
      exchangeIntroModalDiv.style.display = "none";
    }
    exchangeIntroComfirmImg.onclick = function(){
      exchangeIntroModalDiv.style.display = "none";
    }

    //// 點擊開啟『是否返回首頁』
    backToWixImg.onclick = function(){
      leaveWarningModalDiv.style.display = "block";
    }

    leaveWarningCancel.onclick = function(){
      leaveWarningModalDiv.style.display = "none";
    }

    leaveWarningComfirm.onclick = function(){
      location.href = "https://www.miflydesign.com/yongkang";
    }
    


    game1.addEventListener('click', function(){
      localStorage.setItem("gameType" , "shooting" ); 
      location.replace("/games/shooting.html");
    },false);
    
    game2.addEventListener('click', function(){
      localStorage.setItem("gameType" , "baseballNine" ); 
      location.replace("/games/baseballNine.html");
    },false);

    game3.addEventListener('click', function(){
      localStorage.setItem("gameType" , "canKnockdown" ); 
      location.replace("/games/canKnockdown.html");
    },false);

    game4.addEventListener('click', function(){
      localStorage.setItem("gameType" , "slot" ); 
      location.replace("/games/slot.html");
    },false);

//[end---20201123- fei -0001-adddebug]//


    break;
  case '/prize-list/':
  case '/prize-list/index':
  case '/prize-list/index.html':
    isChangeBrowserPage = false;
    // let logout = document.getElementById('logout');
    // logout.addEventListener('click', clearLSLogout, false);

    //// 20201228 活動結束
    location.replace("/");
    //// 假如 localStorage 內的使用者登入資訊有誤，則返回首頁
    if (localStorage.getItem('vendor') != "google" && localStorage.getItem('vendor') != "facebook" && false  ){
      // alert('登入供應商有誤，請重新登入！');
      console.log('登入供應商有誤，請重新登入！', location.href , location.origin );
      localStorage.clear();
      if (location.href != location.origin){
        location.replace("/");
      }
      
    }else{
      //// 取得使用者資訊來建構『票夾頁面』與下方欄位的『代幣數』。
      //// 同時存入 localStorage，只要使用者沒有作『玩遊戲』『用代幣購買兌換卷』『兌換兌換卷』『使用兌換卷』就不會重新發request
      postData = {
        ID: localStorage.getItem('userID')+"@"+localStorage.getItem('vendor'), 
        // ID: "test1"+"@"+"google", 
        name: localStorage.getItem('userName'),
        email: "",
        request: 'login',
        requestItem: ''
      };
      aNetworkAgent.sendPost(postData).then(userInfo => {
        console.log("prize-list login, userInfo=" , userInfo );
        localStorage.setItem("_userInfo" , JSON.stringify(userInfo) );
        aUI.updateUserInfo();
      });

      //// 取得目前池中兌換券數量來建構『兌換卷』頁面
      aUI.showAllCoupons();
      
      //// 玩遊戲
      // playeDiv.addEventListener('click', function(){
      //   location.replace("/games");
      // }, false);

      //// 點擊『購買折價券』開啟『兌換區』
      doExchangeImg.addEventListener('click' , function(){
        console.log(" _coinDiv click ");
        //// 每次點擊就詢問兌換池的狀況，關閉顯示資訊
        document.getElementById("exchangeModalRetDiv").innerHTML = "";
        aUI.showAllCoupons();
        document.getElementById("exchangeModalDiv").style.display = "block";
      },false);

      ////檢查輸入『兌換折價券數量』的時候，不可小於0
      document.getElementById("inputExchangeText").onchange = function(){
        console.log(" inputExchangeText onchange: " , inputExchangeText.value , inputExchangeText.value < 0 );
        if ( inputExchangeText.value < 0 || Number.isInteger( Number(inputExchangeText.value) ) == false ){
          inputExchangeText.value = "0";
        }
      }
      //// 確認兌換
      exchangeModalComfirmImg.addEventListener('click', function(){
        aUI.buyCoupons();
      });
      //// 點擊取消關閉兌換區
      exchangeModalCancel.addEventListener('click', function(){
        console.log("buyCouponCancel click");
        document.getElementById("exchangeModalDiv").style.display = "none";
      });
      //// 查看排行榜
      leaderBnImg.addEventListener('click', function(){
        console.log(" leadBn click ");
        document.getElementById("leaderModalDiv").style.display = "block";
        aUI.showLeaders();
      });
      //// 關閉排行榜
      leaderModalCancel.addEventListener('click', function(){
        document.getElementById("leaderModalDiv").style.display = "none";
      });
      //// 關閉排行榜
      leaderModalComfirmImg.onclick = function(){
        document.getElementById("leaderModalDiv").style.display = "none";
      }
      //// 關閉『個資聲明』頁面
      personalIntroModalComfirmImg.onclick = function(){
        personalIntroModalDiv.style.display = "none";
      }
      //// 關閉『個資聲明』頁面，同時關閉『兌換頁面』
      personalIntroModalCancel.onclick = function(){
        personalIntroModalDiv.style.display = "none";
        useCouponModalDiv.style.display = "none";
      }

      //// 點擊開啟『永康幣介紹區』
      myCoinsNumberIntroImg.onclick = function(){
        coinIntroModalDiv.style.display = "block";
      }
      //// 點擊關閉『永康幣介紹區』
      coinIntroModalComfirmImg.onclick = function(){
        coinIntroModalDiv.style.display = "none";
      }
      //// 點擊開啟『累積抽獎機會介紹區』
      myExchangeNumberIntroImg.onclick = function(){
        lotteryIntroModalDiv.style.display = "block";
      }
      //// 點擊關閉『累積抽獎機會介紹區』
      lotteryModalComfirmImg.onclick = function(){
        lotteryIntroModalDiv.style.display = "none";
      }


      //// 開始遊戲按鈕
      startGameBnImg.onclick = function(){
        aUI.showStartGameIntro();
        gameIntroModal.style.display = "block";
      }
      //// 確認開始遊戲
      gameIntroModalComfirmImg.onclick = function(){
        // location.href = "/games/";
        aUI.startTodayGame();
      }
      //// 取消開始遊戲
      gameIntroModalCancelImg.onclick = function(){
        gameIntroModal.style.display = "none";
      }

      //// 顯示『返回首頁』
      backToWixImg.onclick = function(){
        leaveWarningModalDiv.style.display = "block";
      }
      //// 取消返回首頁
      leaveWarningCancel.onclick = function(){
        leaveWarningModalDiv.style.display = "none";
      }
      //// 執行跳轉頁面
      leaveWarningComfirmImg.onclick = function(){
        location.href = "https://www.miflydesign.com/yongkang";
      }




    }

    

    break;
  case '/games/':
  case '/games/index':
  case '/games/index.html':
    //// facebook login
    isChangeBrowserPage = false;
    let fbLoginButton2 = document.getElementById('fb-login-button');
    fbLoginButton2.addEventListener('click', fbLogin, false);  

    //// 點擊『開始遊戲』跳出提示視窗
    gamesGameStart.onclick = function(){
      console.log(" gamesGameStart click ");
      gamesGameStartDiv.style.display = 'block';
    }
    //// 點擊『確認』來進入遊戲場景
    gamesButtonComfirm.onclick = function(){
      console.log(" gamesButtonComfirm click ");
      //// 所有遊戲都先問一次『動作感應器啟動』，得到回應（不論同意與否）再進入場景
      function requestDeviceMotionPermission(){
        console.log("_requestDeviceMotionPermission start" );
        if (typeof(DeviceMotionEvent) !== 'undefined' && typeof(DeviceMotionEvent.requestPermission) === 'function') {
          DeviceMotionEvent.requestPermission().then(response => {
            console.log("_requestPermission response =", response );
            if (response == 'granted') {
              
            }
            aUI.startPlayingGame( localStorage.getItem("gameType") );
          }).catch(console.error("_requestDeviceMotionPermission error"));
        }else {
          console.log("_requestPermission: DeviceMotionEvent is not defined " );
          aUI.startPlayingGame( localStorage.getItem("gameType") );
        }
      }
      requestDeviceMotionPermission();
      // aUI.startPlayingGame( localStorage.getItem("gameType") );

    }
    //// 點擊『取消』來返回遊戲首頁
    gamesButtonCancel.onclick = function(){
      gamesGameStartDiv.style.display = 'none';
    }

    //// 點擊『獎券兌換』
    gamesMyCoupon.onclick = function(){
      console.log(" gamesMyCoupon click ");
      location.replace("/prize-list");
    }

    break;

  case '/lottery/':
  case '/lottery/index':
  case '/lottery/index.html':

    console.log(" -------------***************** ");
    
    aUI.getUserNameLiet();

    iphone.onclick = function(){
      iphone.className = "prizeSelect";
      ring.className = "";
      tableware.className = "";
      cup.className = "";
    }
    ring.onclick = function(){
      iphone.className = "";
      ring.className = "prizeSelect";
      tableware.className = "";
      cup.className = "";
    }
    tableware.onclick = function(){
      iphone.className = "";
      ring.className = "";
      tableware.className = "prizeSelect";
      cup.className = "";
    }
    cup.onclick = function(){
      iphone.className = "";
      ring.className = "";
      tableware.className = "";
      cup.className = "prizeSelect";
    }

    getLotteryImg.onclick = function(){
      aUI.draw();
      
    }


    break;

  default:
    isChangeBrowserPage = false;
    break;
}

if (!isChangeBrowserPage) {
  checkLogin();
}