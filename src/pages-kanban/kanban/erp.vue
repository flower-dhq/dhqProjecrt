<!--  -->
<template>
    <scroll-view class="scrollContent" @scroll="onScroll" scroll-y="true" :scroll-into-view="intoView"
        scroll-with-animation="true">
        <template v-if="jurisdiction.shoujiaoqingkuang">
            <sj-situation id="erpSj" ref="sjSituationSj" :category="'shoujiao'" canvasIds="shoujiao"></sj-situation>
            <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        </template>
        <template v-if="jurisdiction.xianjinliu">
            <cash-flow ref="cashFlow" id="erpXjl"></cash-flow>
            <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        </template>
        <template v-if="jurisdiction.yushouqingkuang">
            <advance-receipts ref="advanceReceipts" category="advance" id="erpYs"></advance-receipts>
            <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        </template>
        <template v-if="jurisdiction.qingqianqingkuang">
            <sj-situation ref="sjSituationQq" id="erpQq" :category="'qingqian'" canvasIds="qingqian"></sj-situation>
            <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        </template>
        <template v-if="jurisdiction.duojingshourucwfx">
            <much-revenue ref="muchRevenue" id="erpDj"></much-revenue>
            <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        </template>
        <template v-if="jurisdiction.zhaosangfenxi">
            <investment ref="investment" id="erpZS"></investment>
        </template>
        
    </scroll-view>
</template>

<script>
import AdvanceReceipts from './component/advanceReceipts.vue';  //预收情况
import CashFlow from './component/cashFlow.vue'; //现金流
import Investment from './component/erp/investment.vue'; //招商分析
import MuchRevenue from './component/erp/muchRevenue.vue'; //erp多经收入
import SjSituation from './component/sjSituation.vue'; //收缴情况


export default {
    components: { SjSituation, CashFlow, AdvanceReceipts, MuchRevenue, Investment },
    props: {
        isScroll: {
            type: Boolean,
            default: true
        },
        intoView: {
            type: String
        },
        idsList: {
            type: Array,
            default: ()=>[]
        },
        jurisdiction: {
            type: Object,
            default: ()=>{}
        },
    },
    data() {
        return {
            distanceArr: [],
            // idsList: [{ index: 0, id: 'erpSj' },
            // { index: 1, id: 'erpXjl' },
            // { index: 2, id: 'erpYs' },
            // { index: 3, id: 'erpQq' },
            // { index: 4, id: 'erpDj' },
            // { index: 5, id: 'erpZS' }]
        };
    },
    computed: {},
    watch: {},
    methods: {
        // 监听页面滚动
        onScroll(event) {
            var that = this;
            if (that.isScroll) {
                let mapList = new Map();;
                that.idsList.map(element => {
                    const query = uni.createSelectorQuery().in(that);
                    query.select('#' + element.id).boundingClientRect(data => {
                        mapList[element.id] = { id: element.id, index: element.index, top: data.top - 140 };
                    }).exec();
                });
                setTimeout(() => {
                    let list = [];
                    for (var key in mapList) {
                        list.push(mapList[key])
                    }
                    that.distanceArr = list;
                    that.$nextTick(() => {
                        let x = 0;
                        var arr = that.distanceArr;
                        let s = arr.sort((a, b) => Math.abs(x - a.top) - Math.abs(x - b.top));
                        if (s && s.length > 0) {
                            this.$emit('scrollTabs', s[0].index)
                        }
                    })
                }, 100);
            }

        },
        init(params){
            this.$refs.sjSituationSj.initTable()
            this.$refs.sjSituationSj.updateDateEvt()

            this.$refs.cashFlow.updateDateEvt()

            this.$refs.advanceReceipts.initTable()
            this.$refs.advanceReceipts.updateDateEvt()
            this.$refs.advanceReceipts.getCertificationAnalysisData()
            this.$refs.advanceReceipts.getCertifiedProjectIdData()

            this.$refs.sjSituationQq.initTable()
            this.$refs.sjSituationQq.updateDateEvt()

            this.$refs.muchRevenue.updateDateEvt()
            this.$refs.investment.updateDateEvt()

            // this.$refs.sjSituationQq.initErp(params)
        }
    },
    created() {
        console.log('erp')
    },
    mounted() {

    },
}
</script>
 
<style scoped>
@import url(./css/kanban.sass);
</style>