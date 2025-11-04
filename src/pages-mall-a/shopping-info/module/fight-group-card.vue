<template>
  <view class="group-card">
    <view class="group-image" :style="[groupSumStyle()]">
      <view class="cl-image__placeholder" v-for="(item, j) in getArrByNum" :key="j" :style="[groupNumStyle(j)]">
        <cl-image
          :src="data.child[j] && data.child[j].buyerHeadPortrait || ''"
          size="84rpx"
          mode="aspectFill"
        >
          <!-- 图片地址错误时展示 -->
          <view slot="placeholder">
            <image class="cl-image__placeholder" src="@/pages-mall/static/shop/group_user_icon.png" mode="aspectFill" />
          </view>
          <view slot="error">
            <image class="cl-image__placeholder" src="@/pages-mall/static/shop/group_user_icon.png" mode="aspectFill" />
          </view>
        </cl-image>
      </view>
    </view>
    <view class="group-info">
      <view>
        还差
        <text class="group-num">{{ differNum(data.child.length) }}</text>人成团
      </view>
      <!-- <text class="ct-time">剩余 00:10:55</text> -->
      <!-- <cl-countdown :datetime="data.datetime" :layout="['hour', 'minute', 'second']" :splitor="[':', ':', '']" /> -->
    </view>
    <cl-button class="btn-join" type="primary" round size="mini" @click="joinGroup(data)">去参团</cl-button>
  </view>
</template>

<script>
/**
 * @property {object} data 组团数据
 * @property {number} groupNum 多少人才可以成团。默认为2
 */
export default {
  name: 'FightGroupCard',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    groupNum: {
      type: Number,
      default: 2
    }
  },
  computed: {
    // 临时数据，没什么作用，只是为了展示头像数量用的
    getArrByNum() {
      return new Array(this.getMaxNum).fill({})
    },
    // 限制最多显示6个人头
    getMaxNum() {
      return this.groupNum > 6 ? 6 : this.groupNum
    }
  },
  methods: {
    // 计算左边头像的位置，在宽度为138rpx下怎样才能容纳groupNum个人数
    groupNumStyle(index) {
      const size = 84 // 图片大小，单位rpx
      const width = 138 // 总宽度
      const left = size / 2
      const posiLeft = left * index + 'rpx'
      return { left: posiLeft }
    },
    groupSumStyle() {
      const size = 84
      const left = size / 2
      return { width: left * (this.getMaxNum + 1) + 'rpx' }
    },
    // 还差多少人成团
    differNum(num) {
      const res = this.groupNum - num
      return res < 0 ? 0 : res
    },
    joinGroup(childItem) {
      this.$emit('joinGroup', childItem)
    }
  }
}
</script>

<style lang="scss" scoped>
.group-card {
  height: 84rpx;
  display: flex;
  align-items: center;

  .group-image {
    @include flx-size('keep');
    @include flx-dsp(flex-start, flex-start, row);
    position: relative;
    height: 84rpx;
  }
  .cl-image__placeholder {
    width: 84rpx;
    height: 84rpx;
    border-radius: 42rpx;
    position: absolute;
  }
  .cl-image,
  cl-image {
    border-radius: 42px;
    overflow: hidden;
  }
  .group-info {
    @include flx-size('stretch');
    margin-left: 28rpx;
    font-size: 24rpx;
    line-height: 28rpx;
    text-align: left;
  }
  .group-num {
    color: $uni-color-main;
    font-size: 24rpx;
    padding: 0 4rpx;
  }
  .ct-time {
    font-size: 20rpx;
    line-height: 28rpx;
    color: rgb(192, 188, 188);
  }
  ::v-deep .btn-join.cl-button,
  ::v-deep .btn-join button {
    font-size: 24rpx;
    padding: 0 26rpx;
    height: 48rpx;
  }
  ::v-deep .cl-countdown,
  ::v-deep cl-countdown {
    margin-left: -6rpx;
  }
}
</style>
