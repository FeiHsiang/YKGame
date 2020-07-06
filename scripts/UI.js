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
    document.getElementById('account-info').textContent = `Hello ${userName}. ${userID}`;
  }

  showAllUserPrize(myJson) {
    myJson[0].forEach((currentValue, index) => {
      let oneRowData = document.createElement('div');
      let imgDiv = document.createElement('div');
      let prizeBtn = new Image();
      prizeBtn.src = '/images/button-' + myJson[1][index].prizeLevel + '.png';
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
      imgDiv.appendChild(prizeBtn);
      oneRowData.appendChild(imgDiv);
      document.getElementById('user-prize-list').appendChild(oneRowData);
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
}