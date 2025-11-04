<!--  -->
<template>
    <view class='block'>
        <view class="bigTitle">
            <view class="jz">
                <text>{{$t('招商分析')}}</text>
            </view>
        </view>
        <view class="content">
            <view class="content-item" v-for="(item, index) in overview" :key="index">
                <view class="item-margin0">
                    <view class="text-blue item-margin0">{{ item.name }}</view>
                    <view style="margin-top: 20rpx;" v-for="(child, i) in item.children">
                        <view class="text-black view-marginBottom">{{ child.title }}</view>
                        <view class="text-bold view-marginBottom">{{ child.num }}</view>
                        <view class="view-marginBottom reletive-up" v-if="child.ratioName">
                            <text class="text-grey">{{ child.ratioName }} </text>
                            <text :class="['text-green', child.ratioColor]">{{ child.ratioNum }}</text>
                            <image v-if="child.ratioColor == 'green'" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                                    style="width:16rpx;height:16rpx;"></image>
                            <image v-if="child.ratioColor == 'red'" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-down1.png`)" style="width:16rpx;height:16rpx;"></image>        
                        </view>
                        <view v-if="child.subTitle" class="text-lightgrey">{{ child.subTitle }} {{child.subNum}}</view>
                    </view>
                </view>
                <view v-if="false">
                    <view class="text-black view-marginBottom">{{$t('续租率')}}</view>
                    <view class="text-bold view-marginBottom">0.00</view>
                    <view class="text-lightgrey">{{$t('即将到期 34')}}</view>
                    
                </view>


            </view>
            <view class="content-item"  v-if="false">
                <view class="item-margin0">
                    <view class="text-blue item-margin0">{{$t('商机情况')}}</view>
                    <view class="text-black view-marginBottom">{{$t('商机客户')}}</view>
                    <view class="text-bold view-marginBottom">110</view>
                    <view class="view-marginBottom">
                        <text class="text-grey">{{$t('环比')}}</text>
                        <text class="text-green">+8.8%</text>
                        <image :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                                style="width:16rpx;height:16rpx;"></image>
                    </view>
                </view>
                <view>
                    <view class="text-black view-marginBottom">{{$t('意向商机')}}</view>
                    <view class="text-bold view-marginBottom">999</view>
                    <view class="text-lightgrey">{{$t('意向跟进 9999')}}</view>
                </view> 
            </view>
         </view>
         <view class="subtitle">
            <text>{{$t('招商趋势图')}}</text>
        </view>
        <view>
            <qiun-data-charts :onmovetip="true" :ontouch="true" :canvas2d='true' canvasId='investmentcanvans' type="line"
                :opts="opts1" :inScrollView="true" :chartData="trend" tooltipFormat="tooltipFormatTrend" />

        </view>
    </view>
</template>

<script>
import i18n from '../../../../lang/index'

import { mapState } from 'vuex'
import {
    getContractStatisticsData,
    getContractTrendData
} from '@/service/leasingbi_new'
export default {
    components: {},
    data() {
        return {
            chartData1: {},
            opts1: {
                color: ["#FA6400", "#FAAD13"],
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
            overview: [
                {
                    name: i18n.t('出租情况'),
                    children: [
                        {
                            title: i18n.t('出租率'),
                            num: '0%',
                            ratioName: i18n.t('环比'),
                            ratioNum: '0%',
                            ratioColor: "",
                        },
                        {
                            title: i18n.t('即将到期合同数'),
                            num: 0,
                            subTitle: "",
                            subNum: "",
                        },
                    ],
                },
                {
                    name: i18n.t('商机情况'),
                    children: [
                        {
                            title: i18n.t('商机数量'),
                            num: 0,
                            ratioName: i18n.t('商机转化率'),
                            ratioNum: '0%',
                            ratioColor: "",
                        },
                        {
                            title: i18n.t('意向商机'),
                            num: 0,
                            subTitle: i18n.t('商机跟进'),
                            subNum: 0,
                        },
                    ],
                }
            ],
            trend: {
                categories: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
                series: [
                    {
                        name: i18n.t('出租率'),
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    } 
                ]
            }
        };
    },
    computed: {
        ...mapState({
		    filterData: state => state.kanbanFilter,
		}),
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
                            name: i18n.t('出租率'),
                            data: [80, 100, 70, 30, 90, 100, 25, 35, 60, 46, 85, 75],
                        } 
                    ]
                };
                this.chartData1 = JSON.parse(JSON.stringify(res));

            }, 500);
        },
        arrowColor(val) {
            const numVal = parseFloat(val)
            return numVal > 0 ? 'green' : numVal < 0 ? 'red' : ''
        },
        // 生成通用参数
        getBasicParams() {
            const { O_USER_INFO } = this.$constant;
            const {companyId: cid} = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }) || {};
            const companyId = cid || this.$appConfig.COMPLANY_ID;
            const {financialEndtimeTxt, areaId, projectId} = this.filterData
            const endDate = financialEndtimeTxt || ''
            const params = {
                companyId,
                areaIds: areaId,
                projectIds: projectId,
                endDate,
            }
            return params
        },
        // 商分析请求
        updateDateEvt(params) {
            this.getContractStatisticsData()
            this.getContractTrendData()
        },
        // 招商分析情况
        getContractStatisticsData() {
            const params = this.getBasicParams()
            getContractStatisticsData({data: params, hideLoading: true}).then(res => {
                if (res.status == 200) {
                    const {
                        roomLeaseRate, 
                        roomLeaseRateAgainstLastMonth, 
                        terminatedRoomContractNumber, 
                        businessOpportunityNum,
                        businessOpportunityRate,
                        businessOpportunityOfIntentionNum,
                        businessOpportunityOfFollowUpNum
                    } = res.data || {}

                    this.overview = [
                        {
                            name: i18n.t('出租情况'),
                            children: [
                            {
                                title: i18n.t('出租率'),
                                num: roomLeaseRate,
                                ratioName: i18n.t('环比'),
                                ratioNum: roomLeaseRateAgainstLastMonth,
                                ratioColor: this.arrowColor(roomLeaseRateAgainstLastMonth),
                            },
                            {
                                title: i18n.t('即将到期合同数'),
                                num: terminatedRoomContractNumber,
                                subTitle: "",
                                subNum: "",
                            },
                            ],
                        },
                        {
                            name: i18n.t('商机情况'),
                            children: [
                                {
                                    title: i18n.t('商机数量'),
                                    num: businessOpportunityNum,
                                    ratioName: i18n.t('商机转化率'),
                                    ratioNum: businessOpportunityRate || '0%',
                                    ratioColor: this.arrowColor(businessOpportunityRate),
                                },
                                {
                                    title: i18n.t('意向商机'),
                                    num: businessOpportunityOfIntentionNum,
                                    subTitle: i18n.t('商机跟进'),
                                    subNum: businessOpportunityOfFollowUpNum,
                                },
                            ],
                        }
                    ]
                    console.log(this.overview, 'this.overview')
                }
            })
        },
        // 招商趋势
        getContractTrendData() {
            const params = this.getBasicParams()
            getContractTrendData({data: params, hideLoading: true}).then(res => {
                if (res.status == 200) {
                    const list = Array.isArray(res.data) ? res.data : []
                    const data = []
                    const month = []
                    list.forEach(item => {
                        const {month: m, roomLeaseRate} = item
                        const r = parseFloat(roomLeaseRate)
                        month.push(m)
                        data.push(r)
                    })
                    this.trend.categories = month    
                    this.trend.series[0].data = data    
                }
            })
        },
    },
    created() {

    },
    mounted() {
    //  this.getServerData();
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

        .text-black {
            font-size: 24rpx;
            color: #333333;
        }

        .text-grey {
            font-size: 20rpx;
            color: #999999;
            margin-right: 4rpx;
        }
        .text-lightgrey {
            font-size: 20rpx;
            color: #A0A0A0;
        }

        .text-green {
            font-size: 20rpx;
            &.green {
                color: #33BA73;
            }
            &.red {
                color: #ff0000;
            }
        }

        .text-bold {
            font-size: 40rpx;
            font-family: 'DIN';
            font-weight: bold;
            color: #333333;
        }

    }
}
.reletive-up{
    position: relative;
    top: -12rpx;
}
.item-margin0 {
    margin: 0;
}
</style>