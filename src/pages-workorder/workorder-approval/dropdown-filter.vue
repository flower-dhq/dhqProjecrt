<template>
  <view>
    <view class="header-panel">
      <dropdown-btn ref="btnEl" routerName="mywork" isAllArea maskTop="90rpx" :navIndex="11" contentTop="16rpx" contentHeight="612rpx;" @confirm="areaProjectEvent" @showMask="hideMenuEvent('navigator')" />
      <u-search
        placeholder="楼栋、房号、客户姓名、电话、单号、任务内容" v-model="searchForm.keyword" shape="square"
        :showAction="false" searchIcon=" " height="56rpx" clearabled @blur="searchConfirm"
      />
    </view>
    <dropdown-menu
      navHeight="88rpx" :navIndex="10" contentHeight="auto" maskTop="180rpx"
      :dataForm="filterForm" ref="dropdownEl" @showMask="hideMenuEvent('btn')"
    >
      <template v-slot="{ item }">
        <!-- 审批类型 -->
        <dropdown-radio :show="item.name == 'approvalType'" :value="searchForm.approvalType" :data="typeList" required @confirm="confirmEvent('approvalType', $event)" />
        <!-- 审批状态 -->
        <dropdown-radio :show="item.name == 'approvalStatus'" :value="searchForm.approvalStatus" :data="statusList" required @confirm="confirmEvent('approvalStatus', $event)" />
        <!-- 经手人 -->
        <dropdown-radio :show="item.name == 'applicant'" :value="searchForm.applicant" :data="applicantList" required @confirm="confirmEvent('applicant', $event)"  />
        <!-- 筛选 -->
        <dropdown-multiple-tree :show="item.name == 'filter'" ref="filterEl" expand="submitDate" :value="getSelectNode" :data="filterList" nodeKey="name" menuMultiple @loadList="loadList" @confirm="confirmEvent('filter', $event)" @reset="resetEvent" />
      </template>
    </dropdown-menu>
  </view>
</template>

<script>
import DropdownBtn from '@/components/dropdown-area/dropdown-btn.vue'
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
import DropdownStaff from '@/components/dropdown-area/dropdown-staff.vue'
import dropdownMultipleTree from '@/components/dropdown-area/dropdown-multiple-tree.vue'
import { getJobArchUsers } from '@/service/landcrm'

export default {
  name: 'DropdownFilter',
  components: {
    DropdownBtn,
    DropdownMenu,
    DropdownRadio,
    DropdownStaff,
    dropdownMultipleTree
  },
  data() {
    const { O_USER_INFO } = this.$constant
    const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
    const userId = userInfo.userId
    const nowDate = new Date()

    return {
      filterForm: [
        { label: '审批类型', name: 'approvalType', icon: 'down-icon' },
        { label: '审批状态', name: 'approvalStatus', icon: 'down-icon' },
        { label: '经手人', name: 'applicant', icon: 'down-icon' },
        { label: '筛选', name: 'filter', icon: 'screen-icon' },
      ],
      typeList: [
        { label: '全部', name: '' },
        { label: '暂停审批', name: 1 },
        { label: '作废审批', name: 2 },
        { label: '非正常关闭审批', name: 3 },
        { label: '对外回复审批', name: 4 },
        { label: '工时审批', name: 5 },
        { label: '房修审批', name: 6 },
      ],
      statusList: [
        { label: '全部', name: '' },
        { label: '待审批', name: 1 },
        { label: '已审批', name: 2 },
        { label: '已拒绝', name: 3 },
      ],
      applicantList: [
        { label: '全部', name: '' },
        { label: '我发起的', name: 1 },
        { label: '我审批的', name: 2 }
      ],
      filterList: [
        { label: '提交时间', name: 'submitDate', children: [
          { label: '近一个季度', name: uni.$u.timeFormat(nowDate.setMonth(nowDate.getMonth() - 3), 'yyyy-mm-dd') },
          { label: '近半年', name: uni.$u.timeFormat(nowDate.setMonth(nowDate.getMonth() - 6), 'yyyy-mm-dd') },
          { label: '近一年', name: uni.$u.timeFormat(nowDate.setFullYear(nowDate.getFullYear() - 1), 'yyyy-mm-dd') }
        ] },
        { label: '处理时限', name: 'overdue', isMultiple: false, isLazy: false, children: [
          { label: '2-3天到期', name: '2' },
          { label: '1天到期', name: '1' },
          { label: '超期1天内', name: '3' },
          { label: '超期2-7天', name: '4' },
          { label: '超期8-15天', name: '5' },
          { label: '超期16-30天', name: '6' },
          { label: '超期30天以上', name: '7' }
        ] },
        { label: '受理人', name: 'originalUserIds', isMultiple: false, isLazy: true },
      ],
      searchForm: {
        areaId: '',
        projectId: '',
        keyword: '',
        approvalType: '',
        approvalStatus: '',
        applicant: '', // 经手人id
        submitDate: '', // 提交时间
        overdue: '', // 处理时限
        originalUserIds: '', // 受理人id
      },
      reqReceiveData: false, // 是否请求受理人数据。
    }
  },
  computed: {
    getSelectNode() {
      return {
        submitDate: [this.searchForm.submitDate],
        overdue: [this.searchForm.overdue],
        originalUserIds: [this.searchForm.originalUserIds],
      }
    },
  },
  methods: {
    // 隐藏菜单栏
    hideMenuEvent(type) {
      if (type == 'btn') {
        this.$refs.btnEl.showMaskEvent(false)
      } else if (type == 'navigator') {
        this.$refs.dropdownEl.showMaskEvent(false)
      }
    },
    // 下拉列表 选择事件
    confirmEvent(name, item) {
      this.hideMenuEvent('navigator')

      if (name == 'approvalType') {
        this.searchForm.approvalType = item.name || '';
        this.filterForm[0].label = item.label || '审批类型';
      } else if (name == 'approvalStatus') {
        this.searchForm.approvalStatus = item.name || '';
        this.filterForm[1].label = item.label || '审批状态';

      } else if (name == 'applicant') {
        this.searchForm.applicant = item.name || '';
        this.filterForm[2].label = item.label || '经手人';

      } else if (name == 'filter') {
        this.searchForm.submitDate = item?.submitDate?.children?.name ?? ''
        this.searchForm.overdue = item?.overdue?.children?.name ?? ''
        this.searchForm.originalUserIds = item?.originalUserIds?.children?.name ?? ''
      }

      this.$emit('confirm', this.searchForm)
    },
    resetEvent() {
      this.searchForm.submitDate = ''
      this.searchForm.overdue = ''
      this.searchForm.originalUserIds = ''

      this.hideMenuEvent('navigator')
      this.$emit('confirm', this.searchForm)
    },
    // 区域-项目 选择事件
    areaProjectEvent(data) {
      this.searchForm.areaId = data.areaId
      this.searchForm.projectId = data.projectId

      // 需要加载筛选菜单栏的受理人数据
      this.reqReceiveData = false
      // 选择完区域项目后，会关闭下拉列表，就需要重新请求下受理人数据
      this.$refs.filterEl.clearChildData('recipient')
      this.searchForm.recipient = ''
      setTimeout(() => {
        this.reqReceiveData = true
      }, 0)

      this.$emit('confirm', this.searchForm)
    },
    // 搜索事件
    searchConfirm() {
      this.$emit('confirm', this.searchForm)
    },
    // 请求子节点列表
    async loadList(item, next) {
      const res = await this.getJobArchUsers()
      next(res)
    },
    // 获取受理人数据
    async getJobArchUsers() {
      const params = {
        data: {
          jobId: '',
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId 
        },
        hideLoading: true
      }
      const res = await getJobArchUsers(params)
      return (res.data || []).map((item) => ({
        ...item,
        label: item.userName,
        name: item.userId
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.header-panel {
  @include flx-dsp(flex-start, flex-start);
  background-color: #fff;
  border-bottom: 1px solid #f8f8f8;
}
</style>