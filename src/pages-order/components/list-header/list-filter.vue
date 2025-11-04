<template>
  <view class="filter-wrap">
    <view class="menu-wrap">
      <view :class="['item-wrap', { active: menuId == item.key }]" v-for="item in menuList" :key="item.key" @click="handleSelectMenu(item)">{{ item.title }}</view>
    </view>
    <view class="list-wrap">
      <view :class="['item-wrap', { active: valueId == item.value }]" v-for="(item, index) in valueList" :key="index" @click="handleSelectItem(item)">
        <view class="list-name">{{ item.label }}</view>
        <text v-if="valueId == item.value" class="iconfont select-icon">&#xe786;</text>
      </view>
      <view v-if="valueId == 'custom'" class="custom-wrap" @click="changeCustom">{{ showCustom }}</view>
    </view>
    <e-datetime-picker ref="customDate" :show="dateShow" :mode="customMode" @customChange="customChange"></e-datetime-picker>
  </view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import eDatetimePicker from '../eDatetimePicker/index.vue'

export default {
  name: 'taskFilter',
  components: {
    eDatetimePicker
  },
  data() {
    return {
      filterParams: {},
      menuList: [
        // {
        //   title: '办理人',
        //   key: 'tabType',
        //   value: '',
        //   valueList: [
        //     {
        //       label: '全部',
        //       value: '-99'
        //     },
        //     {
        //       label: '我受理的',
        //       value: '1'
        //     },
        //     {
        //       label: '我处理的',
        //       value: '2'
        //     }
        //   ]
        // },
        {
          title: '异常审批',
          key: 'exception',
          value: '',
          valueList: [
            {
              label: '已作废',
              value: '1'
            },
            {
              label: '已暂停',
              value: '2'
            },
            {
              label: '已非关',
              value: '3'
            }
          ]
        },
        {
          title: '创建时间',
          key: 'time',
          value: '',
          valueList: [
            {
              label: '今天',
              value: 'today'
            },
            {
              label: '昨天',
              value: 'yesterday'
            },
            {
              label: '本周',
              value: 'week'
            },
            {
              label: '自定义',
              value: 'custom'
            }
          ]
        },
        {
          title: '排序方式',
          key: 'sort',
          value: '',
          valueList: [
            {
              label: '创建时间 (最近优先)',
              value: '1'
            },
            {
              label: '创建时间 (最早优先)',
              value: '2'
            },
            {
              label: '处理超期 (最久优先)',
              value: '3'
            }
          ]
        },
        {
          title: '录单系统',
          key: 'sourceType',
          value: '',
          valueList: [
            {
              label: '地产',
              value: '13'
            },
            {
              label: '物业',
              value: '-1'
            },
            {
              label: '巡检',
              value: '22'
            },
            {
              label: '维保',
              value: '23'
            },
            {
              label: '品质',
              value: '24'
            },
            {
              label: '巡逻',
              value: '25'
            }
          ]
        }
      ],
      valueList: [],
      menuId: '',
      valueId: '',
      dateShow: false,
      customMode: 'date',
      startDate: '',
      endDate: ''
    }
  },
  computed: {
    ...mapGetters('searchBar', {
      dataInfo: 'getDataInfo'
    }),
    showCustom() {
      if (this.customMode == 'date') {
        return this.$dayjs(this.startDate).format('YYYY-MM-DD') + ' ~ ' + this.$dayjs(this.endDate).format('YYYY-MM-DD')
      } else if (this.customMode == 'datetime') {
        return this.$dayjs(this.startDate).format('YYYY-MM-DD HH:mm') + ' ~ ' + this.$dayjs(this.endDate).format('YYYY-MM-DD HH:mm')
      }
    }
  },
  mounted() {
    this.handleSelectMenu(this.menuList[0])
    if (this.customMode == 'date') {
      this.startDate = this.$dayjs().format('YYYY-MM-DD 00:00:00')
      this.endDate = this.$dayjs().format('YYYY-MM-DD 23:59:59')
    } else if (this.customMode == 'datetime') {
      this.startDate = this.$dayjs().format('YYYY-MM-DD HH:mm:00')
      this.endDate = this.$dayjs().format('YYYY-MM-DD HH:mm:59')
    }
  },
  methods: {
    ...mapMutations('searchBar', ['setDataInfo']),
    changeCustom() {
      this.$refs.customDate.dateShow = true
    },
    handleSelectMenu(item) {
      this.menuId = item.key
      this.valueList = item.valueList
      this.valueId = item.value
    },
    handleSelectItem(item) {
      this.valueId = item.value === this.valueId ? '' : item.value
      if (this.menuId == 'time') {
        if (this.valueId == 'today') {
          this.startDate = this.$dayjs().format('YYYY-MM-DD 00:00:00')
          this.endDate = this.$dayjs().format('YYYY-MM-DD 23:59:59')
        } else if (this.valueId == 'yesterday') {
          this.startDate = this.$dayjs().subtract(1, 'day').format('YYYY-MM-DD 00:00:00')
          this.endDate = this.$dayjs().subtract(1, 'day').format('YYYY-MM-DD 23:59:59')
        } else if (this.valueId == 'week') {
          this.startDate = this.$dayjs().startOf('week').format('YYYY-MM-DD 00:00:00')
          this.endDate = this.$dayjs().endOf('week').format('YYYY-MM-DD 23:59:59')
        } else if (this.valueId == 'custom') {
          this.$refs.customDate.dateShow = true
        }
      }
      let menuIdx = this.menuList.findIndex((ele) => ele.key === this.menuId)
      if (menuIdx > -1) {
        this.menuList[menuIdx].value = this.valueId
      }
      this.updateDate()
    },
    updateDate() {
      let params = {}
      this.menuList.forEach((ele) => {
        if (ele.value && ele.value != '-99') {
          if (ele.key == 'time' && ele.value) {
            params.startDate = this.startDate
            params.endDate = this.endDate
          } else if (ele.key == 'sort' && ele.value) {
            if (ele.value == '1') {
              params.orderByFiled = 'createDate'
              params.sortable = '2'
            } else if (ele.value == '2') {
              params.orderByFiled = 'createDate'
              params.sortable = '1'
            } else if (ele.value == '3') {
              params.orderByFiled = 'dealDeadLine'
              params.sortable = '2'
            }
          } else {
            params[ele.key] = ele.value
          }
        } else {
          if (ele.key == 'time') {
            params.startDate = ''
            params.endDate = ''
          } else if (ele.key == 'sort') {
            params.orderByFiled = ''
            params.sortable = ''
          } else {
            params[ele.key] = ''
          }
        }
      })
      this.filterParams = params
    },
    customChange(val) {
      if (this.customMode == 'date') {
        this.startDate = this.$dayjs(val.startDate).format('YYYY-MM-DD 00:00:00')
        this.endDate = this.$dayjs(val.endDate).format('YYYY-MM-DD 23:59:59')
      } else if (this.customMode == 'datetime') {
        this.startDate = this.$dayjs(val.startDate).format('YYYY-MM-DD HH:mm:00')
        this.endDate = this.$dayjs(val.endDate).format('YYYY-MM-DD HH:mm:59')
      }
      this.updateDate()
    },

    handleSyncData() {
      console.log('同步数据', this.dataInfo)
    },
    updateStoreDate() {
      this.setDataInfo({ filterData: this.filterParams })
      console.log('更新数据', this.filterParams)
      return true
    },
    resetData() {
      this.menuList.forEach((ele) => {
        ele.value = ''
      })
      this.handleSelectMenu(this.menuList[0])
      this.updateDate();
      this.setDataInfo({ filterData: this.filterParams })
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-wrap {
  height: 40vh;
  display: flex;
  overflow: hidden;
  font-size: 30rpx;
  color: #333333;
  .menu-wrap {
    width: 32%;
    background: #f7f7f7;
    overflow: auto;
  }
  .list-wrap {
    flex: 1;
    overflow: auto;
    background: #ffffff;
  }
  .item-wrap {
    padding: 30rpx;
    font-size: 30rpx;
    border-bottom: 1rpx solid #eaeaea;
    @include flx-dsp($jsc: center, $ali: center);
    .list-name {
      flex: 1;
    }
    .select-icon {
      font-size: 36rpx;
    }
  }
  .custom-wrap {
    padding: 30rpx;
    font-size: 26rpx;
    border: 1rpx solid #eaeaea;
  }
  .active {
    background: #ffffff;
    color: #2761ff;
  }
}
</style>
