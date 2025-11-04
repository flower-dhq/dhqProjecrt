<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
   <view class="top_box"></view>
   <view class="top_box_t20"></view>
   <view class="top_box top_box_pos">
      <view class="box_set box_set_l" :class="showType == '1'?'left_s':''" @click="changeTab('1')">待放行</view>
      <view class="box_set box_set_r" :class="showType == '2'?'left_s':''" @click="changeTab('2')">已放行</view>
   </view>
   <view class="allList">
    <view class="listBox" v-for="(item,index) in boxList" :key="index" @click="navToSet(item.releaseId)">
      <view class="title">
        <view class="left_txt">提交时间：{{item.createDate || ''}}</view>
        <view class="right_txt right_txt_color1" v-if="showType == '1'">待放行</view>
        <view class="right_txt right_txt_color2" v-else>已放行</view>
      </view>
      <view class="all-content">
        <view class="con_txt">公司名称：{{item.companyName || ''}}</view>  
        <view class="con_txt">房源地址：{{item.address || ''}}</view>  
        <view class="con_txt">放行人员：{{ item.pedestriansName || ''}}</view>  
        <view class="con_txt">放行日期：{{item.releasDate || ''}}</view>  
        <view class="con_txt">放行物品：</view>  
        <view class="con_release" v-if="item.itemsData.length>0">
          <view class="box_list">
            <view class="box_t right_line">物品名称</view>
            <view class="box_t">数量/单位</view>
          </view>
          <view class="box_list" v-for="(tab,index) in item.itemsData" :key="index">
            <view class="box_t right_line">{{tab.itemName || ''}}</view>
            <view class="box_t">{{ tab.itemNum || '' }}</view>
          </view>
        </view>  
      </view>
      <view class="bottom-btn" v-if="showType == '1'">
        <view class="btns">放行</view>
      </view>
    </view>
   </view>

    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />

    <u-safe-bottom />
  </view>
</template>

<script>
import Utils from '@/js/utils'
import { getMyTaskList, massSendingTask } from '@/service/api-gateway'
import { getFunctionButtons2 } from '@/service/landcrm'
import { findPassList } from '@/service/wxmanage'

export default {
  data() {
    return {
      showType:'1',
      boxList:[],
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
    if(this.pageForm.total == this.boxList.length){
      return
    }
    this.pageForm.current = this.pageForm.current +1
    this.getFindPassList(this.pageForm.current)
  },
  async onLoad() {
    // const res = await this.getMenuAuth()
    // if (res) {
    //   this.tabList.push({
    //     name: '总任务列表',
    //     id: 'allTask'
    //   })
    // }
  },
  onShow() {
    // 注意，返回到当前页面时，也是需要重新请求的
    // this.getData(this.pageForm.clickPageIndex, { isUpdate: true })
    this.getFindPassList(1)
  },
  methods: {
    // 获取物品放行列表
    getFindPassList(pageIndex = 1){
      if (pageIndex == 1) {
        // 滚动到顶部
        uni.pageScrollTo({ scrollTop: 0 })
        this.dataList = []
      } else if (this.isLastPage && !options.isUpdate) {
        this.pageForm.loadMore = 'nomore'
        return
      }

      this.pageForm.loadMore = 'loading'
      let params = {
        data:{
          decpassState: this.showType=='1'?'2':'3',
          current: this.pageForm.current,
          size: this.pageForm.size,
          // areaId: localStorage.areaId,
          // projectId: localStorage.projectId
        }
      }
      findPassList(params).then(res=>{
        // console.log('res=>>>>>>>>>>>>>>>>>>>>>',res)
        if(res.status == '200'){
          if(this.pageForm.current == 1){
            this.boxList = res.data.records
          }else{
            this.boxList = this.boxList.concat(res.data.records)
          }
          this.pageForm.total = res.data.total
        }else{
          this.boxList = []
        }
      })
    },
    navToSet(releaseId){
      uni.navigateTo({ url: '/pages-tasks/goods-release/goods-release-detail?passId='+releaseId+'&showType='+this.showType })
    },
    changeTab(type){
      this.boxList = []
      this.pageForm.current = 1
      this.showType = type
      this.getFindPassList(1)
    },
    initData() {
      this.getFindPassList(1)
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
  padding-bottom: 20rpx;
  padding-top: 20rpx;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
}
.top_box_t20{
  position: fixed;
  width: 100%;
  height: 20rpx;
  left: 0;
  top: 0;
  background-color: #f3f5f9;
}
.top_box_pos{
  position: fixed;
  left: 0;
  top: 20rpx;
  background-color: #f3f5f9;
}
.top_box{
  width: 686rpx;
  box-sizing: border-box;
  margin: 0 32rpx 20rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  overflow: hidden;
  background-color: #f3f5f9;
  .box_set{
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: bold;
    background: #fff;
    border:1px solid #2760FF;
    color: #2760FF;
    cursor: pointer;
  }
  .box_set_l{
    border-radius: 16rpx 0 0 16rpx;
  }
  .box_set_r{
    border-radius: 0 16rpx 16rpx 0;
  }
  .left_s{
    background: #2760FF;
    color: #fff;
  }
}
.allList{
  width: 100%;
  box-sizing: border-box;
  padding: 0 32rpx;
  .listBox{
    width: 100%;
    background: #fff;
    border-radius: 16rpx;
    margin-top: 20rpx;
    box-sizing: border-box;
    .title{
      padding: 0 32rpx;
      box-sizing: border-box;
      width: 100%;
      height: 92rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #FBF9F9;
      .left_txt{
        font-size: 28rpx;
        font-weight: bold;
      }
      .right_txt{
        font-size: 28rpx;
      }
      .right_txt_color1{
        color: #D99915;
      }
      .right_txt_color2{
        color: #2EB01C;
      }
    }
    .all-content{
      padding: 30rpx 32rpx;
      box-sizing: border-box;
      width: 100%;
      .con_txt{
        font-size: 28rpx;
        padding-bottom: 30rpx;
      }
      .con_release{
        width: 100%;
        border-top: 1px solid #DDDDDD;
        .box_list{
          width: 100%;
          height: 88rpx;
          border-bottom: 1px solid #DDDDDD;
          display: flex;
          .box_t{
            width: 49.5%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24rpx;
          }
          .right_line{
            border-right: 1px solid #DDDDDD;
          }
        }
      }
    }
    .bottom-btn{
      width: 100%;
      display: flex;
      justify-content: flex-end;
      box-sizing: border-box;
      padding: 0 32rpx 32rpx;
      .btns{
        cursor: pointer;
        width: 216rpx;
        height: 80rpx;
        border-radius: 16rpx;
        background: linear-gradient(to right,#2760FF,#4F99FF);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        font-weight: bold;
        color: #fff;
      }
    }
  }
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