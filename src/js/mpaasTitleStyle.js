import Vue from 'vue'
import {tokenCheck} from '@/js/tokenCheck.js'
import util from '@/js/utils'

const { MEMBER_ID, TOKEN, USER_TYPE } = Vue.prototype.$constant
const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' })
const token = util.storageAction({ key: TOKEN, action: 'get' })
const userTypes = util.storageAction({ key: USER_TYPE, action: 'get' })

function ready(callback) {
  // 如果 jsbridge 已经注入则直接调用
  if (window.AlipayJSBridge) {
    callback && callback();
  } else {
    // 如果没有注入则监听注入的事件
    document.addEventListener('AlipayJSBridgeReady', callback, false);
  }
}

//设置标题名称和标题背景色
function setTitleNameAndBackgroundColor(titleName,titleBackgroundColor) {
  ready(function() {
    AlipayJSBridge.call('setTitle', {
      title: titleName,
    });
    AlipayJSBridge.call("setTitleColor", {
      color: parseInt(titleBackgroundColor, 16),
      reset: false //（可选，默认为 false） 是否重置 title 颜色为默认颜色。
    });
  });
}

//设置右上角按钮
function setRightButton(rightButtonName,rightButtonColor) {
  ready(function() {
    AlipayJSBridge.call('setOptionMenu', {
      title : rightButtonName,
      redDot : '-1', // -1 表示不显示，0 表示显示红点，1-99 表示在红点上显示的数字
      // color : '#D8A42F', // 必须以＃开始 ARGB 颜色值
      color : rightButtonColor, // 必须以＃开始 ARGB 颜色值
    });
    AlipayJSBridge.call('showOptionMenu');
  });
}
/**
 * 设置右上角按钮
 * @param rightIcon 图片
 * @param rightIconColor 颜色
 * @param count 表示在红点上显示的数字
 */
function setRightButtonIconCount(rightIcon,rightIconColor,count) {
  ready(function() {
    AlipayJSBridge.call('setOptionMenu', {
      icon : rightIcon,
      redDot : count, // -1 表示不显示，0 表示显示红点，1-99 表示在红点上显示的数字
      color : rightIconColor, // 必须以＃开始 ARGB 颜色值
    });
    AlipayJSBridge.call('postNotification', {
      name:'messageViewInit',
      data:{}
    }, function (result) {
    });
    AlipayJSBridge.call('showOptionMenu');
  });
}
/**
 * 设置右上角按钮
 * @param rightIcon 图片
 * @param rightIconColor 颜色
 */
function setRightButtonIcon(rightIcon,rightIconColor) {
  ready(function() {
    AlipayJSBridge.call('setOptionMenu', {
      icon : rightIcon,
      redDot : '-1', // -1 表示不显示，0 表示显示红点，1-99 表示在红点上显示的数字
      color : rightIconColor, // 必须以＃开始 ARGB 颜色值
    });
    AlipayJSBridge.call('postNotification', {
      name:'messageViewInit',
      data:{}
    }, function (result) {
    });
    AlipayJSBridge.call('showOptionMenu');
  });
}

//展示或移除右上角未读消息通知提示
function showRightUnreceivedButton(newMessage) {
  ready(function() {
    if(newMessage){
      document.addEventListener('new_message_received', newMessageReceived);
    }else{
      document.removeEventListener('new_message_received', newMessageReceived);
    }
  });
}

function newMessageReceived(e) {
  /*AlipayJSBridge.call('setOptionMenu', {
    icon:'https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png',
    redDot : '0', // -1 表示不显示，0 表示显示红点，1-99 表示在红点上显示的数字
    color : '#D8A42F', // 必须以＃开始 ARGB 颜色值
  });*/
  setTimeout(function(){
    getMessagesAndNoticeAndAtivityCount();
  },3000)
  AlipayJSBridge.call('showOptionMenu');
}

function backButtonListener(backButtonWatch,callback) {
  ready(function () {
    if(backButtonWatch){
      document.addEventListener('back', callback,false);
    }else{
      document.removeEventListener('back', callback,false);
    }
  })
}


//展示右上角测试按钮，4.0版本需要，其余不需要
function showRightTestButton(rightIcon,rightIconColor,count) {
  ready(function() {
    var u = navigator.userAgent;
    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      window.AlipayJSBridge && AlipayJSBridge.call('setOptionMenu', {
        menus:[{
          icon: rightIcon,
          redDot : count, // -1 表示不显示，0 表示显示红点，1-99 表示在红点上显示的数字
          color : rightIconColor, // 必须以＃开始 ARGB 颜色值
        },
          {
            //icon: rightIcon,
            title:"测试",
            redDot : '-1',
            color:'#FF0000'
          }],override: true}, null
      );
    }else {
      //安卓 多个按钮时，只显示左边第一个icon的redDot
      window.AlipayJSBridge && AlipayJSBridge.call('setOptionMenu', {
        menus:[{
          icon: rightIcon,
          redDot : count, // -1 表示不显示，0 表示显示红点，1-99 表示在红点上显示的数字
          color : rightIconColor, // 必须以＃开始 ARGB 颜色值
        },
          {
            //icon: rightIcon,
            title:"测试",
            redDot : count,
            color:'#FF0000'
          }],override: true}, null
      );
    }

    AlipayJSBridge.call('postNotification', {
      name:'messageViewInit',
      data:{}
    }, function (result) {
    });
    AlipayJSBridge.call('showOptionMenu');
  });
}

//隐藏右上角按钮
function hideOptionMenu() {
  ready(function() {
    AlipayJSBridge.call('hideOptionMenu');
  });
}

//监听右上角按钮页面跳转路径或移除该方法
function eventListenerRoute(addRemove,callback) {
  ready(function() {
    if(addRemove){
      document.addEventListener('optionMenu', callback, false);
    }else{
      document.removeEventListener('optionMenu', callback, false);
    }
  });
}

//显示或隐藏左上角返回按钮
function setBackButtonState(state) {
  // window.AlipayJSBridge && AlipayJSBridge.call('setBackButtonHidden', {'hidden':state}, function(data){
  //   // alert('回调结果' + JSON.stringify(data));
  // });
  if (state) {
    window.AlipayJSBridge && AlipayJSBridge.call('hideBackButton',function (data) {
      // alert('回调结果' + JSON.stringify(data));
    });
  } else{
    window.AlipayJSBridge && AlipayJSBridge.call('showBackButton',function (data) {
      // alert('回调结果' + JSON.stringify(data));
    });
  }
}

//显示或隐藏左上角关闭按钮
function showOrHideCloseButton(state) {
  //以下接口不存在
  // if(state){
  //   window.AlipayJSBridge && AlipayJSBridge.call('showCloseButton',function (data) {
  //     alert('显示或隐藏左上角关闭按钮回调结果' + JSON.stringify(data));
  //   });
  // }else{
  //   window.AlipayJSBridge && AlipayJSBridge.call('hideCloseButton',function (data) {
  //     alert('显示或隐藏左上角关闭按钮回调结果' + JSON.stringify(data));
  //   });
  // }
}
//侦听返回事件跳转到某个自定义路径
function EventListenerBack(url) {
  // 注意：如果自定义了 back，并使用了 location.href 去跳到指定的地址，需要包装一个 setTimeout 以保证不会阻塞客户端线程。
  document.addEventListener('back', function(e) {
    e.preventDefault();
    setTimeout(function() {
      location.href = url;
    }, 10);
  }, false);
}
//点击标题事件选取区域项目
function clickTitleEvent(clickTitle,callback) {
  ready(function() {
    if(clickTitle){
      document.addEventListener('titleClick', callback, false);
    }else{
      document.removeEventListener('titleClick', callback, false);
    }
  });
}

//数据集成
function integration(projectName){

}

//判断网络状态
function networkStartType(res){
  if(res.error!=undefined&&res.error==4){
    if(util.storageAction({ key: 'networkConnectionType', action: 'get'})<1){
      util.storageAction({ key: 'networkConnectionType', action: 'set', value: 1})
      if(window.confirm(res.errorMessage)){
        return true;
      }else{
        return false;
      }
    }
    return
  }else if(res.error!=undefined&&res.error==11){//网络请求超时
    if(util.storageAction({ key: 'networkConnectionType', action: 'get'})<1){
      util.storageAction({ key: 'networkConnectionType', action: 'set', value: 1})
      if(window.confirm(res.errorMessage)){
        return true;
      }else{
        return false;
      }
    }
    return
  }
};
//判断网络状态是否连接
function networkConnectionStartType(){
  ready(function(){
    window.AlipayJSBridge && AlipayJSBridge.call('getNetworkType', function(data){
      if(data.status==0){
        if(util.storageAction({ key: 'networkConnectionType', action: 'get'})<1){
          util.storageAction({ key: 'networkConnectionType', action: 'set', value: 1 })
          uni.showToast({
            title: '当前网络无链接',
            icon: 'none',
          }) 
        }
      }else {
        util.storageAction({ key: 'networkConnectionType', action: 'set', value: 0 })
        // return true;
      }
      return true;
    });
  });
}


/**
 * 获取系统消息,公告，活动邀请统计
 */
function getMessagesAndNoticeAndAtivityCount(){
  let systemMessageUnread = 0,//系统消息未读消息
    rightButtonTest = true;//是否开启右上角测试按钮，展示右上角测试按钮，4.0版本需要，其余不需要，IOS特需要
  ready(function() {
    let params = [{
      "_requestBody":{
        "current":'1',
        "size":'100',
        "fortType":'2',
        'type':'2,3,10,17,18',
        "memberId": memberId,
        "isRead": 0
      }
    }];
    setRightButtonIconCount("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F");
    let operationType = 'message.mqtt.template.getMessages';
    AlipayJSBridge.call('rpc', {
      operationType: operationType,
      requestData: params,
      headers:{
        "token": token
      }
    }, function (res) {
      if(res.token_code=='-1'||res.token_code=='-2'){
        tokenCheck(res.token_code,res.code);
        return
      }
      if(res.status === 200){
        systemMessageUnread+=res.data.records.length;
        ready(function() {
          let messageParams1 = [{
            "current":1,
            "_requestBody":{
              "msgType":5,
              "sendType":2,
              "toUserId": memberId,
              "isRead": 0
            },
            "size":100
          }];
          let operationType = 'message.page.client.owner';

          AlipayJSBridge.call('rpc', {
            operationType: operationType,
            requestData: messageParams1,
            headers:{
              "token": token
            }
          }, function (res) {
            if(res.token_code=='-1'||res.token_code=='-2'){
              tokenCheck(res.token_code,res.code);
              return
            };
            if (res.status === "200") {
             // alert(res.data.records.length)
              if(userTypes != '游客'){
                systemMessageUnread+=res.data.records.length;
              }
              //统计活动消息
              ready(function() {
                let activityParams = [{
                  "_requestBody":{
                    "current":1,
                    "size":100,
                    "fortType":2,
                    'type':6,
                    "memberId": memberId,
                    "isRead":0,
                  }
                }];
                let operationType = 'message.mqtt.template.getMessages';

                AlipayJSBridge.call('rpc', {
                  operationType: operationType,
                  requestData: activityParams,
                  headers:{
                    "token": token
                  }
                }, function (res) {
                  if(res.token_code=='-1'||res.token_code=='-2'){
                    tokenCheck(res.token_code,res.code);
                    return
                  }
                  if(res.status === 200){
                    systemMessageUnread+=res.data.records.length;
                    hideOptionMenu();
                    if (systemMessageUnread > 0){

                      if (rightButtonTest) {
                        //显示测试按钮
                        showRightTestButton("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F",systemMessageUnread);
                        showRightUnreceivedButton(true);
                      }else {
                        //显示右上角消息，数量显示
                        setRightButtonIconCount("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F",systemMessageUnread);
                        showRightUnreceivedButton(true);
                      }
                    }else {
                      if (rightButtonTest) {
                        //显示测试按钮
                        showRightTestButton("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F");
                        showRightUnreceivedButton(true);
                      }else {
                        //显示右上角消息
                        setRightButtonIcon("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F");
                        showRightUnreceivedButton(true);
                      }
                    }
                  }else {
                    setRightButtonIcon("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F");
                  }
                });
              })
            }else{
              setRightButtonIcon("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F");
            }
          })
        });
      }else{
        setRightButtonIcon("https://mcube-prod.oss-cn-hangzhou.aliyuncs.com/CC995DB131638_ebeitech/images/message_icon.png", "#D8A42F");
      }
    });
  })
}

//判断当前网络类型
function getNetworkType() {
  var ua = navigator.userAgent;
  var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
  networkStr = networkStr.toLowerCase().replace('nettype/', '');
  var networkType;
  switch(networkStr) {
    case 'wifi':
      networkType = 'Wi-Fi';
      break;
    case '4g':
      networkType = '4G';
      break;
    case '3g':
      networkType = '3G';
      break;
    case '3gnet':
      networkType = '3G';
      break;
    case '2g':
      networkType = '2G';
      break;
    default:
      networkType = 'other';
  }
  return networkType;
}
function getType(obj){
  let type  = typeof obj;
  if(type != "object"){
    return type;
  }
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');
}
//前端规则报错或接口请求报错
function errorReport(isMpaas, pageTitle, errorMessage, interfaceName, res) {//interfaceName 解释为接口名/错误代码，res解释为接口返回/错误原因
  var internetType = getNetworkType();
  var failureCode = "", failureReason = "";
  if(!!res){
    // alert(JSON.stringify(res))
    if(!isMpaas){                                     //非Mpaas网关
      failureCode = res.errCode;
      if(res.errCode && res.msg){                     //非Mpaas网关      状态码不是200情况
        failureReason = res.msg;
      }else{                                          //非Mpaas网关      状态码是200情况(接口连接成功)
        failureReason = res.message;
      }
    }else{                                            //Mpaas网关
      if(!!res.errCode && !!res.msg){
        failureReason = res.msg;
        failureCode = res.errCode;
      }else{                                          //Mpaas网关      状态码不是200情况
        if(res.error == 6004){
          failureCode = "6004";
          failureReason = "将 RPC 参数转换为后端 HTTP 请求参数时发生异常。";
        }else if(res.error == 6666){
          failureCode = "6666";
          failureReason = "RPC-业务抛出异常(后端系统返回 HTTP status code 不等于200，当前httpcode:" + res.errorMessage.substr(res.errorMessage.length - 3) + ")";
        }else{
          if (!!res.status){
            failureCode = res.status;
            failureReason = res.message;
          }else if (!!res.resultCode){
            failureCode = res.resultCode;
            failureReason = res.resultDesc;
          } else if (!!res.error) {
            failureCode = res.error;
            failureReason = res.errorMessage;
          }else {
            failureCode = '7002';
            failureReason = JSON.stringify(res);
          }
        }
      }
    }
  }else {
    failureCode = "7001";
    failureReason = "点击事件提醒";
    interfaceName =  !!interfaceName ? interfaceName : '页面提示框弹出'
  }
  if (isNaN(failureCode)){
    failureReason += failureCode
    failureCode = "7004";
  }
console.error('title='+pageTitle+'errorMsg='+errorMessage+'name='+internetType+'failCode='+failureCode+'fail_reas='+failureReason)
}
//前端规则报错或接口请求报错
function errorReportAlert(pageTitle, errorMessage, failureCode,failureReason) {//interfaceName 解释为接口名/错误代码，res解释为接口返回/错误原因
  var internetType = getNetworkType();
  console.error('title='+pageTitle+'errorMsg='+errorMessage+'name='+internetType+'failCode='+failureCode+'fail_reas='+failureReason)
}

//测试
function test11() {
  console.log('11111111111111111111',memberId)
  // uni.showToast({
  //   title: '成功提示',
  //   icon: 'none',
  // })  
}

export {
  ready,
  setTitleNameAndBackgroundColor,
  setRightButton,
  setRightButtonIcon,
  setRightButtonIconCount,
  showRightUnreceivedButton,
  showRightTestButton,
  hideOptionMenu,
  eventListenerRoute,
  setBackButtonState,
  showOrHideCloseButton,
  backButtonListener,
  clickTitleEvent,
  getMessagesAndNoticeAndAtivityCount,
  networkStartType,
  EventListenerBack,
  integration,
  networkConnectionStartType,
  getNetworkType,
  errorReport,
  errorReportAlert,
  test11
}
