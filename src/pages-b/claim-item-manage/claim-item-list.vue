<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="header-panel">
      <u-search v-model="searchVal" placeholder="输入关键词" shape="square" :height="20" :showAction="false" @search="onSearch" />
    </view>
    <u-gap height="5" bgColor="#f6f6f7" />

    <u-tabs :current="getTabCurrent" :list="getTabList" keyName="label" :lineColor="THEME_COLOR" :itemStyle="{ height: '38px' }" @click="tabChange" />
    <u-gap height="5" bgColor="#f6f6f7" />

    <view class="content-panel">
      <u-list height="calc(100vh - 156px)" @scrolltolower="loadMore">
        <u-list-item v-for="(item, index) in claimList" :key="index">
          <claim-card :data="item" :itemType="selNavigate" :isShowStatus="pageObj.selTabId === ''" @refresh="onSearch" />
        </u-list-item>
        <u-list-item>
          <u-loadmore v-if="claimList.length == pageObj.total || pageObj.loadMore" :status="pageObj.loadMore" />
        </u-list-item>
      </u-list>
      <suspend-ball v-if="selNavigate === 'find'" label="失物登记" @click="linkTo('add')" />
    </view>

    <view class="footer-panel">
      <view class="footer-item gap" @click="navigateChange('claim')">
        <view :class="['square-icon', { select: selNavigate == 'claim' }]"></view>
        <text>失物招领</text>
      </view>
      <view class="footer-item" @click="navigateChange('find')">
        <view :class="['square-icon', { select: selNavigate == 'find' }]"></view>
        <text>寻物启事</text>
      </view>
    </view>
  </view>
</template>

<script>
import Utils from '@/js/utils'
import SuspendBall from '@/pages-b/claim-item-manage/modules/suspend-ball.vue'
import ClaimCard from '@/pages-b/claim-item-manage/modules/claim-card.vue'
import { claimStatus } from '@/pages-b/claim-item-manage/modules/utils'
import { getFindItemPage, getClaimItemPage } from '@/service/community'

/**
 * @query {'claim'|'find'} itemType 失物招领、寻物启事
 */
export default {
  name: 'ClaimItemList',
  components: {
    SuspendBall,
    ClaimCard
  },
  data() {
    const { MEMBER_ID, PROJECT_ID, AREA_ID, O_USER_INFO } = this.$constant
    const userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' })

    return {
      companyId: userInfo.companyId,
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
      searchVal: '', // 搜索框内容
      claimList: [],
      pageObj: {
        current: 1,
        total: 0,
        size: 10,
        loadMore: 'nomore', // '': 还需要加载; 'loading': 数据加载中; 'nomore': 已经是最后一页，无需加载
        selTabId: '1', // getTabList.id,
        doing: 0,
        finish: 0,
        publish: 0
      },
      selNavigate: 'claim', // claim: 失物招领; find: 寻物启事
    }
  },
  computed: {
    // 当前被选中的tab
    getTabCurrent() {
      let sel = this.getTabList.findIndex(item => item.id === this.pageObj.selTabId)
      return sel !== -1 ? sel : 0
    },
    // 获取tab列表
    getTabList() {
      let doing = claimStatus({ alias: 'doing' })
      let finish = claimStatus({ alias: 'finish' })
      let all = this.selNavigate == 'find' ? claimStatus({ alias: 'publish' }) : undefined

      return [doing, finish, all]
        .filter(Boolean)
        .map(item => {
          let key = item.alias
          let count = this.pageObj[key]
          return {
            ...item,
            label: `${item.label}(${count})`,
            count
          }
        })
    }
  },
  onPullDownRefresh() {
    this.getFindItemPage(1, this.pageObj.selTabId)
  },
  async onLoad() {
    const { itemType } = await Utils.getPageQuery()
    this.selNavigate = ['claim', 'find'].includes(itemType) ? itemType : this.selNavigate
    this.getFindItemPage(1, '1')
  },
  methods: {
    /**
     * @param {number} pageIndex 页面索引，从 1 开始
     * @param {string} tabType getTabList.id
     */
    async getFindItemPage(pageIndex, tabType) {
      this.pageObj.loadMore = 'loading'

      const params = {
        companyId: this.companyId,
        areaId: this.areaId,
        project: this.projectId,
        searchConditionForApp: this.searchVal,
        status: tabType
      }

      let reqApi
      if (this.selNavigate == 'find') {
        reqApi = getFindItemPage({ data: params }, this.pageObj.size, pageIndex)
      } else if (this.selNavigate == 'claim') {
        reqApi = getClaimItemPage({ data: params }, this.pageObj.size, pageIndex)
      }
      const res = await reqApi.finally(() => {
        this.pageObj.loadMore = ''
        uni.stopPullDownRefresh()
      })

      let arrTmp = res?.data?.data?.records || []
      this.claimList = pageIndex == 1 ? arrTmp : this.claimList.concat(arrTmp)
      this.pageObj.total = res?.data?.data?.total || 0
      this.pageObj.doing = res?.data?.statusIng || 0
      this.pageObj.finish = res?.data?.statusFinish || 0
      this.pageObj.publish = res?.data?.statusMine || 0
      this.pageObj.current = pageIndex
      this.pageObj.selTabId = tabType

      this.lastPageAction()
    },
    lastPageAction() {
      if (this.claimList.length === this.pageObj.total) {
        // 已到达最后一页
        this.pageObj.loadMore = 'nomore'
      }
    },
    onSearch() {
      this.getFindItemPage(this.pageObj.current, this.pageObj.selTabId)
    },
    // 顶部tab栏事件
    tabChange(item) {
      this.getFindItemPage(this.pageObj.current, item.id)
    },
    // 底部导航栏事件
    navigateChange(type) {
      this.selNavigate = type
      this.pageObj.selTabId = '1'
      this.getFindItemPage(1, this.pageObj.selTabId)
    },
    // 滚动到底部
    loadMore() {
      // 如果接口还在请求中，则停止加载更多
      if (this.pageObj.isShowMore) return
      // 已经是最后一页了，无需继续加载
      if (this.pageObj.loadMore === 'nomore') return

      let pageIndex = this.pageObj.current += 1
      this.getFindItemPage(pageIndex, this.pageObj.selTabId)
    },
    // 跳转到失物登记页面
    linkTo(type, item = {}) {
      let map = {
        add: Utils.spliceGetUrl('/pages-b/claim-item-manage/add-claim-item', {}),
      }
      uni.navigateTo({
        url: map[type] || ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.header-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 10px 30px;
}
.content-panel {
  flex: 1 1 auto;
  overflow: hidden;
}
.footer-panel {
  width: 100%;
  height: 60px;
  line-height: 60px;
  display: flex;
  border-top: 1px solid #e4e4e4;
  background-color: #fff;
  flex: 0 0 34px;
}
.footer-item {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: baseline;
  font-size: 15px;

  &.gap {
    border-right: 1px solid #f1f1f1;
  }
  .square-icon {
    width: 10px;
    height: 10px;
    background-color: #cccccc;
    margin-right: 7px;

    &.select {
      background-color: var(--app-primary-color);
    }
  }
}
</style>