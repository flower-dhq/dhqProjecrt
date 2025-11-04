<template>
  <view class="dropdown-filter" :style="[THEME_CSS_VAR]">
    <view class="search-box">
      <u-search class="search-cont" placeholder="输入待办分类/任务标题/任务摘要搜索" v-model="searchForm.keyword" color="#999999" shape="square" :showAction="false" />
      <view class="search-btn">
        <dropdown-menu navHeight="88rpx" :navIndex="10" contentHeight="auto" maskTop="340rpx" :dataForm="filterForm"
          ref="dropdownEl" @showMask="showProjectMenu(false)" @hideMask="hideMenuEvent">
          <template v-slot="{ item }">
            <dropdown-multiple-tree :show="item.name == 'filter'" expand="startTime" :value="getSelectNode"
              :data="filterList" nodeKey="name" menuMultiple @confirm="confirmEvent('filter', $event)"
              @reset="dropResetEvent"
            >
              <template v-slot="{ node }">
                <view class="date-panel" v-if="node.data.currentKey == 'startTime'">
                  <view :class="['date-range-panel', { read: !!searchForm.startDate }]" @click="openDatePicker('actStart')">{{ searchForm.startDate || '开始日期' }}</view> -
                  <view :class="['date-range-panel', { read: !!searchForm.endDate }]" @click="openDatePicker('actEnd')">{{ searchForm.endDate || '结束日期' }}</view>
                </view>
              </template>
            </dropdown-multiple-tree>
          </template>
        </dropdown-menu>
      </view>
    </view>
    <!-- 活动日期 -->
    <u-datetime-picker ref="datetimeEl" :show="dateObj.isShow" v-model="dateObj.value" mode="date" @close="dateObj.isShow = false" @cancel="dateObj.isShow = false" @confirm="datetimeConfirm" />
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import dropdownMultipleTree from '@/components/dropdown-area/dropdown-multiple-tree.vue'

/**
 * 会员活动的条件筛选
 */
export default {
  options:{
    styleIsolation: 'shared' //用于无法修改组件样式
  },
  name: 'DropdownFilter',
  mixins: [mpMixin],
  components: {
    DropdownMenu,
    dropdownMultipleTree
  },
  data() {
    // 获取今年的日期
    const nowDate = new Date()
    nowDate.getFullYear()
    return {
      searchForm: {
        keyword: '', // 标题搜索
        startDate: '', // 活动报名开始日期
        endDate: '', // 活动报名结束日期
      },
      projectMenu: {
        isShow: false,
        label: ''
      },
      filterForm: [
        { label: '筛选 ', name: 'filter', icon: 'down-icon' }
      ],
      filterList: [
        { label: '开始时间', name: 'startTime', isRequired: true, isCustom: true, isLazy: false },
      ],
      dateObj: {
        isShow: false,
        value: new Date(uni.$u.timeFormat('', 'yyyy/mm/dd 00:00:00')).getTime(),
        type: '', // 打开类型
      }
    }
  },
  computed: {
    getSelectNode() {
      return {
        // startTime: [this.searchForm.startDate],
        // endDate: [this.searchForm.endDate]
      }
    }
  },
  methods: {
    // 显示项目下拉菜单
    showProjectMenu(isShow) {
      if (typeof(isShow) == 'boolean') {
        this.projectMenu.isShow = isShow
      } else {
        this.$refs.dropdownEl.showMaskEvent(false) // 隐藏条件筛选下拉菜单
        this.projectMenu.isShow = !this.projectMenu.isShow
      }
    },
    initData() {
      this.$emit('confirm', this.handleDate(this.searchForm))
    },
    hideMenuEvent() {},
    // 条件筛选下拉菜单确认事件
    confirmEvent(name, item) {
      let actStartTmp = this.searchForm.startDate
      let actEndTmp = this.searchForm.endDate

      if (name == 'filter') {
        // 验证日期
        const validAct = this.validatorDate(actStartTmp, actEndTmp)
        if (!validAct.success && validAct.code == 'reFillData') return
        if (!validAct.success && validAct.code == 'initData') {
          this.searchForm.startDate = ''
          this.searchForm.endDate = ''
        }
      }
      this.$refs.dropdownEl.showMaskEvent(false)
      this.$emit('confirm', this.handleDate(this.searchForm))
    },
    // 将日期转换为具体到时间
    toDateTime(date, type) {
      let timeStr = type == 'start' ? '00:00:00' : '23:59:59'
      return date ? uni.$u.timeFormat(date, 'yyyy-mm-dd ' + timeStr) : ''
    },
    // 处理日期数据
    handleDate(formData) {
      return Object.assign({}, formData, {
        startDate: this.toDateTime(this.searchForm.startDate, 'start'),
        endDate: this.toDateTime(this.searchForm.endDate, 'end'),
      })
    },
    // 验证日期
    validatorDate(startDate, endDate) {
      const startTmp = this.DateStrToTime(startDate)
      const endTmp = this.DateStrToTime(endDate)

      if (startTmp && endTmp && endTmp < startTmp) {
        uni.showToast({
          title: '结束日期不能小于开始日期',
          icon: 'none'
        })
        return { success: false, code: 'reFillData' }
      }

      if (!startTmp || !endTmp) {
        return { success: false, code: 'initData' }
      }

      return { success: true }
    },
    // 将日期字符串转换为数字格式
    DateStrToTime(val) {
      if (!val) return 0
      return new Date(val.replace(/-/g, '/')).getTime()
    },
    // 条件筛选下拉菜单重置事件
    dropResetEvent() {
      this.searchForm.actForm = ''
      this.searchForm.startDate = ''
      this.searchForm.endDate = ''
    },
    // 打开日期选择器
    openDatePicker(type) {
      this.dateObj.type = type
      this.dateObj.isShow = true

      // 如果 datetime 为空，则表示获取当前时间
      const getTime = (datetime) => new Date(uni.$u.timeFormat(datetime || '', 'yyyy/mm/dd 00:00:00')).getTime()
      if (type == 'actStart') {
        this.dateObj.value = getTime(this.searchForm.startDate)
      } else if (type == 'actEnd') {
        this.dateObj.value = getTime(this.searchForm.endDate)
      }

      setTimeout(() => {
        this.$refs.datetimeEl.init()
      })
    },
    // 日期选择器确认事件
    datetimeConfirm(date) {
      const val = uni.$u.timeFormat(date.value, 'yyyy-mm-dd')
      const type = this.dateObj.type
      if (type == 'actStart') {
        this.searchForm.startDate = val
      } else if (type == 'actEnd') {
        this.searchForm.endDate = val
      }
      this.dateObj.isShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-filter {
  width: 100%;
  // background: #fff;
  position: relative;
}
::v-deep .dropdown-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  // padding: 14rpx 20rpx;
  position: unset;
}
::v-deep .content-panel{
  z-index: 10 !important;
}
.search-btn ::v-deep .navigator-panel{
  border: unset;
  background-color: unset;
  padding: 0 30rpx;
}
.btn-panel {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 204rpx;
  height: 60rpx;
  background-color: var(--app-primary-color);
  color: #fff;
  border-radius: 6rpx;
  font-size: 26rpx;
  font-family: 'PingFang SC';
  padding: 0 10rpx;
  box-sizing: border-box;
  margin-right: 20rpx;
}
.btn-text {
  @include ellipsis(1)
}
.date-panel {
  display: flex;
  padding: 30rpx;
}
.date-range-panel {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  border: 1px solid #CCC;
  box-sizing: border-box;
  padding: 0 24rpx;
  width: 220rpx;
  height: 60rpx;
  color: #999;
  font-size: 26rpx;
  border-radius: 4rpx;

  &.read {
    color: #333;
  }
}
.date-range-gap {
  width: 70rpx;
  height: 60rpx;
  text-align: center;
  line-height: 60rpx;
  color: #999;
  font-size: 26rpx;
}
.search-box{
  display: flex;
  padding:0 0 30rpx 30rpx;
  .search-cont{
    flex: 1;
    border: 2rpx solid #0064FF;
    border-radius: 10rpx;
    background-color: #fff;
  }
}
::v-deep .u-search__content{
  background-color: #fff !important;
}
::v-deep .u-search__content__input{
  background-color: #fff !important;
}
.search-btn{
  // padding: 0 30rpx;
  font-size: 32rpx;
  line-height: 72rpx;
}
</style>