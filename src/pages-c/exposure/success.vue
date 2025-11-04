<style lang="scss" scoped>
.publish-success{
    padding-top: 200rpx;
    box-sizing: border-box;
    @include flx-dsp($jsc: center, $ali: center, $drt:column);   
    .icon{
        width: 100%;
        @include flx-dsp($jsc: center, $ali: center, $drt:column); 
        ::v-deep .u-icon__icon{
            color: var(--app-primary-color) !important;
        }
    }
    .audit-status{
        margin: 60rpx 0;
        display: block;
        text-align: center;
        font-size: 40rpx;
        font-weight: bold;
        color: #333;
    }
    .audit-tips{
        width: 680rpx;
        margin: 20rpx auto 80rpx auto;
        font-size: 28rpx;
        display: block;
        text-align: center;
        color: #999;
    }
    .buttons{
        width: 690rpx;
        margin: 0 auto;
        @include flx-dsp($jsc: space-between, $ali: center);
        ::v-deep .u-button:first-child{
            margin-right: 60rpx;
        }
    }
}
</style>

<template>
  <view class="publish-success" :style="[THEME_CSS_VAR]">
    <view>
        <view class="icon"><u-icon name="hourglass"  size="68"></u-icon></view>
        <text class="audit-status">审核中</text>
        <view class="audit-tips"><text>您提交的信息已提交至管理员审核，审核通过后将展示在曝光台</text></view>
        <view class="buttons">
            <u-button type="primary" :plain="true" text="返回首页" @click="navigate('index')"></u-button>
            <u-button text="投稿历史" type="primary" @click="navigate('history')" />
        </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    navigate(page) {
        if (page === 'index') uni.switchTab({url: '/pages/index/index'})
        if (page === 'history') uni.navigateTo({url: '/pages-c/exposure/history'})
    }
  }
};
</script>
