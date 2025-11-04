<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <view class="header-panel">
        <dropdown-btn ref="btnEl" maskTop="90rpx" :navIndex="11" contentTop="16rpx" contentHeight="612rpx;" @confirm="areaProjectEvent" @showMask="hideMenuEvent('btn')"  :isAll="isAll"/>
        <u-search
          placeholder="流水单号/合同名称/客户名称/车牌号" v-model="searchForm.keyword" shape="square"
          :showAction="false" searchIcon=" " height="56rpx" @blur="initData"
        />
      </view>
      <dropdown-filter ref="navigatorEl" @confirm="dropdownEvent" :filterForm="filterListForm"/>
    </u-sticky>
    <hetong-item v-for="(item, index) in dataList" :key="index" :data="item" :isShowFlag="isShowFlag"></hetong-item>
    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />
  </view>
</template>

<script>
import DropdownBtn from '@/components/dropdown-area/dropdown-btn.vue'
import DropdownFilter from './dropdown-filter.vue'
import HetongItem from '@/pages-workorder/modules/hetong-item'
import { getCarPageList } from '@/service/leasing'


export default {
  components: {
    DropdownBtn,
    DropdownFilter,
    HetongItem
  },
  onLoad(option) {
  },
  data() {
    return {
      isAll: false, // 关闭下拉框全部选项

      searchForm: {
        areaId: '',
        projectId: '',
        resourceMenuIds: '',
        approveStatus: '',
        keyword: '',
        abandonFlag: '',
        saleFlag: ''
      },
      filterListForm: [
        // { label: '资源分类', name: 'ziyuan', icon: 'bottom' },
        { label: '合同状态', name: 'carHeTongState', icon: 'bottom' },
        { label: '合同类型', name: 'typeState', icon: 'bottom' },
        { label: '审批状态', name: 'approvalState', icon: 'bottom' },
      ],
      filterList: [],
      zyList:[],
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'nomore' // loading, nomore
      },
      isShowFlag: 'car',   //是否显示  总  分 行
      dataList: [],
      approvalObj: {
        isShow: false,
        flagText: '',
        quesTaskId: ''
      },
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
    // 获取数据
    async getData(pageIndex = 1) {
      const req = ({ size }) => new Promise(resolve => resolve({ data: new Array(size).fill(1), total: 25 }))

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
          pageIndex,
          pageSize: this.pageForm.size,
          projectId: this.searchForm.projectId,
          resourceMenuIds: this.searchForm.projectId,
          // projectId: 2933638,
          // resourceMenuIds: 2933638,
          keyword: this.searchForm.keyword,
          contractStatus: this.searchForm.contractStatus?this.searchForm.contractStatus:'',
          abandonFlag: this.searchForm.abandonFlag,
          approveState: this.searchForm.approveStatus,
          tabName: '',
        },
        hideLoading: true
      }
      if (this.searchForm.saleFlag) {
        params.data.saleFlag = this.searchForm.saleFlag
      }
      const res = await getCarPageList(params).finally(() => {
        uni.stopPullDownRefresh()
        this.pageForm.loadMore = 'nomore'
      })

      let data = res?.data?.records || []
      this.dataList = pageIndex == 1 ? data : this.dataList.concat(data)
      this.pageForm.total = res?.data?.total || 0
    },
    initData() {
      this.getData(1)
    },
    areaProjectEvent(data) {
      console.log('回调===',data)
      this.searchForm = Object.assign(this.searchForm, {
        areaId: data.areaId,
        projectId: data.projectId
      })
      this.initData()
    },
    dropdownEvent(data,key,item) {
      this.searchForm = Object.assign(this.searchForm, {
        abandonFlag: data.contractStatus=='4'?'1':'',
        approveStatus: data.approveStatus?data.approveStatus:'',
        resourceMenuIds: data.resourceMenuIds?data.resourceMenuIds:'',
        contractStatus: data.contractStatus=='4'?'':data.contractStatus,
        saleFlag: data.typeState?data.typeState:'',
      });
      if(key == 'carHeTongState'){
        this.filterListForm[0].label = item.label || '合同状态';
      }else if(key == 'typeState'){
        this.filterListForm[1].label = item.label || '合同类型';
      }else if(key == 'approvalState'){
        this.filterListForm[2].label = item.label || '审批状态';

      }
      this.hideMenuEvent('navigator')
      this.initData()
    },
    hideMenuEvent(type) {
      if (type == 'btn') {
        this.$refs.navigatorEl?.$refs?.dropdownEl?.showMaskEvent(false)
      } else if (type == 'navigator') {
        this.$refs.btnEl.showMaskEvent(false)
      }
    },
    handleSubmit({ type, data }) {
      this.approvalObj.isShow =  true
      this.approvalObj.flagText = type
      this.approvalObj.quesTaskId = data.recordId
    },
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
::v-deep .workorder-sheet {
  margin: 10px 10px 0;
}
</style>