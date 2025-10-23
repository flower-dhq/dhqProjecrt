const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const formatNowDate = function(date){
  /**
   * 获取当前时间
   */
  var year = date.getFullYear(); //年
  var month = date.getMonth() + 1; //月
  var day = date.getDate(); //日
  var hh = date.getHours(); //时
  var mm = date.getMinutes(); //分
  var ss = date.getSeconds(); //秒

  var clock = year + "-";

  if(month < 10)
    clock += "0";

  clock += month + "-";

  if(day < 10)
    clock += "0";

  clock += day + " ";

  if(hh < 10)
    clock += "0";

  clock += hh + ":";
  if(mm < 10) clock += '0';
  clock += mm + ":";

  if(ss < 10) clock += '0';
  clock += ss;
  return clock;
}

const UUID = function(){
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}


module.exports = {
  formatTime,
  formatNowDate,
  UUID,
}
