<!--  -->
<template>
  <scroll-view class="scrollContent" scroll-y="true" scroll-with-animation="true">
    <view class='block' v-if="jurisdiction.gongdanqingkuang">
      <view class="bigTitle">
        <view class="jz">
          <text>{{$t('工单情况')}}</text>
        </view>
      </view>
      <view class="content">
        <view class="content-item" v-for="(item,i) in baseData" :key="i">
          <view class="text-grey view-marginBottom">{{item.title}}</view>
          <view class="text-bold view-marginBottom">{{item.num}}</view>
          <view>
            <text class="text-lightgrey">{{ item.label }}</text>
            <text class="text-green" :class="item.icon">{{item.num2}}</text>
            <image v-if="item.icon!='none'" :src="require(`@/static/${[THEME_NAME]}/kanban/${item.icon=='green'?'icon-up':'icon-down1'}.png`)"
              style="width:16rpx;height:16rpx;"></image>
          </view>
        </view>
      </view>
      <view class="subtitle">
        <text>{{$t('工单状态占比')}}</text>
      </view>
      <view>
        <qiun-data-charts type="ring" :canvas2d='true' canvasId='gdztzbcanvans' :opts="opts"
          :chartData="chartData" />
      </view>
      <view class="subtitle">
        <view class="subtitle-item">
          <text>{{$t('工单处理情况')}}<text class="btn-next" @click="toDetail">></text></text>
        </view>
        <view class="subtitle-item">
          <view :class="selectArea ? 'subItem-item-active' : 'subItem-item'" @click="selectArea = true">{{$t('区域')}}</view>
          <view :class="!selectArea ? 'subItem-item-active' : 'subItem-item'" @click="selectArea = false">{{$t('项目')}}</view>
        </view>
      </view>
      <view>
        <zb-table :cell-style="cellStyle" :cell-header-style="headercellStyle" :show-header="true" :columns="column"
          :stripe="true" :fit="true" @rowClick="rowClick" @toggleRowSelection="toggleRowSelection"
          @toggleAllSelection="toggleAllSelection" :border="false" @edit="buttonEdit" @dele="dele"
          :data="tableData"></zb-table>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import i18n from '../../lang/index'

import {
  getTaskSituation,
  getTaskState,
  getTaskDisposeSituation
} from '@/service/datawarehouse'
import { isNegative, removePercentage } from '../../js/utils/util'
export default {
  components: {},
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
    let { O_USER_INFO } = this.$constant;
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
     return {
      companyId:userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID,
      selectArea: true,
      chartData: {},
      //您可以通过修改 config-ucharts.js 文件中下标为 ['ring'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
      opts: {
        color: ['#2761FF', '#3F9EFF', '#39CAE0', '#FA6400', '#FAAD13', '#8196CB'],
        padding: [5, 5, 5, 5],
        enableScroll: false,
        legend: {
                    show: true,
                    position: "bottom",
                    lineHeight: 25,
                    fontSize: 10,
                },
        title: {
             name: "",
         },
        subtitle: {
             name: "",
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

      column: [
        { type: 'index', label: i18n.t('序号'), align: 'center' },
        { name: 'areaName', label: i18n.t('区域'), align: 'center', emptyString: '-' },
        { name: 'num1', label: i18n.t('工单总数'), align: 'center', sorter: true },
        { name: 'num2', label: i18n.t('工单完成数'), align: 'center', sorter: true },
        { name: 'num3', label: i18n.t('整改完成率'), align: 'center', sorter: true }
      ],
      tableData: [],

      baseData:[
        { title:i18n.t('工单总数'), num:'0', num2:'0.00%', icon:'none', label:i18n.t('环比') },
        { title:i18n.t('内部工单数'), num:'0', num2:'0.00%', icon:'none', label:i18n.t('环比') },
        { title:i18n.t('客户工单数'), num:'0', num2:'0.00%', icon:'none', label:i18n.t('环比') },
        { title:i18n.t('工单接单率'), num:'0.00%', num2:'0.00%', icon:'none', label:i18n.t('较上月') },
        { title:i18n.t('工单完成数'), num:'0', num2:'0.00%', icon:'none', label:i18n.t('环比') },
        { title:i18n.t('工单关闭率'), num:'0.00%', num2:'0.00%', icon:'none', label:i18n.t('较上月') },
      ],
      searchForm:{
        areaId:'',
        projectId:'',
        date:''
      },
      pageIndex:1,
      pageSize:10,
      totalCount:0
    };
  },
  computed: {},
  watch: {
    selectArea: {
      handler(val) {
        this.getTaskDisposeSituation()
      }
    }
  },
  methods: {
    init(params){
      this.searchForm={...this.searchForm, ...params}
      this.getTaskSituation()
      this.getTaskState()
      this.getTaskDisposeSituation()
      //初始化数据
      this.selectArea = true
      this.pageIndex = 1
      this.totalCount = 0
    },

    //工单基础数据
    getTaskSituation(){
      
     
      let params={
        data:{
          companyId:this.companyId,
          areaId:this.searchForm.areaId,
          projectIds:this.searchForm.projectId,
          startTime:this.searchForm.startTime,
          endTime:this.searchForm.endTime,
        }
      }
      const gnArrow = (n) => (parseFloat(n) > 0 ? 'green' : parseFloat(n) < 0 ? 'red' : 'none')
      getTaskSituation(params).then(res =>{
        if(res.status=='200' && res.data != null){
          this.baseData[0].num = res.data?.totalCount ?? '0'
          const i0n = this.baseData[0].num2 = res.data?.totalCountRatio ?? '0.00%'
          this.baseData[0].icon = gnArrow(i0n)
          if(this.baseData[0].num2=='-') this.baseData[0].icon = 'none'

          this.baseData[1].num = res.data?.insideCount ?? '0'
          const i1n = this.baseData[1].num2 = res.data?.insideCountRatio ?? '0.00%'
          this.baseData[1].icon = gnArrow(i1n)

          this.baseData[2].num = res.data?.clientCount ?? '0'
          const i2n = this.baseData[2].num2 = res.data?.clientCountRatio ?? '0.00%'
          this.baseData[2].icon = gnArrow(i2n)

          this.baseData[3].num = res.data?.takeOrderRate ?? '0.00%'
          const i3n = this.baseData[3].num2 = res.data?.acceptTakeRateComparedLastMonth ?? '0.00%'
          this.baseData[3].icon = gnArrow(i3n)

          this.baseData[4].num = res.data?.taskFinishCount ?? '0'
          const i4n = this.baseData[4].num2 = res.data?.taskFinishCountRatio ?? '0.00%'
          this.baseData[4].icon = gnArrow(i4n)

          this.baseData[5].num = res.data?.taskCloseRate ?? '0.00%'
          const i5n = this.baseData[5].num2 = res.data?.taskCloseRateComparedLastMonth ?? '0.00%' 
          this.baseData[5].icon = gnArrow(i5n)
        }
      })
    },

    //工单状态占比
    getTaskState(){
      
      let params={
        data:{
          companyId:this.companyId,
          areaId:this.searchForm.areaId,
          projectIds:this.searchForm.projectId,
          startTime:this.searchForm.startTime,
          endTime:this.searchForm.endTime,
        }
      }
      getTaskState(params).then(res =>{
        if(res.status=='200'){
          let list = res.data
          let Arr = []
          let sortName = [i18n.t('待派单'), i18n.t('待接单'), i18n.t('处理中'), i18n.t('待确认'), i18n.t('已关闭')];
          if(list.length>0){
            sortName.forEach(item =>{
              let info = list.filter(f => { return f.key == item })?.[0] ?? { key: item, value: '0%' };
              Arr.push({ name: info.key,labelText:info.value, value:Number(removePercentage(info.value))});
            })
            
            let myRes = {
            series: [
              {
                data: Arr
              }
            ]
          };
          this.chartData =JSON.parse(JSON.stringify(myRes));
          }else{
            this.getServerData()
          }
         
        }
      })
    },

    // 工单处理情况
    getTaskDisposeSituation(){
      let params={
        data:{   
          companyId:this.companyId,
          areaId:this.searchForm.areaId,
          projectIds:this.searchForm.projectId,
          startTime:this.searchForm.startTime,
          endTime:this.searchForm.endTime,
          sign: this.selectArea ? "0" : "1" //排行榜标记 0 --区域  1-- 项目
        }
      }
      this.column[1].label = this.selectArea ? i18n.t('区域')  : i18n.t('项目') ;
      getTaskDisposeSituation(params,this.pageSize,this.pageIndex).then(res =>{
        if(res.status=='200'){
          let list = res.data.records
          list.forEach(item => {
            item.areaName = this.selectArea ? item.areaName : item.projectName
            item.num1 = item.totalNum
            item.num2 = item.finishNum
            item.num3 = item.finishRate
          });
          
          this.tableData = list
        }else{
          this.tableData = []
          this.totalCount = 0
        }
      })
    },

    toDetail(){
      uni.navigateTo({
        url: i18n.t('/pages-kanban/kanban/tableDetail?type=gdclqk&title=工单处理情况')
      })
    },

    nextPage(){
      if(this.totalCount>this.pageIndex*this.pageSize){
        this.pageIndex++
        this.getTaskDisposeSituation()
      }else{
        uni.showToast({
          title: i18n.t('没有下一页数据！'),
          icon: 'none',
        }) 
      }

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
                let taks = [
                    { "name": i18n.t('待派单'), "value": 0, legendShape: 'square' },
                    { "name": i18n.t('待接单'), "value": 0, legendShape: 'square' },
                    { "name": i18n.t('处理中'), "value": 0, legendShape: 'square' },
                    { "name": i18n.t('待审核'), "value": 0, legendShape: 'square' },
                    { "name": i18n.t('待确认'), "value": 0, legendShape: 'square' },
                    { "name": i18n.t('已关闭'), "value": 0, legendShape: 'square' }
                ]
                let res = {
                    series: [
                        {
                            data:  []
                        }
                    ]
                };

                this.chartData = JSON.parse(JSON.stringify(res));
                console.log(371,this.chartData)
            }, 500);
        },
  },
  created() {

  },
  mounted() {
  },
}
</script>
<style scoped lang="scss">
@import url(./css/kanban.sass);

.content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20rpx;

  .content-item {
    background: #F8F8F8;
    padding: 20rpx;

    .text-grey {
      font-size: 20rpx;
      color: #666666;
    }

    .text-lightgrey {
      font-size: 20rpx;
      color: #999999;
    }

    .text-bold {
      font-size: 40rpx;
      font-family: 'DIN';
      font-weight: bold;
      color: #333333;
    }

    .green {
      font-size: 20rpx;
      color: #00B377;
    }

    .red {
      font-size: 20rpx;
      color: #E71E1E;
    }
    .none{
      color: #999999;
    }

  }
}
.btn-next{
  padding: 0 10rpx;
}

.text-green {
  font-size: 20rpx;
  color: #9EA7B4;
}
</style>