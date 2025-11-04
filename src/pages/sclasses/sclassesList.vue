<template>
  <div class="container" style="height: 100vh;">
    <Card>
      <template #title>
        <div class="title">班次列表</div> 
      </template>
      <template #extra>
        <Button type="primary" @click="showModal">新增班次</Button>
      </template>
      <Row :gutter="16">
        <Col span="4">
          <Select clearable transfer filterable v-model="searchForm.areaId" placeholder="区域" @on-change="requestProjectList" @on-clear="areaCleared">
            <Option v-for="(item, index) in areaList" :key="index" :value="item.areaId">{{ item.areaName }}
            </Option>
          </Select>
        </Col>
        <Col span="4">
          <Select clearable transfer filterable v-model="searchForm.projectId" placeholder="项目" >
            <Option v-for="(item, index) in projectList" :key="index" :value="item.projectId">{{ item.projectName }}
            </Option>
          </Select>
        </Col>
        <Col span="3">
          <Input v-model="searchForm.shiftName" placeholder="班次名称"  clearable/>
        </Col>
        <Col span="2">
          <Button type="primary" @click="searchTable">查询</Button>
        </Col>
      </Row>
    </Card>
    <Card style="margin-top: 30px;">
      <Table :columns="columns" :data="tableData" :pageSizeList="[10,20,50,100]"></Table>
      <Page
        v-model="pageNum"
        :size="pageSize"
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
    </Card>

    <Modal :mask-closable="false" v-model="isShowModal" width = '800px' @on-cancel="closeServerTypeModal">
      <template #header>
        <p class="title">{{ modalTitle }}</p>
      </template>
      <div>
        <div style="margin-bottom: 20px;">
          <p class="model-title">基础信息</p>
          <table>
            <tr>
              <td class="top-td" style="border-left:1px solid rgb(236,236,236);border-right:1px solid rgb(236,236,236);width:25%">区域名称<span style="color: red;">*</span></td>
              <td class="titlestd" style="width: 25%;padding: 10px;">
                <Select clearable transfer filterable v-model="modalForm.areaId" placeholder="请选择区域名称" @on-change="modalRequestProjectList(1)" @on-clear="modalAreaCleared">
                  <Option v-for="(item, index) in modalAreaList" :key="index" :value="item.areaId">{{ item.areaName }}
                  </Option>
                </Select>
              </td>
              <td class="top-td" style="border-left:1px solid rgb(236,236,236);border-right:1px solid rgb(236,236,236);width:25%">项目名称<span style="color: red;">*</span></td>
              <td class="titlestd" style="width: 25%;padding: 10px;">
                <Select clearable transfer filterable v-model="modalForm.projectId" placeholder="请选择项目名称" >
                  <Option v-for="(item, index) in modalProjectList" :key="index" :value="item.projectId">{{ item.projectName }}
                  </Option>
                </Select>
              </td>
            </tr>
            <tr>
              <td class="top-td" style="border-left:1px solid rgb(236,236,236);border-right:1px solid rgb(236,236,236);width:25%,border-bottom:1px solid rgb(236,236,236);">班次名称<span style="color: red;">*</span></td>
              <td colspan="3" class="titlestd" style="border-bottom:1px solid rgb(236,236,236);padding: 10px;"><Input v-model="modalForm.shiftName" placeholder="请输入班次名称" show-word-limit maxlength="10"/></td>
            </tr>
          </table>
        </div>
        <div>
          <p class="model-title">
            考勤时间
            <Button type="primary"  @click="addTime">添加时段</Button>
          </p>
          <table class="borderTable" style="width: 100%;"  align='center' >
            <tbody>
              <tr class="table-tr" height='30px' >
                <th width="20%" style="text-align: center;"><strong>操作</strong></th>
                <th width="10%" style="text-align: center;"><strong>时段</strong></th>
                <th width="35%" style="text-align: center;"><strong>上班时间</strong></th>
                <th width="35%" style="text-align: center;"><strong>下班时间</strong></th>
              </tr>
              <tr v-for="(item,index) in shiftSettingsRecordList">
                <td style="text-align: center;">
                    <span v-if="index>0" @click="delTemplete(item,index)" size="large" style="color: #0068cf;cursor: pointer;">删除</span>
                  </td>
                  <td width="10%">
                    <div style="text-align: center;">
                      {{ index + 1 }}
                    </div>
                  </td>
                  <td class="wid-30">
                    <div class="person_overflow">
                      <TimePicker format="HH:mm" placeholder="上班时间" v-model="item.startTime" @on-change="startNextDay(item, index)"/>
                      <Tag color="red" v-if="0 < index && item.isNextDayStartTime" style="margin-left: 10px;">次日</Tag>
                    </div>
                  </td>
                  <td class="wid-30">
                    <div class="person_overflow">
                      <TimePicker format="HH:mm" placeholder="下班时间" v-model="item.endTime"  @on-change="endNextDay(item, index)"/>
                      <Tag color="red" v-if="item.isNextDayEndTime" style="margin-left: 10px;">次日</Tag>
                    </div>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <template #footer>
        <div style="text-align: center;">
          <Button type="primary" ghost @click="isShowModal = false" style="width: 60px;margin-right: 30px;">取消</Button>
          <Button type="primary" @click="saveSclass" style="width: 60px;">确认</Button>
        </div>
       
      </template>
    </Modal>
  </div>
</template>

<script setup>
  import ViewUIPlus from 'view-ui-plus'
  import { ref, onMounted, onBeforeMount, reactive } from 'vue'
  import { getShiftingRecordList, getAreaLists, getProjectLists, getDictDetail, exportShiftingRecord } from '@/service/landcrm'
  import { getShiftSettingsList, saveSclassOrUpdate, getSclassById, deleteSclassById } from '@/service/officeSystem'

  // 当前月份
  const currentMonth = () => {
    const date = new Date();
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return `${year}/${month}`
  }

  const data = reactive({
    name: '张三',
  })

  let importModel = reactive({
    isShow: false,
  });

  let searchForm = reactive({
    areaId: '',
    projectId: '',
    shiftName: '',
  })

  let isShowModal = ref(false)
  let modalTitle = ref('新增班次')
  let modalForm = reactive({
    areaId: '',
    projectId: '',
    shiftName: '',
  })

  let columns = ref([
    {
      title: '操作',
      key: 'option',
      align: 'center',
      width: 200,
      render: (h, params) => {
        return h('div', [
          h('span', {
            style: {
              color:'#1890FF',
              cursor:'pointer',
              marginRight: '10px',
              display: params.row.shiftName == '=' ? 'none' : 'inline-block'
            },
            onClick: () => {
              editModal(params.row)
            }
          }, '编辑'),
          h('span', {
            style: {
              color:'#1890FF',
              cursor:'pointer',
              marginRight: '5px',
              display: params.row.shiftName == '=' ? 'none' : 'inline-block'
            },
            onClick: () => {
              deleteList(params.row)
            }
          }, '删除'),
        ]);
      }
    },
    {
      title: '区域名称',
      key: 'areaName',
      align: 'center',
    },
    {
      title: '项目名称',
      key: 'projectName',
      align: 'center',
    },
    {
      title: '班次名称',
      key: 'shiftName',
      align: 'center',
    },
    {
      title: '考勤时间',
      key: 'attendanceTime',
      align: 'center',
      width: 300,
    },{
      title: '创建人',
      key: 'operatorName',
      align: 'center',
      width: 100,
    },{
      title: '创建时间',
      key: 'createDate',
      align: 'center',
    },
  ])

  let areaList = ref([])
  let projectList = ref([])
  let modalAreaList = ref([])
  let modalProjectList = ref([])
  let departmentList = ref([])
  let shiftSettingsRecordList = reactive([{
    startTime: '09:00',
    endTime: '18:00',
    isNextDayStartTime: 0,
    isNextDayEndTime: 0,
  }])
  let tableData = ref([])
  let pageNum = ref(1)
  let pageSize = ref(10)
  let total = ref(0)

  const getUserId = () => {
    const { USER_INFO ,AREALIST } = window.GlobalProperties.$constant || {};
  
    const { storageAction } = window.GlobalProperties.$utils || {}
    const { userid } = storageAction({ action: 'get', key: USER_INFO }) || {}
    return userid
  }

  const getUserName = () => {
    const { USER_INFO ,AREALIST } = window.GlobalProperties.$constant || {};
  
    const { storageAction } = window.GlobalProperties.$utils || {}
    const { userName } = storageAction({ action: 'get', key: USER_INFO }) || {}
    return userName
  }

  // 加载区域
  const loadAreaList = async() =>{
    const { USER_INFO ,AREALIST } = window.GlobalProperties.$constant || {};
    const { storageAction } = window.GlobalProperties.$utils || {}
    let userId = getUserId()
    console.log(378,userId)
    getAreaLists(userId).then(result => {
      if(result && result.resultTotal > 0) {
        storageAction({ key: AREALIST, value: JSON.stringify(result.items), action: 'set' });
        modalAreaList.value = result.items;
        //加载项目
        areaList.value = result.items;
        searchForm.areaId = result.items[0].areaId;
        //加载项目
        loadProjectList(searchForm.areaId);
      }
    });
  }

  // 加载项目
  const loadProjectList = (value) => { //设置项目数据
    projectList.value = [];
    if(!value) {
      return false;
    }
    const { USER_INFO ,PROJECTLIST } = window.GlobalProperties.$constant || {};
    const { storageAction } = window.GlobalProperties.$utils || {};
    const { userid } = storageAction({ action: 'get', key: USER_INFO }) || {};
    getProjectLists(userid, value).then(result => {
      if (result && result.resultTotal > 0) {
        storageAction({ key: PROJECTLIST, value: JSON.stringify(result.items), action: 'set' });
        projectList.value = result.items;
        searchForm.projectId = result.items[0].projectId;
        searchTable()
      }
    })
  }

  // 切换区域
  const requestProjectList = () =>{
    const { USER_INFO ,PROJECTLIST } = window.GlobalProperties.$constant || {}
    const { storageAction } = window.GlobalProperties.$utils || {}
    const { userid } = storageAction({ action: 'get', key: USER_INFO }) || {}
    projectList.value = []
    searchForm.projectId = ''
    getProjectLists(userid, searchForm.areaId).then((res)=>{
      searchForm.projectId = res.items[0].projectId
      projectList.value = res.items
    })
  }

  // 切换弹窗区域   flag 手动触发或者被动触发
  const modalRequestProjectList = (flag = '') =>{
    const { USER_INFO ,PROJECTLIST } = window.GlobalProperties.$constant || {}
    const { storageAction } = window.GlobalProperties.$utils || {}
    const { userid } = storageAction({ action: 'get', key: USER_INFO }) || {}
    if (flag) modalForm.projectId = ''
    modalProjectList.value = []
    getProjectLists(userid, modalForm.areaId).then((res)=>{
      if (flag) {
        modalForm.projectId = res.items[0]?.projectId
      }else {
        modalForm.projectId = modalForm.projectId ? modalForm.projectId : res.items[0]?.projectId 
      }
      modalProjectList.value = res.items
    })
  }

  let areaCleared = () => {
    projectList.value = []
    searchForm.projectId = ''
    searchForm.areaId = ''
  }

  let modalAreaCleared = () => {
    modalProjectList.value = []
    modalForm.projectId = ''
    modalForm.areaId = ''
  }
  //查询
  let searchTable = () => {
    pageNum.value = 1
    searchList()
  }

  //获取列表
  let searchList = () => {
    let params = {
      data: {
        ...searchForm 
      }
    }
    let size = pageSize.value
    let current = pageNum.value
    console.log('params==', params)
    let userId = getUserId()
    getShiftSettingsList(params, size, current, userId).then(res => {
      console.log('res==', res)
      if (res.status == 200) {
        tableData.value = res.data?.records
        // tableData.value.push({
        //   areaName: '--',
        //   projectName: '--',
        //   shiftName: '=',
        //   attendanceTime: '休息'
        // })
        total.value = res.data?.total
        // total.value++
      }
    })
  }

  //新增班次
  let showModal = () => {
    modalProjectList.value = []
    modalForm.projectId = ''
    modalForm.areaId = ''
    modalForm.shiftName = ''
    modalForm.id = ''

    shiftSettingsRecordList = reactive([{
      startTime: '09:00',
      endTime: '18:00',
      isNextDayStartTime: 0,
      isNextDayEndTime: 0,
    }])

    modalTitle.value = '新增班次'
    isShowModal.value = true
  }

  //保存班次
  let saveSclass = () => {
    if (!modalForm.areaId) return ViewUIPlus.Message.error('请选择区域')
    if (!modalForm.projectId) return ViewUIPlus.Message.error('请选择项目')
    if (!modalForm.shiftName) return ViewUIPlus.Message.error('请输入班次名称')

    let params = {
      data: {
        ...modalForm,
        areaName: modalAreaList.value.find(item => item.areaId == modalForm.areaId)?.areaName,
        projectName: modalProjectList.value.find(item => item.projectId == modalForm.projectId)?.projectName,
        shiftSettingsRecordList,
        opeator: getUserId(),
        operatorName: getUserName(),
      }
    }
    console.log('saveSclass==', params)
    saveSclassOrUpdate(params).then(res => {
      if (res.status == 200) {
        ViewUIPlus.Message.success(modalTitle.value + '成功')
        isShowModal.value = false
        searchTable()
      }else {
        ViewUIPlus.Message.error(res.message)
      }
    })
  }
  
  // 当前页
  let changePage = (val) =>{
    pageNum.value = val
    searchList()
  }

  //分页
  let changePageSize = (val) =>{
    pageSize.value = val
    searchList()
  }


  // 改动时间
  let dateChanged = () => {

  }

  // 上传成功
  let handleSuccess = (res, file, fileList) => {
      if (res.status == 200) {
        // ViewUIPlus.getGoodsList() //重新加载数据
        ViewUIPlus.Message.success('导入成功')
      } else {
        ViewUIPlus.Message.error(res.message)
      }
    }
  //  导入格式错误回调
  let handleFormatError = (file, fileList) => {
    ViewUIPlus.Message.error('请上传xlsx格式文件')
  }

  // 考勤时间删除
  const delTemplete = (row, index) => {
    console.log(row)
    shiftSettingsRecordList.splice(index, 1)
  }

  // 考勤时间保存
  const saveTemplete = (row) => {
    console.log(row)
  }
  
  // 考勤时间取消
  const cancel = (row, index) => {
    console.log(row)
  }

  // 考勤时间新增
  const addTime = () => {
    if (shiftSettingsRecordList.length == 2) return false
    if(shiftSettingsRecordList[0].isNextDayEndTime) {
      shiftSettingsRecordList.push({
        startTime: '',
        endTime: '',
        isNextDayStartTime: 1,
        isNextDayEndTime: 1
      })
    }else {
      shiftSettingsRecordList.push({
        startTime: '',
        endTime: '',
        isNextDayStartTime: 0,
        isNextDayEndTime: 0
      })
    }
  }

  // 编辑
  const editModal = (row) => {
    console.log(row)
    getSclassById(row.id).then(async res => {
      if (res.status == 200) {
        shiftSettingsRecordList = reactive([])
        modalForm = reactive(res.data)
        modalForm.areaId = Number(res.data.areaId)
        modalForm.projectId = res.data.projectId
        await modalRequestProjectList()
        let list = res.data.shiftSettingsRecordList.map(item => {
          return {
            startTime: item.startTime,
            endTime: item.endTime,
            isNextDayStartTime: item.isNextDayStartTime,
            isNextDayEndTime: item.isNextDayEndTime,
          }
        })
        
        shiftSettingsRecordList = reactive(list)


        // shiftSettingsRecordList = modalForm.shiftSettingsRecordList
        modalTitle.value = '编辑班次'
        isShowModal.value = true
        console.log('编辑===', modalForm)
      }
    })
  }

  // 删除
  const deleteList = (row) => {
    ViewUIPlus.Modal.confirm({
      title: '是否确认删除？',
      onOk: ()=> {
        deleteSclassById(row.id).then(res=>{
          if(res.status == 200){
            ViewUIPlus.Message.success("已删除")
            searchTable()
          }else {
            ViewUIPlus.Message.error(res.message)
          }
        })
      },
      onCancel: () => {}
    })
                
  }

  const isNextDay = ref(false)
  //判断开始时间是否次日
  const startNextDay = (item, index) => {
    if (index == 1) {
      if (!shiftSettingsRecordList[0].startTime) {
        ViewUIPlus.Message.error('请选择时段1上班时间')
        return false
      }
      if (!shiftSettingsRecordList[0].endTime) {
        ViewUIPlus.Message.error('请选择时段1下班时间')
        return false
      }

      let startTime = Number(shiftSettingsRecordList[0].startTime.split(':')[0])
      let endTime = Number(shiftSettingsRecordList[0].endTime.split(':')[0])
      let currentTime = Number(item.startTime.split(':')[0])

      if (shiftSettingsRecordList[0].isNextDayEndTime != 1) {
        if (currentTime < endTime) {
          item.isNextDayStartTime = 1
          item.isNextDayEndTime = 1
        }else if(currentTime == endTime) {
          let sm = Number(shiftSettingsRecordList[0].endTime.split(':')[1])
          let em = Number(item.startTime.split(':')[1])
          if (em < sm) {
            item.isNextDayStartTime = 1
            item.isNextDayEndTime = 1
          }else {
            item.isNextDayStartTime = 0
            item.isNextDayEndTime = 0 
          }
        }else {
          item.isNextDayStartTime = 0
          let te  = Number(shiftSettingsRecordList[1].endTime.split(':')[0])
          if (te < currentTime) {
            shiftSettingsRecordList[1].isNextDayEndTime = 1
          }else {
            shiftSettingsRecordList[1].isNextDayEndTime = 0
          }
          // item.isNextDayEndTime = 0
        } 
      }

      console.log('shiftSettingsRecordList==', shiftSettingsRecordList)
      console.log('startTime==', startTime)
      console.log('endTime==', endTime)
    }else {
      if (!shiftSettingsRecordList[0].endTime) {
        ViewUIPlus.Message.error('请选择时段1下班时间')
        return false
      }
      let startTime = Number(shiftSettingsRecordList[0].startTime.split(':')[0])
      let endTime = Number(shiftSettingsRecordList[0].endTime.split(':')[0])
      let currentTime = Number(item.startTime.split(':')[0])

      if (endTime < currentTime) {
        shiftSettingsRecordList[0].isNextDayEndTime = 1
        if (shiftSettingsRecordList.length > 1) {
          shiftSettingsRecordList[1].isNextDayStartTime = 1
          shiftSettingsRecordList[1].isNextDayEndTime = 1
        }
      }else if (endTime == currentTime) {
        let sm = Number(shiftSettingsRecordList[0].endTime.split(':')[1])
        let em = Number(item.startTime.split(':')[1])
        if (em < sm) {
          item.isNextDayEndTime = 1
        }else {
          item.isNextDayEndTime = 0
        }
      }else {
        shiftSettingsRecordList[0].isNextDayEndTime = 0
        if (shiftSettingsRecordList.length > 1) {
          //继续判断第二行的次日
          let ts  = Number(shiftSettingsRecordList[1].startTime.split(':')[0])
          if (shiftSettingsRecordList[1].startTime) {
            if (ts < endTime) {
              shiftSettingsRecordList[1].isNextDayStartTime = 1
              shiftSettingsRecordList[1].isNextDayEndTime = 1
            }else {
              shiftSettingsRecordList[1].isNextDayStartTime = 0
            }
          }else {
            shiftSettingsRecordList[1].isNextDayStartTime = 0
          }
          if (shiftSettingsRecordList[1].endTime) {
            if (shiftSettingsRecordList[1].isNextDayStartTime == 1) {
              shiftSettingsRecordList[1].isNextDayEndTime = 1
            }
            let te  = Number(shiftSettingsRecordList[1].endTime.split(':')[0])
            if (te < ts) {
              shiftSettingsRecordList[1].isNextDayEndTime = 1
            }else {
              shiftSettingsRecordList[1].isNextDayEndTime = 0
            }
          }else {
            shiftSettingsRecordList[1].isNextDayEndTime = 0
          }
        }
      }
    }
  }

  const endNextDay = (item, index) => {
    if (index == 1) {
      if (!shiftSettingsRecordList[1].startTime) {
        ViewUIPlus.Message.error('请选择时段2上班时间')
        return false
      }
      let startTime = Number(shiftSettingsRecordList[1].startTime.split(':')[0])
      let endTime = Number(item.endTime.split(':')[0])

      console.log('第二行startTime===', startTime)
      console.log('第二行endTime===', endTime)
      if (endTime < startTime) {
        item.isNextDayEndTime = 1
      }else {
        if (item.isNextDayStartTime == 1) {
          item.isNextDayEndTime = 1
        }else {
          item.isNextDayEndTime = 0
        }
      }
    }else {
      if (!shiftSettingsRecordList[0].startTime) {
        ViewUIPlus.Message.error('请选择时段1上班时间')
        return false
      }

      let startTime = Number(shiftSettingsRecordList[0].startTime.split(':')[0])
      let endTime = Number(item.endTime.split(':')[0])

      console.log('startTime==', endTime < startTime)
      console.log('endTime==', endTime)
      if (endTime < startTime) {
        item.isNextDayEndTime = 1
        //继续判断第二行的次日
        let ts  = Number(shiftSettingsRecordList[1].startTime.split(':')[0])
        console.log('ts===', ts)
        if (shiftSettingsRecordList[1].startTime) {
          if (ts < endTime) {
            // shiftSettingsRecordList[1].isNextDayStartTime = 1
            // shiftSettingsRecordList[1].isNextDayEndTime = 1
          }else {
            console.log('3333')
            shiftSettingsRecordList[1].isNextDayStartTime = 1
            shiftSettingsRecordList[1].isNextDayEndTime = 1
          }
        }else {
          shiftSettingsRecordList[1].isNextDayStartTime = 0
        }
        if (shiftSettingsRecordList[1].endTime) {
          if (shiftSettingsRecordList[1].isNextDayStartTime == 1) {
            shiftSettingsRecordList[1].isNextDayEndTime = 1
            return
          }
          let te  = Number(shiftSettingsRecordList[1].endTime.split(':')[0])
          if (te < ts) {
            shiftSettingsRecordList[1].isNextDayEndTime = 1
          }else {
            shiftSettingsRecordList[1].isNextDayEndTime = 0
          }
        }else {
          shiftSettingsRecordList[1].isNextDayEndTime = 0
        }
      }else if(endTime == startTime) {
        let sm = Number(shiftSettingsRecordList[0].startTime.split(':')[1])
        let em = Number(item.endTime.split(':')[1])
        if (em < sm) {
          item.isNextDayEndTime = 1
        }else {
          item.isNextDayEndTime = 0
          //继续判断第二行的次日
          let ts  = Number(shiftSettingsRecordList[1].startTime.split(':')[0])
          if (shiftSettingsRecordList[1].startTime) {
            if (ts < endTime) {
              shiftSettingsRecordList[1].isNextDayStartTime = 1
              shiftSettingsRecordList[1].isNextDayEndTime = 1
            }else {
              shiftSettingsRecordList[1].isNextDayStartTime = 0
            }
          }else {
            shiftSettingsRecordList[1].isNextDayStartTime = 0
          }
          if (shiftSettingsRecordList[1].endTime) {
            if (shiftSettingsRecordList[1].isNextDayStartTime == 1) {
              shiftSettingsRecordList[1].isNextDayEndTime = 1
            }
            let te  = Number(shiftSettingsRecordList[1].endTime.split(':')[0])
            if (te < ts) {
              shiftSettingsRecordList[1].isNextDayEndTime = 1
            }else {
              shiftSettingsRecordList[1].isNextDayEndTime = 0
            }
          }else {
            shiftSettingsRecordList[1].isNextDayEndTime = 0
          }

        }
      }else {
        item.isNextDayEndTime = 0
        console.log('这里==')
        //继续判断第二行的次日
        if (shiftSettingsRecordList[1].startTime) {
          let ts  = Number(shiftSettingsRecordList[1].startTime.split(':')[0])
          console.log('ts==', ts, endTime)
          if (ts < endTime) {
            shiftSettingsRecordList[1].isNextDayStartTime = 1
            shiftSettingsRecordList[1].isNextDayEndTime = 1
          }else {
            shiftSettingsRecordList[1].isNextDayStartTime = 0
          }
        }else {
          shiftSettingsRecordList[1].isNextDayStartTime = 0
        }
        if (shiftSettingsRecordList[1].endTime) {
          if (shiftSettingsRecordList[1].isNextDayStartTime == 1) return
          let ts  = Number(shiftSettingsRecordList[1].startTime.split(':')[0])
          let te  = Number(shiftSettingsRecordList[1].endTime.split(':')[0])
          if (te < ts) {
            shiftSettingsRecordList[1].isNextDayEndTime = 1
          }else {
            shiftSettingsRecordList[1].isNextDayEndTime = 0
          }
        }else {
          shiftSettingsRecordList[1].isNextDayEndTime = 0
        }

      }
      console.log('item===', item)
      console.log('shiftSettingsRecordList==', shiftSettingsRecordList)
      // let endTime = Number(shiftSettingsRecordList[0].endTime.split(':')[0])
    }
    
  }
  


  //初始化
  onMounted(() => {
    // getSpecialtyList();
    loadAreaList()
  })
</script>

<style lang="scss" scoped>
.title {
  /* font-weight: bold; */
  font-size: 18px; 
  margin: 5px;
}

.button {
    margin-left: 10px;
}

table{
    width: 100%;
  }
.left-td{
  width: 15%;
  line-height: 40px;
  max-width: 250px;
  border-top:1px solid rgb(236,236,236) ;
  border-left:1px solid rgb(236,236,236) ;
  background-color: rgb(248,249,251);
  text-align: center;
}
.right-td{
  width: 35%;
  height: 40px;
  line-height: 40px;
  max-width: 250px;
  border-top:1px solid rgb(236,236,236) ;
  border-left:1px solid rgb(236,236,236) ;
  text-align: left;
  padding-left: 10px;
}
.tr>td{
  border-bottom:1px solid rgb(236,236,236)
}
.top-td{
  width: 20%;
  line-height: 40px;
  max-width: 250px;
  border-top:1px solid rgb(236,236,236) ;
  border-left:1px solid rgb(236,236,236) ;
  background-color: rgb(248,249,251);
  text-align: center;
}
.titlestd{
  width: 25%;
  line-height: 40px;
  max-width: 250px;
  border-top:1px solid rgb(236,236,236) ;
  border-right:1px solid rgb(236,236,236) ;
  text-align: center;
}
.leftline{
  width: 2px;
  height: 15px;
  background-color: rgb(24,144,255);
  position: relative;
  top: 10px;
}
.titles{
  position: relative;
  top: -5px;
  left: 12px;
}

.model-title {
  color: #333;
  position: relative; 
  font-weight: bold;
  font-size: 16px;
  padding-left: 10px;
  margin-bottom: 10px;
}
.model-title::before {
  content: '';
  position: absolute; 
  left: 0;
  bottom: 0;  
  width: 4px;
  height: 100%;
  background-color: #1890FF;
}

.table-tr{
  min-height: 38px;
}
.table-th{
  width: 20%;
}
.person_overflow{
  overflow: hidden;
  text-align: left;
}
table.borderTable .wid-30{
  width: 30%;
}
table.personal_table thead{
  background-color:#f9f9f9;
}
table.personal_table .ivu-input{
  text-align: center;
}

.borderTable{border:#ececec solid 1px; text-align: center;border-collapse: collapse;width:100%;font-size: 13px;}
.borderTable td,.borderTable th{font-size: 13px;border-collapse: collapse;line-height: 24px;border:#ececec solid 1px; padding:5px 5px; text-align: left;font-weight: normal;}
.borderTable th.required{position: relative;}
.borderTable td div,.borderTable th div{margin:0;}
.borderTable .ivu-form-item{margin-bottom: 0;}
.borderTable th .redfont{ color:#f00; padding: 0 0 0 3px;}
.borderTable th{background:#F8F9FB;}
.borderTable{line-height: 32px; min-height: 32px;}
</style>
