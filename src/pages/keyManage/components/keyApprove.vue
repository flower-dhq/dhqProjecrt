<template>
  <div>
    <Modal v-model="modal" width='700px' title="借用审批" @on-cancel="cancel" :mask-closable="false">
      <div>
        <div>
          <table class="gridTable">
            <tr>
              <th width="30%" class="required">审批结果</th>
              <td width="70%">
                <RadioGroup v-model="formData.auditStatus">
                  <Radio :label="2">通过</Radio>
                  <Radio :label="3">驳回</Radio>
                </RadioGroup>
              </td>
            </tr>
            <tr>
              <th>审批描述</th>
              <td>
                <Input v-model="formData.recordDesc" type="textarea" :rows="4" placeholder="请输入审批描述" />   
              </td>
            </tr>
          </table>
        </div>
      </div>
      <template #footer>
		    <Button type="primary" @click="ok"> 提交 </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import  { Message, Spin } from 'view-ui-plus'
import {
  keyLendingAudit
} from '@/service/officeSystem.js'

const emit = defineEmits(["getTableList"])

let modal = ref(false)

let formData = ref({
  lendingId:'',
  auditStatus:2, //审核状态(2 .通过 3. 驳回)
  recordDesc:'',
})

  //获取缓存数据
const { USER_INFO } = window.GlobalProperties.$constant || {};
const { storageAction } = window.GlobalProperties.$utils || {};
const { userid, companyId, userName } = storageAction({ action: 'get', key: USER_INFO }) || {};

// 方法
const ok=()=>{
  approveSave()
};
const cancel=()=>{};

const handleOpen = (id) => {
  clearData()
  modal.value = true
  formData.value.lendingId = id
};

// 审批操作
const approveSave = () =>{
  Spin.show();
  let params ={
    data:{
      ...formData.value,
      companyId,
      userName,
      userId: userid
    }
  }
  keyLendingAudit(params).then(res =>{
    Spin.hide();
    if(res.status=='200'){
      Message.success('操作成功！')
      emit("getTableList")
      modal.value = false
    }else{
      Message.error(res.message)
    }
  })
}

const clearData = () =>{
  formData.value.lendingId = ''
  formData.value.auditStatus = 2
  formData.value.recordDesc = ''
}

defineExpose({
  handleOpen
}) 

</script>

<style lang="scss" scoped>
@import "@/assets/style/table-common.scss";
</style>