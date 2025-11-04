<template>
  <view class="table-page">
    <view class="subtitle">
      <view class="subtitle-item">
        <text class="tltle">{{title}}</text>
      </view>
      <view class="subtitle-item">
        <view :class="selectArea ? 'subItem-item-active' : 'subItem-item'" @click="changeArea(true)">{{$t('区域')}}</view>
        <view :class="!selectArea ? 'subItem-item-active' : 'subItem-item'" @click="changeArea(false)">{{$t('项目')}}</view>
      </view>
    </view>
    <view>
      <zb-table :cell-style="cellStyle" :cell-header-style="headercellStyle" :show-header="true" :columns="column"
        :stripe="true" :fit="true" :data="tableData"></zb-table>
        <!-- @rowClick="rowClick" @toggleRowSelection="toggleRowSelection"
        @toggleAllSelection="toggleAllSelection" :border="false" @edit="buttonEdit" @dele="dele" -->
    </view>
    <view class="page-box">
      <view class="page-text" @click="changePage(0)" :class="{'act':pageIndex>1}">{{$t('上一页')}}</view>
      <view class="page-num">{{ pageIndex }}</view>
      <view class="page-text" @click="changePage(1)" :class="{'act':totalCount>pageIndex*pageSize}">{{$t('下一页')}}</view>
    </view>
  </view>
</template>

<script>
import i18n from '../../lang/index'

import {
  getTaskDisposeSituation,
  getQualityRanking,
  getAreaPatrolInspectionRanking,
  getProjectPatrolInspectionRanking,
  getCertifiedDetails,
  getCertifiedProjectId,
  getWarningRecordDetail,
  getIncomeBreakdown,
  getIncomeBreakdownProjectId

} from '@/service/datawarehouse'
export default {
  data(){
    let { O_USER_INFO } = this.$constant;
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
    return{
      companyId:userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID,
      selectArea:true,
      pageIndex:1,
      pageSize:10,
      totalCount:0,
      searchForm:{
        areaId:'',
        projectId:'',
        startTime:'',
        endTime:'',
      },
      pageType:'',
      title:'',
      tableData:[],
      column:[],
      gdclqkColumn: [
        { name: 'index', label: i18n.t('序号'), align: 'center' },
        { name: 'areaName', label: i18n.t('区域'), align: 'center', emptyString: '-' },
        { name: 'totalNum', label: i18n.t('工单总数'), align: 'center', sorter: true },
        { name: 'finishNum', label: i18n.t('工单完成数'), align: 'center', sorter: true },
        { name: 'finishRate', label: i18n.t('整改完成率'), align: 'center', sorter: true }
      ],
      yhyjqkColumn: [
        { name: 'index', label: i18n.t('序号'), align: 'center' },
        { name: 'name', label: i18n.t('区域'), align: 'center', emptyString: '-' },
        { name: 'num1', label: i18n.t('隐患数'), align: 'center', sorter: true },
        { name: 'num2', label: i18n.t('超期隐患'), align: 'center', sorter: true },
        { name: 'num3', label: i18n.t('预警数'), align: 'center', sorter: true },
        { name: 'num4', label: i18n.t('超期预警'), align: 'center', sorter: true },
      ],
      pzphbColumn: [
        { name: 'index', label: i18n.t('序号'), align: 'center' },
        { name: 'name', label: i18n.t('区域'), align: 'center', emptyString: '-' },
        { name: 'totalNum', label: i18n.t('核查任务'), align: 'center', sorter: true },
        { name: 'completeRate', label: i18n.t('任务完成率'), align: 'center', sorter: true },
        { name: 'questaskNum', label: i18n.t('下单数'), align: 'center', sorter: true },
        { name: 'completeTaskRate', label: i18n.t('整改完成率'), align: 'center', sorter: true },
      ],
      sbxjphbColumn: [
        { name: 'index', label: i18n.t('序号'), align: 'center' },
        { name: 'name', label: i18n.t('区域'), align: 'center', emptyString: '-' },
        { name: 'totalPatrolNum', label: i18n.t('巡检任务'), align: 'center', sorter: true },
        { name: 'finishPatrolRate', label: i18n.t('任务完成率'), align: 'center', sorter: true },
        { name: 'totalTaskNum', label: i18n.t('下单数'), align: 'center', sorter: true },
        { name: 'finishTaskRate', label: i18n.t('整改完成率'), align: 'center', sorter: true },
      ],
      rzmxColumn: [
        { name: 'index', label: i18n.t('序号'), align: 'center' },
        { name: 'name', label: i18n.t('区域'), align: 'center', emptyString: '-' },
        { name: 'userTotal', label: i18n.t('总房间数'), align: 'center', sorter: true },
        { name: 'clientTotal', label: i18n.t('总业主数'), align: 'center', sorter: true },
        { name: 'clientNum', label: i18n.t('认证业主'), align: 'center', sorter: true }
      ],
      yqmxColumn: [
        { name: 'index', label: i18n.t('序号'), align: 'center' },
        { name: 'name', label: i18n.t('区域'), align: 'center', emptyString: '-' },
        { name: 'warningNum', label: i18n.t('预警数'), align: 'center', sorter: true },
        { name: 'finishNum', label: i18n.t('完成数'), align: 'center', sorter: true },
        { name: 'taskTimeoutNum', label: i18n.t('超期数'), align: 'center', sorter: true }
      ],
      sfmxColumn:[
        { name: 'index', label: i18n.t('序号'), align: 'center' },
        { name: 'name', label: i18n.t('区域'), align: 'center', emptyString: '-' },
        { name: 'num1', label: i18n.t('收缴(万)'), align: 'center', sorter: true },
        { name: 'num2', label: i18n.t('收缴率'), align: 'center', sorter: true },
        { name: 'num3', label: i18n.t('当年收缴率'), align: 'center', sorter: true }
      ],
      qqmxColumn:[
        { name: 'index', label: i18n.t('序号'), align: 'center' },
        { name: 'name', label: i18n.t('区域'), align: 'center', emptyString: '-' },
        { name: 'num1', label: i18n.t('清欠(万)'), align: 'center', sorter: true },
        { name: 'num2', label: i18n.t('当年收缴率'), align: 'center', sorter: true },
        { name: 'num3', label: i18n.t('整体清欠率'), align: 'center', sorter: true }
      ],
      fwsrmxColumn:[
        { name: 'index', label: i18n.t('序号'), align: 'center' },
        { name: 'name', label: i18n.t('区域'), align: 'center', emptyString: '-' },
        { name: 'ordersNum', label: i18n.t('订单数'), align: 'center', sorter: true },
        { name: 'serviceRevenue', label: i18n.t('金额(万)'), align: 'center', sorter: true }
      ],
      ysmxColumn:[
        { name: 'index', label: i18n.t('序号'), align: 'center' },
        { name: 'name', label: i18n.t('区域'), align: 'center', emptyString: '-' },
        { name: 'num1', label: i18n.t('预收(万)'), align: 'center', sorter: true },
        { name: 'num2', label: i18n.t('当年预收(万)'), align: 'center', sorter: true }
      ],
      jsmxColumn: [
        { name: 'index', label: i18n.t('序号'), align: 'center' },
        { name: 'name', label: i18n.t('区域'), align: 'center', emptyString: '-' },
        { name: 'num1', label: i18n.t('收入(万)'), align: 'center', sorter: true },
        { name: 'num2', label: i18n.t('当年收入(万)'), align: 'center', sorter: true },
      ],
    }
    
  },

  onLoad(option){
    this.pageType = option.type;
    this.title = option.title
    this.initData()
  },

  methods:{
    initData(){
      if(this.pageType){
        this.column = this[`${this.pageType}Column`]
        this[`${this.pageType}Data`]()
      }
    },

    //经收明细
    jsmxData(){},

    //预收明细
    ysmxData(){},

    // 收费明细
    sfmxData(){},

    // 清欠明细
    qqmxData(){},

    // 服务收入明细
    fwsrmxData(){
      let params = {
        data:{
          companyId: this.companyId,
          startTime: this.searchForm.startTime,
          endTime: this.searchForm.endTime
        }
      }
      if(this.selectArea == false){
        params.data.areaId=this.searchForm.areaId
        params.data.projectId=this.searchForm.projectId
      }
      this.column[1].label = this.selectArea ?  '区域' :i18n.t('项目') ;
      let getData = this.selectArea ? getIncomeBreakdown(params,this.pageSize,this.pageIndex) : getIncomeBreakdownProjectId(params,this.pageSize,this.pageIndex)
      getData.then(res => {
        this.getTableData(res)
      })

    },

    // 舆情明细
    yqmxData(){
      let params = {
        data:{
          companyId: this.companyId,
          startTime: this.searchForm.startTime,
          endTime: this.searchForm.endTime,
          sign: this.selectArea ? '0' : '1', //0 --区域  1-- 项目
        }
      }
      if(this.selectArea == false){
        params.data.areaId=this.searchForm.areaId
        params.data.projectId=this.searchForm.projectId
      }
      this.column[1].label = this.selectArea ?  '区域' :i18n.t('项目') ;
      getWarningRecordDetail(params,10,1).then(res=>{
        this.getTableData(res)
      })
    },

    //认证明细
    rzmxData(){
      let params = {
        data:{
          companyId: this.companyId,
          startTime: this.searchForm.startTime,
          endTime: this.searchForm.endTime
        }
      }
      if(this.selectArea == false){
        params.data.areaId=this.searchForm.areaId
        // params.data.projectId=this.searchForm.projectId
      }
      this.column[1].label = this.selectArea ? '区域' : i18n.t('项目') ;
      let getData = this.selectArea ? getCertifiedDetails(params,this.pageSize,this.pageIndex) : getCertifiedProjectId(params,this.pageSize,this.pageIndex)
      getData.then(res=>{
        this.getTableData(res)
      })
    },
    // 设备巡检排行榜
    sbxjphbData(){
      let params={
        data:{   
          companyId: this.companyId,
          cstartTime:this.searchForm.startTime,
          endTime:this.searchForm.endTime,
        }
      }
      this.column[1].label = this.selectArea ?  '区域' :i18n.t('项目') ;
      let getData = this.selectArea ? getAreaPatrolInspectionRanking(params,this.pageSize,this.pageIndex) : getProjectPatrolInspectionRanking(params,this.pageSize,this.pageIndex)
      getData.then(res =>{
        this.getTableData(res)
      })
    },
    // 品质排行榜
    pzphbData(){
      let params={
        data:{   
          companyId: this.companyId,
          sign: this.selectArea ? '0' : '1', //0 --区域  1-- 项目
          startTime:this.searchForm.startTime,
          endTime:this.searchForm.endTime,
        }
      }
      if(this.selectArea == false){
        params.data.areaId=this.searchForm.areaId
      }
      this.column[1].label = this.selectArea ?  '区域' :i18n.t('项目') ;
      getQualityRanking(params,this.pageSize,this.pageIndex).then(res =>{
        this.getTableData(res)
      })
    },

    // 隐患预警情况
    yhyjqkData(){
      this.column[1].label = this.selectArea ? '区域' : i18n.t('项目');
      let data = [];
      for (var i = 1; i < 5; i++) {
        data.push({
          index:i,
          name: this.selectArea ? '广州区域' : i18n.t('广州项目'),
          num1: uni.$u.random(0, 100),
          num2: uni.$u.random(0, 100),
          num3: uni.$u.random(0, 100),
          num4: uni.$u.random(0, 100),
        })
      }
      this.tableData = data;
    },

    // 工单处理情况
    gdclqkData(){
      let params={
        data:{   
          companyId:this.companyId,
          areaId:this.searchForm.areaId,
          projectIds:this.searchForm.projectId,
          startTime:this.searchForm.startTime,
          endTime:this.searchForm.endTime,
          sign: this.selectArea ? "0" : "1" //排行榜标记 0 --区域  1-- 项目
        }
      }
      this.column[1].label = this.selectArea ? '区域' : i18n.t('项目') ;
      getTaskDisposeSituation(params,this.pageSize,this.pageIndex).then(res =>{
        if(res.status=='200'){
          let list = res.data.records
          this.totalCount=res.data.total
          list.forEach((item,i) => {
            item.areaName = this.selectArea ? item.areaName : item.projectName
            item.index = (this.pageSize*(this.pageIndex-1)) + i + 1
          });
          this.tableData = list
        }else{
          this.tableData = []
          this.totalCount = 0
        }
      })
    },

    // 赋值数据
    getTableData(res){
      if(res.status=='200'){
        let list = res.data.records
        this.totalCount = res.data.total
        if(list){
          list.forEach((item,i) => {
            item.name = this.selectArea ?  item.areaName :item.projectName 
            item.index = (this.pageSize*(this.pageIndex-1)) + i + 1
          });
          this.tableData = list
        }else {
          this.tableData = []
        }
      }
    },

    //切换项目区域
    changeArea(type){
      if(this.selectArea ==type){
        return
      }
      this.selectArea = type
      this.pageIndex = 1
      this.initData()
    },

    //切换表格页码
    changePage(type){
      if(type==0 && this.pageIndex !=1){
        this.pageIndex --
        this.initData()
      }
      if(type==1 && this.totalCount>this.pageIndex*this.pageSize){
        this.pageIndex ++
        this.initData()
      }
    },

    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 1) {
        return {
          color: '#333333',
          'fontSize': '11px',
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': 1,
          'minWidth': '30px',
          'maxWidth': '100px',
          'white-space': 'inherit'
        }
      } else {
        return {
          color: '#333333',
          fontSize: '11px',
        }
      }
    },
    headercellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 1) {
        return {
          color: '#333333',
          'fontSize': '11px',
          'minWidth': '30px',
          'maxWidth': '100px',
        }
      } else {
        return {
          color: '#333333',
          fontSize: '10px',
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import url(./css/kanban.sass);
.subtitle{
  padding:24rpx;
  margin: 0;
  box-sizing: border-box;
}
.tltle{
  font-weight: bold;
  font-size: 30rpx;
}
.page-box{
  display: flex;
  justify-content: right;
  padding: 24rpx;
  .page-text{
    text-align: center;
    width: 120rpx;
    padding: 4rpx;
    border-radius: 6rpx;
    color: #999;
    font-size: 28rpx;
    border: 2rpx solid #e8e8e8;
  }
  .page-num{
    display: flex;
    align-items: center;
    margin: 2rpx 30rpx;
  }
  .act{
    color: #5cadff;
    border: 2rpx solid #5cadff;
  }

}
</style>