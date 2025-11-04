<!--  -->
<template>
    <view class='block'>
        <view class="bigTitle">
            <view class="jz">
                <text>{{ category == 'inspection' ? $t('设备巡检') : $t('品质管理') }}</text>
            </view>
        </view>
        <view class="content">
            <view class="content-item1">
                <view class="itembox">
                    <view class="text-grey view-marginBottom">{{ category == 'inspection' ? $t('设备巡检完成率') : $t('核查任务完成率') }}</view>
                    <!-- 跨月搜索，环比显示 “-” -->
                    <view v-if="category == 'inspection' && patrolRuleTaskFinishChain=='-' || category != 'inspection' && taskCompletionRateComparedLastMonth=='-'">
                        <text class="text-bold">{{category == 'inspection' ? patrolRuleTaskFinishRate  : taskCompletionRate }}</text>
                        <text class="text-lightgrey item-sides">{{category == 'inspection' ? $t('环比'):$t('较上月')}}{{category == 'inspection' ? patrolRuleTaskFinishChain : taskCompletionRateComparedLastMonth }}</text>
                    </view>
                    <view v-else>
                        <text class="text-bold">{{category == 'inspection' ? patrolRuleTaskFinishRate  : taskCompletionRate }}</text>
                        <text class="text-lightgrey item-sides">{{category == 'inspection' ? $t('环比'):$t('较上月')}}</text>
                        <text :class="$idxArrow({val: category == 'inspection' ? patrolRuleTaskFinishChain : taskCompletionRateComparedLastMonth, uCls: 'text-green', dCls: 'text-red', dfCls: 'text-grey'}).clsName">{{category == 'inspection' ? patrolRuleTaskFinishChain : taskCompletionRateComparedLastMonth }}</text>
                        <image v-if="$idxArrow({val: category == 'inspection' ? patrolRuleTaskFinishChain : taskCompletionRateComparedLastMonth}).isDown" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-down1.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>
                        <image v-if="$idxArrow({val: category == 'inspection' ? patrolRuleTaskFinishChain : taskCompletionRateComparedLastMonth}).isUp" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>
                    </view>
                </view>
                <view class="itembox">
                    <view class="text-grey view-marginBottom">{{ category == 'inspection' ? $t('巡检异常率') : $t('核查异常率') }}</view>
                    <view v-if="category == 'inspection' && patrolRuleAbnormalChain=='-' || category != 'inspection' && anomalyRateComparedLastMonth=='-'">
                        <text class="text-bold">{{category == 'inspection' ? patrolRuleAbnormalRate  : anomalyRate }}</text>
                        <text class="text-lightgrey item-sides">{{category == 'inspection' ? $t('环比'):$t('较上月')}}{{category == 'inspection' ? patrolRuleAbnormalChain : anomalyRateComparedLastMonth }}</text>
                    </view>
                    <view v-else>
                        <text class="text-bold">{{category == 'inspection' ? patrolRuleAbnormalRate : anomalyRate }}</text>
                        <text class="text-lightgrey item-sides">{{category == 'inspection' ? $t('环比'):$t('较上月')}}</text>
                        <text  :class="$idxArrow({val: category == 'inspection' ? patrolRuleAbnormalChain : anomalyRateComparedLastMonth, uCls: 'text-green', dCls: 'text-red', dfCls: 'text-grey'}).clsName">{{category == 'inspection' ? patrolRuleAbnormalChain :  anomalyRateComparedLastMonth }}</text>
                        <image v-if="$idxArrow({val: category == 'inspection' ? patrolRuleAbnormalChain : anomalyRateComparedLastMonth}).isDown" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-down1.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>
                        <image v-if="$idxArrow({val: category == 'inspection' ? patrolRuleAbnormalChain : anomalyRateComparedLastMonth}).isUp" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>
                    </view>
                </view>
            </view>
            <view class="content-item2">
                <view class="itembox view-marginBottom">
                    <view class="text-grey">{{$t('核查任务数')}}</view>
                    <view class="text-bold">{{ category == 'inspection' ? totalRuleTaskNum :  taskNum }}</view>
                    <view class="text-lightgrey2">{{$t('完成任务数')}} {{category =='inspection' ? finishPatrolRuleTaskNum : completedTaskNum }}</view>
                </view>
                <view class="itembox view-marginBottom" v-if="projectCode!='KAIHUA'">
                    <view class="text-grey">{{$t('下单数')}}</view>
                    <view class="text-bold">{{category == 'inspection' ? placeOrderNum : ordersNum }}</view>
                    <view class="text-lightgrey2" v-if="category == 'inspection' && totalTaskChain=='-' || category != 'inspection' && ordersNumChain=='-'">{{$t('环比')}}{{category =='inspection' ? totalTaskChain : ordersNumChain }}
                    </view>
                    <view v-else class="text-lightgrey2">{{$t('环比')}}<text  :class="$idxArrow({val: category == 'inspection' ? totalTaskChain : ordersNumChain, uCls: 'text-green', dCls: 'text-red', dfCls: 'text-grey'}).clsName">{{category == 'inspection' ? totalTaskChain : ordersNumChain }}</text>
                        <image v-if="$idxArrow({val: category == 'inspection' ? totalTaskChain : ordersNumChain}).isDown" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-down1.png`)"
                            style="width:16rpx;height:16rpx;"></image>
                            <image v-if="$idxArrow({val: category == 'inspection' ? totalTaskChain : ordersNumChain}).isUp" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>
                    </view>
                </view>
                <view class="itembox view-marginBottom" v-if="projectCode!='KAIHUA'">
                    <view class="text-grey">{{$t('整改完成数')}}</view>
                    <view class="text-bold">{{ category == 'inspection' ? patrolFinishTaskNum : rectificationCompletedNum }}</view>
                    <view class="text-lightgrey2">{{$t('整改完成数')}} {{ category =='inspection' ? patrolFinishTaskRate : rectificationCompletedRate }}</view>
                </view>
            </view>
        </view>
        <view class="subtitle">
            <text>{{ category == 'inspection' ? $t('设备巡检趋势图') : $t('品质核查趋势图') }}</text>
        </view>
        <view>
            <qiun-data-charts v-if="show" :onmovetip="true" :ontouch="true"  :canvas2d='true' :canvasId='canvasId' type="line"
                :opts="opts" :chartData="chartData" :tooltipFormat="'percentage'"/>
        </view>
        <view class="subtitle">
            <view class="subtitle-item">
                <text>{{ category == 'inspection' ? $t('设备巡检排行榜') : $t('品质核查排行榜') }}</text>
                <u-icon @click="toDetail" name="arrow-right" size="10" color="#B2B2B2"></u-icon>
            </view>
            <view class="subtitle-item">
                <view :class="selectArea ? 'subItem-item-active' : 'subItem-item'"  @click="IsSelectArea(true)">{{$t('区域')}}</view>
                <view :class="!selectArea ? 'subItem-item-active' : 'subItem-item'"  @click="IsSelectArea(false)">{{$t('项目')}}</view>
            </view>
        </view>
        <view>
            <zb-table :cell-style="cellStyle" :cell-header-style="headercellStyle"  :show-header="true" :columns="column" :stripe="true" :fit="true" @rowClick="rowClick"
                @toggleRowSelection="toggleRowSelection" @toggleAllSelection="toggleAllSelection" :border="false"
                @edit="buttonEdit" @dele="dele" :data="tableData"></zb-table>
        </view>
    </view>
</template>

<script>
import i18n from '../../../../lang/index'

import {
    getQualityManagement,//设备管理
    getQualityTrendCharts,
    getQualityRanking,
    getPatrolCount,//设备巡检
    getPatrolTrend,
    getAreaPatrolInspectionRanking,
    getProjectPatrolInspectionRanking
} from '@/service/datawarehouse'
export default {
    components: {},
    props: {
        category: {
            type: String,
            default: 'inspection'  //inspection 巡检  patrol 巡逻
        },
        canvasIds: {
            type: String,
        }
    },
    data() {
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
        const { PROJECT_CODE } = this.$appConfig
        return {
            projectCode:PROJECT_CODE,
            companyId:userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID,
            //品质管理
            taskNum:'', //巡检任务数
            taskCompletionRate:'',//巡检任务完成率
            taskCompletionRateChain:'',     //巡检任务完成率环比
            anomalyRate:'', //异常率
            anomalyRateChain:'', //异常率环比
            anomalyRateComparedLastMonth:'',
            taskCompletionRateComparedLastMonth:'',
           taskNum :'',  //巡检任务数               
           completedTaskNum :'', //完成任务数
           ordersNum :'', //下单数
           ordersNumChain :'',   //下单数环比
           rectificationCompletedNum:'',//整改完成数
           rectificationCompletedRate:'', //整改完成率
           //设备巡检
           patrolRuleTaskFinishRate:'', //巡检任务完成率
            patrolRuleTaskFinishChain:'', //巡检任务完成率环比
            patrolRuleAbnormalRate:'', //异常率
            patrolRuleAbnormalChain:'', //异常率环比
            totalRuleTaskNum:'',  //巡检任务数               
            finishPatrolRuleTaskNum:'',  //完成任务数
            placeOrderNum :'', //下单数
            totalTaskChain:'',//下单数环比
            patrolFinishTaskNum:'',    //整改完成数
            patrolFinishTaskRate:'',  //整改完成率
            searchForm:{
                 areaId:'',
                 projectId:'',
                 date:''
               },
            canvasId:'',
            show:false,
            selectArea: true,
            chartData: {},
            //您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。

            opts: {
                color: ["#FA6400", "#FAAD13"],
                padding: [15, 10, 0, 15],
                enableScroll: false,
                dataLabel: false,
                legend: {},
                xAxis: {
                    fontSize: 10,
                },
                yAxis: {
                    gridType: 'solid',
                    dashLength: 8,
                    gridColor: '#F3F4F7',
                    splitNumber: 5,
                    data: [{
                        unit: '%',
                        type: 'value',
                        axisLine: false,
                        position: 'left',
                        fontSize: 9,
                        min: 0,
                        max: 100,

                    }]
                },
                extra: {
                    line: {
                        type: "straight",
                        width: 2,
                        activeType: "solid"
                    }
                }
            },
            column: [
                { type: 'index', label: i18n.t('序号'), align: 'center' },
                { name: 'name', label: i18n.t('区域'), align: 'center', emptyString: '-' },
                { name: 'num1', label: i18n.t('巡检任务'), align: 'center', sorter: true },
                { name: 'num2', label: i18n.t('任务完成率'), align: 'center', sorter: true },
                { name: 'num3', label: i18n.t('下单数'), align: 'center', sorter: true },
                { name: 'num4', label: i18n.t('整改完成率'), align: 'center', sorter: true },

            ],
            tableData: []
        };
    },
    computed: {},
    watch: { selectArea: {
            handler(val) {
                this.initTable();
            }
        },
        canvasIds: {
            immediate: true,
            deep: true,
            handler(val) {
                console.log('测试', val);
                this.canvasId = val;
                this.show = true;
            },
        },
    },
    methods: {
        toDetail(){
            let type = this.category == 'inspection' ? 'sbxjphb' : 'pzphb'
            let title = this.category == 'inspection' ? '设备巡检排行榜' : i18n.t('品质核查排行榜')
            uni.navigateTo({
                url: `/pages-kanban/kanban/tableDetail?type=${type}&title=${title}`
            })
        },
        IsSelectArea(data){
            console.log(173,data)
             if(this.category == 'inspection'){
                if(data == true){
                    this.selectArea = data
                    this.getAreaPatrolInspectionRanking(data)
                }else {
                    this.selectArea = data
                    this.getProjectPatrolInspectionRanking(data)
                }
                 this.initTable()
             }else {
                 this.selectArea = data
                this.getQualityRanking(data)
             }
        },
        initTable() { 
            this.column[1].label = this.selectArea?i18n.t('区域'):i18n.t('项目'); 
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

        proDataTrip(list){
            let list1 = []
            let list2 = []
            let list3 = []
            if(this.category == 'inspection'){
                list.map(item=>{
                list1.push(item.month)
                list2.push(item.taskFinishRate*1)  //完成率
                list3.push(item.patrolAnomalyRate*1)  //异常率
            })
            }
            if(this.category == 'patrol'){
                list.map(item=>{
                list1.push(item.key)
                list2.push(item.value1*1)  //完成率
                list3.push(item.value2*1)  //异常率
            })
            }
            let res = {
                categories: list1,
                series: [
                    {
                        name: i18n.t('任务完成率'),
                        data: list2
                    },
                    {
                        name: this.category == 'patrol'? i18n.t('核查异常率') : i18n.t('巡检异常率'),
                        data: list3
                    },
                ]
            };
            return res
        },
        getServerData() {
            //模拟从服务器获取数据时的延时
            // setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                if (this.category == 'patrol') {
                let res = {
                    categories: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
                    series: [
                        {
                            name: i18n.t('任务完成率'),
                            data: [80, 10, 70, 30, 90, 10, 25, 35, 60, 46, 85, 75]
                        },
                        {
                            name: i18n.t('巡检异常率'),
                            data: [55, 70, 80, 10, 20, 90, 35, 45, 50, 46, 65, 65]
                        }
                    ]
                };
                this.chartData = JSON.parse(JSON.stringify(res));
            } else {
                let res = {
                    categories: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
                    series: [
                        {
                            name: i18n.t('任务完成率'),
                            data: [80, 10, 70, 30, 90, 10, 25, 35, 60, 46, 85, 75]
                        },
                        {
                            name: i18n.t('巡检异常率'),
                            data: [55, 70, 80, 10, 20, 90, 35, 45, 50, 46, 65, 65]
                        }
                    ]
                };
                this.chartData = JSON.parse(JSON.stringify(res));
            }
            // }, 500);
        },

        //品质管理
        getQualityManagement(){
            console.log('this.companyId',this.companyId)
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.searchForm.areaId || '',
                    projectId:this.searchForm.projectId || '',
                    startTime:this.searchForm.startTime,
                    endTime:this.searchForm.endTime,
                }
            }
            getQualityManagement(params).then(res=>{
                if(res.status == '200' && res.data){
                    this.taskCompletionRateChain =res.data.taskCompletionRateChain //巡检任务完成率环比
                    this.rectificationCompletedNum = res.data.rectificationCompletedNum       //整改完成数
                    this.completedTaskNum = res.data.completedTaskNum //完成任务数
                    this.taskCompletionRate = res.data.taskCompletionRate //巡检任务完成率
                    this.taskNum = res.data.taskNum  //巡检任务数               
                    this.ordersNum =  res.data.ordersNum   //下单数
                    this.anomalyRateChain = res.data.anomalyRateChain //异常率环比
                    this.rectificationCompletedRate =  res.data.rectificationCompletedRate    //整改完成率
                    this.ordersNumChain = res.data.ordersNumChain //下单数环比
                    this.anomalyRate = res.data.anomalyRate //异常率
                    this.anomalyRateComparedLastMonth = res.data.anomalyRateComparedLastMonth //核查异常率较上月
                    this.taskCompletionRateComparedLastMonth = res.data.taskCompletionRateComparedLastMonth //核查任务完成率较上月
                }
            })
        },
        //品质巡检趋势图
        getQualityTrendCharts(){
            console.log('this.companyId',this.companyId)
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.searchForm.areaId || '',
                    projectId:this.searchForm.projectId || '',
                    startTime:this.searchForm.startTime,
                    endTime:this.searchForm.endTime,
                }
            }
            getQualityTrendCharts(params).then(res=>{
                if(res.status == '200' && res.data){
                    let data = this.proDataTrip(res.data)
                    this.chartData = JSON.parse(JSON.stringify(data));
                }
            })
        },
        // 品质排行榜
        getQualityRanking(changeData){
            console.log(377,changeData)
            const { areaId, projectId } = this.searchForm
             let params={
               data:{   
                areaId, 
                projectId,
                 companyId: this.companyId,
                 sign: this.selectArea ? '0' : '1', //0 --区域  1-- 项目
                 startTime:this.searchForm.startTime,
                endTime:this.searchForm.endTime,
               }
             }
             let size = 10
             let index = 1
             if(changeData == false){
                params.data.areaId=this.searchForm.areaId || ''
                // params.data.projectId=this.searchForm.projectId || ''
             }
           getQualityRanking(params,size,index).then(res =>{
             if(res.status=='200'){
               this.column[1].label = this.selectArea ?  i18n.t('区域') :i18n.t('项目') ;
               let list = res.data.records
               if(list){
                   list.forEach(item => {
                    item.name = this.selectArea ?  item.areaName :item.projectName 
                    item.num1 = item.totalNum  //巡检任务数
                    item.num2 = item.checkFinishTaskRate //任务完成率
                    item.num3 = item.quesTaskNum //下单数
                    item.num4 = item.completeTaskRate ? item.completeTaskRate : '0.00%' //整改完成率
                  });
                  this.tableData = list
               }else {
                this.tableData = []
               }
             
             }
      })
        },
        //设备巡检
        getPatrolCount(){
            console.log('this.companyId',this.companyId)
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.searchForm.areaId || '',
                    projectId:this.searchForm.projectId || '',
                    startTime:this.searchForm.startTime,
                    endTime:this.searchForm.endTime,
                }
            }
            getPatrolCount(params).then(res=>{
                if(res.status == '200' && res.data){
                    this.patrolRuleTaskFinishRate = res.data.patrolRuleTaskFinishRate //巡检任务完成率
                    this.patrolRuleTaskFinishChain =res.data.patrolRuleTaskFinishChain //巡检任务完成率环比
                    this.patrolRuleAbnormalRate = res.data.patrolRuleAbnormalRate //异常率
                    this.patrolRuleAbnormalChain = res.data.patrolRuleAbnormalChain //异常率环比
                    this.totalRuleTaskNum = res.data.totalRuleTaskNum  //巡检任务数               
                    this.finishPatrolRuleTaskNum =  res.data.finishPatrolRuleTaskNum   //完成任务数
                    this.placeOrderNum = res.data.placeOrderNum //下单数
                    this.totalTaskChain = res.data.totalTaskChain //下单数环比
                    this.patrolFinishTaskNum = res.data.patrolFinishTaskNum       //整改完成数
                    this.patrolFinishTaskRate =  res.data.patrolFinishTaskRate    //整改完成率
                }
            })
        },
        //品质巡检趋势图
        getPatrolTrend(){
            console.log('this.companyId',this.companyId)
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.searchForm.areaId || '',
                    projectId:this.searchForm.projectId || '',
                    startTime:this.searchForm.startTime,
                    endTime:this.searchForm.endTime,
                }
            }
            getPatrolTrend(params).then(res=>{
                if(res.status == '200' && res.data){
                    let data = this.proDataTrip(res.data)
                    this.chartData = JSON.parse(JSON.stringify(data));
                }
            })
        },
        // 设备巡检--区域
        getAreaPatrolInspectionRanking(changeData){
             let params={
               data:{   
                 companyId: this.companyId,
                 startTime:this.searchForm.startTime,
                 endTime:this.searchForm.endTime,
                 areaId:this.searchForm.areaId || '',
                 projectId:this.searchForm.projectId || '',
               }
             }
             let size = 10
             let current = 1
             getAreaPatrolInspectionRanking(params,size,current).then(res =>{
             if(res.status=='200'){
               this.column[1].label = i18n.t('区域')
               let list = res.data.records
               console.log(460,list)
               if(list){
                list.forEach(item => {
                 item.name = item.areaName 
                 item.num1 = item.totalPatrolNum  //巡检任务数
                 item.num2 = item.finishPatrolRate //任务完成率
                 item.num3 = item.totalTaskNum //下单数
                 item.num4 = item.finishTaskRate //整改完成率
               });
               this.tableData = list
               }else{
                this.tableData =[]
               }
             
             }
      })
        },
         // 设备巡检--项目
         getProjectPatrolInspectionRanking(changeData){
             let params={
               data:{   
                 companyId: this.companyId,
                 startTime:this.searchForm.startTime,
                 endTime:this.searchForm.endTime,
                 areaId:this.searchForm.areaId || '',
                 projectId:this.searchForm.projectId || '',
               }
             }
             let size = 10
             let current = 1
        getProjectPatrolInspectionRanking(params,size,current).then(res =>{
             if(res.status=='200'){
               this.column[1].label = i18n.t('项目')
               let list = res.data.records
               list.forEach(item => {
                 item.name =  item.projectName
                 item.num1 = item.totalPatrolNum  //巡检任务数
                 item.num2 = item.finishPatrolRate //任务完成率
                 item.num3 = item.totalTaskNum //下单数
                 item.num4 = item.finishTaskRate //整改完成率
               });
               this.tableData = list
             }
      })
        },
        init(params){
            let that = this;
        // that.$nextTick(() => {
            // this.getServerData();
        // })
        console.log(514,params)
        this.searchForm={...this.searchForm, ...params}
        this.initTable();
        this.column[2].label = this.category =='patrol'? i18n.t('核查任务'):i18n.t('巡检任务'); 

         if(this.category =='patrol'){
            that.getQualityManagement()
            that.getQualityTrendCharts()
            that.getQualityRanking()
         }else {
            that.getPatrolCount()
            that.getPatrolTrend()
            that.getAreaPatrolInspectionRanking()
         }
        }
    },
    created() {

    },
    mounted() {
        // let that = this;
        // // that.$nextTick(() => {
        //     // this.getServerData();
        // // })
        // this.initTable();
        //  if(this.category =='patrol'){
        //     that.getQualityManagement()
        //     that.getQualityTrendCharts()
        //     that.getQualityRanking()
        //  }else {
        //     that.getPatrolCount()
        //     that.getPatrolTrend()
        //     that.getAreaPatrolInspectionRanking()
        //  }
    },
}
</script>
<style scoped lang="scss">
@import url(../../css/kanban.sass);

.content-item1 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 20rpx;
    margin-bottom: 20rpx;
}

.content-item2 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 20rpx;
}

.itembox {
    background: #F8F8F8;
    // padding: 20rpx;
    padding: 20rpx 0 20rpx 20rpx;
    .text-bold {
        font-size: 40rpx;
        font-family: 'DIN';
        font-weight: bold;
        color: #333333;
    }

    .text-green {
        font-size: 20rpx;
        color: #33BA73;
    }
    .text-red{
        font-size: 20rpx;
        color: #E71E1E;
    }

    .text-grey {
        font-size: 20rpx;
        color: #666666;
    }

    .text-lightgrey {
        font-size: 20rpx;
        color: #999999;
    }

    .text-lightgrey2 {
        font-size: 20rpx;
        color: #A0A0A0;
    }
}
</style>