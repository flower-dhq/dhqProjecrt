<template>
  <view class="search-bar-date">
    <u-toast ref="uToast"></u-toast>
    <view class="date-header">
      <view :class="['content', { 'active-date': dateType == 1 }]" @click="handleChangeDateType(1)">{{ beginDate || '开始时间' }}</view>
      <view>~</view>
      <view :class="['content', { 'active-date': dateType == 2 }]" @click="handleChangeDateType(2)">{{ endDate || '结束时间' }}</view>
    </view>
    <view class="list-wrapper">
      <picker-view indicator-class="indicator-calss" class="picker-view" v-model="value" @change="handleChange">
        <picker-view-column class="picker-view-column">
          <view style="line-height: 50px" :class="{ activeItem: year == item }" v-for="(item, idx) in years" :key="idx">{{ item }}年</view>
        </picker-view-column>
        <picker-view-column class="picker-view-column">
          <view style="line-height: 50px" :class="{ activeItem: month == item }" v-for="(item, idx) in months" :key="idx">{{ item }}月</view>
        </picker-view-column>
        <picker-view-column class="picker-view-column">
          <view style="line-height: 50px" :class="{ activeItem: day == item }" v-for="(item, idx) in days" :key="idx">{{ item }}日</view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    const date = new Date()
    const years = []
    const year = date.getFullYear()
    const months = []
    const month = date.getMonth() + 1
    const days = []
    const day = date.getDate()
    for (let i = date.getFullYear() - 10; i <= date.getFullYear(); i++) {
      years.push(i)
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }
    for (let i = 1; i <= 31; i++) {
      days.push(i)
    }
    return {
      dateType: 1, // 1开始时间 2结束时间
      years,
      year,
      months,
      month,
      days,
      day,
      value: [],
      beginDate: '',
      endDate: ''
    }
  },
  computed: {
    ...mapGetters('searchBar', {
      dataInfo: 'getDataInfo'
    })
  },
  created() {
    this.value = this.dataInfo.beginValue
  },
  methods: {
    ...mapMutations('searchBar', ['setDataInfo']),
    handleChange(e) {
      const val = e.detail.value
      if (this.dateType == 1) {
        this.beginValue = val
      } else {
        this.endValue = val
      }
      this.year = this.years[val[0]]
      this.month = this.months[val[1]]
      this.day = this.days[val[2]]
      if (this.dateType == 1) {
        this.beginDate = this.$dayjs(this.year + '/' + this.month + '/' + this.day).format('YYYY-MM-DD')
      } else {
        this.endDate = this.$dayjs(this.year + '/' + this.month + '/' + this.day).format('YYYY-MM-DD')
      }
      // uni.$u.debounce(this.getCurrentDays, 500)
    },
    getCurrentDays() {
      let d = this.year + '-' + this.month
      let days = this.$dayjs(d).endOf('month').format('DD')
      this.days = []
      for (let i = 1; i <= days; i++) {
        this.days.push(i)
      }
      if (days < this.day) {
        this.day = days
      }

      let date = this.$dayjs(this.year + '/' + this.month + '/' + this.day).format('YYYY-MM-DD')
      if (this.dateType == 1) {
        this.beginDate = date
      } else {
        this.endDate = date
      }
    },
    handleChangeDateType(type) {
      this.dateType = type
      this.value = type == 1 ? this.beginValue : this.endValue
      let val = this.value
      this.year = this.years[val[0]]
      this.month = this.months[val[1]]
      this.day = this.days[val[2]]
      if (type == 1) {
        this.beginDate = this.$dayjs(this.year + '/' + this.month + '/' + this.day).format('YYYY-MM-DD')
      } else {
        this.endDate = this.$dayjs(this.year + '/' + this.month + '/' + this.day).format('YYYY-MM-DD')
      }
    },
    handleSyncData() {
      console.log('同步数据', this.dataInfo)
      this.beginValue = this.dataInfo.beginValue
      this.beginDate = this.dataInfo.beginDate
      this.endValue = this.dataInfo.endValue
      this.endDate = this.dataInfo.endDate
      let value = this.dateType == 1 ? this.dataInfo.beginValue : this.dataInfo.endValue
      this.year = this.years[value[0]]
      this.month = this.months[value[1]]
      this.day = this.days[value[2]]
    },
    updateStoreDate() {
      if (this.beginDate && this.endDate && this.$dayjs(this.beginDate).isAfter(this.$dayjs(this.endDate))) {
        uni.showToast({ title: '结束时间必须在开始时间之后，请重新选择', icon: 'none' })
        return false
      } else {
        this.setDataInfo({ beginValue: this.beginValue, beginDate: this.beginDate, endValue: this.endValue, endDate: this.endDate })
        console.log('更新数据', this.beginValue, this.endValue, this.beginDate, this.endDate)
        return true
      }
    },
    resetData() {
      this.year = ''
      this.month = ''
      this.day = ''
      this.beginValue = [10, new Date().getMonth() - 1, 0]
      this.beginDate = ''
      this.endValue = [10, new Date().getMonth(), new Date().getDate() - 1]
      this.endDate = ''
      this.value = this.dateType == 1 ? this.dataInfo.beginValue : this.dataInfo.endValue
      console.log(123, this.year, this.month, this.day)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-bar-date {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  .date-header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 10px 0;
    // background: #999;
    .content {
      width: 150px;
      text-align: center;
      padding: 10px 0;
      border: 1px solid #eaeaea;
    }
    .active-date {
      color: #2761ff;
      border: 1px solid #2761ff;
    }
  }

  .list-wrapper {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .picker-view {
      height: 356rpx;

      .picker-view-column {
        font-size: 32rpx;
        line-height: 32rpx;
        text-align: center;
        color: #999;
      }

      .activeItem {
        color: #2761ff;
      }
    }
  }
}
</style>

<style>
.indicator-calss {
  height: 50px;
}
</style>
