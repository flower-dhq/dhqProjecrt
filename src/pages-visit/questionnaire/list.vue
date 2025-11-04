<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgcolor="#fff" offsetTop="0" customNavHeight="0">
      <view class="header-panel">
        <dropdown-btn ref="btnEl" maskTop="90rpx" :isAll="false" :navIndex="11" contentHeight="612rpx;" @confirm="areaProjectEvent" @showMask="hideMenuEvent('')"></dropdown-btn>
        <u-search placeholder="问卷名称" v-model="searchForm.keyword" shape="square" :showAction="false" searchIcon=" " height="56rpx" @search="initData" @clear="clearKeywords" />
      </view>
      <dropdown-filter ref="navigatorEl" @confirm="dropdownEvent" />
    </u-sticky>

    <questionnaire-sheet v-for="(item, index) in dataList" :key="index" :data="item" customStyle="width: initial; margin: 24rpx 20rpx;" />
    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />
  </view>
</template>

<script>
import { selectQuestionnaireByPage } from '@/service/wxmanage';

import DropdownBtn from '@/components/dropdown-area/dropdown-btn.vue'
import DropdownFilter from './components/dropdown-filter.vue'
import QuestionnaireSheet from '@/pages-visit/modules/questionnaire-sheet.vue'

export default {
  components: {
    DropdownBtn,
    DropdownFilter,
    QuestionnaireSheet
  },
  data() {
    return {
      searchForm: {
        areaId: '',
        projectId: '',
        keyword: '',
        status: '',
        type: ''
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'loading' // loading, nomore
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
  mounted() {
    // 不需要请求，因为下拉菜单栏需要设置默认区域和项目，会发起请求的
  },
  methods: {
    // 获取问卷列表
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
          current: pageIndex,
          size: this.pageForm.size,
          companyId: companyId,
          areaIdList: [this.searchForm.areaId || ''],
          projectIdList: [this.searchForm.projectId || ''],
          inputval: this.searchForm.keyword,
          fiterStatus: this.searchForm.status,
          questionnaireTypeId: this.searchForm.type || '',
          isSendMsg:1 //发送状态(1:已发送0:未发送)
        },
        hideLoading: true
      }
      const res = await selectQuestionnaireByPage(params).finally(() => {
        uni.stopPullDownRefresh()
        setTimeout(() => {
          // 消除在请求到数据一瞬间，显示出没有数据的字样
          this.pageForm.loadMore = 'nomore'
        })
      })

      const data = res.data || {}
      const _list = (data.list ?? []).map(item => ({
        ...item,
        finishRateNum: parseFloat(item.finishRate) * 100 || 0,
        projectId: this.searchForm.projectId
      }))
      this.dataList = pageIndex == 1 ? _list : this.dataList.concat(_list)
      this.pageForm.total = data?.total || 0
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
      this.initData()
    },
    // 下拉菜单事件
    dropdownEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        status: data.status,
        type: data.type
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
    clearKeywords(){
      this.searchForm.keyword = ''
      this.initData()
    }
  },
};
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
::v-deep .questionnaire-sheet {
  margin: 24rpx 20rpx 0;
}
</style>