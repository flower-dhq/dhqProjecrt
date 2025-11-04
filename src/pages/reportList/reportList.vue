<template>
  <div>
    <Card>
        <template #title>
            <div class="title">汇报列表</div> 
        </template>
        <template #extra>
            <Button type="primary" @click="createReport">写汇报</Button>
        </template>
        <Row :gutter="16">
            <Col span="4">
                <Select clearable transfer v-model="searchItem.areaId" placeholder="区域" @on-change="areaChanged" @on-clear="areaCleared">
                    <Option v-for="(item, index) in areaList" :key="index" :value="item.areaId">{{ item.areaName }}
                    </Option>
                </Select>
            </Col>
            <Col span="4">
                <Select clearable transfer v-model="searchItem.projectId" placeholder="项目" >
                    <Option v-for="(item, index) in projectList" :key="index" :value="item.projectId">{{ item.projectName }}
                    </Option>
                </Select>
            </Col>
            <Col span="4">
                <Input clearable v-model="searchItem.creatorName" placeholder="提交人" />
            </Col>
            <Col span="4">
                <Select clearable transfer v-model="searchItem.readState" placeholder="状态" >
                    <Option v-for="(item, index) in readStateList" :key="index" :value="item.value">{{ item.name }}
                    </Option>
                </Select>
            </Col>
            <Col span="4">
                <Input clearable v-model="searchItem.workContent" placeholder="汇报内容" />
            </Col>
        </Row>·
        
        <Row :gutter="16">
            <Col :span="5">
                <DatePicker v-model="dateRange" type="daterange"  placeholder="提交开始时间-结束时间" @on-change="dateChanged" @on-clear="clearDate"></DatePicker>
            </Col>
            <Button type="primary" @click="searchClick()">查询</Button>
            <Button class="button" @click="reset()">重置</Button>
        </Row>
    </Card>
    <br>
    <Card>
        <Tabs v-model="searchItem.act" @on-click="changeTab()">
            <TabPane :label="tab1Label" name="1"></TabPane>
            <TabPane :label="tab2Label" name="2"></TabPane>
            <TabPane :label="tab3Label" name="3"></TabPane>
        </Tabs>
        <Table :columns="columns" :data="reports" :border="true">
            <template #code="{ row }" >
                <div style="color: #2d69fb;" type="text" size="small" @click="showDetail(row)">{{ row.code }}</div>
            </template>
            <template #readState="{ row }" >
                <div v-if="row.isDraft==1">--</div>
                <div v-else>
                    <div v-if="row.readState==0" style="color: red;">全部未读</div>
                    <div v-if="row.readState==1" style="color: orange;">部分已读</div>
                    <div v-if="row.readState==2" style="color: green;">全部已读</div>
                </div>
            </template>
            <template #action="{ row, index }" >
                <Button style="color: #2d69fb;" type="text" size="small" @click="showDetail(row)">详情</Button>
                <Button v-if="row.creator==userInfo.userid" style="color: #2d69fb;" type="text" size="small" @click="eidt(row)">修改</Button>
                <Button v-if="row.creator==userInfo.userid" style="color: #2d69fb;" type="text" size="small" @click="remove(row)">删除</Button>
            </template>
        </Table>
        <Page show-total show-elevator :total="totalCount" :page-size="pageSize" v-model="startIndex" @on-change="changePage" align="right"
              ></Page>
    </Card>
    <Drawer :closable="false" v-model="showCreateReport" width="700">
        <NewReport ref="newReport" :isForCreate="isCreateReport" :isForEdit="isEditReport" :isForShow="isShowReportDetail" :isVisible="showCreateReport" :oldData="detailData" @close="showCreateReport=false" @submit="createSuccess"></NewReport>
    </Drawer>
  </div>

</template>

<script>
import { reportList,deleteReport,getReportDetail, getReportCount } from '@/service/officeSystem';
import { getAreaList, getProjectList } from '@/service/landcrm';
import NewReport from './newReport.vue'

    export default {
        name:'reportList',
        components: {
            NewReport
        },
        computed:{
            userInfo(){
                const { storageAction } = window.GlobalProperties.$utils || {};
                const { USER_INFO } = window.GlobalProperties.$constant || {};
                const info = storageAction({ key: USER_INFO, action: 'get' });
                return info;
            },
        },
        data() {
            return {
                dateRange:"",
                draftCount: 0,   //我的草稿
                receiveCount: 0,  //我收到的
                sendCount: 0,   //我发出的
                showCreateReport:false,
                isCreateReport:false,
                isEditReport:false,
                isShowReportDetail:false,
                reports:[],
                searchItem: {
                    areaId:"",
                    projectId:"",
                    creator:"",
                    creatorName:"",
                    readState:"",
                    workContent:"",
                    startDate:"",
                    endDate:"",
                    act:"1",
                },
                tab1Label:"我发出的",
                tab2Label:"我收到的",
                tab3Label:"我的草稿",
                columns:[
                    {
                        title: '操作',
                        slot: 'action',
                        align:"center",
                    },
                    {
                        title: '流水单号',
                        slot: 'code',
                        align:"center",
                    },
                    {
                        title: '项目名称',
                        key: 'projectName',
                        align:"center",
                    },
                    {
                        title: '状态',
                        slot: 'readState',
                        align:"center",
                    },
                    {
                        title: '提交人员',
                        key: 'creatorName',
                        align:"center",
                    },
                    {
                        title: '提交时间',
                        key: 'createDate',
                        align:"center",
                    },
                    
                ],
                totalCount: 0,
                pageSize: 10,
                startIndex: 1,
                readStateList:[{name:"全部未读",value:"0"},{name:"部分已读",value:"1"},{name:"全部已读",value:"2"}],
                areaList:[],
                projectList:[],
                detailData:{},
            }
        },
        mounted(){
            this.requestAreaList();
            this.searchClick();
        },
        methods:{
            areaChanged(){
                this.searchItem.projectId="";
                this.projectList = [];
                if(this.searchItem.areaId){
                    this.requestProjectList();
                }
                
            },
            clearDate(){
                this.searchItem.startDate = "";
                this.searchItem.endDate = "";
            },
            searchClick(){
                this.startIndex=1;
                this.search();
            },
            showDetail(row){
                const { storageAction } = window.GlobalProperties.$utils || {};
                const { USER_INFO } = window.GlobalProperties.$constant || {};
                const info = storageAction({ key: USER_INFO, action: 'get' });
                let dic = {creator:info.userid,id:row.id};
                if(this.searchItem.act == "3"){
                    dic["isDrafts"] = 1;
                } else {
                    dic["isDrafts"] = 0;
                }
                let param = {
                    data:dic
                }
                let self = this
                getReportDetail(param).then(res=>{
                    if(res.status == "200"){
                        self.detailData = res.data;
                        self.isCreateReport = false;
                        self.isShowReportDetail = true;
                        self.isEditReport = false;
                        self.showCreateReport = true;
                    }   
                })
            },
            eidt(row){
                const { storageAction } = window.GlobalProperties.$utils || {};
                const { USER_INFO } = window.GlobalProperties.$constant || {};
                const info = storageAction({ key: USER_INFO, action: 'get' });
                let dic = {creator:info.userid,id:row.id};
                if(this.searchItem.act == "3"){
                    dic["isDrafts"] = 1;
                } else {
                    dic["isDrafts"] = 0;
                }
                let param = {
                    data:dic
                }
                let self = this
                getReportDetail(param).then(res=>{
                    if(res.status == "200"){
                        self.detailData = res.data;
                        self.isCreateReport = false;
                        self.isShowReportDetail = false;
                        self.isEditReport = true;
                        self.showCreateReport = true;
                        this.$refs.newReport.getCurrnetProjectList(res.data.projectId)
                    }   
                })
            },
            remove(row){
                let self = this
                this.$Modal.confirm({
                    title:"请确认删除该工作汇报吗？确认后则将该数据删除",
                    onOk:()=>{
                        deleteReport(row.id).then(res=>{
                            if(res.status=="200"){
                                self.search();
                                this.$Message.success("已删除")
                            }
                        })
                    },
                    onCancel:()=>{

                    }
                })
                
            },
            createSuccess(){
                this.isCreateReport = false;
                this.showCreateReport = false;
                this.search();
            },
            createReport(){
                this.showCreateReport=true;
                this.isCreateReport = true;
                this.isEditReport = false;
                this.isShowReportDetail = false;
                this.$refs.newReport.getCurrnetProjectList()
            },
            areaCleared(){
                this.projectList = [];
                this.searchItem.projectId="";
                this.searchItem.areaId="";
            },
            requestAreaList(){
                const { storageAction } = window.GlobalProperties.$utils || {};
                const { USER_INFO } = window.GlobalProperties.$constant || {};
                const info = storageAction({ key: USER_INFO, action: 'get' });
                console.log("userInfo",info);
                let dic = {userId:info.userid};
                const params = {
                    data: dic
                };
                let self = this;
                getAreaList(params).then((res)=>{
                    self.areaList = res.items;
                })
            },
            requestProjectList(){
                const { storageAction } = window.GlobalProperties.$utils || {};
                const { USER_INFO } = window.GlobalProperties.$constant || {};
                const info = storageAction({ key: USER_INFO, action: 'get' });
                let dic = {userId:info.userid, areaId: this.searchItem.areaId};
                const params = {
                    data: dic
                };
                let self = this;
                getProjectList(params).then((res)=>{
                    self.projectList = res.items;
                    if(self.projectList.length>0){
                        self.searchItem.projectId = self.projectList[0].projectId;
                    }
                })
            },
            dateChanged(value){
                if(value[0]){
                    this.searchItem.startDate = value[0] + " 00:00:00";
                }
                if(value[1]){
                    this.searchItem.endDate = value[1] + " 23:59:59"
                }
                
            },
            changeTab(){
                this.totalCount = 0;
                this.reports = [];
                this.searchClick();
            },
            search(){
                this.searchItem.creator = this.userInfo.userid;
                const params = {
                    data: this.searchItem
                };
                let self = this;
                reportList(params, this.pageSize, this.startIndex).then((res)=>{
                    self.totalCount = res.data.total;
                    self.reports = res.data.records;
                    console.log("res",res);
                })
                this.requestReportCount()
                
            },
            requestReportCount(){
                this.searchItem.creator = this.userInfo.userid;
                const params = {
                    data: this.searchItem
                };
                let self = this;
                getReportCount(params).then((res)=>{
                    self.tab1Label = `我发出的(${res.data.sendCount})`;
                    self.tab2Label = `我收到的(${res.data.receiveCount})`;
                    self.tab3Label = `我的草稿(${res.data.draftCount})`;
                })
            },
            reset(){
                this.dateRange = "";
                this.searchItem = {
                    areaId:"",
                    projectId:"",
                    creator:"",
                    readState:"",
                    workContent:"",
                    startDate:"",
                    endDate:"",
                    act:"1",
                }
                
            },
            changePage(index) {//楼栋列表分页
                this.startIndex = index;
                this.search()
            },
        }
    }
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  margin: 5px;
}

.button {
    margin-left: 10px;
}

.createReportTitle{
    color: white;
    background-color: #2d69fb;
    font-size: 20px;
    height: 60px;
    padding: 20px;
}

:deep(.ivu-page-item-active){
    background-color: #2d69fb;
}
:deep(.ivu-page-item-active a){
    color:white;
}
</style>

