<!--  -->
<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <u-tabs
        :list="tabList" :scrollable="false" :current="searchForm.selTab.index"
				:activeStyle="{
					color: '#2761FF',transform: 'scale(0.95)',width:'100%',textAlign:'center'
				}"
				:inactiveStyle="{
				  color: '#666666',transform: 'scale(0.95)',width:'100%',textAlign:'center'
				}"
        itemStyle="height: 88rpx; padding: 0 10rpx;" @change="($event) => getData(1, $event.index)"
      />
    </u-sticky>
    <dropdown-filter @confirm="dropdownEvent" />

    <view v-for="(item, index) in dataList" :key="index" class="content" @click="skip(item)">
      <view class="item-title">
        <view class="item-caption">{{ item.quesTaskCode }}</view>
        <view :class="['item-status', { wait: item.quesTaskState == '待确认', doing: item.quesTaskState == '处理中', close: item.quesTaskState == '已关闭' }]">{{ item.quesTaskState }}</view>
      </view>
      <u-gap height="0.5" bg-color="#F3F4F7"></u-gap>
      <view class="item-content"
        >{{ item.quesDesc }}</view
      >
      <view class="item-tag">
        <view class="tags">{{ item.biProblemCategory }}</view>
      </view>
      <u-gap height="0.5" bg-color="#F3F4F7"></u-gap>

      <view class="item-addr">{{ item.areaName }}-{{ item.projectName }} | {{ item.createDate }}</view>
    </view>

    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />
  </view>
</template>

<script>
import DropdownFilter from './dropdown-filter.vue'
import { getWarnOrderList } from '@/service/landcrm'

export default {
  components: {
    DropdownFilter
  },
  data() {
    return {
      tabList: [
        { name: '待确认', id: '5' },
        { name: '处理中', id: '3' },
        { name: '已完结', id: '6' },
      ],
      searchForm: {
        selTab: { index: 0 },
        areaId: '',
        projectId: '',
        taskTypeId: ''
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'nomore' // loading, nomore
      },
      dataList: [],
    };
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

      const params = {
        data: {
          pageNum: pageIndex,
          pageSize: this.pageForm.size,
          userId: userInfo.userId,
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId,
          warnType: '1',
          flag: this.searchForm.selTab.id
        },
        hideLoading: true
      }
      const res = await getWarnOrderList(params).finally(() => {
        uni.stopPullDownRefresh()
        this.pageForm.loadMore = 'nomore'
      })

      let data = res?.data??[]
      this.dataList = pageIndex == 1 ? data : this.dataList.concat(data)
      this.pageForm.total = res.totalCount || 0
    },
    initData() {
      this.getData(1, this.searchForm.selTab.index)
    },
    dropdownEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        areaId: data.areaId,
        projectId: data.projectId
      })

      this.initData()
    },
    skip(item) {
      uni.navigateTo({ url: `/pages-workorder/opinion/detail?quesTaskCode=${item.quesTaskCode}` })
    },
  },
};
</script>
<style scoped lang="scss">
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

.content {
  margin: 20rpx;
  background: #ffffff;
  border-radius: 12rpx;

  .item-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 30rpx;

    .item-caption {
      font-size: 28rpx;
      font-family: PingFang SC;
      color: #666666;
    }

    .item-status {
      font-size: 28rpx;

      &.wait {
        color: #FAAD13;
      }
      &.doing {
        color: #2761FF;
      }
      &.close {
        color: #33BA73;
      }
    }
  }

  .item-content {
    padding: 12rpx 30rpx;

    font-size: 30rpx;
    font-weight: bold;
    color: #222222;
  }

  .item-tag {
    padding: 12rpx 30rpx;

    display: flex;

    .tags {
      font-size: 22rpx;
      color: #2761ff;
      margin: 0 10rpx 0 0;
      padding: 10rpx;
      text-align: center;
      background: rgba(39, 97, 255, 0.1);
      border-radius: 4rpx;
    }
  }

  .item-addr {
    padding: 24rpx 30rpx;
    font-size: 26rpx;
    color: #999999;
  }
}
</style>