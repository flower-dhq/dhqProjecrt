<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <view class="header-panel">
        <dropdown-btn ref="btnEl" maskTop="90rpx" :navIndex="11" contentHeight="612rpx;" @confirm="areaProjectEvent" @showMask="hideMenuEvent('btn')" />
        <u-search
          placeholder="楼栋、房号、客户姓名、电话、单号、任务内容" v-model="searchForm.searchBox" shape="square"
          :showAction="false" searchIcon=" " height="56rpx" @blur="initData"
        />
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
import { getRepairQuesTaskListAll } from '@/service/landcrm'

export default {
  mixins: [menuAuthMixin],
  components: {
    DropdownBtn,
    DropdownFilter,
    WorkorderSheet
  },
  authName: '工单池',
  data() {
    return {
      searchForm: {
        searchBox: '',
        areaId: '',
        projectId: '',
        workTypeName: '',
        orignSource: '',
        houseFixStatus: '',
        submitDateScreen: '', // 录单时间
        appointmentDate: '' // 预约上门时间
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'loading' // loading, nomore
      },
      dataList: [],
      isFirstEntry: true, // 是否第一次进入页面，如果是页面返回到当前页面的，不算第一次
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
      
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params = {
        data: {
          startIndex: pageIndex,
          pageSize: this.pageForm.size,
          userId: userInfo.userId,
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId || '-1',
          biProblemCategory: '5,6,9,10,11', // 任务类型
          workTypeName: this.searchForm.workTypeName, // 专业
          orignSource: this.searchForm.orignSource, // 起单来源
          houseFixStatus: this.searchForm.houseFixStatus, // 是否房修
          appointmentDate: this.searchForm.appointmentDate, // 预约上门时间
          submitDateScreen: this.searchForm.submitDateScreen, // 录单时间
          searchBox: this.searchForm.searchBox, // 搜索内容
          sort: 2,
          handleType: '0',
          withClosingFlag: 'false'
        },
        header: {
          'content-type': 'application/json'
        },
        hideLoading: true
      }
      const res = await getRepairQuesTaskListAll(params).finally(() => {
        uni.stopPullDownRefresh()
        setTimeout(() => {
          // 消除在请求到数据一瞬间，显示出没有数据的字样
          this.pageForm.loadMore = 'nomore'
        })
      })

      let data = res?.data??[]
      this.dataList = pageIndex == 1 ? data : this.dataList.concat(data)
      this.pageForm.total = res.totalCount || 0
    },
    initData() {
      this.isFirstEntry = false
      this.getData(1)
    },
    areaProjectEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        areaId: data.areaId,
        projectId: data.projectId
      })
      this.$refs.navigatorEl?.getWorkTypeList(data.areaId, data.projectId)
      this.initData()
    },
    dropdownEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        workTypeName: data.specialtyId,
        orignSource: data.orignSourceId,
        houseFixStatus: data.houseFixStatusId,
        submitDateScreen: data.submitDateScreen,
        appointmentDate: data.appointmentDate || ''
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