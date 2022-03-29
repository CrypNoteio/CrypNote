
import OnlyMessage from '../../assets/js/onlyMsgbox.js'
import store from '../../store'
export const getCurrentTime = () => {
  var date = new Date();
  var year = date.getFullYear(); 
  var month = date.getMonth() + 1; 
  var day = date.getDate(); 
  var hours = date.getHours(); 
  var minutes = date.getMinutes(); 
  var seconds = date.getSeconds(); 
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }

  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }

  if (hours >= 0 && hours <= 9) {
    hours = "0" + hours;
  }

  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }

  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }

  var currentFormatDate =
    year +
    "-" +
    month +
    "-" +
    day +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return currentFormatDate;
};
export const getTime = (time) => {
 var date = new Date(parseInt(time) * 1000);
  var year = date.getFullYear();
  var mon = date.getMonth() + 1;
  var day = date.getDate();
  var h = date.getHours();
  var mm = date.getMinutes();
   var s = date.getSeconds();
  if (mon >= 1 && mon <= 9) {
    mon = "0" + mon;
  }

  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  if (h >= 0 && h <= 9) {
    h = "0" + h;
  }

  if (mm >= 0 && mm <= 9) {
    mm = "0" + mm;
  }

  if (s >= 0 && s <= 9) {
    s = "0" + s;
  }
  return year + "/" + mon + "/" + day + "/" + " " + h + ":" + mm + ":" + s;
 };

export const getQueryVariable = (variable) => {
   
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
          var pair = vars[i].split("=");
          if(pair[0] == variable){return pair[1];}
  }
  return(false);
       
}

export const VerifyOperationPermissions = () => {
  const initAddress = store.state.userInfo?.walletAddress;
  const currentAddress = store.state.walletAddr;
  let flag = true;
  if (!initAddress) {
    OnlyMessage.error(
      "Do not have the right to operate, please connect your wallet first."
    );
    flag = false;
  } else
  if (currentAddress.toLowerCase() !== initAddress.toLowerCase()) {
    OnlyMessage.error(`Please switch wallets to ${initAddress}`);

    flag = false;
    
  }
  return flag;
}

export const  setCookie = (name, value, exdays) =>{
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    //d.setTime(d.getTime() + ( 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = name + "=" + value + "; " + expires +";SameSite = none; Secure; path=/";
}
export const getCookie = (name) =>{
  let ret, m;
  if (typeof name === 'string' && name !== '') {
    if ((m = String(document.cookie).match(
      new RegExp('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)')))) {
      ret = m[1] ? decodeURIComponent(m[1]) : ''
    }
  }
  return ret
}
export const getUserUrlType = (walletAddr, call=(data)=>{}) => {
  let urlArr = window.location.href.split('/');
  let data = {
      host:'',
      type:0
  };
  urlArr.forEach(function(item){
      if(item.indexOf('.crypnote.io') != -1){
          data.host = item.substring(0,item.indexOf('.crypnote.io'))
          if(data.host.indexOf('.') != -1){
              data.type = 2
          }else{
              data.type = 1
          }
      }
  })
  if(walletAddr && !data.host){
      data.host = walletAddr;
      data.type = 0
  }
  return call(data)
}

export const getUserUrl = (articleId,urls,data) => {
  let resurl = 'https://';
  if(data){
      if(data.type == 0){
          resurl += 'w2e.wiki/' + data.host + '/' + articleId
      }else if(data.type == 1 || data.type == 2){
          resurl += data.host + '.w2e.wiki/' + articleId
      }
  }else{
      if(urls.definedHost){
          resurl += urls.definedHost + '.w2e.wiki/' + articleId
      }else if(urls.nameservice){
          resurl += urls.nameservice + '.w2e.wiki/' + articleId
      }else if(urls.walletAddress){
          resurl += 'w2e.wiki/' + urls.walletAddress + '/' + articleId
      }else{
          resurl = false
      }
  }
  return resurl;
}
