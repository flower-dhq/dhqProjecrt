// let token=localStorage.getItem("token");
// if(token_code==){}
export const tokenCheck=(token_code,code,callback)=>{
  if (localStorage.getItem("tokenPase") < 1) {
    localStorage.setItem("tokenPase", 1);
    if(token_code==-1){
      window.AlipayJSBridge && AlipayJSBridge.call('alert', {title: '提示',
        message: '参数校验失败，请确认请求来源',
        button: '确定',
      }, function(data){
        window.AlipayJSBridge && AlipayJSBridge.call('logout', {}, function(data){
        });
      });
    }else if(token_code==-2){
      let useRefreshToken = false;
      if(useRefreshToken){
        haveTokenRefresh((data) => {
          const {isAuthUser,token,userTypes,supremePosition} = data;
          localStorage.setItem("token", token);
          localStorage.setItem("isAssociation", isAuthUser);
          localStorage.setItem("isAuthUser",isAuthUser);
          localStorage.setItem("userTypes",userTypes);
          localStorage.setItem("supremePosition",supremePosition);
          callback && callback();
        },() =>{
          window.AlipayJSBridge && AlipayJSBridge.call('alert', {title: '提示',
            message: '您的授权信息已变更，请重新登录',
            button: '确定',
          }, function(data){
            window.AlipayJSBridge && AlipayJSBridge.call('logout', {}, function(data){
            });

          });
        })
      }else{
        window.AlipayJSBridge && AlipayJSBridge.call('alert', {title: '提示',
          message: '您的授权信息已变更，请重新登录',
          button: '确定',
        }, function(data){
          window.AlipayJSBridge && AlipayJSBridge.call('logout', {}, function(data){
          });

        });
      }
    }
  }
};

/**
 * 判断app支持refreshToken的插件，主要是无法保证终端用户一定会升级到最新版本的app
 * @param trueCallbackFunc 支持时，对应的回调
 * @param falseCallbackFunc 不支持时，对应的回调。
 */
export const haveTokenRefresh = (trueCallbackFunc,falseCallbackFunc) => {
  window.AlipayJSBridge && AlipayJSBridge.call('refreshToken',{},(res) =>{
    const { resultCode,data,message,error,errorMessage} = res;
    if(resultCode == '0'){
      trueCallbackFunc && trueCallbackFunc(data);
    }else if(error == 1 && message && message.indexOf('not implemented') != -1){//android提示这个
      falseCallbackFunc && falseCallbackFunc();
    }else if(error == 1 && errorMessage && errorMessage.indexOf('接口不存在') != -1){//ios的报错
      falseCallbackFunc && falseCallbackFunc();
    }
  });
};

export const refreshToken = (callback) => {
  window.AlipayJSBridge && AlipayJSBridge.call('refreshToken',{},(res) =>{
    const {resultCode,data,message} =res;
    if(resultCode == '0'){
      const {isAuthUser,token,userTypes,supremePosition} = data;
      localStorage.setItem("token", token);
      localStorage.setItem("isAssociation", isAuthUser);
      localStorage.setItem("isAuthUser",isAuthUser);
      localStorage.setItem("userTypes",userTypes);
      localStorage.setItem("supremePosition",supremePosition);
      callback && callback();
    }
  });
};


