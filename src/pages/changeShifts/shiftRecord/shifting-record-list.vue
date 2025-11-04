<template>
  <div style="background-color: #fff;min-height: calc(100vh - 110px);">
    <!-- 头部(名称+导出接口) -->
    <div style="font-size:16px;padding: 10px 15px;display: flex;justify-content: space-between;">
        <div style="margin-top: 8px;">交接班记录</div>
        <Button ghost type="primary" style="float:right;height: 29px;padding: 0 9px;" @click="exportExecl" label="small">导出</Button>
    </div>
    <div style="width: 100%; height: 10px;background-color: #f4f6fa;"></div>
    <!--筛选部分 -->
    <div style="margin:0px 0px 15px 0px;padding: 10px 15px 0px;width: 100%;" >

      <!-- 区域 -->
      <i-select v-model="searchMap.areaId" filterable style="width:22%;margin: 0 5px;" placeholder="区域" @on-change="changeArea" :clearable="areaarchTypes" @on-clear="cleararea">
        <i-option v-for="(item,index) in areaList" :value="item.areaId" :key="index">{{ item.areaName }}</i-option>
      </i-select>

      <!-- 项目 -->
      <i-select v-model="searchMap.projectId" filterable style="width:24%;margin: 0 5px;" placeholder="项目" clearable >
        <i-option v-for="(item,index) in projectList" :value="item.projectId" :key="index">{{ item.projectName }}</i-option>
      </i-select>

      <!-- 岗位 -->
      <i-select v-model="searchMap.post" filterable style="width:15%;margin: 0 5px;" placeholder="岗位" clearable>
        <i-option v-for="(item,index) in specialtyList" :value="item.postId" :key="index">{{ item.postName }}</i-option>
      </i-select>

      <!-- 交换班状态 -->
      <i-select v-model="searchMap.statusFlag" filterable style="width:11%;margin: 0 5px;" placeholder="交接班状态" clearable>
        <i-option :value="1" >已交班</i-option>
        <i-option :value="2" >已接班</i-option>
      </i-select>

      <!-- 交班人员 -->
      <Input v-model="searchMap.turnOverUserName" placeholder="交班人员" style="width: 11%;margin: 0 5px;height: 28px;" clearable/>

      <!-- 接班人员 -->
      <Input v-model="searchMap.takeOverUserName" placeholder="接班人员" style="width: 11%;margin: 0 5px;height: 28px;" clearable/>
      <!-- <i-select v-model="searchFrom.turnOverUserId" style="width:150px;" placeholder="交班人员" >
        <i-option v-for="(item,index) in takeOverUserList" :value="item.turnOverUserId" :key="index">{{ item.turnOverUserName }}</i-option>
      </i-select>

      <i-select v-model="searchFrom.takeOverUserId" style="width:150px;" placeholder="接班人员" >
        <i-option v-for="(item,index) in takeOverUserList" :value="item.takeOverUserId" :key="index">{{ item.takeOverUserName }}</i-option>
      </i-select> -->
     </div>
     
     <div style="margin:5px 0px 10px 15px;">
         <!-- 审阅状态 -->
         <i-select v-model="searchMap.approveFlag" filterable style="width:11%;margin: 0 5px;" placeholder="审阅状态" clearable>
        <i-option  :value="1" >待审阅</i-option>
        <i-option  :value="2" >已审阅</i-option>
      </i-select>
      <!-- 交班日期 -->
      <DatePicker  type="daterange"  placeholder="交班时间" transfer
                  style="width: 25%;margin: 0 5px;" v-model="setTimeList" 
                  format="yyyy-MM-dd" @on-change="setTime">
      </DatePicker>
      <Button type="primary" style="margin-left:10px;height: 29px;padding: 0 9px" label="small" @click="search()">查询</Button>
     </div>
    <!-- 表格区域 -->
    <div style="padding: 3px 15px 0px;">
      <Table
      :loading="loading"
      :width="width"
      :columns="shiftingRecordCol"
      :data="shiftingRecordData"
      :max-height="height"
      :height="495"
      :border="true"
      :pageSizeList="[10,20,50,100]"
    ></Table>
    <Page
      :size="pSize"
      ref="paging"
      :total="total"
      style="margin-top:15px;text-align: right"
      show-total
      show-sizer
      :page-size="pageSizes"
      :page-size-opts="pageSizeList"
      @on-change="changePage"
      @on-page-size-change="changePageSize"
    ></Page>
    </div>
    <Modal
        v-model="isShowReassign"
        title="转派"
        @on-ok="reassign"
        @on-cancel="isShowReassign = false">
        <Select v-model="reassignUserId" style="width:200px">
            <Option v-for="item in reassignUserList" :value="item.userId" :key="item.userId">{{ item.userName }}</Option>
        </Select>
    </Modal>
  </div>
</template>

<script setup>
import ViewUIPlus from 'view-ui-plus';
import { ref, onMounted,onBeforeMount ,resolveComponent} from 'vue';
import { useRouter } from "vue-router";
import { getShiftingRecordList, getAreaLists, getProjectLists ,getDictDetail,exportShiftingRecord, getUserButtons } from '@/service/landcrm';
import { getPostList } from '@/service/landcrm.js'
import { getEmployeeInfo, updateTbbShiftingRecord } from '@/service/officeSystem.js'

let reassignUserList = ref([])
let reassignUserId = ref("")
let isShowReassign = ref(false)
const router = useRouter();
let loading = ref(false)
let areaarchTypes = ref(false)
let isCharge = ref(false) //判断用户archTypes[1.集团 2.区域 3.地区公司 4.项目]是 1/2/3的时候可以不选项目
let total = ref(0)
let pageNum = ref(1)
let pageSize = ref(10)
let searchMap = ref({
                areaId:'',
                projectId:'',
                post:'',
                approveFlag:'',
                statusFlag:'',
                startTime:'',
                endTime:'',
                turnOverUserName:'',
                takeOverUserName:''
            })
let setTimeList = ref([])
let  initPage = ref(1)
            //交接班记录表头
let shiftingRecordCol = ref([
    {
        title:'操作',
        key:'action',
        align:'center',
        width:150,
        render:(h,params) => {
            return h('div',[
              h('span',{
                style:{
                    color:'#1890FF',
                    cursor:'pointer',
                    display:params.row.statusFlag == '已接班' && btnAuthority.value.approve && params.row.approveFlag!='审阅通过'&& params.row.approveFlag!='审阅驳回' ? '' : 'none',
                    marginRight: '10px'
                },
                onClick: () => { 
                              console.log(105)
                              openShiftingDetail(params.row.id,'sy')
                           }
            },'审阅'),

            h('span',{
                style:{
                    color:'#1890FF',
                    cursor:'pointer'
                },
                onClick: () => { 
                              console.log(105)
                              openShiftingDetail(params.row.id,'xq')
                           }
            },'详情'),

            h('span',{
                style:{
                    display:params.row.statusFlag == '已交班'? 'inline' : 'none',
                    marginLeft: '10px',
                    color:'#1890FF',
                    cursor:'pointer'
                },
                onClick: () => { 
                  showReassignModal(params.row)
                }
            },'转派'),

            ])
             
            
        }
    },
    {
        title:'区域',
        key:'areaName',
        align:'center',
        tooltip:true,
        width:150
    },
    {
        title:'项目',
        key:'projectName',
        align:'center',
        tooltip:true,
        width:150
    },
    {
        title:'岗位',
        key:'post',
        align:'center',
        width:150
    },
    {
        title:'交班人员',
        key:'turnOverUserName',
        align:'center',
        width:150
    },
    {
        title:'交班时间',
        key:'turnOverTime',
        align:'center',
        tooltip:true,
        width:200
    },
    {
        title:'交接班状态',
        key:'statusFlag',
        align:'center',
        width:200,
        render:(h,params) => {
            return h('div',{},[
                h('span',{},params.row.statusFlag),
                h(resolveComponent('Tag'),{
                    color:'#ffdf25',
                    type:'border',
                    style:{
                        marginLeft:'10px',
                        visibility:params.row.statusFlagText != '' ? 'visible':'hidden'
                    }
                },params.row.statusFlagText)
            ])
        }
    },
    {
        title:'接班人员',
        key:'takeOverUserName',
        align:'center',
        width:150
    },
    {
        title:'接班时间',
        key:'turnOverTime',
        align:'center',
        tooltip:true,
        width:200,
        render:(h,params) => {
            return h('div',params.row.takeOverTime ? params.row.takeOverTime : '-' )
        }
    },
    {
        title:'审阅状态',
        key:'approveFlag',
        align:'center',
        width:200,
        render:(h,params) => {
              return h('div',{},[
                h('span',{},params.row.approveFlag === '' ? '-' : params.row.approveFlag),
                h(resolveComponent('Tag'),{
                    type:'border',
                    color:'red',
                    style:{
                        marginLeft:'10px',
                        visibility:params.row.approveTimeoutFlagText != '' ? 'visible':'hidden'
                  }
              }, { default: () => params.row.approveTimeoutFlagText })
          ])
      }
  },
  {
            title:'审阅人',
            key:'approverName',
            align:'center',
            width:150,
            render:(h,params) => {
                return h('div',params.row.approverName ? params.row.approverName : '-' );
            }
        },
        {
            title:'审阅时间',
            key:'approveTime',
            align:'center',
            tooltip:true,
            width:200,
            render:(h,params) => {
                return h('div',params.row.approveTime ? params.row.approveTime : '-');
                    }
                },
            ])
            //交接班记录数据
let shiftingRecordData = ref([])
//区域列表
let areaList = ref([])
            //项目列表
let projectList = ref([])
            //专业列表
let specialtyList = ref([])
            //交班人列表
let turnOverUserList = ref([])
            //接班人列表
let takeOverUserList = ref([])
const postName = ref([])
const btnAuthority = ref({
  approve:false
}) //按钮权限

let currentRow = null

const showReassignModal = (data) => {
  requestReassignUserList()
  isShowReassign.value = true
  currentRow = data
}

const requestReassignUserList = () => {
  const { USER_INFO } = window.GlobalProperties.$constant || {};
  const { storageAction } = window.GlobalProperties.$utils || {};
  const { companyId } = storageAction({ action: 'get', key: USER_INFO }) || {};
  const params = {
    data: {
      companyId: companyId,
      projectId:"",
      userName: "",
    }
  }
  getEmployeeInfo(params).then(res => {
    reassignUserList.value = res.data
  })
}

const reassign = () => {
  const selectedUser = reassignUserList.value.find(user => user.userId === reassignUserId.value);
  const params = {
    data: {
      id: currentRow.id,
      takeOverUserId: reassignUserId.value,
      takeOverUserName: selectedUser.userName
    }
  }
  updateTbbShiftingRecord(params).then(res=>{
    if(res.status==200){
      ViewUIPlus.Message['success']({
        content: '转派成功',
        duration: 3
      })
      isShowReassign.value = false
      loadShiftingRecordData()
    }else{
      ViewUIPlus.Message['error']({
        content: res.message,
        duration: 3
      })
    }
  })
}
 /**
         * 打开交接班详情
         */
const  openShiftingDetail = (val,type) =>{
       let id = val
       let types = type
       console.log(292,id,types)
      window.open(`#/shiftDetails?id=${val}&type=${types}`);
        }
        /**
         * 搜索按钮点击事件
         */
const  search =() => {
            loadShiftingRecordData()
        }
        /**
         * 导出事件
         */
const  exportExecl = () => {
  const { USER_INFO } = window.GlobalProperties.$constant || {};
  const { storageAction } = window.GlobalProperties.$utils || {};
  const { companyId } = storageAction({ action: 'get', key: USER_INFO }) || {};
            let params = {
              data: {
                companyId: companyId,  //公司id
                areaId:searchMap.value.areaId,   //区域id
                projectId:searchMap.value.projectId, //项目id
                post: searchMap.value.post,    //专业编码
                approveFlag: searchMap.value.approveFlag,    //审阅状态
                statusFlag: searchMap.value.statusFlag,  //交接班状态
                startTime: searchMap.value.startTime,  //交班时间
                endTime: searchMap.value.endTime,  //交班时间
                turnOverUserName: searchMap.value.turnOverUserName,  //交班人名称
                takeOverUserName: searchMap.value.takeOverUserName   //接班人名称
              }

            }
          exportShiftingRecord(params)
        }

        /**
         * 改变页码事件
         */
const changePage = (val) =>{
            pageNum.value = val
            loadShiftingRecordData();
        }

        /**
         * 改变分页大小事件
         */
const changePageSize = (val) =>{
            pageSize.value = val
            loadShiftingRecordData()
        }
        /**
         * 加载交接班记录列表
         */
const loadShiftingRecordData =() =>{
  const { USER_INFO } = window.GlobalProperties.$constant || {};
  const { storageAction } = window.GlobalProperties.$utils || {};
  const { companyId } = storageAction({ action: 'get', key: USER_INFO }) || {};
            let parm = {
              data: {
                pageNum: pageNum.value,     //页码
                pageSize: pageSize.value,    //分页大小
                companyId: companyId,  //公司id
                areaId:searchMap.value.areaId,   //区域id
                projectId:searchMap.value.projectId, //项目id
                postId: searchMap.value.post,    //岗位
                approveFlag: searchMap.value.approveFlag,    //审阅状态
                statusFlag: searchMap.value.statusFlag,  //交接班状态
                startTime: searchMap.value.startTime,  //开始时间
                endTime: searchMap.value.endTime,  //结束时间
                turnOverUserName: searchMap.value.turnOverUserName,  //交班人名称
                takeOverUserName: searchMap.value.takeOverUserName,   //接班人名称
              } ,
              responseToast: false
            }
            loading.value = true
            getShiftingRecordList(parm).then(res =>{
              if(res.status === '200') {
                shiftingRecordData.value = res.data.records;
                total.value = res.data.total
              }else {
                ViewUIPlus.Message['error']({
                   content: res.message,
                   duration: 3
                })
              }
              loading.value = false
            })
        }

        /**
         * 改变区域事件
         */
const changeArea =() =>{
          if(searchMap.value.areaId && searchMap.value.areaId!=''&&searchMap.value.areaId!=undefined){
            loadProjectList(searchMap.value.areaId);
          }
        }

        /**
         * 加载区域
         */
const loadAreaList =() =>{
  const { USER_INFO ,AREALIST } = window.GlobalProperties.$constant || {};
  const { storageAction } = window.GlobalProperties.$utils || {};
  const { userid } = storageAction({ action: 'get', key: USER_INFO }) || {};
                let userId = userid;
                // let data = {
                //   userId : userid
                // }
        console.log(378,userId)
        return getAreaLists(userId).then(result => {
          if(result && result.resultTotal > 0) {
              storageAction({ key: AREALIST, value: JSON.stringify(result.items), action: 'set' });
                    areaList.value = result.items;
                    searchMap.value.areaId = result.items[0].areaId;
                    //加载项目
                    // loadProjectList(searchMap.value.areaId);
                } else {
                }
                });
        }

        /**
         * 加载项目
         */
const loadProjectList = (value) => { //设置项目数据
            projectList.value = [];
            if(value == "") {
              return false;
            }
  const { USER_INFO ,PROJECTLIST } = window.GlobalProperties.$constant || {};
  const { storageAction } = window.GlobalProperties.$utils || {};
  const { userid } = storageAction({ action: 'get', key: USER_INFO }) || {};
      return getProjectLists(userid, value).then(result => {
          if (result && result.resultTotal > 0) {
            storageAction({ key: PROJECTLIST, value: JSON.stringify(result.items), action: 'set' });
            projectList.value = result.items;
            searchMap.value.projectId = result.items[0].projectId;
          }else {
            searchMap.value.projectId = '';

          }

           //初始化数据
          // loadShiftingRecordData()

        })
      }

 //获取岗位列表
const getDataList = () =>{

  const { USER_INFO ,PROJECTLIST } = window.GlobalProperties.$constant || {};
  const { storageAction } = window.GlobalProperties.$utils || {};
  const { userid } = storageAction({ action: 'get', key: USER_INFO }) || {};
  let params = {
    data:{
      userId:userid,
      postName: postName.value
    }
  }
  getPostList(params).then(res =>{
    if(res.resultCode==200){
      specialtyList.value=res.data
    }
  })
}
     

const cleararea =() =>{
          searchMap.valueareaId = ''
          searchMap.value.projectId = ''
          projectList.value=[]
        }
const reBegin = () =>{
      hisAreaAndProject.value = localStorage.hisAreaAndProject ? JSON.parse(localStorage.hisAreaAndProject) : {}
      areaList.value = JSON.parse(localStorage.areaList);
      if (self.areaList.length > 0) {
        if (self.hisAreaAndProject.hisAreaId == undefined || self.hisAreaAndProject.hisAreaId == '') {
          self.hisAreaAndProject.hisAreaId = self.areaList[0].areaId;
        }
       searchMap.value.areaId = self.hisAreaAndProject.hisAreaId;
       projectList = JSON.parse(localStorage.projectList);
       if (self.projectList.length > 0) {
         var key = self.searchMap.areaId.toString()
         if(self.hisAreaAndProject[key]!=undefined){
           self.searchMap.projectId =self.hisAreaAndProject[key];
           localStorage.hisAreaAndProject = JSON.stringify(self.hisAreaAndProject)
         }else{
           self.searchMap.projectId = self.projectList[0].projectId;
         }
       }
       loadShiftingRecordData()
      }else{
        loadAreaAndProject();
      }
      var archTypes = localStorage.archTypes;
      if(typeof(archTypes)!="undefined" && archTypes!="") {
      	if(archTypes.indexOf("1")>-1 || archTypes.indexOf("2")>-1 || archTypes.indexOf("3")>-1) {
      		this.isCharge = true;
      	}
        archTypes.split(",").forEach((item)=>{
          if(item=='1'){
            this.areaarchTypes = true
          }
        })
      }
}
const  setTime = (data) =>{
  console.log(483,data)
  searchMap.value.startTime = data[0]
  searchMap.value.endTime = data[1]
    if (data[0] && data[1]) {
      searchMap.value.startTime = data[0] + ' 00:00:00';
      searchMap.value.endTime = data[1] + ' 23:59:59';
    }
    }

const loadAreaAndProject = async () => {
  await loadAreaList()
  const areaId = searchMap.value.areaId
  await loadProjectList(areaId);
}
//获取按钮权限
const getButtionAuthority = async () =>{
  const { USER_INFO } = window.GlobalProperties.$constant || {};
  const { storageAction } = window.GlobalProperties.$utils || {};
  const { userid } = storageAction({ action: 'get', key: USER_INFO }) || {};
  let params = {
    data:{
      userId: userid,
      menuId:sessionStorage.getItem('child_id')
    }
  }
  return getUserButtons(params).then(res =>{
    if(res.resultCode==200){
      let list = res.data
      list.forEach(item =>{
        if(item.code=='approve_read'){
          btnAuthority.value.approve = true
        }
      })
    }
  })
}

// const  getData = (pageNum) => {
//       dataCurrent.value = tableData.value.slice(
//         pageSize.value * (pageNum.value - 1),
//         pageSize.value * pageNum.value
//       )
//     }
//     /* 改变当前页 */
// const  changePage = (value) => {
//       this.$emit('changePage', value)
//     }

//     // 每页显示的数据条数
// const _nowPageSize = (index) => {
//       // 实时获取当前需要显示的条数
//       pageSize.value = index
//       this.$emit('changePageSize', index)
//     }
//初始化
onMounted(async () => {
  getDataList();
  await getButtionAuthority()
  await loadAreaAndProject()
  search()
  // pageSize.value = pageSizes
  // getData(initPage)
  // loadShiftingRecordData();

});
// 在组件挂载前
onBeforeMount(() => {
});



</script>

<style scoped lang="scss">

::v-deep .ivu-select-single .ivu-select-selection {
height: 28px !important;
line-height: 28px !important;
}
::v-deep .ivu-input {
  height: 28px !important;
line-height: 28px !important;

}
::v-deep .ivu-input-icon {
  line-height: 29px !important;
}
::v-deep .ivu-select-input {
  height: 28px !important;
  line-height: 28px !important;

}

::v-deep  .ivu-input-suffix i {
  line-height: 28px !important;

}
</style>
