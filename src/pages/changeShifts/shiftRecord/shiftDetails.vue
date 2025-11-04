<template>
  <div class="add-page">
    <Card dis-hover class="back">
      <div style="display: flex;justify-content: space-between;border-bottom: 1px solid #e4e4e4;margin-bottom: 20px;padding-bottom: 12px;font-size: 16px;align-items: center;">
        <p slot="title">详情</p>
        <div slot="extra" v-if="type == 'sy' && changeType">
           <Button label="small" style="margin-right: 10px;margin-top: -5px;" @click="close">返回</Button>
           <Button  label="small" type="primary" v-show="formData.approveFlag != '审阅通过' && formData.approveFlag != '审阅驳回'" style="margin-top: -5px;" @click="showModal">审阅</Button>
         </div>
      </div>
      
     <table>
        <tr>
          <td class="left-td">区域</td>
          <td class="right-td">{{formData.areaName}}</td>
          <td class="left-td">项目</td>
          <td v-if="id" class="right-td" style="border-right:1px solid rgb(236,236,236)">{{formData.projectName}}</td>
        </tr>
        <tr>
          <td class="left-td">岗位</td>
          <td class="right-td">{{formData.post}}</td>
          <td class="left-td">交班人员</td>
          <td class="right-td" style="border-right:1px solid rgb(236,236,236)">{{formData.turnOverUserName}}
          </td>
        </tr>
        <tr>
          <td class="left-td">交班时间</td>
          <td class="right-td">{{formData.turnOverTime}} </td>
          <td class="left-td">接班人员</td>
          <td class="right-td" style="border-right:1px solid rgb(236,236,236)">{{formData.takeOverUserName}}</td>
        </tr>
        <tr class="tr">
          <td class="left-td">接班时间</td>
          <td class="right-td">{{formData.takeOverTime}}</td>
          <td class="left-td">交接渠道</td>
          <td class="right-td" style="border-right:1px solid rgb(236,236,236)">{{formData.originSystem}}</td>
        </tr>
      </table>
      <!-- 公物交接 -->
      <item-property :payload="shiftingMainInfo" v-if="shiftingMainInfo && showState" :shiftingStatusFlag="formData.shiftingStatusFlag" :stage="stage"  :specialtyCode="specialtyCode"></item-property>
      <!-- 交接情况 -->
      <item-Handover :payload="shiftingMainInfo" v-if="shiftingMainInfo && showState" :shiftingStatusFlag="formData.shiftingStatusFlag"  :specialtyCode="specialtyCode"></item-Handover>
      <!-- 审阅详情 -->
      <div style="margin-top: 12px;margin-bottom: 30px;">
        <div class="leftline"></div><span class="titles">审阅详情</span>
        <table style="margin-top: 14px;">
           <tr>
             <td class="left-td" style="border-bottom:1px solid rgb(236,236,236)">审阅状态</td>
             <td class="right-td" style="border-bottom:1px solid rgb(236,236,236)">{{formData.approveFlag}}
             <span v-if="formData.approveTimeoutFlagText" style="padding: 3px 6px;border: 1px solid red;color: red;font-size: 10px;border-radius: 5px;margin-left: 10px;">{{ formData.approveTimeoutFlagText }}</span>
             </td>
             <td class="left-td" style="border-bottom:1px solid rgb(236,236,236)">审阅描述</td>
             <td class="right-td" style="border-bottom:1px solid rgb(236,236,236)">{{formData.approveOpinion}}</td>
            </tr>
            <tr>
             <td class="left-td" style="border-bottom:1px solid rgb(236,236,236)">审阅人员</td>
             <td class="right-td" style="border-right:1px solid rgb(236,236,236);border-bottom:1px solid rgb(236,236,236)">{{formData.approverName}}</td>
             <td class="left-td" style="border-bottom:1px solid rgb(236,236,236)">审阅时间</td>
             <td class="right-td" style="border-right:1px solid rgb(236,236,236);border-bottom:1px solid rgb(236,236,236)">{{formData.approveTime}}</td>
           </tr>
         </table>
      </div>
    </Card>
    <ShiftReviewModal :isVisible="isShowModal" :id="id" @success="submitSuccess" @cancel="isShowModal=false"></ShiftReviewModal>
  </div>
</template>

<script setup>
  import ViewUIPlus from 'view-ui-plus';
  import { ref, onMounted,onBeforeMount } from 'vue';
  import ItemHandover from '../components/item-Handover.vue'
  import ItemProperty from '../components/item-property.vue'
  //在需要接收的页面，引入API useRoute
  import { useRoute } from "vue-router";
  const route = useRoute();
import { getShiftingRecordDetail,approveShifting} from '@/service/landcrm';
  import ShiftReviewModal from './shiftReviewModal.vue';

  let formData = ref({
          post:'客服',
          turnOverUserName:localStorage.user_name
        })
  let  showState = ref(false)
  let  type = ref('')
  let  shiftingMainInfo = ref({})
  let  id = ref('')
  let  loading = ref(true)
  let  specialtyCode = ref('1')
  let changeType = ref(true)
  let isShowModal = ref(false);
   const getDetail = () => {
        loading.value = true;
        let id = route.query.id?route.query.id:''
        getShiftingRecordDetail(id).then(res => {
          loading.value = false;
          if(res.status==200){
            formData.value = res.data
            shiftingMainInfo.value = JSON.parse(res.data.shiftingMainInfo)
            console.log(145,shiftingMainInfo.value)
           showState.value = true
            }
          })
   }
  const showModal = ()=>{
    isShowModal.value = true   
  }
  function submitSuccess(message){
    ViewUIPlus.Message['success']({
      content: message
    })
    changeType.value = false
    isShowModal.value = false
    getDetail()
  }
  const toApproveShifting = () =>{
    const { USER_INFO } = window.GlobalProperties.$constant || {};
    const { storageAction } = window.GlobalProperties.$utils || {};
    const { userid ,userName } = storageAction({ action: 'get', key: USER_INFO }) || {};
    let parm = {
              data: {
               id : id.value,
               approveFlag: '1', //1--通过 2-- 拒绝
               approveUserId: userid,//审阅人id
               approveUserName:userName//审阅人
              } ,
              responseToast: false
            }
      approveShifting(parm).then(res=>{
        console.log(109,res)
        if(res.status == '200') {
          console.log(110)
          ViewUIPlus.Message['success']({
                   content: res.message
                })
          changeType.value = false
          getDetail()
        }
      })
      
  }
  const close = () => {
    window.close();
  }
   onMounted(()=>{
      id.value = route.query.id ? route.query.id :''
      type.value = route.query.type ? route.query.type:'';
      console.log(310,id,type)
      if(route.query.type == 'xq'){
        type.value = 'id'//详情
      }else if(route.query.type == 'sy'){
        type.value = 'sy'//接班
      }
      // getDetail();
      // this.loadAreaList()
   })

   onBeforeMount(() => {
    getDetail();
});

</script>

<style lang="scss" scoped>
  .add-page {
    background-color: #F4F6FA;
    height: 100%;
    width: 100%;
    padding: 20px 0;
    overflow-y: scroll;
  }

  .back {
    width: 80%;
    border-radius: 3px;
    margin: auto;
  }
  :deep(.ivu-card) {
    font-size: 13px;
  }
  .back :deep(.ivu-card-body) {
    padding: 15px 15px 0 15px;
  }


  .back > header {
    height: 15%;
    font-size: 18px;
  }
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
    vertical-align: middle;
  }
  .right-td{
    width: 18.333%;
    height: 40px;
    line-height: 40px;
    max-width: 250px;
    border-top:1px solid rgb(236,236,236) ;
    border-left:1px solid rgb(236,236,236) ;
    text-align: center;
    padding-left: 10px;
    vertical-align: middle;
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

</style>
