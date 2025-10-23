<template>
  <view class="pages-box">
    <!-- #ifdef H5 -->
    <view class="title">问卷指导语</view>
    <!-- #endif -->
    <view class="hand-box bg-gradient">
      <view class="cont-text">
        <view class="big-text">问卷调查</view>
        <view class="small-text">感谢您的参与</view>
      </view>
    </view>
    <view class="content-box">
      <view class="desc-cont">
        <text class="desc-text"> 您好，以下问题是对您日常生活状况的询问，不涉及个人隐私的暴露，请根据自己的实际情况回答，所有问题预计在10分钟以内完成。 </text>
        <text class="desc-text"> 答案无所谓好坏和对错，无需长时间斟酌，无需考虑他人意见，请根据第一反应回答。 </text>
        <text class="desc-text"> 您的答案将严格保密，不会泄露给无关人员，不会对您个人造成不利影响,请放心作答。 </text>
        <view class="icon-text-list">
          <view class="text-item">
            <view class="icon-cont">
              <u-icon name="clock" color="#10b981" size="40"></u-icon>
            </view>
            <text>约10分钟完成</text>
          </view>
          <view class="text-item">
            <view class="icon-cont">
              <u-icon name="lock" color="#10b981" size="40"></u-icon>
            </view>
            <text>严格保密</text>
          </view>
          <view class="text-item">
            <view class="icon-cont">
              <u-icon name="man-add" color="#10b981" size="40"></u-icon>
            </view>
            <text>匿名调查</text>
          </view>
        </view>
      </view>
    </view>

    <view class="btn-cont">
      <u-button size="large" :custom-style="buttonStyles.primary" @click="startQuestionnaire" class="btn" text="开始填写问卷"></u-button>
    </view>
  </view>
</template>

<script>
import { buttonStyles } from '@/utils/styles';
import utils from '@/js/utils'
export default{
  data(){
    return{
      buttonStyles
    }
  },
  onLoad(){
    //清空缓存
    const { BASIC_INFO, QUESTIONNAIRE_INFO } = this.$constant
    utils.storageAction({ key: BASIC_INFO, action: 'set', value:{} });
    utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'set', value:{} });
  },
  methods:{
    startQuestionnaire() {
      uni.navigateTo({
        url: '/pages/questionnaire-baseInfo'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pages-box{
  min-height: 100%;
  background-color: #f8fafc;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;
}
.title{
  // position: fixed;
  // top: 0;
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  font-weight:700;
  color: #fff;
  text-align: center;
  background-color: rgb(102, 126, 234);
}

.bg-gradient{
  background: linear-gradient(135deg,#667eea,#764ba2);
}

.hand-box{
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 312rpx;
  .cont-text{
    text-align: center;
    color: #fff;
    .big-text{
      font-size: 50rpx;
      font-weight: 700;
      margin-bottom: 16rpx;
    }
    .small-text{
      font-size: 25rpx;
    }
  }
}

.hand-box::after{
  content: "";
  position: absolute;
  bottom: -1.25rem;
  left: 50%;
  transform: translate(-50%);
  width: 84rpx;
  height: 84rpx;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 .125rem .625rem rgba(0, 0, 0, .1);
  z-index: 9;
}

.content-box{
  padding: 82rpx 40rpx 40rpx;
  margin-bottom: 22rpx;
}
.desc-cont{
  padding: 62rpx 40rpx;
  border-radius: 20rpx;
  box-shadow: 0 .25rem 1.25rem rgba(0,0,0,.08);
  .desc-text{
    font-size: 31rpx;
    line-height:1.8;
    color: #374151;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;
    display: block;
    margin-bottom: 32rpx;
    text-align: justify;
  }
}
.icon-text-list{
  display: flex;
  .text-item{
    flex: 1;
    font-size: 24rpx;
    text-align: center;
    color: #6b7280;
    .icon-cont{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10rpx;
    }
  }
}

.btn-cont{
  padding: 0 80rpx;
  .btn{
    // height: 100rpx;
    border-radius: 20rpx;
    // font-size: 33rpx !important;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%);
  }
}
</style>