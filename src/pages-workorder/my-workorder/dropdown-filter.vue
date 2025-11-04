<template>
  <dropdown-menu navHeight="88rpx" :navIndex="10" contentHeight="auto" maskTop="270rpx" :dataForm="filterForm"
    :required="false" ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent">
    <template v-slot="{ item }">
      <dropdown-project :routerName="routerName" isAllArea :show="item.name == 'area'" @confirm="confirmEvent('area', $event)" />
      <dropdown-radio :show="item.name == 'task'" :value="searchForm.taskId" :data="taskList"
        required @confirm="confirmEvent('task', $event)" />
      <dropdown-staff :show="false" :areaId="searchForm.areaId" :projectId="searchForm.projectId"
        @confirm="confirmEvent('staff', $event)" />
      <!-- 筛选 -->
      <dropdown-multiple-tree :show="item.name == 'filter'" ref="staffEl" :expand="pageType == 'singleChat' ? 'overDayCount' : (reqReceiveData ? 'originalUserId' : '')"
        :value="getSelectNode" :data="staffList" menuMultiple @loadList="loadList" @reset="dropResetEvent"
        @confirm="confirmEvent('filter', $event)" />
    </template>
  </dropdown-menu>
</template>

<script>
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import DropdownProject from '@/components/dropdown-area/dropdown-project.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
import DropdownStaff from '@/components/dropdown-area/dropdown-staff.vue'
import DropdownMultipleTree from '@/components/dropdown-area/dropdown-multiple-tree.vue'
import { getQuesTaskOriginalUser } from '@/service/landcrm'

export default {
  name: 'DropdownFilter',
  components: {
    DropdownMenu,
    DropdownProject,
    DropdownRadio,
    DropdownStaff,
    DropdownMultipleTree
  },
  props: {
    pageType: String,
    routerName:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      filterForm: [
        { label: '全部', name: 'area', icon: 'down-icon' },
        { label: '任务状态', name: 'task', icon: 'down-icon' },
        { label: '筛选', name: 'filter', icon: 'screen-icon' }
      ],
      taskList: [
        { label: '全部', name: '' },
        { label: '待接单', name: '1' },
        { label: '待派单', name: '0' },
        { label: '处理中', name: '2' },
        { label: '已关闭', name: '4' },
        { label: '待确认', name: '3' },
      ],
      staffList: [
        { label: '受理人', name: 'originalUserId', isLazy: true },
        {
          label: '关闭时限', name: 'overDayCount', children: [
            { label: '1天到期', name: '0' },
            { label: '2-3天到期', name: '1' },
            { label: '4-5天到期', name: '2' },
            { label: '超期1天内', name: '3' },
            { label: '超期2-7天', name: '4' },
            { label: '超期8-15天', name: '5' },
            { label: '超期16-30天', name: '6' },
            { label: '超期30天以上', name: '7' },
          ]
        },
        {
          label: '支付状态', name: 'payStatus', children: [
            { label: '未支付', name: '0' },
            { label: '已支付', name: '1' },
            { label: '支付失败', name: '2' },
            { label: '已核销', name: '3' }
          ]
        }
      ],
      reqReceiveData: false, // 是否请求受理人数据。
      searchForm: {
        areaId: '',
        projectId: '',
        taskId: '',
        originalUserId: '', // 受理人
        overDayCount: '', // 关闭时限
        payStatus: '' // 支付状态
      }
    }
  },
  computed: {
    // 默认选中的节点
    getSelectNode() {
      return {
        originalUserId: [this.searchForm.originalUserId],
        overDayCount: [this.searchForm.overDayCount],
        payStatus: [this.searchForm.payStatus]
      }
    }
  },
  mounted() {
    if (this.pageType == 'singleChat') {
      // 从单聊进到我的工单，过滤条件这块，不需要显示受理人
      this.reqReceiveData = false
      // 选择完区域项目后，会关闭下拉列表，就需要重新请求下受理人数据
      this.$refs.staffEl.clearChildData('originalUserId')
      this.searchForm.originalUserId = ''
      this.$refs.staffEl.menuTable.splice(0, 1)
    }
  },
  methods: {
    // 显示菜单栏
    showMenuEvent(item) {
    },
    // 隐藏菜单栏
    hideMenuEvent() {
    },
    confirmEvent(name, item) {
      this.$refs.dropdownEl.showMaskEvent(false)

      if (name == 'area') {
        let projectId = item.project.projectId + ''
        this.filterForm[0].label = projectId.includes('-all') ? item.area.areaName : item.project.projectName
        this.searchForm.areaId = item.area.areaId + ''
        this.searchForm.projectId = projectId.includes('-all') ? '' : projectId // '[areaId]-all'表示区域下的全部项目

        // 需要加载筛选菜单栏的受理人数据
        this.reqReceiveData = false
        // 选择完区域项目后，会关闭下拉列表，就需要重新请求下受理人数据
        this.$refs.staffEl.clearChildData('originalUserId')
        this.searchForm.originalUserId = ''
        setTimeout(() => {
          this.reqReceiveData = true
        }, 0)
      } else if (name == 'task') {
        this.searchForm.taskId = item.name || '';
        this.filterForm[1].label = item.label || '任务状态'
      } else if (name == 'filter') {
        this.searchForm.originalUserId = item?.originalUserId?.children?.name ?? ''
        this.searchForm.overDayCount = item?.overDayCount?.children?.name ?? ''
        this.searchForm.payStatus = item?.payStatus?.children?.name ?? ''
      }

      this.$emit('confirm', this.searchForm)
    },
    dropResetEvent() {
      this.searchForm.originalUserId = ''
      this.searchForm.overDayCount = ''
      this.searchForm.payStatus = ''
    },
    // 加载受理人数据
    async loadList(item, next) {
      const res = await this.getJobArchUsers()
      next(res)
    },
    async getJobArchUsers() {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
      const params = {
        data: {
          companyId: companyId,
          userId: userInfo.userId,
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId
        },
        hideLoading: true
      }
      const res = await getQuesTaskOriginalUser(params)
      return (res.data || []).map((item) => ({
        ...item,
        label: item.userName,
        name: item.userId
      }))
    }
  }
}
</script>

<style></style>