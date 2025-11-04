<template>
  <div>
    <Modal v-model="modal" width='1000px' :title="modalTiltle" :mask-closable="false" :footer-hide="pageType=='detail'">
      <Tabs v-if="pageType=='detail'" v-model="tab"  @on-click='changeTab'>
        <TabPane label="钥匙信息" name="tab1"></TabPane>
        <TabPane label="操作记录" name="tab2"></TabPane>
      </Tabs>
      <div v-if='tab=="tab1"' class="tabs-cont">
        <div>
          <div class="title">钥匙信息</div>
          <table class="gridTable">
            <tr>
              <th width="25%">区域名称</th>
              <td width="25%">{{ formData.areaName }}</td>
              <th width="25%">项目名称</th>
              <td width="25%">{{ formData.projectName }}</td>
            </tr>
            <tr v-if="pageType=='detail'">
              <th>业态</th>
              <td>{{ formData.keyClassify }}</td>
              <th>店铺位置</th>
              <td>{{ formData.address }}</td>
            </tr>
            <tr>
              <th>开锁位置</th>
              <td>{{ unlockLocation }}</td>
              <th v-if="pageType=='register'">可借数量</th>
              <td v-if="pageType=='register'">{{ couldBorrowNumber }}</td>
              <th v-if="pageType=='detail'">存放位置</th>
              <td v-if="pageType=='detail'">{{ formData.storageLocation }}</td>
            </tr>
            <tr v-if="pageType=='detail'">
              <th>借用状态</th>
              <td>{{ formData.keyBorrowerStatus==1 ? '待借用' : formData.keyBorrowerStatus==2 ? '已借出': formData.keyBorrowerStatus==3 ? '已归还':'' }}</td>
              <th></th>
              <td></td>
            </tr>
          </table>
            <div class="title padd-s">借用信息</div>
            <table class="gridTable">
            <tr >
              <th width="25%" :class="{'required':pageType=='register'}">用途</th>
              <td width="25%">
                <Input v-if="pageType=='register'" clearable v-model="formData.purposes" placeholder="请输入用途"></Input>
                <span v-else>{{ lendingInfo.purposes }}</span>
              </td>
              <th width="25%" :class="{'required':pageType=='register'}">借用人类型</th>
              <td width="25%">
                <i-Select filterable clearable v-if="pageType=='register'" v-model="formData.borrowerType" placeholder="请选择借用人类型">
                  <i-option v-for="item in borrowersType" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                </i-Select>
                <span v-else>{{ lendingInfo.borrowerType==1 ? '业主' : lendingInfo.borrowerType==2 ? '员工': lendingInfo.borrowerType==3 ? '其他':'' }}</span>
              </td>
            </tr>
            <tr>
              <th :class="{'required':pageType=='register'}">借用人姓名</th>
              <td>
                <Input v-if="pageType=='register'" clearable v-model="formData.borrowerName" placeholder="请输入借用人姓名"></Input>
                <span v-else>{{ lendingInfo.borrowerName }}</span>
              </td>
              <th :class="{'required':pageType=='register'}">借用人电话</th>
              <td>
                <Input v-if="pageType=='register'" clearable v-model="formData.borrowerPhoneNumber" placeholder="请输入借用人电话"></Input>
                <span v-else>{{ lendingInfo.borrowerPhoneNumber }}</span>
              </td>
            </tr>
            <tr>
              <th :class="{'required':pageType=='register'}">借用数量</th>
              <td>
                <InputNumber :min='1' @input="handleInput" v-if="pageType=='register'" style="width:100%" v-model="formData.keyBorrowerNumber" placeholder="请输入借用数量"></InputNumber>
                <span v-else>{{ lendingInfo.keyBorrowerNumber }}</span>
              </td>
              <th :class="{'required':pageType=='register'}">预计归还时间</th>
              <td>
                <DatePicker :options='options1' v-if="pageType=='register'" v-model="estimatedReturnTime" type="datetime" placeholder="请选择预计归还时间" />
                <span v-else>{{ lendingInfo.estimatedReturnTime }}</span>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan='3'>
                <Input v-if="pageType=='register'" :autosize="{minRows: 3,maxRows: 5}" maxlength="500" type="textarea" show-word-limit v-model="formData.remark" placeholder="请输入备注"></Input>
                <span v-else>{{ lendingInfo.remark }}</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <Table v-if="tab=='tab2'" border :columns="columns" :data="tableData"></Table>
      <template #footer>
		    <Button type="primary" @click="ok">确定</Button>
        <Button type="default" @click="cancel">取消</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import  { Message } from 'view-ui-plus'
import {
  getKeyInfoId,
  saveKeyLending,
  keyLendCondition,
  keyLendRecord
} from '@/service/officeSystem.js'

// 变量
let modal = ref(false);
let tab = ref('tab1');
let modalTiltle = ref('详情')
let pageType = ref('detail')
const borrowersType = ref([
  { name:'业主', id:1 },
  { name:'员工', id:2 },
  { name:'其他', id:3 },
]);
const columns = ref([
  { title: '钥匙状态', key:'keyStatus', align: 'center', width:130 },
  { title: '操作记录', key:'recordDesc',  align: 'center' },
  { title: '操作人员', key:'createBy',  align: 'center', width:130 },
  { title: '操作时间', key:'createTime',  align: 'center', width:180 },
]);
const tableData = ref([
  { value: '1' },
])
let formData = ref({
  areaId:'',
  areaName:'',
  projectId:'',
  projectName:'',
  purposes:'',
  borrowerName:'',
  keyBorrowerNumber:'',
  borrowerType:'',
  borrowerPhoneNumber:'',
  remark:'',
  keyId:''
})
let estimatedReturnTime = ref('');

let couldBorrowNumber = ref("") //可借数量
let unlockLocation = ref("") //开锁位置
let lendingInfo = ref({})
let lendingId = ref('')

let options1 = ref({
  disabledDate (date) {
    return date && date.valueOf() < Date.now() - 86400000;
  }
})

  //获取缓存数据
const { USER_INFO } = window.GlobalProperties.$constant || {};
const { storageAction } = window.GlobalProperties.$utils || {};
const { userid, companyId, userName } = storageAction({ action: 'get', key: USER_INFO }) || {};
  

// 方法
const ok=()=>{
  keyBorrowRegister()
};
const cancel=()=>{
  modal.value = false;
};

const handleOpen = ( type, title, id, id2 ) => {
  modalTiltle.value = title;
  modal.value = true;
  pageType.value = type;
  clearData()
  if(type=='register'){
    getKeyInfoById(id)
  }else if(type=='detail'){
    lendingId.value = id2
    keyLendCondDetail(id,id2)
  }
};

// 获取钥匙详情
const getKeyInfoById = (id) =>{
  let params = {
    data:{
      keyId: id
    }
  }
  getKeyInfoId(params).then(res =>{
    if(res.status=='200'){
      formData.value.areaId = res.data.areaId
      formData.value.areaName = res.data.areaName
      formData.value.projectId = res.data.projectId
      formData.value.projectName = res.data.projectName
      formData.value.keyId = res.data.keyId

      unlockLocation.value = res.data.unlockLocation
      couldBorrowNumber.value = res.data.couldBorrowNumber
    }
  })
};

// 借用登记
const keyBorrowRegister = () =>{
  let item = formData.value
  if(!item.purposes){
    Message.warning('请输入用途！')
    return
  }
  if(!item.borrowerType){
    Message.warning('请选择借用人类型！')
    return
  }
  if(!item.borrowerName){
    Message.warning('请输入借用人姓名！')
    return
  }
  if(!item.borrowerPhoneNumber){
    Message.warning('请输入借用人电话！')
    return
  }else{
    const reg = /^1[0-9]{10}$/;
    if(!reg.test(item.borrowerPhoneNumber)){
      Message.warning('请输入正确的手机号码！')
      return
    }
  }
  if(!item.keyBorrowerNumber){
    Message.warning('请输入借用人数量！')
    return
  }
  if(!estimatedReturnTime.value){
    Message.warning('请选择预计归还时间！')
    return
  }
  let params = {
    data: {
      ...formData.value,
      companyId,
      userName,
      estimatedReturnTime: formatDateTime(estimatedReturnTime.value),
      userId: userid
    }
  }
  saveKeyLending(params).then(res =>{
    if(res.status=='200'){
      Message.success('操作成功!')
      modal.value = false;
    }else{
      Message.error(res.message)
    }
  })
};

// 获取借用记录详情
const keyLendCondDetail = (id,id2) =>{
  let params = {
    data:{
      keyId: id,
      lendingId: id2,
      companyId
    }
  }
  keyLendCondition(params).then(res =>{
    if(res.status=='200'){
      lendingInfo.value = res.data[0]
      formData.value = res.data[1]
      unlockLocation.value = res.data[1].unlockLocation
    }
  })
};

//钥匙借用操作记录
const actionRecord = () =>{
  let params = {
    data:{
      lendingId:lendingId.value,
      companyId
    }
  }
  keyLendRecord(params).then(res =>{
    if(res.status=='200'){
      let list = res.data
      list.forEach(item => {
        switch(item.lendingStatus){
          case 1:
            item.keyStatus = '待借用';
            break;
          case 2:
            item.keyStatus = '已借出';
            break;
          case 3:
            item.keyStatus = '已归还';
            break;
        }
      });
      tableData.value = list
    }
  })
};

const formatDateTime = (date) => {
  if(!date) return ''
  let Y = date.getFullYear()  +  '-';
  let M  =  (date.getMonth()+1  <  10  ?  '0'+(date.getMonth()+1)  :  date.getMonth()+1)  +  '-';
  let D  =  (date.getDate()  <  10  ?  '0'+date.getDate()  :  date.getDate())  +  ' ';
  let h  =  (date.getHours()  <  10  ?  '0'+date.getHours()  :  date.getHours())  +  ':';
  var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
  let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
  let strDate = Y+M+D+h+m+s;
  return strDate;
}

//切换tab
const changeTab = (name) =>{
  tab.value = name
  if(name=='tab2'){
    actionRecord()
  }
};

// 初始化数据
const clearData = () =>{
  formData.value.areaId = ''
  formData.value.areaName = ''
  formData.value.projectId = ''
  formData.value.projectName = ''
  formData.value.purposes = ''
  formData.value.borrowerName = ''
  formData.value.keyBorrowerNumber = ''
  formData.value.borrowerType = ''
  formData.value.borrowerPhoneNumber = ''
  estimatedReturnTime.value = ''
  formData.value.remark = ''
  formData.value.keyId = ''
  tab.value = 'tab1'
}

//检验输入
const handleInput=(event) => {  
  const value = event.target.value;  
  // 使用正则表达式检查是否为正整数
  if (!/^[1-9]\d*$/.test(value)) {  
    // 如果不是正整数，则清除非数字字符  
    formData.value.keyBorrowerNumber = value.replace(/\D/g, '');  
  } else {  
    formData.value.keyBorrowerNumber = value;  
  }
} 

defineExpose({
  handleOpen
}) 

</script>

<style lang="scss" scoped>
@import "@/assets/style/table-common.scss";
.title{
  display: flex;
  align-items: center;
  padding: 0 7px 10px;
}
.padd-s{
  padding-top: 10px;
}
.title::before{
  content: '';
  display: inline-block;
  position: relative;
  left: -7px;
  top: 0;
  height: 20px;
  width: 4px;
  background-color: #2d8cf0;
}

</style>