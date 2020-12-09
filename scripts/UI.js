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

  showAfterLoginCoupon() {
    document.getElementById('before-login').style.display = 'none';
    document.getElementById('after-login').style.display = 'block';
    document.getElementById('account-info').textContent = `Hello ${userName}. ${userID}`;
    let couponIntroText = "歡迎來到永康幣兌換區！獲得的永康幣除了同時增加抽 iPhone 12 mini 的機會，也可用來兌換永康商圈指定店家的15元折價券喔！";
    document.getElementById('couponIntroContainerInfo').innerHTML = couponIntroText;
  }

  //// AR遊戲頁面顯示登入之後畫面
  showAfterLoginGames() {
    document.getElementById('before-login').style.display = 'none';
    document.getElementById('after-login').style.display = 'block';
    document.getElementById('account-info').textContent = `Hello ${userName}. ${userID}`;

    //// 依照不同的遊戲類別，顯示提示文字
    let introText , gameTip;
    let gameType , _gameType = localStorage.getItem("gameType"); 
    if (_gameType == "slot" || _gameType == "shooting" || _gameType == "baseballNine" || _gameType == "canKnockdown" ){
      gameType = _gameType;
    }else{
      gameType = "shooting"; //// 預設為射擊
      localStorage.setItem("gameType" , "shooting" ); 
    }
    
    switch(gameType){
      case "slot":
        introText = '歡迎來到拉霸機小遊戲！<br>進入遊戲後點擊螢幕，拉霸機即開始運轉，拉中三個相同的圖案即可獲得該獎項<br>最高為3個永康幣，快來試試手氣吧';
        gameTip = '進入遊戲後點擊螢幕<br>拉霸機即開始運轉<br>按下確認後開始遊戲';
        break;
      case "shooting":
        introText = '歡迎來到射氣球小遊戲！<br>玩家共有10秒的時間，請透過滑鼠或手指點擊螢幕射擊前方的氣球，每個氣球上有代表的分數射擊越多分數越高<br>最高可獲得3個永康幣，快來挑戰看看吧！';
        gameTip = '玩家共有15秒的時間射擊<br>按下確認後即開始遊戲';
        break;
      case "baseballNine":
        introText = '歡迎來到棒球九宮格！<br>玩家手上共有12顆球，請透過滑鼠或手指滑動螢幕丟向前方的九宮格，丟中越多分數越高<br>最高可獲得3個永康幣，快來挑戰看看吧！';
        gameTip = '玩家共有12顆球的機會<br>按下確認後即開始遊戲';
        break;
      case "canKnockdown":
        introText = '歡迎來到丟罐子小遊戲！<br>玩家共有三次機會，請透過滑鼠或手指滑動螢幕丟向前方的罐子，丟倒越多分數越高<br>最高可獲得3個永康幣，快來挑戰看看吧！';
        gameTip = '玩家共有三次機會<br>按下確認後即開始遊戲';
        break;

    }
 
    document.getElementById('gameIntroContainer').innerHTML = introText;
    document.getElementById('gamesGameStartInfo').innerHTML = gameTip;
    
  }

  ////// --------------------------------------------------------------------------------------

  startTodayGame(){

    let currectDate = new Date();
    let m = currectDate.getMonth() + 1;
    let d = currectDate.getDate()  + 0;
    if (m == 12){
      switch( d%4 ){
        case 1:
          //// 13 17 21 25 29 射氣球
          location.href = "/games/shooting.html";
          break;
        case 2:
          //// 10 14 18 22 26 30 丟罐子
          location.href = "/games/canKnockdown.html";
          break;
        case 3:
          //// 7 11 15 19 23 27 31 拉霸機
          location.href = "/games/slot.html";
          break;
        case 0:
          //// 12 16 20 24 28  棒球九宮格
          location.href = "/games/baseballNine.html";
          break;
      }
    }

  }

  showStartGameIntro(){
    //// 顯示標題 遊戲名稱
    let introText , gameTitle;

    let currectDate = new Date();
    let m = currectDate.getMonth() + 1;
    let d = currectDate.getDate()  + 0;
    if (m == 12){
      switch( d%4 ){
        case 1:
          //// 13 17 21 25 29 射氣球
          gameTitle = "射氣球";
          introText = '歡迎來到射氣球小遊戲！玩家共有10秒的時間，請透過滑鼠或手指點擊螢幕射擊前方的氣球，每個氣球上有代表的分數射擊越多分數越高最高可獲得3個永康幣，快來挑戰看看吧！';

          break;
        case 2:
          //// 10 14 18 22 26 30 丟罐子
          gameTitle = "丟罐子";
          introText = '歡迎來到丟罐子小遊戲！玩家共有三次機會，請透過滑鼠或手指滑動螢幕丟向前方的罐子，丟倒越多分數越高，最高可獲得3個永康幣，快來挑戰看看吧！';

          break;
        case 3:
          //// 7 11 15 19 23 27 31 拉霸機
          gameTitle = "拉霸機";
          introText = '歡迎來到拉霸機小遊戲！進入遊戲後點擊螢幕，拉霸機即開始運轉，拉中三個相同的圖案即可獲得該獎項，最高為3個永康幣，快來試試手氣吧';
          
          break;
        case 0:
          //// 12 16 20 24 28  棒球九宮格
          gameTitle = "棒球九宮格";
          introText = '歡迎來到棒球九宮格！<br>玩家手上共有12顆球，請透過滑鼠或手指滑動螢幕丟向前方的九宮格，丟中越多分數越高<br>最高可獲得3個永康幣，快來挑戰看看吧！';

          break;
      }
    }

    //// 『介紹首頁』內容
    gameIntroModalBGTopInfo.innerHTML = gameTitle; // 兩 html 取相同名稱.
    gameIntroModalInfo.innerHTML = introText;
    //// 『兌換區遊戲介紹』內容
    gameIntroModalBGTopInfo.innerHTML = gameTitle;
    gameIntroModalInfo.innerHTML = introText;

  }

  //// 顯示當前所有可兌換的段換券
  showAllCoupons(){

    postData = {
      request: 'get',
      requestItem: 'couponTotal'
    };
    aNetworkAgent.sendPost(postData).then(couponTotal => {
      console.log("prize-list get couponTotal, couponTotal=" , couponTotal );
      
      if (!couponTotal){
        return;
      }
      if (couponTotal.errorMessage){
        return;
      }
      
      // document.getElementById("couponNumber").innerHTML = couponTotal[0].coupon001;
      // document.getElementById("todayLeftCouponsDiv").innerHTML = "今日折價券剩：" + couponTotal[0].coupon001;
      document.getElementById("poolInfoDivText").innerHTML = "活動期間每天可兌換300張15元抵用券，共計發送5000張，今日剩餘" + couponTotal[0].coupon001 +" 張";
      document.getElementById("exchangeModalInfo").innerHTML =  "今日折價券剩餘" + couponTotal[0].coupon001 + "張，請輸入想要兌換的數量（兌換一張折價券需消耗三枚代幣）";
      window.couponNumber = couponTotal[0].coupon001;
    });
  }

  //// 使用代幣購買兌換券，需要更新使用者的『擁有代幣』『擁有折價券』與『兌換券庫數量』
  buyCoupons(){
    console.log("UI.js: _buyCoupons, [wanted, pool]", document.getElementById("inputExchangeText").value , window.couponNumber  );
    
    let currentPoolNumber =  window.couponNumber;
    let buyNumber =  Number(document.getElementById("inputExchangeText").value );

    if (buyNumber <= 0 || Number.isInteger(buyNumber) == false ){
      console.log("請輸入想要兌換的數量");
      document.getElementById("inputExchangeText").value = 0;

      document.getElementById("exchangeModalRetDiv").innerHTML = "請輸入想要兌換的數量";
      return;
    }
    if (buyNumber > currentPoolNumber ){
      console.log("你無法購買超過線上現有兌換券數量");
      document.getElementById("exchangeModalRetDiv").innerHTML = "你無法購買超過線上現有兌換券數量";
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
          //// 更新『線上兌換券數量』
          // document.getElementById("todayLeftCouponsDiv").innerHTML = "今日折價券剩：" + buyRet[0].couponRemain.coupon001;

          let rem = buyRet[0].couponRemain.coupon001;
          // document.getElementById("poolInfoDivText").innerHTML = "目前剩餘" + rem +"/5000，今日可兌換數量剩餘" + rem;
          document.getElementById("poolInfoDivText").innerHTML = "活動期間每天可兌換300張15元抵用券，共計發送5000張，今日剩餘" + rem +" 張";

        }

        if (buyRet[0].status == true){
          //// 購買成功
          document.getElementById("exchangeModalRetDiv").innerHTML = "成功購買了" + buyNumber + "張";
          aUI.showAllCoupons();

          //// 更新使用者『擁有代幣』『擁有折價券』
          postData = {
            ID: localStorage.getItem('userID')+"@"+localStorage.getItem('vendor'), 
            // ID: "test1"+"@"+"google", 
            name: localStorage.getItem('userName'),
            email: "",
            request: 'login',
            requestItem: ''
          };
          aNetworkAgent.sendPost(postData).then(userInfo => {
            console.log("prize-list after _buyCoupons, userInfo=" , userInfo );
            localStorage.setItem("_userInfo" , JSON.stringify(userInfo) );
            aUI.updateUserInfo();
          });

        }else{
          //// 購買失敗，依照各個狀態顯示
          switch(buyRet[0].result){
            case "Sold out!":
              document.getElementById("exchangeModalRetDiv").innerHTML = "今日線上兌換券已經換完";
            break;

            case "Not enough coin!":
              document.getElementById("exchangeModalRetDiv").innerHTML = "您的代幣不足";              
            break;

            default:
              document.getElementById("exchangeModalRetDiv").innerHTML = "等待後端回應";   

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
      let leaderModalTable = document.getElementById("leaderModalTable");
      leaderModalTable.innerHTML = "";

      leaderList.forEach((currentValue, index) => {
        
        let row = document.createElement("div");
        row.className = "rankRow";

        let numeralText = document.createElement("p");
        numeralText.className = "centerP";
        numeralText.style.color = "#F47165";
        numeralText.innerHTML = index+1;

        let nameInfoTextDiv = document.createElement("div");
        let nameInfoNumberDiv = document.createElement("div");

        nameInfoNumberDiv.className = "nameInfoNumberDiv";
        nameInfoNumberDiv.style.overflow = "hidden";
        nameInfoTextDiv.className = "nameInfoTextDiv";

        let nameInfoText = document.createElement("p");
        nameInfoText.className = "centerP";
        nameInfoText.style.color = "#F47165";

        let nameInfoNumber = document.createElement("p");
        nameInfoNumber.className = "centerP";
        nameInfoNumber.style.color = "#F47165";
        nameInfoNumber.innerHTML = currentValue.couponExchanged;;
        nameInfoNumberDiv.appendChild(nameInfoNumber);

        let userName;
        if (currentValue.name == ""){
          userName = "user";
        }else{
          userName = currentValue.name;
        }
        nameInfoText.innerHTML = userName;
        nameInfoTextDiv.appendChild(nameInfoText);


        let numeralDiv = document.createElement("div");
        let nameInfoDiv = document.createElement("div");
        numeralDiv.className = "rankNumeralDiv";
        nameInfoDiv.className = "rankNameInfoDiv";
        nameInfoDiv.style.overflow = "hidden";

        let numeral = new Image();
        numeral.src = "/images/ui/window/ranked/numeral.png";
        numeral.className = "rankNumeralImg";

        let nameInfo = new Image();
        nameInfo.src = "/images/ui/window/ranked/name.png"
        nameInfo.className = "rankNameInfoImg";

        numeralDiv.appendChild(numeral);
        numeralDiv.appendChild(numeralText);
        nameInfoDiv.appendChild(nameInfo);
        nameInfoDiv.appendChild(nameInfoTextDiv);
        nameInfoDiv.appendChild(nameInfoNumberDiv);
        
        row.appendChild(numeralDiv);
        row.appendChild(nameInfoDiv);
        leaderModalTable.appendChild(row);

      });

    });

  }

  //// 顯示用戶本身含有的兌換券
  updateUserInfo() {
    let userInfo = JSON.parse( localStorage.getItem("_userInfo") );
    console.log("UI.js: _updateUserInfo userInfo=" , userInfo );

    if (!userInfo){
      document.getElementById('myCouponDiv').innerHTML = '錯誤, userInfo not exist' ;
      return;
    }
    if (!userInfo[0]){
      document.getElementById('myCouponDiv').innerHTML = '錯誤, userInfo not exist' ;
      return;
    }
    if (userInfo.errorMessage){
      console.log(" _updateUserInfo error ", userInfo.errorMessage );
      document.getElementById('myCouponDiv').innerHTML = '錯誤, ' + userInfo.errorType + ", " + userInfo.errorMessage ;
      return;
    }

    //// 填入擁有代幣
    if (userInfo[0].currentCoins != undefined){
      //// 『兌換首頁』上顯示『永康幣數量』
      document.getElementById("myCoinsNumberInfoP").innerHTML = userInfo[0].currentCoins;
      // document.getElementById("myExchangeNumberInfoP").innerHTML =  userInfo[0].cumulativeCoins ;

      //// 『兌換折價券』上顯示『永康幣數量』
      document.getElementById("exchangeModalMyInfo").innerHTML = "您用有" + userInfo[0].currentCoins + "枚永康幣" ;

    }

    //// 填入電話號碼
    if (userInfo[0].phoneNum != ""){
      document.getElementById("useCouponPhoneInputText").value = userInfo[0].phoneNum;

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
        // document.getElementById("playeDiv").style.opacity = 0.5;
        // document.getElementById("playeDiv").style.pointerEvents = "none";
      }else{
        // document.getElementById("playeDiv").style.opacity = 1.0;
        // document.getElementById("playeDiv").style.pointerEvents = "auto";
      }
    });


    postData = {
      ID: localStorage.getItem('userID')+"@"+localStorage.getItem('vendor'), 
      request: 'get',
      requestItem: 'userCouponList',
    };
    aNetworkAgent.sendPost(postData).then(userCouponList => {
      console.log("_userCouponList = " , userCouponList );

      //// 計算『尚未使用過得兌換券』
      let effectiveCoupon = 0;
      let isFirstTimeExchange = true;
      let couponIDList = [];
      userCouponList.forEach((currentValue, index) => {
        if (currentValue.exchangeDate != ""){
          //// 已經兌換過
          isFirstTimeExchange = false;
        }else{
          effectiveCoupon += 1;
          couponIDList.push(currentValue._id);
        }
      });
      console.log("_updateUserInfo: _couponIDList =  " , effectiveCoupon , couponIDList );
      //// 於『兌換區』顯示『累計抽獎次』
      document.getElementById("myExchangeNumberInfoP").innerHTML =  userCouponList.length - effectiveCoupon;

      //// 於『兌換頁面』顯示『目前代幣數量』
      document.getElementById("myCouponDivInfoNumber").innerHTML = effectiveCoupon ;
      document.getElementById("useCouponModalInfo").innerHTML = "您目前擁有 " + effectiveCoupon + " 張折價券，要使用折價券抵用現金嗎？" ;
      
      //// 於『使用兌換券區域』處理兌換券數量問題。
      let useCouponInputText = document.getElementById("useCouponInputText");
      useCouponInputText.setAttribute("max", effectiveCoupon);
      //// 每當『輸入數量』有變化的時候，檢查是否大於最大允許數量
      document.getElementById("useCouponInputText").onchange = function(){
        console.log(" useCouponInputText onchange: " , document.getElementById("useCouponInputText").value );
        if ( useCouponInputText.value > useCouponInputText.getAttribute("max") ){
          // document.getElementById("inputUseCouponError").innerHTML = "您只有" + effectiveCoupon + "張兌換券"
          // document.getElementById("inputUseCouponError").style.visibility = "visible";

          useCouponInputText.value = useCouponInputText.getAttribute("max");
        }
        if ( Number.isInteger( Number(useCouponInputText.value)) == false ){
          useCouponInputText.value = 0;
        }
      }

      
      document.getElementById("myCouponUseImg").onclick = function(){
        //// 假如『尚未使用過得兌換券』數量為0，則不進入『使用兌換券』的流程
        if (effectiveCoupon == 0){
          // return;
        }
        console.log(" _mycouponDiv click " );

        //// 假如首次『使用兌換券』則跳出『個資說明頁』
        if (isFirstTimeExchange){
          personalIntroModalDiv.style.display = "block";
        };

        //// 每次進入將『錯誤提示』 『兌換成功』給隱藏
        // document.getElementById("inputUseCouponError").style.visibility = "hidden";
        // document.getElementById("exchangeRet").style.display = "none";
        //// 顯示『使用兌換券』的區域
        document.getElementById("useCouponModalDiv").style.display = "block";

        //// 為求統一，確認與取消按鈕都在這裡架構
        document.getElementById("useCouponModalComfirmImg").onclick = function(){
          let password = document.getElementById('useCouponPWDInputText').value;
          if (couponIDList.length == 0){
            console.log(" _couponIDList empty ");
            document.getElementById("useCouponModalRetText").style.color = "red";
            document.getElementById("useCouponModalRetText").innerHTML = "您目前沒有兌換券";
            return;
          }
          if ( useCouponInputText.value == 0 || useCouponInputText.value == "0"  ){
            console.log(" wanted = 0 ");
            document.getElementById("useCouponModalRetText").style.color = "red";
            document.getElementById("useCouponModalRetText").innerHTML = "請輸入您要兌換的數量";
            return;
          }

          if ( Number.isInteger( Number(useCouponInputText.value)) == false  ){
            console.log(" wanted = float ");
            document.getElementById("useCouponModalRetText").style.color = "red";
            document.getElementById("useCouponModalRetText").innerHTML = "請輸入整數";
            return;
          }

          if ( Number( useCouponInputText.value ) > couponIDList.length ){
            console.log(" 想兌換的數量超過擁有的數量 " , useCouponInputText.value , couponIDList.length  );
            document.getElementById("useCouponModalRetText").style.color = "red";
            document.getElementById("useCouponModalRetText").innerHTML = "你只有" + couponIDList.length + "張折價券";
            //// 重設『使用張數』
            useCouponInputText.value = 0;
            return;
          }

          //// 改為前端不檢查密碼長度，都交給後端處理密碼
          // if (password < 1000 || password > 9999 && false ){
          if ( false ){
            console.log(" password error = " , password   );
            document.getElementById("useCouponModalRetText").style.color = "red";
            document.getElementById("useCouponModalRetText").innerHTML = ".密碼錯誤.";
            
          }else {

            //// 複製一份 『有效id陣列』 
            let remainCouponIDList = couponIDList.slice();
            //// 取得『要兌換數量長度的陣列』，並且取出『剩餘陣列』
            let exchangeCouponIDList = remainCouponIDList.splice(0, useCouponInputText.value );

            console.log("1 _couponIDList = " , couponIDList , couponIDList.length , exchangeCouponIDList , exchangeCouponIDList.length , remainCouponIDList , remainCouponIDList.length );

            //// 向後端發送『使用兌換券』事件
            postData = {
              request: 'exchange',
              requestItem: {
                userID: localStorage.getItem('userID')+"@"+localStorage.getItem('vendor') ,
                phoneNum: document.getElementById("useCouponPhoneInputText").value,
                code:password.toString(), 
                _id: exchangeCouponIDList
              }, //// 從最前面的兌換券開始使用，數量按使用者選擇。
            };
            //// 先關閉按鈕事件，以免多次觸發
            useCouponModalComfirmImg.style.pointerEvents = "none";

            aNetworkAgent.sendPost(postData).then(exchangeRet => {
              console.log("exchangeRet = " , exchangeRet , exchangeRet[0].status );
              
              console.log("2 _couponIDList = " , couponIDList , couponIDList.length , exchangeCouponIDList , exchangeCouponIDList.length , remainCouponIDList , remainCouponIDList.length );

              //// 重新開啟按鈕事件
              useCouponModalComfirmImg.style.pointerEvents = "auto";
              if (exchangeRet[0].status == true){
                let currentCouponNumber = remainCouponIDList.length;

                //// 設定『最大使用數量』
                useCouponInputText.setAttribute("max", currentCouponNumber);

                //// 更新『兌換區』顯示的『折價券數量』
                document.getElementById("myCouponDivInfoNumber").innerHTML = currentCouponNumber ;

                //// 更新『使用折價券區』顯示的『目前擁有折價券數量』                
                document.getElementById("useCouponModalInfo").innerHTML = "您目前擁有 " + currentCouponNumber + " 張折價券，要使用折價券抵用現金嗎？" ;
                
                document.getElementById("useCouponModalRetText").style.color = "#F47165";
                document.getElementById("useCouponModalRetText").innerHTML = "成功使用 " + useCouponInputText.value + " 張折價券！"

                //// 重設『使用張數』
                useCouponInputText.value = 0;
                
                //// 重設『有效id陣列』
                couponIDList = remainCouponIDList;

              }else{

                document.getElementById("useCouponModalRetText").style.color = "red";
                switch(exchangeRet[0].result){
                  case "Incorrect code!" :
                    document.getElementById("useCouponModalRetText").innerHTML = "密碼錯誤";
                    break;
                  case "Prize not found!":
                    document.getElementById("useCouponModalRetText").innerHTML = "折價券不存在";
                    break;
                  case "Already exchanged!":
                    document.getElementById("useCouponModalRetText").innerHTML = "折價券已經兌換過";
                    break;
                  
                  default:
                    document.getElementById("useCouponModalRetText").innerHTML = "密碼後端錯誤";
                }

              }
            });

          }

        }
        //// 點擊『取消』離開『使用兌換券』區域
        document.getElementById("useCouponModalCancel").onclick = function(){
          document.getElementById("useCouponModalDiv").style.display = "none";
        }


      }      

    });
   
  }

  showChangeBrowserPage() {
    let os = ['iPhone', 'Android'];
    let browser = ['Safari', 'Chrome'];
    let content1 = ' 用戶請先於選單（箭頭指引處）選擇 ';
    let content2 = ' 瀏覽器進行遊戲'
    let hint = new Image();
    if (navigator.platform === 'iPhone' || navigator.platform === 'iPad') {
      // hint.src = '../images/ios.jpg';
      hint.src = 'https://yongkangfile.s3-ap-northeast-1.amazonaws.com/ARGame/games/images/ui/bg/bg_hoonie_milo_IOS.png';
      hint.alt = os[0] + content1 + browser[0] + content2;
    }
    else {
      // hint.src = '../images/android.jpg';
      hint.src = 'https://yongkangfile.s3-ap-northeast-1.amazonaws.com/ARGame/games/images/ui/bg/bg_hoonie_milo_android.png';
      hint.alt = os[1] + content1 + browser[1] + content2;
    }
    document.body.insertBefore(hint, document.body.children[0]);
  }

  showLoginButton() {
    document.getElementById('before-login').style.display = 'block';
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
    console.log("UI.js: _startPlayingGame ");
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