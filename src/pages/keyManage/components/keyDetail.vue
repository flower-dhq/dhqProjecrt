<template>
  <div>
    <Modal :class="{'modal-box':pageType=='detail'}" v-model="modal" width='1000px' :title="modalTiltle" :ok-text="pageType=='detail'?'编辑':'确定'" :mask-closable="false" :footer-hide="tab=='tab2'">
      <Tabs v-if="pageType!='add'" v-model="tab"  @on-click='changeTab'>
        <TabPane label="钥匙信息" name="tab1"></TabPane>
        <TabPane v-if="pageType=='detail'" label="借用历史" name="tab2"></TabPane>
      </Tabs>
      <div v-if='tab=="tab1"' class="tabs-cont">
        <table class="gridTable">
          <tr>
            <th width="25%" :class="{'required': pageType=='add'}">区域名称</th>
            <td width="25%">
              <i-Select filterable label-in-value @on-change='getProjectData' v-if="pageType=='add'" v-model="formData.areaId" placeholder="请选择区域">
                <i-option v-for="item in areaList" :value="item.areaId" :key="item.areaId">{{ item.areaName }}</i-option>
              </i-Select>
              <span v-else>{{ formData.areaName }}</span>
            </td>
            <th width="25%" :class="{'required': pageType=='add'}">项目名称</th>
            <td width="25%">
              <i-Select filterable v-if="pageType=='add'" label-in-value @on-change='changeProject' v-model="formData.projectId" placeholder="请选择项目">
                <i-option v-for="item in projectList" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</i-option>
              </i-Select>
              <span v-else>{{ formData.projectName }}</span>
            </td>
          </tr>
          <tr>
            <th :class="{'required': pageType=='add'}">业态</th>
            <td>
              <i-Select filterable v-if="pageType=='add'" v-model="formData.keyClassify" placeholder="业态" @on-change='changeKeyStatus'>
                <i-option v-for="item in propertyStatusList" :value="item" :key="item">{{ item }}</i-option>
              </i-Select>
              <span v-else>{{ formData.keyClassify }}</span>
            </td>
            <th :class="{'required': pageType=='add'&& formData.keyClassify!='其他'}">
              <span v-if="formData.keyClassify!='其他'">
                {{ formData.keyClassify=='商铺' ? '商铺' : '房间 '}}位置
              </span>
            </th>
            <td>
              <i-Select v-if="pageType=='add' && formData.keyClassify!='其他'" filterable label-in-value @on-change='changeRoom' v-model="formData.addrId" placeholder="请选择房间位置">
                <i-option v-for="item in roomList" :value="item.houseAddrInfoId" :key="item.houseAddrInfoId">{{ item.roomInfo }}</i-option>
              </i-Select>
              <span v-if="pageType!='add' && formData.keyClassify!='其他'">{{ formData.address }}</span>
            </td>
          </tr>
          <tr>
            <th class="required">开锁位置</th>
            <td>
              <Input v-if="pageType!='detail'" v-model="formData.unlockLocation" placeholder="请输入开锁位置"></Input>
              <span v-else>{{ formData.unlockLocation }}</span>
            </td>
            <th class="required">托管人</th>
            <td>
              <Input v-if="pageType!='detail'" v-model="formData.custodianName" placeholder="请输入托管人"></Input>
              <span v-else>{{ formData.custodianName }}</span>
            </td>
          </tr>
          <tr>
            <th class="required">联系电话</th>
            <td>
              <Input v-if="pageType!='detail'" v-model="formData.custodianPhoneNumber" placeholder="请输入联系电话"></Input>
              <span v-else>{{ formData.custodianPhoneNumber }}</span>
            </td>
            <th class="required">存放位置</th>
            <td>
              <Input v-if="pageType!='detail'" v-model="formData.storageLocation" placeholder="请输入存放位置"></Input>
              <span v-else>{{ formData.storageLocation }}</span>
            </td>
          </tr>
          <tr>
            <th class="required">数量</th>
            <td>
              <InputNumber :min='1' @input="handleInput" v-if="pageType!='detail'" style="width:100%" v-model="formData.keyNumber" placeholder="请输入数量"></InputNumber>
              <span v-else>{{ formData.keyNumber }}</span>
            </td>
            <th>商户号</th>
            <td>
              <Input v-if="pageType!='detail'" v-model="formData.merchantNumber" placeholder="请输入商户号"></Input>
              <span v-else>{{ formData.merchantNumber }}</span>
            </td>
          </tr>
          <tr>
            <th>品牌名称</th>
            <td>
              <Input v-if="pageType!='detail'" v-model="formData.productBranding" placeholder="请输入品牌名称"></Input>
              <span v-else>{{ formData.productBranding }}</span>
            </td>
            <th>
              <span v-if="pageType=='detail'">已借出数</span>
            </th>
            <td>
              <span v-if="pageType=='detail'">{{ formData.alreadyBorrowNumber }}</span>
            </td>
          </tr>
          <tr>
            <th>备注</th>
            <td colspan='3'>
              <Input v-if="pageType!='detail'" :autosize="{minRows: 3,maxRows: 5}" maxlength="500" type="textarea" show-word-limit  v-model="formData.remark" placeholder="请输入"></Input>
              <span v-else>{{ formData.remark }}</span>
            </td>
          </tr>
        </table>
      </div>
      <Table :loading='loading' v-if="tab=='tab2'" border :columns="columns" :data="tableData"></Table>
      <Page v-if="tab=='tab2'" :total="total" v-model='current' :pageSize='pageSize' @on-change="changePage" class="page-box" show-total />
      <template #footer>
		    <Button type="primary" @click="ok"> {{ pageType=='detail' ? "编辑" : "确定" }} </Button>
        <Button type="default" v-if="pageType=='edit'" @click="cancel">取消</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import  { Message } from 'view-ui-plus'
import {
  getAreaLists,
  getProjectList,
  getHouseAddrInfoListToPage
} from '@/service/landcrm'
import {
  addKeyInfo,
  getKeyInfoId,
  upDateKeyInfo,
  keyLendHistory
} from '@/service/officeSystem.js'
const emit = defineEmits(["getTableList"])
// 变量
let modal = ref(false);
let tab = ref('tab1');
let modalTiltle = ref('详情');
let pageType = ref('add');
const propertyStatusList = ref([ '商铺', '住宅', '写字楼', '其他' ]);
const columns = ref([
  { title: '钥匙状态', key:'keyBorrowerStatusText', align: 'center' },
  { title: '借用人类型', key:'borrowerTypeText',  align: 'center' },
  { title: '借用人姓名', key:'borrowerName',  align: 'center' },
  { title: '借用人电话', key:'borrowerPhoneNumber',  align: 'center' },
  { title: '用途', key:'purposes',  align: 'center' },
  { title: '借出时间', key:'borrowerTime',  align: 'center' },
  { title: '归还时间', key:'returnTime',  align: 'center' },
]);

const tableData = ref([]);

let areaList = ref([]);
let projectList = ref([]) ;
let roomList = ref([]) ;
let total = ref(0) ;
let current = ref(1) ;
let pageSize = ref(10) ;
let loading = ref(false)

let formData = ref({
  areaId: '',
  areaName: '',
  projectId: '',
  projectName: '',
  keyClassify: '',
  address: '',
  addrId:'',
  unlockLocation: '',
  custodianName: '',
  custodianPhoneNumber: '',
  storageLocation: '',
  keyNumber: 1,
  merchantNumber: '',
  productBranding: '',
  remark: '',
});
let keyId = ref('')

//获取缓存数据
const { USER_INFO } = window.GlobalProperties.$constant || {};
const { storageAction } = window.GlobalProperties.$utils || {};
const { userid, companyId, userName } = storageAction({ action: 'get', key: USER_INFO }) || {};

// 方法
const ok=()=>{
  if(pageType.value=='add'){
    addKeyFun()
  }else if(pageType.value=='detail'){
    handleOpen('edit','编辑钥匙')
  }else if(pageType.value=='edit'){
    saveEditKeyInfo()
  }
};
const cancel = ()=>{
  pageType.value = 'detail';
  modalTiltle.value = '钥匙详情';
};

//打开弹框
const handleOpen = (type,title,id) => {
  pageType.value = type;
  modalTiltle.value = title;
  modal.value = true;
  if(type=='add'){
    clearData()
    getAreaData();
  }else if(type=='detail'){
    clearData()
    getKeyInfoById(id)
    keyId.value = id
  }
};

const changeTab = (name) =>{
  tab.value = name;
  if(name=='tab2'){
    keyHistory()
  }
};

//获取区域
const getAreaData = () =>{
  getAreaLists(userid).then(res =>{
    if(res.items.length>0){
      areaList.value = res.items
    }
  })
};

//获取项目
const getProjectData = (item) => {
  formData.value.areaName = item?.label ?? ''
  formData.value.projectId = ''
  formData.value.addrId = ''
  formData.value.unlockLocation = ''
  projectList.value =[]
  roomList.value = []
  let params = {
    data:{
      userId: userid,
      areaId:item?.value ?? ''
    }
  }
  getProjectList(params).then(res =>{
    if(res.items.length>0){
      projectList.value = res.items
      // getAdress()
    }
  })
};

// 选择项目
const changeProject= (item) => {
  formData.value.projectName = item?.label ?? ''
  getAdress() 
};
// 选择业态
const changeKeyStatus= (item) => {
  if(item == '其他') {
    formData.value.addrId = ''
    formData.value.unlockLocation = ''
  }
};
// 获取房间列表
const getAdress= () => {
  formData.value.addrId = ''
  formData.value.unlockLocation = ''
  let params = {
    data: {
      userId: userid,
      areaId: formData.value.areaId,
      projectId: formData.value.projectId,
      startIndex: 1,
      pageSize: 10000
    }
  }
  getHouseAddrInfoListToPage(params).then(res =>{
    if(res.resultCode=='200'){
      roomList.value = res.data
    }
  })
};

// 选择房间
const changeRoom = (item) => {
  formData.value.address = item?.label ?? ''
  formData.value.unlockLocation = item?.label ?? ''
};

//新增钥匙
const addKeyFun = () =>{
  let item = formData.value
  if(!item.areaId){
    Message.warning('请选择区域！')
    return
  }
  if(!item.projectId){
    Message.warning('请选择项目！')
    return
  }
  if(!item.keyClassify){
    Message.warning('请选择业态！')
    return
  }
  if(!item.addrId && formData.value.keyClassify!='其他'){
    Message.warning(`请选择${formData.value.keyClassify=='商铺'?'商铺':'房间'}地址！`)
    return
  }
  if(!item.unlockLocation){
    Message.warning('请输入开锁位置！')
    return
  }
  if(!item.custodianName){
    Message.warning('请输入托管人！')
    return
  }
  if(!item.custodianPhoneNumber){
    Message.warning('请输入联系电话！')
    return
  }else{
    const reg = /^1[0-9]{10}$/;
    if(!reg.test(item.custodianPhoneNumber)){
      Message.warning('请输入正确的手机号码！')
      return
    }
  }
  if(!item.storageLocation){
    Message.warning('请输入存放位置！')
    return
  }
  if(!item.keyNumber){
    Message.warning('请输入数量！')
    return
  }
  formData.value.keyId=''
  let params = {
    data: {
      ...formData.value,
      companyId,
      createBy: userName
    }
  }
  console.info(JSON.stringify(formData.value))
  addKeyInfo(params).then(res =>{
    if(res.status=='200'){
      Message.success('新增成功!')
      clearData()
      emit("getTableList")
      modal.value = false
      }else{
      Message.error(res.message)
    }
  })
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
      formData.value = res.data
    }
  })
};

// 钥匙编辑的保存
const saveEditKeyInfo = () =>{
  const { areaId, areaName, projectId, projectName, keyClassify, address, addrId,
    unlockLocation, custodianName, custodianPhoneNumber, storageLocation, keyNumber,
    merchantNumber, productBranding,  remark, keyId } = formData.value
  if(!unlockLocation){
    Message.warning('请输入开锁位置！')
    return
  }
  if(!custodianName){
    Message.warning('请输入托管人！')
    return
  }
  if(!custodianPhoneNumber){
    Message.warning('请输入联系电话！')
    return
  }else{
    const reg = /^1[0-9]{10}$/;
    if(!reg.test(custodianPhoneNumber)){
      Message.warning('请输入正确的手机号码！')
      return
    }
  }
  if(!storageLocation){
    Message.warning('请输入存放位置！')
    return
  }
  if(!keyNumber){
    Message.warning('请输入数量！')
    return
  }
  let params = {
    data:{
      areaId,
      areaName,
      projectId,
      projectName,
      keyClassify,
      address,
      addrId,
      unlockLocation,
      custodianName, 
      custodianPhoneNumber, 
      storageLocation, 
      keyNumber,
      merchantNumber, 
      productBranding,  
      remark, 
      keyId,
      companyId,
      createBy: userName
    }
  }
  params.data.createBy = userName
  upDateKeyInfo(params).then(res =>{
    if(res.status=='200'){
      Message.success('编辑成功!')
      emit("getTableList")
      modal.value = false
      }else{
      Message.error(res.message)
    }
  })
};

const clearData = () =>{
  formData.value.areaId = ''
  formData.value.areaName = ''
  formData.value.projectId = ''
  formData.value.projectName = ''
  formData.value.keyClassify = ''
  formData.value.address = ''
  formData.value.addrId = ''
  formData.value.unlockLocation = ''
  formData.value.custodianName = ''
  formData.value.custodianPhoneNumber = ''
  formData.value.storageLocation = ''
  formData.value.keyNumber = 1
  formData.value.merchantNumber = ''
  formData.value.productBranding = ''
  formData.value.remark = ''
  tab.value = 'tab1'
  keyId.value=ref('')
  total.value=0
  current.value = 1
};

const  keyHistory= () =>{
  let params = {
    data:{
      companyId,
      keyId:keyId.value,
      current: current.value,
      pageSize: pageSize.value,
    }
  }
  loading.value = true
  keyLendHistory(params).then(res =>{
    loading.value = false
    if(res.status=='200'){
      let list = res.data.records
      total.value = res.data.total
      list.forEach(item => {
        switch(item.borrowerType){
          case 1:
            item.borrowerTypeText = '业主';
            break;
          case 2:
            item.borrowerTypeText = '员工';
            break;
          case 3:
            item.borrowerTypeText = '其他';
            break;
        }

        switch(item.keyBorrowerStatus){
          case 1:
            item.keyBorrowerStatusText = '待借用';
            break;
          case 2:
            item.keyBorrowerStatusText = '已借出';
            break;
          case 3:
            item.keyBorrowerStatusText = '已归还';
            break;
        }
      });
      tableData.value = list
    }
  })
}

const changePage = (i) =>{
  current.value = i
  keyHistory()
}

//检验输入
const handleInput=(event) => {  
  const value = event.target.value;  
  // 使用正则表达式检查是否为正整数
  if (!/^[1-9]\d*$/.test(value)) {  
    // 如果不是正整数，则清除非数字字符  
    formData.value.keyNumber = value.replace(/\D/g, '');  
  } else {  
    formData.value.keyNumber = value;  
  }  
}

defineExpose({
  handleOpen
}) 

</script>

<style lang="scss">
@import "@/assets/style/table-common.scss";

.modal-box{
  .ivu-modal-footer .ivu-btn-text{
    display: none;
  }
}

</style>