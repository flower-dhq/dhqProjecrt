<template>
  <!-- 公物交接 -->
  <!-- 详情 -->
 <div style="margin-top: 12px;" >
    <div class="leftline"></div><span class="titles">交接情况</span>
    <table style="margin-top: 14px;">
      <tr>
        <td class="top-td" style="border-left:1px solid rgb(236,236,236);width: 25%;border-right:1px solid rgb(236,236,236);width:25%">交班发生情况</td>
        <td class="titlestd" colspan="3" >{{handSituation}}</td>
       </tr>
       <tr>
         <td class="top-td" style="border-left:1px solid rgb(236,236,236);border-right:1px solid rgb(236,236,236);width:25%">交班处理结果</td>
         <td class="titlestd" colspan="3" >{{handResult}}</td>
        </tr>
      <tr>
        <td class="top-td" style="border-left:1px solid rgb(236,236,236);width: 25%;border-right:1px solid rgb(236,236,236);width:25%">接班发生情况</td>
        <td class="titlestd" colspan="3" >{{takeSituation}}</td>
       </tr>
       <tr>
         <td class="top-td" style="border-left:1px solid rgb(236,236,236);border-right:1px solid rgb(236,236,236);width:25%">接班处理结果</td>
         <td class="titlestd" colspan="3" >{{takeResult}}</td>
        </tr>
       <tr>
         <td class="top-td" style="border-left:1px solid rgb(236,236,236);border-right:1px solid rgb(236,236,236);width:25%;">交班人员签名</td>
         <td class="titlestd">
          <div class="imageClass">
            <img :src="handSign" style="width: 120px;height: 60px;" v-if="handSign" @click="openimg(handSign)"/>
          </div>
         </td>
         <td class="top-td" style="width:25%;">交班打卡</td>
         <td class="titlestd" >
          <div class="imageClass">
            <img :src="handFace" style="width: 120px;height: 60px;" v-if="handFace" @click="openimg(handFace)"/>
          </div>
         </td>
        </tr>
       <tr class="tr">
         <td class="top-td" style=" border-left:1px solid rgb(236,236,236);border-right:1px solid rgb(236,236,236);width:25%;">接班人员签名</td>
         <td class="titlestd">
          <div class="imageClass">
            <img :src="takeSign" style="width: 120px;height: 60px;" v-if="takeSign" @click="openimg(takeSign)"/>
          </div>
         </td>
         <td class="top-td" style="width:25%;">接班打卡</td>
         <td class="titlestd">
          <div class="imageClass">
            <img :src="takeFace" style="width: 120px;height: 60px;" v-if="takeFace" @click="openimg(takeFace)"/>
          </div>
         </td>
        </tr>
    </table>
  </div>
</template>

<script setup>
  import { ref, onMounted,onBeforeMount ,computed ,defineProps} from 'vue'
  const props = defineProps({
    stage: String,
    payload: Object,
    specialtyCode: String,
    shiftingStatusFlag:String,
  }) 
  console.log(176,props,props.payload)
  let handSituation = ref('')
  let handResult = ref('')
  let takeSituation = ref('')
  let takeResult = ref('')
  let handSign = ref('')
  let handFace = ref('')
  let takeSign = ref('')
  let takeFace = ref('')
	  const openimg = (url)=>{
	    window.open(url)
	  }
    onMounted( ()=>{
      console.log(237, props.payload)
      handSituation.value = props.payload.handSituation ? props.payload.handSituation : ''//交班发生情况
      handResult.value = props.payload.handResult ? props.payload.handResult : ''//结果
      takeSituation.value = props.payload.takeSituation ? props.payload.takeSituation : ''//接班发生情况
      takeResult.value = props.payload.takeResult ? props.payload.takeResult : ''//结果
      handFace.value = props.payload.handFaceForm?.filePath ? props.payload.handFaceForm.filePath : ''
      handSign.value = props.payload.handSignature?.value ? props.payload.handSignature.value : ''
      takeFace.value = props.payload.takeFaceForm?.filePath ?props.payload.takeFaceForm.filePath :''
      takeSign.value = props.payload.takeSignature?.value ? props.payload.takeSignature.value : ''

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

<style scoped>

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
    vertical-align: middle;
  }
  .titlestd{
    width: 25%;
    line-height: 40px;
    max-width: 250px;
    border-top:1px solid rgb(236,236,236) ;
    border-right:1px solid rgb(236,236,236) ;
    text-align: center;
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
  .pre{
    background-color: white;
    border: none;
    color: #333333;
    font-size: 13px;
    font-family: Microsoft YaHei;
  }
  .imageClass{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
  }

</style>
