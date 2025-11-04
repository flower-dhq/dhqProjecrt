<template>
  <div class="page-cont">
    <table-title title="参数设置">
      <Button type="primary" @click="submit()">保存</Button>
    </table-title>
    <div class="title">预警设置</div>
    <div class="form-box">
      <span>归还逾期预警天数</span>
      <Input v-model="warningForm.returnWarningDay" class="form-cont"></Input>
      <span>天</span>
    </div>
    <div class="form-box">
      <span>归还逾期用户预警</span>
      <Switch class="switch-box" size="large" v-model='warningForm.returnWarningEnable'>
        <template #open>
          <span>开启</span>
        </template>
        <template #close>
          <span>关闭</span>
        </template>
      </Switch>
    </div>
    <div class="title">审批设置</div>
    <div class="config-box">
      <div class="config-item" v-for="(item,i) in configList" :key="i">
        <div>
          <span>{{ item.title }}</span>
          <Switch class="switch-box" size="large" v-model='item.isEnable'>
            <template #open>
              <span>开启</span>
            </template>
            <template #close>
              <span>关闭</span>
            </template>
          </Switch>
        </div>
        <div class="node-list">
          <div>开始</div>
          <div class="node-data" v-for="(data,index) in item.children" :key="index" @click="checkFlow(item.auditType,'change',index)">
            {{ data.jobName }}
            <div class="data-del" v-if="item.children.length==index+1">
              <Icon @click.stop="checkFlow(item.auditType,'del')" color='red' type="md-close" size='20'/>
            </div>
          </div>
          <div v-if="item.children.length<3" class="node-icon" @click="checkFlow(item.auditType,'add',item.children.length)"><Icon color='#2d8cf0' type="md-add" size='20'/></div>
          <div>结束</div>
        </div>
      </div>
    </div>
    <select-post ref="selectPostRef" @getPost ="getPostRow"></select-post>
  </div>
</template>

<script setup>
import { Message } from 'view-ui-plus';
import { ref, onMounted } from 'vue';
import tableTitle from '../../components/table-view/tableTitle.vue'
import selectPost from './components/selectPost.vue'
import {
  saveOrUpdateKeyLendingSetting,
  getKeyLendingSetting,
  getKeyAuditFlow,
  checkKeyAuditFlow,
  saveOrUpdateKeyAuditFlow,
} from '../../service/officeSystem.js'
const selectPostRef = ref()
const warningForm = ref({
  returnWarningEnable:false,
  returnWarningDay:''
})
const configList = ref([
  {
    auditType:1,
    isEnable:false,
    title:'员工正常借出审批',
    children:[]
  },
  {
    auditType:2,
    isEnable:false,
    title:'员工紧急借出审批',
    children:[]
  },
  {
    auditType:3,
    isEnable:false,
    title:'业主借出审批',
    children:[]
  },
  {
    auditType:4,
    isEnable:false,
    title:'其他借出审批',
    children:[]
  },
]);
const nodeInfo = ref({
  auditType:'', //修改类型
  nodeIndex: '', //第几个节点
})

onMounted(() => {
  getConfigDetail();
  getWarningConfig()
});

//获取缓存数据
const { USER_INFO } = window.GlobalProperties.$constant || {};
const { storageAction } = window.GlobalProperties.$utils || {};
const { userid, companyId, userName } = storageAction({ action: 'get', key: USER_INFO }) || {};

// 方法
const seletPostInfo = (id,index) => {
  nodeInfo.value.auditType = id;
  nodeInfo.value.nodeIndex = index;
  selectPostRef.value.handleOpen(id)
};

// 保存
 const submit = async () =>{
  await saveWarningConfig()
  await saveConfigDetail()
};

//保存预警配置
const saveWarningConfig = () =>{
  let params = {
    data:{
      companyId,
      userName,
      returnWarningEnable: warningForm.value.returnWarningEnable ? 1 : 0,
      returnWarningDay: Number(warningForm.value.returnWarningDay),
      userId: userid,
    }
  }
  saveOrUpdateKeyLendingSetting(params).then(res =>{
    if(res.status=='200'){
      getWarningConfig()
    }
  })
};

//查询预警配置
const getWarningConfig = () =>{
  let params = {
    data:{
      companyId
    }
  }
  getKeyLendingSetting(params).then(res =>{
    if(res.status=='200'){
      warningForm.value.returnWarningEnable = !!res.data.returnWarningEnable;
      warningForm.value.returnWarningDay = res.data.returnWarningDay;
    }
  })
};

// 校验流程配置
const checkFlow = (id,type,index) =>{
  let params = {
    data:{
      companyId,
      auditType: id
    }
  }
  checkKeyAuditFlow(params).then(res =>{
    if(res.status=='200'){
      if(!res.data){
        Message.warning(res.message)
      }else{
        if(type=='add'){
          seletPostInfo(id,index)
        }else if(type=='del'){
          delNode(id)
        }else if(type=="change"){
          seletPostInfo(id,index)
        }
      }
    }
  })
};

// 保存流程配置
const saveConfigDetail = () =>{
  let list = []
  try{
    configList.value.forEach(item =>{
      let ls = []
      if(item.children.length==0 && item.isEnable){
        Message.warning(`"${item.title}"已开启，岗位不能为空`)
        throw 'StopIteration'
      }
      item.children.forEach((v,i) =>{
        ls.push({
          nodeSequence: i+1,
          jobName: v.jobName,
          jobId: v.jobId
        })
      })
      let obj = {
        companyId,
        userName,
        userId: userid,
        auditType:item.auditType,
        isEnable: item.isEnable ? 1 : 0,
        children:ls
      }
      list.push(obj)
    })
  }catch(e){
     if (e == "StopIteration") return;
  }
  


  let params = {
    data:list
  }
  saveOrUpdateKeyAuditFlow(params).then(res =>{
    if(res.status=='200'){
      Message.success('保存成功！')
      getConfigDetail()
    }
  })
};

//获取流程配置
const getConfigDetail = () =>{
  let params = {
    data:{
      companyId
    }
  }
  getKeyAuditFlow(params).then(res =>{
    if(res.status=='200'){
      let list = res.data
      list.forEach(item =>{
        item.isEnable = !!item.isEnable
        switch(item.auditType){
          case 1:
            item.title = '员工正常借出审批';
            break;
          case 2:
            item.title = '员工紧急借出审批';
            break;
          case 3:
            item.title = '业主借出审批';
            break;
          case 4:
            item.title = '其他借出审批';
            break;
        }
      })
      configList.value = list
    }
  })
};

//新增或者岗位节点
const getPostRow = (row) =>{
  configList.value.forEach(item =>{
    if(item.auditType==nodeInfo.value.auditType){
      item.children[nodeInfo.value.nodeIndex] = {
        jobName: row.postName,
        jobId: row.postId
      }
    }
  })
};

// 删除岗位节点
const delNode = (id) =>{
  configList.value.forEach(item =>{
    if(item.auditType==id){
      item.children.pop()
    }
  })
}




</script>

<style lang="scss" scoped>
.page-cont{
  background-color: #fff;
  padding: 15px;
  height: calc( 100vh - 105px );
}
.title{
  padding: 10px;
}
.title::before{
  content: '';
  display: inline-block;
  height: 18px;
  width: 2px;
  position: relative;
  left: -7px;
  top: 3px;
  background: #2d8cf0;
}
.form-box{
  padding: 5px 0 20px;
  display: flex;
  align-items: center;
  .form-cont{
    width: 100px;
    margin: 0 5px 0 10px;
  }
}
.switch-box{
  margin-left: 10px;
}

.config-box{
  padding: 20px;
  display: flex;
  .config-item{
    width: 25%;
  }
}
.node-list{
  padding-top: 25px;
  width: 160px;
}
.node-list >div{
  width: 100%;
  height: 34px;
  background: #f2f2f2;
  border-radius: 17px;
  margin-bottom: 34px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.node-list >div:not(:last-child)::after{
  content: '';
  height: 34px;
  width: 2px;
  background-color: #777;
  display: inline-block;
  position: absolute;
  top: 34px;
  left: 50%;
}

.node-list .node-icon{
  width: 34px;
  margin: 0 auto 34px;
}
.node-data{
  position: relative;
  color: #2d8cf0;
  .data-del{
    position: absolute;
    right: -34px;
    height: 34px;
    width: 34px;
    text-align: center;
    line-height: 34px;
  }
}
.node-data, .node-icon{
  cursor: pointer;
}
</style>