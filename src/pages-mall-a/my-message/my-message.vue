<template>
  <view class="page-box-top">
    <view class="list-box">
      <my-message-card />
    </view>
  </view>
</template>

<script>
import MyMessageCard from './module/my-message-card.vue'

export default {
  options: { styleIsolation: 'shared' },
  components: {
    MyMessageCard
  },
  data() {
    return {}
  },
  onLoad() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.page-box-top {
  background-color: #F7F7F7;
}
.list-box {
  padding: 20rpx 20rpx 0;

  &::after {
    display: block;
    content: '';
    width: 100%;
    height: 1rpx;
    clear: both;
  }
}
.my-message-card, my-message-card {
  margin-bottom: 20rpx;
}
</style>