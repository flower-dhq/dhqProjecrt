<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <u-search v-model="searchForm.keywords" placeholder="请输入昵称/客户名称/手机号查询" shape="round" :showAction="false" clearabled :focus="isFocus" @blur="handleSearch" />
      <dropdown-filter :pageType="searchForm.pageType" @confirm="dropdownEvent" />
    </u-sticky>
    <u-gap height="24rpx" bgColor="#f3f5f9" />
    <owner-sheet v-for="(item, index) in dataList" :key="index" :ownerInfo="item" />
    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />
  </view>
</template>

<script>
import OwnerSheet from '../modules/owner-sheet.vue'
import DropdownFilter from './dropdown-filter.vue'
import { getOwnerInfoListByParam, getHouseAddrInfoListToPageForUnion } from '@/service/landcrm'
import { getOwnerByChatId } from '@/service/api-gateway'
import Utils from '@/js/utils'

/**
 * 业主档案列表
 */
export default {
  components: {
    OwnerSheet,
    DropdownFilter
  },
  data() {
    return {
      searchForm: {
        pageType: 'room', // room, group
        keywords: '',
        isKeyword: false, // 如果是从房间列表的搜索跳转过来的，就会设置为 true
        listId: '', // 房间id
        areaId: '',
        projectId: '',
        parkId: '', // 单元id
        houseState: '', // 用户身份
        authType: '', // 认证状态
        act: '',
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'nomore' // loading, nomore
      },
      dataList: [],
      isFocus: false
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
    this.searchForm.pageType = options.pageType || 'room' // room: 在小程序上打开，从选择房间页面进来，显示的是业主房间列表。group: 在企业微信上打开进来，显示的是群聊列表
    this.searchForm.listId = options.id || '' // 房间id，或者 群聊id
    const isKeyword = this.searchForm.isKeyword = options.isKeyword == '1'
    if (isKeyword && options.params) {
      this.resolveParams(options.params || '')
      // 给搜索框获取焦点，当失去焦点时，会发起请求
      this.isFocus = true
      return
    }

    this.initData()
  },
  methods: {
    // 解析出query的参数
    resolveParams(params = '') {
      let res = {}
      try {
        res = JSON.parse(decodeURIComponent(params))
      } catch (error) {
        res = {}
      }
      this.searchForm.areaId = res.areaId || ''
      this.searchForm.projectId = res.projectId || ''
      this.searchForm.parkId = res.parkId || ''
    },
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
      let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
      

      let res = null
      if (this.searchForm.pageType == 'room') {
        // 从选择房间页面进来
        const params = {
          data: {
            startIndex: pageIndex,
            pageSize: this.pageForm.size,
            companyId: companyId,
            addrId: this.searchForm.listId,
            keywords: this.searchForm.keywords,
            houseState: this.searchForm.houseState,
            authType: this.searchForm.authType,
          },
          hideLoading: true,
          responseToast: false
        }
        res = await getOwnerInfoListByParam(params).finally(() => {
          uni.stopPullDownRefresh()
          this.pageForm.loadMore = 'nomore'
        })
        let data = res?.data?.dataList??[]
        this.dataList = pageIndex == 1 ? data : this.dataList.concat(data)
        this.pageForm.total = res.data.total || 0
      } else if (this.searchForm.pageType == 'group') {
        // 从群聊进来
        const params = {
          data: {
            chatId: this.searchForm.listId,
            authState: this.searchForm.authType,
            keyword: this.searchForm.keywords,
            type: this.searchForm.houseState,
            externalFlag: 1, // 0: 企业成员（非外部联系人）, 1: 外部联系人
          },
          hideLoading: true,
          responseToast: false
        }
        res = await getOwnerByChatId(params).finally(() => {
          uni.stopPullDownRefresh()
          this.pageForm.loadMore = 'nomore'
        })
        let data = res?.data??[]
        data = data.map(item => ({
          ...item,
          headimgUrl: item.avatarUrl || '',
          ownerName: item.ownerName || '',
          sex: item.sex || '',
          nickName: item.nickName || '',
          authType: Utils.isEmpty(item.authState) ? '' : item.authState,
          houseState: this.getTypeText(item.type || ''),
          customerTags: item.tagList || []
        }))
        this.dataList = pageIndex == 1 ? data : this.dataList.concat(data)
        this.pageForm.total = res.totalCount || 0
      }
    },
    // 根据关键词搜索获取房间列表
    async getRoomList({ areaId, projectId, parkId, keywords }) {
      const params = {
        data: {
          areaId,
          projectId,
          houseCompound: parkId,
          keywords
        },
        responseToast: false
      }
      const res = await getHouseAddrInfoListToPageForUnion(params)
      const data = res.data || []

      // 只有查询到房间列表数据时候再调用用户接口  （避免无房间数据加载用户接口过慢的问题）
      if (data.length > 0) {
        const addrIdArr = data.map(item => item.houseAddrInfoId)
        this.searchForm.listId = addrIdArr.join(',')
        this.initData() 
      }else {
        this.dataList = []
        this.pageForm.total = 0
        this.pageForm.loadMore = 'nomore'
      }
    },
    // search搜索
    async handleSearch() {
      if (this.searchForm.isKeyword) {
        // 例如，从正常入口进到房间列表的搜索跳转到这，则调用这个先获取房间id
        await this.getRoomList({
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId,
          parkId: this.searchForm.parkId,
          keywords: this.searchForm.keywords
        })
      } else {
        // 例如，从群聊进来，则调用这个进行搜索
        this.initData()
      }
    },
    initData() {
      const tmp = this.$options.data()
      this.dataList = tmp.dataList
      this.pageForm = tmp.pageForm
      this.getData(1)
    },
    dropdownEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        houseState: data.houseState,
        authType: data.authType
      })

      this.initData()
    },
    getTypeText(type) {
      const map = {
        1: '外部联系人',
        2: '会员',
        3: '认证业主'
      }
      return map[type]
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
  /* border-bottom: 1px solid #EAEAEA; */
}
::v-deep .u-search {
  padding: 14rpx 24rpx;
  /* border-bottom: 1px solid #EAEAEA; */
  background-color: #fff;
  z-index: 10;
  position: relative;

  .u-search__content__input {
    height: 56rpx !important;
  }
}
::v-deep .owner-sheet:not(:nth-last-of-type(2)) {
  border-bottom: 1px solid #eeeeee;
}
</style>