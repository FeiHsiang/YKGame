# 85 度 C 專案

## 開啟開發模式服務

    ssh release_webMR
    cd facebook-login-test/
    http-server -p 8080 > http-server.log &

## 開發模式檔案部署

    cd ~/Sites/facebook-login-test/
    rsync -avzh --exclude '.git/' ~/Sites/facebook-login-test/ release_webMR:~/facebook-login-test/

## 使用者需求

請參考 `smb://MiflyDesign/全體人員共享/1-1_專案(外部)/P10900885度C/美食達人-附件1(含建議尺寸)pptx.pptx`

## 相關文件

[Google Sign-In for Websites](https://developers.google.com/identity/sign-in/web)

[搭配 JavaScript SDK 的網頁版「Facebook 登入」](https://developers.facebook.com/docs/facebook-login/web)