<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <u-tabs
        :list="tabList" :current="searchForm.selTab.index"
				:activeStyle="{ color: '#2761FF',transform: 'scale(0.95)',width:'100%',textAlign:'center',borderRight:'1px solid #ccc' }"
				:inactiveStyle="{ color: '#666666',transform: 'scale(0.95)',width:'100%',textAlign:'center',borderRight:'1px solid #ccc' }"				
        itemStyle="height: 88rpx; padding: 0 10rpx; min-width: 166rpx;" :scrollable="true" @change="($event) => getData(1, $event.index)"
      />
    </u-sticky>
    <u-search placeholder="楼栋、房号、客户姓名、电话、单号、任务内容" v-model="searchForm.keyword" color="#999999" shape="square" :showAction="false" searchIcon=" " @blur="initData" />
    <dropdown-filter routerName="mywork" :pageType="options.pageType" @confirm="dropdownEvent" />
    <workorder-sheet v-for="(item, index) in dataList" :key="index" :data="item" />
    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />

    <suction-cup-add v-if="isShowAddTask" />
  </view>
</template>

<script>
import menuAuthMixin from '@/js/mixin/menuAuthMixin'
import WorkorderSheet from '../modules/workorder-sheet.vue'
import DropdownFilter from './dropdown-filter.vue'
import SuctionCupAdd from '@/pages-workorder/modules/suction-cup-add.vue'
import { getBuildingQuesTaskList, getOwnerQuesTaskList } from '@/service/landcrm'

export default {
  mixins: [menuAuthMixin],
  components: {
    WorkorderSheet,
    DropdownFilter,
    SuctionCupAdd
  },
  authName: '我的工单',
  data() {
    return {
      tabList: [
        { name: '报修(0)', id: '5' },
        { name: '报事(0)', id: '11' },
        { name: '投诉(0)', id: '6' },
        { name: '其他(0)', id: '13' }
      ],
      options: {
        pageType: '', // '': 默认; singleChat: 从单聊进来
        ownerId: '', // 业主id
      },
      searchForm: {
        selTab: { index: 0 },
        keyword: '',
        areaId: '',
        projectId: '',
        taskId: '0',
        originalUserId: '', // 受理人
        overDayCount: '', // 关闭时限
        payStatus: '' // 支付状态
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'loading' // loading, nomore
      },
      dataList: [],
      isFirstEntry: true, // 是否第一次进入页面，如果是页面返回到当前页面的，不算第一次
      isShowAddTask: false, // 是否显示“新增代客录单”按钮
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
  onLoad(options) {
    this.options.pageType = options.pageType || ''
    this.options.ownerId = options.ownerId || ''

    if (this.options.pageType == 'singleChat') {
      uni.setNavigationBarTitle({ title: '业户工单' })
      this.isShowAddTask = true
    }
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
    async getData(pageIndex = 1, selTabIndex) {
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
      if (typeof(selTabIndex) == 'number') {
        this.searchForm.selTab = Object.assign({}, this.tabList[selTabIndex], { index: selTabIndex })
      }
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });  
      let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
      const params = {
        data: {
          startIndex: pageIndex,
          pageSize: this.pageForm.size,
          areaId: this.searchForm.areaId,
          companyId: companyId,
          userId: userInfo.userId,
          biProblemCategory: this.searchForm.selTab.id, // 任务类型
          quesTaskState: this.searchForm.taskId, // 任务状态
          originalUserId: this.searchForm.originalUserId || '', // 受理人
          overDayCount: this.searchForm.overDayCount[0] || '', // 关闭时限
          payStatus: this.searchForm.payStatus[0] || '', // 支付状态
          searchBox: this.searchForm.keyword, // 搜索内容
          isQw: 0, // 固定值
          sort: 1
        },
        hideLoading: true,
        responseToast: false
      }

      let res = null
      if (this.options.pageType == 'singleChat') {
        // 从单聊进来，获取的是业主的工单列表，该业主只能查看到所属项目下的数据
        params.data.ownerId = this.options.ownerId

        res = await getOwnerQuesTaskList(params).finally(() => {
          uni.stopPullDownRefresh()
          setTimeout(() => {
            // 消除在请求到数据一瞬间，显示出没有数据的字样
            this.pageForm.loadMore = 'nomore'
          })
        })
      } else {
        // 正常进来
        if (this.searchForm.projectId) {
          params.data.projectId = this.searchForm.projectId
        }

        res = await getBuildingQuesTaskList(params).finally(() => {
          uni.stopPullDownRefresh()
          setTimeout(() => {
            // 消除在请求到数据一瞬间，显示出没有数据的字样
            this.pageForm.loadMore = 'nomore'
          })
        })
      }

      let data = res?.data??[]
      this.dataList = pageIndex == 1 ? data : this.dataList.concat(data)
      this.pageForm.total = res.totalCount || 0
    },
    // 获取任务类型数量
    async getTaskTypeCount() {
      const { O_USER_INFO } = this.$constant;
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });      
      let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
      const params = {
        data: {
          areaId: this.searchForm.areaId,
          companyId: companyId,
          userId: userInfo.userId,
          originalUserId: this.searchForm.originalUserId || '', // 受理人
          quesTaskState: this.searchForm.taskId, // 任务状态
          originalUserId: this.searchForm.originalUserId || '', // 受理人
          overDayCount: this.searchForm.overDayCount[0] || '', // 关闭时限
          payStatus: this.searchForm.payStatus[0] || '', // 支付状态
          searchBox: this.searchForm.keyword, // 搜索内容
          isCount: 0
        },
        hideLoading: true,
        responseToast: false
      }

      let res = null
      if (this.options.pageType == 'singleChat') {
        params.data.ownerId = this.options.ownerId

        res = await getOwnerQuesTaskList(params)
      } else {
        if (this.searchForm.projectId) {
          params.data.projectId = this.searchForm.projectId
        }

        res = await getBuildingQuesTaskList(params)
      }

      this.tabList = this.tabList.map((item) => {
        if (item.id == 5) return { ...item, name: `报修(${res.repairCount || 0})` }
        if (item.id == 11) return { ...item, name: `报事(${res.reportCount || 0})` }
        if (item.id == 6) return { ...item, name: `投诉(${res.complaintCount || 0})` }
        if (item.id == 13) return { ...item, name: `其他(${res.otherCount || 0})` }
        else return item
      })
    },
    initData() {
      this.isFirstEntry = false
      this.getData(1, this.searchForm.selTab.index)
      if (this.pageForm.current == 1) this.getTaskTypeCount()
    },
    dropdownEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        areaId: data.areaId,
        projectId: data.projectId,
        taskId: data.taskId,
        originalUserId: data.originalUserId, // 受理人
        overDayCount: data.overDayCount, // 关闭时限
        payStatus: data.payStatus // 支付状态
      })

      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  padding-bottom: 10px;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
}
::v-deep .u-sticky {
  border-bottom: 1px solid #EAEAEA;
}
::v-deep .u-tabs__wrapper__nav__line {
  bottom: 16rpx !important;
}
::v-deep .u-search {
  padding: 14rpx 24rpx;
  border-bottom: 1px solid #EAEAEA;
  background-color: #fff;
  z-index: 10;
  position: relative;

  .u-search__content__input {
    height: 56rpx !important;
  }
}
::v-deep .workorder-sheet {
  margin: 24rpx 20rpx 0;
}
::v-deep .u-tabs__wrapper__nav__item-3>text{
	border: none !important;
}
::v-deep .u-search .u-search__content__input{
	font-size: 26rpx !important;
}
</style>