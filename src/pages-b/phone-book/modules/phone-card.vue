<template>
  <!-- 
  ,background:`${data.logoUrl?'':'linear-gradient(180deg, rgba(97,113,255,0.61) 0%, rgba(82,103,255,0.07) 100%)'}`  -->
  <!-- `url(${data.logoUrl})` -->
  <view class="phone-card-item" :style="[THEME_CSS_VAR, { backgroundImage: `${data.logoUrl?`url(${data.logoUrl})`:'linear-gradient(180deg, rgba(97,113,255,0.61) 0%, rgba(82,103,255,0.07) 100%)'}`
, color: data.logoUrl ? '#fff' : '#666' }]">

    <view class="phone-card-left" v-if="false">
      <text class="card-font--weight">{{ data.fixedPhone }}</text>
      <text class="card-font--mini">{{ data.name }}</text>
      <text class="card-time">{{ data.startTime }} 至 {{ data.endTime }}</text>
    </view>
    <view class="phone-card-right"  v-if="false">
      <!-- <u-icon name="phone-fill" :style="[{ backgroundColor: data.logoUrl ? '#fff' : THEME_COLOR }]" :color="data.logoUrl ? '#444' : '#fff'" :size="22" @click="callPhone" /> -->
      <!-- <u-icon :name=" data.logoUrl ? `@/static/${[THEME_NAME]}/multiplexing/iconphone.png` : `@/static/${[THEME_NAME]}/multiplexing/phone.png`" :imgMode="aspectFit" :style="[{ backgroundColor: data.logoUrl ? '#fff' : THEME_COLOR }]" :color="data.logoUrl ? '#444' : '#fff'" :size="34" @click="callPhone" /> -->
      <image :src=" data.logoUrl ? require(`@/static/${[THEME_NAME]}/multiplexing/iconphone.png`) :  require(`@/static/${[THEME_NAME]}/multiplexing/phone.png`) "  class="image-icon" mode="aspectFit" @click="callPhone" ></image>  
    </view>

    <!-- 新布局 -->
    <!-- <text class="card-phone">{{ data.fixedPhone  }}</text> -->
    <text class="card-name">{{ data.name }}</text>
    <text class="card-time">{{ data.startTime }} - {{ data.endTime }}</text>
    <view class="card-bottom">
      <image :src="require(`@/static/${[THEME_NAME]}/multiplexing/${ data.logoUrl ? 'iconphone' : 'phone'}.png`)"  class="image-icon" mode="aspectFit" @click="callPhone" ></image>
    </view>
  </view>                  
</template>


<script>
import commLogic from '@/js/comm-logic';
export default {
  name: 'PhoneCard',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  
  methods: {
    async callPhone() {
      const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['callPhone']})
			if (code !== 1 && code !== -2) return
      uni.makePhoneCall({
        phoneNumber: this.data.fixedPhone
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.phone-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx 24rpx;
  display: flex;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-bottom: 30rpx;
}
.phone-card-item{
  position: relative;
  display: inline-block;
  width: 340rpx;
  margin: 0 20rpx 0 10rpx;
  margin-bottom: 30rpx;
  box-sizing: border-box;
  padding: 30rpx 0 30rpx 16rpx;
  .card-phone {
    font-size: 36rpx;
    font-weight: bold;
    line-height: 50rpx;
    word-break: break-all;
    margin-bottom: 12rpx;
  }
  .card-time{
    display: block;
    font-size: 28rpx;
    line-height: 28rpx;
    margin: 30rpx 0;
  }
  .card-name{
    font-size: 32rpx;
    font-weight: 400;
    
  }
  .card-bottom{
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    .image-icon{
      width: 48rpx;
      height: 48rpx;
      margin-right: 32rpx;
    }
  }
  
}
.phone-card-left {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-right: 20rpx;
  color: inherit;
}
.phone-card-right {
  border-left: 2px solid #f4f4f4;
  height: 84rpx;
  flex: 0 0 auto;
  margin: auto 0;
  padding-left: 34rpx;
  line-height: 84rpx;
  display: flex;
  align-items: center;
  .image-icon{
    width: 68rpx;
    height: 68rpx;
  }
}
.card-font--weight {
  font-size: 36rpx;
  font-weight: bold;
  line-height: 50rpx;
  word-break: break-all;
  margin-bottom: 12rpx;
  color: inherit;
  // color: #444444;

}
.card-font--mini {
  font-size: 24rpx;
  font-weight: bold;
  line-height: 34rpx;
  word-break: break-all;
  margin-bottom: 8rpx;
  // color: #444444;
  font-family: PingFang SC;
}
.card-time {
  font-size: 24rpx;
  line-height: 28rpx;
  // color: #666666;
  font-family: PingFang SC;
}
.u-icon {
  border-radius: 50%;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10rpx 0 10rpx 20rpx;
}

</style>