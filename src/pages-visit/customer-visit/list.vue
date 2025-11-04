<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <view class="header-panel">
        <dropdown-btn ref="btnEl" :isAll="false" maskTop="90rpx" :navIndex="11" contentHeight="612rpx" @confirm="areaProjectEvent" @showMask="hideMenuEvent('btn')" />
        <u-search
          placeholder="任务名称" v-model="searchForm.keyword" shape="square" 
          :showAction="false" searchIcon=" " height="56rpx" clearabled @blur="initData"
        />
      </view>
      <dropdown-filter ref="navigatorEl" @confirm="dropdownEvent" />
    </u-sticky>
    <customer-visit-sheet v-for="(item, index) in dataList" :key="index" :data="item" customStyle="width: initial; margin: 24rpx 20rpx;" @click="linkTo" @chatEvent="chatEvent" />
    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />

    <u-modal :show="ownerModal.isShow" title="提示" content="未添加业主为外部联系人，暂无法发起会话，您可选择其他联系人发起" confirmText="选择联系人" showCancelButton @confirm="chooseExternal" @cancel="ownerModal.isShow = false" />
  </view>
</template>

<script>
import DropdownBtn from '@/components/dropdown-area/dropdown-btn.vue'
import DropdownFilter from './dropdown-filter.vue'
import CustomerVisitSheet from '@/pages-visit/modules/customer-visit-sheet.vue'
import { getCustomerVisitList } from '@/service/returnVisit'

export default {
  components: {
    DropdownBtn,
    DropdownFilter,
    CustomerVisitSheet
  },
  data() {
    return {
      searchForm: {
        keyword: '',
        areaId: '',
        projectId: '',
        visitTaskState: '', // 拜访状态
        visitPlanId: '', // 拜访计划
        visitUserId: '', // 拜访人
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'loading' // loading, nomore
      },
      dataList: [],
      isFirstEntry: true, // 是否第一次进入页面，如果是页面返回到当前页面的，不算第一次
      ownerModal: {
        // 会话的弹窗显示
        isShow: false
      }
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
  onShow() {
    if (this.isFirstEntry) return
  
    this.initData()
  },
  mounted() {
    // 不需要请求，因为下拉菜单栏需要设置默认区域和项目，会发起请求的
    // this.initData()
  },
  methods: {
    // 获取回访任务列表
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
      
      const params = {
        data: {
          startIndex: pageIndex,
          pageSize: this.pageForm.size,
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId,
          visitTaskState: this.searchForm.visitTaskState, // 拜访状态
          visitPlanId: this.searchForm.visitPlanId, // 拜访计划
          visitUserId: this.searchForm.visitUserId, // 拜访人
          visitTaskName: this.searchForm.keyword, // 任务名称
        },
        wrapResponse: true
      }
      const res = await getCustomerVisitList(params).finally(() => {
        uni.stopPullDownRefresh()
        setTimeout(() => {
          // 消除在请求到数据一瞬间，显示出没有数据的字样
          this.pageForm.loadMore = 'nomore'
        })
      })

      const data = res.data || {}
      const _list = data?.data ?? []
      this.dataList = pageIndex == 1 ? _list : this.dataList.concat(_list)
      this.pageForm.total = data?.totalCount || 0
    },
    initData() {
      this.isFirstEntry = false
      this.getData(1)
    },
    // 区域项目菜单事件
    areaProjectEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        areaId: data.areaId,
        projectId: data.projectId
      })
      this.$refs.navigatorEl?.getCustomerVisitPlanList(data.projectId)
      this.initData()
    },
    // 下拉菜单事件
    dropdownEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        visitTaskState: data.visitTaskState,
        visitPlanId: data.visitPlanId,
        visitUserId: data.visitUserId
      })
      this.initData()
    },
    hideMenuEvent(type) {
      if (type == 'btn') {
        this.$refs.navigatorEl?.$refs?.dropdownEl?.showMaskEvent(false)
      } else if (type == 'navigator') {
        this.$refs.btnEl.showMaskEvent(false)
      }
    },
    linkTo(item) {
      uni.navigateTo({ url: `/pages-visit/visit-workorder/detail?visitId=${item.visitId}` })
    },
    // 会话的弹窗显示
    chatEvent(isShow) {
      this.ownerModal.isShow = isShow
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
.header-panel {
  @include flx-dsp(flex-start, flex-start);
  background-color: #fff;
  border-bottom: 1px solid #f8f8f8;

  ::v-deep .dropdown-btn {
    flex: 0 0 auto;
    padding: 14rpx 0 14rpx 24rpx;
    box-sizing: border-box;

    .content-panel {
      left: -24rpx;
    }
  }
}
::v-deep .u-search {
  padding: 14rpx 24rpx 14rpx 16rpx;
  background-color: #fff;
}
::v-deep .customer-visit-sheet {
  margin: 24rpx 20rpx 0;
}
</style>