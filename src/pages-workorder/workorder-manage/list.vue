<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <view class="header-panel">
        <dropdown-btn ref="btnEl" routerName="mywork" isAllArea maskTop="90rpx" :navIndex="11" contentHeight="612rpx;" @confirm="areaProjectEvent"
          @showMask="hideMenuEvent('btn')" />
        <u-search placeholder="楼栋、房号、客户姓名、电话、单号、任务内容" v-model="searchForm.keyword" shape="square" :showAction="false"
          searchIcon=" " height="56rpx" @blur="initData" />
      </view>
      <dropdown-filter ref="navigatorEl" @confirm="dropdownEvent" />
    </u-sticky>
    <workorder-sheet v-for="(item, index) in dataList" :key="index" :data="item" />
    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />
  </view>
</template>

<script>
import menuAuthMixin from '@/js/mixin/menuAuthMixin'
import DropdownBtn from '@/components/dropdown-area/dropdown-btn.vue'
import DropdownFilter from './dropdown-filter.vue'
import WorkorderSheet from '@/pages-workorder/modules/workorder-sheet.vue'
import { getRealTimeQuesTaskListPool } from '@/service/landcrm'

export default {
  mixins: [menuAuthMixin],
  components: {
    DropdownBtn,
    DropdownFilter,
    WorkorderSheet
  },
  authName: '工单管理',
  data() {
    return {
      searchForm: {
        areaId: '',
        projectId: '',
        keyword: '',
        biProblemCategory: '',
        quesTaskState: '',
        workTypeName: '',
        sort: '',
        handleType: '',
        exception: '',
        submitDateScreen: '',
        payStatus: '',
        sourceType: ''
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'loading' // loading, nomore
      },
      dataList: [],
      isFirstEntry: true, // 是否第一次进入页面。如果是返回到当前页面的操作，不算第一次
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
          startIndex: this.pageForm.current,
          pageSize: this.pageForm.size,
          userId: userInfo.userId,
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId || '-1',
          searchBox: this.searchForm.keyword, // 搜索内容
          biProblemCategory: this.searchForm.biProblemCategory, // 任务类型
          quesTaskState: this.searchForm.quesTaskState, // 任务状态
          workTypeName: this.searchForm.workTypeName, // 专业
          followUpProcessorId: '', // 办理人
          orderUserId: '',
          sort: this.searchForm.sort, //排序（默认显示 受理时间(最早优先)）
          withClosingFlag: true,//(4 已关闭，97 已回访)
          handleType: this.searchForm.handleType, //办理人
          exception: this.searchForm.exception, //异常审批
          submitDateScreen: this.searchForm.submitDateScreen, //受理时间
          payStatus: this.searchForm.payStatus, //支付状态
          sourceType: this.searchForm.sourceType, //录单系统
          isGiveOut: ''
        },
        hideLoading: true
      }
      const res = await getRealTimeQuesTaskListPool(params).finally(() => {
        uni.stopPullDownRefresh()
        setTimeout(() => {
          // 消除在请求到数据一瞬间，显示出没有数据的字样
          this.pageForm.loadMore = 'nomore'
        })
      })

      let data = res?.data ?? []
      this.dataList = pageIndex == 1 ? data : this.dataList.concat(data)
      this.pageForm.total = res.totalCount || 0
    },
    // 获取任务类型数量
    async getTaskTypeNum(type) {
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      let params = {};
      if (type == 1) {
        params = {
          data: {
            startIndex: this.pageForm.current,
            pageSize: this.pageForm.size,
            userId: userInfo.userId,
            areaId: this.searchForm.areaId,
            projectId: this.searchForm.projectId || '-1',
            biProblemCategory: '5,6,9,10,11', // 任务类型
            quesTaskState: this.searchForm.quesTaskState, // 任务状态
            workTypeName: '', // 专业
            followUpProcessorId: '', // 办理人
            orderUserId: '',
            sort: this.searchForm.sort,
            withClosingFlag: true,
            isCount: '1',
            handleType: '', //办理人
            exception: '', //异常审批
            submitDateScreen: '', //受理时间
            payStatus: '', //支付状态
            sourceType: '', //录单系统
          },
          hideLoading: true
        }
      } else {
        params = {
          data: {
            startIndex: this.pageForm.current,
            pageSize: this.pageForm.size,
            userId: userInfo.userId,
            areaId: this.searchForm.areaId,
            projectId: this.searchForm.projectId || '-1',
            biProblemCategory: '5,6,9,10,11', // 任务类型
            isTaskStateCount: '1',
            quesTaskState: '', // 任务状态
            workTypeName: '', // 专业
            followUpProcessorId: '', // 办理人
            orderUserId: '',
            sort: this.searchForm.sort,
            withClosingFlag: true,
            handleType: '', //办理人
            exception: '', //异常审批
            submitDateScreen: '', //受理时间
            payStatus: '', //支付状态
            sourceType: '', //录单系统
          },
          hideLoading: true
        }
      }

      const res = await getRealTimeQuesTaskListPool(params)
      const data = res.data
      const total = Object.values(data).reduce((store, item) => store + (item || 0), 0)
      if (type == 1) {
        this.$refs.navigatorEl.taskTypeList = [
          { label: `全部(${total})`, name: '5,6,9,10,11' },
          { label: `报修(${data.baoxiuCount || 0})`, name: '5' },
          { label: `报事(${data.baoshiCount || 0})`, name: '11' },
          { label: `投诉(${data.tousuCount || 0})`, name: '6' },
          { label: `咨询(${data.zixunCount || 0})`, name: '9' },
          { label: `表扬(${data.biaoyangCount || 0})`, name: '10' }
        ]
      } else {
        let taskStatusTotal = 0;
        for (var i = 1; i <= 6; i++) {
          if (i != 4) {
            taskStatusTotal = taskStatusTotal + data[`count${i}`] || 0;
          }

        }
        this.$refs.navigatorEl.taskStatusList = [
          { label: `全部未关闭(${taskStatusTotal})`, name: '' },
          { label: `待接单(${data.count2 || 0})`, name: '1' },
          { label: `待派单(${data.count1 || 0})`, name: '0' },
          { label: `处理中(${data.count3 || 0})`, name: '2' },
          { label: `已关闭(${data.count5 || 0})`, name: '4' },
          { label: `待确认(${data.count4 || 0})`, name: '3' },
          { label: `已暂停(${data.count6 || 0})`, name: '5' }
        ]
      }

    },
    initData() {
      this.isFirstEntry = false
      this.getData(1)
      if (this.pageForm.current == 1) {
        // 获取任务类型数量
        this.getTaskTypeNum(1)
        // 获取任务状态数量
        this.getTaskTypeNum(2)
      }
    },
    areaProjectEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        areaId: data.areaId,
        projectId: data.projectId
      })
      this.$refs.navigatorEl.findWorkUserList(data.areaId, data.projectId)
      this.initData()
    },
    dropdownEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        biProblemCategory: data.biProblemCategory,
        quesTaskState: data.quesTaskState,
        workTypeName: data.workTypeName,
        handleType: data.handleType,//办理人
        exception: data.exception,//异常审批
        submitDateScreen: data.submitDateScreen,//受理时间
        payStatus: data.payStatus,//支付状态
        sort: data.sort, //排序（默认显示 受理时间(最早优先)）
        sourceType: data.sourceType//录单系统
      })
      this.initData()
    },
    hideMenuEvent(type) {
      if (type == 'btn') {
        this.$refs.navigatorEl?.$refs?.dropdownEl?.showMaskEvent(false)
      } else if (type == 'navigator') {
        this.$refs.btnEl.showMaskEvent(false)
      }
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
  border-bottom: 1px solid #f8f8f8;
  background-color: #fff;
}

::v-deep .workorder-sheet {
  margin: 20rpx 20rpx 0;
}
</style>