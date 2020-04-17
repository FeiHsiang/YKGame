import {checkLoginState, fbLogin, fbLogout} from './api-facebook.js';

let getStatus = document.getElementById('get-status');
let login = document.getElementById('login');
let logout = document.getElementById('logout');

getStatus.addEventListener('click', checkLoginState, false);

login.addEventListener('click', fbLogin, false);

logout.addEventListener('click', fbLogout, false);