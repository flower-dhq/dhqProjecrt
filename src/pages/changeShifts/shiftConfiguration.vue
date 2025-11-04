<template>
  <div class="home" style="background-color: #fff;height: 100vh;">
  <div style="padding: 10px;">
    <div class="workstationlist tableview leftlist borderded">
      <div class="l-title">
        <span class="title" >组织架构</span>
      </div>
      <div style="height: calc(100vh - 178px); overflow-y:auto; overflow-x:hidden;">
        <Tree :data="baseData" :render="renderContent" class="left-tree"   style=" cursor: pointer; "></Tree>
      </div>
    </div>
    <div style="width: 15px;height:  100vh;    float: left;display: inline-block;  margin-top: -16px;background: rgb(244, 246, 250);"></div>
    <div class="borderded rightlist">
      <div style="height:45px;border-bottom: 1px solid #eeeeee;line-height: 45px;">
        <div style="float: left;font-size: 16px;">
          交接班配置
        </div>
      </div>
      <div class="rightTable">
        <Table border ref="selection" :columns="columns" :data="shiftingElement"></Table>
      </div>
    </div>
  
    <Modal :mask-closable="false" v-model="editModel" width = '600px' @on-cancel="closeServerTypeModal">
      <template #header>
                <p>编辑</p>
      </template>
      <Form ref="addParams" :model="addParams" style="width: 75%;margin: auto;font-size: 15px; padding-top: 10px;color: #333333;">
        <table cellpadding="0" cellspacing="0">
          <tr style="height: 40px;">
            <th style="width: 20%;text-align: right;">岗位：</th>
            <td style="width: 70%;padding-left: 20px;color:#bebebe">{{currentPostName}}</td>
          </tr>
          <tr style="margin-top: 20px;">
            <th style="vertical-align: top;text-align: right;">交接物品：</th>
            <td class="tabIt">
              <div class="add-icon-box">
                <Icon @click="addDataSet" class="add-icon" size='22' color='#1890ff' type='ios-add-circle-outline'></Icon>
              </div>
              <Table height="200"  disabled-hover="true" ref="selection"  :show-header="false" :columns="colSet"  :data="dataSet" @on-select="onCheckbox" @on-select-cancel="unCheckbox"></Table>
            </td>
          </tr>
        </table>
      </Form>
      <template #footer>
        <div style="text-align: center;">
          <Button type="primary" ghost @click="closeServerTypeModal()" style="width: 60px;margin-right: 30px;">取消</Button>
          <Button type="primary" @click="saveServerType()" style="width: 60px;">确认</Button>
        </div>
       
      </template>
    </Modal>

    <modal v-model="showData.state" :mask-closable="false" width = '500px' :title="showData.type == 'add' ? '添加物品' : '编辑物品'" :styles="{top: '200px'}">
          <div style="display: flex;padding: 10px 20px; align-items: center;">
            <span style="width: 30%;">物品名称：</span><Input v-model="showDataInfo.elementContent"  placeholder="请输入" clearable />
          </div>
          <template #footer>
            <div style="text-align: center;">
            <Button type="primary" ghost @click="closeShowData()" style="width: 60px;margin-right: 30px;">取消</Button>
            <Button type="primary" @click="saveShowData()" style="width: 60px;">确认</Button>
          </div>
          </template>
    </modal>
    
  </div>
</div>
</template>

<script setup>
import ViewUIPlus, { Input } from 'view-ui-plus';
import { resolveComponent } from 'vue';
import { ref, onMounted,onBeforeMount } from 'vue';
import { getArchInfo,getShiftingElement ,getShiftingDetail,saveShifting} from '@/service/landcrm';
//数据定义
let  baseData = ref([])
let shiftingElement = ref([])
let   addParams = ref({
          specialtyCode:'',
          groupTypeCode:'',
          groupTypeName:'',
          groupElementType:'',
          showStage:'',
          showStageList:[],
          editStageList:[],
        })
let  editModel = ref(false)
let currentElem = ref({
  currentProjectId:'',
  currentPostId:'',
  shiftElementList:[]
})
let columns = ref([
         {
          title: '岗位',
          key: 'postName',
          align: 'center',
        },
        {
          title: '交接物品',
          key: 'shiftElement',
          align: 'center',
        },
        {
          title: '操作',
          align: 'center',
          render:(h,params) => {
                        return h('div',{
                            style:{
                                color:'#1890FF',
                                cursor:'pointer'
                            },
                            onClick: () => { 
                              console.log(105,params)
                              openShiftingEdit(params.row)
                           }
                        },'编辑')
                    }
        }   
])

let   colSet = ref([
          {
          type: 'selection',
          align: 'center',
          width: 30,
          },
            {title: '物品', key: 'elementContent', align: 'left'},
            {title: '操作', key: 'title', align: 'center',width:100,
              render: (h, params) => {
                return h('div', [
                  h(resolveComponent('Tooltip'), {
                      content: '编辑'
                  }, [
                    h(resolveComponent('Icon'), {
                      type: 'ios-create-outline',
                      style: {
                        fontSize: '22px',
                        color: '#1890ff',
                        padding: '3px !important',
                      },
                      onClick: () => {
                        console.log(148,dataSet.value,dataSet.value.length,params,params.index)
                        editDataSet(params.row,params.index)
                    }
                    })]),
                  //   h(resolveComponent('Tooltip'), {
                  //     content: '新增'
                  // }, [
                  //   h(resolveComponent('Icon'), {   
                  //     type: 'ios-add-circle-outline',
                  //     style: {
                  //       fontSize: '22px',
                  //       color: '#1890ff',
                  //       padding: '3px !important',
                  //       display: dataSet.value.length - 1 == params.index ? '' : 'none'
                  //     },
                  //     onClick: () => {
                  //       console.log(136,params,params.index)
                  //       addDataSet(params.row)
                  //             }
                  //   })]),
                  h(resolveComponent('Tooltip'), {
                      content: '删除'
                  }, [
                    h(resolveComponent('Icon'), {   
                      type: 'ios-trash',
                      style: {
                        fontSize: '22px',
                        color: '#1890ff',
                        padding: '3px !important',
                       /* display: self.buttonStatus.delete*/
                      },
                      onClick: () => {
                            // this.$Modal.confirm({
                          //   title: '删除',
                          //   content: '<p>确定删除此物品吗？</p>',
                          //   onOk: () => {
                              deleteEvent(params.row,params.index);
                          //   },
                          //   onCancel: () => {

                          //   }
                          // });
                              }
                    })])
                   
                ])
              }
            },
          ])
let  dataSet = ref([
{
        "labelId": "745",
        "firstId": "3",
        "firstName": "业主标签",
        "secondId": "2",
        "secondName": "房间管理-业主标签",
        "thirdId": "1",
        "thirdName": "客户关系",
        "dimensionId": "2",
        "dimensionName": "年龄",
        "autoTag": "1",
        "dimensionType": "0",
        "tag": "青年",
        "deleted": 1,
        "state": 1,
        "companyId": "300"
    },
    {
        "labelId": "752",
        "firstId": "3",
        "firstName": "业主标签",
        "secondId": "2",
        "secondName": "房间管理-业主标签",
        "thirdId": "1",
        "thirdName": "客户关系",
        "dimensionId": "2",
        "dimensionName": "年龄",
        "autoTag": "1",
        "dimensionType": "0",
        "tag": "壮年",
        "deleted": 1,
        "state": 1,
        "companyId": "300"
    }
])

let showData = ref({
  type: null,
  state: false
})
let showDataInfo = ref({
  id:'',
  ID:'',
  elementContent:'',
  state:'0'
})
let currentPostName = ref('')
//方法
const initData = () => {
  const { USER_INFO } = window.GlobalProperties.$constant || {};
  const { storageAction } = window.GlobalProperties.$utils || {};
  const { userid } = storageAction({ action: 'get', key: USER_INFO }) || {};
  const params = {
    data: {
      userId: userid,
    },
  };
  getArchInfo(params).then((res) => {
    baseData.value = [res.data];
  })
};

const renderContent = (h, {root, node, data}) => {
        return h('span', {
          attrs: {
            class: 'blankcolor' + data.id,
          },
          style: {
            cursor: 'pointer',
            display: 'inline-block',
            position: 'relative',
            width: 'calc(100% + 2px)',
            height: '35px',
            lineHeight: '35px',
            marginLeft: '-18px',
            paddingLeft: '22px',
            cursor: 'pointer',
            fontSize: '13px'
          },
          on: {
            mouseout: () => {
              $("span.display" + data.id).css({'display': 'none'});
              $("span.displayother" + data.id).css({'display': 'inline-block','line-height': '15px'});
              $('.blankcolor' + data.id).css({'color': 'black', 'background': 'transparent'});
              if (this.temp != '') {
                $('.blankcolor' + this.temp).css({'color': '#fff', 'background': '#57c5f7'});
              }
            },
            mouseover: () => {

              $("span.display" + data.id).css({'display': 'inline-block'});
              $("span.displayother" + data.id).css({'display': 'none'});
              $('.blankcolor' + data.id).css({'color': 'black', 'background': '#f0f0f0'});
              if (this.temp != '') {
                $('.blankcolor' + this.temp).css({'color': '#fff', 'background': '#57c5f7'});
              }
            }
          },
          onClick: () => { console.log(178,data,data.id,data.children) 
            if(data.children == undefined) {
              curNodeClicked(data)
            }else {
              shiftingElement.value = []
              ViewUIPlus.Message['info']({
                content: "仅支持项目级进行配置参数",
                duration: 2
              })
            }
          }
        }, [
          h('span', [
            h('span', {
              attrs: {
                class: 'pxw' + data.id,
                title: data.title
              },
              style: {
                display: 'inline-block',
                // width: '70%',
                'overflow': 'hidden',
                'white-space': 'nowrap',
                'text-overflow': 'ellipsis',
              },
              on: {
                click: () => {
                  console.log(290,data)
                  let self = this;
                  if (self.temp != '') {
                    $('.blankcolor' + self.temp).css({'color': 'black', 'background': 'transparent'});
                  }
                  $('.blankcolor' + data.id).css({'color': '#fff', 'background': '#57c5f7'});
                  self.temp = data.id;
                },
              }
            }, data.menuName),
            // h('span', {
            //   attrs: {
            //     class: 'displayother' + data.id
            //   },
            //    style: {
            //      marginLeft: '10px',
            //      border: '1px #AED3F7 solid',
            //      borderColor: '#AED3F7',
            //      color: '#AED3F7',
            //      fontSize: '8px',
            //      borderRadius: '3px',
            //      paddingLeft: '3px',
            //      paddingRight: '3px',
            //      position:'relative',
            //      top:'-10px',
            //      // display:params.row.isPubArea==1?'inline-block':'none',
            //    },
            //  }, data.archType == 1 ? '集团':data.archType == 2 ? '项目':data.archType == 75 ? '区域' :data.archType == 9 ? '部门':'其他'),
            h('span', {
              attrs: {
                class: 'display' + data.id
              },
              style: {
                display: 'none',
                float: 'right',
                position: 'absolute',
                right: '18px',
                marginTop: '2px'
              }
            })
          ])])
      }
const   curNodeClicked = (data) => {
  currentElem.value.currentProjectId = data.id
       let params = {
         data: {
           archId : data.id,
           pageNum : 1, //pageNum 为 当前页  pageSize 为 页数
           pageSize : 10
         }
       }
       getShiftingElement(params).then((result) => {
         if (result.status == '200') {
            let element = result.data.records
            element.forEach(ele => {
              let elements
              if(ele.shiftElementList.length > 0){
                 elements = ele.shiftElementList.map(item => item.elementContent).join(';');
                 ele = Object.defineProperty(ele, 'shiftElement' ,{
                    value: elements,
                    writable: true,
                    enumerable: true,
                    configurable: true
                  });
              }
            });
            shiftingElement.value = JSON.parse(JSON.stringify(element))
            
          } else {
            ViewUIPlus.Message['error']({
              content: result.message,
              duration: 3
           })
          }
       }).catch((error) => {
        ViewUIPlus.Message['error']({
              content: error,
              duration: 3
           })
      
      }) 
      return shiftingElement
      }
const   openShiftingEdit = (data) => {
  currentPostName.value = data.postName
      getShiftDetail(data)
      editModel.value = true
      }
const  closeServerTypeModal = () => {
  editModel.value = false;
  showData.value.state = false
  showData.value.type = null
  showDataInfo.value.id = ''
  showDataInfo.value.ID = ''
  showDataInfo.value.elementContent = ''
  showDataInfo.value.state = '2'
  currentElem.value.currentPostId = ''
  // currentElem.value.currentProjectId = ''
  currentElem.value.shiftElementList = []
      }
const getShiftDetail = (dat) =>{
  currentElem.value.currentPostId = dat.postId
  let params = {
         data: {
           projectId : currentElem.value.currentProjectId,
           postId : dat.postId
         }
       }
       getShiftingDetail(params).then((result) => {
         if (result.status == '200') {
          currentElem.value.shiftElementList = result.data.shiftElementList
          currentElem.value.shiftElementList.forEach(item => {
            if(item.state == '1'){
              item._checked = true
            }
          })
          dataSet.value = currentElem.value.shiftElementList
         }else {
          ViewUIPlus.Message['error']({
              content: result.message,
              duration: 3
           })
         }
        }).catch(e =>{
          console.log(e)
        })
}
const    saveServerType = () =>{
       let parm = {
        data: {
          archId :currentElem.value.currentProjectId, //岗位id
          postId: currentElem.value.currentPostId,
          shiftElementList: currentElem.value.shiftElementList
        }
       }
        saveShifting(parm).then(res=>{
          if(res.status=='200'){
            curNodeClicked({id : currentElem.value.currentProjectId})
            closeServerTypeModal()
            setTimeout(()=>{
              ViewUIPlus.Message['success']({
                 content: '编辑成功！',
                })
            },200)          
          }else{
            ViewUIPlus.Message['error']({
                 content: res.message
                })
          }
        })
      }
const onCheckbox = (selection,row) => {
  currentElem.value.shiftElementList.forEach((obj,index)=> {
    if (obj.elementContent === row.elementContent) {
         obj.state = '1'
         obj._checked = true
      }
    });
}
const unCheckbox = (selection,row) => {
   currentElem.value.shiftElementList.forEach((obj,index)=> {
    if (obj.elementContent === row.elementContent) {
         obj.state = '2'
         obj._checked = false
      }
    });
}
const addDataSet = () => {
  showData.value.state = true
  showData.value.type = 'add'
}
const editDataSet = (data) => {
  showData.value.state = true
  showData.value.type = 'edit'
  showDataInfo.value.id = data.id
  showDataInfo.value.ID = data.index
  showDataInfo.value.elementContent = data.elementContent
  showDataInfo.value.state = data.state
}
const deleteEvent = (data,index) =>{
  dataSet.value.splice(index, 1);
}
const closeShowData = () =>{
  showData.value.state = false
  showData.value.type = null
  showDataInfo.value.id = ''
  showDataInfo.value.ID = ''
  showDataInfo.value.elementContent = ''
  showDataInfo.value.state = '2'
}
const saveShowData = () =>{
  if(showDataInfo.value.elementContent == ''){
    ViewUIPlus.Message['warning']({
        content: '交接物品不能为空！',
      })
    return
  }
  if(showData.value.type == 'edit'){
    currentElem.value.shiftElementList.forEach((obj,index)=> {
    if (obj.id === showDataInfo.value.id) {
      if(obj.elementContent === showDataInfo.value.elementContent){
         console.log(454,obj.elementContent)
         obj.elementContent = obj.elementContent
         closeShowData()
         return;
      }else {
        obj.elementContent = showDataInfo.value.elementContent;
       }
      }
    });
    
  }else if(showData.value.type == 'add'){
    currentElem.value.shiftElementList.push({
      elementContent : showDataInfo.value.elementContent,
      state: '2'
    })
  }
  closeShowData()
}

//初始化
onMounted(() => {
  initData();
});
// 在组件挂载前
onBeforeMount(() => {
});
</script>
<style scoped lang="scss">
  .rightTable {
    margin-top: 16px;
  }
  .rightTable :deep(.ivu-table-wrapper > .ivu-table > .ivu-table-body){
    height: calc(100vh - 268px);
    overflow-y: scroll;
    /*overflow-x: hidden;*/
  }
  :deep(.ivu-tree ul li){
    margin: 0 !important;
  }
  :deep( .left-tree > .ivu-tree-children  > li > .ivu-tree-arrow){
    position: relative;
    z-index: 1;
    transform: translateY(5px);
  }
  :deep( .left-tree li .ivu-tree-arrow) {
    position: relative;
    z-index: 1;
    transform: translateY(5px);
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
    margin: 0;
  }
  .ivu-input-number{
    width: 100% !important;
    border: 1px solid #ffffff;
  }

  .ivu-inputs :deep( .ivu-input-number-handler-wrap){
    display: none !important;
  }
  
  .ivu-table-overflowY{
    margin-right: -10px;
  }
  .borderded {
    overflow: hidden;
  }

  .rightlist {
    width: 76.3%;
    /*margin-left: 15px;*/
    padding: 0 10px 10px 15px;
    float: left;
    /*height:600px;*/
    height: calc(100vh - 130px);
  }

  .leftlist {
    margin-top: 0;
    width: 22%;
    float: left;
    /*height:600px;*/
    height: calc(100vh - 130px);
    padding-left: 5px;
  }

  .selectedNode {
    color: #0000CD
  }
  .treeNode {
    text-decoration: none;
    height: 19px;
    color: #000000;
  }
  .treeNode:hover{
    text-decoration: none;
    background-color: #f0f0f0;
  }
  .treeNode:hover .action{
    display: inline-block;
  }
  .action {
    display: none;
    background: #F0F0F0;
  }
  .title {
    height: 22px;
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
    font-style: normal;
    font-size: 17px;
  }
  :deep(.ivu-select-input ){
    font-size: 13px;
  }
  :deep(.ivu-select-input){
    color: #515a6e;
  }
  :deep(.ivu-tree-arrow i) {
    vertical-align: -webkit-baseline-middle;
  }
  :deep(.ivu-tree-title) {
    width: 100%;
  }
  .tabIt {
    font-size: 15px
  }
  .tabIt :deep(.ivu-table td ){
        height: 28px;
        font-size: 14px;
      border-bottom: none; /* 移除下划线 */

    }
  .tabIt  :deep(.ivu-table:before) {
      background-color: #fff;
    }
.l-title{
  padding: 5px 0 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
}
.add-icon-box{
  text-align: right;
  padding-bottom: 12px;
  .add-icon{
    cursor: pointer;
  }
}
</style>
