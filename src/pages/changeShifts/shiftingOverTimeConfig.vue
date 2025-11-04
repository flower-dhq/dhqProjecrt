<template>
  <div class="page-cont">
    <table-title title="超时配置">
      <Button type="primary" @click="submit()">保存</Button>
    </table-title>
    <div class="all_time">
      <div class="time_box">
        <div class="le">接班超时时间</div>
        <div class="ri">
          <InputNumber :min='0' v-model="formDataModel.takeOvertime" placeholder="请输入" class="inpx"></InputNumber>
          <span class="txt">分钟</span>
        </div>
      </div>
      <div class="time_box">
        <div class="le">审阅超时时间</div>
        <div class="ri">
          <InputNumber :min='0' v-model="formDataModel.approveOvertime" placeholder="请输入" class="inpx"></InputNumber>
          <span class="txt">分钟</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Message } from 'view-ui-plus';
import { ref, onMounted } from 'vue';
import tableTitle from '../../components/table-view/tableTitle.vue'
import {
  getShiftingConfigList,
  saveOrUpdate,
} from '../../service/landcrm.js'
const selectPostRef = ref({
  selectData:{}
})
const formDataModel = ref({
  takeOvertime:0,
  approveOvertime:0,
  id:''
})
const configList = ref([
  {
    auditType:1,
    isEnable:false,
    children:[]
  },
  {
    auditType:2,
    isEnable:false,
    children:[]
  },
  {
    auditType:3,
    isEnable:false,
    children:[]
  },
  {
    auditType:4,
    isEnable:false,
    children:[]
  },
]);

onMounted(() => {
  getConfigDetail();
});

//获取缓存数据
const { USER_INFO } = window.GlobalProperties.$constant || {};
const { storageAction } = window.GlobalProperties.$utils || {};
const { userid, companyId, userName } = storageAction({ action: 'get', key: USER_INFO }) || {};

// 保存
 const submit = async () =>{
  await saveConfigDetail()
};


// 保存流程配置
const saveConfigDetail = () =>{
  let params = {
    data:{
      companyId,
      id:formDataModel.value.id,
      takeOvertime:formDataModel.value.takeOvertime,
      approveOvertime:formDataModel.value.approveOvertime,
    }
  }
  saveOrUpdate(params).then(res =>{
    if(res.status=='200'){
      Message.success('保存成功！')
      getConfigDetail()
    }else{
      Message.error(res.message)
    }
  })
};

//获取超时配置
const getConfigDetail = () =>{
  let params = {
    data:{
      companyId
    }
  }
  getShiftingConfigList(params).then(res =>{
    if(res.status=='200'){
      formDataModel.value.takeOvertime = res.data?res.data[0].takeOvertime:0
      formDataModel.value.approveOvertime = res.data?res.data[0].approveOvertime:0
      formDataModel.value.id = res.data?res.data[0].id:''
    }
  })
};

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
.all_time{
  width: 100%;
  display: flex;
  padding-top: 30px;
  .time_box{
    width: 45%;
    display: flex;
    border: 1px solid #F3F4F5;
    .le{
      width: 50%;
      // height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      background: #F9F9F9;
      padding: 20px 0;
    }
    .ri{
      width: 50%;
      // height: 100px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding-left: 10px;
      .inpx{
        width: 70%;
      }
      .txt{
        padding-left: 10px;
      }
    }
  }
}
</style>