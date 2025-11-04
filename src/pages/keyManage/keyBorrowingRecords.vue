<template>
  <div class="page-cont">
    <table-title title="借用记录">
      <Button type="primary" ghost @click="exportTable">导出列表</Button>
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
        <i-col span="4">
          <i-Select filterable clearable v-model="formData.keyBorrowerStatus" placeholder="钥匙状态">
            <i-option v-for="item in keyStatus" :value="item.value" :key="item.value">{{ item.label }}</i-option>
          </i-Select>
        </i-col>
        <i-col span="4">
          <Input clearable v-model="formData.borrowerName" placeholder="借用人姓名"></Input>
        </i-col>
        <i-col span="4">
          <Input clearable v-model="formData.borrowerPhoneNumber" placeholder="借用人电话"></Input>
        </i-col>
      </Row>
      <Row class="form-row">
        <i-col span="8">
          <DatePicker v-model="timeList" type="daterange" @on-change='getDateStr' placeholder="申请开始时间-结束时间" style="width:100%"/>
        </i-col>
        <i-col span="8">
          <Button type="primary" @click="changePage(1)">查询</Button>
          <Button @click="resetData">重置</Button>
        </i-col>
      </Row>
    </div>
    <div class="tabs-box">
      <Tabs v-model="tabName" @on-click='changeTab'>
        <TabPane v-for="(item,i) in tabsList" :key="i" :label="`${item.label} (${item.value})`" :name="item.id"></TabPane>
      </Tabs>
      <Button class="btn-box" type="warning" @click="getWaitApproval()">查看待我审批（{{waitMeAuditNum}}）</Button>
    </div>
    
    <Table :loading='loading' border :columns="columns" :data="tabelData">
      <template #action="{ row }">
        <div class="table-action-btn">
          <span @click="openDetail('detail','详情',row.keyId,row.lendingId)">详情</span>
          <span v-if="row.isApproval" @click="approveKey(row.lendingId)">审批</span>
          <span v-if="row.keyBorrowerStatus==1 && row.auditStatus==2" @click="keyOperate(row,1)">借出</span>
          <span v-if="row.keyBorrowerStatus==2 && row.auditStatus==2" @click="keyOperate(row,2)">归还</span>
        </div>
      </template>
      <template #borrowerStatus="{ row }">
        <span>{{ row.borrowerType==1 ? '业主': row.borrowerType==2 ? '员工': '其他' }}</span>
      </template>
      <template #keyStatus="{ row }">
        <span>{{ row.keyBorrowerStatus==1 ? '待借用': row.keyBorrowerStatus==2 ? '已借出': '已归还' }}</span>
      </template>
      <template #approveStatus="{ row }">
        <span>{{ row.auditStatus==1 ? '审批中': row.auditStatus==2 ? '已审批': '已拒绝' }}</span>
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
      <template #purposesAction="{ row }">
        <div style="width: 100%;">
          <Ellipsis :text="row.purposes" :lines="2" tooltip placement="right"/>
        </div>
      </template>
      <template #remarkStatus="{ row }">
        <div style="width: 100%;">
          <Ellipsis :text="row.remark" :lines="2" tooltip placement="right"/>
        </div>
      </template>
    </Table>
    <Page :total="total" v-model='formData.current' :pageSize='formData.pageSize' @on-change="changePage" @on-page-size-change="onPageSizeChange" :page-size-opts="pageSizeOpts" class="page-box" show-sizer show-total />
    <key-borrow-detail @getTableList='getTableList' ref='keyBorrowDetailRef'></key-borrow-detail>
    <key-approve @getTableList='getTableList' ref='keyApproveRef'></key-approve>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import  { Modal, Tabs } from 'view-ui-plus'
import tableTitle from '../../components/table-view/tableTitle.vue'
import keyBorrowDetail from './components/keyBorrowDetail.vue'
import keyApprove from './components/keyApprove.vue'

import {
  getAreaLists,
  getProjectList
} from '../../service/landcrm'
import {
  keyLendingListPage,
  keyLendingAuditNum,
  keyLending,
  recoverKey,
  exportKeyLend,
  getAuditJobIds
} from '../../service/officeSystem.js'
import { Message } from 'view-ui-plus';

const keyBorrowDetailRef = ref();
const keyApproveRef = ref();
let tabsList = ref([
  { label:'全部',id:0, value:0 },
  { label:'审批中',id:1, value:0 },
  { label:'已审批',id:2, value:0 },
  { label:'已拒绝',id:3, value:0 },
])
const keyStatus = ref([ 
{ label:'待借用', value:1 },
{ label:'已借出', value:2 },
{ label:'已归还', value:3 },
])
const columns = ref([
  { title: '操作', align: 'center', slot:'action', width: 160 },
  { title: '项目名称', key:'projectName', slot:'projectNameAction',  align: 'center', width: 180  },
  { title: '开锁位置', key:'unlockLocation', slot:'unlockLocationAction', align: 'center', width: 180 },
  { title: '借用人类型', key:'borrowerType', slot:'borrowerStatus',  align: 'center', width:120 },
  { title: '借用人姓名', key:'borrowerName',  align: 'center', width: 130 },
  { title: '借用人电话', key:'borrowerPhoneNumber',  align: 'center', width:130  },
  { title: '用途', key:'purposes', slot:'purposesAction', align: 'center', width:100  },
  { title: '借用数量', key:'keyBorrowerNumber',  align: 'center', width:120  },
  { title: '预计归还时间', key:'estimatedReturnTime',  align: 'center', width: 130  },
  { title: '备注', key:'remark', slot:'remarkStatus', align: 'center', width: 140 },
  { title: '借用状态', key:'keyBorrowerStatus', slot:'keyStatus', align: 'center', width: 100 },
  { title: '审批状态', key:'auditStatus', slot:'approveStatus', align: 'center', width: 100  },
  { title: '申请人', key:'borrowerName',  align: 'center', width: 130  },
  { title: '申请时间', key:'createTime', align: 'center', width: 120  },
  { title: '实际借出时间', key:'borrowerTime', align: 'center', width: 130 },
])
let tabelData = ref([])
let areaList = ref([])
let projectList = ref([])
let timeList = ref([])
let tabName =ref(0)
let waitMeAuditNum = ref(0)
let total = ref(0)
let isWaitApproval = ref(false)
let loading = ref(false)

let formData = ref({
  areaId:'',
  projectId:'',
  unlockLocation:'',
  keyBorrowerStatus:'',
  borrowerName:'',
  borrowerPhoneNumber:'',
  current:1,
  pageSize:10,
})

let auditJobIds = ref('') //岗位id
const pageSizeOpts = ref([10,15,50, 100])

 onMounted(async() => {
  auditJobIds.value = await getUserIds()
  await getAreaData();
  await getTableList()
});

//获取缓存数据
const { USER_INFO } = window.GlobalProperties.$constant || {};
const { storageAction } = window.GlobalProperties.$utils || {};
const { userid, companyId, userName } = storageAction({ action: 'get', key: USER_INFO }) || {};

// 方法
const openDetail = (type,title,id,id2) => {
  keyBorrowDetailRef.value.handleOpen(type,title,id,id2)
};

const approveKey = (id) =>{
  keyApproveRef.value.handleOpen(id)
}

//获取区域
const getAreaData = async () =>{
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
  })
};

// 选择项目
const changeProject= (item) => {
  formData.value.projectName = item.label
  getAdress() 
};

// 获取钥匙借用记录分页
const getTableList = () =>{
  let params = {
    data:{
      ...formData.value,
      companyId: companyId,
      startTime: formatDateTime(timeList.value[0],0),
      endTime: formatDateTime(timeList.value[1],1)
    }
  }
  if(isWaitApproval.value ){
    params.data.auditJobIds = auditJobIds.value //岗位id(点击待我审批才传值,传字符串,岗位id之间用逗号分开)
    params.data.auditStatus = 1 //审批状态: (1. 审批中 2. 已审批 3. 已拒绝 )
  }else{
    params.data.auditStatus = tabName.value ? tabName.value : '' //审批状态: (1. 审批中 2. 已审批 3. 已拒绝 )
  }
  loading.value = true
  keyLendingListPage(params).then(res =>{
    loading.value = false
    if(res.status=='200'){
      let list = res.data.records
      list.forEach(item =>{
        item.isApproval = auditJobIds.value.indexOf(item.auditJobId) !=-1
      })
      total.value = res.data.total
      tabelData.value = list
      getTableListNum() //重新获取总数
    }
  })
};

//切换状态
const changeTab = (name) =>{
  isWaitApproval.value = false
  changePage(1);
}

//获取列表总数
const getTableListNum = () =>{
  let params = {
    data:{
      ...formData.value,
      companyId: companyId,
      auditJobIds: auditJobIds.value,
      startTime: formatDateTime(timeList.value[0]),
      endTime: formatDateTime(timeList.value[1])
    }
  }
  keyLendingAuditNum(params).then(res =>{
    if(res.status=='200'){
      let data = res.data
      tabsList.value[0].value = data.totalNum;
      tabsList.value[1].value = data.waitAudit;
      tabsList.value[2].value = data.alreadyAudit;
      tabsList.value[3].value = data.auditRefuse;
      waitMeAuditNum.value = data.waitMeAuditNum;
    }
  })
};

// 获取岗位id
const getUserIds = () =>{
  let params = {
    data:{
      userId: userid,
    }
  }
  return new Promise((resolve) => {
    getAuditJobIds(params).then(res =>{
      if(res.status==200){
        let ids = res.data || ''
        resolve(ids)
      }else{
        resolve({})
      }
    })
  });
};

// 钥匙借出归还操作 1借出，2归还
const keyOperate = (row,type) =>{
  let str = type==1 ? '确认借出钥匙吗？' : '确认已经归还钥匙吗？'
  Modal.confirm({
    title: '提示',
    content: str,
    onOk: () => {
      let params = {
        data:{
          lendingId: row.lendingId,
          keyId: row.keyId,
          companyId,
          userName,
          userId:userid
        }
      }
      let api = type==1 ? keyLending : recoverKey
      api(params).then(res =>{
        if(res.status=='200'){
          Message.success('操作成功！')
          getTableList()
        }
      })
    },
    onCancel: () => {}
  });
};

//导出列表
const exportTable = () =>{
  const { areaId, projectId, keyBorrowerStatus, borrowerName, unlockLocation,
    borrowerPhoneNumber } = formData.value
  let params = {
    data:{
      areaId,
      projectId,
      keyBorrowerStatus,
      borrowerName,
      unlockLocation,
      borrowerPhoneNumber,
      companyId,
      startTime: formatDateTime(timeList.value[0]),
      endTime: formatDateTime(timeList.value[1]),
    }
  }
  if(isWaitApproval.value ){
    params.data.auditJobIds = auditJobIds.value
    params.data.auditStatus = 1
  }else{
    params.data.auditStatus = tabName.value ? tabName.value : ''
  }
  exportKeyLend(params)
}

//重置数据
const resetData = () =>{
  formData.value.areaId = ''
  formData.value.projectId = ''
  formData.value.unlockLocation = ''
  formData.value.keyBorrowerStatus = ''
  formData.value.borrowerName = ''
  formData.value.borrowerPhoneNumber = ''
  formData.value.current = 1
  formData.value.pageSize = 10
  timeList.value=[]
  getTableList()
}

const formatDateTime = (date,type) => {
  if(!date) return ''
  let Y = date.getFullYear()  +  '-';
  let M  =  (date.getMonth()+1  <  10  ?  '0'+(date.getMonth()+1)  :  date.getMonth()+1)  +  '-';
  let D  =  (date.getDate()  <  10  ?  '0'+date.getDate()  :  date.getDate())  +  ' ';
  let str = Y+M+D
  if(type){
    return str+'23:59:59'
  }else{
    return str+'00:00:00'
  }
}

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

//待我审批
const getWaitApproval = (size) =>{
  isWaitApproval.value = true
  tabName.value = null
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
  padding: 15px 0 3px;
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
.tabs-box{
  position: relative;
  .btn-box{
    position: absolute;
    right: 5px;
    top: -3px;
    z-index: 999;
  }
}
</style>