import {fbLogin, fbRevokePermission, fbShare} from './api-facebook.js';

let login = document.getElementById('login');
let logout = document.getElementById('logout');
let share = document.getElementById('share');

login.addEventListener('click', () => {
  fbLogin(login, logout);
}, false);

logout.addEventListener('click', () => {
  fbRevokePermission(login, logout);
}, false);

share.addEventListener('click', fbShare, false);