<!--  -->
<template>
    <view class='block'>
        <view class="bigTitle">
            <view class="jz">
                <text>{{$t('重点人群')}}</text>
            </view>
        </view>
        <view class="content">
            <qiun-data-charts type="ring" :canvas2d='true' ref="zdcanvans" canvasId='zdcanvans' :opts="opts" :chartData="chartData" />
        </view>
    </view>
</template>

<script>
import i18n from '../../../../lang/index'

import {
    getFocusGroups,
} from '@/service/datawarehouse'
export default {
    components: {},
    props: {
        category: {
            type: String,
            default: 'crowd'  //crowd 重点人群  community 社区舆情
        },
        canvasIds: {
            type: String,
        }
    },
    data() {
        return {
            charImg:false,
            charImg:'',
            chartData: {},
            //您可以通过修改 config-ucharts.js 文件中下标为 ['ring'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
            opts: {
                rotate: false,
                rotateLock: false,
                color: ["#2761FF", "#39CAE0", "#FA6400", "#FAAD13", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [5, 5, 5, 5],
                dataLabel: true,
                enableScroll: false,
                legend: {
                    show: true,
                    position: "bottom",
                    lineHeight: 25
                },
                title: {
                    name: this.category =='crowd'?'关爱人群':i18n.t('实收'),
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
            careGroupsNum:0,
            leftoverChildrenNum:0,
            lonelinessOldManNum:0,
            disabilityPersonNum:0,
            singleParentNum:0,
            areaId:'',
            projectId:'',
            currentMonth:'',
            startTime:'',
            endTime:''
        };
    },
    computed: {},
    watch: {},
    methods: {
        getFocusGroupsData(){
            
            let { O_USER_INFO } = this.$constant;
            let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
            let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
            let params = {
                data:{
                    companyId: companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getFocusGroups(params).then(res=>{
                if(res.status == '200' && res.data && res.data.length){
                    this.careGroupsNum = res.data.careGroupsNum
                    this.leftoverChildrenNum = res.data[1]?.value?? 0
                    this.lonelinessOldManNum = res.data[3]?.value?? 0
                    this.disabilityPersonNum = res.data[5]?.value?? 0
                    this.singleParentNum = res.data[7]?.value?? 0
                    this.opts.subtitle.name = 0
                    this.getServerData();
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
        getServerData() {
            let that = this
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                let res = {
                    series: [
                        {
                            data: [
                                { "name": i18n.t('留守儿童'), "value": this.leftoverChildrenNum*1, legendShape: 'square' },
                                { "name": i18n.t('孤寡老人'), "value": this.lonelinessOldManNum*1, legendShape: 'square' },
                                { "name": i18n.t('残疾人员'), "value": this.disabilityPersonNum*1, legendShape: 'square' },
                                { "name": i18n.t('单亲家庭'), "value": this.singleParentNum*1, legendShape: 'square' }
                            ]
                        }
                    ]
                };
                this.chartData = JSON.parse(JSON.stringify(res));
            }, 500);
        },
        init(params){
            this.areaId = params.areaId
            this.projectId = params.projectId
            this.startTime = params.startTime
            this.endTime = params.endTime
            if(this.category =='crowd'){
                this.getFocusGroupsData()
            }else{
                this.getServerData();
            }
        }
    },
    created() {

    },
    mounted() {
        // if(this.category =='crowd'){
        //     this.getFocusGroupsData()
        // }else{
        //     this.getServerData();
        // }
    },
}
</script>
<style scoped lang="scss">
@import url(../../css/kanban.sass);
</style>