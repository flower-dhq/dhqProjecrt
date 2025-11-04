<template>
  <div>
    <Modal v-model="modal" width='700px' title="选择岗位（双击选择）" :mask-closable="false">
      <Row class="form-row">
        <i-col span="8">
          <Input v-model="postName" clearable placeholder="岗位名称"></Input>
        </i-col>
        <i-col span="8">
          <Button type="primary" @click="getDataList()">查询</Button>
        </i-col>
      </Row>
      <Table border :columns="columns" :data="tabelData" @on-row-dblclick="seletPostRow"></Table>
      <template #footer>
		    <Button type="primary" @click="ok"> 取消 </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getPostList } from '@/service/landcrm.js'

let modal = ref(false)

const columns = ref([
  { title: '岗位分组', key:'postGroupName',  align: 'center' },
  { title: '岗位名称', key:'postName',  align: 'center', width:180 },
])

const tabelData = ref([])
const postName = ref([])

  //获取缓存数据
const { USER_INFO } = window.GlobalProperties.$constant || {};
const { storageAction } = window.GlobalProperties.$utils || {};
const { userid } = storageAction({ action: 'get', key: USER_INFO }) || {};

// 方法
const ok=()=>{};

const handleOpen = () => {
  modal.value = true
  getDataList()
};

//获取岗位列表
const getDataList = () =>{
  let params = {
    data:{
      userId:userid,
      postName: postName.value
    }
  }
  getPostList(params).then(res =>{
    if(res.resultCode==200){
      tabelData.value=res.data
    }
  })
};

// 双击选择岗位
const seletPostRow = (row) => {
  emit("getPost", row)
  modal.value = false
}

const emit = defineEmits(["getPost"])

defineExpose({
  handleOpen
}) 

</script>

<style lang="scss" scoped>
@import "@/assets/style/table-common.scss";
.form-row{
  margin-bottom: 20px;
  .ivu-col{
    padding-right: 10px;
    .ivu-btn{
      margin-right: 10px;
    }
  }
}

</style>