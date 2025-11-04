<!--  -->
<template>
  <view class='box'>
    <view class="title">
      <view class="jz">
        <text>{{ category == 'community' ? $t('客户舆情') : $t('客服舆情') }}</text>
        <!-- <view style="margin: 0 18rpx;" v-show="category == 'community'"><date-picker></date-picker></view> -->

      </view>
      <u-icon v-if="category != 'community'" @click="jumpEvent" name="arrow-right" color="#B6B6B6" size="18"></u-icon>
    </view>
    <view class="ybox">
      <view class="ybox-item">
        <view class="text1 view-margin8">{{ category == 'community' ? $t('社区沟通') : $t('认证概况') }}</view>
        <view class="text2 view-margin">{{ category == 'community' ? $t('社区企微群') : $t('户数认证覆盖率') }}</view>
        <view class="text3 view-margin">{{ category == 'community' ? currentCommunityGroup : userRete }}</view>
        <view class="view-margin">
          <text class="text4">{{$t('环比')}}</text>
          <text class="text5" :class="chain1">{{ category == 'community' ? communityGroupRatio : userChain }} </text>
          <image v-if="chain1!='none'" :src="require(`@/static/${[THEME_NAME]}/kanban/${chain1}.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>
        </view>
        <u-gap height="10" bg-color="#F8F8F8"></u-gap>
        <view class="text2 view-margin">{{ category == 'community' ? $t('存档对话数') : $t('认证户数') }}</view>
        <view class="text3 view-margin">{{ category == 'community' ? archiveMessageCount :  userNum }}</view>
        <view class="text4 view-margin">{{ category == 'community' ? $t('存档员工数')+archiveStaffCount : $t('认证客户数')+clientNum }}</view>
      </view>
      <view class="ybox-item">
        <view class="text1 color-r view-margin8">{{$t('舆情预警')}}</view>
        <view class="text2 view-margin">{{$t('当月舆情预警数')}}</view>
        <view class="text3 view-margin">{{currMonthTotal}}</view>
        <view class="view-margin">
          <text class="text4">{{$t('环比')}}</text>
          <text class="text5" :class="chain2">{{ currMonthTotalRatio }}</text>
          <image v-if="chain2!='none'" :src="require(`@/static/${[THEME_NAME]}/kanban/${chain2}.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>
        </view>
        <u-gap height="10" bg-color="#F8F8F8"></u-gap>
        <view class="text2 view-margin">{{$t('当月预警处理数')}}</view>
        <view class="text3 view-margin">{{currMonthProcessedCount}}</view>
        <view class="text4 view-margin">{{$t('本年处理数 {0}', [currYearProcessedCount])}}</view>
      </view>
    </view>
    <view class="subtitle">
      <text>{{$t('舆情态势图')}}</text>
    </view>
    <qiun-data-charts :canvas2d='true' :canvasId='canvasIds' type="word" :opts="opts2" :chartData="chartData2" />
    <view v-if="category == 'community'" class="subtitle">
      <view class="subtitle-item">
        <text>{{$t('舆情明细')}}</text>
        <u-icon @click="toDetail" name="arrow-right" size="10" color="#B2B2B2"></u-icon>
      </view>
      <view class="subtitle-item">
        <view :class="selectArea ? 'subItem-item-active' : 'subItem-item'" @click="getWarningRecordDetailDataAll">{{$t('区域')}}</view>
        <view :class="!selectArea ? 'subItem-item-active' : 'subItem-item'" @click="getWarningRecordDetailData">{{$t('项目')}}</view>
      </view>
    </view>
    <view v-if="category == 'community'">
      <zb-table :cell-style="cellStyle" :cell-header-style="headercellStyle"  :show-header="true" :columns="column" :stripe="true" :fit="true" @rowClick="rowClick"
                @toggleRowSelection="toggleRowSelection" @toggleAllSelection="toggleAllSelection" :border="false"
                @edit="buttonEdit" @dele="dele" :data="tableData"></zb-table>
    </view>
  </view>
</template>

<script>
import i18n from '../../../lang/index'

import {
  getWarningRecordInfo,
  getWarningKeyWordList,
  getAuthentication,
  getWarningRecordDetail,
  getCommunityCommunication,
} from '@/service/datawarehouse'
import { isNegative } from '../../../js/utils/util'
import DatePicker from './date-picker.vue';
export default {
  components: {DatePicker},
  props: {
    category: {
      type: String,
      default: 'manage'  //manage 客服舆情  community 客户舆情
    },
    canvasIds: {
      type: String,
    }
  },
  data() {    
    let { O_USER_INFO } = this.$constant;
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
    return {
      companyId:userInfo.companyId?userInfo.companyId:this.$appConfig.COMPLANY_ID,
      selectArea:false,
      show: false,
      value: '',
      chartData2: {},
      //您可以通过修改 config-ucharts.js 文件中下标为 ['word'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts2 。实际应用过程中 opts2 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
      opts2: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: undefined,
        enableScroll: false,
        extra: {
          word: {
            type: "vertical",
            autoColors: false
          }
        }
      },
      tableData: [],
            column: [
                { type: 'index', label: i18n.t('序号'), align: 'center' },
                { name: 'areaName', label: i18n.t('区域'), align: 'center', emptyString: '-' },
                { name: 'warningNum', label: i18n.t('预警数'), align: 'center', sorter: true },
                { name: 'finishNum', label: i18n.t('完成数'), align: 'center', sorter: true },
                { name: 'taskTimeoutNum', label: i18n.t('超期数'), align: 'center', sorter: true }

            ],
      currMonthTotal:'0',
      currMonthTotalRatio:'0.00%',
      currMonthProcessedCount:'0',
      currYearProcessedCount:'0',
      userNum:'0',
      userRete:'0',
      userChain:'0.00%',
      userTotal:'0',
      clientNum:'0',
      allWordList:[],
      areaId:'',
      projectId:'',
      currentMonth:'',
      archiveMessageCount:'0',
      archiveStaffCount:'0',
      communityGroupRatio:'0.00%',
      currentCommunityGroup:'0',
      chain1:'none',
      chain2:'none',
      startTime:'',
      endTime:''
    };
  },
  computed: {},
  watch: {},
  methods: {
    toDetail(){
      uni.navigateTo({
        url: i18n.t('/pages-kanban/kanban/tableDetail?type=yqmx&title=舆情明细')
      })
    },
    jumpEvent(){
      let params={
        tab1:'4', //社区运营
        listName:'communityList',//社区运营
        id:'comYq' //客户舆情
      }
      this.$emit('jumpEvent',params)
    },
    getWarningRecordDetailDataAll(){
      this.selectArea = true
      this.column[1].label=i18n.t('区域')
      let params = {
            data:{
                companyId: this.companyId,
                startTime: this.startTime,
                endTime: this.endTime,
                sign:'0'
            }
        }
        getWarningRecordDetail(params,10,1).then(res=>{
            if(res.status == '200'){
              this.tableData = res.data.records
            }
        })
    },
    getWarningRecordDetailData(){
        this.selectArea = false
        this.column[1].label=i18n.t('项目')
        let params = {
            data:{
                companyId: this.companyId,
                areaId:this.areaId,
                projectId:this.projectId,
                startTime: this.startTime,
                endTime: this.endTime,
                sign:'1'
            }
        }
        getWarningRecordDetail(params,10,1).then(res=>{
            if(res.status == '200'){
              let data = res.data.records
              data.forEach(item => {
                item.areaName = item.projectName
              });
              this.tableData = data
            }
        })
    },
    getWarningKeyWordListData(){
        let params = {
            data:{
                companyId: this.companyId,
                areaId:this.areaId,
                projectId:this.projectId,
                startTime: this.startTime,
                endTime: this.endTime,
            }
        }
        getWarningKeyWordList(params).then(res=>{
            if(res.status == '200' && res.data && res.data.length > 0){
              res.data.map((item,index)=>{
                this.allWordList.push({
                  name: item.name,
                  textSize: 30-index,
                  data:undefined
                })
              })
              this.getServerData()
            }else {
              this.chartData2 = {
                series:[{name:''}]
              }
              // setTimeout(() => {
              //     //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
              //     let res = {
              //       series: [ { name: "安防", textSize: 35, data: undefined },
              //           { name: "漏水", textSize: 30, data: undefined },
              //           { name: "墙皮", textSize: 30, data: undefined },
              //           { name: "脱落", textSize: 30, data: undefined },
              //           { name: "吵闹", textSize: 22, data: undefined },
              //           { name: "炒房价", textSize: 22, data: undefined },
              //           { name: "噪音污染", textSize: 22, data: undefined },
              //           { name: "拖欠工资", textSize: 22, data: undefined },
              //           { name: "臭味垃圾", textSize: 15, data: undefined }]
              //     };
              //     this.chartData2 = JSON.parse(JSON.stringify(res));
              //   }, 500);
             }
        })
    },
    getAuthenticationData(){
        let params = {
            data:{
                companyId: this.companyId,
                areaId:this.areaId,
                projectId:this.projectId,
                startTime: this.startTime,
                endTime: this.endTime,
            }
        }
        getAuthentication(params).then(res=>{
            if(res.status == '200' && res.data){
                this.userNum = res.data.userNum
                this.userRete = res.data.userRete
                const uc = this.userChain = res.data.userChain
                this.chain1 = uc == '-' || parseFloat(cmtr) === 0 ? 'none' : isNegative(this.userChain) ? 'icon-down1' : 'icon-up'
                this.userTotal = res.data.userTotal
                this.clientNum = res.data.clientNum
            }
        })
    },
    getWarningRecordInfoData(){
        let params = {
            data:{
                companyId: this.companyId,
                pareaId:this.areaId,
                projectId:this.projectId,
                startTime: this.startTime,
                endTime: this.endTime,
            }
        }
        getWarningRecordInfo(params).then(res=>{
            if(res.status == '200'){
                this.currMonthTotal = res.data.currMonthTotal
                const cmtr = this.currMonthTotalRatio = res.data.currMonthTotalRatio
                this.chain2 = parseFloat(cmtr) > 0 ? 'icon-up' : parseFloat(cmtr) < 0 ?'icon-down1' : 'none'
                this.currMonthProcessedCount = res.data.currMonthProcessedCount
                this.currYearProcessedCount = res.data.currYearProcessedCount
            }
        })
    },
    getCommunityCommunicationData(){
        let params = {
            data:{
                companyId: this.companyId,
                areaId:this.areaId,
                projectId:this.projectId,
                startTime: this.startTime,
                endTime: this.endTime,
            }
        }
        getCommunityCommunication(params).then(res=>{
            if(res.status == '200' && res.data){
              this.archiveMessageCount = res.data.archiveMessageCount
              this.archiveStaffCount = res.data.archiveStaffCount
              const cgr = this.communityGroupRatio = res.data.communityGroupRatio
              this.chain1 = parseFloat(cgr) > 0 ? 'icon-up' : parseFloat(cgr) < 0 ?'icon-down1' : 'none'
              this.currentCommunityGroup = res.data.currentCommunityGroup
            }
        })
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
    getServerData() {
      //模拟从服务器获取数据时的延时
      setTimeout(() => {
        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
        let res = {
          series: this.allWordList
        };
        this.chartData2 = JSON.parse(JSON.stringify(res));
      }, 500);
    },
    confirm(val) {
      this.show = false;
      this.value = val[0];

    },
    init(params){
      this.areaId = params.areaId
      this.projectId = params.projectId
      this.startTime = params.startTime
      this.endTime = params.endTime
      let that = this; 
      that.$nextTick(() => {
        // that.getServerData()
        that.getWarningRecordInfoData()
        that.getWarningKeyWordListData()
        if(that.category == 'community'){
          this.getWarningRecordDetailData()
          this.getCommunityCommunicationData()
        }else{
          that.getAuthenticationData()
        }
      })
    }
  },
  created() {

  },
  mounted() {
    // let that = this; 
    // that.$nextTick(() => {
    //   // that.getServerData()
    //   that.getWarningRecordInfoData()
    //   that.getWarningKeyWordListData()
    //   if(that.category == 'community'){
    //     this.getWarningRecordDetailData()
    //   }else{
    //     that.getAuthenticationData()
    //   }
    // })
  },
}
</script>
<style scoped  lang="scss">
@import url(../css/kanban.sass);

.box {

  background-color: #FFFFFF;
  padding: 20rpx;
  margin: 0 20rpx;
  border-radius: 12rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #222222;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

}

.subtitle {
  font-size: 24rpx;
  color: #333333;
  margin: 24rpx 0;
}

.view-margin {
  margin: 0 0 8rpx 0;
}

.view-margin8 {
  margin: 0 0 16rpx 0;
}

.ybox {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 15px;
  margin-top: 20rpx;

  .ybox-item {
    padding: 20rpx;
    background: #F8F8F8;

    .text1 {
      font-size: 24rpx;
      font-weight: bold;
      color: #2761FF;
    }

    .text2 {
      font-size: 24rpx;
      color: #333333;
    }

    .text3 {
      font-size: 40rpx;
      font-family: 'DIN';
      font-weight: bold;
      color: #333333;
    }

    .text4 {
      font-size: 20rpx;
      color: #999999;
    }

    .text5 {
      font-size: 20rpx;
      font-weight: 400;
      margin-left: 8rpx;
    }

    .icon-down1 {
      color: #E71E1E;
    }

    .icon-up {
      color: #33BA73;
    }

    .none {
      color: #999999;
    }
  }

}

.jz {
  display: flex;
  align-items: center;
}

.jz::before {
  content: "";
  height: 32rpx;
  width: 6rpx;
  background: #2761FF;
  margin: 0 10rpx 0 0;
  position: absolute;
  left: 20rpx;
}

.selectDate {
  float: right;
  margin: 0 20rpx;
}

.calendar ::v-deep .u-popup__content {
  margin-bottom: 100rpx;
}</style>