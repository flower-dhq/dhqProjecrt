<template>
    <view class="page-panel" :style="[THEME_CSS_VAR]">
      <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
        <u-tabs
          :list="tabList" :pageIndex="searchForm.selTab.index"
                  :activeStyle="{ color: '#2761FF',transform: 'scale(0.95)',width:'100%',textAlign:'center'}"
                  :inactiveStyle="{ color: '#666666',transform: 'scale(0.95)',width:'100%',textAlign:'center'}"				
          itemStyle="height: 88rpx; padding: 0 10rpx; min-width: 166rpx;" :scrollable="true" @change="($event) => getData(1, $event.index)"
        />
      </u-sticky>
      <view v-show="isLink">
      <u-search placeholder="请输入标题关键字搜索" :showAction="false" v-model="searchForm.keyWords" color="#999999"   @search="initData" />
      <dropdown-filter  @confirm="dropdownEvent" />
      <knowledge-sheet v-for="(item, index) in dataList" :key="index" :data="item" @collectQues ="collectKnow" @topQues="topKnow" @addQuesQuoteNum ="addQuesQuoteNum"/>
      <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />

      </view>
     
      <comm-list  v-show="!isLink"  ref="linkDate"/>

    </view>
</template>
  
  <script>
  import KnowledgeSheet from '../modules/knowledge-sheet.vue'
  import DropdownFilter from './dropdown-filter.vue'
  import CommList from '../modules/commList.vue'
  import pageRefresh from '@/js/pageRefresh';
  import { getQuesLibList,collectQues,updateQuesTopStatus,addQuesQuoteNum} from '@/service/knowledgeBase'
  
  export default {
    components: {
        KnowledgeSheet,
      DropdownFilter,
      CommList
    },
    authName: '知识库',
    data() {
      return {
        // 标签类型 0-问答库 1-话术库 2-资料库 3-电子物料库
        tabList: [
          { name: '问答库', id: '0' },
          { name: '话术库', id: '1' },
          { name: '资料库', id: '2' },
          { name: '常用链接库', id: '4' },
          { name: '电子物料库', id: '3' }
        ],
        options: {
          ownerId: '', // 业主id
        },
        searchForm: {
          selTab: { index: 0 },//标签类型 0-问答库 1-话术库 2-资料库 3-电子物料库
          areaId: '',
          projectId: '',
          keyWords: '',
          sortType: 0,//排序类型 0-默认排序 1-引用量排序 2-收藏排序 3-创建时间
          screen: null, // 筛选 0-已置顶 1-已收藏
          quesStatus:'1', //知识状态 0已作废  1已采纳  2草稿  3:审核中  4:不采纳
          quesCategory:Number //知识所属分类
        },
        pageForm: {
          pageIndex: 1,
          size: 10,
          total: 0,
          loadMore: 'loading' // loading, nomore
        },
        dataList: [],
        // isFirstEntry: true, // 是否第一次进入页面，如果是页面返回到当前页面的，不算第一次
        isLink:true
      }
    },
    computed: {
      isLastPage() {
        return this.dataList.length >= this.pageForm.total
      }
    },
    onPullDownRefresh() {
      if(this.isLink){
        this.initData()
      }
    },
    async onReachBottom() {
      if(this.isLink){
        this.getData(this.pageForm.pageIndex + 1)
      }
    },
    created() {
    pageRefresh.restore('KONWLEDGE_DETAIL')
    },
    onLoad(options) {
    },
    onShow() {
    console.log(76)
    if (pageRefresh.isRefresh('KONWLEDGE_DETAIL', true)) {
             Promise.all([
              this.initData()
            ]).then((results) => {
            })
        }
    },
   
    mounted() {
      // 不需要请求，因为下拉菜单栏需要设置默认区域和项目，会发起请求的
      // this.initData()
      this.$refs.linkDate.getDataLink();
    },
    methods: {
      // 获取数据
      async getData(pageIndex = 1, selTabIndex) {
        console.log(87,selTabIndex)
        switch (selTabIndex) {
                  case 0:
                  this.isLink = true;
                  break;
                  case 1:
                  this.isLink = true;
                  break;
                   case 2:
                  this.isLink = true;
                  break;
                  case 3:
                  this.isLink = false;
                  // this.$refs.linkList.getData()
                    break;
                  case 4:
                  this.isLink = true;
                  // selTabIndex = 3
                  break;
        }
        if( this.isLink ){
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
        this.pageForm.pageIndex = pageIndex
        if (typeof(selTabIndex) == 'number') {
          this.searchForm.selTab = Object.assign({}, this.tabList[selTabIndex], { index: selTabIndex })
        }
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
        
       let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
        console.log(143,this.searchForm)
        console.log(144,this.searchForm.areaId,this.searchForm.quesCategory)

        if(!(this.searchForm.areaId != '')) {
          return;
        }
        const params = {
          data: {
            companyId: companyId,
            userId: userInfo.userId,
            pageSize: this.pageForm.size,
            pageIndex: pageIndex,
            labelType: Number(this.searchForm.selTab.id), // 标签类型
            sortType: this.searchForm.sortType == '' ? 0 : this.searchForm.sortType == '0' ?  1 : this.searchForm.sortType == '1' ? 2 : this.searchForm.sortType == '2' ? 3 : 0 , // 排序类型 
            screen: this.searchForm.screen  == 0 ? null : this.searchForm.screen == 1 ? 0 :this.searchForm.screen ==2 ? 1 : null  , // 标签
            keyWords: this.searchForm.keyWords || '', // 关键词搜索
            quesStatus: this.searchForm.quesStatus, // 知识状态 0已作废  1已采纳  2草稿  3:审核中  4:不采纳
            quesCategory: Number(this.searchForm.quesCategory)==0 ? null :Number(this.searchForm.quesCategory), // 知识所属分类
            areaId: this.searchForm.areaId,
            projectId: this.searchForm.projectId,
          },
          header: {
          'content-type': 'application/json'
        },
          hideLoading: true,
          responseToast: false
        }
        let res = null
          res = await getQuesLibList(params).finally(() => {
            uni.stopPullDownRefresh()
            setTimeout(() => {
              // 消除在请求到数据一瞬间，显示出没有数据的字样
              this.pageForm.loadMore = 'nomore'
            })
          })
        let data = res?.data?.rows??[]
        this.dataList = pageIndex == 1 ? data : this.dataList.concat(data)
        this.pageForm.total = res?.data?.total || 0
        }
       
      },
    
      initData() {
        // this.isFirstEntry = false
        this.getData(1, this.searchForm.selTab.index)
      },
      dropdownEvent(data) {
        console.log(185,data)
        console.log(186,this.searchForm)
          this.searchForm = Object.assign(this.searchForm, {
            sortType: data.sortType, // 排序类型 
            screen: data.screen, // 标签
            keyWords: data.keyWords || '', // 关键词搜索
            quesStatus: '1', // 知识状态 0已作废  1已采纳  2草稿  3:审核中  4:不采纳
            quesCategory: data.quesCategory, // 知识所属分类
            areaId: data.areaId,
            projectId: data.projectId,
        })
        this.initData()
      },
      collectKnow(id,data){ //收藏
        console.log(198,id,data)
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
        let params = {
          data:{
            quesId:id,
            type:data,
            userId:userInfo.userId
          },
          hideLoading: true,
		      responseToast: false     
      }
      collectQues(params).then(res =>{
        if(res.status=='200'){
          uni.showToast({title: res.message, icon:'none'})
          this.dataList.forEach((item,index)=>{
            if(item.quesId == id){
                item.praised = data
                item.likeCount = data === 1 ?  item.likeCount+1 : item.likeCount-1
            }
					})
        }else{
          uni.showToast({title:res.message,icon:'none'})
        }
      })

      },
      topKnow(id,data){ //置顶
        console.log(219,id,data)
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
        let params = {
          data:{
            quesId:id,
            type:data,
            userId:userInfo.userId,
            userName:userInfo.userName
          }   ,
          header: {
          'content-type': 'application/json'
        },
          hideLoading: true,
          responseToast: false
      }
      updateQuesTopStatus(params).then(res =>{
        if(res.status=='200'){
          uni.showToast({title: `${ data == 1 ? '置顶': '取消置顶'}成功`,icon:'none',duration: 500})
          setTimeout(() => {
            this.initData()
        }, 0)
        }else{
          uni.showToast({title:res.message,icon:'none'})
        }
      })
      },
      addQuesQuoteNum(id){ //增加引用量
        let params = {
          data:{
            quesId:id,
          },
          header: {
          'content-type': 'application/json'
        },
          hideLoading: true,
          responseToast: false  
      }
      addQuesQuoteNum(params).then(res =>{
        if(res.status=='200'){
          setTimeout(() => {
            this.initData()
        }, 620)
        }else{
          uni.showToast({title:res.message,icon:'none'})
        }
      })
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

  ::v-deep .u-text {
  flex: initial !important;
  width: 32% !important;
  margin-left: 43rpx;
}

::v-deep .u-list {
    height: calc(100% - 128rpx) !important;
    overflow: auto;
     margin-top: 20rpx;
     .list-row {
         display: flex;
        align-items: center;
        gap: 20rpx;
        border-bottom: 1px solid #EBEBEB;
        padding: 20rpx 20rpx;
        background: #FFFFFF;
    }

    .img {
        height: 128rpx;
        width: 160rpx;
    }

    .list-btn {
        position: absolute;
        right: 30rpx;
        font-size: 26rpx; 
        color: #FFFFFF;
        background: #197AFA;
        border-radius: 8rpx;
        padding: 10rpx 20rpx;
    }

    .list-cell {
        display: grid;
        gap: 3px;
    }

    .list-text {
        font-size: 28rpx;
        font-weight: bold;
        color: #333333;
    }

    .list-desc {
        font-size: 26rpx;
        color: #999999;
     }

    .list-type { 
        padding: 2rpx 8rpx;  
        font-size: 22rpx;
        color: #1989F7;
        border-radius: 4rpx;
        border: 1px solid #1989F7;
    }
}

  </style>