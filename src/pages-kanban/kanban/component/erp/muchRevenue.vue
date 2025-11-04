<!--  -->
<template>
    <view class='block'>
        <view class="bigTitle">
            <view class="jz">
                <text>{{$t('多经收入')}}</text>
                <view style="margin: 0 18rpx;"><switch-tabs  @click="(evt) => updateDateEvt({unit: evt.value})"></switch-tabs></view>
            </view>
        </view>
        <view class="content">
            <view class="content-item1">
                <view class="itembox">
                    <view class="text-grey view-marginBottom">{{$t('多经当月整体收入')}}</view>
                    <view>
                        <text :class="['text-bold', unit == 1 ? 'yuan-size' : '']">{{indexs.djCurrentMonthReceivedMoney}}</text>
                        <text class="text-lightgrey item-sides">{{$t('环比')}}</text>
                        <text :class="['text-green', arrowColor(indexs.djCurrentMonthReceivedMoneyAgainstLastMonth)]"> {{ indexs.djCurrentMonthReceivedMoneyAgainstLastMonth }}</text>
                        <image v-if="arrowColor(indexs.djCurrentMonthReceivedMoneyAgainstLastMonth) == 'green'" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                                style="width:16rpx;height:16rpx;"></image>
                        <image v-if="arrowColor(indexs.djCurrentMonthReceivedMoneyAgainstLastMonth) == 'red'" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-down1.png`)"
                        style="width:16rpx;height:16rpx;"></image>        
                    </view>
                </view>
                <view class="itembox">
                    <view class="text-grey view-marginBottom">{{$t('多经全年整体收入')}}</view>
                    <view>
                        <text :class="['text-bold', unit == 1 ? 'yuan-size' : '']" >{{indexs.djCurrentYearReceivedMoney}}</text>
                        <text class="text-lightgrey item-sides">{{$t('环比')}}</text>
                        <text :class="['text-green', arrowColor(indexs.djCurrentYearReceivedMoneyAgainstLastYear)]"> {{indexs.djCurrentYearReceivedMoneyAgainstLastYear}}</text>
                        <image v-if="arrowColor(indexs.djCurrentYearReceivedMoneyAgainstLastYear) == 'green'" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                                style="width:16rpx;height:16rpx;"></image>
                        <image v-if="arrowColor(indexs.djCurrentYearReceivedMoneyAgainstLastYear) == 'red'" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-down1.png`)"
                        style="width:16rpx;height:16rpx;"></image>        
                    </view>
                </view>
            </view>
            <view class="content-item2">
                <view class="itembox view-marginBottom">
                    <view class="text-grey">{{$t('商城销售')}}</view>
                    <view class="text-bold">0</view>
                    <view class="text-lightgrey2">{{$t('全年销售 0')}}</view>
                </view>
                <view class="itembox view-marginBottom">
                    <view class="text-grey">{{$t('有偿服务当月收入')}}</view>
                    <view :class="['text-bold', unit == 1 ? 'yuan-size' : '']">{{indexs.ycCurrentMonthReceivedMoney}}</view>
                    <view>
                        <text class="text-lightgrey item-sides">{{$t('环比')}}</text>
                        <text :class="['text-green', arrowColor(indexs.ycCurrentMonthReceivedMoneyAgainstLastMonth)]"> {{indexs.ycCurrentMonthReceivedMoneyAgainstLastMonth}}</text>
                        <image v-if="arrowColor(indexs.ycCurrentMonthReceivedMoneyAgainstLastMonth) == 'green'" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                                style="width:16rpx;height:16rpx;"></image>
                        <image v-if="arrowColor(indexs.ycCurrentMonthReceivedMoneyAgainstLastMonth) == 'red'" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-down1.png`)"
                        style="width:16rpx;height:16rpx;"></image>        
                    </view>
                </view>
                <view class="itembox view-marginBottom">
                    <view class="text-grey">{{$t('有偿服务全年收入')}}</view>
                    <view :class="['text-bold', unit == 1 ? 'yuan-size' : '']">{{ indexs.ycCurrentYearReceivedMoney }}</view>
                    <view>
                        <text class="text-lightgrey item-sides">{{$t('环比')}}</text>
                        <text :class="['text-green', arrowColor(indexs.ycCurrentYearReceivedMoneyAgainstLastYear)]"> {{indexs.ycCurrentYearReceivedMoneyAgainstLastYear}}</text>
                        <image v-if="arrowColor(indexs.ycCurrentYearReceivedMoneyAgainstLastYear) == 'green'" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)"
                                style="width:16rpx;height:16rpx;"></image>
                        <image v-if="arrowColor(indexs.ycCurrentYearReceivedMoneyAgainstLastYear) == 'red'"  :src="require(`@/static/${[THEME_NAME]}/kanban/icon-down1.png`)"
                        style="width:16rpx;height:16rpx;"></image>          
                    </view>
                </view>
            </view>
        </view>
        <view class="subtitle">
            <view class="subtitle-item">
                <text>{{$t('多经收入明细')}}</text>
                <u-icon @click="toDetail" name="arrow-right" size="10" color="#B2B2B2"></u-icon>
            </view>
            <view class="subtitle-item">
                <view :class="rankingType == 1 ? 'subItem-item-active' : 'subItem-item'" @click="updateDateEvt({rankingType: 1})">{{$t('区域')}}</view>
                <view :class="rankingType == 2 ? 'subItem-item-active' : 'subItem-item'" @click="updateDateEvt({rankingType: 2})">{{$t('项目')}}</view>
            </view>
        </view>
        <view>
            <zb-table :cell-style="cellStyle" :cell-header-style="headercellStyle" :show-header="true" :columns="column"
                :stripe="true" :fit="true" @rowClick="rowClick" @toggleRowSelection="toggleRowSelection"
                @toggleAllSelection="toggleAllSelection" :border="false" @edit="buttonEdit" @dele="dele"
                :data="tableData"></zb-table>
        </view>
    </view>
</template>

<script>
import i18n from '../../../../lang/index'

import { mapState } from 'vuex'
import {
    getDjStatisticsData,
    getDjRankData
} from '@/service/leasingbi_new'
import SwitchTabs from '../switch-tabs.vue'; 
export default {
    components: {SwitchTabs},
    data() {
        return {
            selectArea: true,
            column: [
                { type: 'index', label: i18n.t('序号'), align: 'center' },
                { name: 'scope', label: i18n.t('区域'), align: 'center', emptyString: '-' },
                { name: 'djCurrentMonthReceivedMoney', label: i18n.t('当月整体收入'), align: 'center', sorter: true },
                { name: 'djCurrentYearReceivedMoney', label: i18n.t('全年整体收入'), align: 'center', sorter: true },

            ],
            tableData: [],
            unit: 2,
            rankingType: 1, //  1:区域    2:项目
            indexs: {
                djCurrentMonthReceivedMoney: 0, // 多经当月整体收入
                djCurrentMonthReceivedMoneyAgainstLastMonth: '0%', // 多经当月整体收入-环比

                djCurrentYearReceivedMoney: 0, // 多经全年整体收入
                djCurrentYearReceivedMoneyAgainstLastYear: '0%', // 多经全年整体收入-环比
                
                ycCurrentMonthReceivedMoney: 0, // 有偿服务当月收入
                ycCurrentMonthReceivedMoneyAgainstLastMonth: '0%', // 有偿服务当月收入-环比

                ycCurrentYearReceivedMoney: 0, // 有偿服务全年收入
                ycCurrentYearReceivedMoneyAgainstLastYear: '0%', // 有偿服务全年收入-环比
            },
            
        };
    },
    computed: {
        ...mapState({
		    filterData: state => state.kanbanFilter,
		}),
    },
    watch: {
        selectArea: {
            handler(val) {
                this.initTable();
            }
        },
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
        toDetail(){
            uni.navigateTo({
                url: i18n.t('/pages-kanban/kanban/tableDetail?type=jsmx&title=经收明细')
            })
        },
        initTable() {  
            this.column[1].label = this.selectArea? i18n.t('区域') :i18n.t('项目');
             let data = [];
            for (var i = 0; i < 4; i++) {
                data.push({
                    areaName: this.selectArea ? i18n.t('广州区域') : i18n.t('广州项目'),
                    num1: uni.$u.random(0, 100),
                    num2: uni.$u.random(0, 100),
                    num3: uni.$u.random(0, 100),
                })
            }

            this.tableData = data;

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
                areaIds: areaId,
                projectIds: projectId,
                endDate,
                amountType: unit,
                
            }
            return params
        },
        // 多经收入请求
        updateDateEvt(params) {
            const {unit, rankingType} = params || {}
            this.unit = unit || this.unit
            this.rankingType = rankingType || this.rankingType
            this.getDjStatisticsData()
            this.getDjRankData()
        },
        arrowColor(val) {
            const numVal = parseFloat(val)
            return numVal > 0 ? 'green' : numVal < 0 ? 'red' : ''
        },
        // 多经收入情况
        getDjStatisticsData() {
            const params = this.getBasicParams()
            getDjStatisticsData({data: params, hideLoading: true}).then(res => {
                if (res.status == 200) {
                    const d = res.data || {}
                    // djCurrentMonthReceivedMoney, // 多经当月整体收入
                    // djCurrentYearReceivedMoney, // 多经全年整体收入
                    // djCurrentMonthReceivedMoneyAgainstLastMonth, // 多经当月整体收入环比
                    // djCurrentYearReceivedMoneyAgainstLastYear, // 多经全年整体收入环比
                    // ycCurrentMonthReceivedMoney, // 有偿服务当月整体收入
                    // ycCurrentYearReceivedMoney, // 有偿服务全年整体收入
                    // ycCurrentMonthReceivedMoneyAgainstLastMonth, // 有偿服务当月整体收入环比
                    // ycCurrentYearReceivedMoneyAgainstLastYear, // 有偿服务全年整体收入环比
                    this.indexs = d
                }
            })
        },
        // 多经收入明细
        getDjRankData() {
            const params = this.getBasicParams()
            const rankingType = this.rankingType
            params.rankingType = rankingType
            getDjRankData({data: params, hideLoading: true}).then(res => {
                if (res.status == 200) {
                    const list = Array.isArray(res.data) ? res.data : []
                    const tempList = []
                    const isArea = rankingType == 1
                    list.forEach(item => {
                        const {areaName, projectName, djCurrentMonthReceivedMoney, djCurrentYearReceivedMoney} = item
                        tempList.push({
                            ...item,
                            scope: isArea ? areaName : projectName,
                        })
                    })
                    this.tableData = tempList
                    this.column[1].label = isArea ? i18n.t('区域') : i18n.t('项目')
                }
            })
        },
    },
    created() {

    },
    mounted() {
       this.initTable();
    }, 
}
</script>
<style scoped lang="scss">
@import url(../../css/kanban.sass);

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

.itembox {
    background: #F8F8F8;
    padding: 20rpx;

    .text-bold {
        font-size: 40rpx;
        font-family: 'DIN';
        font-weight: bold;
        color: #333333;
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

    .text-grey {
        font-size: 20rpx;
        color: #666666;
    }

    .text-lightgrey {
        font-size: 20rpx;
        color: #999999;
    }

    .text-lightgrey2 {
        font-size: 20rpx;
        color: #A0A0A0;
        margin-top: 7px;
    }

    .yuan-size{
        font-size: 22rpx !important;
    }
}
</style>