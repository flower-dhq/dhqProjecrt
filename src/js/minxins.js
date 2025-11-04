import commLogic from '@/js/comm-logic';
import constant from '@/js/constant';
import utils from '@/js/utils';
const { storageAction } = utils;
const { M_TOKEN, X_APPLET_ID} = constant;

// 非必要，不要写全局 minxin！！！

// 主题皮肤(全局)
export const ThemeSkin = {
  data() {
    return {
      THEME_CSS_VAR: {}, // 主题css变量
      THEME_NAME: '', // 主题类名
      THEME_COLOR: '', // 主题色
      MINI_BAR:{}, //页面顶部导航栏渐变色，需要动态设置导航栏占据的高度
    };
  },
  methods: {
    // 更新主题数据状态
    updateGlobalTheme() {
      const themeData = commLogic.getThemeData();
      Object.assign(this, themeData);

      return themeData;
    },
  },
  created() {
    this.updateGlobalTheme();
  },
};


// 原先商城的mixins

export const commonMx = {
  data() {
    return {
      navigationUrl: {},
    };
  },
  methods: {
    // 页面跳转
    pageNav(params) {
      const { navKey } = params;
      const url = this.navigationUrl[navKey];
      if (url)
        uni.navigateTo({
          url,
        });
    },
  },
};

// 用户授权
export const userAuth = {
  data() {
    return {};
  },
  methods: {
    // 获取平台
    getPlatform() {
      let platform = '';

      /* #ifdef H5  */
      platform = 'H5';
      /* #endif */

      /* #ifdef MP-WEIXIN  */
      platform = 'MP-WEIXIN';
      /* #endif */

      /* #ifdef APP-PLUS  */
      platform = 'APP-PLUS';
      /* #endif */

      return platform;
    },
    // 微信公众号上的微信授权登录
    async wechatAuth(params) {
      await this.getMpAppIdById().catch();
      const { OA_APP_ID: configAppId } = this.$appConfig;
      const { OA_APP_ID } = this.$constant;
      const { call } = params || {};
      const [prefix] = window.location.href.split('#');
      const pages = getCurrentPages();
      const localAppId = this.$cmMth.storageAction({ key: OA_APP_ID, action: 'get' });
      const appId = localAppId || configAppId || '';
      const currentPage = pages[pages.length - 1];
      const lastPage = pages[pages.length - 2];
      let redirectPage = (call === 'h5-auth' && lastPage && lastPage.__page__.fullPath) || currentPage.__page__.fullPath;
      redirectPage = redirectPage.startsWith('/') ? redirectPage : `/${redirectPage}`;
      redirectPage = JSON.stringify({ url: redirectPage });
      const redirectUri = `${prefix}getAuthCode.html?page=${encodeURIComponent(redirectPage)}`;
      const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=code`;
      const isWeixin = this.$cmMth.isWeixin();
      if (isWeixin) window.location.replace(url);
    },
    // 用户授权
    apiUserAuth(params) {
      const { platform } = this.$cmMth.getTerminalPlatformArg();
      params.equipment = platform;
      return this.$mallApi.data.userAuth({ data: params, loadingText: '授权中' }).then((res) => {
        let returnData = null;
        if (res.statusCode === 200) {
          const { token } = res.data;
          this.$cmMth.storageAction({ action: 'set', key: M_TOKEN, value: token });
          returnData = res.data || null;
        } else {
          this.clearLocalUserInfo();
        }
        return returnData;
      });
    },
    // 微信公众号，根据 '/xAppletId' 获取到微信公众号的配置信息，包括 appId，jsTicket 等
    getMpAppIdById() {
      const { OA_APP_ID } = this.$constant;
      const { projectType } = this.$cmMth.getProjectConfig();
      const pathParams = `/${projectType}`;

      return this.$mallApi.data.getMpAppIdById({ pathParams, loadingText: '获取配置信息...' }).then((res) => {
        if (res.statusCode === 200) {
          const { appId, jsTicket, nonceStr, timestamp } = res.data || {};
          if (appId) this.$cmMth.storageAction({ key: OA_APP_ID, action: 'set', value: appId });
        }
      });
    },
    // 获取本地/app传参的项目信息
    getLocalProjectInfo(params) {
      const { appPjId, appPjNm, options } = params || {};
      const { ON_SIDE_PJ_ID, ON_SIDE_PJ_NM, PROJECT_INFO } = this.$constant;
      const fromApp = appPjId && appPjNm;
      const projectId = fromApp ? appPjId : this.$cmMth.storageAction({ key: ON_SIDE_PJ_ID, action: 'get' });
      const projectName = fromApp ? appPjNm : this.$cmMth.storageAction({ key: ON_SIDE_PJ_NM, action: 'get' });
      const localProjectInfo = this.$cmMth.storageAction({ key: PROJECT_INFO, action: 'get' });
      const validPjIf = projectId && projectName;
      if (validPjIf && options && !localProjectInfo) this.$cmMth.storageAction({ key: PROJECT_INFO, action: 'set', value: { projectId, projectName } });
    },
    // 清除token、用户信息
    clearLocalUserInfo() {
      const { USER_INFO, PROJECT_INFO } = this.$constant;
      this.$cmMth.storageAction({ key: M_TOKEN, action: 'remove' });
      this.$cmMth.storageAction({ key: USER_INFO, action: 'remove' });
      this.$cmMth.storageAction({ key: PROJECT_INFO, action: 'remove' });
    },
  },
};

// 支付
export const paymentMx = {
  data() {
    return {};
  },
  methods: {
    // 其他渠道支付
    otherPay(params) {
      let { payInfo, tradeType, payChannel, payOrderSn, payType } = params;
      if (tradeType == 'jsapi') {
        ['ebeipay', 'swiftpass'].includes(payChannel) ? this.wxJsH5Pay(params) : (window.location.href = payInfo);
      } else if (tradeType === 'app') {
        let paymentTmp = [];
        try {
          paymentTmp = JSON.parse(payOrderSn);
        } catch (error) {
          paymentTmp = [];
        }
        // payType 被选中的支付方式，paymentTmp 代码配置的不同项目支持的支付方式
        if (paymentTmp.includes('union') && payType === 'wx') {
          // 唤起小程序的银联支付
          this.wxApplet(params);
        } else {
          // 唤起微信APP或支付宝APP的支付
          this.alipay(params);
        }
      }
    },
    // 微信jsapi支付
    wxJsH5Pay(params) {
      const { payInfo = '{}', payOrderSn, fromCall } = params || {};
      const payArg = JSON.parse(payInfo);
      function onBridgeReady() {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          {
            appId: payArg.appId,
            timeStamp: payArg.timeStamp,
            nonceStr: payArg.nonceStr,
            package: payArg.package,
            signType: payArg.signType,
            paySign: payArg.paySign,
          },
          (res) => {
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              uni.navigateTo({ url: `/pages-mall-a/order/pay-result?paySn=${payOrderSn}` });
            } else if (fromCall && fromCall === 'confirmOrder') {
              uni.redirectTo({
                url: `/pages-mall-a/order/list?orderStatus=0`,
              });
            }
          }
        );
      }
      if (typeof WeixinJSBridge == 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
      } else {
        onBridgeReady();
      }
    },
    // 支付宝支付
    alipay(params) {
      let { payInfo, tradeType, type, payOrderSn, payType, payChannel } = params;
      try {
        payInfo = payType === 'wx' ? payInfo : 'alipayqr://platformapi/startapp?saId=10000007&clientVersion=3.7.0.0718&qrcode=' + payInfo;
        window.EbeiPlugins.payByApp(
          payType === 'wx' ? '1' : '2',
          payInfo,
          payChannel, // 1 微信 2支付宝
          (success) => {
            this.submitting = false;
            uni.navigateTo({ url: `/pages-mall-a/order/pay-result?paySn=${payOrderSn}` });
          },
          (failure) => {
            this.submitting = false;
            const appName = payType === 'wx' ? '微信' : payType === 'zfb' ? '支付宝' : '支付软件';
            uni.showToast({
              title: '无法打开' + appName + '，请确认是否安装' + appName,
              duration: 2000,
              icon: 'none',
            });
          }
        );
      } catch (e) {
        this.submitting = false;
        this.toastTips({ message: e });
      }
    },
    // 微信小程序
    wxApplet(params) {
      const { PAY_ORIGINAL_ID } = this.$appConfig;
      const { payInfo, payOrderSn } = params || {};
      if (window.EbeiPlugins) {
        // 小程序支付版本wxPaymentVersion：  1:粤澳支付版本，2：通用小程序支付版本
        window.EbeiPlugins.launchWechatMP(
          {
            userName: PAY_ORIGINAL_ID, //小程序原始id
            path: `pages/WeChatPay/WeChatPay?wxPaymentVersion=2&params=${payInfo}`, //小程序页面路径
            type: '0', //小程序版本 0 1 2 分别是 正式 开发 体验
            extMsg: '',
          },
          (success) => {
            this.submitting = false;
            uni.navigateTo({ url: `/pages-mall-a/order/pay-result?paySn=${payOrderSn}` });
          },
          (failure) => {
            this.submitting = false;
            this.toastTips({ message: '小程序支付跳转失败' });
          }
        );
      } else {
        this.submitting = false;
      }
    },
    // 获取h5支付结果页面
    getPayResultPage(params) {
      const {} = params || {};
      const href = window.location.href;
      const [prefix] = href.split('#');
      const xAppletId = storageAction({key: X_APPLET_ID, action: 'get'});
      return `${prefix}payResult.html?t=${String(Math.random()).substr(2, 3)}&xAppletId=${xAppletId}`;
    },
    // 积分支付
    integralPay(params) {
      const { paySn } = params || {};
      uni.navigateTo({ url: `/pages-mall-a/order/pay-result?paySn=${paySn}` });
    },
    // 是否app(webview)
    isWebViewApp() {
      return false;
    },
    // 选择支付方式(公众号H5或小程序)
    choosePayWayWechat(params) {
      const { callPage } = params || {};
      return new Promise((resolve) => {
        this.$refs['action-sheet'].open({
          list: [
            {
              label: '请选择支付方式',
              disabled: true,
              size: '26rpx',
            },
            {
              label: '线下支付',
            },
            {
              label: '微信支付',
            },
          ],
          callback: ({ action }) => {
            if (callPage === 'pay-order' || callPage === 'order-detail') {
              this.payWay = {
                label: action === 1 ? '线下支付' : '微信支付',
                code: action === 1 ? 'offline' : 'wx',
              };
            }
            resolve({ value: action });
          },
        });
      });
    },
    // 选择支付方式(app/公众号/小程序)
    choosePayWay(params) {
      const isMini = process.env.VUE_APP_PLATFORM === 'mp-weixin';
      const isZGH = process.env.VUE_APP_PLATFORM === 'h5';
      if (this.isSupportOfflinePay && (isMini || isZGH)) {
        //公众号或小程序并且有线下支付方式
        this.choosePayWayWechat(params);
      }
      const { callPage } = params || {};
      const paywayArrowShow = this.paywayArrowShow();
      if (paywayArrowShow) {
        return new Promise((resolve) => {
          let selectList = [
            {
              label: '请选择支付方式',
              disabled: true,
              size: '26rpx',
            },
            {
              label: '支付宝',
            },
            {
              label: '微信支付',
            },
          ];
          if (this.isSupportOfflinePay) {
            //当app的该商品有线下支付
            selectList.push({
              label: '线下支付',
            });
          }
          this.$refs['action-sheet'].open({
            list: selectList,
            callback: ({ action }) => {
              if (callPage === 'pay-order' || callPage === 'order-detail') {
                this.payWay = {
                  label: action === 2 ? '微信支付' : action === 3 ? '线下支付' : '支付宝',
                  code: action === 2 ? 'wx' : action === 3 ? 'offline' : 'zfb',
                };
              }
              resolve({ value: action });
            },
          });
        });
      } else {
        Promise.resolve();
      }
    },
    // toast提示
    toastTips(params) {
      const { message, position, duration } = params;
      const toastRef = this.$refs['toast'];
      if (toastRef) {
        toastRef.open({
          message,
          position: position || 'middle',
          duration: duration || 2000,
        });
      }
    },
    // 支付方式右箭头
    paywayArrowShow() {
      const isWebViewApp = this.isWebViewApp();
      return isWebViewApp ? true : false;
    },
    // 设置支付宝为首选
    setAlipayWay() {
      const isWebViewApp = this.isWebViewApp();
      if (isWebViewApp) {
        this.payWay = {
          label: '支付宝',
          code: 'zfb',
        };
      }
    },
    // 设置选中支付方式
    setSelectedPayWay(params) {
      const { payType } = params || {};
      const isWebViewApp = this.isWebViewApp();
      if (isWebViewApp) {
        const payWay = [
          {
            label: '支付宝',
            code: 'zfb',
          },
          {
            label: '微信支付',
            code: 'wx',
          },
        ];
        const index = payWay.findIndex((item) => item.code === payType);
        if (index !== -1) {
          this.payWay = payWay[index];
        } else {
          this.payWay = {
            label: '微信支付',
            code: 'wx',
          };
        }
      }
    },
  },
};

// 广告跳转
export const advertJumpMx = {
  methods: {
    advertJump(params) {
      console.log(params);
      const { linkType, url, advertUrl } = params || {};
      const isWebViewApp = this.$cmMth.isWebViewApp();
      let isH5 = false;
      /* #ifdef H5  */
      isH5 = true;
      /* #endif */
      if (linkType === 2) {
        // 外部链接
        if (isH5 && (window.EbeiPlugins || isWebViewApp)) return window.EbeiPlugins.outUrlView(advertUrl);
        isH5 ? window.open(advertUrl) : uni.navigateTo({ url: '/pages-mall-b/web-view/web-view?url=' + advertUrl });
      } else {
        uni.navigateTo({ url: advertUrl });
      }
    },
  },
};

// 订单优惠券
export const orderCoupon = {
  data() {
    return {};
  },
  methods: {
    // 获取查询参数
    getQueryArs() {
      const list = this.orderList;
      const queryList = [];
      const precision = this.$cmMth.precision;
      list.forEach((item) => {
        const { shopId, goodsList } = item;
        Array.isArray(goodsList) &&
          goodsList.forEach((gd) => {
            const { specId, buyNumber, price } = gd;
            const qry = {
              sellerId: shopId,
              specId,
              numbers: buyNumber,
              amount: precision.times(price.value, buyNumber, 100),
            };
            queryList.push(qry);
          });
      });
      return { data: queryList, hideLoading: true };
    },
    // 获取优惠券列表
    getDataList() {
      const canUseCoupopList = this.canUseCoupop || [];
      const unUseCoupopList = this.unUseCoupop || [];
      const emptyList = canUseCoupopList.length === 0 && unUseCoupopList.length === 0;
      const testPms = new Promise((resolve) => {
        setTimeout(() => {
          const list = [
            {
              id: '1',
              title: '苹果耳机优惠券1',
              couponVal: parseInt(Math.random() * (120 - 10) + 10),
              couponDesc: '满200减100',
              limitUse: '限苹果商店全店',
              effectiveDate: '2021-09-20 23:59:59',
              useEndTime: '2021-12-01',
              canUse: true,
              checked: false,
              superposition: false,
            },
            {
              id: '2',
              title: '苹果耳机优惠券2',
              couponVal: parseInt(Math.random() * (120 - 10) + 10),
              couponDesc: '满200减100',
              limitUse: '限苹果商店全店',
              effectiveDate: '2021-09-20 23:59:59',
              useEndTime: '2021-12-01',
              canUse: true,
              checked: false,
              superposition: false,
            },
            {
              id: '3',
              title: '耳机优惠券3',
              couponVal: parseInt(Math.random() * (180 - 10) + 10),
              couponDesc: '满200减100',
              limitUse: '限苹果商店全店',
              effectiveDate: '2021-09-20 23:59:59',
              useEndTime: '2021-12-01',
              canUse: true,
              checked: false,
              superposition: true,
              rejectIds: ['5', '6'],
            },
            {
              id: '4',
              title: '苹果优惠券4',
              couponVal: parseInt(Math.random() * (120 - 10) + 10),
              couponDesc: '满200减100',
              limitUse: '限苹果商店全店',
              effectiveDate: '2021-09-20 23:59:59',
              useEndTime: '2021-12-01',
              canUse: true,
              checked: false,
              superposition: true,
            },
            {
              id: '5',
              title: '手机优惠券5',
              couponVal: parseInt(Math.random() * (120 - 10) + 10),
              couponDesc: '满200减100',
              limitUse: '限苹果商店全店',
              effectiveDate: '2021-09-20 23:59:59',
              useEndTime: '2021-12-01',
              canUse: true,
              checked: false,
              superposition: true,
              rejectIds: ['3'],
            },
            {
              id: '6',
              title: '鼠标优惠券6',
              couponVal: parseInt(Math.random() * (120 - 10) + 10),
              couponDesc: '满200减100',
              limitUse: '限苹果商店全店',
              effectiveDate: '2021-09-20 23:59:59',
              useEndTime: '2021-12-01',
              canUse: true,
              checked: false,
              superposition: true,
              rejectIds: ['3'],
            },
          ];
          const canUseCp = [];
          list.forEach((item) => {
            if (item.canUse) {
              canUseCp.push(item);
            }
          });
          // 找出不可叠加最大优惠金额
          function maxNotSuperposition() {
            const notSuperpositionList = [];
            let max = 0,
              id = '';
            canUseCp.forEach((item) => {
              if (!item.superposition) {
                notSuperpositionList.push(item);
              }
            });
            if (notSuperpositionList.length) {
              let cp = notSuperpositionList[0];
              (max = cp.couponVal), (id = cp.id);
              for (let i = 1, ilen = notSuperpositionList.length; i < ilen; i++) {
                cp = notSuperpositionList[i];
                if (cp.couponVal > max && !cp.superposition) {
                  max = cp.couponVal;
                  id = cp.id;
                }
              }
            }
            return { max, id };
          }
          // 累计可叠加优惠金额
          function superpositionTotalizer() {
            let sum = 0;
            canUseCp.forEach((item) => {
              if (item.superposition) sum += item.couponVal;
            });
            return sum;
          }
          const { max, id } = maxNotSuperposition();
          const superpositionSum = superpositionTotalizer();
          // 若不可叠>可叠加，则默认勾上不可叠加
          if (max > superpositionSum) {
            list.some((item) => {
              if (item.id === id) {
                item.checked = true;
                return true;
              }
            });
          } else {
            const checkedSpsnCp = [];
            list.forEach((item) => {
              const isRej = checkedSpsnCp.some((itm) => Array.isArray(itm.rejectIds) && itm.rejectIds.includes(item.id));
              if (!isRej && item.superposition) {
                item.checked = true;
                checkedSpsnCp.push(item);
              }
            });
          }
          resolve({ statusCode: 200, data: { available: list, unAvailable: [] } });
        }, 100);
      });
      if (!emptyList) return Promise.resolve({});
      const queryArs = this.getQueryArs();
      const pmsProd = this.$mallApi.data.getUsableCoupon(queryArs);
      const pms = pmsProd;
      this.loading = true;
      this.canUseCoupop = [];
      this.unUseCoupop = [];
      return pms
        .then((res) => {
          this.loading = false;
          const cacheCanUseCoupop = this.cacheCanUseCoupop;
          if (res.statusCode === 200) {
            const available = Array.isArray(res.data.available) ? res.data.available : [];
            const unAvailable = Array.isArray(res.data.unAvailable) ? res.data.unAvailable : [];
            const precision = this.$cmMth.precision;
            const assignValue = (listKey, data) => {
              data.forEach((item) => {
                // couponType 1 2满x元减y元 3 4 满x件减y折扣
                const { infoId, couponName, couponDesc, relationName, couponValue, effectiveDate, isStack, couponType, isCheck } = item;
                const isDiscount = couponType === 3 || couponType === 4;
                const couponVal = isDiscount ? `${couponValue / 10}折` : precision.divide(couponValue, 100);
                const d = {
                  ...item,
                  id: infoId,
                  title: couponName,
                  couponVal,
                  couponDesc,
                  limitUse: relationName || '',
                  effectiveDate,
                  checked: !!isCheck,
                  superposition: isStack == 1,
                  isDiscount,
                };
                this[listKey].push(d);
              });
            };
            assignValue('canUseCoupop', available);
            assignValue('unUseCoupop', unAvailable);
            if (cacheCanUseCoupop) this.cacheCanUseCoupop = JSON.stringify(this.canUseCoupop);
          }
          return res.data || {};
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    // 确认优惠券使用
    confirmCouponUseing(params) {
      const { whoCall, init } = params || {};
      const cacheCanUseCoupop = this.cacheCanUseCoupop;
      const canUseCoupop = this.canUseCoupop.filter((item) => item.checked);
      if (canUseCoupop.length === 0) {
        this.popupShow = false;
        canUseCoupop.forEach((item) => {
          item.checked = false;
        });
        if (!whoCall) {
          if (cacheCanUseCoupop) this.cacheCanUseCoupop = JSON.stringify(this.canUseCoupop);
          this.$emit('cpConfirmUsing', {
            couponIdList: [],
            goodsList: [],
          });
        }
        return Promise.resolve();
      }
      const args = ((_) => {
        const goodsList = this.getQueryArs().data || [];
        const couponIdList = [];
        canUseCoupop.forEach((item) => {
          couponIdList.push(item.id);
        });
        return { data: { goodsList, couponIdList }, hideLoading: true };
      })();
      this.loading = true;
      return this.$mallApi.data
        .useCoupon(args)
        .then((res) => {
          this.loading = false;
          if (res.statusCode === 200) {
            this.popupShow = false;
            whoCall === 'payOrder' ? this.cpConfirmUsing(res.data) : this.$emit('cpConfirmUsing', res.data);
            this.updateCheckboxState({ couponIdList: res.data.couponIdList, toast: !init });
            if (cacheCanUseCoupop) this.cacheCanUseCoupop = JSON.stringify(this.canUseCoupop);
          } else {
          }
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    // 优惠券使用计算后更新checkbox状态
    updateCheckboxState(params = {}) {
      const { couponIdList, toast } = params;
      this.canUseCoupop.forEach((item) => {
        const { id } = item;
        item.checked = couponIdList.includes(id);
      });
      if (toast)
        uni.showToast({
          title: '已为您自动计算最佳优惠',
          icon: 'none',
        });
    },
  },
};
