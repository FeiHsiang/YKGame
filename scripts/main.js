function isFacebookApp() {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
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
    console.log("main.js: call selectProgramToRun ");
    selectProgramToRun(); 
    return;
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
    gameStartImg.addEventListener('click', function(){
      location.replace("/games");
    },false);

    myCoupon.addEventListener('click', function(){
      location.replace("/prize-list");
    });

    game1.addEventListener('click', function(){
      localStorage.setItem("gameType" , "shooting" ); 
      location.replace("/games");
    },false);
    
    game2.addEventListener('click', function(){
      localStorage.setItem("gameType" , "baseballNine" ); 
      location.replace("/games");
    },false);

    game3.addEventListener('click', function(){
      localStorage.setItem("gameType" , "canKnockdown" ); 
      location.replace("/games");
    },false);

    game4.addEventListener('click', function(){
      localStorage.setItem("gameType" , "slot" ); 
      location.replace("/games");
    },false);

//[end---20201123- fei -0001-adddebug]//


    break;
  case '/prize-list/':
  case '/prize-list/index':
  case '/prize-list/index.html':
    isChangeBrowserPage = false;
    let logout = document.getElementById('logout');
    logout.addEventListener('click', clearLSLogout, false);

    //// 假如 localStorage 內的使用者登入資訊有誤，則返回首頁
    if (localStorage.getItem('vendor') != "google" && localStorage.getItem('vendor') != "facebook" ){
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
        aUI.showMyCoupons();
      });

      //// 取得目前池中兌換券數量來建構『兌換卷』頁面
      postData = {
        request: 'get',
        requestItem: 'couponTotal'
      };
      aNetworkAgent.sendPost(postData).then(couponTotal => {
        console.log("prize-list get couponTotal, couponTotal=" , couponTotal );
        aUI.showAllCoupons(couponTotal);
      });

      //// 玩遊戲
      playeDiv.addEventListener('click', function(){
        location.replace("/games");
      }, false);

      //// 點擊金幣開啟『兌換區』
      coinDiv.addEventListener('click' , function(){
        console.log(" _coinDiv click ");
        document.getElementById("buyCouponDov").style.display = "block";
      },false);
      //// 確認兌換
      buyCouponConfirm.addEventListener('click', function(){
        aUI.buyCoupons();
      });
      //// 點擊取消關閉兌換區
      buyCouponCancel.addEventListener('click', function(){
        console.log("buyCouponCancel click");
        document.getElementById("buyCouponDov").style.display = "none";
      });
      //// 查看排行榜
      leadBn.addEventListener('click', function(){
        console.log(" leadBn click ");
        document.getElementById("leadBnModal").style.display = "block";
        aUI.showLeaders();
      });
      //// 關閉排行榜
      closeLeadBnModal.addEventListener('click', function(){
        document.getElementById("leadBnModal").style.display = "none";
      });

    }

    

    break;
  case '/games/':
  case '/games/index':
  case '/games/index.html':
    //// 點擊『開始遊戲』跳出提示視窗
    gamesGameStart.onclick = function(){
      console.log(" gamesGameStart click ");
      gamesGameStartDiv.style.display = 'block';
    }
    //// 點擊『確認』來進入遊戲場景
    gamesButtonComfirm.onclick = function(){
      console.log(" gamesButtonComfirm click ");
      aUI.startPlayingGame( localStorage.getItem("gameType") );
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

  default:
    isChangeBrowserPage = false;
    break;
}

if (!isChangeBrowserPage) {
  checkLogin();
}