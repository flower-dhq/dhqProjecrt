<template>
  <view class="data-chart-box">
    <title-box :title="title" @toDetail='toDetail'></title-box>
    <data-list :list='itemList'></data-list>
    <uchart-box ref="uchartBox" :title="chartTitle" :canvasId="canvasId" :optionData="optionData" :reportType="reportType" :optsType="optsType"></uchart-box>
  </view>
</template>
<script>
import DataList from './data-list.vue'
import titleBox from './title-box.vue'
import uchartBox from './uchart-box.vue'
export default {
  components:{
    titleBox,
    uchartBox,
    DataList
  },
  props:{
    title:{
      type:String,
      default:''
    },
    chartTitle:{
      type:String,
      default:''
    },
    canvasId:{
      type:String,
      default:''
    },
    itemList:{
      type:Array,
      default:() =>[]
    },
    optionData:{
      type:Object,
      default:() =>{}
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
  methods:{
    toDetail(){
      let code=0
      if(this.canvasId=='orderSituation'){
        code=0
      }else if(this.canvasId=='comprehensivePatrol'){
        code=1
      }else if(this.canvasId=='devicePatrol'){
        code=2
      }else if(this.canvasId=='charge'){
        code=3
      }
      this.$emit('jumpDetail',code)
    }
  }

}
</script>
<style lang="scss" scoped>
.data-chart-box{
  border-radius: 12rpx;
  background-color: #fff;
}
</style>