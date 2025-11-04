<!--  -->
<template>
    <view class='block'>
        <view class="bigTitle">
            <view class="jz">
                <text>{{ category == 'certification' ? $t('认证分析') : $t('预缴情况') }}</text>
                <view v-if="category == 'advance'" style="margin: 0 18rpx;"><switch-tabs @click="(evt) => updateDateEvt({unit: evt.value})"></switch-tabs></view>
            </view>
        </view>
        <view v-if="category != 'certification'" class="prepaid-caption">
            <view class="pr-box" v-for="(item, index) in prepaidCaption" :key="index">
                <column-caption :unit="unit" :configData="item"></column-caption>
            </view>
        </view>
        <view v-if="category == 'certification'" class="content">
            <view class="content-item">
                <view class="text-grey view-marginBottom">{{ category == 'certification' ? $t('认证会员数') : $t('预缴金额(万)') }}</view>
                <view class="text-black view-marginBottom">{{ category == 'certification' ? clientNum : 67.88 }}</view>
                <view class="text-lightgrey">{{ category == 'certification' ? $t('会员认证率')+clientRete : $t('本年预缴 123.43') }}</view>
            </view>
            <view class="content-item">
                <view class="text-grey view-marginBottom">{{ category == 'certification' ? $t('认证房间数') : $t('预缴余额(万)') }}</view>
                <view class="text-black view-marginBottom">{{ category == 'certification' ? roomNum : 108.88 }}</view>
                <view class="text-lightgrey">{{ category == 'certification' ? $t('房间认证率')+roomRete : $t('本年收入 87.01') }}</view>
            </view>
            <view class="content-item">
                <view class="text-grey view-marginBottom">{{ category == 'certification' ? $t('取消认证数') : $t('预缴净金额(万)') }}</view>
                <view class="text-black view-marginBottom">{{ category == 'certification' ? cancelNum : 11.12 }}</view>
                <view class="text-lightgrey">{{ category == 'certification' ? $t('本年取消认证')+yearCancelNum : $t('预缴待缴 2.09') }}</view>
            </view>
        </view>
        <view class="subtitle">
            <view class="subtitle-item">
                <text>{{ category == 'certification' ? $t('认证明细') : $t('预缴明细') }}</text>
                <u-icon @click="toDetail" name="arrow-right" size="10" color="#B2B2B2"></u-icon>
            </view>
            <view class="subtitle-item">
                <view :class="selectArea ? 'subItem-item-active' : 'subItem-item'" @click="changeType(true)">{{$t('区域')}}</view>
                <view :class="!selectArea ? 'subItem-item-active' : 'subItem-item'" @click="changeType(false)">{{$t('项目')}}</view>
            </view>
        </view>
        <view>
            <zb-table :cell-style="cellStyle" :cell-header-style="headercellStyle" :show-header="true"
                :columns="tableColumn" :stripe="true" :fit="true" @rowClick="rowClick"
                @toggleRowSelection="toggleRowSelection" @toggleAllSelection="toggleAllSelection" :border="false"
                @edit="buttonEdit" @dele="dele" :data="tableData"></zb-table>
        </view>
    </view>
</template>

<script>
import i18n from '../../../lang/index'

import SwitchTabs from './switch-tabs.vue'; 
import ColumnCaption from './column-caption.vue'; 
import { mapState } from 'vuex'
import {
    getAdvanceCollectionAnalysis,
    getAdvanceCollectionRanking
} from '@/service/leasingbi_new'
import {
    getCertificationAnalysis,
    getCertifiedProjectId,
    getCertifiedDetails
} from '@/service/datawarehouse'
export default {
    components: {SwitchTabs, ColumnCaption},
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
            tableColumn: [],
            tableData: [],
            column: [
                { type: 'index', label: i18n.t('序号'), align: 'center' },
                { name: 'projectName', label: i18n.t('区域'), align: 'center', emptyString: '-' },
                // { name: 'projectName', label: '项目', align: 'center', emptyString: '-' },
                { name: 'userTotal', label: i18n.t('总房间数'), align: 'center', sorter: true },
                { name: 'clientTotal', label: i18n.t('总会员数'), align: 'center', sorter: true },
                { name: 'clientNum', label: i18n.t('认证会员'), align: 'center', sorter: true }

            ],
            column2:[
                { type: 'index', label: i18n.t('序号'), align: 'center' },
                { name: 'areaName', label: i18n.t('区域'), align: 'center', emptyString: '-' },
                { name: 'num1', label: i18n.t('预收(万)'), align: 'center', sorter: true },
                { name: 'num3', label: i18n.t('当年预收(万)'), align: 'center', sorter: true }
            ],
            "roomNum": '0',           //房间认证率
            "roomRete": "0%",    //本年取消认证数
            "yearCancelNum": 0,     //认证会员数
            "clientNum": 1943,          //会员认证率
            "clientRete": "0%",   //取消认证数
            cancelNum:'0',
            areaId:'',
            projectId:'',
            currentMonth:'',
            startTime:'',
            endTime:'',
            // 预缴情况
            prepaidCaption: [
                {
                    title: i18n.t('年度预缴总金额'),
                    value: '0'
                },
                {
                    title: i18n.t('年度预缴未来年金额'),
                    value: '0'
                },
                {
                    title: i18n.t('次年账单预缴金额'),
                    value: '0'
                },
                {
                    title: i18n.t('年度预缴率'),
                    value: '0%'
                },
            ],
            unit: 2,
            rankingType: 1, //  1:区域    2:项目
        };
    },
    computed: {
        ...mapState({
		    filterData: state => state.kanbanFilter,
		})
    },
    watch: {
        selectArea: {
            handler(val,val1) {
                console.log(100,val,val1)
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
            let type = this.category == 'certification' ? 'rzmx' : 'ysmx'
            let title = this.category == 'certification' ? '认证明细' : i18n.t('预缴明细')
            uni.navigateTo({
                url: `/pages-kanban/kanban/tableDetail?type=${type}&title=${title}`
            })
        },
        changeType(type){
            this.selectArea = type
            this.column[1].label = this.selectArea ? '区域' : i18n.t('项目') ;
            if(this.category == 'certification'){
                if(type){
                    this.getCertifiedDetailsData()
                }else{
                    this.getCertifiedProjectIdData()
                }
            }
            this.updateDateEvt({rankingType: type ? 1 : 2})
        },
        //选了项目查
        getCertifiedDetailsData(){
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getCertifiedDetails(params,10,1).then(res=>{
                if(res.status == '200' && res.data){
                    this.tableColumn = this.column
                    let list = res.data.records
                    list.forEach(item => {
                        item.projectName = item.areaName
                    });
                    this.tableData = list
                }
            })
        },
        getCertifiedProjectIdData(){
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            if (this.category != 'certification') return // 防止在erp组件里，没判断调用此方法
            getCertifiedProjectId(params,10,1).then(res=>{
                if(res.status == '200' && res.data){
                    this.tableColumn = this.column
                    this.tableData = res.data.records
                }
            })
        },
        getCertificationAnalysisData(){
            let params = {
                data:{
                    companyId: this.companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getCertificationAnalysis(params).then(res=>{
                if(res.status == '200' && res.data){
                    this.roomNum = res.data.roomNum
                    this.roomRete = res.data.roomRete
                    this.yearCancelNum = res.data.yearCancelNum
                    this.clientNum = res.data.clientNum
                    this.clientRete = res.data.clientRete
                    this.cancelNum = res.data.cancelNum
                }
            })
        },
        initTable() { 
            let column =
                [{ type: 'index', label: i18n.t('序号'), align: 'center' },
                // { name: 'areaName', label: '区域', align: 'center', emptyString: '-' },
                { name: 'projectName', label: i18n.t('项目'), align: 'center', emptyString: '-' },
                { name: 'userTotal', label: i18n.t('总房间数'), align: 'center', sorter: true },
                { name: 'clientTotal', label: i18n.t('总会员数'), align: 'center', sorter: true },
                { name: 'clientNum', label: i18n.t('认证会员'), align: 'center', sorter: true }];

            if (this.category == 'advance') {
                column = [{ type: 'index', label: i18n.t('序号'), align: 'center' },
                { name: 'areaName', label: i18n.t('区域'), align: 'center', emptyString: '-' },
                { name: 'advancePaymentTotalAmount', label: i18n.t('年度预缴'), align: 'center', sorter: true },
                { name: 'advancePaymentFollowingYear', label: i18n.t('次年账单预缴'), align: 'center', sorter: true },
                { name: 'advancePaymentRate', label: i18n.t('年度预缴率'), align: 'center', sorter: true }];
            }


            if (!this.selectArea) {
                column[1].label = i18n.t('项目')
            }
            this.tableColumn = column;
            let data = [];
            for (var i = 0; i < 4; i++) {
                data.push({
                    areaName: this.selectArea ? '广州区域' : i18n.t('广州项目'),
                    num1: uni.$u.random(0, 100),
                    num2: uni.$u.random(0, 100),
                    num3: uni.$u.random(0, 100),
                    num4: uni.$u.random(0, 100) 
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
        init(params){
            console.log(244,this.category)
            this.areaId = params.areaId
            this.projectId = params.projectId
            this.startTime = params.startTime
            this.endTime = params.endTime
            this.getCertificationAnalysisData()
            this.getCertifiedDetailsData()
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
                amountType: unit
            }
            return params
        },
        // 预缴/收情况请求
        updateDateEvt(params) {
            if (this.category == 'advance') {
                const {unit, rankingType} = params || {}
                this.unit = unit || this.unit
                this.rankingType = rankingType || this.rankingType
                this.getAdvanceCollectionAnalysis()
                this.getAdvanceCollectionRanking()
            }
        },
        // 预缴情况
        getAdvanceCollectionAnalysis() {
            const params = this.getBasicParams()
            getAdvanceCollectionAnalysis({data: params, hideLoading: true}).then(res => {
                if (res.status == 200) {
                    const {advancePaymentTotalAmount, advancePaymentAmount, advancePaymentFollowingYear, advancePaymentRate} = res.data || {}
                    this.prepaidCaption = [
                        {
                            title: i18n.t('年度预缴总金额'),
                            value: advancePaymentTotalAmount
                        },
                        {
                            title: i18n.t('年度预缴未来年金额'),
                            value: advancePaymentAmount
                        },
                        {
                            title: i18n.t('次年账单预缴金额'),
                            value: advancePaymentFollowingYear
                        },
                        {
                            title: i18n.t('年度预缴率'),
                            value: advancePaymentRate
                        }
                    ]
                }
            })
        },
        // 预收/缴明细
        getAdvanceCollectionRanking() {
            const params = this.getBasicParams()
            const rankingType = this.rankingType
            params.rankingType = rankingType
            getAdvanceCollectionRanking({data: params, hideLoading: true}).then(res => {
                if (res.status == 200) {
                    const list = Array.isArray(res.data) ? res.data : []
                    const tempList = []
                    const isArea = this.rankingType == 1
                    list.forEach(item => {
                        const {areaName, projectName, advancePaymentTotalAmount, advancePaymentFollowingYear, advancePaymentRate} = item
                        tempList.push({
                            ...item,
                            scope: isArea ? areaName : projectName
                        })
                    })
                    this.tableColumn = [
                        { type: 'index', label: i18n.t('序号'), align: 'center' },
                        { name: 'scope', label: isArea ? i18n.t('区域') : i18n.t('项目'), align: 'center', emptyString: '-' },
                        { name: 'advancePaymentTotalAmount', label: i18n.t('年度预缴'), align: 'center', sorter: true },
                        { name: 'advancePaymentFollowingYear', label: i18n.t('次年账单预缴'), align: 'center', sorter: true },
                        { name: 'advancePaymentRate', label: i18n.t('年度预缴率'), align: 'center', sorter: true }
                    ]
                    this.tableData = tempList
                }
            })
        },
    },
    created() {

    },
    mounted() {
        // this.initTable();
        // this.getCertificationAnalysisData()
        // this.getCertifiedProjectIdData()
    },
}
</script>
<style scoped lang="scss">
@import url(../css/kanban.sass);

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

.prepaid-caption{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    .pr-box{
       margin-bottom: 20rpx;
    }
    .pr-box:nth-child(even) {
        margin-left: 20rpx;
    }
}
</style>