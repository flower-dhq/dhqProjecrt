// 后取用户信息
export function getLocalUserInfo () {   
  console.log(3,window.EbeiPlugins,uni.getStorageSync('userId'))
  if(!window.EbeiPlugins && !uni.getStorageSync('userId')){
    uni.redirectTo({
      url: '/pages/login'
    });
     return;
  } 
  if(!window.EbeiPlugins) return new Promise((resolve, reject) => {
    resolve({isNOLogin:true})
  });
  return new Promise((resolve, reject) => {
    console.log('native: getLocalUserInfo');
    window.EbeiPlugins.getLocalUserInfo(
      result => {
        console.log('native: getLocalUserInfo='+JSON.stringify(result));
        resolve(result)
      },
      error => {
          uni.showModal({
              title: '提示',
              content: '登录失败，请退出',
              success: function (res) {
                  if (res.confirm) {
                      console.log('用户点击确定');
                  } else if (res.cancel) {
                      console.log('用户点击取消');
                  }
              }
          });
         reject(error)
      }
    )
  })
}