<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
   <view class="all-list">
    <view class="box-list">
      <view class="all-title">
        <view class="title">形象及礼仪</view>
        <view class="select">
          <view class="select-icon"></view>
          <view class="txt">全部设置为不涉及项</view>
        </view>
      </view>
    </view>
   </view>
  </view>
</template>

<script>
import DropdownFilter from '@/pages-tasks/share-task/dropdown-filter.vue'
import SelfSheet from '@/pages-tasks/share-task/self-sheet.vue'
import AllSheet from '@/pages-tasks/share-task/all-sheet.vue'
import Utils from '@/js/utils'
import { getMyTaskList, massSendingTask } from '@/service/api-gateway'
import { getFunctionButtons2 } from '@/service/landcrm'

export default {
  components: {
    DropdownFilter,
    SelfSheet,
    AllSheet
  },
  data() {
    return {
      showType:'1',
      boxList:[1,2],
      //new
      tabList: [
      ],//    :,最快更新!无广告!
      searchForm: {
        selTabId: 'selfTask',
        creator: '', // 创建人
        endDate: '', // 截止日期
        selfState: '', // 我的任务的状态
        allState: '', // 总任务的状态
        type: '', // 类型
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'loading', // loading, nomore
        clickPageIndex: 1, // 记录当前点击的页面位置
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
  async onLoad() {
    const res = await this.getMenuAuth()
    if (res) {
      this.tabList.push({
        name: '总任务列表',
        id: 'allTask'
      })
    }
  },
  onShow() {
    // 注意，返回到当前页面时，也是需要重新请求的
    this.getData(this.pageForm.clickPageIndex, { isUpdate: true })
  },
  methods: {
    navToSet(){
      uni.navigateTo({ url: '/pages-tasks/goods-release/goods-release-detail' })
    },
    changeTab(type){
      this.showType = type
    },
    initData() {
      this.getData(1)
    },
    // 获取数据
    async getData(pageIndex = 1, options = {}) {
      options.selTabId = options.selTabId || this.searchForm.selTabId
      options.isUpdate = options.isUpdate || false

      if (pageIndex == 1) {
        // 滚动到顶部
        uni.pageScrollTo({ scrollTop: 0 })
        this.dataList = []
      } else if (this.isLastPage && !options.isUpdate) {
        this.pageForm.loadMore = 'nomore'
        return
      }

      this.pageForm.loadMore = 'loading'

      const { O_USER_INFO } = this.$constant
		  const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })

      let res = {}
      const params = {
        data: {
          userId: userInfo.wechatUserId, // 企业微信用户id
          size: this.pageForm.size,
          current: pageIndex,
          endDate: this.searchForm.endDate,
          taskType: this.searchForm.type
        }
      }

      // 请求接口数据
      if (options.selTabId == 'selfTask') {
        params.data.sendStatus = this.searchForm.selfState
        params.data.endTime = this.searchForm.endDate

        // 获取我的任务的列表数据
        res = await getMyTaskList(params).finally(() => {
          uni.stopPullDownRefresh()
          setTimeout(() => {
            // 消除在请求到数据一瞬间，显示出没有数据的字样
            this.pageForm.loadMore = 'nomore'
          })
        })
      } else if (options.selTabId == 'allTask') {
        params.data.taskStatus = this.searchForm.allState
        params.data.endDate = this.searchForm.endDate

        // 获取总任务的列表数据
        res = await massSendingTask(params).finally(() => {
          uni.stopPullDownRefresh()
          setTimeout(() => {
            // 消除在请求到数据一瞬间，显示出没有数据的字样
            this.pageForm.loadMore = 'nomore'
          })
        })
      }

      let data = res?.data ?? {}
      data.records = data.records ?? []
      if (pageIndex == 1) {
        // 重置列表数据
        this.dataList = data.records
        this.pageForm.current = pageIndex
      } else if (options.isUpdate) {
        // 只更新某一页的数据
        const start = (pageIndex - 1) * this.pageForm.size
        this.dataList.splice(start, this.pageForm.size, ...data.records)
      } else {
        // 添加新数据
        this.dataList = this.dataList.concat(data.records)
        this.pageForm.current = pageIndex
      }
      this.pageForm.total = data.total || 0
      this.searchForm.selTabId = options.selTabId
    },
    tabChange({ index, id }) {
      this.searchForm.selTabId = id

      this.initData()
    },
    dropdownEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        creator: data.creator, // 创建人
        endDate: data.endDate,
        selfState: data.selfState, // 我的任务的状态
        allState: data.allState, // 总任务的状态
        type: data.type // 类型
      })

      this.initData()
    },
    // 判断当前页面是否有”总任务“的菜单权限
    async getMenuAuth() {
      const { O_USER_INFO } = this.$constant
      const userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' })

      const params = {
        data: {
          userId: userInfo.userId,
          menuTypes: 101,
          belongSystem: 'gj_applet'
        },
        hideLoading: true,
        responseToast: false,
      }
      const res = await getFunctionButtons2(params)

      /**
       * @type {Array<{name: string, items: Array<{name: string}>}>}
       */
      const data = res?.data?.[0]?.items ?? []
      if (res.resultCode !== 200 || data.length == 0) {
        return false
      }

      // 判断是否有”总任务“的菜单权限
      const hasMenu = data.some(group => {
        // group: 页面分组
        const child = group.items || []
        return child.some(childItem => {
          // childItem: 页面
          if (childItem.name === '分享任务') {
            // 判断当前页是否有”总任务“的菜单权限
            return childItem.items.some(menuItem => menuItem.name === '总任务')
          }
        })
      })

      return hasMenu
    },
    // 记录当前点击的页面位置
    recordPageNum(index) {
      // 计算出当前点击的位置是哪一页的数据
      this.pageForm.clickPageIndex = Math.ceil((index + 1) / this.pageForm.size)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
}



::v-deep .u-tabs {
  border-bottom: 1px solid #EAEAEA;
}
::v-deep .self-sheet {
  margin: 24rpx 20rpx 0;
}
::v-deep .all-sheet {
  margin: 24rpx 20rpx 0;
}
::v-deep .u-tag {
  height: 20px !important;
  line-height: 20px !important;
  margin-right: 10px !important;
}
</style>