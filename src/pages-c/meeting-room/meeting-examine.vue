<template>
  <view id="allContent" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="circle">
      <image class="tipImage" :src="tipImage" alt="">
    </view>
    <view class="big">审核中</view>
    <view class="gray">您的订单已提交至管理员审核，审核通过后将通过消息方式提醒或可到订单列表查看订单状态</view>
    <view class="buttons">
      <view class="toindex" @click="toindex">返回首页</view>
      <view class="toinfo" @click="toinfo">预约记录</view>
    </view>
  </view>
</template>

<script>
  // import sh from "@/assets/images/meeting/icon-sh@2x.png"
  export default {
    data() {
      return {
        // sh: sh,
      }
    },
    mounted() {
      uni.showToast({
        title: '会议厅预定成功',
        icon: 'none'
      })
    },
    computed:{
      tipImage(){
        return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/index/icon-sh2x.png`
      }
    },
    methods: {
      toindex() {
        uni.switchTab({
          url: '/pages/index/index'
        })
      },
      toinfo() {
        uni.redirectTo({
          url: '/pages-c/meeting-room/myMeetingRoomList'
        })
      }
    }
  }

</script>

<style lang="scss" scoped>
  #allContent {
    height: 100%;
    width: 100%;
    padding-top: 120px;
    background: #fff;
  }

  .circle {
    width: 120px;
    height: 120px;
    margin: 0 auto;

    .tipImage {
      display: block;
      width: 120px;
      height: 120px
    }
  }

  .big {
    margin-top: 50px;
    font-size: 32px;
    text-align: center;
  }

  .gray {
    width: 80%;
    margin: 0 auto;
    margin-top: 20px;
    color: #a3a1a4;
    text-align: center;
    line-height: 20px;
    font-size: 14px;
  }

  .buttons {
    width: 80%;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
    justify-content: space-between;

    view {
      width: 120px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 18px;
      border: 1px solid var(--app-primary-color);
      border-radius: 3px;
    }

    .toindex {
      color: var(--app-primary-color)
    }

    .toinfo {
      color: #fff;
      background: var(--app-primary-color);
    }
  }

</style>
