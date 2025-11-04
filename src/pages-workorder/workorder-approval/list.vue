<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <dropdown-filter ref="navigatorEl" @confirm="dropdownEvent" />
    </u-sticky>
    <workorder-approval-sheet v-for="(item, index) in dataList" :key="index" :data="item" @submit="handleSubmit" />
    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />
  </view>
</template>

<script>
import DropdownFilter from './dropdown-filter.vue'
import WorkorderApprovalSheet from '@/pages-workorder/modules/workorder-approval-sheet.vue'
import approvalStore from './approvalStore'
import pageRefresh from '@/js/pageRefresh'
import { getCrmApproval } from '@/service/landcrm'

export default {
  components: {
    DropdownFilter,
    WorkorderApprovalSheet
  },
  data() {
    return {
      searchForm: {
        areaId: '',
        projectId: '',
        keyword: '',
        approvalType: '',
        approvalStatus: '',
        applicant: '', // 经手人id
        startDate: '',
        endDate: '',
        dealStartDate: '',
        dealEndDate: '',
        originalUserIds: '', // 受理人id
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'loading' // loading, nomore
      },
      dataList: [],
    }
  },
  computed: {
    isLastPage() {
      return this.dataList.length >= this.pageForm.total
    }
  },
  onPullDownRefresh() {
    this.initData()
  },
  async onReachBottom() {
    this.getData(this.pageForm.current + 1)
  },
  created() {
    pageRefresh.restore('WORK_ORDER_APPROVAL')
  },
  mounted() {
    // 不需要请求，因为下拉菜单栏需要设置默认区域和项目，会发起请求的
    // this.initData()
  },
  onShow() {
    approvalStore.restore()

    if (pageRefresh.isRefresh('WORK_ORDER_APPROVAL', true)) {
      // 同意/拒绝审批后，需要刷新页面
      this.initData()
    }
  },
  methods: {
    // 获取数据
    async getData(pageIndex = 1) {
      if (pageIndex != 1 && this.isLastPage) {
        // 最后一页
        this.pageForm.loadMore = 'nomore'
        return
      }
      if (pageIndex == 1) {
        // 滚动到顶部
        this.dataList = []
        this.pageForm.total = 0
        uni.pageScrollTo({ scrollTop: 0 })
      }

      this.pageForm.loadMore = 'loading'
      this.pageForm.current = pageIndex
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      const params = {
        data: {
          pageNum: pageIndex,
          pageSize: this.pageForm.size,
          companyId: this.$appConfig.COMPLANY_ID,
          userId: userInfo.userId,
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId,
          keyword: this.searchForm.keyword,
          approvalType: this.searchForm.approvalType,
          approvalStatus: this.searchForm.approvalStatus,
          applicant: this.searchForm.applicant,
          startDate: this.searchForm.startDate,
          endDate: this.searchForm.endDate,
          overdue: this.searchForm.overdue,
          originalUserIds: this.searchForm.originalUserIds,
          archFlag: 'task'
        },
        hideLoading: true
      }
      const res = await getCrmApproval(params).finally(() => {
        uni.stopPullDownRefresh()
        setTimeout(() => {
          // 消除在请求到数据一瞬间，显示出没有数据的字样
          this.pageForm.loadMore = 'nomore'
        })
      })

      let data = res?.data??[]
      this.dataList = pageIndex == 1 ? data : this.dataList.concat(data)
      this.pageForm.total = res.listCount || 0
    },
    initData() {
      this.getData(1)
    },
    dropdownEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        areaId: data.areaId,
        projectId: data.projectId,
        keyword: data.keyword,
        approvalType: data.approvalType,
        approvalStatus: data.approvalStatus,
        applicant: data.applicant,
        startDate: data.submitDate,
        endDate: data.submitDate ? uni.$u.timeFormat(new Date(), 'yyyy-mm-dd') : '',
        overdue: data.overdue,
        originalUserIds: data.originalUserIds
      })
      this.initData()
    },
    handleSubmit({ type, data }) {
      approvalStore.setData('flagText', type)
      approvalStore.setData('quesTaskId', data.recordId)
      approvalStore.setData('fromPage', '/pages-workorder/workorder-approval/list')

      if (data.approvalType == '4') {
        // 对外回复审批，需要设置默认的描述内容
        approvalStore.setData('externalReply', data.externalReply)
      }

      uni.navigateTo({ url: '/pages-workorder/workorder-approval/approval' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  padding-bottom: 20rpx;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
}
::v-deep .header-panel {
  .dropdown-btn {
    flex: 0 0 auto;
    padding: 14rpx 0 14rpx 24rpx;
    box-sizing: border-box;

    .content-panel {
      left: -24rpx;
    }
  }
  .u-search {
    padding: 14rpx 24rpx 14rpx 16rpx;
    background-color: #fff;
  }
}
::v-deep .workorder-sheet {
  margin: 10px 10px 0;
}
</style>