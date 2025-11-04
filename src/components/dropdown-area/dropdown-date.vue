<template>
  <view
    :class="['dropdown-project', getCustomClass]"
    :style="[THEME_CSS_VAR, show ? {} : { display: 'none' }, getCustomStyle]"
  >
    <picker-view
      v-if="visible"
      indicator-style="height: 50px;"
      :value="pickerValue"
      indicator-class="date-select-indicator"
      :immediate-change="false"
      @change="bindChange($event.detail.value)"
      class="picker-view"
    >
      <picker-view-column>
        <view class="item" v-for="(item,index) in yearList" :key="index">{{item}}年</view>
      </picker-view-column>
      <picker-view-column v-if="isShowMonth">
        <view class="item" v-for="(item,index) in monthList" :key="index">{{item}}月</view>
      </picker-view-column>
      <picker-view-column v-if="isShowDate">
        <view class="item" v-for="(item,index) in dateList" :key="index">{{item}}日</view>
      </picker-view-column>
    </picker-view>
    <view class="footer-wrapper">
      <u-button type="default" text="重置" customStyle="border-radius: 0px; width: 120px; flex: 0 0 auto;" @click="handleReset" />
      <u-button type="primary" text="确定" customStyle="border-radius: 0px;" @click="handleSubmit" />
    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
export default {
  name: 'DropdownProject',
  mixins: [mpMixin],
  props: {
    // 显示/隐藏
    show: Boolean,
    isShowDate: {
      type: Boolean,
      default: false
    },
    isShowMonth: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const date = new Date()

    const that = {
      yearList: [],
      monthList: [],
      dateList: [],
      pickerValue: [],
      visible: true
    }

    const initYear = date.getFullYear() - 2
    const countYear = date.getFullYear() + 2
    for (let i = initYear; i <= countYear; i++) {
      that.yearList.push(i)
    }
    const curYear = date.getFullYear()

    for (let i = 1; i <= 12; i++) {
      that.monthList.push(i)
    }
    const curMonth = date.getMonth()

    const countDate = this.getDateList(curYear, curMonth)
    for (let i = 1; i <= countDate; i++) {
      that.dateList.push(i)
    }
    const curDate = date.getDate()

    that.pickerValue = this.setPickerValue(curYear - initYear, curMonth, curDate - 1)

    return {
      ...that
    };
  },
  methods: {
    iniDate(date){
      let dateArr = date.split('-').map(item => +item);
      let yearIndex = this.yearList.findIndex(item => item == dateArr[0]);
      let monthIndex = this.monthList.findIndex(item => item == dateArr[1]);
      this.pickerValue = [yearIndex, monthIndex];
      this.handleSubmit();
    },
    bindChange(value) {
      const curYear = this.yearList[value[0]]
      const curMonth = this.monthList[value[1]]
      const curDate = this.dateList[value[2]]

      // 重新获取天数
      const countDate = this.getDateList(curYear, curMonth - 1)
      let dateTmp = []
      for (let i = 1; i <= countDate; i++) {
        dateTmp.push(i)
      }
      this.dateList = dateTmp

      this.pickerValue = this.setPickerValue(value[0], value[1], value[2])
    },
    /**
     * 获取当前月的总天数
     * @param {number} month 月份从0开始
     */
    getDateList(year, month) {
      const date = new Date(year, month + 1, 0)
      return date.getDate()
    },
    setPickerValue(yearIndex, monthIndex, dateIndex) {
      let res = [yearIndex]
      if (this.isShowMonth) {
        res.push(monthIndex)
      }
      if (this.isShowDate) {
        res.push(dateIndex)
      }
      return res
    },
    handleSubmit() {
      const curYear = this.yearList[this.pickerValue[0]]
      const curMonth = this.monthList[this.pickerValue[1]]
      const curDate = this.dateList[this.pickerValue[2]]

      let date = curYear
      if (this.isShowMonth) {
        date += '-' + (curMonth < 10 ? '0' + curMonth : curMonth)
      }
      if (this.isShowDate) {
        date += '-' + (curDate < 10 ? '0' + curDate : curDate)
      }

      this.$emit('confirm', {
        label: '日期',
        name: date
      })
    },
    handleReset() {
      this.$emit('confirm', {
        label: '日期',
        name: ''
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.picker-view {
  width: 750rpx;
  height: 612rpx;
  margin-top: 20rpx;
}
.date-select-indicator {
  color: #1989f7;
}
.item {
  font-size: 28rpx;
  line-height: 100rpx;
  text-align: center;
}
.footer-wrapper {
  display: flex;
  align-items: center;
}
</style>
