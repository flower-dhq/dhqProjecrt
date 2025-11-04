<template>
  <view class="mine">
    <view class="bgi" :style="{'background-image': `url(${backgroundImge})`}"></view>
    <view class="content-wrap common-width">
      <!-- 设置/消息 -->
      <view class="top-area">
        <image @tap="pageClick({funKey: 'setting'})" src="/pages-mall/static/mine/setting.png" mode="aspectFill"></image>
        <view class="bell-msg" @tap="pageClick({ funKey: 'systemMessage' })">
          <image src="/pages-mall/static/mine/msg_bell.png" mode="aspectFill"></image>
          <view class="bage-num">
            <cl-badge :value="msgBagde"></cl-badge>
          </view>
        </view>
      </view>
      <!-- 用户信息 -->
      <view class="user-info" @tap="pageClick({funKey: 'userAuth'})">
        <image :src="headImg" mode="aspectFill"></image>
        <text>{{userName}}</text>
      </view>
      <!-- 积分、优惠券 -->
      <view class="account-info">
        <view class="value-item" @tap="toIntegralDetail">
          <text class="num-val">{{userIsAuth ? integral : '-'}}</text>
          <text>我的积分</text>
        </view>
        <view class="value-item" @tap="pageClick({funKey: 'mineCoupon'})">
          <text class="num-val">{{userIsAuth ? coupon : '-'}}</text>
          <text>我的优惠券</text>
        </view>
        <!-- <view class="value-item">
          <text class="num-val">{{userIsAuth ? growValue : '-'}}</text>
          <text>我的成长值</text>
        </view> -->
      </view>
      <!-- 我的订单 -->
      <view class="m-card my-order">
        <view class="m-card__header">
          <text>我的订单</text>
          <text class="all-order" @tap="pageClick({funKey: 'allOrder'})">
            全部订单
            <cl-icon name="cl-icon-arrow-right"></cl-icon>
          </text>
        </view>
        <view class="m-card__body">
          <view class="fun-item" @tap="pageClick({funKey: 'tobePay'})">
            <image src="/pages-mall/static/mine/wallet.png" mode=""></image>
            <text>待支付</text>
            <view v-if="orderNum.unPaidTotal" class="bage-num">
              <cl-badge :value="orderNum.unPaidTotal"></cl-badge>
            </view>
          </view>
          <view class="fun-item" @tap="pageClick({funKey: 'tobeDeliver'})">
            <image src="/pages-mall/static/mine/rect_clock.png" mode=""></image>
            <text>待发货</text>
            <view v-if="orderNum.unDeliveredTotal" class="bage-num">
              <cl-badge :value="orderNum.unDeliveredTotal"></cl-badge>
            </view>
          </view>
          <view class="fun-item" @tap="pageClick({funKey: 'tobeReceive'})">
            <image src="/pages-mall/static/mine/like_msg.png" mode=""></image>
            <text>待收货</text>
            <view v-if="orderNum.unReceivingTotal" class="bage-num">
              <cl-badge :value="orderNum.unReceivingTotal"></cl-badge>
            </view>
          </view>
          <view class="fun-item" @tap="pageClick({funKey: 'evaluate'})">
            <image src="/pages-mall/static/mine/notepad.png" mode=""></image>
            <text>待评价</text>
            <view v-if="orderNum.unEvaluateTotal" class="bage-num">
              <cl-badge :value="orderNum.unEvaluateTotal"></cl-badge>
            </view>
          </view>
          <view class="fun-item" @tap="pageClick({funKey: 'afterSales'})">
            <image src="/pages-mall/static/mine/mny_circle.png" mode=""></image>
            <text>退换/售后</text>
            <view v-if="orderNum.afterProcessCount" class="bage-num">
              <cl-badge :value="orderNum.afterProcessCount"></cl-badge>
            </view>
          </view>
        </view>
      </view>
      <view class="m-card">
        <view class="m-card__header">
          <text>功能服务</text>
        </view>
        <view class="other-fun m-card__body">
          <view class="fun-item" @tap="pageClick({funKey: 'favorites'})">
            <image src="/pages-mall/static/mine/collect.png" mode=""></image>
            <text>我的收藏</text>
          </view>
          <view class="fun-item" @tap="pageClick({ funKey: 'subscription' })">
            <image src="/pages-mall/static/mine/badge.png" mode=""></image>
            <text>我的订阅</text>
          </view>
          <view class="fun-item" @tap="pageClick({ funKey: 'browsingHistory' })" v-if="showShopButton">
            <image src="/pages-mall/static/mine/record.png" mode=""></image>
            <text>浏览足迹</text>
          </view>
          <view class="fun-item" @tap="pageClick({funKey: 'callService'})">
            <image src="/pages-mall/static/mine/service.png" mode=""></image>
            <text>联系客服</text>
          </view>
          
          <view class="fun-item" @tap="pageClick({funKey: 'couponCenter'})">
            <image src="/pages-mall/static/mine/coupon.png" mode=""></image>
            <text>领券中心</text>
          </view>
          <view class="fun-item" @tap="pageClick({funKey: 'myShop'})">
            <image src="/pages-mall/static/mine/shop.png" mode=""></image>
            <text>我的店铺</text>
          </view>
          <view class="fun-item" @tap="pageClick({funKey: 'addr'})">
            <image src="/pages-mall/static/mine/clock_car.png" mode=""></image>
            <text>收货地址</text>
          </view>
          <view class="fun-item" @tap="pageClick({funKey: 'staffApprove'})">
            <image src="/pages-mall/static/mine/staff.png" mode=""></image>
            <text>员工认证</text>
          </view>
          
          <!-- 测试环境使用 -->
          <view class="fun-item" v-if="isDev" @tap="pageClick({funKey: 'devEnv'})">
            <image src="/pages-mall/static/mine/bag.png" mode=""></image>
            <text>开发版</text>
          </view>
        </view>  
      </view>
      <view class="m-card">
        <view class="m-card__header">
          <text>更多推荐</text>
        </view>
        <view class="m-card__body">
            <view class="fun-item" @tap="pageClick({funKey: 'becomeSeller'})" v-if="showShopButton">
              <image src="/pages-mall/static/mine/merchant.png" mode=""></image>
              <text>成为商家</text>
            </view>
            <!-- 跳转到分销小程序 -->
            <view class="fun-item" @tap="goMini" v-if="distributionApplConfigDesc && platform!='H5'">
              <image src="/pages-mall/static/mine/distributor.png" mode=""></image>
              <text>成为分销商</text>
            </view>
            <!--  ifdef  H5 -->
            <view class="open-nimi" v-if="distributionApplConfigDesc && platform=='H5'">
              <view class="open-nimi__entry">
                <image src="/pages-mall/static/mine/distributor.png" mode=""></image>
                <text>成为分销商</text>
              </view>
              <wx-open-launch-weapp id="launch-btn" :username="distributionApplConfigDesc">
                <script type="text/wxtag-template">
                  <div class="item-box" style="opacity: 0"></div>
                </script>
              </wx-open-launch-weapp>
            </view>
            <!--  endif -->
        </view>
      </view>
    </view>	
    <cl-toast ref="elToast"></cl-toast>

    <!-- 底部导航栏 -->
    <m-tabbar :value="3"></m-tabbar>
  </view>
</template>

<script>
import commonMethod from '@/js/commonMethod'
import mTabbar from '@/pages-mall/components/m-tabbar.vue'
import utils from '@/js/utils'
export default {
  data() {
    return {
      headImg: require('@/pages-mall/static/mine/default_head.png'),
      userName: '登录/授权',
      backgroundImge: require('@/pages-mall/static/mine/bgi.png'),
      integral: 0,
      coupon: 0,
      growValue: 0,
      userIsAuth: false,
      isDev: process.env.NODE_ENV === 'development',
      orderNum: {
        unPaidTotal: 0,
        unDeliveredTotal: 0,
        unReceivingTotal: 0,
        completedTotal: 0,
        cancelTotal: 0,
        unEvaluateTotal: 0
      },
      showShopButton: false,
      isDistributionAppletGhId: false,  //分销商是否显示
      distributionApplConfigDesc: '',   //分销商小程序id
      msgBagde: 0,
      platform:'',
      distributionAppId:''
    }
  },
  onLoad() {
    commonMethod.jWeixinAuthConfig(['scanQRCode'], ['wx-open-launch-weapp'])
    const { platform } = this.$cmMth.getTerminalPlatformArg();
    this.platform = platform
  },
  components: {
    mTabbar
  },
  onShow() {
    this.updatePageInfo();
    this.getTotalNum();
    this.getAppletOnline()
    this.getDistributionAppletGhId()
    this.getMsgBadge()
  },
  methods: {
    //打开分销小程序
    goMini(){
      uni.navigateToMiniProgram({
        appId: this.distributionAppId,
        path: 'pages/index/index',
        success(res) {
          // 打开成功
        }
      })
    },
    scriptDom() {
      const script = document.createElement('script')
      script.type = 'text/wxtag-template'
      script.text =`<div class="item-box" style="display: flex; flex-direction: column; align-items: center;">
                    <image style="width: 26px; height: 26px; margin-bottom: 8px;" src="/pages-mall/static/mine/distributor.png" mode="" />
                    <span style="font-size: 12px">成为分销商</span>
                  </div>`
      return `<wx-open-launch-weapp id="launch-btn" username="gh_074a3f69c3b4"></wx-open-launch-weapp>`
    },
    updatePageInfo() {
      const {memberId} = this.$cmMth.getUserStatusInfo();
      if (memberId) {
        this.userIsAuth = true;
        this.getCacheUserInfo();
        this.getUserDetailInfo(memberId);
        this.getMemberIntegralValue();
      }
    },
    getCacheUserInfo() {
      const {memberPhoto, memberName} = this.$cmMth.getUserStatusInfo() || {}
      this.headImg = memberPhoto || require('@/pages-mall/static/mine/default_head.png');
      this.userName = memberName;
    },
    getUserDetailInfo(memberId) {
      this.$mallApi.data.getUserInfo({pathParams: `/${memberId}`, hideLoading: true, responseToast: false}).then(res => {
        if (res.statusCode === 200) {
          const {memberId, headPortrait, nickname, phoneNumber, openId} = res.data;
          const {USER_INFO} = this.$constant;
          const userInfo = {
            ...res.data,
            memberId: memberId,
            memberPhoto: headPortrait,
            memberName: nickname,
            memberPhone: phoneNumber,
            openId,
          }
          this.coupon = res.data.countUsable?res.data.countUsable:0
          this.$cmMth.storageAction({key: USER_INFO, action: 'set', value: userInfo});
          this.getCacheUserInfo()
        }
      })
    },
    pageClick(params) {
      const {notAuthFun, funKey} = params || {}
      const isStop = !notAuthFun && !this.$cmMth.checkAuth();
      let url = '';
      if (isStop || funKey === 'userAuth') return
      switch(funKey) {
        case 'tobePay':
          url = '/pages-mall-a/order/list?orderStatus=0'
          break
        case 'tobeDeliver':
          url = '/pages-mall-a/order/list?orderStatus=1'
          break
        case 'tobeReceive':
          url = '/pages-mall-a/order/list?orderStatus=2'
          break
        case 'evaluate':
          url = '/pages-mall-a/order/evaluation'
          break
        case 'addr':
          url = '/pages-mall-a/address-mng/address-mng'
          break
        case 'afterSales':
          url = '/pages-mall-a/order-after-sale/return-approval-list'
          break
        case 'favorites':
          url = '/pages-mall-a/favorites/favorites'
          break
        case 'becomeSeller':
          url = 'none'
          // url = '/pages-mall-a/become-seller/become-seller'
          this.scanCode()
          break
        case 'staffApprove':
          url = '/pages-mall-b/staff-approve/staff-approve'
          break
        case 'systemMessage':
          url = '/pages-mall-a/message-center/system-message'
          break
        case 'subscription':
          url = '/pages-mall-b/subscription/subscription'
          break
        case 'browsingHistory':
          url = '/pages-mall-b/browsing-history/browsing-history'
          break
        case 'mineCoupon':
          url = '/pages-mall-a/coupon-manage/mine-coupon'
          break
        case 'couponCenter':
          url = '/pages-mall-a/coupon-manage/coupon-manage'
          break  
        case 'aboutCompany':
          url = '/pages-mall-b/about-company/about-company'
          break
        case 'callService':
          url = '/pages-mall-b/about-company/article-info?configCode=ContactCustomerService'
          break
        case 'setting':
          url = '/pages-mall-b/setting/setting'
          break
        case 'myShop':
          url = '/pages-mall-b/myShop/myShop'
          break
        case 'allOrder':
          url = '/pages-mall-a/order/list'
          break  
        default:
          break
      }

      // 测试环境使用
      if (this.isDev) {
        if (funKey === 'devEnv') {
          url = '/pages-mall-a/dev-env/operate-user-info'
        }
      }

      if (url === '') {
        const prms = {
            title: '暂未开放此功能，请敬请期待!',
            duration: 2000,
          icon: 'none'
        }
        uni.showToast(prms);
        
      } else if (url !== 'none'){
        uni.navigateTo({url})
      }
    },
    getMemberIntegralValue() {
      const {memberId} = this.$cmMth.getUserStatusInfo()
      this.$mallApi.data.getMemberIntegralValue({pathParams: `/${memberId}`, hideLoading: true,responseToast:false}).then(res => {
        if (res.statusCode === 200) {
          this.integral = res.data || '0';
        }
      })
    },
    // 扫码
    scanCode() {
      /* #ifdef H5 */
      const IS_APP = this.$cmMth.isWebViewApp()

        if (!IS_APP) {
          // 公众号
          this.scanCodeByGZH()
        } else {
          // APP套壳
          this.scanCodeByApp()
        }
        /* #endif */

        /* #ifndef H5 */
        uni.scanCode({
          success: res => {
            // console.log('条码类型：' + res.scanType)
            // console.log('条码内容：' + res.result)
            this.bindSellerUser(res.result)
          }
        })
        /* #endif */
      },
      // app的扫码
      scanCodeByApp() {
        if (EbeiPlugins && EbeiPlugins.scanQrCode) {
          EbeiPlugins.scanQrCode(res => {
            this.bindSellerUser(res)
          }, err => {
            alert(err)
            // 扫码失败
          })
        } else {
          // TODO 提供的API无法使用
          this.$refs.elToast.open({
            message: '该功能暂未开放'
          })
        }
      },
      // 公众号的扫码
      scanCodeByGZH() {
        jWeixin.scanQRCode({
          needResult: 1,
          success: res => {
            this.bindSellerUser(res.resultStr)
          }
        })
      },
    // 绑定商家账号
    async bindSellerUser(sellerUserId) {
      const { memberId } = this.$cmMth.getUserStatusInfo()
      const params = {
        data: {
          memberId, // 会员id
          sellerUserId // 商家账号id
        },
        responseToast: false
      }
      const { success, message } = await this.$mallApi.data.bindSellerUser(params)
      if (success) {
        this.$refs.elToast.open({
          message: '恭喜成为商家！',
          position: 'middle'
        })
      } else {
        this.$refs.elToast.open({
          message,
          position: 'middle'
        })
      }
    },
    // 订单数量
    getTotalNum() {
      const {memberId} = this.$cmMth.getUserStatusInfo() || {};
      if (!memberId) return;
      return this.$mallApi.data.getGoodsOrderTotal({data: {buyerId: memberId}, hideLoading: true}).then(res => {
        if (res.statusCode === 200) {
          this.orderNum = res.data || {};
        }
      })
    },
    toIntegralDetail() {
      uni.navigateTo({
        url: `/pages-mall-b/integral/integral-detail?myIntegral=${this.integral}`
      })
    },
    // 接口获取某个功能是否需要显示，例如 小程序为了审核通过，需要隐藏某些功能，而公众号则需要显示该功能
    async getAppletOnline() {
      const params = {
        pathParams: '/AppletOnline'
      }
      const { data: res } = await this.$mallApi.data.getConfigByCode(params)
      this.showShopButton = res ? false : true
    },
    async getDistributionAppletGhId() {
      const params = {
        pathParams: '/DistributionAppletAppId'
      }
      const res = await this.$mallApi.data.getConfigByCode(params)
      if (res.statusCode == '200') {
        if (res?.data?.configDesc) {
          this.distributionApplConfigDesc = res.data.configDesc
          this.distributionAppId = res.data.configDesc
          // console.log('this.distributionApplConfigDesc=====',this.distributionApplConfigDesc)
        }
      }
      // this.isDistributionAppletGhId = res ? false : true
    },
    getMsgBadge() {
      this.$mallApi.data.getUnreadMsgNum({hideLoading: true}).then(res => {
        if (res.statusCode === 200) {
          this.msgBagde = res.data || 0;
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

.mine{
  position: relative;
  width: 100%;
  background-color: $uni-bg-color-grey;
  padding-bottom: 100rpx;
  .bgi{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 474rpx;
    background-size: contain;
  }
  .bell-msg{
    position: relative;
    .bage-num{
      top: -4rpx;
      right: -2rpx;
      ::v-deep .cl-badge__content{
        border-color: transparent;
      }
    }
  }
  .bage-num{
    position: absolute;
    top: -16rpx;
    right: 26rpx;
    & > view{
      display: block !important;
    }
    ::v-deep .cl-badge{
      display: block;
    }
  }
  .content-wrap{
    position: relative;
    z-index: 2;
    $pd: 10rpx;
    .m-card{
      background-color: #fff;
      border-radius: 16rpx;
      margin-bottom: 20rpx;
      &__header{
        @include flx-dsp($jsc: space-between, $ali: center);
        padding-left: 40rpx;
        padding-right: 20rpx;
        height: 80rpx;
        border-bottom: 1rpx solid #e7e7e7;
        & > text{
          font-size: $uni-font-size-lg;
          font-weight: bold;
        }
        .all-order{
          font-size: 24rpx;
          font-weight: normal;
        }
      }
      &__body{
        @include flx-dsp($jsc: flex-start, $ali: center);
        padding: 33rpx $pd 40rpx $pd;
        box-sizing: border-box;
      }
    }
    .top-area{
      @include flx-dsp($jsc: flex-end, $ali: center);
      width: 100%;
      height: 74rpx;
      image{
        width: 32rpx;
        height: 32rpx;
        margin-left: 10rpx;
        margin-right: 14rpx;
      }
    }
    .fun-item{
      width: 25%;
      @include flx-dsp($jsc: center, $ali: center, $drt: column);
      image{
        margin-bottom: 16rpx;
        width: 52rpx;
        height: 52rpx;
      }
      text{
        font-size: 24rpx;
      }
    }
    .user-info{
      @include flx-dsp($jsc: flex-start, $ali: center);
      padding-left: 20rpx;
      image{
        width: 132rpx;
        height: 132rpx;
        border-radius: 50%;
      }
      text{
        margin-left: 28rpx;
        font-size: 32rpx;
        color: #fff;
        display: block;
        width: calc(100% - 132rpx - 28rpx);
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .account-info{
      margin: 40rpx auto 28rpx auto;
      width: 556rpx;
      @include flx-dsp($jsc: space-between, $ali: center);
      .value-item{
        @include flx-dsp($jsc: center, $ali: center, $drt: column);
        text{
          color: #fff;
        }
        text:nth-child(1) {
          font-size: 44rpx;
          font-weight: bold;
        }
        text:nth-child(2) {
          font-size: 24rpx;
        }
      }
    }
    .my-order{
      .fun-item{
        position: relative;
        
      }
    }
    .other-fun{
      background-color: #fff;
      border-radius: 18rpx;
      padding: 26rpx $pd 10rpx $pd;
      box-sizing: border-box;
      @include flx-dsp($jsc: flex-start, $ali: center);
      flex-wrap: wrap;
      .fun-item{				
        margin-bottom: 20rpx;
      }
    }
    .open-nimi{
      position: relative;
      width: 25%;
      min-height: 100rpx;
      
      &__entry{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        @include flx-dsp($jsc: center, $ali: center, $drt: column);
        width: 100%;
        image{
          margin-bottom: 16rpx;
          width: 52rpx;
          height: 52rpx;
        }
        text{
          font-size: 24rpx;
        }
      }
      #launch-btn{
        position: relative;
        z-index: 9;
        width: 172rpx;
        height: 100rpx;
      }
    }
  }
}
.item-box { 
  width: 86px;
  height:50px
}
</style>
