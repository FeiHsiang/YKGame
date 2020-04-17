# 開啟服務

    ssh release_webMR
    cd facebook-login-test/
    http-server -p 8080 > http-server.log &

# 檔案部署

    cd ~/Sites/facebook-login-test/
    rsync -avzh --exclude '.git/' . release_webMR:~/facebook-login-test/