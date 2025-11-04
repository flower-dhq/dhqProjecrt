<!--  -->
<template>
    <view class='block'>
        <view class="bigTitle">
            <view class="jz">
                <text>{{$t('隐患预警')}}</text>
            </view>
        </view>
        <view class="content">
            <view class="content-item">
                <view class="item-margin">
                    <view class="text-blue item-margin">{{$t('现场隐患')}}</view>
                    <view class="text-black view-marginBottom">{{$t('当前隐患总数')}}</view>
                    <view class="text-bold view-marginBottom">101</view>
                    <view class="text-grey view-marginBottom">{{$t('一级隐患 24')}}</view>
                </view>
                <view>
                    <view class="text-black view-marginBottom">{{$t('已超期隐患')}}</view>
                    <view class="text-bold-red view-marginBottom">34</view>
                    <view class="text-grey">{{$t('本月隐患 132')}}</view>
                </view>


            </view>
            <view class="content-item">
                <view class="item-margin">
                    <view class="text-red item-margin">{{$t('设备预警')}}</view>
                    <view class="text-black view-marginBottom">{{$t('当前设备预警')}}</view>
                    <view class="text-bold view-marginBottom">451</view>
                    <view class="text-grey view-marginBottom">{{$t('一级预警 234')}}</view>
                </view>
                <view>
                    <view class="text-black view-marginBottom">{{$t('已超期预警')}}</view>
                    <view class="text-bold-red view-marginBottom">145</view>
                    <view class="text-grey">{{$t('本月预警 2356')}}</view>
                </view>
            </view>
        </view>
        <view class="contentCharts">
            <view class="contentCharts-item item-gap">
                <view class="subtitle">
                    <text>{{$t('隐患态势图')}}</text>
                </view>
                <view style="width: 100%;">
                    <qiun-data-charts :canvas2d='true' type="word" canvasId="warncanvan" :opts="opts"
                        :chartData="chartData" />
                </view>
            </view>
            <view class="contentCharts-item">
                <view class="subtitle">
                    <text>{{$t('隐患趋势图')}}</text>
                </view>
                <view style="width: 100%;height: 100%;min-height: 300px;">
                    <!-- #ifndef H5   -->
                    <view><l-echart ref="chart" @finished="init2"></l-echart></view>
                    <!-- #endif  -->
                    <!-- #ifdef H5  -->
                    <view style="width:100%;min-height: 300px;" class="echarts" id="main"></view>
                    <!-- #endif -->
                </view>
            </view>
        </view>
        <view class="subtitle">
            <view class="subtitle-item">
                <text>{{$t('隐患预警情况')}}</text>
                <u-icon @click="toDetail" name="arrow-right" size="10" color="#B2B2B2"></u-icon>
            </view>
            <view class="subtitle-item">
                <view :class="selectArea ? 'subItem-item-active' : 'subItem-item'" @click="selectArea = true">{{$t('区域')}}</view>
                <view :class="!selectArea ? 'subItem-item-active' : 'subItem-item'" @click="selectArea = false">{{$t('项目')}}</view>
            </view>
        </view>
        <view>
            <zb-table :cell-style="cellStyle" :cell-header-style="headercellStyle" :show-header="true" :columns="column"
                :stripe="true" :fit="true" @rowClick="rowClick" @toggleRowSelection="toggleRowSelection"
                @toggleAllSelection="toggleAllSelection" :border="false" @edit="buttonEdit" @dele="dele"
                :data="data"></zb-table>
        </view>
    </view>
</template>

<script>
import i18n from '../../../../lang/index'
 
 import * as echarts from '../../js/echarts.min.js';

export default {
    components: {},
    data() {
        return {
            option: {},
            selectArea: true,
            chartData: {},
            //您可以通过修改 config-ucharts.js 文件中下标为 ['word'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
            opts: {
                color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: undefined,
                enableScroll: false,
                extra: {
                    word: {
                        type: "normal",
                        autoColors: false
                    }
                }
            },
            columnchartData: {},
            //您可以通过修改 config-ucharts.js 文件中下标为 ['column'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
            columnopts: {
                color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [15, 15, 0, 5],
                enableScroll: false,
                legend: {
                    show: false,
                },
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    splitNumber: 4,
                    data: [
                        {
                            max: 10,
                            min: -10
                        }
                    ]
                },
                extra: {
                    column: {
                        type: "stack",
                        width: 30,
                        activeBgColor: "#000000",
                        activeBgOpacity: 0.08,
                        labelPosition: "center"
                    }
                }
            },
            column: [
                { type: 'index', label: i18n.t('序号'), align: 'center' },
                { name: 'name', label: i18n.t('区域'), align: 'center', emptyString: '-' },
                { name: 'num1', label: i18n.t('隐患数'), align: 'center', sorter: true },
                { name: 'num2', label: i18n.t('超期隐患'), align: 'center', sorter: true },
                { name: 'num3', label: i18n.t('预警数'), align: 'center', sorter: true },
                { name: 'num4', label: i18n.t('超期预警'), align: 'center', sorter: true },

            ],
            data: [
                { name: i18n.t('广州区域'), num1: 10, num2: 4, num3: 45, num4: 12 },
                { name: i18n.t('广州区域'), num1: 12, num2: 9, num3: 80, num4: 54 },
                { name: i18n.t('广州区域'), num1: 23, num2: 1, num3: 43, num4: 76 },
                { name: i18n.t('广州区域'), num1: 34, num2: 5, num3: 2, num4: 20 },
                { name: i18n.t('广州区域'), num1: 23, num2: 3, num3: 56, num4: 22 },
            ],
            chart: null,
        };
    },
    computed: {},
    watch: {
        selectArea: {
            handler(val) {
                 this.initTable();
            }
        }
    },
    methods: { 
        toDetail(){
            uni.navigateTo({
                url: i18n.t('/pages-kanban/kanban/tableDetail?type=yhyjqk&title=隐患预警情况')
            })
        },
        initTable() {
            this.column[1].label = this.selectArea ? i18n.t('区域') : i18n.t('项目');
            let data = [];
            for (var i = 0; i < 4; i++) {
                data.push({
                    name: this.selectArea ? '广州区域' : i18n.t('广州项目'),
                    num1: uni.$u.random(0, 100),
                    num2: uni.$u.random(0, 100),
                    num3: uni.$u.random(0, 100),
                    num4: uni.$u.random(0, 100),
                })
            }

            this.data = data;

        },
        initEcharts() {

            this.option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        let tar;
                        if (params[1] && params[1].value !== '-') {
                            tar = params[1];
                        } else {
                            tar = params[2];
                        }
                        return tar && tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                    }
                },
                grid: {
                    containLabel: true,
                    top: 40,
                    left: 0,
                    right: 15,
                    bottom: 15
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: [i18n.t('电梯异响'), '', '', i18n.t('电梯响动'), '', '', i18n.t('烟感报警')],
                        axisLine: {
                            lineStyle: {
                                color: '#F3F4F7'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            color: '#666666',
                            fontSize: 10,
                            interval: 2,//代表显示所有x轴标签显示

                        },
                        splitNumber: 20,
                        boundaryGap: [0, 0]
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisTick: { show: false },
                        axisLabel: {
                            color: '#666666',
                            fontSize: 9
                        },
                        splitLine: {
                            show: true,
                            interval: 3,
                            lineStyle: {
                                color: ['#F3F4F7'],
                                hieght: '10'

                            },
                        },
                        axisTick: {
                            length: 20
                        }
                    }
                ],
                series: [
                    {
                        name: 'Placeholder',
                        type: 'bar',
                        stack: 'Total',
                        silent: true,
                        barWidth: 10,
                        barGap: 0,
                        itemStyle: {
                            borderColor: 'transparent',
                            color: 'transparent'
                        },
                        emphasis: {
                            itemStyle: {
                                borderColor: 'transparent',
                                color: 'transparent'
                            }
                        },
                        data: [2, 1, 0, 2, 0, 1, 2],

                    },
                    {
                        name: 'Income',
                        type: 'bar',
                        stack: 'Total',
                        barWidth: 10,
                        barGap: 0,
                        label: {
                            show: false,
                            position: 'top'
                        },
                        data: [4, {
                            value: 6,
                            itemStyle: {
                                color: '#FF6A6A'
                            }
                        }, 3, '-', '-', '-', '-'],
                        itemStyle: {
                            color: '#33BA73'
                        }

                    },
                    {
                        name: 'Expenses',
                        type: 'bar',
                        stack: 'Total',
                        barWidth: 10,
                        label: {
                            show: false,
                            position: 'top'
                        },
                        data: ['-', '-', '-', 7, {
                            value: 6,
                            itemStyle: {
                                color: '#33BA73'
                            }
                        }, {
                                value: 7,
                                itemStyle: {
                                    color: '#33BA73'
                                }
                            }, 4],
                        itemStyle: {
                            color: '#FF6A6A'
                        }

                    }
                ]
            }
            // #ifdef H5  
            this.init();
            // #endif
            // #ifndef H5
            console.log('除了 H5 平台，其它平台均存在的代码')
            this.$refs.chart.init(echarts, chart => {
                chart.setOption(this.option);
            });
            // #endif 
        },
        async init2() {
            // chart 图表实例不能存在data里
            const chart = await this.$refs.chart.init(echarts);
            chart.setOption(this.option)
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
                    series: [
                        { name: i18n.t('跨全端图表'), textSize: 25, data: undefined },
                        { name: i18n.t('微信小程序'), textSize: 20, data: undefined },
                        { name: i18n.t('支付宝小程序'), textSize: 20, data: undefined },
                        { name: i18n.t('百度小程序'), textSize: 20, data: undefined },
                        { name: i18n.t('QQ小程序'), textSize: 20, data: undefined },
                        { name: i18n.t('头条小程序'), textSize: 20, data: undefined },
                        { name: i18n.t('抖音小程序'), textSize: 20, data: undefined },
                        { name: i18n.t('360小程序'), textSize: 20, data: undefined },
                        { name: i18n.t('跨全端'), textSize: 10, data: undefined }

                    ]
                };
                this.chartData = JSON.parse(JSON.stringify(res));
            }, 500);
        },
        getServerData1() {
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                let res = {
                    categories: [i18n.t('电梯异响'), i18n.t('电梯响动'), i18n.t('烟感报警')],
                    series: [
                        {
                            name: i18n.t('电梯响动'),
                            textColor: "#FFFFFF",
                            data: [5, -2, 5]
                        },
                        {
                            name: i18n.t('电梯异响'),
                            textColor: "#FFFFFF",
                            data: [1, 2, 3]
                        }

                    ]
                };
                this.columnchartData = JSON.parse(JSON.stringify(res));
            }, 500);
        },
        init() {
            var chartDom = document.getElementById('main');
            var myChart = echarts.init(chartDom);
            this.option && myChart.setOption(this.option);
        }
    },
    created() {

    },
    mounted() {
        this.getServerData();
        this.getServerData1();
        this.initEcharts();
        this.initTable();


    },
}
</script>
<style scoped lang="scss">
@import url(../../css/kanban.sass);

.content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 20rpx;

    .content-item {
        background: #F8F8F8;
        padding: 24rpx;

        .text-blue {
            font-size: 24rpx;
            font-weight: bold;
            color: #2761FF;
        }

        .text-red {
            font-size: 24rpx;
            font-weight: bold;
            color: #E71E1E;
        }

        .text-black {
            font-size: 24rpx;
            color: #333333;
        }

        .text-grey {
            font-size: 20rpx;
            color: #999999;
        }

        .text-lightgrey {
            font-size: 20rpx;
            color: #A0A0A0;
        }

        .text-green {
            font-size: 20rpx;
            color: #33BA73;
        }

        .text-bold {
            font-size: 40rpx;
            font-family: 'DIN';
            font-weight: bold;
            color: #333333;
        }

        .text-bold-red {
            font-size: 40rpx;
            font-family: 'DIN';
            font-weight: bold;
            color: #E71E1E;
        }

    }
}

.contentCharts {
    display: flex;

    .contentCharts-item {
        width: 48%;

    }

    .item-gap {
        margin-right: 20rpx;
    }

}
 
</style>