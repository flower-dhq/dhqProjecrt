<template>
  <view>
    <dropdown-menu
      navHeight="88rpx" :navIndex="10" :contentHeight="contentHeight" contentMinHeight="184rpx" maskTop="180rpx"
      :dataForm="filterForm" ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent"
    >
      <template v-slot="{ item }">
        <!-- 拜访状态 -->
        <dropdown-radio :show="item.name == 'taskState'" :value="searchForm.visitTaskState" :data="stateList" required @confirm="confirmEvent('taskState', $event)" />
        <!-- 拜访计划 -->
        <dropdown-radio :show="item.name == 'visitPlan'" :value="searchForm.visitPlanId" :data="planList" required @confirm="confirmEvent('visitPlan', $event)" />
        <!-- 拜访人 -->
        <dropdown-radio :show="item.name == 'visitUser'" :value="searchForm.visitUserId" :data="userList" required @confirm="confirmEvent('visitUser', $event)" />
      </template>
    </dropdown-menu>
  </view>
  
</template>

<script>
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
import DropdownStaff from '@/components/dropdown-area/dropdown-staff.vue'
import dropdownMultipleTree from '@/components/dropdown-area/dropdown-multiple-tree.vue'
import { getCustomerVisitPlanList } from '@/service/returnVisit'

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
    const { O_USER_INFO } = this.$constant
    const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })

    return {
      userId: userInfo.userId,
      filterForm: [
        { label: '状态', name: 'taskState', icon: 'down-icon' },
        { label: '拜访计划', name: 'visitPlan', icon: 'down-icon' },
        { label: '拜访人', name: 'visitUser', icon: 'screen-icon' },
      ],
      // 拜访状态
      stateList: [
        { label: '全部', name: '' },
        { label: '进行中', name: '1' },
        { label: '已结束', name: '2' }
      ],
      // 拜访计划
      planList: [],
      // 拜访人
      userList: [
        { label: '全部', name: '' },
        { label: '自己', name: userInfo.userId }
      ],
      searchForm: {
        visitTaskState: '', // 拜访状态
        visitPlanId: '', // 拜访计划
        visitUserId: '', // 拜访人
      },
      contentHeight: 'auto', // 下拉菜单的固定高度
    }
  },
  methods: {
    // 显示菜单栏
    showMenuEvent(item) {
      if (item.name == 'visitPlan') {
        this.contentHeight = '700rpx'
      } else {
        this.contentHeight = 'auto'
      }
    },
    // 隐藏菜单栏
    hideMenuEvent() {
    },
    confirmEvent(name, item) {
      this.$refs.dropdownEl.showMaskEvent(false)

      if (name == 'taskState') {
        this.searchForm.visitTaskState = item.name || '';
        this.filterForm[0].label = item.label || '状态';
      } else if (name == 'visitPlan') {
        this.searchForm.visitPlanId = item.name || '';
        this.filterForm[1].label = item.label || '拜访计划';
      } else if (name == 'visitUser') {
        this.searchForm.visitUserId = item.name || '';
        this.filterForm[2].label = item.label || '拜访人';
      }

      this.$emit('confirm', this.searchForm)
    },
    // 获取客户拜访计划，被父级的区域项目组件调用
    async getCustomerVisitPlanList(projectId) {
      const params = {
        data: {
          startIndex: 1,
          pageSize: 99999,
          userId: this.userId,
          projectId
        },
        wrapResponse: true,
      }
      const res = await getCustomerVisitPlanList(params)
      this.planList = (res.data.data || []).map(item => ({
        label: item.visitPlanName,
        name: item.visitPlanId
      }))
      this.planList.unshift({
        label: '全部',
        name: ''
      })
    },
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