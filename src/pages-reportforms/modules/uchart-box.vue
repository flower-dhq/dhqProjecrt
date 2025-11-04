<!--  -->
<template>
  <view class="box">
    <view class="subtitle">
      <text>{{title}}</text>
    </view>
    <view class="tel0">
      <qiun-data-charts
        :onmovetip="true"
        :ontouch="true"
        :canvas2d="true"
        :canvasId="canvasId"
        :type="optsType"
        :opts="opts"
        :chartData="chartData"
        :tooltipFormat="'percentage'"
      />
      <!-- tooltipFormat:'percentage' 此为提示框数据后加% -->
    </view>
  </view>
</template>

<script>
export default {
  props:{
    canvasId:{
      type:String,
      default:''
    },
    title:{
      type:String,
      default:''
    },
    optionData:{
      type:Object,
      default:()=>{}
    },
    optsType:{
      type:String,
      default:''
    },
    reportType:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      value: "",
      show: false,
      chartData: {},
      opts: {
        color: ["#FA6400", "#FAAD13","red"],
        padding: [15, 10, 0, 15],
        enableScroll: false,
        dataLabel: false,
        legend: {},
        xAxis: {
          fontSize: 10,
         
        },
        yAxis: {
          gridType: "solid",
          dashLength: 8,
          gridColor: "#F3F4F7",
          splitNumber: 5,
          data: [
            {
              unit: "%",
              type: "value",
              axisLine: false,
              position: "left",
              fontSize: 9,
              min: 0,
              max: 100,
            },
          ],
        },
        extra: {
          line: {
            type: "straight",
            width: 2,
            activeType: "solid",
          },
        },
      },
      mix:{
        color: ["#FA6400", "#FAAD13"],
        yAxis: {
          disabled: false,
          disableGrid: false,
          splitNumber: 5,
          gridType: "solid",
          dashLength: 4,
          gridColor: '#EAEAEA',
          // padding: 10,
          showTitle: false,
          data: [
           
            {
              position: "left",
              textAlign: "left",
              min: 0,
              max: 100,
              unit: '%',
              axisLine: false,
              fontSize: 9,
            },
            {
              type: 'value',
              position: "right",
              axisLine: false,
              fontSize: 9,
              max: 100,
            }
          ]
        },
        extra: {
          mix: {
            column: {
              width: 10
            }
          },
        }
      },
      column:{
        yAxis: {
          disabled: false,
          disableGrid: false,
          splitNumber: 5,
          gridType: "solid",
          dashLength: 4,
          gridColor: '#EAEAEA',
          // padding: 10,
          showTitle: false,
          data: [
            {
              position: "left",
              min: 0,
              max: 100,
              unit: '%',
              axisLine: false,
              fontSize: 9,
            }
          ]
        },
        extra: {
          column: {
            type: "group",
            width: 10,
            seriesGap:5
          }
        }
      }
    };
  },
  computed: {},
  watch: {
    'optionData':{
      handler: function (newVal) {
        this.getServerData()
      },
      immediate: true,
      deep: true
    },
  },
  onLoad() {},
  onShow() {},
  methods: {
    //计算最大值
    countMaxData(list){
      let max = Math.max.apply(null,list);
      let data = Math.ceil(max/100)*100
      if(data<100){
        data=100
      }
      return data
    },

    getServerData() {
      if(this.optsType && this.optsType!='line'){
        this.opts = {...this.opts,...this[this.optsType]}
      }
      if(this.optsType=='mix'){
        // 产品的逻辑：任务数量少于100时，每格间距为20（任务数量大于100少于200时，可用200除以5，为每格的间距，以此类推）
        let list = this.optionData.series[0].data
        let data = this.countMaxData(list)
        this.mix.yAxis.data[1].max=data
      }
      if(this.optsType=='column'){
        //设置y轴刻度
        let obj = {
          type: 'value',
          position: "right",
          axisLine: false,
          fontSize: 9,
          max: 100,
        }
        //计算最大值
        let maxArr = []
        this.optionData.series.forEach(item => {
          maxArr.push(item.data[0])
        });
        let max = this.countMaxData(maxArr)
        obj.max = max
        
        if(this.optionData.categories[0]=='任务完成数'){
          //综合巡检和设备巡检
          this.column.yAxis.data[1] = obj
        }else if(this.optionData.categories[0]=='收费记录数'){
          //收费
          obj.position = 'left'
          this.column.yAxis.data[0] = obj
        }
      }
      if(this.reportType == 1){
        this.opts.xAxis ={  
              fontSize: 10,        
              title:'日',
              titleFontSize:10,
              titleFontColor:'#666666'
        }
      }else if(this.reportType == 2){
        this.opts.xAxis={
          fontSize: 10,
          rotateLabel:true,
          rotateAngle:-45,
          lineHeight:40,
          marginTop:10
        }

      }else if(this.reportType == 3){
        this.opts.xAxis ={  
              fontSize: 10,        
              title:'月',
              titleFontSize:10,
              titleFontColor:'#666666'
        }
      }
      if(this.optsType=='line' && this.canvasId=='charge'){
        this.opts.yAxis={
          gridType: "solid",
          dashLength: 8,
          gridColor: "#F3F4F7",
          splitNumber: 5,
          data: [
            {
              type: "value",
              axisLine: false,
              position: "left",
              fontSize: 9,
            },
          ],
        }
      }
     
       this.chartData = JSON.parse(JSON.stringify(this.optionData));
    },
    confirm(val) {
      this.show = false;
      this.value = val[0];
    },
  },

  created() {},
  mounted() {
    let that = this;
    that.getServerData();
    this.countMaxData()
  },
};
</script>
<style scoped lang="scss">
.box {
  background-color: #ffffff;
  padding: 20rpx;
  margin: 0 20rpx;
  border-radius: 12rpx;
  box-sizing: border-box;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #222222;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 24rpx;
  color: #2761FF;
  padding: 0 6rpx;
}
// .box {
//   background-color: #ffffff;
//   padding: 10rpx 0 20rpx;
//   border-radius: 12rpx;
//   box-sizing: border-box;
// }

// .title {
//   font-size: 32rpx;
//   font-weight: bold;
//   color: #222222;
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 10px;
// }

// .subtitle {
//   font-size: 24rpx;
//   color: #2761FF;
//   padding: 20rpx 40rpx;
//   box-sizing: border-box;
// }

</style>