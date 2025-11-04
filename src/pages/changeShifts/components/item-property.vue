<template>
  <!-- 公物交接 -->
  <!-- 详情 -->
 <div style="margin-top: 12px;">
    <div class="leftline"></div><span class="titles">公物交接</span>
    <table style="margin-top: 14px;">
      <tr>
        <td class="top-td">物品</td>
        <td class="top-td">数量</td>
        <td class="top-td">交接状态</td>
        <td class="top-td">异常备注</td>
        <td class="top-td" style="border-right:1px solid rgb(236,236,236)">照片</td>
      </tr>
    </table>
    <Row >
        <Col span="24" style="width: 100%;" v-for="(item, index) in payloaddata" :key="index" v-if="payloaddata.length>0">
           <table>
             <tr>
               <td class="titlestd" style="border-left:1px solid rgb(236,236,236)">{{item.elementContent}}</td>
               <td class="titlestd">{{item.value}}</td>
               <td class="titlestd" >
                 <span v-if="item.switch">正常</span>
                 <span v-if="!item.switch">异常</span>
                 </td>
               <td class="titlestd" v-if="item.switch">-</td>
               <td class="titlestd" v-if="!item.switch">{{item.remark}}</td>
               <td class="titlestd" style="border-right:1px solid rgb(236,236,236)">
                 <div   v-if="!item.switch&&item.picInfos&&item.picInfos.length>0" class="imageClass" v-for="(img,key) in item.picInfos" :key="key">
                 <img :src="img.filePath" style="width: 40px;height: 40px;float: left;margin-left: 5px;" @click="openimg(img.filePath)"/>
                </div>
                <div v-if="item.switch||(item.picInfos&&item.picInfos.length===0)">-</div>
              </td>
             </tr>
          </table>
        </Col>
        <div v-if="payloaddata.length===0" style="width: 100%; height: 40px;line-height: 40px;text-align: center;font-size: 12px;border: 1px solid rgb(236,236,236);border-bottom: 0px solid rgb(236,236,236);">
          暂无数据
        </div>
    </Row>
         <table>
           <tr class="tr">
               <td class="top-td" style="height: 100px;width: 20%;border-right:1px solid rgb(236,236,236);line-height: 100px;">交班照片</td>
               <td class="titlestd" style="border-right:1px solid rgb(236,236,236);width: 80%;" >
                 <div v-for="(img,key) in picInfos" class="imageClass" :key="key" v-if="picInfos.length>0">
                   <img :src="img.filePath" style="width: 50px;height: 50px;float: left;margin-left: 5px;" @click="openimg(img.filePath)"/>
                 </div>
               </td>
             </tr>
         </table>
  </div>
</template>

<script setup>
 import { ref, onMounted,onBeforeMount ,computed,defineProps} from 'vue'
  const props = defineProps({
    stage: String,
    payload: Object,
    specialtyCode: String,
    shiftingStatusFlag:String,
  }) 
 let  payloaddata = ref([])
 let  picInfos = ref([])
 const openimg=(url)=>{
        window.open(url)
      }

  onMounted(()=> {
    console.log(72,props.payload)
      payloaddata.value =  props.payload.children ? props.payload.children  : ''
      picInfos.value = props.payload.takePic ? props.payload.takePic : ''
  })
  const title = computed({
        get: () => {   
        },
        set: ( param ) => {  
          if(props.stage == 4){
            return '交接班详情'  
          }
        },
      })

</script>

<style scoped="">

  table{
    width: 100%;
  }
  .left-td{
    width: 15%;
    line-height: 40px;
    max-width: 250px;
    border-top:1px solid rgb(236,236,236) ;
    border-left:1px solid rgb(236,236,236) ;
    background-color: rgb(248,249,251);
    text-align: center;
  }
  .right-td{
    width: 35%;
    height: 40px;
    line-height: 40px;
    max-width: 250px;
    border-top:1px solid rgb(236,236,236) ;
    border-left:1px solid rgb(236,236,236) ;
    text-align: left;
    padding-left: 10px;
  }
  .tr>td{
    border-bottom:1px solid rgb(236,236,236)
  }
  .top-td{
    width: 20%;
    line-height: 40px;
    max-width: 250px;
    border-top:1px solid rgb(236,236,236) ;
    border-left:1px solid rgb(236,236,236) ;
    background-color: rgb(248,249,251);
    text-align: center;
  }
  .titlestd{
    width: 20%;
    line-height: 40px;
    max-width: 250px;
    border-top:1px solid rgb(236,236,236) ;
    border-right:1px solid rgb(236,236,236) ;
    text-align: center;
    vertical-align: middle;
    
  }
  .imageClass{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .leftline{
    width: 2px;
    height: 15px;
    background-color: rgb(24,144,255);
    position: relative;
    top: 10px;
  }
  .titles{
    position: relative;
    top: -5px;
    left: 12px;
    font-size: 15px;
  }

</style>
