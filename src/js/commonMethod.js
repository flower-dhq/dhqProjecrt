import Vue from 'vue'
import NP from 'number-precision'
import webSocket from '@/socket'
import sha1 from 'sha1'
import utils from '@/js/utils';
import commLogic from '@/js/comm-logic';
const { storageAction } = utils;
const { getProjectConfig, toAuth} = commLogic

export default {
  getProjectConfig,
  getUserStatusInfo() {
    const { USER_INFO } = Vue.prototype.$constant
    const userInfo = Vue.prototype.$cmMth.storageAction({ key: USER_INFO, action: 'get' })
    //const userInfo = {"id":"b0f1593c-2335-424c-a1c9-8efa8a57d3ac","createDate":"2021-06-08T10:37:18.000+0800","operaDate":null,"state":1,"updateDate":null,"accountType":null,"fhhMemberId":null,"fullName":null,"headimg":"https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132","isAssociation":null,"isUnsubscribe":null,"nickname":"微信用户","parentAccount":null,"phoneNumber":'13268214337',"points":null,"source":null,"unionID":"otb9o1Pb7u0UPiqtFqqDQXGFjt7k","unsubscribeDate":null,"authDate":null,"firstAuthDate":null,"creator":"applet_login","updater":null,"password":null,"sex":null,"isFirstRegist":null,"projectId":null,"birthDay":null,"idCardNo":null,"tagCode":null,"locationCode":null,"memberNo":null,"alia":null,"memberGradeId":null,"tagJson":null,"companyId":null,"memberCard":null,"memberId":"b0f1593c-2335-424c-a1c9-8efa8a57d3ac","memberPhoto":"https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132","memberName":"微信用户","memberPhone": "13268214337","openId":"ocW5X42y2uNb0lPLSni1Zm2gKoko"}
    return !userInfo ? {} : userInfo
  },
  // 节流
  throttle() {
    let lastTime = 0
    return (callback, delay) => {
      const newTime = new Date().getTime()
      if (lastTime === 0) {
        lastTime = newTime
        callback && callback()
      } else if (newTime - lastTime > delay) {
        lastTime = newTime
        callback && callback()
      }
    }
  },
  // 节流1，猜猜这两的区别在哪，是不是发现多个1查找时候不方便
  throttle1(fn, wait = 1000) {
    let timeout
    return function () {
      let ctx = this
      let args = arguments

      if (!timeout) {
        args = Array.from(args)
        fn.apply(ctx, args)
        timeout = setTimeout(() => {
          timeout = null
        }, wait)
      }
    }
  },
  // 格式化时间
  formatDate(params) {
    const valueString = typeof params.value === 'string' ? params.value.replace(/-/g, '/') : params.value
    let Y, M, D, h, m, s
    let date =
      params.type === 'd2s'
        ? new Date(valueString).getTime()
        : params.type === 's2d'
        ? new Date(valueString)
        : params.type === 'd2d'
        ? new Date(new Date(valueString).getTime())
        : new Date()
    if (params.type === 'd2s') return date
    Y = date.getFullYear()
    M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return params.format === 'YY-MM-DD'
      ? `${Y}-${M}-${D}`
      : params.format === 'YY-MM-DD h:m'
      ? `${Y}-${M}-${D} ${h}:${m}`
      : params.format === 'h:m'
      ? `${h}:${m}`
      : `${Y}-${M}-${D} ${h}:${m}:${s}`
  },
  // 操作storage
  storageAction,
  // 参数编码
  queryCoding(params) {
    const { action, value } = params
    let query = ''
    try {
      query =
        action === 'coding'
          ? encodeURIComponent(JSON.stringify(value))
          : action === 'decoding'
          ? JSON.parse(decodeURIComponent(value))
          : ''
    } catch (err) {}
    return query
  },
  // 格式金额小数点
  formatSum(params = {}) {
    const { value, type } = params
    const sum = value || 0
    const sumStr = String(sum)
    const hasDecimal = sumStr.includes('.')
    const [int, flt] = sumStr.split('.')
    if (hasDecimal) {
      const [one, two] = flt || []
      const t = !Number.isNaN(Number(two)) && Number(two) > 0 ? two : '0'
      const o = two || (!Number.isNaN(Number(one)) && Number(one) > 0) ? one : '0'
      return type === 'UpperCamelCase' ? { int: int, flt: `.${o}${t}` } : Number(`${int}.${o}${t}`)
    } else {
      return type === 'UpperCamelCase' ? { int: int, flt: '.00' } : sum
    }
  },
  // 精度
  precision: {
    // 加
    plus() {
      const [...ars] = arguments
      return this.decimals(NP.plus(...ars), 2)
    },
    // 减
    minus() {
      const [...ars] = arguments
      return this.decimals(NP.minus(...ars), 2)
    },
    // 乘
    times() {
      const [...ars] = arguments
      return this.decimals(NP.times(...ars), 2)
    },
    // 除
    divide() {
      const [...ars] = arguments
      return this.decimals(NP.divide(...ars), 2)
    },
    // 取几位小数点
    decimals(val, several) {
      const isNum = !Number.isNaN(Number(val))
      if (isNum && typeof several === 'number' && several > 0) {
        const [int, flt] = String(val).split('.')
        return Number(`${int}${flt === undefined ? `` : `.${flt.substr(0, several)}`}`)
      } else {
        return val
      }
    },
    // 原生对象
    proto() {
      return NP
    }
  },
  // 检测是否授权
  checkAuth() {
    const userInfo = this.getUserStatusInfo()
    const isExist = !!Object.keys(userInfo).length
    if (!isExist) {
      this.toAuth()
      return isExist
    } else {
      //短信验证配置:1、需要绑定，2、不需要绑定
      if (userInfo.sendFlag == 1) {
        const hasPhoneNumber = !!userInfo.phoneNumber
        if (!hasPhoneNumber) this.toSetPhone()
        return hasPhoneNumber
      } else {
        return isExist
      }
    }
  },
  // 跳转绑定手机号码页面
  toSetPhone() {
    uni.navigateTo({ url: `/pages-mall-a/authorization/binding-phone` })
  },
  // 是否微信浏览
  isWeixin() {
    const ua = navigator.userAgent.toLowerCase()
    return ua.indexOf('micromessenger') != -1
  },
  // 跳转对应授权页
  toAuth,
  /**
   * 获取路由参数信息，和扫小程序码获取参数信息
   * @example 写法 'name=coupon&id=11456' 或者 'coupon&123456'。
   * 最后转换成 { name: 'coupon', id: '11456' } 或者 { 0: 'coupon', 1: '11456' }
   * @param {object} option onLoad返回的参数
   * @param  {string[]} params 需要获取路由参数的参数名
   * @example "/pages-mall/index?id=123&type=3"
   * getRouteParams(option, "id", "type", "count") // { id: "123", type: "3" }
   */
  getRouteParams(option, ...params) {
    let sceneTmp = {}
    if (option.scene) {
      // 扫小程序码获取参数，写法 option = { scene: 'name=coupon&id=11456' }
      sceneTmp = decodeURIComponent(option.scene)
        .split('&')
        .map((item, index) => {
          let arr = item.split('=')

          if (arr.length === 2 && arr[0]) {
            // 写法 'name=coupon&id=11456'
            return { key: arr[0], value: arr[1] }
          } else if (arr.length === 2 && !arr[0]) {
            // 写法 '=coupon&=123456'
            return { key: index, value: arr[1] }
          } else if (arr.length === 1) {
            // 写法 'coupon&123456'
            return { key: index, value: arr[0] }
          } else {
            return undefined
          }
        })
        .reduce((store, item) => {
          if (!item) return store

          store[item.key] = item.value
          return store
        }, {})
    }

    let optionTmp = {
      ...option,
      ...sceneTmp
    }
    let query = params.reduce((pre, val) => {
      if (val in optionTmp) {
        pre[val] = decodeURIComponent(optionTmp[val])
      }

      return pre
    }, {})

    return query
  },
  // 获取运行平台
  getTerminalPlatformArg(params) {
    // H5=h5，MP=公众号，APP=APP，APPLET=小程序，PC=WEB端后台",
    let platform = ''

    /* #ifdef H5  */
    const isWeixin = this.isWeixin()
    platform = isWeixin ? 'MP' : 'H5'
    /* #endif */

    /* #ifdef MP  */
    platform = 'APPLET'
    /* #endif */

    /* #ifdef APP-PLUS  */
    platform = 'APP'
    /* #endif */

    return { platform }
  },
  // 是否app(webview)
  isWebViewApp() {
    return false
  },
  // 浏览器是安卓还是苹果
  browser() {
    var u = navigator.userAgent,
      app = navigator.appVersion
    var android = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
    var ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
    return { android, ios }
  },
  // 格式商品销量
  formatSaleCount(params) {
    const countStr = String(params)
    if (params < 10000) {
      return params
    } else {
      return Number(countStr[0]) * Math.pow(10, countStr.length - 5) + 'w+'
    }
  },
  // 获取socket信息
  getSocekt(params) {
    const { id } = params
    const sockets = Vue.prototype.$sockets
    return (sockets && sockets[id]) || null
  },
  // 初始化socket
  initSocket(params) {
    const { url, socketId } = params
    const options = { url }
    const hasTheSocekt = this.getSocekt({ id: socketId })
    let socket = null
    if (hasTheSocekt) {
      socket = Vue.prototype.$sockets[socketId]
    } else {
      socket = { obj: new webSocket(options) }
      Vue.prototype.$sockets[socketId] = socket
    }
    return socket
  },
  // 断开socket连接
  closeSocket() {
    const sockets = Vue.prototype.$sockets
    for (let sk in sockets) {
      if (sk.obj && sk.obj.aciton) {
        sk.obj.aciton({ acitonName: 'close' })
      }
    }
    Vue.prototype.$sockets = {}
  },
  // 监听页面卸载前
  onBeforeunload() {
    const { platform } = this.getTerminalPlatformArg()
    if (platform === 'H5' || platform === 'MP') {
      window.onbeforeunload = (e) => {
        this.closeSocket()
      }
    }
  },
  // 获取用户签名信息
  getSignatureInfo() {
    const { projectType } = Vue.prototype.$cmMth.getProjectConfig()
    const pathParams = `/${projectType}`
    return Vue.prototype.$mallApi.data.getMpAppIdById({ pathParams }).then((res) => {
      if (res.statusCode === 200) {
        return res.data
      }
    })
  },
  // jWeixin-1.6.0权限配置
  async jWeixinAuthConfig(jsApiList = [], openTagList = []) {
    const info = await this.getSignatureInfo()
    const { appId, timestamp, nonceStr, jsTicket } = info
    const signature = sha1(
      `jsapi_ticket=${jsTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${location.origin + location.pathname}`
    )

    jWeixin.config({
      debug: false,
      appId, // 公众号的唯一标识
      timestamp, // 生成签名的时间戳
      nonceStr, // 生成签名的随机串
      signature, // 签名
      jsApiList, // 需要使用的JS接口列表
      openTagList // 标签
    })
    return new Promise((resove, reject) => {
      jWeixin.ready(() => {
        resove({ success: true })
      })
      jWeixin.error((err) => {
        reject(err)
      })
    })
  },
  // 获取商城配置的默认项目
  setDefaultProject2local() {
    // 初始化加载，没设置过项目取接口返回项目
    const { PROJECT_INFO } = Vue.prototype.$constant
    // const data = Vue.prototype.$cmMth.storageAction({key: PROJECT_INFO, action: 'get'});
    // if (data) return Promise.resolve()
    return Vue.prototype.$mallApi.data
      .getConfigByCode({ pathParams: '/HomeDefaultProject', hideLoading: true })
      .then((res) => {
        if (res.statusCode == 200) {
          return res.data || {}
          // const {configName, configDesc} = res.data || {}
          // const noPJIF = !Vue.prototype.$cmMth.storageAction({key: PROJECT_INFO, action: 'get'}); // 若本地设置过，则不覆盖
          // const canSet = configName && configDesc && noPJIF
          // if (canSet) {
          // 	Vue.prototype.$cmMth.storageAction({key: PROJECT_INFO, action: 'set', value: {projectId: configDesc, projectName: configName}});
          // }
        }
      })
  }
}
