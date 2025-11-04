<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <dropdown-filter @confirm="confirmEvent" />
    </u-sticky>
    <activity-sheet v-for="(item, index) in dataList" :key="index" :data="item" :shareConfig="shareConfig" />
    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />
  </view>
</template>

<script>
import DropdownFilter from './dropdown-filter.vue'
import ActivitySheet from '@/pages-activity/modules/activity-sheet.vue'
import { getActivityList } from '@/service/wxmanage'
import { getShareConfig } from '@/js/sharePage'

/**
 * 会员活动列表
 */
export default {
  components: {
    DropdownFilter,
    ActivitySheet
  },
  data() {
    return {
      searchForm: {
        areaId: '',
        projectId: '',
        keyword: '', // 标题搜索
        status: '', // 活动状态
        isMember: '', // 业主专享活动
        actForm: '', // 活动形式
        activityStartDate: '', // 活动报名开始日期
        activityEndDate: '', // 活动报名结束日期
        expirationStartDate: '', // 活动报名截止开始日期
        expirationEndDate: '' // 活动报名截止结束日期
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'loading' // loading, nomore
      },
      dataList: [],
      shareConfig: {
        // 分享按钮的配置信息
        type: '',
        materialTitle: '',
        materialDesc: '',
        materialPicUrl: '',
        materialUrl: '',
        appId: '',
      },
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
    getShareConfig('分享会员活动').then(res => {
      console.log('分享会员活动===', res)
      this.shareConfig = res
    })
  },
  mounted() {
    // 不需要请求，因为下拉菜单栏需要设置默认区域和项目，会发起请求的
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
      let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
      const params = {
        data: {
          pageNum: this.pageForm.current,
          pageSize: this.pageForm.size,
          userId: userInfo.userId,
          companyId: companyId,
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId,
          title: this.searchForm.keyword,
          publish: '1', // 0：未发布的活动；1：已发布的活动
          registrationStatus: this.searchForm.status,
          isMember: this.searchForm.isMember,
          form: this.searchForm.actForm,
          startStartDate: this.searchForm.activityStartDate,
          endEndDate: this.searchForm.activityEndDate,
          startSignUpDate: this.searchForm.expirationStartDate,
          endSignUpDate: this.searchForm.expirationEndDate
        },
        hideLoading: true
      }
      const res = await getActivityList(params).finally(() => {
        uni.stopPullDownRefresh()
        setTimeout(() => {
          // 消除在请求到数据一瞬间，显示出没有数据的字样
          this.pageForm.loadMore = 'nomore'
        })
      })

      let data = res?.data || {}
      let list = data.records || []
      this.dataList = pageIndex == 1 ? list : this.dataList.concat(list)
      this.pageForm.total = data.total || 0
    },
    initData() {
      this.getData(1)
    },
    confirmEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        areaId: data.areaId,
        projectId: data.projectId,
        keyword: data.keyword,
        status: data.status,
        isMember: data.isMember,
        actForm: data.actForm,
        activityStartDate: data.activityStartDate,
        activityEndDate: data.activityEndDate,
        expirationStartDate: data.expirationStartDate,
        expirationEndDate: data.expirationEndDate
      })
      
      this.initData()
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
</style>