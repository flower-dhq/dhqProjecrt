<!--  -->
<template>
    <view class='box'>
        <view class="title">
            <view class="jz">
                <text>{{$t('财务分析')}}</text>
                <view style="margin: 0 18rpx;"><date-picker :date.sync="endDate" mode="year-month-date" @confirm="updateDateEvt"></date-picker></view>
                <switch-tabs @click="(evt) => updateDateEvt({unit: evt.value})"></switch-tabs>
            </view>
            <u-icon @click="jumpEvent" name="arrow-right" color="#B6B6B6" size="18"></u-icon>
        </view>
        <view class="view-gird">
            <view class="view-gird-item view-grid-item-border" v-for="(item, index) in financialAnalysis" :key="index">
                <view class="item-box" :class="[unit == 1 ? 'yuan-style' : '']">
                    <view class="view-cell0">{{item.title}}</view>
                    <view class="view-cell1">{{item.value}}</view>
                    <view class="view-cell2">{{ item.subtitle }} {{ item.subval }}</view>
                </view>
                 <u-line v-if="item.rightBd" length="80%" direction="col" color="#F3F4F7"></u-line>

            </view>
            <template v-if="0">
            <view class="view-gird-item view-grid-item-border">
                <view class="item-box">
                    <view class="view-cell0">{{$t('实收(万)')}}</view>
                    <view class="view-cell1">58.12</view>
                    <view class="view-cell2">{{$t('预收 535.23万')}}</view>
                </view>
                <u-line length="80%" direction="col" color="#F3F4F7"></u-line>
            </view>
            <view class="view-gird-item view-grid-item-border">
                <view class="item-box">
                    <view class="view-cell0">{{$t('清欠(万)')}}</view>
                    <view class="view-cell1">58.12</view>
                    <view class="view-cell2">{{$t('清欠率 10.4%')}}</view>
                </view>

            </view>
            <view class="view-gird-item">
                <view class="item-box">
                    <view class="view-cell0">{{$t('本年收缴率')}}</view>
                    <view class="view-cell1">58.12%</view>
                    <view class="view-cell2">{{$t('本年应收 535.23万')}}</view>
                </view>
                <u-line length="80%" direction="col" color="#F3F4F7"></u-line>
            </view>
            <view class="view-gird-item">
                <view class="item-box">
                    <view class="view-cell0">{{$t('本年实收(万)')}}</view>
                    <view class="view-cell1">58.12</view>
                    <view class="view-cell2">{{$t('本年预收 535.23万')}}</view>
                </view>
                <u-line length="80%" direction="col" color="#F3F4F7"></u-line>
            </view>
            <view class="view-gird-item">
                <view class="item-box">
                    <view class="view-cell0">{{$t('本年清欠(万)')}}</view>
                    <view class="view-cell1">58.12</view>
                    <view class="view-cell2">{{$t('总欠费 535.23万')}}</view>
                </view>

            </view>
            </template>
        </view>
        <view class="subtitle">
            <text>{{$t('收缴趋势图')}}</text>
        </view>
        <view class="tel0">
            <qiun-data-charts :onmovetip="true" :ontouch="true" :canvas2d='true' canvasId='canvans7' type="line"
                :opts="opts" :chartData="chartData" tooltipFormat="tooltipFormatTrend" />
        </view>

        <u-calendar class="calendar" @confirm="confirm" :show="show"></u-calendar>
    </view>
</template>

<script>
import i18n from '../../../lang/index'

import { mapState } from 'vuex'
import { 
    getCollectionAnalysis, 
    getCollectionTrend, 
    getAdvanceCollectionAnalysis,
    getClearArrearsAnalysisData,
 } from '@/service/leasingbi_new'
import SwitchTabs from './switch-tabs.vue'; 
import DatePicker from './date-picker.vue'; 
export default {
    components: {SwitchTabs, DatePicker},
    data() {
        return {
            value: '',
            show: false,
            chartData: {
                categories: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
                series: [
                    {
                        name: i18n.t('本期收缴率'),
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: i18n.t('年度收缴率'),
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            },
            //您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。

            opts: {
                color: ["#FA6400", "#2761FF"],
                padding: [15, 10, 0, 15],
                enableScroll: false,
                dataLabel: false,
                legend: {},
                xAxis: {
                    fontSize: 10,
                    labelCount: 6
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
            endDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd'),
            unit: 2,
            financialAnalysis: [
                {
                    title: i18n.t('本期收缴率'),
                    value: '0%',
                    subtitle: i18n.t('本期应收'),
                    subval: '0',
                    rightBd: 1,
                },
                {
                    title: i18n.t('本期目标收缴完成率'),
                    value: '0%',
                    subtitle: i18n.t('本期实收'),
                    subval: '0',
                    rightBd: 1,
                },
                {
                    title: i18n.t('年度预缴总金额'),
                    value: '0%',
                    subtitle: i18n.t('年度预缴率'),
                    subval: '0',
                },
                {
                    title: i18n.t('年度收缴率'),
                    value: '0%',
                    subtitle: i18n.t('年度') + i18n.t('{0}度应收'),
                    subval: '0',
                    rightBd: 1,
                },
                {
                    title: i18n.t('年度目标收缴完成率'),
                    value: '0%',
                    subtitle: i18n.t('年度') + i18n.t('{0}度实收'),
                    subval: '0',
                    rightBd: 1,
                },
                {
                    title: i18n.t('年度清欠金额'),
                    value: '0%',
                    subtitle: i18n.t('年度清欠率'),
                    subval: '0'
                },
            ]

        };
    },
    computed: {
        ...mapState({
		    filterData: state => state.kanbanFilter,
		})
    },
    watch: {
         // 筛选条件数据
         filterData: {
            handler(nv, ov) {
                const n = nv || {}
                const o = ov || {}
                const diffAreaid = n.areaId !== o.areaId
                const diffprojectid = n.projectId !== o.projectId
                if (diffAreaid || diffprojectid) {
                    this.updateDateEvt()
                }
            },
            deep: true,
            immediate: true
        }
    },
    onLoad() {

    },
    onShow() {

    },
    methods: {
        jumpEvent(){
            let params={
                tab1:'1' //财务erp
            }
            this.$emit('jumpEvent',params)
        },

        getServerData() {
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                let res = {
                    categories: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
                    series: [
                        {
                            name: i18n.t('收缴率'),
                            data: [80, 10, 70, 30, 90, 10, 25, 35, 60, 46, 85, 75]
                        },
                        {
                            name: i18n.t('清欠率'),
                            data: [55, 70, 80, 10, 20, 90, 35, 45, 50, 46, 65, 65]
                        }
                    ]
                };
                this.chartData = JSON.parse(JSON.stringify(res));
            }, 500);
        },
        // 财务分析情况请求
        updateDateEvt(params) {
            const {unit} = params || {}
            this.unit = unit || this.unit
           this.getCollectionAnalysis()
           this.getCollectionTrend()
        },
        // 生成通用参数
        getBasicParams() {
            const { O_USER_INFO } = this.$constant;
            const {companyId: cid} = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }) || {};
            const companyId = cid || this.$appConfig.COMPLANY_ID;
            const { areaId, projectId } = this.filterData
            const unit = this.unit
            const endDate = this.endDate || ''
            const params = {
                companyId,
                areaIds: areaId,
                projectIds: projectId,
                endDate,
                amountType: unit
            }
            return params
        },
        // 收缴情况
        getCollectionAnalysis() {

            const callback = (res, periodType) => {
                const {collectionRate, targetCollectionRate, receivableAmount, receivedAmount, targetCompletionRate} = res.data || {}

                if (periodType == 1) {
                    const d0 = { title: i18n.t('本期收缴率'), value: collectionRate, subval: receivableAmount, subtitle: i18n.t('本期应收'), rightBd: 1}
                    const d1 = { title: i18n.t('本期目标收缴完成率'), value: targetCompletionRate, subval: receivedAmount, subtitle:i18n.t('本期实收'), rightBd: 1}
                    this.financialAnalysis[0] = d0
                    // this.$set('financialAnalysis', 0, d0)
                    this.financialAnalysis[1] = d1
                   
                }
                if (periodType == 2) {
                    const d3 = { title: i18n.t('年度收缴率'), value: collectionRate, subval: receivableAmount, subtitle: i18n.t('年度') + i18n.t('{0}度应收')}
                    const d4 = { title: i18n.t('年度目标收缴完成率'), value: targetCompletionRate, subval: receivedAmount, subtitle: i18n.t('年度') + i18n.t('{0}度实收')}
                    this.financialAnalysis[3] = d3
                    this.financialAnalysis[4] = d4
                }
                this.$forceUpdate()
            }

            // 收缴 range 1:本期 2:年度
            const params = this.getBasicParams()
            const currentPeriod = getCollectionAnalysis({data: {...params, range: 1}, hideLoading: true})
            currentPeriod.then(res => {
                if (res.status == 200) callback(res, 1)
            })

            const annual = getCollectionAnalysis({data: {...params, range: 2}, hideLoading: true})
            annual.then(res => {
                if (res.status == 200) callback(res, 2)
            })

            // 年度预缴
            const aPms = getAdvanceCollectionAnalysis({data: params, hideLoading: true})
            aPms.then(res => {
                if (res.status == 200) {
                    const {advancePaymentTotalAmount, advancePaymentRate} = res.data || {}
                    const d = { title: i18n.t('年度预缴总金额'), value: advancePaymentTotalAmount, subval: advancePaymentRate, subtitle:i18n.t('年度预缴率')}
                    this.financialAnalysis[2] = d
                    this.$forceUpdate()
                }
            })

            //  年度清欠
            const clearArrear = getClearArrearsAnalysisData({data: params, hideLoading: true})
            clearArrear.then(res => {
                if (res.status == 200) {
                    const {totalArrearsAmount, totalReceivedAmount, clearRate, clearTargetRate, clearTargetCompleteRate} = res.data || {}
                    const d = { title: i18n.t('年度清欠金额'), value: totalReceivedAmount, subval: clearRate, subtitle:i18n.t('年度清欠率')}
                    this.financialAnalysis[5] = d
                    this.$forceUpdate()
                }
            })
        },
        // 收缴趋势
        getCollectionTrend() {
            const params = this.getBasicParams()

            const callback = (res, periodType) => {
                const {data} = res || {}
                const list = Array.isArray(data) ? data : []
                const tempMonth = []
                const tempRate = []
                list.forEach(item => {
                    const {chargePeriod, collectionRate} = item
                    tempMonth.push(chargePeriod)
                    tempRate.push(parseFloat(collectionRate))
                })
                this.chartData.categories = tempMonth
                this.chartData.series[periodType == 1 ? 0 : 1].data = tempRate
            }


            const currentPeriod = getCollectionTrend({data: {...params, range: 1}, hideLoading: true})
            currentPeriod.then(res => {
                if (res.status == 200) callback(res, 1)
            })

            const annual = getCollectionTrend({data: {...params, range: 2}, hideLoading: true})
            annual.then(res => {
                if (res.status == 200) if (res.status == 200) callback(res, 2)
            })

        },

        confirm(val) {
            console.log(this.date, 'date')

        }

    },

    created() {

    },
    mounted() {
        let that = this;
        // that.getServerData();
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

.view-gird .view-gird-item:nth-child(-n+3) {
    border-bottom: 1rpx solid #F3F4F7;
     padding: 0 0 20rpx 0;

}

.view-gird .view-gird-item:nth-child(3n) {
    border-right: none;
    justify-content:center;
 }


.view-gird {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-row-gap: 20rpx;
    margin-top: 20rpx;
    text-align: center;

    .view-gird-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .item-box{
            width: 100%;
             view{
                min-height: 50rpx;
                line-height: 50rpx;
             }
        } 
    }


    .view-cell0 {
        font-size: 20rpx;
        color: #666666;
    }

    .view-cell1 {
        font-size: 40rpx;
        font-family: 'DIN';
        font-weight: bold;
        color: #333333;
    }

    .view-cell2 {
        font-size: 20rpx;
        color: #999999;
    }
}

.subtitle {
    font-size: 24rpx;
    color: #333333;
    margin-top: 24rpx;
}

.tel0 {
    position: relative;
}

.tel1 {
    position: absolute;
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
    // margin: 0 20rpx;

}

.calendar ::v-deep .u-popup__content {
    margin-bottom: 100rpx;
}
.yuan-style {
    .view-cell1 {
        font-size: 36rpx !important;
    }
    .view-cell2 {
        transform: scale(.9);
    }
}
</style>