import Vue from 'vue';
import commonMethod from "./commonMethod.js"
const { PAYMENT, PAY_ORIGINAL_ID} = Vue.prototype.$appConfig
let paymentTmp = PAYMENT || {}


/**
 * 支付必填参数
 * @param {object} params
 * @param [string] params.orderId 订单id
 * @param {string} params.payUserId 用户id
 * @param {string} params.tradeType 支付方式，默认APP方式
 * @param {string} params.payType 支付类型，默认微信
 * @param {number} params.payAmount 支付金额，单位分，默认1分钱
 * @returns {object} res
 */
function payParams(params = {}) {
  let res = {
    orderId: params.orderId || '',
    payUserId: params.payUserId || '',
    tradeType: params.tradeType || 'app',
    payType: params.payType || 'wx',
    payAmount: typeof params.payAmount !== 'number' ? 1 : params.payAmount
  }

  // 如果是第一次下单，则不需要orderId；如果是再次支付，则需要orderId
  if (!res.orderId) Reflect.deleteProperty(res, 'orderId')

  return res
}

/**
 * 发起线下支付
 * @param [string] orderId 订单id
 * @param {number} payAmount 订单金额，单位分
 * @returns {object} res
 */
 function submitByOffline(orderId = '', payAmount = 1) {
  const { openId } = commonMethod.getUserStatusInfo()
  const { memberId } = commonMethod.getUserStatusInfo()
  return payParams({
    orderId,
    payUserId: openId || memberId,
    tradeType:"offline",
    payType: 'offline',
    payAmount
  })
}

/**
 * 发起微信支付
 * @param [string] orderId 订单id
 * @param {number} payAmount 订单金额，单位分
 * @returns {object} res
 */
function submitByWX(orderId = '', payAmount = 1) {
  let tradeType = paymentTmp['wx']
  if (tradeType === 'mini2') {
    /**
     * 在之前，微信支付分为：微信银联小程序支付mini，公司自己的微信小程序支付app，微信APP支付app，微信公众号支付jsapi
     * 在之后，微信银联小程序支付已废弃，为了区分公司自己的小程序支付和微信APP支付的tradeType，前端会把微信的mini2转为app
     */
    tradeType = 'app'
  }

  const { openId } = commonMethod.getUserStatusInfo()
  const { memberId } = commonMethod.getUserStatusInfo()
  return payParams({
    orderId,
    payUserId: openId || memberId,
    tradeType,
    payType: 'wx',
    payAmount
  })
}

/**
 * 发起支付宝支付
 * @param {string} orderId 订单id
 * @param {number} payAmount 订单金额，单位分
 * @returns {object} res
 */
function submitByZFB(orderId = '', payAmount = 1) {
  const tradeType = paymentTmp['zfb']
  const { openId } = commonMethod.getUserStatusInfo()
  const { memberId } = commonMethod.getUserStatusInfo()
  return payParams({
    orderId,
    payUserId: openId || memberId,
    tradeType,
    payType: 'zfb',
    payAmount
  })
}

/**
 * 用于商城APP上，发起微信APP支付，微信银联小程序支付
 * @param {object} params
 * @param {string} params.payInfo
 * @param {string} params.payChannel 支付渠道
 * @param {string} params.payOrderSn
 * @returns {Promise<object>} { success }
 */
function wxPayByAPP(params = {}) {
  return new Promise(resolve => {
    if (!(window?.EbeiPlugins?.payByApp)) {
      uni.showToast({
        title: `缺少EbeiPlugins.payByApp`,
        duration: 2000,
        icon: 'none'
      })
      resolve({ success: false })
      return
    }

    window.EbeiPlugins.payByApp('1', params.payInfo, params.payChannel, success => {
      resolve({ success: true, data: 'success' })
    }, error => {
      uni.showToast({
        title: `无法打开微信，请确认是否安装微信`,
        duration: 2000,
        icon: 'none'
      })

      resolve({ success: false })
    })
  })
}

/**
 * 用于商城APP上，发起公司自己的微信小程序支付
 * @param {object} params
 * @param {string} params.payInfo
 * @param {string} params.payOrderSn
 */
function wxMiniPayByApp(params = {}) {
  return new Promise(resolve => {
    if (!(window?.EbeiPlugins?.launchWechatMP)) {
      uni.showToast({
        title: `缺少EbeiPlugins.launchWechatMP`,
        duration: 2000,
        icon: 'none'
      })
      resolve({ success: false })
      return
    }

    window.EbeiPlugins.launchWechatMP({
      userName: PAY_ORIGINAL_ID, // 公司自己的微信小程序的原始id
      path: `pages/WeChatPay/WeChatPay?wxPaymentVersion=2&params=${params.payInfo}`,
      type: '0', // 0表示小程序正式版本
      extMsg: ''
    }, success => {
      resolve({ success: true, data: 'success' })
    }, error => {
      uni.showToast({
        title: '微信小程序支付跳转失败',
        duration: 2000,
        icon: 'none'
      })

      resolve({ success: false })
    })
  })
}

/**
 * 用于商城APP上，发起支付宝APP支付，支付宝银联小程序支付
 * @param {object} params
 * @param {string} params.payInfo
 * @param {string} params.payChannel 支付渠道
 * @param {string} params.payOrderSn
 * @returns {Promise<object>} { success }
 */
function zfbPayByAPP(params = {}) {
  return new Promise(resolve => {
    if (!(window?.EbeiPlugins?.payByApp)) {
      uni.showToast({
        title: `缺少EbeiPlugins.payByApp`,
        duration: 2000,
        icon: 'none'
      })

      resolve({ success: false })
      return
    }

    const payInfo = paymentTmp['zfb'] === 'mini' ? params.payInfo : `alipayqr://platformapi/startapp?saId=10000007&clientVersion=3.7.0.0718&qrcode=${params.payInfo}`
    window.EbeiPlugins.payByApp('2', payInfo, params.payChannel, success => {
      resolve({ success: true, data: 'success' })
    }, error => {
      uni.showToast({
        title: `无法打开支付宝，请确认是否安装支付宝`,
        duration: 2000,
        icon: 'none'
      })

      resolve({ success: false })
    })
  })
}

/**
 * 用于商城公众号上，发起微信jsapi支付
 * @param {object} params
 * @param {string} params.payInfo 有可能是对象的字符串，或者是链接的字符串
 * @returns {Promise<object>} { success, data }
 * data: 'success', 跳转到支付结果页面；data: 'cancel'，跳转到订单列表页面
 */
function wxPayByGZH(params = {}) {
  return new Promise(resolve => {
    const infoTmp = params.payInfo
    if (/^http/.test(infoTmp)) {
      // 是链接，则直接跳转
      location.href = infoTmp
      resolve({ success: false }) // 这里并不是支付失败的意思，而是不做任何操作的意思
    } else {
      // 二代微信支付方式
      if(params.payChannel == 'spdpay'){
        const payArg = JSON.parse(params.payInfo)
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
             "appId":payArg.appId,     //公众号ID，由商户传入     
             "timeStamp":payArg.timeStamp,         //时间戳，自1970年以来的秒数     
             "nonceStr":payArg.nonceStr, //随机串     
             "package":payArg.package,     
             "signType":payArg.signType,         //微信签名方式：     
             "paySign":payArg.paySign //微信签名 
          },
          function(res){
          if(res.err_msg == "get_brand_wcpay_request:ok" ){
            resolve({ success: true, data: 'success' })
          // 使用以上方式判断前端返回,微信团队郑重提示：
                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          }else{
            resolve({ success: true, data: 'cancel' })
          }
       }); 
      }else{
        // 是对象，调用微信jsapi方式
        commonMethod.jWeixinAuthConfig(['chooseWXPay']).then(() => {
          jWeixin.ready(() => {
            const payArg = JSON.parse(params.payInfo)
            jWeixin.chooseWXPay({
              timestamp: payArg.timeStamp,
              nonceStr: payArg.nonceStr,
              package: payArg.package,
              signType: payArg.signType,
              paySign: payArg.paySign,
              success: () => {
                resolve({ success: true, data: 'success' })
              },
              cancel: () => {
                resolve({ success: true, data: 'cancel' })
              }
            })
          })
        }).catch(err => {
          uni.showToast({
            title: err,
            duration: 2000,
            icon: 'none'
          })
    
          resolve({ success: false })
        })
      }
    }
  })
}

/**
 * 用于商城小程序上，发起微信支付
 * @param {object} params
 * @param {string} params.payInfo
 * @returns {Promise<object>} { success }
 */
function wxPayByMini(params = {}) {
  const payArg = JSON.parse(params.payInfo)
  return new Promise(resolve => {
    uni.getProvider({
      service: 'payment',
      success: ({provider}) => {
        uni.requestPayment({
          provider,
          timeStamp: payArg.timeStamp,
          nonceStr: payArg.nonceStr,
          package: payArg.package,
          signType: payArg.signType,
          paySign: payArg.paySign,
          success: () => {
            resolve({ success: true, data: 'success' })
          },
          fail: err => {
            uni.showToast({
              title: err.errMsg,
              duration: 2000,
              icon: 'none'
            })

            resolve({ success: false })
          }
        })
      }
    })
  })
}

/**
 * 根据 平台和环境配置 信息，统一发起支付
 * @param {string} payType 支付类型，['wx', 'zfb']
 * @param {object} params
 * @param {string} params.payChannel 支付渠道
 * @returns {Promise<object>} { success, data }
 * data: 'success', 跳转到支付结果页面；data: 'cancel'，跳转到订单列表页面
 */
function wxPayAll(payType, params = {}) {
  const isApp = commonMethod.isWebViewApp()
  const isMini = process.env.VUE_APP_PLATFORM === 'mp-weixin'
  const isZGH = process.env.VUE_APP_PLATFORM === 'h5'

  if (isMini) {
    // 微信小程序
    return wxPayByMini(params)
  } else if (isZGH && !isApp) {
    return wxPayByGZH(params)
  } else if (isZGH && isApp) {
    // APP
    const isChinaums = params.payChannel === 'chinaums' // 银联支付改为接口返回判断
    if (payType === 'wx' && isChinaums) {
      return wxMiniPayByApp(params)
    } else if (payType === 'wx' && !isChinaums) {
      // paymentTmp['wx'] === 'app' 或 paymentTmp['wx'] === 'mini'
      return wxPayByAPP(params)
    } else if (payType === 'zfb') {
      return zfbPayByAPP(params)
    } else {
      return Promise({ success: false })
    }
  } else {
    return Promise({ success: false })
  }
}

/**
 * 支付完成后，跳转到支付页面，或者其他页面
 * @param {string} payOrderSn
 */
function payToResultPage(payOrderSn) {
  uni.navigateTo({ url: `/pages-mall-a/order/pay-result?paySn=${payOrderSn}` })
}

/**
 * @example
 * 支付流程：
 * 1、通过[submitByWX, submitByZFB]获取支付参数；
 * 2、调用下单接口 "/api-gateway/mall-order-service/app/order/order-pay"；
 * 3、返回的参数，用于去调用[wxPayByAPP, zfbPayByAPP, wxPayByGZH, wxPayByMini]发起支付；
 * 4、支付成功后，通过[payToResultPage]跳转到支付结果页面。
 */
export default {
  submitByWX,
  submitByZFB,
  submitByOffline,
  wxPayByAPP,
  wxMiniPayByApp,
  zfbPayByAPP,
  wxPayByGZH,
  wxPayByMini,
  wxPayAll,
  payToResultPage
}