<template>
  <dropdown-menu navHeight="88rpx" :navIndex="10" :contentHeight="contentHeight" maskTop="180rpx" :dataForm="filterForm"
    ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent">
    <template v-slot="{ item }">
      <!-- 任务类型 -->
      <dropdown-radio :show="item.name == 'taskType'" :value="searchForm.biProblemCategory" :data="taskTypeList"
        @confirm="confirmEvent('taskType', $event)" />
      <!-- 任务状态 -->
      <dropdown-radio :show="item.name == 'taskState'" :value="searchForm.quesTaskState" :data="taskStatusList"
        @confirm="confirmEvent('taskState', $event)" />
      <!-- 筛选 -->
      <dropdown-multiple-tree :show="item.name == 'filter'" expand="handleType" :value="getSelectNode"
        :data="filterList" nodeKey="name" menuMultiple @confirm="confirmEvent('filter', $event)"
        @reset="dropResetEvent" />
      <!-- 专业 -->
      <dropdown-radio :show="item.name == 'specialty'" :value="searchForm.workTypeName" :data="specialtyList"
        @confirm="confirmEvent('specialty', $event)" />
    </template>
  </dropdown-menu>
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
        { label: '任务类型', name: 'taskType', icon: 'down-icon' },
        { label: '任务状态', name: 'taskState', icon: 'down-icon' },
        { label: '筛选', name: 'filter', icon: 'screen-icon' },
        { label: '专业', name: 'specialty', icon: 'down-icon' }
      ],
      taskTypeList: [
        { label: '全部(0)', name: '5,6,9,10,11' },
        { label: '报修(0)', name: '5' },
        { label: '报事(0)', name: '11' },
        { label: '投诉(0)', name: '6' },
        { label: '咨询(0)', name: '9' },
        { label: '表扬(0)', name: '10' }
      ],
      taskStatusList: [
        { label: '全部未关闭', name: '' },
        // { label: '待指派', name: '1' },
        { label: '待接单', name: '1' },
        { label: '待派单', name: '0' },
        { label: '处理中', name: '2' },
        // { label: '已完成', name: '5' },
        { label: '已关闭', name: '4' },
        // { label: '已回访', name: '7' },
        { label: '待确认', name: '3' },
        { label: '已暂停', name: '5' }
      ],
      filterList: [
        // handleType
        {
          label: '办理人', name: 'handleType', isRequired: true, children: [
            { label: '全部', name: '0' },
            { label: '我受理的', name: '1' },
            { label: '我办理的', name: '3' }
          ]
        },
        // exception
        {
          label: '异常审批', name: 'exception', children: [
            { label: '作废申请中', name: '1' },
            { label: '暂停申请中', name: '2' },
            { label: '非关申请中', name: '3' },
            { label: '已作废', name: '4' },
            { label: '已暂停', name: '5' },
            { label: '已非关', name: '6' }
          ]
        },
        // submitDateScreen
        {
          label: '受理时间', name: 'submitDateScreen', children: [
            { label: '今天', name: '1' },
            { label: '昨天', name: '2' },
            { label: '更多', name: '3' }
          ]
        },
        // payStatus
        {
          label: '支付状态', name: 'payStatus', children: [
            { label: '未支付', name: '0' },
            { label: '已支付', name: '1' },
            { label: '支付失败', name: '2' },
            { label: '已核销', name: '3' }
          ]
        },
        // sort
        {
          label: '排序方式', name: 'sort', isRequired: true, children: [
            { label: '受理时间（最近优先）', name: '2' },
            { label: '受理时间（最早优先）', name: '3' },
            { label: '处理超期（最久优先）', name: '5' }
          ]
        },
        // sourceType
        {
          label: '录单系统', name: 'sourceType', children: [
            { label: '地产', name: '12' },
            { label: '物业', name: '-1' },
            { label: '巡检', name: '22' },
            { label: '维保', name: '23' },
            { label: '品质', name: '24' },
            { label: '巡逻', name: '25' }
          ]
        }
      ],
      // 专业列表
      specialtyList: [{ label: '全部', name: '' }],
      searchForm: {
        biProblemCategory: '5,6,9,10,11',
        quesTaskState: '',
        workTypeName: '',
        handleType: '0',//办理人
        exception: '',//异常审批
        submitDateScreen: '',//受理时间
        payStatus: '',//支付状态
        sort: '2', //排序（默认显示 受理时间(最早优先)）
        sourceType: ''//录单系统
      },
       contentHeight: 'auto', // 下拉菜单的固定高度
       selectFilter:{}
    }
  },
  computed: {
    getSelectNode() {
      return {
        handleType: [this.searchForm.handleType],
        exception: [this.searchForm.exception],
        submitDateScreen: [this.searchForm.submitDateScreen],
        payStatus: [this.searchForm.payStatus],
        sort: [this.searchForm.sort],
        sourceType: [this.searchForm.sourceType]
      }
    }
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
      const splitStr = (val) => val.split('-').slice(-1)[0] || '';
      const splitStrLabel = (val)=>val.split('(')[0] || ''

      if (name == 'taskType') {
        this.searchForm.biProblemCategory = splitStr(item.name);
        this.filterForm[0].label = splitStrLabel(item.label) || '任务类型';
      } else if (name == 'taskState') {
        this.searchForm.quesTaskState = splitStr(item.name);
        this.filterForm[1].label = splitStrLabel(item.label) || '任务状态';
      } else if (name == 'specialty') {
        this.searchForm.workTypeName = item.name;
        this.filterForm[3].label = item.name || '专业';
      } else if (name == 'filter') {
        this.searchForm.handleType = item?.handleType?.children?.name ?? ''
        this.searchForm.exception = item?.exception?.children?.name ?? ''
        this.searchForm.submitDateScreen = item?.submitDateScreen?.children?.name ?? ''
        this.searchForm.payStatus = item?.payStatus?.children?.name ?? ''
        this.searchForm.sort = item?.sort?.children?.name ?? ''
        this.searchForm.sourceType = item?.sourceType?.children?.name ?? ''
      }

      this.$emit('confirm', this.searchForm)
    },
    dropResetEvent() {
      this.selectFilter = {}; 
      this.searchForm.handleType = '0';
      this.searchForm.exception = '';
      this.searchForm.submitDateScreen = '';
      this.searchForm.payStatus = '';
      this.searchForm.sort = '2';
      this.searchForm.sourceType = '';
     },
    // 获取专业列表，被父组件调用
    async findWorkUserList(areaId, projectId) {
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
  }
}
</script>

<style></style>