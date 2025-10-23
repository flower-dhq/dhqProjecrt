<template>
  <view class="page-background">
    <!-- 使用全局样式类替换重复的header样式 -->
    <view class="page-header gradient-bg">
      <view class="page-header-content">
        <text class="title">问卷调查</text>
        <text class="subtitle">感谢您的参与</text>
      </view>
    </view>

    <!-- 使用全局容器和卡片样式 -->
    <view class="page-container">
      <view class="common-card">
        <view class="guide-content">
          <!-- <view class="guide-title">
            <u-icon name="info-circle" color="#667eea" size="48"></u-icon>
            <text class="title-text">指导语</text>
          </view> -->

          <view class="guide-text">
            <text class="paragraph">
              您好，以下问题是对您日常生活状况的询问，不涉及个人隐私的暴露，请根据自己的实际情况回答，所有问题预计在10分钟以内完成。
            </text>
            
            <text class="paragraph">
              答案无所谓好坏和对错，无需长时间斟酌，无需考虑他人意见，请根据第一反应回答。
            </text>
            
            <text class="paragraph">
              您的答案将严格保密，不会泄露给无关人员，不会对您个人造成不利影响,请放心作答。
            </text>
          </view>

          <view class="features">
            <view class="feature-item">
              <u-icon name="clock" color="#10b981" size="40"></u-icon>
              <text class="feature-text">约10分钟完成</text>
            </view>
            <view class="feature-item">
              <u-icon name="lock" color="#10b981" size="40"></u-icon>
              <text class="feature-text">严格保密</text>
            </view>
            <view class="feature-item">
              <u-icon name="man-add" color="#10b981" size="40"></u-icon>
              <text class="feature-text">匿名调查</text>
            </view>
          </view>
        </view>
      </view>

      <view class="action-section">
        <u-button 
          type="primary" 
          size="large" 
          shape="round"
          :custom-style="buttonStyles.primary"
          @click="startQuestionnaire"
        >
          开始填写问卷
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { buttonStyles } from '@/utils/styles'

export default {
  name: 'GuidePage',
  data() {
    return {
      buttonStyles
    }
  },
  inject: ['dataManager'],
  mounted(){
	this.dataManager.resetAll()  
  },
  methods: {
    startQuestionnaire() {
      uni.navigateTo({
        url: '/pages/basic-info/basic-info'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.guide-content {
  .guide-title {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
    
    .title-text {
      font-size: 36rpx;
      font-weight: 600;
      color: #1f2937;
      margin-left: 20rpx;
    }
  }
  
  .guide-text {
    margin-bottom: 60rpx;
    
    .paragraph {
      display: block;
      font-size: 30rpx;
      line-height: 1.8;
      color: #374151;
      margin-bottom: 30rpx;
      text-align: justify;
    }
  }
  
  .features {
    display: flex;
    justify-content: space-around;
    
    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .feature-text {
        font-size: 24rpx;
        color: #6b7280;
        margin-top: 16rpx;
      }
    }
  }
}
</style>
