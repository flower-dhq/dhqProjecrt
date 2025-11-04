<!--  -->
<template>
    <view class='block'>
        <view class="bigTitle">
            <view class="jz">
                <text>{{ category == 'qingqian' ? $t('清欠情况') : category == 'shequ' ? $t('服务收入') : $t('收缴情况') }}</text>
                <view style="margin: 0 18rpx;"><switch-tabs @click="(evt) => updateDateEvt({unit: evt.value})"></switch-tabs></view>
                
            </view>
        </view>
        <!-- 本期/年度收缴率 -->
        <view>
            <template v-if="category == 'shoujiao'">
                <figure-caption :tenGrand="dModel.unit == 2" :configData="currentPeriodRate"></figure-caption>
                <view style="margin-top: 24rpx;"><figure-caption :tenGrand="dModel.unit == 2" :configData="annualRate"></figure-caption></view>
            </template>
            <template v-if="category == 'qingqian'">
                <figure-caption :tenGrand="dModel.unit == 2" :configData="payoffRate"></figure-caption>
            </template>
        </view>
        <view v-if="false" class="content">
            <view class="content-item">
                <view class="text-grey view-marginBottom">{{ category == 'qingqian' ? $t('清欠(万)') : category == 'shequ' ?
                    $t('服务收入(万)') : $t('收缴率') }}</view>
                <view class="text-black view-marginBottom">{{ category == 'qingqian' ? '66.18%' : category == 'shequ' ?
                    serviceRevenue : '66.18%' }}</view>
                <view class="text-lightgrey view-marginBottom">
                    {{ category == 'qingqian' ? $t('本年清欠 567.18万') : category == 'shequ' ? $t('本年收入') + yearServiceRevenue : $t('实收 567.18万')
                    }}</view>
                <view v-if="category != 'shequ'" class="text-lightgrey">
                    {{ category == 'qingqian' ? $t('本年欠款 167.18万') : $t('应收 167.18万') }}</view>
            </view>
            <view class="content-item">
                <view class="text-grey view-marginBottom">{{ category == 'qingqian' ? $t('累计清欠(万)') : category == 'shequ'
                    ? $t('服务订单') : $t('本年收缴率') }}</view>
                <view class="text-black view-marginBottom">{{ category == 'qingqian' ? '66.18%' : category == 'shequ'
                    ? ordersNum : '66.18%' }}</view>
                <view class="text-lightgrey view-marginBottom">
                    {{ category == 'qingqian' ? $t('累计清欠率 67.18%') : category == 'shequ' ? $t('本年订单')+yearOrdersNum : $t('本年实收 1567.18万')
                    }}
                </view>
                <view v-if="category != 'shequ'" class="text-lightgrey">
                    {{ category == 'qingqian' ? $t('累计欠款 867.01万') : $t('本年应收867.01万') }}
                </view>
            </view>
        </view>
        <!-- 圆环 -->
        <view style="margin: 24rpx 0;">
            <view class="subtitle" v-if="category == 'shoujiao'">
                <text>{{$t('支付方式分析')}}</text>
            </view>
            <view class="subtitle" v-if="category == 'qingqian'">
                <text>{{$t('欠费账龄统计')}}</text>
            </view>
            <qiun-data-charts type="ring" v-if="chartData.series[0].data.length>0" :canvas2d='true' :canvasId="canvasIds + 'ring'" :opts="opts"
                :chartData="chartData" />
            <view v-else class="no-data-ring">
                <view class="heart">
                    <view>
                        <view style="font-size: 11px;color: #A0A0A0;">{{ category=='shequ'?$t('服务收入'): $t("年度") + $t("{0}度实收") }}</view>
                        <view style="text-align:center;font-size: 17px;color: #333333">0</view>
                    </view>                     
                </view>
            </view>
        </view>
        <view v-if="category == 'shoujiao'" class="subtitle">
            <text>{{$t('收缴趋势图')}}</text>
        </view>
        <view v-if="category == 'shoujiao'" class="tel0" >
            <qiun-data-charts :onmovetip="true" :ontouch="true" :canvas2d='true' :canvasId="canvasIds + 'line'" type="line"
                :opts="lineOpts" :chartData="lineChartData" :inScrollView="true" tooltipFormat="tooltipFormatTrend" />
        </view>
        <view v-if="category == 'qingqian'">
            <view class="subtitle">
                <text>{{$t('清欠趋势图')}}</text>
            </view>
            <qiun-data-charts :onmovetip="true" :ontouch="true" :canvas2d='true' canvasId='qingqiancanvan-s' type="line" :opts="qqOpts" :chartData="qqchartData" :inScrollView="true" tooltipFormat="tooltipFormatTrend" />
        </view>
        <view class="subtitle">
            <view class="subtitle-item">
                <text>{{ category == 'qingqian' ? $t('清欠明细') : category == 'shequ' ? $t('服务收入明细') : $t('收缴明细') }}</text>
                <u-icon @click="toDetail" name="arrow-right" size="10" color="#B2B2B2"></u-icon>
            </view>
            <view class="subtitle-item">
                <view :class="dModel.scopeType == 1 ? 'subItem-item-active' : 'subItem-item'" @click="updateDateEvt({scopeType: 1})">{{$t('区域')}}</view>
                <view :class="dModel.scopeType == 2 ? 'subItem-item-active' : 'subItem-item'" @click="updateDateEvt({scopeType: 2})">{{$t('项目')}}</view>
            </view>
        </view>
        <view>
            <view class="ranking-tabs" v-if="category == 'shoujiao'">
                <text :class="{'active': shoujiaoModel.rankType == 1}" @click="updateDateEvt({rankType: 1})">{{$t('本期收缴排名')}}</text>
                <text :class="{'active': shoujiaoModel.rankType == 2}" @click="updateDateEvt({rankType: 2})">{{$t('年度收缴排名')}}</text>
            </view>
            <zb-table :show-header="true" :cell-style="cellStyle" :cell-header-style="headercellStyle"
                :columns="tableColumn" :stripe="true" :fit="true" @rowClick="rowClick"
                @toggleRowSelection="toggleRowSelection" @toggleAllSelection="toggleAllSelection" :border="false"
                @edit="buttonEdit" @dele="dele" :data="tableData"></zb-table>
        </view>

    </view>
</template>

<script>
import i18n from '../../../lang/index'

import { mapState } from 'vuex'
import {
    getServiceRevenue,
    getIncomeBreakdownProjectId,
    getIncomeBreakdown,
    getServeIncomeDetailByProject,
    getServeIncomeDetailByArea
} from '@/service/datawarehouse'
import {
    getClearArrearsAnalysisData,
    getArrearsAccountAgeData,
    getClearArrearsTrendChart,
    getClearArrearsList,
    getCollectionAnalysis,
    getPaymentAnalysis,
    getCollectionTrend,
    getCollectionRanking
} from '@/service/leasingbi_new'

import SwitchTabs from './switch-tabs.vue'; 
import FigureCaption from './figure-caption.vue'; 

export default {
    components: {SwitchTabs, FigureCaption},
    props: {
        category: {
            type: String,
            default: 'shoujiao'  //qingqian 清欠情况  shoujiao 收缴情况 shequ 服务收入
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
            chartData1: {},
            //您可以通过修改 config-ucharts.js 文件中下标为 ['ring'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
            opts: {
                rotate: false,
                rotateLock: false,
                color: ["#2761FF", "#39CAE0", "#FA6400", "#FAAD13", "#8196CB ", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [5, 4, 5, 4],
                dataLabel: true,
                enableScroll: false,
                
                legend: {
                    show: true,
                    position: "bottom",
                    lineHeight: 25,
                    fontSize: 10,
                },
                title: {
                    name: this.category == 'qingqian' ? "欠费金额" :this.category=='shequ'?'服务收入': this.$t("年度") + this.$t("{0}度实收"),
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

            lineChartData: {
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

            lineOpts: {
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
            tableColumn: [],
            tableData: [],
            "yearServiceRevenue": 0,
            "ordersNum": 0,
            "serviceRevenue": 0,
            yearOrdersNum:'0',
            areaId:'',
            projectId:'',
            currentMonth:'',
            startTime:'',
            endTime:'',
            // 本期收缴
            currentPeriodRate:  {
                textFigure: [
                    {
                    title: i18n.t('本期收缴率'),
                    value: '0%',
                    },
                    {
                    title: i18n.t('本期应收'),
                    value: '0',
                    },
                    {
                    title: i18n.t('本期实收'),
                    value: '0',
                    },
                ],
                textProgress: [
                    {
                    title: i18n.t('本期收缴率'),
                    value: '0%',
                    progressBg: '#e1eaff',
                    progressActiveBg: 'linear-gradient(90deg, #2761FF 0%, #39CAE0 100%)',
                    },
                    {
                    title: i18n.t('本期目标收缴完成率'),
                    value: '0%',
                    progressBg: '#e1eaff',
                    progressActiveBg: 'linear-gradient(90deg, #2761FF 0%, #39CAE0 100%)',
                    },
                ],
            },
            // 年度收缴
            annualRate:  {
                textFigure: [
                    {
                    title: i18n.t('年度收缴率'),
                    value: '0%',
                    },
                    {
                    title: i18n.t('年度') + i18n.t('{0}度应收'),
                    value: '0',
                    },
                    {
                    title: i18n.t('年度实收'),
                    value: '0',
                    },
                ],
                textProgress: [
                    {
                    title: i18n.t('年度实收目标收缴率'),
                    value: '0%',
                    progressBg: '#f7dbcc',
                    progressActiveBg: 'linear-gradient(90deg, #FA6400 0%, #FAAD13 100%)',
                    },
                    {
                    title: i18n.t('年度目标收缴完成率'),
                    value: '0%',
                    progressBg: '#f7dbcc',
                    progressActiveBg: 'linear-gradient(90deg, #FA6400 0%, #FAAD13 100%)',
                    },
                ],
            },
            // 清欠情况
            payoffRate:  {
                textFigure: [
                    {
                    title: i18n.t('年度清欠率'),
                    value: '0%',
                    },
                    {
                    title: i18n.t('往年欠费'),
                    value: '0',
                    },
                    {
                    title: i18n.t('年度清欠金额'),
                    value: '0',
                    },
                ],
                textProgress: [
                    {
                    title: i18n.t('年度目标清欠率'),
                    value: '0%',
                    progressBg: '#e1eaff',
                    progressActiveBg: 'linear-gradient(90deg, #2761FF 0%, #39CAE0 100%)',
                    },
                    {
                    title: i18n.t('年度目标清欠完成率'),
                    value: '0%',
                    progressBg: '#e1eaff',
                    progressActiveBg: 'linear-gradient(90deg, #2761FF 0%, #39CAE0 100%)',
                    },
                ],
            },
            // 清欠情况opt
            qqOpts: {
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
            // 清欠趋势图
            qqchartData: {
                categories: [i18n.t('2023-1月'), i18n.t('2023-2月'), i18n.t('2023-3月'), i18n.t('2023-4月'), i18n.t('2023-5月'), i18n.t('2023-6月'), i18n.t('2023-7月'), i18n.t('2023-8月'), i18n.t('2023-9月'), i18n.t('2023-10月'), i18n.t('2023-11月'), i18n.t('2023-12月')],
                series: [
                    {
                        name: i18n.t('年度清欠率'),
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    }
                ]
            },
            // 支付方式分析/欠费年账统计
            chartData: {
                series: [
                    {
                        data: []
                    }
                ]
            }
        };
    },
    computed: {
        ...mapState({
		    filterData: state => state.kanbanFilter,
		}),
        dModel() {
            const key = this.category
            return this[`${key}Model`] || {}
        }
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
            deep: true
        }
    },
    methods: {
        toDetail(){
            let type = ''
            let title = ''
            if(this.category=='shequ'){
                type = 'fwsrmx',
                title = i18n.t('服务收入明细')
            }else if (this.category=='qingqian'){
                type = 'qqmx',
                title = i18n.t('清欠明细')
            }else{
                type = 'sfmx',
                title = i18n.t('收费明细')
            }
            uni.navigateTo({
                url: `/pages-kanban/kanban/tableDetail?type=${type}&title=${title}`
            })
        },
        changeType(type){
            this.selectArea = type
            if(this.category == 'shequ'){
                if(type){
                    this.getIncomeBreakdown()
                }else{
                    this.getIncomeBreakdownProjectIdData()
                }
            }
        },
        //查区域
        getIncomeBreakdown(){
            const { scopeType } = this.shequModel || {} 
            const {areaIds, projectIds } = this.getBasicParams()
            let params = {
                data:{
                    companyId: this.companyId,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    areaId: areaIds,
                    sort: 1, //1--降序，2--升序
                    select: 1,  //按列排序，1--全年收入，2--订单数 
                }
            }
            if (scopeType == 2) params.data.projectId = projectIds
            this.tableColumn = [
                { type: 'index', label: i18n.t('序号'), align: 'center' },
                { name: 'scope', label: scopeType == 1 ? i18n.t('区域') : i18n.t('项目'), align: 'center', emptyString: '-' },
                { name: 'ordersNum', label: i18n.t('全年订单数'), align: 'center', sorter: true },
                { name: 'serviceRevenue', label: i18n.t('全年收入(万)'), align: 'center', sorter: true,emptyString: '-' }
            ]

            const pms = scopeType == 1 ? getServeIncomeDetailByArea(params,10,1) : getServeIncomeDetailByProject(params,10,1)
            const formatNumber = (num) => {
                let str = num.toString();
                if (!str.includes('.')) {
                    return str + '.00';
                }
                let parts = str.split('.');
                if (parts[1].length < 2) {
                    return parts[0] + '.' + parts[1].padEnd(2, '0');
                }
                return str.slice(0, str.indexOf('.') + 3);
            }
            pms.then(res=>{
                this.tableData = []
                if(res.status == '200' && res.data) {
                    const records = res.data.records
                    const list = []
                    records.forEach(item => {
                        const {areaName = '', projectName = '', serviceRevenue = 0 } = item
                        const num = serviceRevenue / 100
                        list.push({
                            ...item,
                            scope: scopeType == 1 ? areaName : projectName,
                            serviceRevenue: formatNumber(num ? num : 0)
                        })
                    })
                    this.tableData = list
                }
            })
        },
        getIncomeBreakdownProjectIdData(){
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getIncomeBreakdownProjectId(params,10,1).then(res=>{
                this.tableColumn = [{ type: 'index', label: i18n.t('序号'), align: 'center' },
                { name: 'projectName', label: i18n.t('项目'), align: 'center', emptyString: '-' },
                { name: 'ordersNum', label: i18n.t('订单数'), align: 'center', sorter: true },
                { name: 'serviceRevenue', label: i18n.t('金额(万)'), align: 'center', sorter: true,emptyString: '-' }]
                if(res.status == '200' && res.data){
                    this.tableData = res.data.records
                }
            })
        },
        getServiceRevenueData(){
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getServiceRevenue(params).then(res=>{
                if(res.status == '200'){
                    let data = this.proData(res.data.list)
                    this.opts.subtitle.name = res.data.serviceRevenue
                    this.chartData = JSON.parse(JSON.stringify(data));
                    this.yearServiceRevenue = res.data.yearServiceRevenue
                    this.ordersNum = res.data.ordersNum
                    this.serviceRevenue = res.data.serviceRevenue
                    this.yearOrdersNum = res.data.yearOrdersNum
                }
            })
        },
        //拼接数据
        proData(list){
            let list1 = []
            list.map(item=>{
                list1.push({ "name": item.key, "value": item.value*1, legendShape: 'square' })
            })
            let res = {
                    series: [
                        {
                            data: list1
                        }
                    ]
                };
            return res
        },
        initTable() {  
            let column =
                [{ type: 'index', label: i18n.t('序号'), align: 'center' },
                { name: 'scope', label: i18n.t('区域'), align: 'center', emptyString: '-' },
                { name: 'receivableAmount', label: i18n.t('本期应收'), align: 'center', sorter: true },
                { name: 'receivedAmount', label: i18n.t('本期实收'), align: 'center', sorter: true },
                { name: 'collectionRate', label: i18n.t('本期收缴率'), align: 'center', sorter: true }];
            if (this.category == 'qingqian') {
                column = [{ type: 'index', label: i18n.t('序号'), align: 'center' },
                { name: 'scope', label: i18n.t('区域'), align: 'center', emptyString: '-' },
                { name: 'totalArrearsAmount', label: i18n.t('往年欠费'), align: 'center', sorter: true },
                { name: 'totalReceivedAmount', label: i18n.t('年度清欠'), align: 'center', sorter: true },
                { name: 'clearRate', label: i18n.t('年度清欠率'), align: 'center', sorter: true }]
            }else if(this.category == 'shequ'){
                column = [{ type: 'index', label: i18n.t('序号'), align: 'center' },
                { name: 'areaName', label: i18n.t('区域'), align: 'center', emptyString: '-' },
                { name: 'num1', label: i18n.t('订单数'), align: 'center', sorter: true },
                { name: 'num2', label: i18n.t('金额(万)'), align: 'center', sorter: true }]
            }

            if (!this.selectArea) {
                column[1].label = i18n.t('项目')
            }
            this.tableColumn = column;
            let data = [];
            // for (var i = 0; i < 1; i++) {
            //     data.push({
            //         areaName: this.selectArea ? '广州区域' : '广州项目',
            //         num1: this.category == 'shequ'?'234':'23.09',
            //         num2:this.category == 'shequ'?'203': '23.09%',
            //         num3: '50.40%',
            //     })
            // }
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
        getServerData() {
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                let qk = [{ "name": i18n.t('3个月内'), "value": 50, legendShape: 'square' },
                { "name": i18n.t('3-6个月'), "value": 50, legendShape: 'square' },
                { "name": i18n.t('6-12个月'), "value": 50, legendShape: 'square' },
                { "name": i18n.t('1-3年'), "value": 50, legendShape: 'square' },
                { "name": i18n.t('3年以上'), "value": 50, legendShape: 'square' }];
                let da = [
                    { "name": i18n.t('现金'), "value": 50, legendShape: 'square' },
                    { "name": i18n.t('银联'), "value": 30, legendShape: 'square' },
                    { "name": i18n.t('微信支付'), "value": 20, legendShape: 'square' },
                    { "name": i18n.t('支付宝支付'), "value": 18, legendShape: 'square' }
                ]
                let shequ = [
                    { "name": i18n.t('保洁服务'), "value": 50, legendShape: 'square' },
                    { "name": i18n.t('家具装修'), "value": 30, legendShape: 'square' },
                    { "name": i18n.t('房屋租售'), "value": 20, legendShape: 'square' },
                    { "name": i18n.t('快递收发'), "value": 18, legendShape: 'square' }
                ]
                let res = {
                    series: [
                        {
                            data: this.category == 'qingqian' ? qk :this.category=='shequ'?shequ: da
                        }
                    ]
                };

                this.chartData = JSON.parse(JSON.stringify(res));
                console.log(371,this.chartData)
            }, 500);
        },
        getServerData2() {
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                let res = {
                    categories: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
                    series: [
                        {
                            name: i18n.t('收缴率'),
                            data: [20, 30, 40, 50, 90, 40, 25, 35, 60, 46, 85, 75]
                        },
                        {
                            name: i18n.t('累计收缴率'),
                            data: [55, 70, 80, 10, 20, 90, 35, 45, 50, 46, 65, 65]
                        }
                    ]
                };
                // this.lineChartData = JSON.parse(JSON.stringify(res));
            }, 500);
        },
        init(params){
            this.areaId = params.areaId
            this.projectId = params.projectId
            this.startTime = params.startTime
            this.endTime = params.endTime
            this.getServerData2();
            if(this.category=='shequ'){
                this.getServiceRevenueData()
                this.getIncomeBreakdown()
            } 
        },
        // 切换更新数据
        updateDateEvt(params) {
            const {scopeType, unit, rankType} = params || {}
            const key = this.category
            const fnName = `${key}Request`
            if (scopeType != undefined) this[`${key}Model`].scopeType = scopeType
            if (rankType != undefined) this[`${key}Model`].rankType = rankType
            if (unit != undefined) this[`${key}Model`].unit = unit // 万元/元
            this[fnName] && this[fnName]() 
        },
        // 初始化数据模型
        initDataModel() {
            const k = this.category
            this[`${k}Model`] = {
                scopeType: 1,
                unit: 2, // 万元   
                rankType: 1, // 1本期 2年度
            }
        },
        // 生成通用参数
        getBasicParams(optionalKeys = []) {
            const k = this.category
            const { O_USER_INFO } = this.$constant;
            const {companyId: cid} = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }) || {};
            const companyId = cid || this.$appConfig.COMPLANY_ID;
          
            const model = this[`${k}Model`] || {} 
            const {financialEndtimeTxt, areaId, projectId} = this.filterData
            const endDate = financialEndtimeTxt || ''
            const params = {
                companyId,
                areaIds: areaId,
                projectIds: projectId,
                endDate,
            }
            optionalKeys.forEach(keys => {
                const [key, paramsKey] = keys.split(':') // paramsKey:才是传参key
                const val = model[key]
                if (val !== undefined) params[paramsKey] = val
            })
            return params
        },
        // 收缴情况请求
        shoujiaoRequest(params) {
            this.getCollectionAnalysis()
            this.getCollectionTrend()
            this.getPaymentAnalysis()
            this.getCollectionRanking()
        },
        // 收缴情况
        getCollectionAnalysis() {
            const params = this.getBasicParams(['unit:amountType'])

            const callback = (res, periodType) => {
                const {collectionRate, targetCollectionRate, receivableAmount, receivedAmount, targetCompletionRate} = res.data || {}

                if (periodType == 1) {
                    this.currentPeriodRate = {
                        textFigure: [
                            {
                                title: i18n.t('本期收缴率'),
                                value: collectionRate,
                            },
                            {
                                title: i18n.t('本期应收'),
                                value: receivableAmount,
                            },
                            {
                                title: i18n.t('本期实收'),
                                value: receivedAmount,
                            },
                        ],
                        textProgress: [
                            {
                                title: i18n.t('本期目标收缴率'),
                                value: targetCollectionRate,
                                progressBg: '#e1eaff',
                                progressActiveBg: 'linear-gradient(90deg, #2761FF 0%, #39CAE0 100%)',
                            },
                            {
                                title: i18n.t('本期目标收缴完成率'),
                                value: targetCompletionRate,
                                progressBg: '#e1eaff',
                                progressActiveBg: 'linear-gradient(90deg, #2761FF 0%, #39CAE0 100%)',
                            },
                        ],
                    }
                } else {
                    this.annualRate =  {
                        textFigure: [
                            {
                            title: i18n.t('年度收缴率'),
                            value: collectionRate,
                            },
                            {
                            title: i18n.t('年度') + i18n.t('{0}度应收'),
                            value: receivableAmount,
                            },
                            {
                            title: i18n.t('年度') + i18n.t('{0}度实收'),
                            value: receivedAmount,
                            },
                        ],
                        textProgress: [
                            {
                            title: i18n.t('年度实收目标收缴率'),
                            value: targetCollectionRate,
                            progressBg: '#f7dbcc',
                            progressActiveBg: 'linear-gradient(90deg, #FA6400 0%, #FAAD13 100%)',
                            },
                            {
                            title: i18n.t('年度目标收缴完成率'),
                            value: targetCompletionRate,
                            progressBg: '#f7dbcc',
                            progressActiveBg: 'linear-gradient(90deg, #FA6400 0%, #FAAD13 100%)',
                            },
                        ]
                    }
                }    
            }

            const currentPeriod = getCollectionAnalysis({data: {...params, range: 1}, hideLoading: true})
            currentPeriod.then(res => {
                if (res.status == 200) callback(res, 1)
            })

            const annual = getCollectionAnalysis({data: {...params, range: 2}, hideLoading: true})
            annual.then(res => {
                if (res.status == 200) callback(res, 2)
            })

           
        },
        // 收缴趋势
        getCollectionTrend() {
            const params = this.getBasicParams(['unit:amountType'])
            
            const callback = (res, periodType) => {
                const {data} = res || {}
                const list = Array.isArray(data) ? data : []
                const tempMonth = []
                const tempRate = []
                const month = this.lineChartData.categories
                list.forEach(item => {
                    const {chargePeriod, collectionRate} = item
                    const r = parseFloat(collectionRate)
                    tempMonth.push(chargePeriod)
                    tempRate.push(r)
                })
                this.lineChartData.categories = tempMonth
                this.lineChartData.series[periodType == 1 ? 0 : 1].data = tempRate
                
            }

            getCollectionTrend({data: {...params, range: 1}, hideLoading: true}).then(res => {
                if (res.status == 200) callback(res, 1)
            })
            
            getCollectionTrend({data: {...params, range: 2}, hideLoading: true}).then(res => {
                if (res.status == 200) callback(res, 2)
            })
        },
        // 支付方式分析
        getPaymentAnalysis() {
            const {areaIds, projectIds, ...other} = this.getBasicParams(['unit:amountType'])
            getPaymentAnalysis({data: {areaId: areaIds, projectId: projectIds, ...other}, hideLoading: true}).then(res => {
                if (res.status == 200) {
                    const {record = [], amount} = res.data || {}
                    const list = Array.isArray(record) ? record : []
                    const data = []
                    list.forEach(item => {
                        const {paymentTypeName, totalAmount} = item
                        const v = parseFloat(totalAmount)
                        data.push({
                            ...item,
                            name: paymentTypeName,
                            value: v,
                            legendShape: 'square'
                        })
                    })
                    this.opts.subtitle.name = amount
                    this.opts.subtitle.fontSize = uni.upx2px(28)
                    this.chartData.series[0].data = data   
                    this.chartData.series[0].format = "piePercentage" 
                }
            })
        },
        // 收缴率排名/收缴明细
        getCollectionRanking() {
            const params = this.getBasicParams(['unit:amountType', 'scopeType:rankingType'])
            const { scopeType, rankType} = this[`${this.category}Model`] || {}
            params.range = rankType
            getCollectionRanking({data: params, hideLoading: true}).then(res => {
                if (res.status == 200) {
                    const list = res.data || []
                    const tempList = []
                    list.forEach(item => {
                        const {areaName, projectName, receivableAmount, receivedAmount, collectionRate} = item
                        tempList.push({
                            ...item,
                            scope: params.rankingType == 1 ? areaName : projectName,
                        })
                    })
                    this.tableData = tempList
                   this.tableColumn[1].label = scopeType == 1 ? i18n.t('区域') : i18n.t('项目')
                }
            })
        },
        // 清欠明请求
        qingqianRequest(params) {
            this.getClearArrearsAnalysisData()
            this.getArrearsAccountAgeData()
            this.getClearArrearsTrendChart()
            this.getClearArrearsList()
        },
        // 清欠情况
        getClearArrearsAnalysisData() {
            const params = this.getBasicParams(['unit:amountType'])
            const pms = getClearArrearsAnalysisData({data: params, hideLoading: true})

            pms.then(res => {
                if (res.status == 200) {
                    const {totalArrearsAmount, totalReceivedAmount, clearRate, clearTargetRate, clearTargetCompleteRate} = res.data || {}

                    this.payoffRate = {
                        textFigure: [
                            {
                                title: i18n.t('年度清欠率'),
                                value: clearRate,
                            },
                            {
                                title: i18n.t('往年欠费'),
                                value: totalArrearsAmount,
                            },
                            {
                                title: i18n.t('年度清欠金额'),
                                value: totalReceivedAmount,
                            },
                        ],
                        textProgress: [
                            {
                                title: i18n.t('年度目标清欠率'),
                                value: clearTargetRate,
                                progressBg: '#e1eaff',
                                progressActiveBg: 'linear-gradient(90deg, #2761FF 0%, #39CAE0 100%)',
                            },
                            {
                                title: i18n.t('年度目标清欠完成率'),
                                value: clearTargetCompleteRate,
                                progressBg: '#e1eaff',
                                progressActiveBg: 'linear-gradient(90deg, #2761FF 0%, #39CAE0 100%)',
                            },
                        ],
                    }
                }
            })
        },
        // 欠费账龄统计
        getArrearsAccountAgeData() {
            const params = this.getBasicParams(['unit:amountType'])
            const pms = getArrearsAccountAgeData({data: params, hideLoading: true})
            pms.then(res => {
                if (res.status == 200) {
                    const {totalArrearsAmount, detailList} = res.data || {}
                    const list = Array.isArray(detailList) ? detailList : []
                    const data = []
                    list.forEach(item => {
                        const {title, arrearsAmountDouble} = item
                        data.push({
                            ...item,
                            name: title,
                            value: arrearsAmountDouble,
                            legendShape: 'square'
                        })
                    })
                    this.opts.subtitle.name = totalArrearsAmount
                    this.opts.subtitle.fontSize = uni.upx2px(28)
                    this.chartData.series[0].data = data    
                    this.chartData.series[0].format = "piePercentage"
                }
            })
        },
        // 清欠趋势图
        getClearArrearsTrendChart() {
            const params = this.getBasicParams(['unit:amountType', 'scopeType:rankingType'])
            const pms = getClearArrearsTrendChart({data: params, hideLoading: true})

            pms.then(res => {
                if (res.status == 200) {
                    const list = Array.isArray(res.data) ? res.data : []
                    const data = []
                    const month = []
                    list.forEach(item => {
                        const {month: m, clearRate} = item
                        month.push(m)
                        data.push(parseFloat(clearRate))
                    })
                    this.qqchartData = {
                        categories: month,
                        series: [
                            {
                                name: i18n.t('年度清欠率'),
                                data,
                            }
                        ]
                    }
                }
            })
        },
        // 清欠明细 
        getClearArrearsList() {
            const params = this.getBasicParams(['unit:amountType', 'scopeType:rankingType'])
            const {scopeType} = this.qingqianModel || {}
            const pms = getClearArrearsList({data: params, hideLoading: true})
            pms.then(res => {
                if (res.status == 200) {
                    const list = Array.isArray(res.data) ? res.data : []
                    const data = []
                    list.forEach(item => {
                        const {areaName, projectName, totalArrearsAmount, totalReceivedAmount, clearRate} = item
                        data.push({
                            scope: scopeType == 1 ? areaName : projectName,
                            totalArrearsAmount,
                            totalReceivedAmount,
                            clearRate
                        })
                    })
                    this.tableData = data;
                    this.tableColumn[1].label = scopeType == 1 ? i18n.t('区域') : i18n.t('项目')
                }
            })
        },
        // 社区运营
        shequRequest(params) {
            this.getIncomeBreakdown()
            this.$forceUpdate()
        },
    },
    created() {
        this.initDataModel()
    },
    mounted() { 
        this.ab = this.category
        if(this.category=='shoujiao' || this.category=='qingqian'){
            // this.getServerData()
        }
        if(this.category=='shoujiao'){
            // this.getServerData2()
        }
        if(this.category != 'shequ') {
            this.initTable();
        }
        this.updateDateEvt()
        // this.initTable();
        // this.getServerData();
        // this.getServerData2();
        // if(this.category=='shequ'){
        //     this.getServiceRevenueData()
        //     this.getIncomeBreakdownProjectIdData()
        // }
    },
}
</script>
<style scoped lang="scss">
@import url(../css/kanban.sass);

.content {
    display: flex;

    .content-item {
        flex: 1;
        text-align: center;

        .text-grey {
            font-size: 20rpx;
            color: #666666;
        }

        .text-lightgrey {
            font-size: 20rpx;
            color: #999999;
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

.ranking-tabs{
    width: 100%;
    height: 68rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 20rpx;
    text {
        cursor: pointer;
        position: relative;
        font-size: 24rpx;
        color: #2B3740;
    }
    .active {
        color: #2761FF;
        
        &::after {
            content: '';
            display: block;
            width: 42rpx;
            height: 3rpx;
            position: absolute;
            background-color: #2761FF;
            left: 50%;
            transform: translateX(-50%);
            bottom: -10rpx;
        }
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
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>