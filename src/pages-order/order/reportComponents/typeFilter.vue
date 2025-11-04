<template>
  <view>
    <view class="type-filter">
      <view class="type-wrap" @click="typeshow = true">
        <view class="type-name">{{ serverName }}</view>
        <text class="iconfont drop-icon">&#xe600;</text>
      </view>
      <view class="dates-wrap">
        <view class="tabs-wrap">
          <view @click="tabClick(tab)" :class="['tab-wrap', { 'tab-active': tabVal === tab.value }]" v-for="(tab, index) in tabs" :key="index">{{ tab.name }}</view>
        </view>
        <view class="date-wrap">
          <text class="iconfont date-icon" @click="reduce">&#xe64b;</text>
          <view class="date-val" @click="changeDate">{{ dateShow }}</view>
          <text class="iconfont date-icon" @click="add">&#xe787;</text>
        </view>
      </view>
    </view>
    <u-picker :show="datetimeShow" ref="uPicker" :columns="columns" @confirm="confirm" @cancel="datetimeShow = false" keyName="label" :defaultIndex="defaultIndex"></u-picker>
    <u-popup :show="typeshow" closeOnClickOverlay @close="typeshow = false" safeAreaInsetBottom>
      <view class="picker-wrap">
        <view class="title-wrap">
          <view class="cancel-wrap" @click="typeshow = false">返回</view>
          <view class="title-name"> 请选择业务分类</view>
          <view class="confirm-wrap" @click="filterChange">确定</view>
        </view>
        <view class="select-type">
          <view class="type-wrap" v-for="(select, index) in selectList" :key="index">
            <view @click="selectType(type, index)" class="item-wrap" :class="{ active: type.serverId === selected[index] }" v-for="type in select" :key="type.serverId">
              <view class="item-name">{{ type.serverName }}</view>
              <u-icon v-if="type.serverId === selected[index] && type.serverId === selected[selected.length - 1]" size="36rpx" color="var(--app-primary-color)" name="checkmark"></u-icon>
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>
import { getAllQuesTaskServerTypes } from '@/service/wuyecrm.js'

export default {
  name: 'typeFilter',
  props: {},
  computed: {
    dateShow() {
      if (this.tabVal === 'years') {
        return this.$dayjs(this.dateVal).format('YYYY年')
      } else {
        return this.$dayjs(this.dateVal).format('YYYY年MM月')
      }
    },
    columns() {
      if (this.tabVal === 'years') {
        return [this.yearColumns]
      } else {
        return [this.yearColumns, this.monthColumns]
      }
    }
  },
  data() {
    return {
      serverName: '所有分类',
      tabVal: 'years',
      tabs: [
        {
          name: '年',
          value: 'years'
        },
        {
          name: '月',
          value: 'months'
        }
      ],
      dateVal: '',
      datetimeShow: false,
      yearColumns: [],
      monthColumns: [],
      defaultIndex: [],
      typeshow: false,
      selectList: [],
      selected: [],
      nameSelected: []
    }
  },
  created() {
    this.dateVal = this.$dayjs().format('YYYY/MM/DD')
    let yearNum = Number(this.$dayjs().subtract(20, 'years').format('YYYY'))
    for (let i = 0; i <= 20; i++) {
      this.yearColumns.push({
        value: yearNum + i,
        label: yearNum + i + '年'
      })
    }
    for (let j = 1; j <= 12; j++) {
      this.monthColumns.push({
        value: j,
        label: j + '月'
      })
    }
  },
  mounted() {
    this.getTypes()
  },
  methods: {
    filterChange() {
      let data = {
        tabVal: this.tabVal,
        dateVal: this.dateVal
      }
      if (this.selected.length) {
        if (this.selected[this.selected.length - 1] !== '-1') {
          data.serverId = this.selected[this.selected.length - 1]
          this.serverName = this.nameSelected[this.nameSelected.length - 1]
        } else if (this.selected.length > 1) {
          data.serverId = this.selected[this.selected.length - 2]
          this.serverName = this.nameSelected[this.nameSelected.length - 2]
        } else {
          data.serverId = ''
          this.serverName = '所有分类'
        }
      } else {
        data.serverId = ''
        this.serverName = '所有分类'
      }
      this.typeshow = false
      this.$emit('filterChange', data)
    },
    tabClick(tab) {
      this.tabVal = tab.value
      this.filterChange()
    },
    reduce() {
      this.dateVal = this.$dayjs(this.dateVal).subtract(1, this.tabVal).format('YYYY/MM/DD')
      this.filterChange()
    },
    add() {
      this.dateVal = this.$dayjs(this.dateVal).add(1, this.tabVal).format('YYYY/MM/DD')
      this.filterChange()
    },
    changeDate() {
      this.defaultIndex = []
      let yNum = Number(this.$dayjs(this.dateVal).format('YYYY'))
      const yIdx = this.yearColumns.findIndex((ele) => ele.value == yNum)
      this.defaultIndex.push(yIdx > -1 ? yIdx : 0)

      if (this.tabVal === 'months') {
        let mNum = Number(this.$dayjs(this.dateVal).format('MM'))
        const mIdx = this.monthColumns.findIndex((ele) => ele.value == mNum)
        this.defaultIndex.push(mIdx > -1 ? mIdx : 0)
      }

      this.datetimeShow = true
    },
    // 回调参数为包含columnIndex、value、values
    confirm(e) {
      if (this.tabVal === 'years') {
        let year = e.value[0]
        this.dateVal = this.$dayjs(this.dateVal).format(year.value + '/MM/DD')
      } else {
        let year = e.value[0]
        let month = e.value[1]
        this.dateVal = this.$dayjs(this.dateVal).format(year.value + '/' + month.value + '/DD')
      }
      this.filterChange()
      this.datetimeShow = false
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
      return value
    },
    getTypes() {
      const { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
      let params = {
        data: {
          companyId: userInfo.companyId
        }
      }
      getAllQuesTaskServerTypes(params).then((res) => {
        if ((res.status = 200)) {
          if (res.data && res.data.length && res.data[0].children && res.data[0].children.length) {
            let list = JSON.parse(JSON.stringify(res.data[0].children))
            list.unshift({
              serverId: '-1',
              serverName: '全部'
            })
            this.selectList = [list]
          } else {
            this.selectList = []
          }
        }
      })
    },
    selectType(type, index) {
      if (index <= this.selected.length) {
        this.selected.splice(index, this.selected.length)
        this.nameSelected.splice(index, this.nameSelected.length)
      }
      if (index <= this.selectList.length) {
        this.selectList.splice(index + 1, this.selectList.length)
      }

      this.selected.push(type.serverId)
      this.nameSelected.push(type.serverName)
      if (type.children && type.children.length) {
        let list = JSON.parse(JSON.stringify(type.children))
        list.unshift({
          serverId: '-1',
          serverName: '全部'
        })
        this.selectList.push(list)
      }
      let params = {
        taskTypeId: type.serverId
      }
      this.$emit('updateData', params)
    },
    reset() {
      if (this.selectList.length > 1) {
        this.selectList = [this.selectList[0]]
      }
      this.selected = []
      this.nameSelected = []
      this.serverName = '所有分类'
      let params = {
        taskTypeId: ''
      }
      this.$emit('updateData', params)
    }
  }
}
</script>
<style lang="scss" scoped>
.type-filter {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 24rpx;
  .type-wrap {
    display: flex;
    align-items: center;
    .type-name {
      font-size: 26rpx;
      color: #333333;
    }
    .drop-icon {
      margin-left: 10rpx;
      color: #666666;
      font-size: 20rpx;
    }
  }
  .dates-wrap {
    display: flex;
    align-items: center;
    .tabs-wrap {
      display: flex;
      .tab-wrap {
        padding: 2rpx 20rpx;
        text-align: center;
        font-size: 24rpx;
        color: #999999;
        border: 2rpx solid #999999;
        &:first-child {
          border-radius: 4rpx 0rpx 0rpx 4rpx;
          border-right: 0rpx solid #999999;
        }
        &:last-child {
          border-radius: 0rpx 4rpx 4rpx 0rpx;
          border-left: 0rpx solid #999999;
        }
      }
      .tab-active {
        border: 2rpx solid var(--app-primary-color) !important;
        color: var(--app-primary-color);
      }
    }
    .date-wrap {
      padding-left: 30rpx;
      display: flex;
      align-items: center;
      .date-icon {
        font-size: 32rpx;
        color: #666666;
      }
      .date-val {
        padding: 0 4rpx;
        font-size: 28rpx;
        color: #333333;
      }
    }
  }
}

.picker-wrap {
  width: 100%;
  .title-wrap {
    font-size: 28rpx;
    padding: 26rpx 30rpx;
    border-bottom: 1rpx solid #eaeaea;
    @include flx-dsp($jsc: space-between, $ali: center);
    .cancel-wrap {
      color: #999999;
    }
    .confirm-wrap {
      color: var(--app-primary-color);
    }
  }
}

.select-type {
  width: 100%;
  overflow: hidden;
  display: flex;
  min-height: 500rpx;
  max-height: 800rpx;
  .type-wrap {
    flex: 1;
    overflow: auto;
    background: #ffffff;
  }
  .item-wrap {
    padding: 20rpx;
    font-size: 28rpx;
    color: #333333;
    border-bottom: 1px solid #eaeaea;
    @include flx-dsp($jsc: center, $ali: center);
    .item-name {
      flex: 1;
    }
  }
  .active {
    color: var(--app-primary-color) !important;
    background: #ffffff !important;
  }
}
</style>
