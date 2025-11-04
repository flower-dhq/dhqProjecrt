<!--  -->
<template>
    <view class='box'>
        <view class="title">
            <view class="jz">
                <text>{{$t('工单分析')}}</text>
            </view>
            <u-icon @click="jumpEvent" name="arrow-right" color="#B6B6B6" size="18"></u-icon>
        </view>
        <view class="o-grid">
            <view class="o-grid-item" v-for="(item,i) in baseList" :key="i">
                <view class="item-box">
                    <view class="ogird-item-text1">{{item.title}}</view>
                    <view class="ogird-item-text2">{{ item.num1 }}</view>
                    <view class="ogird-item-text3"><text>{{ item.indexName ? item.indexName : $t('环比') }}</text>
                        <text :class="{'text4':item.icon=='down1','text3':item.icon=='up'}">{{ item.num2 }} </text>
                        <image v-if="item.icon!='none'" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-${item.icon}.png`)"
                            style="width:16rpx;height:16rpx;">
                        </image>
                    </view>
                </view>
                <u-line v-if="(i+1)%3!=0" length="80%" direction="col" color="#EAEAEA"></u-line>
            </view>
        </view>
        <view class="subtitle">
            <text>{{$t('工单趋势图')}}</text>
        </view>
        <!-- <canvas id="ztd" :style="{ width: '100%', height: '200px' }"></canvas> -->
        <qiun-data-charts :onmovetip="true" :ontouch="true" :canvas2d='true' canvasId='canvans4' type="mix" :opts="opts3"
            :chartData="chartData3" />

    </view>
</template>

<script>
import i18n from '../../../lang/index'

import {
    getTaskSituation,
    getTaskTrendCharts
} from '@/service/datawarehouse'
export default {
    components: {},
    data() { 
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
        return {
            companyId: userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID,
            show: false,
            value: '',
            chartData3: {},
            //您可以通过修改 config-ucharts.js 文件中下标为 ['mix'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts3 。实际应用过程中 opts3 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
            opts3: {
                color: ["#2761FF", "#FA6400"],
                padding: [15, 15, 0, 15],
                enableScroll: false,
                dataLabel: false,
                legend: {},
                xAxis: {
                    fontSize: 10,

                },
                yAxis: {
                    disabled: false,
                    disableGrid: false,
                    splitNumber: 5,
                    gridType: "solid",
                    dashLength: 4,
                    gridColor: '#EAEAEA',
                    // padding: 10,
                    showTitle: false,
                    data: [
                        {
                            position: "right",
                            min: 0,
                            max: 100,
                            unit: '%',
                            axisLine: false,
                            fontSize: 9,

                        },
                        {
                            type: 'value',
                            position: "left",
                            textAlign: "left",
                            axisLine: false,
                            fontSize: 9,
                        }
                    ]
                },
                extra: {
                    mix: {
                        column: {
                            width: 15
                        }
                    },

                }
            },
            baseList:[
                { title:i18n.t('工单总数'),num1:'0',num2:'0.00%', icon:'none' },
                { title:i18n.t('自查工单数'),num1:'0',num2:'0.00%', icon:'none' },
                { title:i18n.t('客户工单数'),num1:'0',num2:'0.00%', icon:'none' },
                { title:i18n.t('工单完成数'),num1:'0',num2:'0.00%', icon:'none' },
                { title:i18n.t('工单超时率'),num1:'0.00%',num2:'0.00%', icon:'none', indexName: i18n.t('较上月') },
                { title:i18n.t('工单满意度'),num1:'0.00%',num2:'0.00%', icon:'none', indexName: i18n.t('较上月') },
            ],
            list1: [],
            list2: [],
            mList: [],
            areaId: '',
            projectId: '',
            startTime:'',
            endTime:''

        };
    },
    computed: {},
    watch: {},
    methods: {
        //去掉百分比符号
        removePercentage(s) {
            return s.slice(0, -1);
        },
        //校验是否为负数
        isNegative(s) {
            return s.charAt(0)=='-'
        },
        jumpEvent() {
            let params = {
                tab1: '2' //客户服务
            }
            this.$emit('jumpEvent', params)
        },
        getTaskTrendChartsData() {
            let params = {
                data: {
                    companyId: this.companyId,
                    areaId: this.areaId,
                    projectId: this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getTaskTrendCharts(params).then(res => {
                if (res.status == '200' && res.data) {
                    this.list1=[]
                    this.list2=[]
                    this.mList=[]
                    res.data.map(item => {
                        this.list1.push(item.value1 * 1)
                        this.list2.push(this.removePercentage(item.value2))
                        this.mList.push(item.key)
                    })
                    this.getServerData()
                }
            })
        },
        
        getTaskSituationData() {
            let params = {
                data: {
                    companyId: this.companyId,
                    areaId: this.areaId,
                    projectId: this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            const gnArrow = (n) => (parseFloat(n) > 0 ? 'up' : parseFloat(n) < 0 ? 'down1' : 'none')
            getTaskSituation(params).then(res => {
                if (res.status == '200' && res.data) {
                    let data = res.data
                    this.baseList[0].num1 = data?.totalCount ?? 0
                    const i0n = this.baseList[0].num2 = data?.totalCountRatio ?? '0.00%'
                    this.baseList[0].icon = gnArrow(i0n)

                    this.baseList[1].num1 = data?.insideCount ?? 0
                    const i1n = this.baseList[1].num2 = data?.insideCountRatio ?? '0.00%'
                    this.baseList[1].icon = gnArrow(i1n)

                    this.baseList[2].num1 = data?.clientCount ?? 0
                    const i2n = this.baseList[2].num2 = data?.clientCountRatio ?? '0.00%'
                    this.baseList[2].icon = gnArrow(i2n)

                    this.baseList[3].num1 = data?.taskFinishCount ?? 0
                    const i3n = this.baseList[3].num2 = data?.taskFinishCountRatio ?? '0.00%'
                    this.baseList[3].icon = gnArrow(i3n)

                    this.baseList[4].num1 = data?.taskTimeoutRate ?? '0.00%'
                    const i4n = this.baseList[4].num2 = data?.taskTimeoutRateComparedLastMonth ?? '0.00%'
                    this.baseList[4].icon = gnArrow(i4n)

                    this.baseList[5].num1 = data?.taskSatisfiedRate ?? '0.00%'
                    const i5n = this.baseList[5].num2 = data?.taskSatisfiedRateChain ?? '0.00%'
                    this.baseList[5].icon = gnArrow(i5n)
                }
            })
        },
        getServerData() {
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                let res = {
                    categories: this.mList,
                    series: [
                        {
                            name: i18n.t('工单数'),
                            index: 1,
                            type: "column",
                            data: this.list1
                        },
                        {
                            name: i18n.t('满意度'),
                            type: "line",
                            color: "#FA6400",
                            addPoint: true,
                            data: this.list2
                        }
                    ]
                };
                this.chartData3 = JSON.parse(JSON.stringify(res));
            }, 500);
        },
        async et() {
            // 这里是初始化的方式，通过id查询找到你的canvas标签
            let myChart = echarts.init(document.getElementById('ztd'));
            // 这里开始就是echarts的配置项了
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {},
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
                        axisTick: { alignWithLabel: true },
                        axisLabel: { interval: 0 }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    },
                    {
                        min: 0,   //最小百分比
                        max: 100, //最大百分比
                        type: 'value',
                        nameGap: 35,
                        nameTextStyle: { color: '#666666' },
                        axisTick: { show: false },
                        axisLabel: {
                            show: true,
                            interval: 0, // 使x轴文字显示全
                            color: '#666666',
                            formatter: '{value}%'  //y轴数值，带百分号
                        },
                    }
                ],
                series: [
                    {
                        name: i18n.t('报修工单数'),
                        type: 'bar',
                        stack: 'Ad',
                        emphasis: {
                            focus: 'series'
                        },
                        data: [120, 132, 101, 134, 90, 230, 210],

                    },

                    {
                        name: i18n.t('投诉工单数'),
                        type: 'bar',
                        stack: 'Ad',
                        emphasis: {
                            focus: 'series'
                        },
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: i18n.t('报修满意度'),
                        type: 'line',
                        smooth: true,
                        seriesLayoutBy: 'row',
                        emphasis: { focus: 'series' },
                        data: [150, 232, 201, 154, 190, 330, 410]
                    }, {
                        name: i18n.t('投诉满意度'),
                        type: 'line',
                        smooth: true,
                        seriesLayoutBy: 'row',
                        emphasis: { focus: 'series' },
                        data: [150, 200, 201, 154, 290, 330, 410]
                    },
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
        init(params) {
            this.areaId = params.areaId
            this.projectId = params.projectId
            this.startTime = params.startTime
            this.endTime = params.endTime
            let that = this;
            // 通过nextTick异步画图
            that.$nextTick(() => {
                this.getTaskSituationData()
                this.getTaskTrendChartsData()
                // this.getServerData();
            });
        }
    },
    created() {

    },
    mounted() {
        // let that = this;
        // // 通过nextTick异步画图
        // that.$nextTick(() => {
        //     this.getTaskSituationData()
        //     this.getTaskTrendChartsData()
        //     // this.getServerData();
        // });
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

.o-grid .o-grid-item:nth-child(-n+3) {
    border-bottom: 1rpx solid #EAEAEA;
    padding: 0 0 20rpx 0;
}

.o-grid .o-grid-item:nth-child(3n) {
    border-right: none;
    justify-content: center;
}

.o-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    // grid-column-gap: 10px;
    grid-row-gap: 20rpx;
    margin-top: 20rpx;
    text-align: center;

    .o-grid-item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .item-box {
            width: 100%;

            view {
                min-height: 50rpx;
                line-height: 50rpx;
            }
        }
    }

    .ogird-item-text1 {
        font-size: 20rpx;
        color: #666666;
    }

    .ogird-item-text2 {
        font-size: 40rpx;
        font-family: 'DIN';
        font-weight: bold;
        color: #333333;
    }

    .ogird-item-text3 {
        font-size: 20rpx;
        color: #9EA7B4;

    }

    .text3 {
        font-size: 20rpx;
        font-family: PingFang SC;
        color: #33BA73;
    }

    .text4 {
        font-size: 20rpx;
        font-family: PingFang SC;
        color: #E71E1E;
    }

}

.subtitle {
    font-size: 24rpx;
    color: #333333;
    margin: 24rpx 0;
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
</style>