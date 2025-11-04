<template>
  <view class="workorder" :style="[THEME_CSS_VAR]">
    <view class="section" v-for="(menu, index) in menuList" :key="index">
      <text class="section__label"> {{ menu.label }}</text>
      <view class="section__content">
        <view class="section__function" v-for="(item, fIdx) in menu.list" :key="fIdx" @click="linkTo(item)">
          <u--image width="100rpx" height="100rpx" :src="require(`@/static/index/${item.icon}.png`)"></u--image>
          <text>{{ item.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import menuAuthMixin from '@/js/mixin/menuAuthMixin'

export default {
  mixins: [menuAuthMixin],
  authName: '新建任务',
  data() {
    return {
      menuList: [
        {
          label: '自查录单',
          list: [
            { label: '工程问题', path: '/pages-a/related-submission/form?pageCode=self-repair', icon: 'icon-self-repair' },
            { label: '其他问题', path: '/pages-a/related-submission/form?pageCode=self-report', icon: 'icon-self-report' },
          ],
        },
        {
          label: '代客录单',
          list: [
            { label: '工程问题', path: '/pages-a/related-submission/form?pageCode=repair', icon: 'icon-repair' },
            { label: '客户投诉', path: '/pages-a/related-submission/form?pageCode=complain', icon: 'icon-complain' },
            { label: '其他问题', path: '/pages-a/related-submission/form?pageCode=other', icon: 'icon-other' },
          ],
        }
      ],
      queryObj: {
        houseInfoId: '', // 房间id
        recordId: '', // 预警id
      }
    }
  },
  methods: {
    linkTo(item) {
      let query = uni.$u.queryParams(this.queryObj).replace(/^\?/, '&')
      uni.navigateTo({ url: item.path + query })
    }
  },
  onLoad(options) {
    this.queryObj.houseInfoId = options.houseInfoId
    this.queryObj.recordId = options.recordId
  }
}
</script>

<style lang="scss" scoped>
$itv: 24rpx;

.workorder {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  background-color: #f5f6f8;
  min-height: 100vh;
  box-sizing: border-box;
  $itv: 24rpx;
  padding-top: calc(#{$itv});
}
.section {
  position: relative;
  z-index: 1;
  background-color: #fff;
  width: 710rpx;
  border-radius: 8rpx;
  margin: 0rpx auto $itv auto;
  box-sizing: border-box;
  padding: 24rpx 0;
}
.section__label {
  position: relative;
  display: block;
  color: #939393;
  font-weight: bold;
  font-size: 32rpx;
  padding-bottom: 16rpx;
  padding: 0 32rpx 16rpx 32rpx;
}
.section__content {
  margin-top: 20rpx;
  padding: 0 12rpx;
  @include flx-dsp($jsc: flex-start, $ali: center);
  flex-wrap: wrap;
}
.section__function {
  @include flx-dsp($jsc: flex-start, $ali: center, $drt: column);
  width: calc(100% / 4);
  margin: 20rpx 0;

  text {
    display: block;
    width: 100%;
    margin-top: 16rpx;
    color: #000;
    font-size: 26rpx;
    text-align: center;
  }
}
</style>