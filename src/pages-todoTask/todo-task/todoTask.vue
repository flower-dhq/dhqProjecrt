<template>
  <view class="page-box" :style="[THEME_CSS_VAR]">
    <view class="tab-box">
      <u-tabs :current="currentTab" :list="tabList" @click="tabChange" :activeStyle="activeS" :inactiveStyle="inactiveS" lineColor="#0064FF" :scrollable="false"></u-tabs>
    </view>
    <scroll-view scroll-x="true" style="white-space: nowrap;">
      <view class="system-box">
        <view class="sys-item" :class="{'activeSys':sysCurrent==i}" v-for="(item,i) in systemList" :key="i" @click="handClassify(i)">{{ item.systemName }}({{ item.countNum }})</view>
      </view>
    </scroll-view>
    <u-sticky offsetTop="0" customNavHeight="0">
      <dropdown-filter @confirm="confirmEvent" />
    </u-sticky>

    <u-list @scrolltolower="scrolltolower" v-if="todoList.length>0">
      <view class="todo-list">
        <view class="todo-item" v-for="(item,i) in todoList" :key="i" @click="jumpDetail(item)">
          <view class="cont-header">
            <view class="sys">{{ item.fullName }}</view>
            <view class="title">{{ item.taskTitle }}</view>
            <view class="state" :class="{'state2':currentTab==1}">{{ item.transactStatus==1 ? '待处理':'已处理' }}</view>
          </view>
          <view class="todo-cont">{{ item.taskSummary.replace(/<[^>]*>?/gm, '') }}</view>
          <view class="time">开始时间：{{ item.createdData }}</view>
        </view>
      </view>
    </u-list>
    <view class="no-data-cont" v-else>
      <image class="img" :src="require(`@/static/${[THEME_NAME]}/common/no-data.png`)" style="width:500rpx;height:500rpx;"></image>
      <view class="no-data-tips">暂无{{currentTab==0?'待':'已'}}办任务</view>
    </view>
  </view>
</template>

<script>
import DropdownFilter from './dropdown-filter.vue'
import {
  getSystemConfigurationCount,
  getPendingTaskPageList
} from '../../service/datawarehouse.js'
export default{
  components: {
    DropdownFilter,
  },
  data(){
    return{
      currentTab:0,
      tabList:[
        { name:'待办任务' },
        { name:'已办任务' },
      ],
      activeS:{
        color:'#333',
      },
      inactiveS:{
        color: '#333',
      },
      systemList:[],
      sysCurrent:0,
      searchForm:{
        keyword:'',
        pageSize:10,
        current:1,
        startTime:'',
        endTime:''
      },
      pages:1,
      companyId:'',
      userInfo:{},
      todoList:[],
      pageUrlList:[
        {}
      ]
    }
  },

  created(){
    this.getInfo()
    this.tabChange({index:0})
  },
  onLoad(query){
    uni.$on('nextTask',this.switchNextTask)
  },
  onUnload(){
    uni.$off('nextTask',this.switchNextTask)
  },

  methods:{
    switchNextTask(json){
      this.tabChange({index:0})
      if(!json.createdData){
        return;
      }
      let params = {
        data:{
          companyId: this.companyId,
          transactStatus: 1,
          processors: this.userInfo.userAccount,
          businessKey: '',
          taskSearch: '',
          startTime: '',
          endTime: '',
          pageSize: 10,
          current: 1,
        }
      }
      getPendingTaskPageList(params).then(res =>{
        if(res.status==200){
          let todoList = res.data.records;
          for(let i = 0; i<todoList.length; i++){
            if(Date.parse(todoList[i].createdData) < Date.parse(json.createdData)){
              this.jumpDetail(todoList[i]);
              break;
            }
          }
        }
      })
    },
    getInfo(){
      let { O_USER_INFO } = this.$constant;
      this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      this.companyId = this.userInfo.companyId ? this.userInfo.companyId : this.$appConfig.COMPLANY_ID;
    },
    tabChange(e){
      this.currentTab = e.index
      this.sysCurrent=0
      this.searchForm.current=1
      if(e.index==0){
        this.getClassify(1)
      }else if(e.index==1){
        this.getClassify(2)
      }
    },

    //获取系统分类
    getClassify(type){
      let params = {
        data:{
          companyId: this.companyId,
          processors: this.userInfo.userAccount,
          transactStatus: type
        }
      }
      getSystemConfigurationCount(params).then(res =>{
        if(res.status==200){
          let data = res.data
          let arr = []
          arr.push({
            systemName:'全部',
            countNum:data[data.length-1].totalNum
          })
          data.pop() //删除最后一项
          arr = arr.concat(data)
          this.systemList = arr
          this.getDataList()
        }
      })
    },

    //选择系统分类
    handClassify(i){
      this.sysCurrent = i
      this.searchForm.current=1
      this.getDataList()
    },

    //获取待办列表数据
    getDataList(){
      let params = {
        data:{
          companyId: this.companyId,
          transactStatus: this.currentTab==0 ? 1:2,
          processors: this.userInfo.userAccount,
          businessKey: this.systemList[this.sysCurrent].businessKey ? this.systemList[this.sysCurrent].businessKey : '',
          taskSearch: this.searchForm.keyword,
          startTime: this.searchForm.startTime,
          endTime: this.searchForm.endTime,
          pageSize: this.searchForm.pageSize,
          current: this.searchForm.current
        }
      }
      getPendingTaskPageList(params).then(res =>{
        if(res.status==200){
          this.pages = res.data.pages
          if(this.searchForm.current==1){
            this.todoList = res.data.records
          }else{
            this.todoList = this.todoList.concat(res.data.records)
          }
        }
      })
    },

    scrolltolower(){
      if (this.searchForm.current < this.pages) {
        this.searchForm.current++;
        this.getDataList()
      }
    },

    confirmEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        keyword: data.keyword,
        startTime: data.startDate,
        endTime:data.endDate
      })
      this.getDataList()
    },

    jumpDetail(item){
      //企微
      // #ifdef MP-WEIXIN
      // const res = wx.getSystemInfoSync();
      // if (res.environment) {
      //   uni.navigateTo({ url: `${item.jumpLinkH}&fromPage=todoTask&createdData=${item.createdData}`})
      // }
      uni.navigateTo({ url: `${item.jumpLinkH}&fromPage=todoTask&createdData=${item.createdData}`})
      return;
      // #endif

      //app
      const { uniPlatform } = uni.getSystemInfoSync();
      if(uniPlatform=='web'){
        //流程中心跳转到其他H5包的页面
        if(item.systemKey=="LCZX"){
          try {
            EbeiPlugins.openWebViewPage('h5_ygd', item.jumpLinkApp)
          } catch (e) {}
        }else if(item.systemKey=="XTGG"){
          uni.navigateTo({ url: `${item.jumpLinkH}&fromPage=todoTask`})
        }else{
          uni.navigateTo({ url: `${item.jumpLinkH}&fromPage=todoTask`})
        }
      }
    }

  }
}
</script>

<style scoped lang="scss">
.page-box{
  min-height: 100vh;
  background-color: #f9f9f9;
  width: 100%;
}
.tab-box{
  // height: 88rpx;
  background-color: #fff;
}
.system-box{
  padding: 22rpx 10rpx 6rpx;
  display: flex;
  overflow-x: auto; /* 启用水平滚动 */
  white-space: nowrap; /* 防止子元素换行 */
}
.sys-item{
  margin: 10rpx;
  padding: 8rpx 16rpx;
  border-radius: 10rpx;
  background-color: #F1F1F1;
  color: #999;
  font-size: 28rpx;
}
.activeSys{
  color: #0064FF;
  background-color: #DCEAFF;
}
.u-list {
  height: calc(100vh - 163px) !important;
  overflow: auto;
}
.todo-list{
  padding: 0 30rpx;
}
.todo-item{
  padding: 24rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
}
.cont-header{
  display: flex;
  .sys{
    width: 124rpx;
    height: 44rpx;
    font-size: 24rpx;
    line-height: 44rpx;
    text-align: center;
    color: #fff;
    background-color: #0064FF;
    border-radius: 10rpx;
  }
  .title{
    flex: 1;
    font-size: 32rpx;
    padding: 0 20rpx;
  }
  .state{
    padding-top: 6rpx;
    font-size: 24rpx;
    width: 104rpx;
    text-align: right;
    color: #FF770E;
  }
  .state2{
    color: #0064FF;
  }
}
.todo-cont{
  margin: 20rpx 0;
  font-size: 28rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.time{
  font-size: 24rpx;
  color: #999999;
}
.no-data-cont{
  padding-top: 76rpx;
  text-align: center;
}
.img{
  width:500rpx;
  height:500rpx;
}
.no-data-tips{
  margin-top: 60rpx;
  color: #999;
}
</style>
