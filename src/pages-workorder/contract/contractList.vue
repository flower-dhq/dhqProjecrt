<template>
  <view class="page">
    <view class="room-bg tabs" @click="getPage('room')" v-if="btnGroup.houseContract">
      <view class="flex_center">
        <image class="img-icon" :src="require(`@/static/theme-default/hetong/icon-room.png`)" />
        <text>房屋租赁</text>
      </view>
      <image class="img-more" :src="require(`@/static/theme-default/hetong/icon-room-more.png`)" />
    </view>
<!--    <view class="youchang-bg tabs" @click="getPage('pay')">-->
<!--      <view class="flex_center">-->
<!--        <image class="img-icon" :src="require(`@/static/theme-default/hetong/icon-youchang.png`)" />-->
<!--        <text>有偿服务</text>-->
<!--      </view>-->
<!--      <image class="img-more" :src="require(`@/static/theme-default/hetong/icon-youchang-more.png`)" />-->
<!--    </view>-->
    <view class="ziyuan-bg tabs" @click="getPage('ziyuan')" v-if="btnGroup.resourceContract">
      <view class="flex_center">
        <image class="img-icon" :src="require(`@/static/theme-default/hetong/icon-ziyuan.png`)" />
        <text>资源合同</text>
      </view>
      <image class="img-more" :src="require(`@/static/theme-default/hetong/icon-ziyuan-more.png`)" />
    </view>
    <view class="car-bg tabs" @click="getPage('car')" v-if="btnGroup.parkingContract">
      <view class="flex_center">
        <image class="img-icon" :src="require(`@/static/theme-default/hetong/icon-car.png`)" />
        <text>车位合同</text>
      </view>
      <image class="img-more" :src="require(`@/static/theme-default/hetong/icon-car-more.png`)" />
    </view>
  </view>
</template>

<script>
// import menuAuthMixin from '@/js/mixin/menuAuthMixin'
import { getFunctionButtons2 } from '@/service/landcrm'
export default {
  // mixins: [menuAuthMixin],
  authName: '合同管理',
  data() {
    return {
      userInfo: {},
      btnGroup: {
        houseContract: false,    //房屋租赁
        resourceContract: false,   //资源合同
        parkingContract: false,   //车位合同
      },
    }
  },
  components: {},
  onLoad(){
    let O_USER_INFO = this.$constant.O_USER_INFO;
    this.userInfo = this.$utils.storageAction({
      key: O_USER_INFO,
      action: 'get'
    });
    this.initUserAuthority();
  },
  methods: {
    //获取人员按钮权限
    initUserAuthority(){
      let self = this;
      let data = {
        userId: self.userInfo.userId,
        menuTypes: 101,
        belongSystem: "gj_applet"
      };
      let params = {
        data: data,
        hideLoading: true,
        responseToast: false,
      }
      getFunctionButtons2(params).then(res=>{
        if(res.resultCode == 200 && res.data && res.data.length > 0){
          self.skipCheckBtn = false;
          res.data.forEach(element=>{
            if(element.menuNameEn == "Butler Mini Program" && element.items.length > 0){
              element.items.forEach(element1=>{
                if(element1.menuNameEn == "Charging Management" && element1.items.length > 0){
                  element1.items.forEach(element2=>{
                    if(element2.menuNameEn == "Contract Management" && element2.items.length > 0){
                      element2.items.forEach(element3=>{
                        self.btnGroup[element3.btnCode] = true;
                      })
                    }
                  })
                }
              })
            }
          })
        }else{
          uni.showToast({title:'网络异常，请稍后再试',icon:'none'})
        }
      })
    },

    getPage(type) {
      let url;
      if (type == 'room') {
        url = '/pages-workorder/contract/roomList'
      }else if (type == 'pay') {
        url = '/pages-workorder/contract/payList'
      }else if (type == 'ziyuan'){
        url = '/pages-workorder/contract/ziyuanList'
      }else {
        url = '/pages-workorder/contract/carList'
      }
      uni.navigateTo({
        url
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .page {
    padding: 54rpx 40rpx 0;
  }
  .room-bg {
    background-image: url('@/static/theme-default/hetong/room-bg.png');
    background-size: 100%;
  }
  .youchang-bg {
    background: linear-gradient(147deg, rgba(17,169,120,0.07) 0%, rgba(22,206,146,0) 100%);
    border-radius: 8rpx;
  }
  .ziyuan-bg {
    background-image: url('@/static/theme-default/hetong/ziyuan-bg.png');
    background-size: 100%;
  }
  .car-bg {
    background-image: url('@/static/theme-default/hetong/car-bg.png');
    background-size: 100%;
  }
  .tabs {
    height: 140rpx;
    padding: 0 30rpx 0 60rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40rpx;
  }
  .img-icon {
    width: 75rpx;
    height: 75rpx;
    margin-right: 40rpx;
  }
  .img-more {
    width: 24rpx;
    height: 24rpx;
  }

  .flex_center {
    display: flex;
    align-items: center;
  }
</style>
