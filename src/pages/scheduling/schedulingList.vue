<template>
  <div class="container" style="height: 100vh;">
    <Card>
      <template #title>
        <div class="title">排班列表</div> 
      </template>
      <template #extra>
        <Button type="primary" style="margin-right: 20px;" @click="exportSclass">导出排班表</Button>
        <Button type="primary" @click="showImportModal">导入排班表</Button>
      </template>
      <Row :gutter="16">
        <Col span="4">
          <Select filterable clearable transfer v-model="searchForm.areaId" placeholder="区域" @on-change="requestProjectList" @on-clear="areaCleared">
            <Option v-for="(item, index) in areaList" :key="index" :value="item.areaId">{{ item.areaName }}
            </Option>
          </Select>
        </Col>
        <Col span="4">
          <Select filterable clearable transfer v-model="searchForm.projectId" placeholder="项目" >
            <Option v-for="(item, index) in projectList" :key="index" :value="item.projectId">{{ item.projectName }}
            </Option>
          </Select>
        </Col>
        <Col span="4">
          <Select filterable clearable transfer v-model="searchForm.dept" placeholder="部门" >
            <Option v-for="(item, index) in departmentList" :key="index" :value="item">{{ item }}
            </Option>
          </Select>
        </Col>
        <Col span="4">
          <DatePicker type="month" format="yyyy-MM" placeholder="时间" v-model="searchForm.shiftDate" @on-change="dateChanged"></DatePicker>
        </Col>
        <Col span="3">
          <Input v-model="searchForm.code" placeholder="工号" />
        </Col>
        <Col span="3">
          <Input v-model="searchForm.name" placeholder="姓名" />
        </Col>
        <Col span="2">
          <Button type="primary" @click="searchTable">查询</Button>
        </Col>
      </Row>
    </Card>
    <Card style="margin-top: 30px;">
      <Table :columns="columns" :data="tableData" :pageSizeList="[10,20,50,100]">
      </Table>
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

    <Modal :mask-closable="false" v-model="isEditModal" :width ="sclassesList.length>6?'325px':'320px'" footer-hide="true" @on-cancel="closeServerTypeModal">
      <template #header>
        <p style="font-size: 14px">修改该员工当天班次</p>
      </template>
      <div>
        <div :class="sclassesList.length<6?'modal-content-hidden':'modal-content'">
          <Tooltip max-width="290" class="tool" v-for="(item, index) in sclassesList" :key="index" :content="item.shiftName + '(' + item.attendanceTime + ')'" placement="top" :style="{ 'font-size': fontSize + 'px' }">
            <div class="edit-selet-btn orange" @click="editSclass(item, item.shiftName)">{{ item.shiftName }}({{ item.attendanceTime }})</div>
          </Tooltip>
        </div>
        <div class="modal-fixed-content">
          <Tooltip content="休息" placement="top">
            <div class="edit-selet-btn grey" @click="editSclass({}, '=')">休息</div>
          </Tooltip>
          <Tooltip content="清空" placement="top">
            <div class="edit-selet-btn border-select" @click="deleteSclass">清空</div>
          </Tooltip>
        </div>
      </div>
    </Modal>

    <Modal :mask-closable="false" v-model="isImportModal" width = '700px' @on-cancel="closeServerTypeModal">
      <template #header>
        <p>批量导入排班表</p>
      </template>
      <div>
        <Row :gutter="16">
          <Col span="6">
            <Select clearable transfer v-model="importForm.areaId" placeholder="区域" @on-change="modalRequestProjectList" @on-clear="modalAreaCleared">
              <Option v-for="(item, index) in importAreaList" :key="index" :value="item.areaId">{{ item.areaName }}
              </Option>
            </Select>
          </Col>
          <Col span="6">
            <Select clearable transfer v-model="importForm.projectId" placeholder="项目" >
              <Option v-for="(item, index) in importProjectList" :key="index" :value="item.projectId">{{ item.projectName }}
              </Option>
            </Select>
          </Col>
          <!-- <Col span="6">
            <DatePicker type="month" format="yyyy-MM" placeholder="时间" v-model="importForm.shiftDate" @on-change="importDateChanged"></DatePicker>
          </Col> -->
        </Row>
        <Row style="margin: 15px 0">
          <a @click="downloadMoudel">点击下载模板</a>
        </Row>
        <Upload
          ref="fileUpload"
          type="drag"
          multiple
          :show-upload-list="false"
          accept=".xlsx"
          :format="['xlsx']"
          :max-size="2048"
          :before-upload="handleBeforeUpload"
          :on-success="handleSuccess"
          :on-format-error="handleFormatError"
          action="/officeSystem/shiftSchedule/importShiftSchedule"
          :data="savaParams"
          :headers="headersParams"
        >
          <!--  :headers="{token:token}"
          :data="{sellerId:sellerId}" -->
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>拖拽文件或点击选择文件上传</p>
          </div>
        </Upload>
        <div v-if="importForm.file !== null" style="marigin-top: 10px;"> {{ importForm.file.name }}</div>
      </div>
      <template #footer>
        <div style="text-align: center;">
          <Button type="primary" ghost @click="closeImportModal" style="width: 60px;margin-right: 30px;">取消</Button>
          <Button type="primary" :loading="modalLoading" @click="saveImportInfo" style="width: 60px;">确认</Button>
        </div>
       
      </template>
    </Modal>
  </div>
</template>

<script setup>
  import ViewUIPlus, { CheckboxGroup } from 'view-ui-plus'
  import { ref, onMounted, onBeforeMount, reactive, watch, getCurrentInstance, resolveComponent } from 'vue'
  import { getShiftingRecordList, getAreaLists, getProjectLists, getDictDetail, exportShiftingRecord } from '@/service/landcrm'
  import { getShiftScheduleList, getAllDept, getShiftSettingsList, updateSclassById, exportShiftInfo, downloadTemplate, importShiftSchedule, deleteShiftSchedule, deleteShiftScheduleRecord } from '@/service/officeSystem'

  const { proxy } = getCurrentInstance()

  // 当前月份
  const currentMonth = () => {
    const date = new Date();
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    return `${year}-${month}`
  }

  const data = reactive({
    name: '张三',
  })
  let fontSize=ref(12)
  let isImportModal = ref(false)

  let pageNum = ref(1)
  let pageSize = ref(10)
  let total = ref(0)
  let isEditModal = ref(false)
  let editData = reactive({})
  let modalLoading = ref(false)

  let searchForm = reactive({
    areaId: '',
    projectId: '',
    dept: '',
    code: '',
    name: '',
    workContent: '',
    shiftDate: currentMonth(),
  })

  let importForm = reactive({
    areaId: '',
    projectId: '',
    areaName: '',
    projectName: '',
    file: '',
    shiftDate: currentMonth(),
  })
  let savaParams = reactive({})
  let editRow = reactive({})

  let headersParams = reactive({
    // 'x-companyId-header': companyId,
    // 'x-userId-header': userid
  })

  let currentDay = ref(1)   // 月份当前日

  let columns = ref([
    {
      title: '操作',
      key: 'option',
      align: 'center',
      width: 100,
      render: (h, params) => {
        return h('div', [
          h('span', {
            // props: {
            //   type: 'primary',
            //   size: 'small'
            // },
            style: {
              marginRight: '5px',
              color: '#1890FF',
              cursor: 'pointer'
            },
            onClick: () => {
              deleteInfo(params.row.id)
            }
          }, '删除')
        ]);
      }
    },
    {
      title: '工号',
      key: 'code',
      align: 'center',
      width: 100,
    },
    {
      title: '姓名',
      key: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: '部门',
      key: 'dept',
      align: 'center',
      width: 100,
    },
    {
      title: '年份',
      key: 'shiftYear',
      align: 'center',
      width: 100,
    },{
      title: '月份',
      key: 'shiftMonth',
      align: 'center',
      width: 100,
    },
    {
      title: '1',
      key: 'dayOfMonth',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div',
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 1)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 1
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 1)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 1)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '2',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 2)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 2
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 2)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 2)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '3',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 3)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 3
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 3)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 3)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '4',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 4)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 4
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 4)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 4)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '5',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 5)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 5
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 5)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 5)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '6',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 6)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 6
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 6)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 6)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '7',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 7)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 7
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 7)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 7)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '8',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 8)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 8
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 8)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 8)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '9',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 9)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 9
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 9)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 9)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '10',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 10)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 10
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 10)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 10)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '11',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 11)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 11
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 11)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 11)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '12',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 12)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 12
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 12)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 12)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '13',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 13)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 13
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 13)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 13)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '14',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 14)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 14
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 14)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 14)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '15',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 15)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 15
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 15)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 15)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '16',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 16)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 16
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 16)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 16)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '17',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 17)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 17
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 17)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 17)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '18',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 18)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 18
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 18)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 18)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '19',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 19)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 19
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 19)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 19)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '20',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 20)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 20
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 20)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 20)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '21',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 21)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 21
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 21)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 21)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '22',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 22)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 22
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 22)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 22)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '23',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 23)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 23
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 23)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 23)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '24',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 24)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 24
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 24)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 24)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '25',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 25)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 25
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 25)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 25)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '26',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 26)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 26
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 26)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 26)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '27',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 27)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 27
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 27)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 27)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '28',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 28)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 28
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 28)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 28)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '29',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 29)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 29
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 29)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 29)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '30',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 30)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 30
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 30)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 30)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    },
    {
      title: '31',
      key: 'workNumber',
      align: 'center',
      width: 60,
      render: (h, params) => {
        return h('div', 
          [
            h(
              resolveComponent('Tooltip'),
              {
                content: params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 31)[0]?.shiftInfo || '-'
              }, 
              [
                h('span', {
                  style: {
                    color: '#1890FF',
                    cursor: 'pointer'
                  },
                  onClick: () => {
                    currentDay.value = 31
                    editRow = params.row
                    let rowData = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 31)[0]
                    getSclassesList(params.row.areaId, params.row.projectId)
                    isEditModal.value = true
                    editData = rowData
                  }
                }, {
                  default: () => {
                    let shiftInfo = params.row.shiftScheduleRecordList.filter(item => item.dayOfMonth == 31)[0]?.shiftInfo || '-'
                    return shiftInfo
                  }
                }
                  
                )
              ]
            )
          ]
        )
      }
    }
  ])

  let areaList = ref([])
  let projectList = ref([])
  let importAreaList = ref([])
  let importProjectList = ref([])
  let departmentList = ref([])
  let tableData = ref([])

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
  const loadAreaList =() =>{
    const { USER_INFO ,AREALIST } = window.GlobalProperties.$constant || {};
    const { storageAction } = window.GlobalProperties.$utils || {};
    let userId = getUserId()
    console.log(378,userId)
    getAreaLists(userId).then(result => {
      if(result && result.resultTotal > 0) {
        storageAction({ key: AREALIST, value: JSON.stringify(result.items), action: 'set' });
        areaList.value = result.items;
        searchForm.areaId = result.items[0].areaId;

        importAreaList.value = result.items;
        importForm.areaId = result.items[0].areaId
        importForm.areaName = result.items[0].areaName
        //加载项目
        loadProjectList(searchForm.areaId);
      }
    });
  }

  // 加载项目
  const loadProjectList = (value) => { //设置项目数据
    projectList.value = [];
    if(value == "") {
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

        importProjectList.value = result.items;
        importForm.projectId = result.items[0].projectId;
        importForm.projectName = result.items[0].projectName;
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

  // 切换弹窗区域
  const modalRequestProjectList = () =>{
    const { USER_INFO ,PROJECTLIST } = window.GlobalProperties.$constant || {}
    const { storageAction } = window.GlobalProperties.$utils || {}
    const { userid } = storageAction({ action: 'get', key: USER_INFO }) || {}
    importProjectList.value = []
    getProjectLists(userid, importForm.areaId).then((res)=>{
      importProjectList.value = res.items
      importForm.projectId = res.items[0]?.projectId
    })
  }

  let areaCleared = () => {
    projectList.value = []
    searchForm.projectId = ''
    searchForm.areaId = ''
  }

  let modalAreaCleared = () => {
    importProjectList.value = []
    importForm.projectId = ''
    importForm.areaId = ''
  }


  // 改动时间
  let dateChanged = (date) => {
    searchForm.shiftDate = date
  }

  let importDateChanged = (date) => {
    importForm.shiftDate = date
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
    let userId = getUserId()
    getShiftScheduleList(params, size, current, userId).then(res => {
      if (res.status == 200) {
        tableData.value = res.data?.records
        total.value = res.data?.total
      }
    })
  }

  // 修改班次 
  const editSclass = (item, shiftName) => {
    console.log('编辑==', item, editData)
    let date = `${editRow.shiftYear}-${editRow.shiftMonth < 10 ? '0' + editRow.shiftMonth : editRow.shiftMonth}-${currentDay.value < 10 ? '0' + currentDay.value : currentDay.value}`
    let editParams = {
      shiftInfo: shiftName,
      operator: getUserId(),
      operatorName: getUserName(),
      shiftDate: date,
      relateId: editRow.id,
      shiftSettingId: item.id
    }
    if (editData) {
      editParams.id = editData.id  //最外层id
      editParams.shiftDate = editData.shiftDate
    }

    let params = {
      data: editParams
    }

    updateSclassById(params).then(res => {
      if (res.status == 200) {
        ViewUIPlus.Message.success('修改成功')
        isEditModal.value = false
        searchTable()
      }else {
        ViewUIPlus.Message.error(res.message)
      }
    })
  }

  //清空
  const deleteSclass = (item) => {
    let shiftItemId = editData?.id || ''
    if (!shiftItemId) {
      ViewUIPlus.Message.success('修改成功')
      searchTable()
      return
    }
    deleteShiftScheduleRecord(shiftItemId).then(res => {
      if (res.status == 200) {
        isEditModal.value = false
        ViewUIPlus.Message.success('修改成功')
        searchTable()
      }else {
        ViewUIPlus.Message.error(res.message)
      }
    })
  }

  let sclassesList = ref([])
  // 获取排班列表
  let getSclassesList = (areaId, projectId) => {
    let params = {
      data: {
        areaId,
        projectId 
      }
    }
    getShiftSettingsList(params, 100, 1).then(res => {
      if (res.status == 200) {
        sclassesList.value = res.data?.records
        console.log('sclassesList==', sclassesList)
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
    searchTable()
  }
  // 上传成功
  let handleSuccess = (res, file, fileList) => {
    console.log('导入==', res)
    if (res.status == 200) {
      importForm.file = null
      proxy.$refs['fileUpload'].clearFiles()
      importForm.file = null
      // ViewUIPlus.getGoodsList() //重新加载数据
      modalLoading.value = false
      isImportModal.value = false
      searchTable()
      ViewUIPlus.Message.success('导入成功')
    } else {
      importForm.file = null
      proxy.$refs['fileUpload'].clearFiles()
      modalLoading.value = false
      // isImportModal.value = false
      ViewUIPlus.Message.error(res.message)
    }
  }
  //  导入格式错误回调
  let handleFormatError = (file, fileList) => {
    ViewUIPlus.Message.error('请上传xlsx格式文件')
  }

  // 获取部门 
  const getAllDeptData = () => {
    getAllDept().then(res => {
      console.log('部门====', res)
      if (res.status == 200) {
        departmentList.value = res.data
      }
      
    })
  }

  //导出排班信息
  const exportSclass = () => {
    let params = {
      data: {
        ...searchForm,
        projectName: projectList.value.find(item => item.projectId == searchForm.projectId)?.name
      }
    }
    // exportShiftInfo(params)
    exportShiftInfo(params)
  }

  const handleBeforeUpload = (file) => {
    importForm.file = file
    // this.uploadItem = {
    //   levelId: this.saveItem.levelId,
    //   levelName: this.saveItem.levelName,
    //   prohibit: this.saveItem.prohibit,
    //   classifyId: this.id,
    //   warning: '0'
    // }
    const { USER_INFO ,AREALIST } = window.GlobalProperties.$constant || {};
    const { storageAction } = window.GlobalProperties.$utils || {};
    const { companyId, userid } = storageAction({ action: 'get', key: USER_INFO }) || {}

    headersParams = {
      'x-companyId-header': companyId,
      'x-userId-header': userid
    }

    savaParams = {
      // shiftDate: importForm.shiftDate,
      areaId: importForm.areaId,
      projectId: importForm.projectId,
      areaName: importForm.areaName,
      projectName: importForm.projectName,
      operator: getUserId(),
      operatorName: getUserName()
    }
    console.log('file===', importForm.file)
    return false;
  }

  //导入保存
  const saveImportInfo = () => {
    modalLoading.value = true
    let params = {
      data: {
        // ...importForm,
        // shiftDate: importForm.shiftDate,
        areaId: importForm.areaId,
        projectId: importForm.projectId,
        areaName: importAreaList.value.find(item => item.areaId == importForm.areaId)?.areaName,
        projectName: importProjectList.value.find(item => item.projectId == importForm.projectId)?.projectName,
        // multipartFile: '',
        // file: ''
      }
    }
    // console.log('getCurrentInstance()==', getCurrentInstance())
    // proxy.$refs['fileUpload']
    console.log('proxy.$refs["fileUpload"]===', proxy.$refs['fileUpload'])
    if(importForm.file){
      proxy.$refs['fileUpload'].post(importForm.file)
    }else{
      ViewUIPlus.Message.error('请导入文件')
      modalLoading.value = false
      return
    }
  }

  const showImportModal = () => {
    isImportModal.value = true
    savaParams = {}
    importForm.file = ''
  }

  const closeImportModal = () => {
    isImportModal.value = false
  }

  // 下载模板
  const downloadMoudel = () => {
    let params = {
      data: {
        areaId: importForm.areaId,
        projectId: importForm.projectId
      }
    }
    downloadTemplate(params)
  }

  //删除
  const deleteInfo = (id) => {
    console.log('ID===', id)
    ViewUIPlus.Modal.confirm({
      title: '是否删除该员工排班？',
      onOk: ()=> {
         deleteShiftSchedule(id).then(res => {
          if (res.status == 200) {
            ViewUIPlus.Message.success('删除成功')
            searchTable()
          }
        })
      },
      onCancel: () => {}
    })
  }

  watch(() => importForm.areaId, (newValue, oldValue) => {
    importForm.areaName = importAreaList.value.find(item => item.areaId == newValue)?.areaName
    console.log('importForm.areaName==', importForm.areaName)
  })
  watch(() => importForm.projectId, (newValue, oldValue) => {
    importForm.projectName = importProjectList.value.find(item => item.projectId == newValue)?.projectName
    console.log('importForm.projectName==', importForm.projectName)
  })

  //初始化
  onMounted(() => {
    // getSpecialtyList();
    loadAreaList()
    getAllDeptData()
  })
</script>

<style lang="scss" scoped>
.edit-selet-btn {
  width: 280px;
  height: 40px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  margin-bottom: 10px;
  line-height: 40px;
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  margin-left: 5px;
}
.tool ::v-deep .ivu-tooltip-rel {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  font-size:12px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.border-select {
  border: 1px solid red;
  color: red;
  background-color: #fff;
  cursor: pointer;
}
.custom-tooltip-font {
  font-size: 12px;
  text-overflow: ellipsis;
}
.blue {
  background-color: #2d8cf0;
}
.orange {
  background-color: #ff9933;
}
.grey {
  background-color: #ccc;
}

.title {
  /* font-weight: bold; */
  font-size: 18px; 
  margin: 5px;
}

.button {
    margin-left: 10px;
}
.modal-content {
  max-height: 330px;
  overflow-y: scroll;
  width: 100%;
  /*padding-left: 5px;*/
  overflow-x: hidden;
}
.modal-content-hidden {
  max-height: 330px;
  overflow-y: hidden;
  width: 100%;
  /*padding-left: 5px;*/
  overflow-x: hidden;
  text-overflow: ellipsis;
}
.modal-content::-webkit-scrollbar {
  /* display: none; */
}
.modal-fixed-content {
  //padding-left: 5px;
}
</style>
