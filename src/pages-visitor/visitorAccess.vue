<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <view class="header-panel">
        <DropdownProjectVisit ref="btnEl" maskTop="90rpx" :navIndex="11" contentHeight="612rpx;" @confirm="areaProjectEvent" @showMask="hideMenuEvent('btn')" />
      </view>
      <view>
        <u-search
          placeholder="请输入访客姓名、电话、房间" v-model="searchForm.searchBox" shape="square"
          searchIcon=" " height="56rpx" @custom="initData" :showAction="true"
        />
        <view class="tab-time">
          <u-tabs :current="currentTab" class="tabs-box" :list="tabData" @click="changeTab"></u-tabs>
          <view class="time-box">
            <view @click="selectTime">
              <text :class="{'act':timeIndex!=null }">来访时间</text>
              <image class="img-down" src="@/static/icon-img/icon-drop.png" mode="widthFix"></image>
            </view>
            <view v-if="timeShow" class="time-list">
              <view class="time" :class="{'act':timeIndex==i }" v-for="(item,i) in acceptanceList" @click="changeTime(item.id,i)">{{ item.name }}</view>
            </view>
          </view>
        </view>
      </view>
    </u-sticky>
    <view class="data-list">
      <view class="data-item" v-for="(item,i) in dataList">
        <view class="top-info">
          <text class="l">{{ item.name }}</text>
          <text class="r" :class="{'orange':item.status==1,'green':item.status==2}">{{ item.statusName }}</text>
        </view>
        <view class="info-list">
          <view class="info-item">
            <text class="item-label">来访时间</text>
            <text class="item-value">{{ item.visitTime }}</text>
          </view>
          <view class="info-item">
            <text class="item-label">访客电话</text>
            <text class="item-value">{{ item.phone }}</text>
          </view>
          <view class="info-item">
            <text class="item-label">来访地址</text>
            <text class="item-value">{{ item.roomInfo }}</text>
          </view>
          <view class="info-item">
            <text class="item-label">来访事由</text>
            <text class="item-value">{{ item.reason }}</text>
          </view>
          <view class="info-item">
            <text class="item-label">车牌号</text>
            <text class="item-value">{{ item.carNumber }}</text>
          </view>
        </view>
        <u-button v-if="item.status==1" class="button" @click="clickBtn(item.recordId)">放行</u-button>
      </view>
    </view>
    <!-- <workorder-sheet v-for="(item, index) in dataList" :key="index" :data="item" /> -->
    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />
  </view>
</template>

<script>
import DropdownProjectVisit from '@/components/dropdown-area/dropdown-project-visit.vue'
import { getVisitRecord,passThrough } from '@/service/wxmanage'

export default {
  components: {
    DropdownProjectVisit,
  },
  authName: '访客通行',
  data() {
    return {
      tabData:[
        { name:'全部', value:''},
        { name:'待放行', value:'1'},
        { name:'已放行', value:'2'},
        { name:'已过期', value:'-1'},
      ],
      acceptanceList: [
        { id: 2, name: '今天'}, 
        { id: 1, name: '昨天'},
        { id: 3, name: '未来一周'}
      ],
      currentTab:0,
      searchForm: {
        searchBox: '',
        areaId: '',
        projectId: '',
        status:'',
        acceptanceTime:'',
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'loading' // loading, nomore
      },
      dataList: [],
      isFirstEntry: true, // 是否第一次进入页面，如果是页面返回到当前页面的，不算第一次
      timeShow:false,
      timeIndex:null,
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
    changeTab(e){
      this.currentTab = e.index
      this.searchForm.status = this.tabData[e.index].value
      this.getData()
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
      
      const params = {
        data: {
          areaId: this.searchForm.areaId+'',
          projectId: this.searchForm.projectId,
          searchConditionContact: this.searchForm.searchBox, // 搜索内容
          status: this.searchForm.status,
          dateType:this.searchForm.acceptanceTime
        },
        header: {
          'content-type': 'application/json'
        },
        hideLoading: true
      }
      const res = await getVisitRecord(params,this.pageForm.size,pageIndex).finally(() => {
        uni.stopPullDownRefresh()
        setTimeout(() => {
          // 消除在请求到数据一瞬间，显示出没有数据的字样
          this.pageForm.loadMore = 'nomore'
        })
      })

      let data = res.data?.records??[]
      if(data.length>0){
        data.forEach(item => {
          let statusName=''
          if(item.status==1){
            statusName = '待放行'
          }else if(item.status==2){
            statusName = '已放行'
          }else if(item.status=='-1'){
            statusName = '已过期'
          }else if(item.status==3){
            statusName = '已作废'
          }
          item.statusName= statusName
        });
      }
      this.dataList = pageIndex == 1 ? data : this.dataList.concat(data)
      this.pageForm.total = res.data.total || 0
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
    },
    // 放行按钮
    clickBtn(id){
      let that = this
      uni.showModal({
        title: '提示',
        content: '是否放行该访客？',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            that.submit(id)
          } 
        },
      });
    },
    //放行
    submit(id){
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params = {
        data: {
          "recordId": id,
          userId:userInfo.userId,
          userName:userInfo.userName
        }
      }  
      passThrough(params).then(res => {
        if(res.status == '200') {
          uni.showToast({
            title: '操作成功',
            duration: 2000,
            icon: 'none',
          });
          this.initData()
        }
        else {
          uni.showToast({
            title: res.message,
            duration: 2000,
            icon: 'none',
          });
        }
      })
    },
    selectTime(){
      this.timeShow = !this.timeShow
    },
    changeTime(id,i){
      if(this.timeIndex==i){
        this.timeIndex = null
        this.searchForm.acceptanceTime = ''
      }else {
        this.timeIndex = i
        this.searchForm.acceptanceTime = id
      }
      this.getData()
      this.timeShow = false
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
      top: 72rpx !important;
    }
  }
}
::v-deep .u-search {
  padding: 0 24rpx 14rpx 16rpx;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  
}
::v-deep .workorder-sheet {
  margin: 20rpx 20rpx 0;
}
::v-deep .tree-panel{
  border-top: 1rpx solid #eee;
}
.tab-time{
  display: flex;
  border-bottom: 1rpx solid #eee;
}
.tabs-box{
  flex:1;
}
.time-box{
  position: relative;
  width: 200rpx;
  font-size: 30rpx;
  text-align: center;
  line-height: 88rpx;
  .time-list{
    width: 180rpx;
    position: absolute;
    top: 90rpx;
    background-color: #fff;
    box-shadow: 0rpx 2rpx 8rpx rgba(0, 0, 0, 0.2);
    .time{
      text-align: center;
      border-bottom: 1rpx solid #eee;
    }
  }
}
.act{
  color: #1989fa;
}
.data-list{
  padding: 24rpx;
  .data-item{
    padding: 24rpx;
    margin-bottom: 24rpx;
    border-radius: 12rpx;
    background-color: #fff;
  }
}
.top-info{
  display: flex;
  padding: 12rpx 12rpx 20rpx;
  border-bottom: 1rpx solid #eee;
  .l{
    font-size: 28rpx;
    color: #333;
  }
  .r{
    flex: 1;
    font-size: 24rpx;
    text-align: right;
    color: #666;
  }
  .orange{
    color: #FE9901;
  }
  .green{
    color: #60D4A3;
  }
}
.info-list{
  padding: 12rpx 12rpx 0;
  font-size: 24rpx;
  color: #666;
  .info-item{
    display: flex;
    padding: 8rpx 0;
    .item-label{
      width: 150rpx;
    }
  }
}
.button {
  margin-right: 0;
  width: 140rpx !important;
  height: 56rpx;
  background-color: transparent !important;
  color: #1989fa !important;
  border: 1rpx solid #1989fa;
  border-radius: 30rpx !important;
  font-size: 28rpx;
}
.img-down{
  width: 24rpx;
  height: 24rpx;
  position: absolute;
  top: 30rpx;
}

</style>

