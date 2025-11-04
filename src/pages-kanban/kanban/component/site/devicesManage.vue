<!--  -->
<template>
    <view class='block'>
        <view class="bigTitle">
            <view class="jz">
                <text>{{$t('设备管理')}}</text>
            </view>
        </view>
        <view class="content">
            <view class="content-item">
                <view style="width: 90%;  height: 150px;">
                    <qiun-data-charts  type="gauge" :canvas2d='true' canvasId='deviceCanvas2'
                        :opts="optsd" :chartData="chartData" />
                </view>
                <view class="charts-textbox">
                    <view class="charts-title">{{$t('设备完好率')}}</view>
                    <view class="charts-num">{{ deviceIntactRate }}</view>
                </view>
            </view>
            <view class="content-item content-grid">
                <view>
                    <view class="text-grey">{{$t('当前设备数')}}</view>
                    <view class="text-bold">{{ totalDeviceNum }}</view>
                    <view class="text-lightgrey">{{$t('在线设备 {0}', [ inOperationDeviceNum ])}}</view>
                </view>
                <view>
                    <view class="text-grey">{{$t('报废设备数')}}</view>
                    <view class="text-bold">{{discardDeviceNum}}</view>
                    <view class="text-lightgrey">{{$t('即将报废 {0}', [soonDiscardDeviceNum])}}</view>
                </view>
                <view>
                    <view class="text-grey">{{$t('本月大检数')}}</view>
                    <view class="text-bold">{{checkMonthDeviceNum}}</view>
                    <view class="text-lightgrey">{{$t('本年大检 {0}', [checkYearDeviceNum])}}</view>
                </view>
                <view>
                    <view class="text-grey">{{$t('当前预警数')}}</view>
                    <view class="text-bold">{{earlyWarning}}</view>
                    <view class="text-lightgrey">{{$t('本月已处理 {0}', [handleNum])}}</view>
                </view>
            </view>
        </view>
        <view class="subtitle">
            <text>{{$t('设备组成')}}</text>
        </view>
        <view style="height: 350px;">
            <qiun-data-charts type="ring" v-if="devicesRing.length>0" :canvas2d='true' canvasId='sbzcbcanvans' :opts="zcopts" :onmovetip='true' :ontouch='true'
                :chartData="zcchartData" />
            <view v-else class="no-data-ring">
                <view class="heart"></view>
            </view>
        </view>
    </view>
</template>

<script>
import i18n from '../../../../lang/index'

import {
    getDeviceManage,////设备管理
    getDeviceComposition,//设备组成
} from '@/service/datawarehouse'
export default {
    components: {},
    data() {
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
        return {
        companyId: userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID,
        //设备管理
        inOperationDeviceNum: 39,//运行中设备
        deviceIntactRate: "92.86%",//设备完好率
        discardDeviceNum: 0,//报废数
        checkYearDeviceNum: 0,//本年大检数
        earlyWarning: 0,//当前预警数
        checkMonthDeviceNum: 0,//本月大检数
        totalDeviceNum: 42,//当前设备数
        soonDiscardDeviceNum: 0, //即将报废数
        handleNum: 0 ,     //预警本月已处理数
        deviceFinRate:'',
        havcSystem:0,
        powerSystem:0,
        fireSystem:0,
        elevatorSystem:0,
        parkingSystem:0,
        devicesRing:[],
        searchForm:{
                 areaId:'',
                 projectId:'',
                 date:''
               },
            chartData: {},
            //您可以通过修改 config-ucharts.js 文件中下标为 ['gauge'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
            optsd: {
                color: ["#2761FF"],
                padding: undefined,
                enableMarkLine: false,
                height: '1px',
                width: '10px',
                title: {
                    name: "",
                    fontSize: 11,
                    color: "#A0A0A0",
                    offsetY: 70,
                    offsetX: 0,
                },
                subtitle: {
                    name: "",
                    fontSize: 17,
                    color: "#333333",
                    offsetY: 70
                },
                extra: {
                    gauge: {
                        type: "simple", //仪表盘样式可以自己去u-charts.js中画
                        // #ifdef MP
                        width: 30,//环形宽度
                        // #endif
                        // #ifndef  MP
                        width: 13,
                        // #endif
                        labelColor: "#D5D5D5",
                        labelOffset: 15,//label标注与环形的距离
                        startAngle: 0.85,
                        endAngle: 0.15,
                        startNumber: 0,
                        endNumber: 100,
                        format: "",
                        splitLine: {
                            fixRadius: 0,
                            splitNumber: 5,//分割段数
                            width: 30,
                            color: "transparent",//去掉分割线
                            childNumber: 5,
                            childWidth: 12
                        },
                        pointer: {
                            width: 24,
                            color: "auto"
                        }
                    }
                }
            },
            zcchartData: {},
            //您可以通过修改 config-ucharts.js 文件中下标为 ['ring'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
            zcopts: {
                rotate: false,
                rotateLock: false,
                color: ["#2761FF", "#3F9EFF", "#39CAE0", "#FA6400", "#FAAD13", "#8196CB", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [20, 15, 15, 15],
                dataLabel: true,
                enableScroll: false,
                legend: {
                    show: true,
                    position: "bottom",
                    lineHeight: 25,
                    fontSize: 10
                },
                title: {
                    name: i18n.t('设备数量'),
                    fontSize: 11,
                    color: "#A0A0A0"
                },
                subtitle: {
                    name: 1991,
                    fontSize: 17,
                    color: "#333333"
                },
                extra: {
                    ring: {
                        ringWidth: 15,
                        activeOpacity: 0,
                        activeRadius: 10,
                        offsetAngle: 0,
                        labelWidth: 15,
                        border: false,
                        borderWidth: 3,
                        borderColor: "#FFFFFF"
                    }
                }
            },
        };
    },
    computed: {},
    watch: {},
    methods: {
        zcgetServerData() {
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                let res = {
                    series: [
                        {
                            data: [
                                { "name": i18n.t('暖通系统'), "value": 25, legendShape: 'square' },
                                { "name": i18n.t('供配电系统'), "value": 29.18, legendShape: 'square' },
                                { "name": i18n.t('消防系统'), "value": 11.37, legendShape: 'square' },
                                { "name": i18n.t('电梯系统'), "value": 24.78, legendShape: 'square' },
                                { "name": i18n.t('车场系统'), "value": 9.67, legendShape: 'square' }
                            ]
                        }
                    ]
                }
                this.zcchartData = JSON.parse(JSON.stringify(res));
            }, 500);
        },
         getDeviceManage(){
             console.log('this.companyId',this.companyId)
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.searchForm.areaId || '',
                    projectId:this.searchForm.projectId || '',
                    startTime:this.searchForm.startTime,
                    endTime:this.searchForm.endTime
                    
                }
            }
            getDeviceManage(params).then(res=>{
                if(res.status == '200' && res.data){
                    this.inOperationDeviceNum = res.data.inOperationDeviceNum//运行中设备
                    this.deviceIntactRate=res.data.deviceIntactRate//设备完好率
                    this.discardDeviceNum= res.data.discardDeviceNum//报废数
                    this.checkYearDeviceNum=res.data.checkYearDeviceNum//本年大检数
                    this.earlyWarning= res.data.earlyWarning  //当前预警数
                    this.checkMonthDeviceNum= res.data.checkMonthDeviceNum //本月大检数
                    this.totalDeviceNum= res.data.totalDeviceNum //当前设备数
                    this.soonDiscardDeviceNum= res.data.soonDiscardDeviceNum //即将报废数
                    this.handleNum= res.data.handleNum     //预警本月已处理数 
                    this.deviceFinRate = res.data.deviceIntactRate.replace('%','')*1/100
                    this.proDataTrip()
                }
            })
        },
        getDeviceComposition(){
             console.log('this.companyId',this.companyId)
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.searchForm.areaId || '',
                    projectId:this.searchForm.projectId || '',
                }
            }
            getDeviceComposition(params).then(res=>{
                if(res.status == '200' && res.data.systemList){
                    this.zcopts.subtitle.name = res.data.totalDeviceNum
                    
                    this.proDataDevice(res.data.systemList)
                    this.devicesRing = res.data.systemList
                  }
                
            })
        },
        proDataTrip(){
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                let res = {
                    categories: [{ "value": 0.2, "color": "rgba(39,97,255,0.5)" }, { "value": 0.8, "color": "rgba(39,97,255,0.5)" }, { "value": 1, "color": "rgba(39,97,255,0.5)" }],
                    series: [
                        {
                            name: i18n.t('完成率'),
                            data: this.deviceFinRate
                        }
                    ]
                };
                this.chartData = JSON.parse(JSON.stringify(res));
            }, 500);
        },
        proDataDevice(systemList){
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                const percent = []
                  let systemLists = systemList
                  systemLists.forEach((i) => {
                      const reasonData = {
                      name: i.systemName,
                      value: i.num,
                      labelText: i.rate+ '%',
                      legendShape: 'square'
                      }
                      percent.push(reasonData)
                  })

                  setTimeout(() => {
                let res = {
                    series: [
                        {
                            data:percent,
                            // data: [
                            //     { "name": '暖通系统', "value": this.havcSystem*1, legendShape: 'square' },
                            //     { "name": "供配电系统", "value": this.powerSystem*1, legendShape: 'square' },
                            //     { "name": "消防系统", "value":this.fireSystem*1, legendShape: 'square' },
                            //     { "name": "电梯系统", "value": this.elevatorSystem*1, legendShape: 'square' },
                            //     { "name": "车场系统", "value": this.parkingSystem*1, legendShape: 'square' }
                            // ],
                           
                        }
                    ],
                   
                }
                this.zcchartData = JSON.parse(JSON.stringify(res));
            }, 500);
        },
        init(params){
            this.searchForm={...this.searchForm, ...params}
            console.log(287,params)
            this.getDeviceManage();
            this.getDeviceComposition();
        }
    },
    created() {

    },
    mounted() {
        // this.getDeviceManage();
        // this.getDeviceComposition();
    },
}
</script>
<style scoped lang="scss">
@import url(../../css/kanban.sass);

.charts-textbox {
    padding-top: 20rpx;
    text-align: center;
    position: absolute;
    text-align: center;
    bottom: 10rpx;
    left: 0;
    right: 0;
    width: 90%;

    .charts-title {
        font-size: 22rpx;
        color: #A0A0A0;
    }

    .charts-num {
        font-size: 34rpx;
        font-family: 'DIN';
        font-weight: bold;
        color: #333333;
    }
}

.content {
    display: flex;

    .content-item {
        // border: 1px solid salmon;
        width: 49%;
        position: relative;
    }

    .content-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 20rpx;
    }

}
.no-data-ring{
    position: relative;
    top: 50rpx;
    width: 400rpx;
    height: 400rpx;
    background-color: #ccc;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 200rpx;
    .heart{
        width: 340rpx;
        height: 340rpx;
        border-radius: 170rpx;
        background-color: #fff;
    }
}
</style>