<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <view class="header-panel">
        <dropdown-btn ref="btnEl" :isAll="false" maskTop="90rpx" :navIndex="11" contentHeight="612rpx" @confirm="areaProjectEvent" @showMask="hideMenuEvent('btn')" />
        <u-search
          placeholder="房号/客户姓名/客户电话" v-model="searchForm.keyword" shape="square"
          :showAction="false" searchIcon=" " clearabled height="56rpx" @blur="initData"
        />
      </view>
      <dropdown-filter ref="navigatorEl" @confirm="dropdownEvent" />
    </u-sticky>
    <visit-task-sheet v-for="(item, index) in dataList" :key="index" :data="item" customStyle="width: initial; margin: 24rpx 20rpx;" @click="linkTo" @chatEvent="chatEvent" />
    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />

    <u-modal :show="ownerModal.isShow" title="提示" content="未添加业主为外部联系人，暂无法发起会话，您可选择其他联系人发起" confirmText="选择联系人" showCancelButton @confirm="chooseExternal" @cancel="ownerModal.isShow = false" />
  </view>
</template>

<script>
import DropdownBtn from '@/components/dropdown-area/dropdown-btn.vue'
import DropdownFilter from './dropdown-filter.vue'
import VisitTaskSheet from '@/pages-visit/modules/visit-task-sheet.vue'
import { getVisitTaskList } from '@/service/returnVisit'

export default {
  components: {
    DropdownBtn,
    DropdownFilter,
    VisitTaskSheet
  },
  data() {
    return {
      searchForm: {
        keyword: '',
        areaId: '',
        projectId: '',
        visitState: '', // 回访状态
        visitType: '', // 工单类型
        buildingId: '', // 楼栋
        taskSource: '', // 点评来源
        isSolve: '', // 是否解决
        createDateStart: '', // 生成时间段
        createDateEnd: '' // 生成时间段
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'loading' // loading, nomore
      },
      dataList: [],
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
      
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params = {
        data: {
          startIndex: pageIndex,
          pageSize: this.pageForm.size,
          userId: userInfo.userId,
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId,
          visitState: this.searchForm.visitState, // 回访状态
          visitType: this.searchForm.visitType, // 工单类型
          buildingId: this.searchForm.buildingId, // 楼栋
          taskSource: this.searchForm.taskSource, // 点评来源
          isSolve: this.searchForm.isSolve, // 是否解决
          createDateStart: this.searchForm.createDateStart, // 生成开始日期
          createDateEnd: this.searchForm.createDateEnd, // 生成结束日期
          keyword: this.searchForm.keyword, // 关键字
        }
      }
      const res = await getVisitTaskList(params).finally(() => {
        uni.stopPullDownRefresh()
        setTimeout(() => {
          // 消除在请求到数据一瞬间，显示出没有数据的字样
          this.pageForm.loadMore = 'nomore'
        })
      })

      const data = res.data || {}
      const _list = data?.records ?? []
      this.dataList = pageIndex == 1 ? _list : this.dataList.concat(_list)
      this.pageForm.total = data?.total || 0
    },
    initData() {
      this.getData(1)
    },
    // 区域项目菜单事件
    areaProjectEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        areaId: data.areaId,
        projectId: data.projectId
      })
      this.$refs.navigatorEl?.getBuildingDetailList(data.areaId, data.projectId)
      this.initData()
    },
    // 下拉菜单事件
    dropdownEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        visitState: data.visitState,
        visitType: data.visitType,
        buildingId: data.buildingId,
        taskSource: data.taskSource,
        isSolve: data.isSolve,
        createDateStart: data.createDateStart,
        createDateEnd: data.createDateEnd
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
    },
    // 选择外部联系人（客户）
    chooseExternal() {
      wx.qy.selectExternalContact({
        filterType: 0,
        success: (res) => {
          const data = res.userIds || []
          // 客户id
          const userItem = data[0] || ''
          this.ownerModal.isShow = false

          wx.qy.openEnterpriseChat({
            externalUserIds: userItem,
            success: (res) => {
            }
          })
        }
      })
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
::v-deep .visit-task-sheet {
  margin: 24rpx 20rpx 0;
}
</style>