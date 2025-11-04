<template>
  <div class="page-cont">
    <table-title title="钥匙借用">
      <Button type="primary" ghost @click="downloadQrCodeAll">下载二维码</Button>
      <Button type="primary" ghost @click="exportKey()">导出列表</Button>
      <Button type="primary" @click="openDetail('add','新增钥匙')">新增钥匙</Button>
    </table-title>

    <div class="form-data-list">
      <Row class="form-row">
        <i-col span="4">
          <i-Select filterable clearable v-model="formData.areaId" placeholder="区域" @on-change='getProjectData'>
            <i-option v-for="item in areaList" :value="item.areaId" :key="item.areaId">{{ item.areaName }}</i-option>
          </i-Select>
        </i-col>
        <i-col span="4">
          <i-Select filterable clearable v-model="formData.projectId" placeholder="项目">
            <i-option v-for="item in projectList" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</i-option>
          </i-Select>
        </i-col>
        <i-col span="4">
          <Input clearable v-model="formData.unlockLocation" placeholder="开锁位置"></Input>
        </i-col>
        <i-col span="3">
          <i-Select filterable v-model="formData.keyClassify" placeholder="业态" clearable>
            <i-option v-for="item in propertyStatusList" :value="item" :key="item">{{ item }}</i-option>
          </i-Select>
        </i-col>
        <i-col span="3">
          <Input clearable v-model="formData.custodianName" placeholder="托管人"></Input>
        </i-col>
        <i-col span="3">
          <Input clearable v-model="formData.custodianPhoneNumber" placeholder="联系电话"></Input>
        </i-col>
        <i-col span="3">
          <Button type="primary" @click="changePage(1)">查询</Button>
          <Button @click="resetData">重置</Button>
        </i-col>
      </Row>
    </div>
    <Table border :columns="columns" :data="tabelData" :loading='loading'>
      <template #action="{ row }">
        <div class="table-action-btn">
          <span @click="openBorrowDetail('register','借用登记',row.keyId)">借用登记</span>
          <span @click="openDetail('detail','钥匙详情',row.keyId)">详情</span>
          <!-- <span @click="deleteKeyById(row.keyId)">删除</span> -->
          <span v-if="row.keyStatus==1" @click="invalidKeyById(row.keyId)">作废</span>
          <span @click="keyDownloadQrCode(row)">下载二维码</span>
        </div>
      </template>
      <template #projectNameAction="{ row }">
        <div style="width: 100%;">
          <Ellipsis :text="row.projectName" :lines="2" tooltip placement="right"/>
        </div>
      </template>
      <template #unlockLocationAction="{ row }">
        <div style="width: 100%;">
          <Ellipsis :text="row.unlockLocation" :lines="2" tooltip placement="right"/>
        </div>
      </template>
      <template #storageLocationAction="{ row }">
        <div style="width: 100%;">
          <Ellipsis :text="row.storageLocation" :lines="2" tooltip placement="right"/>
        </div>
      </template>
      <template #keyStatus="{ row }">
        <div v-if="row.keyStatus==1" style="width: 100%;">
          正常
        </div>
        <div v-if="row.keyStatus==0" style="width: 100%;">
          已作废
        </div>
      </template>
    </Table>
    <Page :total="total" v-model='formData.current' :pageSize='formData.pageSize' @on-change="changePage" @on-page-size-change="onPageSizeChange" :page-size-opts="pageSizeOpts" class="page-box" show-sizer show-total />
    <key-detail @getTableList='changePage' ref='keyDetailRef'></key-detail>
    <key-borrow-detail ref="keyBorrowDetailRef"></key-borrow-detail>
    <keyInvalidModal :isVisible="isShowInvalidModal" :id="invalidKeyId" @cancel="isShowInvalidModal=false" @success="invalidKeySuccess"></keyInvalidModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import  {  Message, Modal } from 'view-ui-plus'
import tableTitle from '../../components/table-view/tableTitle.vue'
import keyDetail from './components/keyDetail.vue'
import keyBorrowDetail from './components/keyBorrowDetail.vue'
import keyInvalidModal from './components/keyInvalidModal.vue'

import {
  getAreaLists,
  getProjectList
} from '../../service/landcrm'
import {
  keyInfoListPage,
  deleteKeyInfo,
  keyInfoDownloadQrCode,
  exportKeyInfo,
  keyInfoDownloadQrCodeList
} from '../../service/officeSystem.js'

let isShowInvalidModal = ref(false)
let invalidKeyId=ref('')
let model = ref('')
const keyDetailRef = ref()
const keyBorrowDetailRef = ref()
let loading = ref(false)

const columns = ref([
  { title: '操作', align: 'center', slot:'action', width: 260 },
  { title: '项目名称', key:'projectName',slot:'projectNameAction',  align: 'center' ,minWidth: 150 },
  { title: '业态', key:'keyClassify',  align: 'center' ,minWidth: 120},
  { title: '开锁位置',key:'unlockLocation', align: 'center', slot:'unlockLocationAction',minWidth: 200 },
  { title: '存放位置', key:'storageLocation',  align: 'center',slot:'storageLocationAction',minWidth: 200 },
  { title: '托管人', key:'custodianName',  align: 'center' ,width: 130 },
  { title: '联系电话', key:'custodianPhoneNumber',  align: 'center',width: 130  },
  { title: '数量', key:'keyNumber',  align: 'center',minWidth: 100 },
  { title: '已借出数', key:'alreadyBorrowNumber',  align: 'center' ,minWidth: 100},
  { title: '状态', align: 'center', slot:'keyStatus', width: 120 },
  { title: '作废原因', key:'invalidReason',  align: 'center',width: 130, tooltip:true },
  { title: '操作人', key:'updateBy',  align: 'center' ,width: 130 },
  { title: '操作时间', key:'updateTime',  align: 'center' ,width: 120 },
])
const propertyStatusList = ref([ '商铺', '住宅', '写字楼', '其他' ]);
const tabelData = ref([])
let total = ref(0)
const pageSizeOpts = ref([10,15,50, 100])
let areaList = ref([])
let projectList = ref([])
let formData = ref({
  areaId:'',
  projectId:'',
  unlockLocation:'',
  keyClassify:'',
  custodianName:'',
  custodianPhoneNumber:'',
  current:1,
  pageSize:10,
})

onMounted(async () => {
  await getAreaData();
  await getTableList()
});

//获取缓存数据
const { TOKEN, USER_INFO } = window.GlobalProperties.$constant || {};
const { storageAction } = window.GlobalProperties.$utils || {};
const { userid, companyId } = storageAction({ action: 'get', key: USER_INFO }) || {};

function invalidKeySuccess(){
  isShowInvalidModal.value = false;
  getTableList()
}

function invalidKeyById(id){
  invalidKeyId.value = id
  isShowInvalidModal.value = true;
}

// ** 方法 *
const openDetail = (type,title,id) => {
  keyDetailRef.value.handleOpen(type,title,id)
};

const openBorrowDetail = (type,title,id) => {
  keyBorrowDetailRef.value.handleOpen(type,title,id)
};

//获取区域
const getAreaData =async () =>{
  await getAreaLists(userid).then(res =>{
    if(res.items.length>0){
      areaList.value = res.items
      formData.value.areaId = areaList.value[0].areaId
    }
  })
  await getProjectData(formData.value.areaId)
};

//获取项目
const getProjectData = async (id) =>{
  projectList.value = []
  formData.value.projectId = ''
  if(!id) return //清空区域时，不需要获取项目
  let params = {
    data:{
      userId: userid,
      areaId:id
    }
  }
  await getProjectList(params).then(res =>{
    if(res.items.length>0){
      projectList.value = res.items
      if(projectList.value.length>0){
        formData.value.projectId = projectList.value[0].projectId
      }
    }
  });
};

//获取钥匙信息列表
const getTableList = () =>{
  let params = {
    data:{
      ...formData.value,
      companyId: companyId
    }
  }
  loading.value = true
  keyInfoListPage(params).then(res =>{
    loading.value = false
    if(res.status=='200'){
      tabelData.value = res.data.records
      total.value = res.data.total
    }
  })
};

// 删除钥匙信息
const deleteKeyById = (id) =>{
  Modal.confirm({
    title: '提示',
    content: '确认删除该钥匙吗？',
    onOk: () => {
      let params = {
        data:{
          keyId: id,
          companyId:companyId
        }
      }
      deleteKeyInfo(params).then(res =>{
        if(res.status=='200'){
          getTableList()
          Message.success('操作成功!')
        }
      })
    },
    onCancel: () => {}
  });
};

//二维码下载
const keyDownloadQrCode= (row) =>{
  let params = {
    data:{
      keyId: row.keyId,
      companyId: companyId
    }
  }
  keyInfoDownloadQrCode(params).then(res =>{
      console.log(res)
      if(res.status=='200'){
        let url = res.data
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${row.unlockLocation}.png`);
        document.body.appendChild(link);
        link.click();
      }
  })
};

//重置查询条件
const resetData = () =>{
  formData.value.areaId = ''
  formData.value.projectId = ''
  formData.value.unlockLocation = ''
  formData.value.keyClassify = ''
  formData.value.custodianName = ''
  formData.value.custodianPhoneNumber = ''
  formData.value.current = 1
  formData.value.pageSize = 10
  getTableList()
};

const exportKey = () =>{
  const { areaId, projectId, keyClassify, custodianName, unlockLocation, custodianPhoneNumber } = formData.value
  let params = {
    data: {
      companyId,
      areaId,
      projectId, 
      keyClassify, 
      custodianName, 
      unlockLocation, 
      custodianPhoneNumber
    }
  }
  exportKeyInfo(params)
};

//批量下载二维码
const downloadQrCodeAll = () =>{
  const { areaId, projectId, keyClassify, custodianName, unlockLocation, custodianPhoneNumber } = formData.value
  let params = {
    data: {
      companyId,
      areaId,
      projectId, 
      keyClassify, 
      custodianName, 
      unlockLocation, 
      custodianPhoneNumber
    }
  }
  keyInfoDownloadQrCodeList(params)
};



//切换分页
const changePage = (index) => {
  formData.value.current = index ? index : 1
  getTableList();
}

// 切换分页条数
const onPageSizeChange = (size) => {
  formData.value.pageSize = size
  changePage(1)
}

</script>

<style lang="scss" scoped>
@import "@/assets/style/table-common.scss";
.page-cont{
  background-color: #fff;
  padding: 15px;
  height: calc( 100vh - 105px );
}
.form-data-list{
  padding: 15px 0;
}
.form-row{
  margin-bottom: 12px;
  .ivu-col{
    padding-right: 10px;
    .ivu-btn{
      margin-right: 10px;
    }
  }
}


</style>