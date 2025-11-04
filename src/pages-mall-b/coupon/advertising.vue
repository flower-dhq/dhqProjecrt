<template>
  <view class="cpn-advertising" :style="{ backgroundColor }">
    <image class="activity-bg" :src="backgroundImage" mode="widthFix"></image>    
    <view class="activity-cont">
      <!-- 优惠券列表 -->
      <view class="cpn-list">
        <template v-for="(item, index) in couponList">
          <coupon-style1 :couponData="item.couponData" :key="item.id" v-if="couponStyle === '0'" :price="item.couponStartNumber" :title="item.couponName" :desc="item.couponDesc" :dateTime="item.effectiveStr" @tap="getCpn(item, index)" :btnState="item.btnState" />
          <coupon-style2 :couponData="item.couponData" :key="item.id" v-if="couponStyle === '1'" :price="item.couponStartNumber" :title="item.couponName" :desc="item.couponDesc" :dateTime="item.effectiveStr" @tap="getCpn(item, index)" :btnState="item.btnState" :useRange="item.useScope"/>
          <coupon-style3 :couponData="item.couponData" :key="item.id" v-if="couponStyle === '2'" :price="item.couponStartNumber" :title="item.couponName" :desc="item.couponDesc" :dateTime="item.effectiveStr" @tap="getCpn(item, index)" :btnState="item.btnState" />
          <coupon-style4 :couponData="item.couponData" :key="item.id" v-if="couponStyle === '3'" :price="item.couponStartNumber" :title="item.couponName" :desc="item.couponDesc" :dateTime="item.effectiveStr" @tap="getCpn(item, index)" :btnState="item.btnState" />
        </template>
      </view>
      <!-- 活动规则 -->
      <view class="rule-contaienr">
        <view class="rule-header">
          <text class="head-line l-l"></text>
          <text class="title-text">活动规则</text>
          <text class="head-line l-r"></text>
        </view>
        <view class="rule-html" v-html="ruleText"></view>
      </view>
    </view>
    <movable class="movable" :isShow="Boolean(dataInfo.shareState)">
      <!-- 券码活动分享。公众号和小程序点击提示右上角分享，APP点击底部弹窗分享 -->
      <view class="share-box" @click="isShowTip = true" v-if="getPlatform === 'H5' || getPlatform === 'MINI'">
        <image src="/pages-mall-b/static/wechat.png" />
      </view>
    </movable>
    <!-- 分享提示遮罩层 -->
    <share-guide :show="isShowTip" @close="isShowTip = false"></share-guide>
    <!-- 底部弹窗 -->
    <cl-action-sheet ref="elActionSheet"></cl-action-sheet>
    <!-- 返回首页 -->
    <view class="back2home" @click="toIndex"></view>
  </view>
</template>

<script>
import commonMethod from '@/js/commonMethod'
import ShareGuide from './module/share-guide.vue'
import Movable from './module/movable.vue'

import CouponStyle1 from './module/couponStyle1.vue'
import CouponStyle2 from './module/couponStyle2.vue'
import CouponStyle3 from './module/couponStyle3.vue'
import CouponStyle4 from './module/couponStyle4.vue'

export default {
  components: {
    ShareGuide,
    Movable,
    CouponStyle1,
    CouponStyle2,
    CouponStyle3,
    CouponStyle4
  },
  data() {
    return {
      backgroundColor: '',
      backgroundImage: '',
      ruleText: '',
      activityId: '',
      activityName: '',
      couponStyle: '0',
      couponList: [],
      dataInfo: {}, // 接口数据
      isShowTip: false, // 展示分享的提示遮罩层
    }
  },
  computed: {
    // 获取平台类型 { H5: 公众号, APP: app应用, MINI: 小程序, undefined: 未知平台 }
    getPlatform() {
      /* #ifdef H5 */
      const isApp = commonMethod.isWebViewApp()

      return isApp ? 'APP' : 'H5'
      /* #endif */

      /* #ifdef MP-WEIXIN */
      return 'MINI'
      /* #endif */

      return undefined
    }
  },
  async onLoad(options) {
    if (!commonMethod.checkAuth()) return
    const params = commonMethod.getRouteParams(options, 'activityId')
    this.activityId = params.activityId

    await this.getCouponData()

    if (this.getPlatform === 'H5') {
      this.$nextTick(async () => {
        if(this.dataInfo.shareState == 1){
          // 微信公众号-分享到好友/朋友圈
          await commonMethod.jWeixinAuthConfig(['updateAppMessageShareData', 'updateTimelineShareData'])
          this.shareOfH5()
        } else {
          // 微信公众号-禁止分享
          await commonMethod.jWeixinAuthConfig(['hideMenuItems'])
          this.banShareOfH5()
        }
      })
    }
  },
  // 小程序的发送给朋友
  onShareAppMessage({ from, target, webViewUrl }) {
    return this.shareOfMiniPro(1)
  },
  // 小程序的分享到朋友圈
  onShareTimeline({ from, target, webViewUrl }) {
    return this.shareOfMiniPro(2)
  },
  methods: {
    // 获取优惠券列表
    async getCouponData() {
      const params = {
        pathParams: `/${this.activityId}`
      }
      const { data } = await this.$mallApi.data.getCouponDetail(params)

      this.dataInfo = data || {}
      this.backgroundColor = data.activityBgColor
      this.backgroundImage = data.activityImg
      this.ruleText = data.activityRules
      this.activityName = data.activityName
      this.couponStyle = data.couponStyleId
      this.couponList = this.formatData(data.couponOrigins, {activityState: data.activityState})
      uni.setNavigationBarTitle({title: data.activityName || ''})
    },
    formatData(data = [], {activityState}) {
      return data.map(item => ({
        ...item,
        couponStartNumber: [1, 2].includes(item.couponType) ? item.couponValue / 100 : item.couponStartNumber, // 卡券类型 (目前剩下：1-满x元减y元、2-无门槛立减y元)（1-满x元减y元、2-满x件减y元、3-满x元减y折扣、4-满x件减y折扣、11-优惠码(可给他人使用)）
        //btnState: item.quantityReceived >= item.receiveLimitNumber ? 'use' : 'receive' // quantityReceived: 已领取数量, receiveLimitNumber: 个人领取上限
        btnState: 'receive',
        couponData: {...item, activityState}
      }))
    },
    async getCpn(cpn, index) {
      const { btnState, originId, couponConditionsOfUse, infoId} = cpn || {}

      // 如果是使用状态，则跳转到搜索页面
      if (btnState === 'use') {
        uni.navigateTo({
          url: `/pages-mall-a/search-list/search-list?couponInfoId=${infoId}&couponConditionsOfUse=${encodeURIComponent(couponConditionsOfUse)}`
        })

        return
      }

      // 如果是可领取状态，则点击领取优惠券
      const params = {
        data: {
          activityId: this.activityId,
          originId,
        },
        successfulText: '领取成功'
      }
      const { success } = await this.$mallApi.data.receiveActivityCoupon(params)

      // if (success) {
      //   await this.getCouponData()
      // }
    },
    // 获取当前页面的URL
    getPageUrl() {
      const route = getCurrentPages()
      const curPage = route[route.length - 1]
      
      let options = curPage.options
      let param = Reflect.ownKeys(options).map(key => `${key}=${options[key]}`).join('&')

      return {
        path: '/' + curPage.route, // 例如 '/pages-mall-a/index'
        param, // 例如 'name=123&age=18'
      }
    },
    // 公众号的分享
    shareOfH5() {
      // ios在禁止分享之后需要重新开启分享功能
      jWeixin.showMenuItems({
        menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:favorite', 'menuItem:share:QZone', 'menuItem:openWithSafari']
      })

      const { activityName:title, activityUrl:link, shareImg:imgUrl, shareCopywriting:desc, shareTitle} = this.dataInfo
      let tmp = {
        title: shareTitle,
        link,
        imgUrl
      }
      // 公众号分享给朋友
      jWeixin.ready(() => {
        jWeixin.updateAppMessageShareData({
          ...tmp,
          desc,
          success: (res) => {
            console.log("updateAppMessageShareData======success",res);
          }
        })
        // 公众号分享给朋友圈
        jWeixin.updateTimelineShareData({
          ...tmp,
          success: (res) => {
            console.log("updateAppMessageShareData======success",res);
          }
        })
      })
      jWeixin.error(err => {
        console.log('调用分享错误：' + err.errMsg)
      })
    },
    // 公众号禁止分享好友
    banShareOfH5(){
      jWeixin.hideMenuItems({
        menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:favorite', 'menuItem:share:QZone', 'menuItem:openWithSafari']
      })
    },
    // 微信小程序的分享
    shareOfMiniPro(type = 1) {
      if (![1, 2].includes(type)) return

      let { path, param } = this.getPageUrl()

      if (type === 1) {
        return {
          title: this.activityName,
          path: path + '?' + param,
          imageUrl: this.dataInfo.shareImg
        }
      } else if (type === 2) {
        return {
          title: this.activityName,
          query: param,
          imageUrl: this.dataInfo.shareImg
        }
      }
    },
    // 点击分享按钮，底部弹框，暂时保留给APP去调用
    shareModalOfApp() {
      this.$refs.elActionSheet.open({
        list: [
          { label: '发送给朋友', size: '26rpx' },
          { label: '分享到朋友圈', size: '26rpx' }
        ],
        callback: ({ action }) => {
          switch (action) {
            case 0:
              // 分享到朋友
              break
            case 1:
              // 分享到朋友圈
              break
          }
        }
      })
    },
    // APP的分享，需要拿到APP的API才能使用
    shareOfApp() {},
    toIndex() {
      uni.switchTab({ url: '/pages-mall/index/index' })
    }
  }
}
</script>
<style scoped lang="scss">
.cpn-advertising {
  width: 100%;
  min-height: 100%;
  ::v-deep image {
    width: 100%;
    vertical-align: middle !important;
    img {
      vertical-align: middle !important;
    }
  }
  .activity-cont {
    width: 100%;
    padding: 40rpx 0;
    .cpn-list {
      margin: 0 auto;
      width: 690rpx;
      .cpn-item {
        $cl: #f64861;
        @include flx-dsp($jsc: flex-start, $ali: center);
        width: 100%;
        height: 160rpx;
        border-radius: 10rpx;
        margin-bottom: 20rpx;
        overflow: hidden;
        & > view {
          height: 100%;
        }
        &__left {
          @include flx-dsp($jsc: center, $ali: center);
          min-width: 160rpx;
          background-color: $cl;
          color: #fff;
          box-sizing: border-box;
          padding: 0 10rpx;
          .discount-type-1 {
            @include flx-dsp($jsc: flex-end, $ali: center);
            text:nth-child(1) {
              font-size: 28rpx;
              position: relative;
              top: 4rpx;
              margin-right: 4rpx;
            }
            text:nth-child(2) {
              font-size: 40rpx;
            }
          }
          .discount-type-2 {
            font-size: 40rpx;
          }
        }
        &__center {
          flex: 1;
          box-sizing: border-box;
          @include flx-dsp($jsc: center, $ali: flex-start);
          flex-direction: column;
          background-color: #fff;
          box-sizing: border-box;
          padding-left: 20rpx;
          .cpn-title {
            font-size: 30rpx;
            margin-bottom: 20rpx;
            font-weight: bold;
          }
          .valid-date {
            font-size: 26rpx;
            color: #adadad;
            min-width: 100rpx;
            min-height: 37rpx;
          }
        }
        &__right {
          @include flx-dsp($jsc: center, $ali: center);
          width: 160rpx;
          border-left: 1rpx solid #eee;
          background-color: #fff;
          text {
            color: #fff;
            font-size: 28rpx;
            color: $cl;
          }
        }
      }
    }
    .rule-contaienr {
      margin-top: 40rpx;
      width: 100%;
      @include flx-dsp($jsc: center, $ali: center);
      flex-direction: column;
      .rule-header {
        @include flx-dsp($jsc: center, $ali: center);
        margin-bottom: 20rpx;
        .title-text {
          display: block;
          color: #fff;
          margin: 0 20rpx;
          font-size: 34rpx;
        }
        .head-line {
          width: 240rpx;
          height: 4rpx;
        }
        .l-l {
          background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
        }
        .l-r {
          background: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
        }
      }
      .rule-html {
        position: relative;
        width: 90%;
        font-size: 24rpx; 
        color: #fff;
        display: block;
        margin: 0 auto;
      }
    }
  }
}
::v-deep .coupon-box {
  margin-bottom: 20rpx;
  min-height: 190rpx;
  max-height: 210rpx;
}
.share-box image {
  width: 80rpx;
  height: 80rpx;
  background-color: #fff;
  border-radius: 50%;
}
::v-deep .movable{
  .fixed-view{
    left: initial;
    top: initial;
    bottom: 200rpx;
    right: 20rpx;
  }
}
.back2home{
  position: fixed;
  bottom: 100rpx;
  right: 20rpx;
  width: 80rpx;
  height: 80rpx;
  background-image: url('~@/pages-mall/static/shop/home_icon.png');
  background-size: 100% 100%;
}
::v-deep .coupon-box{
  // .bg-img{
  //   justify-content: flex-start;
  //   align-items: center;
  //   box-sizing: border-box;
  //   padding: 0 10px;
  // }
  .info-desc{
    
  }
}
</style>
