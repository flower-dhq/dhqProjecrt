<!--  -->
<template>
    <scroll-view class="scrollContent" @scroll="onScroll" scroll-y="true" :scroll-into-view="intoView"
        scroll-with-animation="true">
        <template v-if="jurisdiction.yunyinggailan">
            <overview id="comYy" ref="overview"></overview>
            <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        </template>
        <template v-if="jurisdiction.renzhengfenxi">
            <advance-receipts id="comFx" category="certification" ref="advanceReceiptsD"></advance-receipts>
            <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        </template>
        <template v-if="jurisdiction.kehuyuqing">
            <opinion id="comYq" category="community" canvasIds="communityCIds" ref="opinionD"></opinion>
            <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        </template>
        <template v-if="jurisdiction.zhongdianrenqun">
            <circle-statistics id="comRq" ref="statisticsS"></circle-statistics>
            <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        </template>
        <template v-if="jurisdiction.kehuchuxing">
            <travel id="comCx" ref="travelD"></travel>
            <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        </template>
        <template v-if="jurisdiction.fuwushouru">
            <sj-situation id="comSr" category="shequ" ref="situationD"></sj-situation>
        </template>
    </scroll-view>
</template>

<script>
import AdvanceReceipts from './component/advanceReceipts.vue';
import CircleStatistics from './component/community/circleStatistics.vue';
import Overview from './component/community/overview.vue'; //运营概览
import Travel from './component/community/travel.vue'; //社区出行
import Opinion from './component/opinion.vue';
import SjSituation from './component/sjSituation.vue'; //服务收入

export default {
    components: { Overview, AdvanceReceipts, Opinion, SjSituation, CircleStatistics, Travel },
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
            // idsList: [{ index: 0, id: 'comYy' },
            // { index: 1, id: 'comFx' },
            // { index: 2, id: 'comYq' },
            // { index: 3, id: 'comRq' },
            // { index: 4, id: 'comCx' },
            // { index: 5, id: 'comSr' }]
        };
    },
    computed: {},
    watch: {},
    methods: {
        init(params){
            let data = this.jurisdiction
            if(data.yunyinggailan){
                this.$refs.overview.init(params)
            }
            if(data.renzhengfenxi){
                this.$refs.advanceReceiptsD.init(params)
            }
            if(data.kehuyuqing){
                this.$refs.opinionD.init(params)
            }
            if(data.zhongdianrenqun){
                this.$refs.statisticsS.init(params)
            }
            if(data.kehuchuxing){
                this.$refs.travelD.init(params)
            }
            if(data.fuwushouru){
                this.$refs.situationD.init(params)
            }
        },
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
    },
    created() {

    },
    mounted() {

    },
}
</script>
<style scoped>
@import url(./css/kanban.sass);
</style>