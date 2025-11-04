<template>
  <view>
    <dropdown-menu
      navHeight="88rpx" :navIndex="10" :contentHeight="contentHeight" maskTop="180rpx"
      :dataForm="filterForm" ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent"
    >
      <template v-slot="{ item }">
        <!-- 回访状态 -->
        <dropdown-radio :show="item.name == 'visitState'" :value="searchForm.visitState" :data="visitState" required @confirm="confirmEvent('visitState', $event)" />
        <!-- 工单类型 -->
        <dropdown-radio :show="item.name == 'taskType'" :value="searchForm.visitType" :data="taskType" required @confirm="confirmEvent('visitType', $event)" />
        <!-- 筛选 -->
        <dropdown-multiple-tree
          :show="item.name == 'filter'" ref="treeEl" menuMultiple
          :value="getSelectNode" :expand="treeExpand" :data="filterList" nodeKey="name"
          @confirm="confirmEvent('filter', $event)" @reset="dropResetEvent" @loadList="loadBuildingList"
        >
          <template v-slot>
            <view class="date-panel">
              <view :class="['date-range-panel', { read: !!searchForm.createDateStart }]" @click="openDatePicker('start')">{{ searchForm.createDateStart || '开始日期' }}</view> -
              <view :class="['date-range-panel', { read: !!searchForm.createDateEnd }]" @click="openDatePicker('end')">{{ searchForm.createDateEnd || '结束日期' }}</view>
            </view>
          </template>
        </dropdown-multiple-tree>
      </template>
    </dropdown-menu>

    <!-- 预约上门时间 -->
    <u-datetime-picker :show="dateRangeForm.show" v-model="dateRangeForm.value" mode="date" @close="dateRangeForm.show = false" @cancel="dateRangeForm.show = false" @confirm="dateConfirm" />
  </view>
  
</template>

<script>
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
import DropdownStaff from '@/components/dropdown-area/dropdown-staff.vue'
import dropdownMultipleTree from '@/components/dropdown-area/dropdown-multiple-tree.vue'
import { getBuildingDetailList } from '@/service/landcrm'

export default {
  name: 'DropdownFilter',
  components: {
    DropdownMenu,
    DropdownRadio,
    DropdownStaff,
    dropdownMultipleTree
  },
  data() {
    this._lazyLoadNext = () => {}

    return {
      filterForm: [
        { label: '回访状态', name: 'visitState', icon: 'down-icon' },
        { label: '工单类型', name: 'taskType', icon: 'down-icon' },
        { label: '筛选', name: 'filter', icon: 'screen-icon' },
      ],
      // 回访状态
      visitState: [
        { label: '全部', name: '' },
        { label: '待回访', name: '1' },
        { label: '不成功回访', name: '3' },
        { label: '成功回访', name: '2' },
        { label: '无需回访', name: '4' },
        { label: '已生成', name: '6' },
        { label: '回访超时关闭', name: '7' }
      ],
      // 工单类型
      taskType: [
        { label: '全部', name: '' },
        { label: '报事', name: '4' },
        { label: '报修', name: '2' },
        { label: '投诉', name: '1' },
        { label: '咨询', name: '3' }
      ],
      filterList: [
        { label: '楼栋', name: 'buildingId', isMultiple: false, isLazy: true },
        { label: '点评来源', name: 'taskSource', isMultiple: false, isLazy: false, children: [
          { label: '微信点评', name: '1' },
          { label: '回访点评', name: '2' }
        ] },
        { label: '是否解决', name: 'isSolve', isMultiple: false, isLazy: false, children: [
          { label: '是', name: '1' },
          { label: '否', name: '2' }
        ] },
        { label: '生成时间段', name: 'createDate', isMultiple: false, isLazy: false, isCustom: true }
      ],
      treeExpand: 'buildingId', // 树形下拉默认展开的一级菜单
      searchForm: {
        visitState: '', // 回访状态
        visitType: '', // 工单类型
        buildingId: '', // 楼栋
        taskSource: '', // 点评来源
        isSolve: '', // 是否解决
        createDateStart: '', // 生成开始日期
        createDateEnd: '' // 生成结束日期
      },
      dateRangeForm: {
        type: '', // start: 开始日期, end: 结束日期
        show: false,
        value: new Date(uni.$u.timeFormat(Date.now(), 'yyyy-mm-dd')).getTime() // 日期
      },
      contentHeight: 'auto', // 下拉菜单的固定高度
    }
  },
  computed: {
    // 默认选中的节点
    getSelectNode() {
      return {
        buildingId: [this.searchForm.buildingId],
        taskSource: [this.searchForm.taskSource],
        isSolve: [this.searchForm.isSolve]
      }
    }
  },
  async created() {
  },
  methods: {
    // 显示菜单栏
    showMenuEvent(item) {
      if (item.name == 'specialty') {
        this.contentHeight = '700rpx'
      } else {
        this.contentHeight = 'auto'
      }
    },
    // 隐藏菜单栏
    hideMenuEvent() {
      const startTmp = this.searchForm.createDateStart
      const endTmp = this.searchForm.createDateEnd
      if (startTmp && endTmp && endTmp <= startTmp) {
        // 结束日期小于等于开始日期时，清空生成时间段
        this.searchForm.createDateStart = ''
        this.searchForm.createDateEnd = ''
      }
    },
    confirmEvent(name, item) {
      let startTmp = ''
      let endTmp = ''

      if (name == 'visitState') {
        this.searchForm.visitState = item.name || '';
        this.filterForm[0].label = item.label || '回访状态';
      } else if (name == 'visitType') {
        this.searchForm.visitType = item.name || '';
        this.filterForm[1].label = item.label || '工单类型';
      } else if (name == 'filter') {
        this.searchForm.buildingId = item?.buildingId?.children?.name || ''
        this.searchForm.taskSource = item?.taskSource?.children?.name || ''
        this.searchForm.isSolve = item?.isSolve?.children?.name || ''
        
        // 处理日期
        startTmp = this.DateStrToTime(this.searchForm.createDateStart)
        endTmp = this.DateStrToTime(this.searchForm.createDateEnd)

        if (startTmp && endTmp && endTmp <= startTmp) {
          uni.showToast({
            title: '结束日期不能小于等于开始日期',
            icon: 'none'
          })
          return
        }

        if (!startTmp || !endTmp) {
          this.searchForm.createDateStart = startTmp = ''
          this.searchForm.createDateEnd = endTmp = ''
        }
      }

      this.$refs.dropdownEl.showMaskEvent(false)
      this.$emit('confirm', Object.assign({}, this.searchForm, {
        createDateStart: startTmp ? uni.$u.timeFormat(startTmp, 'yyyy-mm-dd 00:00:00') : '',
        createDateEnd: endTmp ? uni.$u.timeFormat(endTmp, 'yyyy-mm-dd 23:59:59') : '',
      }))
    },
    // 重置数据
    dropResetEvent() {
      this.searchForm.buildingId = ''
      this.searchForm.taskSource = ''
      this.searchForm.isSolve = ''
      this.searchForm.createDateStart = ''
      this.searchForm.createDateEnd = ''

      this.$refs.dropdownEl.showMaskEvent(false)
      this.$emit('confirm', this.searchForm)
    },
    // 触发下拉菜单里的 生成时间段，显示日期选择器
    openDatePicker(type) {
      this.dateRangeForm.type = type
      this.dateRangeForm.show = true
    },
    // 日期选择器事件
    dateConfirm(date) {
      const val = this.dateRangeForm.value = uni.$u.timeFormat(date.value, 'yyyy-mm-dd')
      if (this.dateRangeForm.type == 'start') {
        this.searchForm.createDateStart = val
      } else if (this.dateRangeForm.type == 'end') {
        this.searchForm.createDateEnd = val
      }

      // 隐藏 日期选择器
      this.dateRangeForm.type = ''
      this.dateRangeForm.show = false
    },
    // 懒加载楼栋数据
    loadBuildingList(item, next) {
      this._lazyLoadNext = next
    },
    // 获取楼栋数据，被父级的区域项目组件调用
    async getBuildingDetailList(areaId, projectId) {
      // 清楚下拉列表里的楼栋的数据
      this.$refs.treeEl.clearChildData('buildingId')
      this.searchForm.buildingId = ''

      const params = {
        data: {
          areaId,
          projectId,
          startIndex: 1,
          pageSize: 9999
        }
      }
      const res = await getBuildingDetailList(params)
      const data = (res.data || []).map(item => ({
        ...item,
        label: item.buildingLocation,
        name: item.buildingId
      }))
      // 重新加载楼栋数据
      this._lazyLoadNext(data)
    },
    // 将日期字符串转换为数字格式
    DateStrToTime(val) {
      if (!val) return 0
      return new Date(val.replace(/-/g, '/')).getTime()
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>