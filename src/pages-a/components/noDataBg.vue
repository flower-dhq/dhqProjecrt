<template>
  <div class="page">
    <div v-if="showTopLine" class="top_line" :style="{backgroundColor:color}"></div>
    <div class="page_box">
      <img alt="" />
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script>
import { controlFunction } from "@/assets/js/mixin";
export default {
  mixins: [controlFunction],
  props:{
    showTopLine:{
      type:Boolean,
      default:false
    },
   	color:{
    		type: String,
    		default: "#F5F5F5"
    	}
  }, 
  created() {
    this.addcolor();
  },
};
</script>

<style scoped lang="scss" >
.page{
  height: 100%; 
  background-color: #ffffff;

} 
.top_line{
    height: 10px; 

}
.page_box {
  background-color: #ffffff;
  width: 100%;
  padding-top: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  img {
    content: var(--no-data-img);
    width: 175px;
    height: 175px;
  }
}
</style>