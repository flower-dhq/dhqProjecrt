<style lang="scss" scoped>
.date-picker {
  width: 170rpx;
  height: 46rpx;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  padding: 4rpx 8rpx;
  .date-txt{
    font-size: 20rpx;
    color: #666;
  }
}
</style>

<template>
  <view class="date-picker" @click="onShowHide(true)">
    <text class="date-txt">{{ dateText }}</text>
    <u-datetime-picker :show="show" v-model="value" mode="date" @confirm="confirm" @cancel="onShowHide(false)"></u-datetime-picker>
    <u-icon name="arrow-down-fill" color="#666" size="10"></u-icon>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      value: new Date(),
      dateText: '',
    };
  },
  props: {
    tabs: {
      type: Array,
      default() {
        return [];
      },
    },
    date: {
      type: String,
      default: ''
    }
  },
  methods: {
    init() {
      const date = new Date().getTime()
      this.value = date
      this.dateText = uni.$u.timeFormat(date, 'yyyy-mm-dd')
      this.$emit('update:date', this.dateText)
    },
    onShowHide(show) {
      this.show = show
    },
    confirm(evt) {
      const {value} = evt
      const ymText = uni.$u.timeFormat(value, 'yyyy-mm-dd')
      this.dateText = ymText
      this.show = false
      this.$emit('update:date', ymText)
      this.$emit('confirm', {evt, ymText})
    }
  },
  created() {
    this.init()
  }
};
</script>
