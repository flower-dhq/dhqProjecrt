<!--  -->
<template>
    <view class='block'>
        <view class="bigTitle">
            <view class="jz">
                <text>{{$t('现金流')}}</text>
                <view style="margin: 0 18rpx;"><switch-tabs @click="(evt) => updateDateEvt({unit: evt.value})"></switch-tabs></view>
            </view>
        </view>
        <view class="content">
            <view class="t-box">
                <view class="tbox-item" v-for="(item, index) in cashFlowList" :key="index">
                    <view class="tb-title">{{ item.name }}</view>
                    <view class="item-margin" v-for="(child, i) in item.children" :key="i">
                        <view class="tb-text1 view-marginBottom">{{child.title}}</view>
                        <view class="tb-text2 view-marginBottom">{{ child.money }}</view>
                        <view class="tb-text3 view-marginBottom">
                            <view class="tb-s">{{$t('收')}}</view><text class="tbs-text">{{ child.receive }}</text>
                        </view>
                        <view class="tb-text3 view-marginBottom">
                            <view class="tb-z">{{$t('退')}}</view><text class="tbz-text">{{ child.withdraw }}</text>
                        </view>
                    </view>
                </view>
                
            </view> 
        </view>
        <view class="subtitle">
            <text>{{$t('现金流趋势')}}</text>
        </view>
        <view>
            <qiun-data-charts :onmovetip="true" :ontouch="true" :canvas2d='true' canvasId='cashFlowcanvans' type="line"
                :opts="opts1" :inScrollView="true" :chartData="cashFlowTrend" />

        </view>
        <view class="footText">
                <text>{{$t('现金流数据更新至{0}', [ filterData.financialEndtimeTxt ])}}</text>
            </view>
    </view>
</template>

<script>
import i18n from '../../../lang/index'

import { mapState } from 'vuex'
import {
    getCashFlowSituation,
    getCashFlowTrend
} from '@/service/leasingbi_new'
import SwitchTabs from './switch-tabs.vue'; 
export default {
    components: {SwitchTabs},
    data() {
        return {
            chartData1: {},
            opts1: {
                color: ["#FA6400", "#2761FF"],
                padding: [15, 10, 0, 15],
                enableScroll: false,
                dataLabel: false,
                legend: {},
                xAxis: {
                    fontSize: 10,
                    labelCount: 4
                },
                yAxis: {
                    gridType: 'solid',
                    dashLength: 8,
                    gridColor: '#EAEAEA',
                    splitNumber: 5,
                    data: [{
                        // unit: '%',
                        type: 'value',
                        axisLine: false,
                        position: 'left',
                        fontSize: 9,
                        min: 0,
                        // max: 100,

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
            unit: 2, // 2万元 1元
            cashFlowList: [
                {
                    name: i18n.t('现金流概况'),
                    children: [
                        {
                            title: i18n.t('本月现金流金额'),
                            money: 0,
                            receive: 0,
                            withdraw: 0,
                        },
                        {
                            title: i18n.t('本年现金流金额'),
                            money: 0,
                            receive: 0,
                            withdraw: 0,
                        },
                    ],
                },
                {
                    name: i18n.t('保证金概况'),
                    children: [
                        {
                            title: i18n.t('本月保证金金额'),
                            money: 0,
                            receive: 0,
                            withdraw: 0,
                        },
                    ]
                },
            ],
            cashFlowTrend: {
                categories: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
                series: [
                    {
                        name: i18n.t('收入'),
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    },
                    {
                        name: i18n.t('退款'),
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    },
                ]
            }
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
            handler() {
                this.updateDateEvt()
                
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        getServerData() {
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接

                let res = {
                    categories: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
                    series: [
                        {
                            name: i18n.t('收入'),
                            data: [80, 100, 70, 30, 90, 100, 25, 35, 60, 46, 85, 75],
                        },
                        {
                            name: i18n.t('支出'),
                            data: [20, 30, 80, 60, 100, 90, 70, 45, 50, 46, 65, 65],
                        },
                    ]
                };
                this.chartData1 = JSON.parse(JSON.stringify(res));

            }, 500);
        },
         // 生成通用参数
        getBasicParams() {
            const { O_USER_INFO } = this.$constant;
            const {companyId: cid} = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }) || {};
            const companyId = cid || this.$appConfig.COMPLANY_ID;
            const unit = this.unit
            const {financialEndtimeTxt, areaId, projectId} = this.filterData
            const endDate = financialEndtimeTxt || ''
            const params = {
                companyId,
                areaId,
                projectId,
                endDate,
                amountType: unit
            }
            return params
        },
        // 现金流请求
        updateDateEvt(params) {
            const {unit} = params || {}
            this.unit = unit || this.unit
            this.getCashFlowSituation()
            this.getCashFlowTrend()
        },
        // 现金流情况
        getCashFlowSituation() {
            const params = this.getBasicParams()
            getCashFlowSituation({data: params, hideLoading: true}).then(res => {
                if (res.status == 200) {
                    const {monthAmount, receivedMonthAmount, refundMonthAmount, YearAmount, receivedYearAmount, refundYearAmount, collateralAmount, receivedCollateralAmount, refundCollateralAmount} = res.data || {}
                    const list = [
                        {
                            name: i18n.t('现金流概况'),
                            children: [
                                {
                                    title: i18n.t('本月现金流金额'),
                                    money: '+' + monthAmount,
                                    receive: receivedMonthAmount,
                                    withdraw: refundMonthAmount,
                                },
                                {
                                    title: i18n.t('本年现金流金额'),
                                    money: '+' + YearAmount,
                                    receive: receivedYearAmount,
                                    withdraw: refundYearAmount,
                                },
                            ],
                        },
                        {
                            name: i18n.t('保证金概况'),
                            children: [
                                {
                                    title: i18n.t('本月保证金金额'),
                                    money: collateralAmount,
                                    receive: receivedCollateralAmount,
                                    withdraw: refundCollateralAmount,
                                },
                            ]
                        },
                    ];
                    this.cashFlowList = list
                }
            })
        },
        // 现金流趋势
        getCashFlowTrend() {
            const params = this.getBasicParams()
            getCashFlowTrend({data: params, hideLoading: true}).then(res => {
                if (res.status == 200) {
                    const list = Array.isArray(res.data) ? res.data : []
                    const m = this.getLast12Months()
                    const emptyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    const leneq0 = list.length == 0
                    const receiving = []
                    const refund = []
                    list.forEach(item => {
                        const {month, receivedAmount, refundAmount} = item
                        m.push(month)
                        receiving.push(receivedAmount)
                        refund.push(parseFloat(refundAmount))
                    })

                    this.cashFlowTrend.categories = m
                    this.cashFlowTrend.series[0].data = leneq0 ? emptyData : receiving
                    this.cashFlowTrend.series[1].data = leneq0 ? emptyData : refund
                }
            })
        },
        getLast12Months() {
            const currentDate = new Date();
            let month = currentDate.getMonth() + 1, year = currentDate.getFullYear()
            const months = [];
            for (let i = 0; i < 12; i++) {
                month = i == 0 ? month : month == 1 ? 12 : month - 1
                year = i == 0 ? year :  month == 12 ? year - 1 : year
                months.push(`${year}-${String(month).padStart(2, '0')}`);
            }
            return months.reverse();
        }
    }
}
</script>
<style scoped lang="scss">
@import url(../css/kanban.sass);

.t-box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 15px;
    margin-top: 20rpx;

    .tbox-item {
        background-color: rgba(250, 250, 250, 1);
        padding: 20px;

        .tb-title {
            font-size: 24rpx;
            font-weight: bold;
            color: #2761FF;
            margin-bottom: 10px;
        }

        .tb-text1 {
            font-size: 24rpx;
            color: #333333;
        }

        .tb-text2 {
            font-size: 32rpx;
            font-family: 'DIN';
            font-weight: bold;
            color: #333333;
        }

        .tb-text3 {
            display: flex;
            font-size: 24rpx;
            align-items: center;

            .tb-s {
                width: 14px;
                height: 14px;
                line-height: 14px;
                text-align: center;
                background-color: #33BA73;
                color: white;
                margin-right: 20rpx;
            }

            .tbs-text {
                color: #33BA73;
            }

            .tb-z {
                background-color: #FF0000;
                color: white;
                margin-right: 20rpx;
                width: 14px;
                height: 14px;
                line-height: 14px;
                text-align: center;
            }

            .tbz-text {
                color: #FF0000;
            }
        }
    }
}

.footText {
    font-size: 20rpx;
    color: #999999;
    text-align: center;
    margin-top: 10px;
}
</style>