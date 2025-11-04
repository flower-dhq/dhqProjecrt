<template>
  <view class="page-panel"  :style="[THEME_CSS_VAR]">
    <u-gap height="0" />
    <order-item v-for="(item, index) in dataList" :key="index" :data="item" customStyle="border-bottom: 1px solid #DDDDDD;" />

    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />
    <u-safe-bottom />
  </view>
</template>

<script>
import OrderItem from '@/pages-archives/modules/order-item.vue'
import { getQuestionTasksByOwnerInfoId } from '@/service/landcrm'

export default {
  components: {
    OrderItem
  },
  data() {
    return {
      ownerId: '',
      projectIds: '',
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'nomore' // loading, nomore
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
  onLoad(options) {
    this.ownerId = options.ownerId || ''
    this.projectIds = options.projectIds || ''
    this.initData()
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

      const params = {
        data: {
          startIndex: pageIndex,
          pageSize: this.pageForm.size,
          ownerInfoId: this.ownerId,
          projectIds: this.projectIds,
        },
        hideLoading: true,
        responseToast: false
      }
      const res = await getQuestionTasksByOwnerInfoId(params).finally(() => {
        uni.stopPullDownRefresh()
        this.pageForm.loadMore = 'nomore'
      })

      let data = res?.data??[]
      this.dataList = pageIndex == 1 ? data : this.dataList.concat(data)
      this.pageForm.total = res.totalCount || 0
    },
    initData() {
      this.getData(1)
    },
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
}
</style>