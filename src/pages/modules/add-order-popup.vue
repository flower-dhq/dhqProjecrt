<template>
  <u-popup :show="isShow" :customStyle="getCustomStyle" :round="10" @close="closeEvent">
    <view class="popup-panel">
      <view class="title-panel flex">
        <text>自查录单</text>
        <text class="title-panel--close" @click="closeEvent">关闭</text>
      </view>
      <view class="item-panel">
        <view class="btn-item" v-for="(item, index) in selfOrderList" :key="index" @click="linkTo(item.path)">
          <u--image :src="require(`@/static/index/${item.icon}.png`)" width="100rpx" height="100rpx" />
          <text class="btn-item--name">{{ item.label }}</text>
        </view>
      </view>
      <text class="title-panel">代客录单</text>
      <view class="item-panel">
        <view class="btn-item" v-for="(item, index) in customOrderList" :key="index" @click="linkTo(item.path)">
          <u--image :src="require(`@/static/index/${item.icon}.png`)" width="100rpx" height="100rpx" />
          <text class="btn-item--name">{{ item.label }}</text>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'

export default {
  name: 'AddOrderPopup',
  mixins: [mpMixin],
  props: {
    show: Boolean
  },
  data() {
    return {
      selfOrderList: [
        { label: '工程问题', path: '/pages-a/related-submission/form?pageCode=self-repair', icon: 'icon-self-repair' },
        { label: '其他问题', path: '/pages-a/related-submission/form?pageCode=self-report', icon: 'icon-self-report' },
      ],
      customOrderList: [
        { label: '工程问题', path: '/pages-a/related-submission/form?pageCode=repair', icon: 'icon-repair' },
        { label: '客户投诉', path: '/pages-a/related-submission/form?pageCode=complain', icon: 'icon-complain' },
        { label: '其他问题', path: '/pages-a/related-submission/form?pageCode=other', icon: 'icon-other' },
      ]
    }
  },
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  methods: {
    closeEvent() {
      this.isShow = false
    },
    linkTo(path) {
      if (path) {
        uni.navigateTo({ url: path })

        this.isShow = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.popup-panel {
  display: flex;
  flex-direction: column;
  padding-top: 40rpx;
}
.title-panel {
  width: 100%;
  padding: 0 40rpx;
  font-family: "PingFang SC";
  font-size: 36rpx;
  color: #222;
  box-sizing: border-box;

  &.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.title-panel--close {
  font-size: 30rpx;
  padding-left: 20rpx;
}
.item-panel {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0 12rpx 60rpx;
}
.scroll-panel {
  display: flex;
  flex-direction: row;
}
.btn-item {
  flex: 0 0 176rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24rpx;
  color: #000;
  font-family: "PingFang SC";
  padding-top: 24rpx;
}
.btn-item--name {
  margin-top: 16rpx;
}
</style>