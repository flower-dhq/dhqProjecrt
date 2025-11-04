<!--  -->
<template>
    <view class='box'>
        <view class="title">
            <view class="jz">
                <text>{{$t('设备管控')}}</text>
                <!-- <view style="margin: 0 18rpx;"><date-picker @confirm=""></date-picker></view> -->
            </view>
            <u-icon @click="jumpEvent" name="arrow-right" color="#B6B6B6" size="18"></u-icon>
        </view>
        <view class="d-box">
            <!-- <view style="width:48%;padding-right: 15px; position: relative;">
                <view style="width: 100%;height: 50%;   padding-top: 8px;">
                    <qiun-data-charts style="display: block;" type="gauge" :canvas2d='true' canvasId='deviceCanvas'
                        :opts="optsd" :chartData="chartData" />
                </view>
                <view class="charts-textbox">
                    <view class="charts-title">设备完好率</view>
                    <view class="charts-num">50.99%</view>
                </view>

            </view> -->
            <view class="content-item">
                <view style="width: 90%;  height: 150px;">
                    <qiun-data-charts type="gauge" :canvas2d='true' canvasId='deviceCanvas' :opts="optsd"
                        :chartData="chartData" />
                </view>
                <view class="charts-textbox">
                    <view class="charts-title">{{$t('设备完好率')}}</view>
                    <view class="charts-num">{{deviceIntactRate}}</view>
                </view>
            </view>
            <view class="d-grid">
                <view class="d-grid-item">
                    <view class="d-grid-item-text1">{{$t('设备数')}}</view>
                    <view class="d-grid-item-text2">{{totalDeviceNum}}</view>
                    <view class="d-grid-item-text3">{{$t('在线设备 {0}', [inOperationDeviceNum])}}</view>
                </view>
                <view class="d-grid-item">
                    <view class="d-grid-item-text1">{{$t('任务总数')}}</view>
                    <view class="d-grid-item-text2">{{patrolInspectionNum}}</view>
                    <view class="d-grid-item-text3">{{$t('完成率 {0}', [finishPatrolInspectionRate])}}</view>
                </view>
                <view class="d-grid-item">
                    <view class="d-grid-item-text1">{{$t('完成任务数')}}</view>
                    <view class="d-grid-item-text2">{{finishPatrolInspectionNum}}</view>
                    <view class="d-grid-item-text3" v-if="projectCode!='KAIHUA'">{{$t('下单率 {0}', [placeOrderRate])}}</view>
                </view>
                <view class="d-grid-item" v-if="projectCode!='KAIHUA'">
                    <view class="d-grid-item-text1">{{$t('下单数')}}</view>
                    <view class="d-grid-item-text2">{{placeOrderNum}}</view>
                    <view class="d-grid-item-text3">{{$t('整改完成率 {0}', [finishTaskRate])}}</view>
                </view>
            </view>
        </view>

    </view>
</template>

<script>
import i18n from '../../../lang/index'

import DatePicker from './date-picker.vue';
import {
    getDeviceControl,
} from '@/service/datawarehouse'
export default {
    components: {DatePicker},
    data() {
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
        const { PROJECT_CODE } = this.$appConfig
        return {
            projectCode:PROJECT_CODE, 
            companyId:userInfo.companyId?userInfo.companyId:this.$appConfig.COMPLANY_ID,
            show: false,
            value: '',
            chartData: {},
            //您可以通过修改 config-ucharts.js 文件中下标为 ['gauge'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
            optsd: {
                color: ["#2761FF"],
                padding: undefined,
                enableMarkLine: false,
                height: '40px',
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
            inOperationDeviceNum:'0',
            placeOrderNum:'0',
            deviceIntactRate:'0',
            patrolInspectionNum:'0',
            placeOrderRate:'0',
            totalDeviceNum:'0',
            finishTaskRate:'0',
            finishPatrolInspectionNum:'0',
            finishPatrolInspectionRate:'0',
            finishNum:0,
            areaId:'',
            projectId:'',
            currentMonth:'',
            startTime:'',
            endTime:''

        };
    },
    computed: {},
    watch: {},
    methods: {
        jumpEvent(){
            let params={
                tab1:'3', //现场管理
                listName:'liveList',//数组名称
                id:'sitSheb' //设备管理
            }
            this.$emit('jumpEvent',params)
        },
        getDeviceControlData(){
            let params = {
                data:{
                companyId: this.companyId,
                areaId:this.areaId,
                projectId:this.projectId,
                startTime: this.startTime,
                endTime: this.endTime
            }
            }
            getDeviceControl(params).then(res=>{
                if(res.status == '200' && res.data){
                    this.inOperationDeviceNum = res.data.inOperationDeviceNum
                    this.placeOrderNum = res.data.placeOrderNum
                    this.deviceIntactRate = res.data.deviceIntactRate
                    this.patrolInspectionNum = res.data.patrolInspectionNum
                    this.placeOrderRate = res.data.placeOrderRate
                    this.totalDeviceNum = res.data.totalDeviceNum
                    this.finishPatrolInspectionNum = res.data.finishPatrolInspectionNum
                    this.finishPatrolInspectionRate = res.data.finishPatrolInspectionRate
                    this.finishTaskRate = res.data.finishTaskRate
                    this.finishNum = res.data.deviceIntactRate.replace('%','')*1/100
                    this.getServerData()
                }
            })
        },
        getServerData() {
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                let res = {
                    categories: [{ "value": 0.2, "color": "rgba(39,97,255,0.5)" }, { "value": 0.8, "color": "rgba(39,97,255,0.5)" }, { "value": 1, "color": "rgba(39,97,255,0.5)" }],
                    series: [
                        {
                            name: i18n.t('完成率'),
                            data: this.finishNum
                        }
                    ]
                };
                this.chartData = JSON.parse(JSON.stringify(res));
            }, 500);
        },
        async et() {
            // 这里是初始化的方式，通过id查询找到你的canvas标签
            let myChart = echarts.init(document.getElementById('test'));
            // 这里开始就是echarts的配置项了
            let option = {
                series: [
                    {
                        type: 'gauge',
                        progress: {
                            show: true,
                            width: 18
                        },
                        axisLine: {
                            lineStyle: {
                                width: 18
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            length: 5,
                            lineStyle: {
                                width: 1,
                                color: '#999'
                            }
                        },
                        axisLabel: {
                            distance: 25,
                            color: '#999',
                            fontSize: 12
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 8,
                            itemStyle: {
                                borderWidth: 10
                            }
                        },
                        title: {
                            show: false
                        },
                        detail: {
                            valueAnimation: true,
                            fontSize: 12,
                            formatter: i18n.t('设备完好率\n{value}'),
                            offsetCenter: [0, '70%']
                        },
                        data: [
                            {
                                value: 80
                            }
                        ]
                    }
                ]
            };
            // 这里不要忘记把option设置给echarts实例
            myChart.setOption(option);


            // 这里是用于窗口变化时的自适应，利用的是echarts自带的resize方法
            // 如果你打印出来这个echarts实例，可以在函数里面找到这个方法
            window.addEventListener('resize', () => {
                myChart.resize()
            });
        },

        confirm(val) {
            this.show = false;
            this.value = val[0];

        },
        init(params){
            let that = this;
            this.areaId = params.areaId
            this.projectId = params.projectId
            this.startTime = params.startTime
            this.endTime = params.endTime
            that.$nextTick(() => {
                // that.et();

                // this.getServerData();
                this.getDeviceControlData()
            })
        }
    },
    created() {
        const { PROJECT_CODE } = this.$appConfig

    },
    mounted() {
        // let that = this;
        // that.$nextTick(() => {
        //     // that.et();

        //     // this.getServerData();
        //     this.getDeviceControlData()
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

.d-box {
    display: flex;

    .content-item {
        // border: 1px solid salmon;
        width: 49%;
        position: relative;
    }

}

.d-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 15px;

    .d-grid-item-text1 {
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #666666;
    }

    .d-grid-item-text2 {
        font-family: 'DIN';
        font-size: 40rpx;
        font-family: DIN;
        font-weight: bold;
        color: #333333;
    }

    .d-grid-item-text3 {
        font-size: 20rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
        opacity: 1;
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

.charts-textbox {
    padding-top: 20rpx;
    text-align: center;

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
</style>