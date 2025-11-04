<!--  -->
<template>
    <view class='block'>
        <view class="bigTitle">
            <view class="jz">
                <text>{{$t('客户出行')}}</text>
            </view>
        </view>
        <view class="content">
            <view class="content-item">
                <view class="text-grey view-marginBottom">{{$t('人员出入')}}</view>
                <view class="text-black view-marginBottom">{{personnelAccess}}</view>
                <view class="text-lightgrey">{{$t('人员进入 {0}', [personnelEnter])}}</view>
            </view>
            <view class="content-item">
                <view class="text-grey view-marginBottom">{{$t('重点人员出入')}}</view>
                <view class="text-black view-marginBottom">{{focusPersonnelAccess}}</view>
                <view class="text-lightgrey">{{$t('重点人员进入 {0}', [focusPersonnelEnter])}}</view>
            </view>
            <view class="content-item">
                <view class="text-grey view-marginBottom">{{$t('车辆出入')}}</view>
                <view class="text-black view-marginBottom">{{carsAccess}}</view>
                <view class="text-lightgrey">{{$t('车辆进入 {0}', [carsEnter])}}</view>
            </view>
        </view>
        <view class="subtitle">
            <text>{{$t('重点人员出行')}}</text>
        </view>
        <view>
            <qiun-data-charts :canvas2d='true' canvasId='zdcxcanvans' type="column" :opts="opts" :chartData="chartData" />
        </view>
        <view class="subtitle">
            <view class="subtitle-item">
                <text>{{$t('出行趋势图')}}</text>
            </view>
            <view class="subtitle-item">
                <view :class="selectArea ? 'subItem-item-active' : 'subItem-item'" @click="selectAreaData('1')">{{$t('人员出行')}}</view>
                <view :class="!selectArea ? 'subItem-item-active' : 'subItem-item'" @click="selectAreaData('2')">{{$t('车辆出行')}}</view>
            </view>
        </view>
        <view>
            <qiun-data-charts :onmovetip="true" :ontouch="true" :canvas2d='true' canvasId='cxCanvans' type="line"
                :opts="lineOpts" :chartData="lineChartData" />
        </view>
    </view>
</template>

<script>
import i18n from '../../../../lang/index'

import {
    getPedestrianTraffic,
    getPriorityPersonTraffic,
    getPedestrianTrendCharts,
    getCarTrendCharts,
} from '@/service/datawarehouse'
export default {
    components: {},
    props: {
        category: {
            type: String,
            default: 'advance'  //certification 认证  advance 预收
        },
        canvasIds: {
            type: String,
        }
    },
    data() {
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
        return {
            companyId:userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID,
            selectArea: true,
            chartData: {},
            //您可以通过修改 config-ucharts.js 文件中下标为 ['column'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
            opts: {
                color: ["#2761FF", "#39CAE0", "#8196CB", "#FAAD13", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [15, 15, 0, 5],
                enableScroll: false,
                dataLabel: false,
                legend: {
                    show: true,
                    fontSize: 10,
                },
                xAxis: {
                    disableGrid: true,
                    disabled: false,
                    fontSize: 10,
                },
                yAxis: {
                    data: [
                        {
                            type: 'value',
                            position: "left",
                            textAlign: "left",
                            axisLine: false,
                            fontSize: 9,
                        }
                    ],
                    disabled: false,
                    disableGrid: false,
                    splitNumber: 5,
                    gridType: "solid",
                    dashLength: 4,
                    gridColor: '#EAEAEA',
                    showTitle: false,
                },
                extra: {
                    column: {
                        type: "stack",
                        width: 12,
                        activeBgColor: "#000000",
                        activeBgOpacity: 0.08,
                        labelPosition: "center"
                    }
                }
            },
            lineChartData: {},
            //您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。

            lineOpts: {
                color: ["#FA6400", "#FAAD13"],
                padding: [15, 10, 0, 0],
                enableScroll: false,
                dataLabel: false,
                legend: {},
                xAxis: {
                    fontSize: 10,
                    marginTop:10,
                    rotateLabel:true,
                    rotateAngle: -70,   //调整数值改变倾斜的幅度（范围-90到90）
                    // axisLabel: {
                    //   interval:'auto', //坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
                    //    rotate:45   //调整数值改变倾斜的幅度（范围-90到90）
                    // }
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
            carsEnter:0,
            focusPersonnelAccess:0,
            carsAccess:0,
            focusPersonnelEnter:0,
            personnelEnter:0,
            personnelAccess:0,
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
        selectAreaData(type){
            if(type == '1'){
                this.selectArea = true
                this.getPedestrianTrendChartsData()
            }else{
                this.getCarTrendChartsData()
                this.selectArea = false
            }
        },
        getPedestrianTrafficData(){
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getPedestrianTraffic(params).then(res=>{
                if(res.status == '200'){
                    this.carsEnter = res.data.carsEnter
                    this.focusPersonnelAccess = res.data.focusPersonnelAccess
                    this.carsAccess = res.data.carsAccess
                    this.focusPersonnelEnter = res.data.focusPersonnelEnter
                    this.personnelEnter = res.data.personnelEnter
                    this.personnelAccess = res.data.personnelAccess
                }
            })
        },
        getPriorityPersonTrafficData(){
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getPriorityPersonTraffic(params).then(res=>{
                if(res.status == '200'){
                    let data = this.proData(res.data)
                    this.chartData = JSON.parse(JSON.stringify(data));
                }
            })
        },
        //人员出行趋势
        getPedestrianTrendChartsData(){
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getPedestrianTrendCharts(params).then(res=>{
                if(res.status == '200'){
                    let data = this.proDataTrip(res.data)
                    this.lineChartData = JSON.parse(JSON.stringify(data));
                }
            })
        },
        //车辆出行趋势图
        getCarTrendChartsData(){
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getCarTrendCharts(params).then(res=>{
                if(res.status == '200'){
                    let data = this.proDataTrip(res.data)
                    this.lineChartData = JSON.parse(JSON.stringify(data));
                }
            })
        },
        getServerData(list) {
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                let res = {
                    categories: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
                    series: [
                        {
                            name: i18n.t('高频陌生人'),
                            textColor: "#FFFFFF",
                            data: [23, 34, 31, 33, 13, 34, 25, 35, 60, 1, 3, 35]
                        },
                        {
                            name: i18n.t('前科人员'),
                            textColor: "#FFFFFF",
                            data: [18, 27, 21, 24, 6, 28, 25, 35, 60, 2, 9, 25]
                        },
                        {
                            name: i18n.t('涉毒人员'),
                            textColor: "#FFFFFF",
                            data: [18, 27, 21, 24, 6, 28, 25, 35, 2, 3, 7, 23]
                        },
                        {
                            name: i18n.t('自定义关注'),
                            textColor: "#FFFFFF",
                            data: [18, 10, 21, 24, 6, 28, 25, 35, 4, 5, 9, 12]
                        }
                    ]
                };
                this.chartData = JSON.parse(JSON.stringify(res));
            }, 500);
        },
        //处理echart数据
        proData(list){
            let list1 = []
            let list2 = []
            let list3 = []
            let list4 = []
            let list5 = []
            list.map(item=>{
                list1.push(item.key)
                list2.push(item.value1*1)
                list3.push(item.value2*1)
                list4.push(item.value3*1)
                list5.push(item.value4*1)
            })
            let res = {
                categories: list1,
                series: [
                    {
                        name: i18n.t('高频陌生人'),
                        textColor: "#FFFFFF",
                        data: list2
                    },
                    {
                        name: i18n.t('前科人员'),
                        textColor: "#FFFFFF",
                        data: list3
                    },
                    {
                        name: i18n.t('涉毒人员'),
                        textColor: "#FFFFFF",
                        data: list4
                    },
                    {
                        name: i18n.t('自定义关注'),
                        textColor: "#FFFFFF",
                        data: list5
                    }
                ]
            };
            return res
        },
        proDataTrip(list){
            let list1 = []
            let list2 = []
            let list3 = []
            list.map(item=>{
                list1.push(this.formatX(item.key))
                list2.push(item.value1*1)
                list3.push(item.value2*1)
            })
            let res = {
                categories: list1,
                series: [
                    {
                        name: i18n.t('进'),
                        data: list2
                    },
                    {
                        name: i18n.t('出'),
                        data: list3
                    },
                ]
            };
            return res
        },
        //格式化横坐标
        formatX(str){
            let list = str.split(' ')
            const getTime = function(item){
                let index = item.lastIndexOf(":");
                return item.substring(0,index)
            }
            let myStr = getTime(list[1]) + '-' + getTime(list[4])
            return myStr
        },
        getServerData2() {
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                let res = {
                    categories: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
                    series: [
                        {
                            name: i18n.t('进'),
                            data: [20, 30, 40, 50, 90, 40, 25, 35, 60, 46, 85, 75]
                        },
                        {
                            name: i18n.t('出'),
                            data: [55, 70, 80, 10, 20, 90, 35, 45, 50, 46, 65, 65]
                        }
                    ]
                };
                this.lineChartData = JSON.parse(JSON.stringify(res));
            }, 500);
        },
        init(params){
            this.areaId = params.areaId
            this.projectId = params.projectId
            this.startTime = params.startTime
            this.endTime = params.endTime
            // this.getServerData();
            // this.getServerData2();
            this.$nextTick(()=>{
                this.getPedestrianTrafficData()
                this.getPriorityPersonTrafficData()
                this.getPedestrianTrendChartsData()
                // this.getCarTrendChartsData()
            })
        }
    },
    created() {

    },
    mounted() {
        // this.getServerData();
        // this.getServerData2();
        // this.$nextTick(()=>{
        //     this.getPedestrianTrafficData()
        //     this.getPriorityPersonTrafficData()
        //     this.getPedestrianTrendChartsData()
        // })
        
    },
}
</script>
<style scoped lang="scss">
@import url(../../css/kanban.sass);

.content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20rpx;

    .content-item {
        flex: 1;
        text-align: center;
        background: #F8F8F8;
        padding: 20rpx 0;

        .text-grey {
            font-size: 20rpx;
            color: #666666;
        }

        .text-lightgrey {
            font-size: 20rpx;
            color: #A0A0A0;
        }

        .text-black {
            font-size: 40rpx;
            font-family: 'DIN';
            font-weight: bold;
            color: #333333;
        }
    }
}

.subItem-item {
    border: 1rpx solid #CCCCCC;
    font-size: 22rpx;
    color: #666666;
    padding: 6rpx 22rpx;
}

.subItem-item-active {
    border: 1rpx solid #2761FF;
    background: #2761FF;
    font-size: 22rpx;
    color: #FFFFFF;
    padding: 6rpx 22rpx;
}
</style>