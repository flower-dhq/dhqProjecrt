<template>
    <div v-if="isVisible" class="full-screen-modal">
        <Card class="modal-content">
          <template #title>
            <div class="title">审阅</div> 
          </template>
          <div class="column">
            <div class="row">
              <div class="left-td">审阅结果</div>
              <div class="right-td">
                <RadioGroup v-model="approveFlag">
                  <Radio label="1">审阅通过</Radio>
                  <Radio label="2">审阅驳回</Radio>
                </RadioGroup>
              </div>
            </div>
            <div class="row bottom-line" >
              <div class="left-td">审阅描述</div>
              <div class="right-td" >
                <Input v-model="approveOpinion" maxlength="500" show-word-limit type="textarea" placeholder="审阅描述" style="width: 580px;" rows="5" />
              </div>
            </div>
            <div class="buttonRow">
              <Button style="margin: 10px;" @click="$emit('cancel')">取消</Button>
              <Button type="primary" style="margin: 10px;" @click="submit">提交</Button>
            </div>
          </div>
          <!-- <table>
            <tr>
              <td class="left-td">审阅结果</td>
              <td class="right-td">
                <RadioGroup v-model="formData.approveFlag">
                  <Radio label="1">审阅通过</Radio>
                  <Radio label="2">审阅驳回</Radio>
                </RadioGroup>
              </td>
            </tr>
            <tr style="height:100px">
              <td class="left-td">审阅描述</td>
              <td class="right-td" >
                <Input v-model="formData.approveOpinion" type="textarea" placeholder="审阅描述" style="width: 200px" />
              </td> 
            </tr>
          </table> -->
        </Card>
    </div>
</template>

<script>
  import {approveShifting} from '@/service/landcrm';
  export default {
    props: ['isVisible', 'id'],
    data(){
      return {
        approveFlag:"1",//审批状态(1 --审阅通过  2 审阅拒绝)
        approveOpinion:"",//审阅说明
      }
    },
    watch:{
      isVisible(){
        this.approveFlag = "1"
        this.approveOpinion = ""
      }
    },
    methods:{
      submit(){
        if(this.approveFlag == "2" && !this.approveOpinion){
          this.$Message.error("请填写审阅说明")
          return;
        }
        const { USER_INFO } = window.GlobalProperties.$constant || {};
        const { storageAction } = window.GlobalProperties.$utils || {};
        const { userid ,userName } = storageAction({ action: 'get', key: USER_INFO }) || {};
        let parm = {
              data: {
               id : this.id,
               approveUserId: userid,//审阅人id
               approveUserName:userName,//审阅人
               approveFlag:this.approveFlag,
               approveOpinion:this.approveOpinion
              } ,
              responseToast: false
            }
        approveShifting(parm).then(res=>{
          if(res.status == '200'){
            this.$emit('success',res.message)
          }
        })
        
      }
    }
  }
  
</script>

<style lang="scss" scoped>
  .full-screen-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  }
  .modal-content {
   
    background-color: white;
  }
  .column{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .row{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
  }
  .buttonRow{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: stretch;
  }
  .left-td{
    width: 100px;
    line-height: 40px;
    border-top:1px solid rgb(236,236,236) ;
    border-left:1px solid rgb(236,236,236) ;
    background-color: rgb(248,249,251);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right-td{
    width: 600px;
    line-height: 40px;
    border-top:1px solid rgb(236,236,236) ;
    border-left:1px solid rgb(236,236,236) ;
    border-right:1px solid rgb(236,236,236) ;
    padding-left: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
  }
  .bottom-line{
    border-bottom:1px solid rgb(236,236,236) ;
  }
  .right-line{
    border-right:1px solid rgb(236,236,236) ;
  }
</style>