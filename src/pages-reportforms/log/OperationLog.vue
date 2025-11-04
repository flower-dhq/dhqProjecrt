<template>
  <view class='pagesbox'>
    <view class="top-cont">
      <u-gap height="10" bg-color="#F3F4F7"></u-gap>
      <title-info-box :titleInfo="titleInfo"></title-info-box>
      <u-gap height="10" bg-color="#F3F4F7"></u-gap>
      <view class="head-tabs">
        <u-tabs :list="showTab" :inactiveStyle="{ color: '#666666', fontSize: '26rpx' }"
          :activeStyle="{ color: '#2761FF', fontSize: '26rpx' }" :current='tabs.tabActive' @change="tabsChange"></u-tabs>
        <liu-data-select class="select-box" :dWidth="200" :dHeight="300"  elementId="data-select3"  :dataList="dataList"
          @change="change" color="#2761FF" :selectValue="downListAct" :top='100'>
          <view class="tabs-sort">排序方式<image style="width:12px;height: 12px;" :src="require(`@/static/${THEME_NAME}/common/filter_color.png`)"></image></view>
        </liu-data-select>
      </view>
    </view>
    
    <view class="table-cont">
      <zb-table border :cell-style="cellStyle" :cell-header-style="headercellStyle" :formatter="formatterAction"
        :show-header="true" :columns="showColumn" :stripe="true" :fit="true" :data="tableData"></zb-table>
    </view>
  </view>
</template>
<script>
import LiuDataSelect from '../modules/liu-data-select.vue';
import titleInfoBox from '../modules/title-info-box.vue';
import {
  orderDetail,
  integratedPatrolDetail,
  devicePatrolDetail,
  chargesDetail
} from '@/service/datawarehouse'

export default {
  components: {
    LiuDataSelect,
    titleInfoBox
  },
  data() {
    return {
      titleInfo: {
        name: '日报',
        time: '2023-05-30'
      },
      tabActive: 0,
      tabs:{
        tabActive: 0,
      },
      downListAct:'',
      showTab:[],
      tabList: [{ name: '工单',code:0 }, { name: '综合巡检',code:1 }, { name: '设备巡检',code:2 }, { name: '收费',code:3 }],
      dataList: [],
      orderList: [
        { label: '新单数', code: 'newTaskNum' },
        { label: '工单总数', code: 'taskCnt' },
        { label: '关闭率', code: 'closedRate' },
        { label: '完成率', code: 'complateRate' },
      ],
      patrolList: [
        { label: '总任务数', code: 'ruleTaskCount' },
        { label: '完成数', code: 'finishNum' },
        { label: '完成率', code: 'finishRate' },
      ],
      chargeList: [
        { label: '收费记录数', code: 'recordsCount' },
      ],
      showColumn:[],
      column: [
        { type: 'index', label: '排序', align: 'center' },
        { name: 'projectName', label: '区域项目', align: 'center' },
        { name: 'num2', label: '工单指标', align: 'center', formatter: true },
        { name: 'projectLeader', label: '项目负责人', align: 'center' }
      ],
      tableData: [],
      params: {
        diaryId: 1,
        sortParameters: ''
      }
    }
  },
  computed: {},
  watch: {},
  onLoad(option) {
    console.log('传参',option);
    this.params.diaryId = option.diaryId
    this.titleInfo.name = option.name
    this.titleInfo.time = option.time
    this.tabActive = option.code; 
     
    if(option.showTabName){
      this.showTabs(option.showTabName);
    }else{
      this.showTab = this.tabList;
      this.$set(this.tabs, 'tabActive', parseInt(this.tabActive));
    }
     this.getData()
  },
  methods: {
    showTabs(names){ 
       let arr = names.split(',');
       this.showTab = this.tabList.filter(item=>arr.includes(item.name)).map((m,index)=>{
         return {
          ...m,
          index:index
        }
       });
      let list = this.showTab.filter(f=>f.code == this.tabActive)[0]; 
      this.$set(this.tabs, 'tabActive', list.index);
    },
    //获取工单情况
    getOrder() {
       let params = {
        data: this.params
      }
      orderDetail(params).then(res => {
        if (res.status == '200') {
          let data = res.data
          data.forEach(item => {
            item.code=0
            let v = item.ticketMetrics[0]
            item.newTaskNum = v.newTaskNum
            item.complateRate = v.complateRate
            item.taskCnt = v.taskCnt
            item.closedRate = v.closedRate
          });
          this.tableData = data
        } else {
          uni.showToast({ title: res.message, icon: "none" })
        }
      })
    },

    //获取综合巡检详情
    comprehensivePatrol() {
      let params = {
        data: this.params
      }
      integratedPatrolDetail(params).then(res => {
        if (res.status == '200') {
          let data = res.data
          data.forEach(item => {
            item.code=1
            let v = item.compositeList[0]
            item.ruleTaskCount = v.ruleTaskCount
            item.finishNum = v.finishNum
            item.finishRate = v.finishRate
            item.outFinishNum = v.outFinishNum
          });
          this.tableData = data
        } else { 
          uni.showToast({ title: res.message, icon: "none" })
        }
      })
    },

    //获取设备巡检详情
    devicePatrol() {
      let params = {
        data: this.params
      }
      devicePatrolDetail(params).then(res => {
        if (res.status == '200') {
          let data = res.data
          data.forEach(item => {
            item.code=2
            let v = item.deviceMetrics[0]
            item.ruleTaskCount = v.ruleTaskCount
            item.finishNum = v.finishNum
            item.finishRate = v.finishRate
            item.outFinishNum = v.outFinishNum
          });
          this.tableData = data
        } else {
          uni.showToast({ title: res.message, icon: "none" })
        }
      })
    },

    //获取收费详情
    charge() {
      let params = {
        data: this.params
      }
      chargesDetail(params).then(res => {
        if (res.status == '200') {
          this.tableData = res.data
          this.tableData.forEach(item=>{
            item.code=3
          })
        } else {
          uni.showToast({ title: res.message, icon: "none" })
        }
      })
    },

    tabsChange(e) {
      this.tabActive = e.index
      this.params. sortParameters=''
      this.downListAct=''
      this.getData()
    },

    getData() {
      this.tableData= [];
      let e = this.tabActive
      if (e == 0) {
        this.showColumn = this.column;
        this.dataList = this.orderList;
        this.getOrder()
       } else if (e == 1) {  
        this.column[2]={ name: 'num2', label: '巡检指标', align: 'center', formatter: true };
        this.showColumn = this.column;
        this.dataList = this.patrolList;
        this.comprehensivePatrol() 
      } else if (e == 2) {    
        this.column[2]={ name: 'num2', label: '设备指标', align: 'center', formatter: true };
        this.showColumn = this.column;    
        this.dataList = this.patrolList;
        this.devicePatrol() 
      } else if (e == 3) {
        this.column[2]={ name: 'num2', label: '收费指标', align: 'center', formatter: true };
        this.showColumn = this.column;        
        this.dataList = this.chargeList;
        this.charge() 
      }
    },

    change(e) {
      this.downListAct = e.code
      this.params.sortParameters = e.code
      this.tableData = []
      this.getData()
      console.log('点击示例一选项：', e)
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 2) {
        return {
          color: '#333333',
          fontSize: '12px',
          'white-space': 'break-spaces',
          'line-height': '20px',
          'minWidth': '190px',
        }
      } else {
        return {
          color: '#333333',
          'fontSize': '12px',
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': 1,
          'minWidth': '30px',
          'maxWidth': '100px',
          'white-space': 'inherit'
        }
      }

    },
    headercellStyle({ column, columnIndex }) {
      if (columnIndex == 1) {
        return {
          color: '#333333',
          'fontSize': '12px',
          'minWidth': '30px',
          'maxWidth': '100px',
        }
      } else if (columnIndex == 2) {
        return {
          color: '#333333',
          fontSize: '12px',
          'minWidth': '190px',
        }
      } else {
        return {
          color: '#333333',
          fontSize: '12px',
        }
      }
    },
    formatterAction(row, column, rowIndex, columnIndex) {
      let e=row.code
      if ( e  == 0) {
        return `新工单：${row['newTaskNum']} 完成率：${row['complateRate']} \n 总数:${row['taskCnt']} 关闭率:${row['closedRate']}`
      } else if ( e  == 1 ||  e  == 2) {
        return `总数：${row['ruleTaskCount']} 完成数：${row['finishNum']} \n 完成率:${row['finishRate'] || 0} 过期数:${row['outFinishNum'] || 0}`
      } else if ( e  == 3) {
        return `收费记录数：${row['recordsCount']}`
      }
    },
  },
  created() {

  },
  mounted() {

  },
}
</script>
<style scoped lang="scss">
.pagesbox {
  box-sizing: border-box;
  height: 100vh;
  width: 100%;
  background-color: #f5f6f8;
  padding: 0 20rpx 0;
  padding-top: 290rpx;
}
.top-cont{
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 99;
  padding:0 20rpx;
  box-sizing: border-box;
}
.head-tabs {
  margin-bottom: 24rpxs;
  background: #FFFFFF;
  display: flex;

  .tabs-sort {
    height: 44px;
    line-height: 44px;
    text-align: right;
    flex: 1;
    // margin: 0 10px;    
    font-size: 26rpx;
    color: #2761FF;
    width: 100%;     
    display: flex;
    align-items: center;
    justify-content: flex-end; 
    margin: 0 -10px;
  }
}
.select-box{
  width: 100%;
  // text-align: right;
}
.select-box ::v-deep .card {
  top: 120rpx !important; 
}

.btn-info1 {
  width: 300rpx;
  height: 88rpx;
  margin: 0 auto;
  margin-top: 30rpx;
  border: solid #f0f0f0 1px;
  border-radius: 12rpx;
  padding: 0 30rpx;
  line-height: 88rpx;
}
.table-cont{
  height: calc(100vh - 160px);
}
</style>
