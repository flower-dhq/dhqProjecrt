<template>
  <view>
    <view class="logistics" v-if="!isNoExpressNo">
      <view class="list-item" v-for="(item, index) in logistList" :key="index">
        <!-- <template v-if="getPlatform === 'H5' && item.subscribe !== 1"> -->
          <!-- 微信公众号跳转到小程序指定页面 -->
          <!-- username: 小程序的原始id -->
          <!-- <wx-open-launch-weapp id="launch-btn" username="gh_a63a83fbf60a">
            <script type="text/wxtag-template">
              <style>
                .item-wrapper { width: 300px; height: 42px; padding: 0 36rpx; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center; }
                .item-text { font-size: 32rpx; flex: 1; }
              </style>
              <div class="item-wrapper">
                <span class="item-text">物流单号：{{ item.expressNo }}</span>
              </d>
            </script>
          </wx-open-launch-weapp>
        </template>
        <template v-else> -->
          <view class="item-wrapper" @click="linkTo(item)">
            <text class="item-text">物流单号：{{ item.expressNo }}</text>
          </view>
        <!-- </template> -->
      </view>
    </view> 
    <view class="noDetail" v-if="isNoExpressNo">暂无物流</view>
  </view>
</template>

<script>
import commonMethod from '@/js/commonMethod'

export default {
  data() {
    return {
      orderId: '', // 订单id
      logistList: [],
      isNoExpressNo:false,
    }
  },
  computed: {
    // 平台判断
    getPlatform() {
      let platform = undefined
      
      /* #ifdef H5 */
      platform = 'H5'
      /* #endif */
      /* #ifdef MP-WEIXIN */
      platform = 'MP-WEIXIN'
      /* #endif */
      /* #ifdef APP-PLUS */
      paltform = 'APP'
      /* #endif */

      return platform
    }
  },
  onLoad(option) {
    const params = commonMethod.getRouteParams(option, 'orderId')
    this.orderId = params.orderId

    // h5跳转小程序
    // commonMethod.jWeixinAuthConfig([], ['wx-open-launch-weapp'])
    this.getListData()
  },
  methods: {
    linkTo(info) {
      // if (info.subscribe === 1) {
        // 已订阅，则显示物流详情
        let newNodeLst = this.setNewNodeList(info.nodeList)
        let args = encodeURIComponent(JSON.stringify({
          logistics: newNodeLst || [],
          expressNo: info.expressNo,
          subscribe: info.subscribe
        }))
        // if(!info.expressNo){
        //   return
        // }
        if(this.logistList.length == 1){
          uni.redirectTo({ url: '/pages-mall-a/order/logistics?args=' + args })
        }else{
          uni.navigateTo({ url: '/pages-mall-a/order/logistics?args=' + args })
        }
      // } else {
        // 未订阅，则跳转到第三方物流查询网站
        // uni.navigateTo({ url: `/pages-mall-a/order/logistics-third?expressNo=${info.expressNo}&expressCompany=${info.expressCompany}` })
      // }
    },
    async getListData() {
      const { data } = await this.$mallApi.data.getLogisticsInfo({ pathParams: `/${this.orderId}`, hideLoading: true })

      // TODO data.map() 暂时这么写，因为接口还没有提供subscribe字段，等接口提供了这个字段就删除它，后面只需要 this.logistList = data
      // this.logistList = data.map(item => ({ ...item, subscribe: 1 }))
      if(data.length == 1 && !data[0].expressNo){
        this.isNoExpressNo = true
      }
      this.logistList = data
      if(this.logistList && this.logistList.length == 1){
        this.linkTo(this.logistList[0])
      }
    },
    setNewNodeList(list){
      if(list && list.length>=2){
        list.map(item=>{
          item.records = item.records.reverse()
        })
      }
      return list
    }
  }
}
</script>

<style lang="scss" scoped>
.logistics {
  width: 100%;
  min-height: 100%;
  background-color: $uni-bg-color-grey;
  padding: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.noDetail{
  width: 100%;
  padding-top: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
}
.list-item {
  width: 100%;
  height: 84rpx;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 20rpx;

  &:not(:last-child) {
    border-bottom: 1px solid #f3f3f3;
  }
  &::v-deep .item-wrapper {
    padding: 0 36rpx;
    width: 100%;
    height: 100%;
    line-height: 82rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    box-sizing: border-box;
  }
  &::v-deep .item-text {
    font-size: 32rpx;
    flex: 1;
  }
  &::v-deep .cl-icon {
    position: absolute;
    right: 20rpx;
    font-size: 32rpx;
    color: #b6b6b6;
  }
}
</style>