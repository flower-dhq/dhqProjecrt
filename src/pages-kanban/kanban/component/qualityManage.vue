<!--  -->
<template>
    <view class='box'>
        <view class="title">
            <view class="jz">
                <text>{{ category == 'patrol' ? $t('巡逻分析') : $t('品质管理') }}</text>
                <!-- <view style="margin: 0 18rpx;"><date-picker @confirm=""></date-picker></view> -->

            </view>
            <u-icon v-if="category == 'patrol'" @click="jumpEvent" name="arrow-right" color="#B6B6B6" size="18"></u-icon>
            <u-icon v-else @click="jumpEventPz" name="arrow-right" color="#B6B6B6" size="18"></u-icon>
        </view>
        <view class="q-grid">
            <view class="content-item1">
                <view class="q-grit-item grit0-item">
                    <view class="item1">{{ category == 'patrol' ? $t('巡逻任务完成率') : $t('核查任务完成率') }}</view>
                    <!-- 跨月搜索，环比显示 “-” -->
                    <view style="margin: 10rpx 0;" v-if="category == 'patrol' && patrolRuleTaskFinishChain=='-' || category != 'patrol' && taskCompletionRateComparedLastMonth=='-'">
                        <text class="item2">{{ category == 'patrol' ? patrolRuleTaskFinishRate : taskCompletionRate }}</text>
                        <text class="item3 leftRirght-margin">{{$t('较上月')}}</text>
                        <text class="item3">{{ category == 'patrol' ? patrolRuleTaskFinishChain : taskCompletionRateComparedLastMonth }}</text>
                    </view>
                    <view style="margin: 10rpx 0;" v-else><text class="item2">{{ category == 'patrol' ? patrolRuleTaskFinishRate : taskCompletionRate }}</text><text
                            class="item3 leftRirght-margin">{{$t('较上月')}}</text>
                        <text :class="$idxArrow({val: category == 'patrol' ? patrolRuleTaskFinishChain : taskCompletionRateComparedLastMonth }).clsName">{{ category == 'patrol' ? patrolRuleTaskFinishChain : taskCompletionRateComparedLastMonth }}</text>
                        <image v-if="$idxArrow({val: category == 'patrol' ? patrolRuleTaskFinishChain : taskCompletionRateComparedLastMonth }).isDown" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-down1.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>
                        <image v-if="$idxArrow({val: category == 'patrol' ? patrolRuleTaskFinishChain : taskCompletionRateComparedLastMonth }).isUp" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>

                    </view>
                </view>
                <view class="q-grit-item grit1-item">
                    <view class="item1">{{ category == 'patrol' ? $t('巡逻异常率') : $t('核查异常率') }}</view>

                    <view style="margin: 10rpx 0;" v-if="category == 'patrol' && patrolRuleAbnormalChain=='-' || category != 'patrol' && anomalyRateComparedLastMonth=='-'">
                        <text class="item2">{{ category == 'patrol' ? patrolRuleAbnormalRate : anomalyRate }}</text>
                        <text class="item3 leftRirght-margin">{{$t('较上月')}}</text>
                        <text class="item3">{{ category == 'patrol' ? patrolRuleAbnormalChain : anomalyRateComparedLastMonth }}</text>
                    </view>

                    <view style="margin: 10rpx 0;" v-else><text class="item2">{{ category == 'patrol' ? patrolRuleAbnormalRate : anomalyRate }}</text><text class="item3 leftRirght-margin">{{$t('较上月')}}</text>
                        <text :class="$idxArrow({val: category == 'patrol' ? patrolRuleAbnormalChain : anomalyRateComparedLastMonth}).clsName">{{ category == 'patrol' ? patrolRuleAbnormalChain : anomalyRateComparedLastMonth }}</text>
                        <image v-if="$idxArrow({val: category == 'patrol' ? patrolRuleAbnormalChain : anomalyRateComparedLastMonth}).isDown" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-down1.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>
                        <image v-if="$idxArrow({val: category == 'patrol' ? patrolRuleAbnormalChain : anomalyRateComparedLastMonth}).isUp"  :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>

                    </view>
                </view>
            </view>
            <view class="content-item2">
                <view class="q-grit-item grit2-item">
                    <view class="item1">{{ category == 'patrol' ? $t('巡逻任务数') : $t('核查任务数') }}</view>
                    <view class="item2">{{ category == 'patrol' ? totalRuleTaskNum : taskNum }}</view>
                    <view class="item3">{{$t('完成任务数')}} {{ category =='patrol' ? patrolFinishTaskNum : completedTaskNum }}</view>
                </view>
                <view class="q-grit-item grit3-item" v-if="projectCode!='KAIHUA'">
                    <view class="item1">{{$t('下单数')}}</view>
                    <view class="item2">{{ category == 'patrol' ? placeOrderNum : ordersNum }}</view>
                    <view class="item3" v-if="category == 'patrol' && totalTaskChain=='-' || category != 'patrol' && ordersNumChain=='-'">{{$t('环比')}}{{ category =='patrol' ? totalTaskChain : ordersNumChain }}
                    </view>
                    <view class="item3" v-else> 
                        <text>{{$t('环比')}}</text>
                        <text style="margin-left: 8rpx;" :class="$idxArrow({val: category == 'patrol' ? totalTaskChain : ordersNumChain}).clsName">{{ category == 'patrol' ? totalTaskChain : ordersNumChain }} </text>
                        <image v-if="$idxArrow({val: category == 'patrol' ? totalTaskChain : ordersNumChain}).isDown" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-down1.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>
                        <image v-if="$idxArrow({val: category == 'patrol' ? totalTaskChain : ordersNumChain}).isUp" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>
                    </view>
                </view>
                <view class="q-grit-item grit4-item" v-if="projectCode!='KAIHUA'">
                    <view class="item1">{{$t('整改完成数')}}</view>
                    <view class="item2">{{ category == 'patrol' ? patrolFinishTaskNum : rectificationCompletedNum }}</view>
                    <view class="item3">{{$t('整改完成数')}} {{ category =='patrol' ? patrolFinishTaskRate : rectificationCompletedRate }} </view>
                </view>
            </view>



        </view>
        <view class="subtitle">
            <text>{{ category == 'patrol' ? $t('综合巡逻趋势图') : $t('品质核查趋势图') }}</text>
        </view>
        <qiun-data-charts v-if="show" tooltipFormat="tooltipFormatTrend" :onmovetip="true" :ontouch="true" :canvas2d='true' :canvasId='canvasId' type="line"
            :opts="category == 'inspection' ? opts4 : opts41" :chartData="chartData4" />

    </view>
</template>

<script>
import i18n from '../../../lang/index'

import {
    getQualityManagement,
    getQualityTrendCharts,
    getPatrolCount,
    getPatrolTrend
} from '@/service/datawarehouse'
import DatePicker from './date-picker.vue';
export default {
    components: {DatePicker},
    props: {
        category: {
            type: String,
            default: 'inspection'  //inspection 核查  patrol 巡逻
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
            companyId: userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID,
            show: false,
            value: '',
            canvasId: '',
            show1: false,
            chartData4: {},
            //您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts4 。实际应用过程中 opts4 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
            opts41: {
                color: ["#2761FF", "#FAAD13"],
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
                    gridColor: '#EAEAEA',
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
            opts4: {
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
                    gridColor: '#EAEAEA',
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
            taskCompletionRate:'0',
            anomalyRateChain:'0',
            anomalyRateComparedLastMonth:'0',
            ordersNum:'0',
            completedTaskNum:'0',
            anomalyRate:'0',
            rectificationCompletedRate:'0',
            ordersNumChain:'0',
            rectificationCompletedNum:'0',
            taskCompletionRateChain:'0',
            taskNum:'0',
            pollingList:[],
            pollingList1:[],
            pollingList2:[],
            totalRuleTaskNum:'0',
            placeOrderNum:'0',
            patrolRuleTaskFinishChain:'0',
            totalTaskChain:'0',
            patrolRuleAbnormalChain:'0',
            patrolFinishTaskNum:'0',
            patrolRuleTaskFinishRate:'0',
            patrolFinishTaskRate:'0',
            patrolRuleAbnormalRate:'0',
            taskCompletionRateComparedLastMonth:'0',
            patrolList:[],
            patrolList1:[],
            patrolList2:[],
            areaId:'',
            projectId:'',
            currentMonth:'',
            startTime:'',
            endTime:''
        };
    },
    computed: {
        
    },
    watch: {
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
        jumpEvent(){
            let params={
                tab1:'3', //现场管理
                listName:'liveList',//数组名称
                id:'sitXj' //设备核查
            }
            this.$emit('jumpEvent',params)
        },
        jumpEventPz(){
            let params={
                tab1:'3', //现场管理
                listName:'liveList',//数组名称
                id:'sitPz' //品质管理
            }
            this.$emit('jumpEvent',params)
        },
        getPatrolTrendData(){
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getPatrolTrend(params).then(res=>{
                if(res.status == '200' && res.data){
                    this.patrolList = []
                    this.patrolList1 = []
                    this.patrolList2 = []
                    res.data.map(item=>{
                        this.patrolList.push(item.month)
                        this.patrolList1.push(item.taskFinishRate*1)
                        this.patrolList2.push(item.patrolAnomalyRate*1)
                    })
                    this.getServerData()
                }
            })
        },
        getPatrolCountData(){
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getPatrolCount(params).then(res=>{
                if(res.status == '200' && res.data){
                    this.totalRuleTaskNum = res.data.totalRuleTaskNum
                    this.placeOrderNum = res.data.placeOrderNum
                    this.patrolRuleTaskFinishChain = res.data.patrolRuleTaskCompareLastMonth
                    this.totalTaskChain = res.data.totalTaskChain
                    this.patrolRuleAbnormalChain = res.data.patrolRuleAbnormalCompareLastMonth
                    this.patrolFinishTaskNum = res.data.finishPatrolRuleTaskNum
                    this.patrolRuleTaskFinishRate = res.data.patrolRuleTaskFinishRate
                    this.patrolFinishTaskRate = res.data.patrolFinishTaskRate
                    this.patrolRuleAbnormalRate = res.data.patrolRuleAbnormalRate
                }
            })
        },
        getQualityManagementData(){
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getQualityManagement(params).then(res=>{
                if(res.status == '200' && res.data){
                    this.taskCompletionRate = res.data.taskCompletionRate
                    this.anomalyRateChain = res.data.anomalyRateChain
                    this.ordersNum = res.data.ordersNum
                    this.completedTaskNum = res.data.completedTaskNum
                    this.anomalyRate = res.data.anomalyRate
                    this.totalDeviceNum = res.data.totalDeviceNum
                    this.rectificationCompletedRate = res.data.rectificationCompletedRate
                    this.ordersNumChain = res.data.ordersNumChain
                    this.rectificationCompletedNum = res.data.rectificationCompletedNum
                    this.taskCompletionRateChain = res.data.taskCompletionRateChain
                    this.taskNum = res.data.taskNum
                    this.taskCompletionRateComparedLastMonth = res.data.taskCompletionRateComparedLastMonth
                    this.anomalyRateComparedLastMonth = res.data.anomalyRateComparedLastMonth
                    
                    // this.getServerData()
                }
            })
        },
        getQualityTrendChartsData(){
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getQualityTrendCharts(params).then(res=>{
                if(res.status == '200' && res.data){
                    this.pollingList = []
                    this.pollingList1 = []
                    this.pollingList2 = []
                    res.data.map(item=>{
                        this.pollingList.push(item.key)
                        this.pollingList1.push(item.value1*1)
                        this.pollingList2.push(item.value2*1)
                    })
                    this.getServerData()
                }
            })
        },
        getServerData() {
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                if (this.category == 'patrol') {

                    let res = {
                        categories: this.patrolList,
                        series: [
                            {
                                name: i18n.t('任务完成率'),
                                data: this.patrolList1,
                            },
                            {
                                name: i18n.t('巡逻异常率'),
                                data: this.patrolList2,
                            },
                        ]
                    };
                    this.chartData4 = JSON.parse(JSON.stringify(res));
                } else {
                    let res = {
                        categories: this.pollingList,
                        series: [
                            {
                                name: i18n.t('任务完成率'),
                                data: this.pollingList1,
                            },
                            {
                                name: i18n.t('核查异常率'),
                                data: this.pollingList2,
                            },
                        ]
                    };
                    this.chartData4 = JSON.parse(JSON.stringify(res));
                }

            }, 500);
        },
        confirm(val) {
            this.show1 = false;
            this.value = val[0];

        },
        init(params){
            this.areaId = params.areaId
            this.projectId = params.projectId
            this.startTime = params.startTime
            this.endTime = params.endTime
            let that = this;
            that.$nextTick(() => {
                if(this.category == 'patrol'){
                    this.getPatrolCountData()
                    this.getPatrolTrendData()
                }else{
                    this.getQualityManagementData()
                    this.getQualityTrendChartsData()
                }
            })
        }
    },
    created() {

    },
    mounted() {
        // let that = this;
        // that.$nextTick(() => {
        //     if(this.category == 'patrol'){
        //         this.getPatrolCountData()
        //         this.getPatrolTrendData()
        //     }else{
        //         this.getQualityManagementData()
        //         this.getQualityTrendChartsData()
        //     }
        // })
    },
}
</script>
<style scoped lang="scss">
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

.q-grid {

    // display: grid;
    // column-gap: 10px;
    // grid-row-gap: 10px;
    // grid:
    //     "fcol1 fcol1 fcol1 fcol2 fcol2 fcol2"
    //     "tcol3 tcol3 tcol4 tcol4 tcol5 tcol5";

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

    .q-grit-item {
        background-color: #F8F8F8;
        padding: 20rpx;
    } 
    .item1 {
        font-size: 20rpx;
        color: #666666;
    }

    .item2 {
        margin: 10rpx 0;
        font-size: 40rpx;
        font-family: 'DIN';
        font-weight: bold;
        color: #333333;
    }

    .leftRirght-margin {
        margin: 0 8rpx;

    }

    .item3 {
        color: #9EA7B4;
        font-size: 20rpx;
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
}
.item4 {
        font-size: 20rpx;
        color: #33BA73;
    }
    .item5 {
        font-size: 20rpx;
        color: #E71E1E;
    }  
</style>