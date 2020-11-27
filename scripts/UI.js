class UI {
  constructor() {
    this.aNetworkAgent = new NetworkAgent();
  }

  myTimer() {
    // `seconds` is a global variable
    seconds--;
    var minute = Math.floor(seconds/60);
    var second = seconds - minute*60;
    document.getElementById("clock").textContent = ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2);
    if (seconds <= 0) {
      clearInterval(intervalId);
      location.replace(`${location.protocol}//${location.host}/prize-list/`);
    }
  }

  showAfterLogin() {
    document.getElementById('before-login').style.display = 'none';
    document.getElementById('after-login').style.display = 'flex';
//[start-20201118- fei -0001-debug]//
    // document.getElementById("after-login").style.display = "none";
//[end---20201118- fei -0001-debug]//

    document.getElementById('account-info').textContent = `Hello ${userName}. ${userID}`;
  }

  //// 顯示當前所有可兌換的段換券
  showAllCoupons(couponTotal){
    console.log("UI.js: _showAllCoupons couponTotal=" , couponTotal );
    if (!couponTotal){
      return;
    }
    if (couponTotal.errorMessage){
      return;
    }
    document.getElementById("couponNumber").innerHTML = couponTotal[0].coupon001;
  }

  //// 使用代幣購買兌換券
  buyCoupons(){
    console.log("UI.js: _buyCoupons, [wanted, pool]", document.getElementById("exchangeNumber").value , document.getElementById("couponNumber").innerHTML  );
    ////
    let currentPoolNumber =  Number(document.getElementById("couponNumber").innerHTML );
    let buyNumber =  Number(document.getElementById("exchangeNumber").value );

    if (buyNumber == 0 ){
      console.log("請輸入想要兌換的數量");
      document.getElementById("buyCouponNote").innerHTML = "請輸入想要兌換的數量";
      return;
    }
    if (buyNumber > currentPoolNumber ){
      console.log("你無法購買超過線上現有兌換券數量");
      document.getElementById("buyCouponNote").innerHTML = "你無法購買超過線上現有兌換券數量";
      return;
    }

    //// 嘗試購買兌換券
    postData = {
      ID: localStorage.getItem('userID')+"@"+localStorage.getItem('vendor'), 
      request: 'buy',
      requestItem: {coupon001: buyNumber},
    };
    aNetworkAgent.sendPost(postData).then( buyRet => {
      console.log("buyRet=" , buyRet);
      //// 處理線上剩餘兌換券數量
      if (buyRet[0]){
        if (buyRet[0].couponRemain.coupon001){
          document.getElementById("couponNumber").innerHTML = buyRet[0].couponRemain.coupon001;
        }

        if (buyRet[0].status){
          //// 購買成功
          document.getElementById("buyCouponNote").innerHTML = "成功購買了" + buyNumber + "張";
          aUI.showMyCoupons();
        }else{
          //// 購買失敗，依照各個狀態顯示
          switch(buyRet[0].result){
            case "Sold out!":
              document.getElementById("buyCouponNote").innerHTML = "今日線上兌換券已經換完";
            break;

            case "Not enough coin!":
              document.getElementById("buyCouponNote").innerHTML = "您的代幣不足";              
            break;

            default:
              document.getElementById("buyCouponNote").innerHTML = "等待後端回應";   

          }
         
        }

      }
 
    });
  }

  //// 顯示排行榜
  showLeaders(){
    postData = {
      request: 'get',
      requestItem: 'coinLeaderboard',
    };
    aNetworkAgent.sendPost(postData).then(leaderList => {
      console.log("leaderList = " , leaderList );
      let leaderTable = document.getElementById("leaderTable");
      leaderTable.innerHTML = "";
      let thr = leaderTable.insertRow( 0 );
      let t1 = document.createElement('th') , t2 = document.createElement('th') , t3 = document.createElement('th');
      t1.innerHTML = "排名";
      t2.innerHTML = "用戶名稱";
      t3.innerHTML = "代幣數量";
      thr.appendChild(t1);
      thr.appendChild(t2);
      thr.appendChild(t3);
      leaderList.forEach((currentValue, index) => {
        let row = leaderTable.insertRow( index + 1);
        let rankR = row.insertCell(0);
        let nameR = row.insertCell(1);
        let coinsR = row.insertCell(2);
        rankR.style.width = "20%";
        nameR.style.width = "50%";
        coinsR.style.width = "25%";

        let userName;
        if (currentValue.name == ""){
          userName = "user";
        }else{
          userName = currentValue.name;
        }
        rankR.innerHTML = index + 1;
        nameR.innerHTML = userName;
        coinsR.innerHTML = currentValue.cumulativeCoins;

      });
    });

  }

  //// 顯示用戶本身含有的兌換券
  showMyCoupons() {
    let userInfo = JSON.parse( localStorage.getItem("_userInfo") );
    console.log("UI.js: _showMyCoupons userInfo=" , userInfo );

    if (!userInfo){
      document.getElementById('user-prize-list').textContent = '錯誤, userInfo not exist' ;
      return;
    }
    if (!userInfo[0]){
      document.getElementById('user-prize-list').textContent = '錯誤, userInfo not exist' ;
      return;
    }
    if (userInfo.errorMessage){
      console.log(" _showMyCoupons error ", userInfo.errorMessage );
      document.getElementById('user-prize-list').textContent = '錯誤, ' + userInfo.errorType + ", " + userInfo.errorMessage ;
      return;
    }

    //// 填入擁有代幣
    if (userInfo[0].currentCoins != undefined){
      document.getElementById("coinNumber").innerText = userInfo[0].currentCoins;
    }
    
    //// 依照遊玩紀錄決定『玩遊戲按鈕』可否使用
    postData = {
      ID: localStorage.getItem('userID')+"@"+localStorage.getItem('vendor'), 
      request: 'get',
      requestItem: 'playedGame',
    };
    aNetworkAgent.sendPost(postData).then(isplayed => {
      console.log(" isplayed = " , isplayed );
      if (isplayed[0] == true){
        document.getElementById("playeDiv").style.opacity = 0.5;
        document.getElementById("playeDiv").style.pointerEvents = "none";
      }else{
        document.getElementById("playeDiv").style.opacity = 1.0;
        document.getElementById("playeDiv").style.pointerEvents = "auto";
      }
    });


    postData = {
      ID: localStorage.getItem('userID')+"@"+localStorage.getItem('vendor'), 
      request: 'get',
      requestItem: 'userCouponList',
    };
    aNetworkAgent.sendPost(postData).then(userCouponList => {
      console.log("userCouponList = " , userCouponList );

      //// 清空列表
      document.getElementById('mycouponDiv').innerHTML = "";

      //// 填入擁有兌換卷
      if (userCouponList.length == 0){
        document.getElementById("mycouponDiv").innerHTML = "您尚未擁有兌換券"
      }

      //// 重新向後端查找並填入
      userCouponList.forEach((currentValue, index) => {
        console.log(" _couponList: " , currentValue , index );
        
        let oneRowData = document.createElement('div');
        let imgDiv = document.createElement('div');
        let couponBtn = new Image();
        couponBtn.src = '/images/c1.jpg';
        
        couponBtn.dataset.hasExchanged = currentValue.exchangeDate == ""? false : true
        couponBtn.dataset.drawDate = currentValue.purchaseDate;
        couponBtn.dataset.exchangeDate = currentValue.exchangeDate;
        couponBtn.dataset.couponID = currentValue._id;


        if (currentValue.exchangeDate != ""){
          couponBtn.style.opacity = '0.5';
        }else{
          couponBtn.classList.add('clickable-button');
          couponBtn.onclick =  function() {
            console.log(" couponBtn click " , couponBtn.dataset );

            document.getElementById("useCouponDiv").style.display = "block";

            //// 為求統一，確認與取消按鈕都在這裡架構
            document.getElementById("pwdButtonComfirm").onclick = function(){
              let password = Number(document.getElementById('inputPassword').value);
              console.log(" password = " , password , couponBtn.dataset );
              if (password < 1000 || password > 9999 ){
                document.getElementById("pwdError").style.display = "block";
                document.getElementById("pwdError").innerHTML = "密碼長度必須為4";
              }else {
                //// 向後端發送『使用兌換券』事件
                postData = {
                  ID: couponBtn.dataset.couponID, 
                  request: 'exchange',
                  requestItem: password.toString(),
                };
                aNetworkAgent.sendPost(postData).then(exchangeRet => {
                  console.log("exchangeRet = " , exchangeRet , exchangeRet[0].status );
                  if (exchangeRet[0].status == true){
                    document.getElementById("pwdError").style.display = "none";
                  }else{
                    document.getElementById("pwdError").style.display = "block";
                    switch(exchangeRet[0].result){
                      case "Incorrect code!" :
                        document.getElementById("pwdError").innerHTML = "密碼錯誤";
                        break;
                      case "Prize not found!":
                        document.getElementById("pwdError").innerHTML = "此獎項不存在";
                        break;
                      case "Already exchanged!":
                        document.getElementById("pwdError").innerHTML = "此獎項已經兌換過";
                        break;
                      
                      default:
                        document.getElementById("pwdError").innerHTML = "密碼後端錯誤";
                    }
                  }
                });

              }

            }

            document.getElementById("pwdButtonCancel").onclick = function(){
              document.getElementById("useCouponDiv").style.display = "none";
            }

          };
        }

        imgDiv.appendChild(couponBtn);
        oneRowData.appendChild(imgDiv);
        document.getElementById('mycouponDiv').appendChild(oneRowData);
      });
    });
   
  }

  showChangeBrowserPage() {
    let os = ['iPhone', 'Android'];
    let browser = ['Safari', 'Chrome'];
    let content1 = ' 用戶請先於選單（箭頭指引處）選擇 ';
    let content2 = ' 瀏覽器進行遊戲'
    let hint = new Image();
    if (navigator.platform === 'iPhone' || navigator.platform === 'iPad') {
      hint.src = '../images/ios.jpg';
      hint.alt = os[0] + content1 + browser[0] + content2;
    }
    else {
      hint.src = '../images/android.jpg';
      hint.alt = os[1] + content1 + browser[1] + content2;
    }
    document.body.insertBefore(hint, document.body.children[0]);
  }

  showLoginButton() {
    document.getElementById('before-login').style.display = 'flex';
  }

  showPlayedToday() {
    let played = new Image();
    played.src = '../images/played.jpg';
    played.alt = '今天遊戲次數到上限囉！歡迎明天再來挑戰';
    document.body.insertBefore(played, document.body.children[0]);
    let gameBtnDiv = document.createElement('div');
    gameBtnDiv.classList.add('two-button-div');
    gameBtnDiv.style.margin = "20px";
    let back = document.createElement('a');
    back.href = '../';
    gameBtnDiv.appendChild(back);
    let backImg = new Image();
    backImg.src = '../images/back-to-main-page.png';
    backImg.alt = '返回首頁';
    back.appendChild(backImg);
    let prizeList = document.createElement('a');
    prizeList.href = '../prize-list/';
    gameBtnDiv.appendChild(prizeList);
    let prizeListImg = new Image();
    prizeListImg.src = '../images/check-prize-list.png';
    prizeListImg.alt = '查看獎項列表';
    prizeList.appendChild(prizeListImg);
    document.body.insertBefore(gameBtnDiv, document.body.children[1]);
  }

  showPrizeInfo(myJson2) {
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
        document.getElementById('pwdModal').style.display = 'block';
      });
      document.getElementById('pwdButtonCancel').addEventListener('click', function() {
        document.getElementById('pwdModal').style.display = 'none';
        document.getElementById('pwdError').style.display = 'none';
      });
      document.getElementById('pwdButtonComfirm').addEventListener('click', function() {
        aUI.validatePassword(rewardID);
      });
    }
  }

  showQRCode(myJson) {
    document.getElementById('before-exchange').style.display = 'none';
    document.getElementById('after-exchange').style.display = 'block';
    let qrcode = new Image();
    qrcode.id = 'qrcode'
    qrcode.src = '/images/qrcode-' + myJson[1] + '.jpg';
    document.getElementById('qrcode').appendChild(qrcode);
    qrcode.addEventListener('load', function() {
      var minute = Math.floor(seconds/60);
      var second = seconds - minute*60;
      let bUI = new UI();
      document.getElementById("clock").textContent = ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2);
      // https://stackoverflow.com/a/21299126
      intervalId = setInterval(bUI.myTimer, 1000);
      console.log('qrcode loaded');
      sessionStorage.removeItem('rewardID');
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  validatePassword(rewardID) {
    let password = document.getElementById('inputPassword').value;
    postData = {
      ID: rewardID,
      name: '',
      request: 'exchange',
      requestItem: password
    };
    this.aNetworkAgent.sendPost(postData).then(myJson => {
      console.log(myJson);
      if (myJson[0] && myJson.length === 2) {
        document.getElementById('pwdModal').style.display = 'none';
        this.showQRCode(myJson);
      }
      else if (myJson[0] === 'Incorrect code!' && myJson.length === 1) {
        document.getElementById('pwdError').style.display = 'block';
      }
      else {
        // 基本上不會發生，除非重複對獎
        alert('似乎你已經兌換獎項過了喔！');
      }
    });
  }

//[start-20201123- fei -0001-add]//
  //// 以 iframe 方式開啟遊戲
  startPlayingGame( _gameName ){
    console.log("UI.js: —startPlayingGame ");
    let gameName = _gameName? _gameName: "shooting";

    ////直接跳轉到遊戲頁面
    location.replace("/games/" + gameName + ".html" );

    //// 使用iframe開啟遊戲頁面。
    // if (document.getElementById("game")) document.getElementById("game").remove();

    // let ifrm = document.createElement("iframe");
    // ifrm.setAttribute("id", "game" ); 
    // ifrm.setAttribute("src", "/games/" + gameName +".html");  
    // ifrm.style.position = "absolute";
    // //// set the style
    // ifrm.style.border = "0px";
    // ifrm.style.width = "100%";
    // ifrm.style.height = "100%";
    // ifrm.style.top = "0%";
    // ifrm.style.left = "0%";
    // ifrm.style.zIndex = 1; //
    // document.body.appendChild(ifrm);

  }

  closeGameIframe(){
    //// 直接跳轉回主頁面
    location.replace("/prize-list");

    //// 關閉iframe 回到主頁面
    // if (document.getElementById("game")) document.getElementById("game").remove();
  }


//[end----20201123- fei -0001-add]//

}