<!--  -->
<template>
    <view class='box'>
        <view class="title">
            <view class="jz">
                <text>{{$t('多经收入')}}</text>
                <view style="margin: 0 18rpx;"><date-picker :date.sync="endDate" mode="year-month-date" @confirm="updateDateEvt"></date-picker></view>
                <switch-tabs @click="(evt) => updateDateEvt({unit: evt.value})"></switch-tabs>
            </view>
            <u-icon name="arrow-right" color="#B6B6B6" size="18"></u-icon>
        </view>
        <view class="m-box">
            <view class="m-box1">
                <view style="width:300rpx;height: 200px;">
                    <qiun-data-charts :canvas2d='true' canvasId='canvans6' type="ring" :opts="opts1" :chartData="chartData1" />

                </view>
             </view>
            <view class="m-box2">
                <view class="m-box-item" v-for="(item, index) in multipleIncome" :key="index">
                    <view class="mbox-text">
                        <view class="mbox-blue" :style="{backgroundColor: item.color}"></view>
                        <text>{{ item.title }} ({{item.percentage}})</text>
                    </view>
                    <view class="mbox-cell">
                        <view :class="['mbox-m', unit == 1 ? 'yuan-style' : '']">{{item.value}}</view>
                        <view class="mbox-b">
                            <text style="margin-right: 4rpx;">{{$t('环比')}}</text>
                            <text :class="['mbox-br', item.descIcon]">{{item.rate}} </text>
                            <image v-if="item.descIcon == 'green'" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)" style="width:16rpx;height:16rpx;"></image>
                            <image v-if="item.descIcon == 'red'" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-down1.png`)" style="width:16rpx;height:16rpx;"></image>
                        </view>
                    </view>
                </view>
                <template v-if="0">
                <view class="m-box-item">
                    <view class="mbox-text">
                        <view class="mbox-orange"></view>{{$t('资源合同收入(元) ({0})', [resourcePactIncomeRate])}}</view>
                    <view class="mbox-cell">
                        <view class="mbox-m">{{resourcePactIncome}}</view>
                        <view class="mbox-b">{{$t('环比')}}<text class="mbox-bg">{{resourcePactIncomeRatio}} </text>
                            <image :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                                style="width:16rpx;height:16rpx;"></image>
                        </view>
                    </view>
                </view>
                <view class="m-box-item">
                    <view class="mbox-text">
                        <view class="mbox-yellow"></view>{{$t('有偿服务工单(元) ({0})', [taskIncomeRate])}}</view>
                    <view class="mbox-cell">
                        <view class="mbox-m">{{taskIncome}}</view>
                        <view class="mbox-b">{{$t('环比')}}<text class="mbox-bg">{{taskIncomeRatio}} </text>
                            <image :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                                style="width:16rpx;height:16rpx;"></image>
                        </view>
                    </view>
                </view>
                </template>
            </view>
        </view>
        <view class="t-box">
            <view class="tbox-item" v-for="(item, index) in cashFlowData.list" :key="index">
                <view class="tb-title">{{item.name}}</view>
                <view class="item-margin" v-for="(child, i) in item.children" :key="i">
                    <view class="tb-text1 view-margin">{{ child.title }}</view>
                    <view class="tb-text2 view-margin" :class="[unit == 1 ? 'yuan-cash' : '']">{{ child.money }}</view>
                    <view class="tb-text3 view-margin">
                        <view class="tb-s">{{$t('收')}}</view><text class="tbs-text">{{ child.receive }}</text>
                    </view>
                    <view class="tb-text3 view-margin">
                        <view class="tb-z">{{$t('退')}}</view><text class="tbz-text">{{ child.withdraw }}</text>
                    </view>
                </view>
               


            </view>
            
        </view>
        <view class="footText">
            <text>{{ cashFlowData.text }}</text>
        </view>

    </view>
</template>

<script>
import i18n from '../../../lang/index'

import { mapState } from 'vuex'
import { 
    getCollectionAnalysis, 
    getCollectionTrend, 
    getPaymentAnalysis, 
    getCollectionRanking, 
    getCashFlowSituation, 
    getCashFlowTrend,
    getAdvanceCollectionAnalysis,
    getAdvanceCollectionRanking,
    getClearArrearsAnalysisData,
    getArrearsAccountAgeData,
    getClearArrearsTrendChart,
    getClearArrearsList,
    getDjStatisticsData,
    getDjRankData,
    getContractStatisticsData,
    getContractTrendData
 } from '@/service/leasingbi_new'
import SwitchTabs from './switch-tabs.vue'; 
import DatePicker from './date-picker.vue'; 
import {
    getBusinessIncome,
} from '@/service/datawarehouse'
export default {
    components: {SwitchTabs, DatePicker},
    data() {
        const today = uni.$u.timeFormat(new Date(), 'yyyy-mm-dd')
        return {
            chartData1: {
                series: [
                    {
                        data: [
                            { "name": i18n.t('本月社区商城收入'), "value": 0, "labelShow": false },
                            { "name": i18n.t('本月资源合同收入'), "value": 0, "labelShow": false },
                            { "name": i18n.t('本月有偿服务收入'), "value": 0, "labelShow": false }
                        ]
                    }
                ]
            },
            //您可以通过修改 config-ucharts.js 文件中下标为 ['ring'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
            opts1: {
                rotate: false,
                rotateLock: false,
                color: ['#2761FF', '#FA6400', '#FFB038'],
                padding: [5, 5, 5, 5],
                dataLabel: false,
                enableScroll: false,
                legend: {
                    show: false,
                    position: "right",
                    lineHeight: 25
                },
                title: {
                    name: i18n.t('总金额'),
                    fontSize: 11,
                    color: "#A0A0A0"
                },
                subtitle: {
                    name: "0",
                    fontSize: 17,
                    color: "#333333"
                },
                extra: {
                    ring: {
                        ringWidth: 15,
                        activeOpacity: 0.5,
                        activeRadius: 10,
                        offsetAngle: 0,
                        labelWidth: 15,
                        border: false,
                        borderWidth: 3,
                        borderColor: "#FFFFFF"
                    }
                }
            },
            businessRatio:'0',
            businessIncome:'0',
            totalIncome:'0',
            resourcePactIncome:'0',
            taskIncome:'0',
            businessIncomeRate:'0',
            resourcePactIncomeRate:'0',
            taskIncomeRate:'0',
            resourcePactIncomeRatio:'0',
            taskIncomeRatio:'0',
            areaId:'',
            projectId:'',
            unit: 2,
            endDate: today,
            // 多经收入
            multipleIncome:[
                { title:i18n.t('本月社区商城收入'), value: 0, percentage:'0.00%', rate: 0, color:'#2761FF', descIcon: ''},
                { title:i18n.t('本月资源合同收入'), value: 0, percentage:'0.00%', rate: 0, color:'#FA6400', descIcon: ''},
                { title:i18n.t('本月有偿服务收入'), value: 0, percentage:'0.00%', rate: 0, color:'#FFB038', descIcon: ''},
            ],
            // 现金流概况
            cashFlowData: {
                list: [
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
                text: i18n.t('现金流数据更新至{0}', [today]),
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
    methods: {
        getBusinessIncomeData(){
            
            let { O_USER_INFO } = this.$constant;
		    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
            let companyId = userInfo.companyId?userInfo.companyId:this.$appConfig.COMPLANY_ID;
            let params = {
                data:{
                    companyId: companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                }
            }
            getBusinessIncome(params).then(res=>{
                if(res.status == '200' && res.data){
                    this.businessRatio = res.data.businessRatio
                    this.businessIncome = res.data.businessIncome
                    this.totalIncome = res.data.totalIncome
                    this.resourcePactIncome = res.data.resourcePactIncome
                    this.taskIncome = res.data.taskIncome
                    this.businessIncomeRate = res.data.businessIncomeRate
                    this.resourcePactIncomeRate = res.data.resourcePactIncomeRate
                    this.taskIncomeRatio = res.data.taskIncomeRatio
                    this.opts1.subtitle.name = res.data.totalIncome+''
                    this.getServerData2()
                }
            })
        },
        getServerData2() {
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                let res = {
                    series: [
                        {
                            data: [
                                { "name": i18n.t('社区商城'), "value": this.businessIncome*1, "labelShow": false },
                                { "name": i18n.t('资源合同'), "value": this.resourcePactIncome*1, "labelShow": false },
                                { "name": i18n.t('有偿服务'), "value": this.taskIncome*1, "labelShow": false }]
                        }
                    ]
                };
                this.chartData1 = JSON.parse(JSON.stringify(res));
            }, 500);
        },
        confirm(val) {
            this.show = false;
            this.value = val[0];

        },
        init(params){
            this.areaId = params.areaId
            this.projectId = params.projectId
            // this.getBusinessIncomeData()
        },
        // 多经收入情况请求
        updateDateEvt(params) {
            const {unit} = params || {}
            this.unit = unit || this.unit
           this.getDjStatisticsData()
           this.getMallData()
           this.getCashFlowSituation()
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
                areaId,
                projectId,
                endDate,
                amountType: unit
            }
            return params
        },
         // 多经收入情况
        getDjStatisticsData() {
            const params = this.getBasicParams()
            getDjStatisticsData({data: params, hideLoading: true}).then(res => {
                if (res.status == 200) {
                    const {
                        djCurrentMonthReceivedMoney, // 多经当月整体收入
                        djCurrentYearReceivedMoney, // 多经全年整体收入
                        djCurrentMonthReceivedMoneyAgainstLastMonth: monthRate, // 多经当月整体收入环比
                        djCurrentYearReceivedMoneyAgainstLastYear, // 多经全年整体收入环比
                        ycCurrentMonthReceivedMoney, // 有偿服务当月整体收入
                        ycCurrentYearReceivedMoney, // 有偿服务全年整体收入
                        ycCurrentMonthReceivedMoneyAgainstLastMonth: yearRate, // 有偿服务当月整体收入环比
                        ycCurrentYearReceivedMoneyAgainstLastYear, // 有偿服务全年整体收入环比
                    } = res.data || {}
                    const mr = parseFloat(monthRate)
                    const yr = parseFloat(yearRate)

                    this.multipleIncome[1].value = djCurrentMonthReceivedMoney
                    this.multipleIncome[1].rate = monthRate
                    this.multipleIncome[1].descIcon = mr > 0 ? 'green' : mr < 0 ? 'red' : ''

                    this.multipleIncome[2].value = ycCurrentMonthReceivedMoney
                    this.multipleIncome[2].rate = yearRate
                    this.multipleIncome[2].descIcon = yr > 0 ? 'green' : yr < 0 ? 'red' : ''
                    
                    this.$forceUpdate()
                    this.updatePiePercentage()
                }
            })
        },
        // 百分比值 
        getPercentValue(arrList, index, precision) {
            if (!arrList[index]) {
                return 0;
            }
            if (!precision) precision = 2;
            let sum = arrList.reduce((acc, val) => {
                return acc + (isNaN(val) ? 0 : val);
            }, 0);
            if (sum === 0) {
                return 0;
            }
            let digits = Math.pow(10, precision);
            let votesPerQuota = arrList.map((val) => {
                return ((isNaN(val) ? 0 : val) / sum) * digits * 100;
            });

            let targetSeats = digits * 100;
            let seats = votesPerQuota.map((votes) => {
                return Math.floor(votes);
            });

            let currentSum = seats.reduce((acc, val) => {
                return acc + val;
            }, 0);

            let remainder = votesPerQuota.map(function (votes, index) {
                return votes - seats[index];
            });

            while (currentSum < targetSeats) {
                let max = Number.NEGATIVE_INFINITY;
                let maxId = null;
                for (let i = 0, len = remainder.length; i < len; ++i) {
                if (remainder[i] > max) {
                    max = remainder[i];
                    maxId = i;
                }
                }
                ++seats[maxId];
                remainder[maxId] = 0;
                ++currentSum;
            }

            return seats[index] / digits;
        },
        // 更新百分比
        updatePiePercentage() {
            const list = this.multipleIncome
            const total = list.map(item => parseFloat(item.value))
            let sum = 0
            list.forEach((item, index) => {
                item.percentage = this.getPercentValue(total, index, 2)
                sum += item.value
                this.chartData1.series[0].data[index].value = item.value
            })
 
            this.opts1.subtitle.name = this.truncateDecimalString(sum)
            this.opts1.subtitle.fontSize = this.unit == 1 ? 12 : 17
        },
        truncateDecimalString(input) {
            const str = input + ''
            const [int, flt] = str.split('.')
            const decimal = flt ? '.' + flt.substring(0, 2) : ''
            return parseFloat(`${int}${decimal}`)
        },
        // 商城
        getMallData(){
            const { O_USER_INFO } = this.$constant;
		    const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
            const companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
            const {areaId, projectId, financialEndtime, startTime, endTime } = this.filterData
            const params = {
                data: {
                    companyId: companyId,
                    areaId,
                    projectId,
                    financialEndtime,
                    startTime,
                    endTime,
                }
            }
            getBusinessIncome(params).then(res =>{
                if(res.status == '200'){
                    const {businessIncome, businessRatio} = res.data
                    const grand10str = (businessIncome / 10000)
                    const grand10 = this.truncateDecimalString(grand10str)
                    const value = this.unit == 2 ? grand10 : businessIncome
                    const r = parseFloat(businessRatio)
                    this.multipleIncome[0].value = parseFloat(value) || 0
                    this.multipleIncome[0].rate = businessRatio || 0 
                    this.multipleIncome[0].descIcon = r > 0 ? 'green' : r < 0 ? 'red' : ''
                    this.$forceUpdate()
                    this.updatePiePercentage()

                }
            })
        },
        // 现金流情况
        getCashFlowSituation() {
            const params = this.getBasicParams()
            const endDate = this.endDate
            getCashFlowSituation({data: params, hideLoading: true}).then(res => {
                if (res.status == 200) {
                    const {monthAmount, receivedMonthAmount, refundMonthAmount, YearAmount, receivedYearAmount, refundYearAmount, collateralAmount, receivedCollateralAmount, refundCollateralAmount} = res.data || {}
                    const list = [
                        {
                            name: i18n.t('现金流概况'),
                            children: [
                                {
                                    title: i18n.t('本月现金流金额'),
                                    money: monthAmount,
                                    receive: receivedMonthAmount,
                                    withdraw: refundMonthAmount,
                                },
                                {
                                    title: i18n.t('本年现金流金额'),
                                    money: YearAmount,
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
                    this.cashFlowData = {
                        text:  i18n.t('现金流数据更新至{0}', [endDate]),
                        list
                    } 
                }
            })
        },
    },
    created() {

    },
    mounted() {
        // this.getServerData2()
        // this.getBusinessIncomeData()
    },
}
</script>
<style lang="scss">
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

.m-box {

    display: flex;
}

.m-box1 {
    width: 50%; 
    height: 200px;
}

.m-box2 {
    flex: 1;
    display: grid;
}

.m-box-item {

    // margin-bottom: 20rpx;

    .mbox-text {
        color: #17233D;
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: #666666;

        .mbox-blue {
            width: 16rpx;
            height: 16rpx;
            background: #2761FF;
            opacity: 1;
            border-radius: 2rpx;
            margin-right: 8rpx;
        }

        .mbox-orange {
            width: 16rpx;
            height: 16rpx;
            background: #FA6400;
            opacity: 1;
            border-radius: 2rpx;
            margin-right: 8rpx;
        }

        .mbox-yellow {
            width: 16rpx;
            height: 16rpx;
            background: #FFB038;
            opacity: 1;
            border-radius: 2rpx;
            margin-right: 8rpx;
        }
    }

    .mbox-cell {
        margin-top: 5px;
        display: flex;
        // justify-content: space-between;
        align-items:baseline;
    }

    .mbox-m {
        font-size: 40rpx;
        font-family: 'DIN';
        font-weight: bold;
        color: #333333;
        margin: 0 15rpx 0 0;
    }

    .mbox-b {
        font-size: 12px;
        color: #9EA7B4;
    }

    .mbox-bg {
        font-size: 20rpx;
        color: #33BA73;
    }

    .mbox-br {
        font-size: 20rpx;
        &.red {
            color: #E71E1E;
        }
        &.green {
            color: #33BA73;
        }
    }
}

// 统计div间距
.view-margin {
    margin: 0 0 10rpx 0;
}
.item-margin{
    margin: 0 0 30rpx 0;
    &:last-child {
        margin: 0;
    }
}

.t-box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 15px;
    margin-top: 20rpx;

    .tbox-item {
        background-color: #F6F9FF;
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
            // margin: 20rpx 0; 
        }

        .tb-text3 {
            display: flex;
            // margin-bottom: 20rpx;
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
.yuan-style{
    font-size: 36rpx !important;
}
.yuan-cash{
    font-size: 26rpx !important;
}
</style>