<style lang="scss" scoped>
.parking-cont{
  .banner-cont{
    position: relative;
    width: 100%;
    height: 400rpx;
    // padding: 0 24rpx;
    background-size: 100% 100%;
  }
  .data-cont{
    position: absolute;
    left: 24rpx;
    width: calc(100% - 48rpx);
    margin: 0 auto;
    bottom: 32rpx;
    display: flex;
    padding: 32rpx 60rpx;
    border-radius: 16rpx;
    background: rgba($color: #000, $alpha: 0.3);
    box-sizing: border-box;
    .data-item{
      width: 50%;
      font-family: 'PingFang SC';
      .title{
        position: relative;
        top: -6rpx;
        color: #fff;
        font-size: 26rpx;
        margin-right: 18rpx;
      }
      .data-text{
        font-weight: bold;
        color: #FEB903;
        font-size: 44rpx;
      }
    }
    .data-item-r{
      text-align: right;
    }
  }

  .menu-cont{
    width: calc(100% - 48rpx);
    background-image: linear-gradient(#FDFDFD,#F7F7F7);
    border-radius: 16rpx;
    margin: 40rpx auto;
    padding: 32rpx;
    box-sizing: border-box;
    .title-text{
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
      padding-bottom: 32rpx;
      display: block;
    }
    .menu-list{
      width: 100%;
      background-color: #fff;
      border-radius: 16rpx;
      display: flex;
      padding: 10rpx 0 40rpx;
      .menu-item{
        width: 33.33%;
        text-align: center;
        .menu-icon{
          width: 160rpx;
          height: 160rpx;
        }
      }
      view{
        font-size: 26rpx;
        color: #333;
      }
    }
  }


}
</style>
<template>
  <view class="parking-cont">
    <view class="banner-cont" :style="{'background-image': `url(${picUrl})`}">
      <view class="data-cont">
        <view class="data-item">
          <text class="title">总车位</text>
          <text class="data-text">1000</text>
        </view>
        <view class="data-item data-item-r">
          <text class="title">剩余车位</text>
          <text class="data-text">277</text>
        </view>
      </view>
    </view>

    <view class="menu-cont">
      <text class="title-text">特色服务</text>
      <view class="menu-list">
        <view class="menu-item" v-for="(item, index) in menuList" :key="index" @click="menuJump(item)">
          <image class="menu-icon" :src="require(`@/static/housekeeper/${item.icon}.png`)"></image>
          <view>{{item.configName}}</view>
        </view>
      </view>
    </view>

  </view>
</template>
<script>
export default {
  data(){
    return{
      picUrl:require('@/static/housekeeper/parking-banner.png'),
      menuList:[
        {
          configName: '临停缴费',
          icon: "icon-lt",
        },
        {
          configName: '月卡续费',
          icon: "icon-yk",
        },
        {
          configName: '寻车',
          icon: "icon-xc",
          url:'pages/index/index?regionId=16684128848238149&beaconUUID=AB8190D5-D11E-4941-ACC4-42F30510B408',
          appId:'wxc0d8a780faa4eaa6', //第三方小程序appid
          originalId:'gh_5e52a25d8b33', //第三方小程序原始id
          jumpType:'mini', //跳转到第三方小程序标识
        },
      ]
    }
  },
  methods:{
    // 跳转第三方小程序方法
    menuJump(item){
      if(item.jumpType=='mini'){
        // #ifdef MP-WEIXIN
        uni.navigateToMiniProgram({
          appId:item.appId,// 第三方小程序appid
          path:item.url,// 
          envVersion:"release",
          success: res => {
              // 打开成功
              console.log("打开成功", res);
          },
          fail: err => {
              console.log(err);
          }
        })
        // #endif

        // #ifdef APP-PLUS
        plus.share.getServices((res) => {
          let weixin = res.find(i => i.id === 'weixin');
            if (weixin) {
                weixin.launchMiniProgram({
                    id: item.originalId,
                    path: item.url,
                    type: 0
                }, (res) => {

                }, (err) => {

                });
            }
        }, (err) => {
            console.log("获取分享服务列表失败： " + JSON.stringify(e));
        });
        // #endif
      }
      if(!item.url){
        uni.showModal({
          title: '提示',
          content: '此功能暂未开放，敬请期待~',
          confirmText: "好的",
          showCancel: false,
          confirmColor: '#13C3BF',
          success: function (res) {
              if (res.confirm) {
              }
          }
        });
        return;
      }

    }
  }
  
}
</script>