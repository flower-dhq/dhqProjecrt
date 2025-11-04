<style lang="scss" scoped>
.picker-wrap {
  width: 100%;
  .title-wrap {
    padding: 26rpx 48rpx;
    border-bottom: 1rpx solid #eaeaea;
    @include flx-dsp($jsc: space-between, $ali: center);
    .cancel-wrap {
      color: #999999;
    }
    .confirm-wrap {
      color: var(--app-primary-color);
    }
  }
  .tabs-wrap {
    @include flx-dsp($jsc: space-between, $ali: center);
    .tab-wrap {
      flex: 1;
      padding: 24rpx;
      font-size: 28rpx;
      text-align: center;
      border-bottom: 1rpx solid #cccccc;
    }
    .tab-active {
      color: var(--app-primary-color) !important;
      border-bottom: 2rpx solid var(--app-primary-color);
    }
  }
  .content-wrap {
    max-height: 60vh;
    overflow: auto;
    .item-wrap {
      padding: 30rpx 40rpx;
      color: #333333;
      border-bottom: 1px solid #eaeaea;
      @include flx-dsp($jsc: center, $ali: center);
      .item-name {
        flex: 1;
        font-size: 30rpx;
        margin-right: 10rpx;
      }
      .circle-wrap {
        width: 34rpx;
        height: 34rpx;
        border: 2rpx solid #cccccc;
        border-radius: 50%;
      }
    }
    .active {
      color: var(--app-primary-color) !important;
    }
  }
}
.datetime-picker-wrap  ::v-deep .u-transition {
  position: unset !important;
}
</style>

<template>
  <view>
    <u-popup :show="dateShow" closeOnClickOverlay @close="dateShow = false" safeAreaInsetBottom>
      <view class="picker-wrap">
        <view class="title-wrap">
          <view class="cancel-wrap" @click="dateShow = false">{{ cancelText }}</view>
          <view class="title-name"> {{ title }}</view>
          <view class="confirm-wrap" @click="onConfirm">{{ confirmText }}</view>
        </view>
        <view class="tabs-wrap">
          <view :class="['tab-wrap', { 'tab-active': tabName === 'startDate' }]" @click="changeTab('startDate')">开始时间</view>
          <view :class="['tab-wrap', { 'tab-active': tabName === 'endDate' }]" @click="changeTab('endDate')">结束时间</view>
        </view>
        <view class="datetime-picker-wrap">
          <u-datetime-picker v-if="tabName === 'startDate'" v-model="startDate" @change="startChange" :show="tabName === 'startDate'" :mode="mode" :formatter="formatter" :showToolbar="false"></u-datetime-picker>
          <u-datetime-picker v-if="tabName === 'endDate'" v-model="endDate" @change="endChange" :show="tabName === 'endDate'" :mode="mode" :formatter="formatter" :showToolbar="false"></u-datetime-picker>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>

export default {
  name: 'eDatetimePicker',
  components: {},
  options: {
    styleIsolation: 'shared' // 允许样式穿透
  },
  props: {
    type: {
      type: String,
      default: 'custom'
    },
    mode: {
      type: String,
      default: 'date'
    },
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    }
  },
  computed: {
    formatType() {
      if (this.mode === 'datetime') {
        return 'YYYY-MM-DD HH:mm'
      }
      return 'YYYY-MM-DD'
    }
  },
  data() {
    return {
      dateShow: false,
      dVal: Number(new Date()),
      tabName: 'startDate',
      startDate: '',
      endDate: ''
    }
  },
  mounted() {
    this.startDate = this.$dayjs().format(this.formatType)
    this.endDate = this.$dayjs().format(this.formatType)
  },
  watch: {
    show: {
      handler() {
        this.dateShow = !!this.show
      },
      deep: true
    }
  },
  methods: {
    changeTab(tabName) {
      this.tabName = tabName
      this.dVal = Number(new Date())
    },
    startChange(date) {
      this.startDate = this.$dayjs(date.value).format(this.formatType)
    },
    endChange(date) {
      this.endDate = this.$dayjs(date.value).format(this.formatType)
    },
    onConfirm() {
      if (this.$dayjs(this.endDate).isBefore(this.$dayjs(this.startDate))) {
        uni.showToast({ title: '结束时间必须在开始时间之后，请重新选择', icon: 'none' })
        return
      }
      let params = {
        startDate: this.startDate,
        endDate: this.endDate
      }
      this.$emit('customChange', params)
      this.dateShow = false
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      }
      if (type === 'month') {
        return `${value}月`
      }
      if (type === 'day') {
        return `${value}日`
      }
      if (type === 'hour') {
        return `${value}时`
      }
      if (type === 'minute') {
        return `${value}分`
      }
      return value
    }
  }
}
</script>
