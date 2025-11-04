<!--  -->
<template>
    <scroll-view class="scrollContent" @scroll="onScroll" scroll-y="true" :scroll-into-view="intoView"
        scroll-with-animation="true">
        <template v-if="jurisdiction.yinhuanyujing">
            <warning id="sitYh" ref="hazardWarning"></warning>
            <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        </template>
        <template v-if="jurisdiction.pinzhiguanli">
            <quality id="sitPz" category="patrol" canvasIds="patrolCanvasID" ref="qualityManagement"></quality>
            <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        </template>
        <template v-if="jurisdiction.shebeiguangli">
            <devices-manage id="sitSheb" ref="equipmentManagement"></devices-manage>
            <u-gap height="10" bg-color="#F3F4F7"></u-gap>
        </template>
        <template v-if="jurisdiction.shebeixunjian">
            <quality id="sitXj" category="inspection" canvasIds="inspectionCanvasID" ref="equipmentInspection"></quality>
        </template>
    </scroll-view>
</template>

<script>
import DevicesManage from './component/site/devicesManage.vue';//品质管理
import Quality from './component/site/quality.vue';//品质管理
import Warning from './component/site/warning.vue'; //隐患预警

export default {
    components: { Warning, Quality, DevicesManage },
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
            // idsList: [{ index: 0, id: 'sitYh' },
            // { index: 1, id: 'sitPz' },
            // { index: 2, id: 'sitSheb' },
            // { index: 3, id: 'sitXj' }]
        };
    },
    computed: {},
    watch: {},
    methods: {
        
        init(params){
            let data = this.jurisdiction
            if(data.yinhuanyujing){
                this.$refs.hazardWarning.init2(params)
            }
            if(data.pinzhiguanli){
                this.$refs.qualityManagement.init(params)
            }
            if(data.shebeiguangli){
                this.$refs.equipmentManagement.init(params)
            } 
            if(data.shebeixunjian){
                this.$refs.equipmentInspection.init(params)
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