<template>
  <view>
    <dropdown-menu
      navHeight="88rpx" :navIndex="10" :contentHeight="contentHeight" maskTop="180rpx"
      :dataForm="filterForm" ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent"
    >
      <template v-slot="{ item }">
        <!-- 专业 -->
        <dropdown-radio :show="item.name == 'specialty'" :value="searchForm.specialtyId" :data="specialtyList" @confirm="confirmEvent('specialty', $event)" />
        <!-- 起单来源 -->
        <dropdown-radio :show="item.name == 'orignSource'" :value="searchForm.orignSourceId" :data="originSourceList" required @confirm="confirmEvent('orignSource', $event)" />
        <!-- 是否房修 -->
        <dropdown-radio :show="item.name == 'houseRepair'" :value="searchForm.houseFixStatusId" :data="houseRepairList" required @confirm="confirmEvent('houseRepair', $event)" />
        <!-- 筛选 -->
        <dropdown-multiple-tree :show="item.name == 'filter'" ref="treeEl" :value="getSelectNode" expand="submitDateScreen" :data="filterList" nodeKey="name" menuMultiple @confirm="confirmEvent('filter', $event)" @reset="dropResetEvent">
          <template v-slot>
            <view class="date-panel">
              <view :class="['date-range-panel', { read: !!searchForm.appointmentDate }]" @click="openDatePicker('start')">{{ searchForm.appointmentDate || '选择时间' }}</view>
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
import { findWorkUserList } from '@/service/landcrm'

export default {
  name: 'DropdownFilter',
  components: {
    DropdownMenu,
    DropdownRadio,
    DropdownStaff,
    dropdownMultipleTree
  },
  data() {
    return {
      filterForm: [
        { label: '专业', name: 'specialty', icon: 'down-icon',  },
        { label: '起单来源', name: 'orignSource', icon: 'down-icon' },
        { label: '是否房修', name: 'houseRepair', icon: 'down-icon' },
        { label: '筛选', name: 'filter', icon: 'screen-icon' },
      ],
      // 起单来源
      originSourceList: [
        { label: '全部', name: '' },
        { label: '自查下单', name: '0' },
        { label: '客户下单', name: '1' }
      ],
      // 是否房修
      houseRepairList: [
        { label: '全部', name: '' },
        { label: '是', name: '1' },
        { label: '否', name: '0' }
      ],
      filterList: [
        { label: '录单时间', name: 'submitDateScreen', isMultiple: false, isLazy: false, children: [
          { label: '今天', name: '1' },
          { label: '昨天', name: '2' },
          { label: '更多', name: '0' }
        ] },
        { label: '预约上门时间', name: 'applyTime', isMultiple: false, isLazy: false, isCustom: true }
      ],
      // 专业列表
      specialtyList: [{ label: '全部', name: '' }],
      searchForm: {
        orignSourceId: '', // 起单来源
        specialtyId: '', // 专业
        submitDateScreen: '', //录单时间
        appointmentDate: '', // 预约上门时间
      },
      dateRangeForm: {
        show: false,
        value: new Date(uni.$u.timeFormat(Date.now(), 'yyyy-mm-dd')).getTime() // 日期
      },
      contentHeight: 'auto', // 下拉菜单的固定高度
    }
  },
  computed: {
    getSelectNode() {
      return {
        submitDateScreen: [this.searchForm.submitDateScreen]
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
    },
    confirmEvent(name, item) {
      this.$refs.dropdownEl.showMaskEvent(false)  
      if (name == 'specialty') {
        this.searchForm.specialtyId = item.name || ''
        this.filterForm[0].label = item.name || '专业';
      } else if (name == 'orignSource') {
        this.searchForm.orignSourceId = item.name || '';
        this.filterForm[1].label = item.label || '起单来源';

      } else if (name == 'houseRepair') {
        this.searchForm.houseFixStatusId = item.name || '';
        this.filterForm[2].label = item.label || '是否房修';

      } else if (name == 'filter') {
        this.searchForm.submitDateScreen = item?.submitDateScreen?.children?.name ?? '';
 
      }

      this.$emit('confirm', this.searchForm)
    },
    dropResetEvent() {
      this.searchForm.submitDateScreen = ''
      this.searchForm.appointmentDate = ''
    },
    // 获取专业列表，被父组件调用
    async getWorkTypeList(areaId, projectId) {
      
    let { O_USER_INFO } = this.$constant;
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
    let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
      const params = {
        data: {
          companyId: companyId,
          areaId,
          projectId
        },
        hideLoading: true
      }
      const res = await findWorkUserList(params)
      this.specialtyList = (res.data || []).map(item => ({
        ...item,
        label: item.workName,
        name: item.workName
      }))
      this.specialtyList.unshift({ label: '全部', name: '' })
    },
    openDatePicker(type) {
      this.dateRangeForm.type = type
      this.dateRangeForm.show = true
    },
    dateConfirm(date) {
      const val = this.dateRangeForm.value = uni.$u.timeFormat(date.value, 'yyyy-mm-dd')
      this.searchForm.appointmentDate = val
      this.dateRangeForm.show = false
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