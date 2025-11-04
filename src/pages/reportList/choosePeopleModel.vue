<template>
    <div v-if="isVisible" class="full-screen-modal">
        <Card class="modal-content">
            <template #title>
                <div class="title">选择人员</div> 
            </template>
            <template #extra>
                <Button icon="md-close" @click="$emit('close')"></Button>
            </template>
            <Row :gutter="16">
                <Col span="4">
                    <Select transfer v-model="searchItem.areaId" placeholder="区域" @on-change="areaChanged" @on-clear="areaCleared">
                        <Option v-for="(item, index) in areaList" :key="index" :value="item.areaId">{{ item.areaName }}
                        </Option>
                    </Select>
                </Col>
                <Col span="4">
                    <Select transfer v-model="searchItem.projectId" placeholder="项目" @on-clear="projectCleared" @on-change="projectChanged">
                        <Option v-for="(item, index) in projectList" :key="index" :value="item.projectId">{{ item.projectName }}
                        </Option>
                    </Select>
                </Col>
                <Col span="4">
                    <Select clearable transfer v-model="searchItem.jobId" placeholder="岗位名称" @on-clear="jobCleared">
                        <Option v-for="(item, index) in jobList" :key="index" :value="item.jobId">{{ item.jobName }}
                        </Option>
                    </Select>
                </Col>
                <Col span="4">
                    <Input placeholder="姓名" v-model="searchItem.userName"></Input>
                </Col>
                <Button type="primary" @click="search">查询</Button>
                <Button class="doneButton" @click="done" style="margin-left: 10px;">确定关联</Button>
            </Row>
            <div class="myTable">
                <Table  :data="allUsers" :columns="columns" @on-selection-change="selectionChanged"></Table>
            </div>
            
        </Card>
    </div>
</template>

<script>
import {getAreaList, getProjectList, getJobList, getJobArchUsers} from '@/service/landcrm';
export default {
    name:"choosePeopleModel",
    props: ['isVisible'],
    computed:{
            userInfo(){
                const { storageAction } = window.GlobalProperties.$utils || {};
                const { USER_INFO } = window.GlobalProperties.$constant || {};
                const info = storageAction({ key: USER_INFO, action: 'get' });
                return info;
            },
    },
    data(){
        return {
            searchItem:{
                userName:"",
                areaId:"-1",
                projectId:"",
                jobId:"",
                leave: "1",//只查询在职人员 
                companyId:""
            },
            allUsers:[],
            selectedUsers:[],
            columns:[
                {
                    type:"selection",
                    width: 60,
                    align: 'center'
                },
                {
                    title:"姓名",
                    key:"userName"
                },
                {
                    title:"岗位",
                    key:"jobs"
                },
                {
                    title:"电话",
                    key:"telephone"
                },
            ],
            areaList:[],
            projectList:[],
            jobList:[],
        }
    },
    watch:{
        isVisible(newVlaue,oldValue){
            if(newVlaue = false){
                this.searchItem = {
                    userName:"",
                    areaId:"-1",
                    projectId:"",
                    jobId:"",
                    leave: "1",//只查询在职人员 
                    companyId:""
                }          
                this.allUsers = [];
                this.selectedUsers = [];
            } else {
                this.initRequest();
            }
        }
    },
    methods:{
        async initRequest(){
            await this.requestAreaList();
            if(this.areaList.length>0){
                this.searchItem.areaId = this.areaList[0].areaId;
            }
            await this.requestProjectList();
            if(this.projectList.length > 0){
                this.searchItem.projectId = this.projectList[0].projectId
                this.requestJobList();
            }
            this.search();
        },
        areaChanged(){
            this.searchItem.projectId = "";
            this.projectList = [];
            this.searchItem.jobId = "";
            this.jobList = [];
            this.requestProjectList();
        },
        projectChanged(){
            this.searchItem.jobId="";
            this.jobList=[];
            this.requestJobList();
        },
        jobCleared(){
            this.searchItem.jobId="";
        },
        projectCleared(){
            this.searchItem.projectId="";
            this.searchItem.jobId="";
            this.jobList=[];
        },
        areaCleared(){
            this.searchItem.areaId = "";
            this.searchItem.projectId = "";
            this.searchItem.jobId = "";
            this.projectList = [];
            this.jobList = [];
        },
        search(){
            this.searchItem.companyId = this.userInfo.companyId;
            this.searchItem.leave=1;
            let param = {data:this.searchItem};
            return getJobArchUsers(param).then(res=>{
                this.allUsers = res.data;
            })
        },
        requestAreaList(){
            let dic = {userId:this.userInfo.userid};
            const params = {
                data: dic
            };
            let self = this;
            return getAreaList(params).then((res)=>{
                self.areaList = res.items;
                if(self.areaList.length>0){
                    self.searchItem.areaId = self.areaList[0].areaId;
                }
            })
        },
        requestProjectList(){
                let dic = {userId:this.userInfo.userid, areaId: this.searchItem.areaId};
                const params = {
                    data: dic
                };
                let self = this;
                return getProjectList(params).then((res)=>{
                    self.projectList = res.items;
                    if(self.projectList.length>0){
                        self.searchItem.projectId = self.projectList[0].projectId;
                    }
                })
        },
        requestJobList(){
                let dic = {userId:this.userInfo.userid, areaId: this.searchItem.areaId, projectId:this.searchItem.projectId};
                const params = {
                    data: dic
                };
                let self = this;
                getJobList(params).then((res)=>{
                    self.jobList = res.data;
                })
        },
        selectionChanged(selection){
            this.selectedUsers = selection
        },
        done(){
            if(this.selectedUsers.length == 0){
                this.$Message.error("选择人员不能为空");
                return;
            }
            this.$emit("done", this.selectedUsers);
        }
    }
}
    
</script>

<style lang="scss" scoped>
.full-screen-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000000;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  }
  .modal-content {
    width: 1000px; /* 或任何适合的宽度 */
    background-color: white;
  }
  .doneButton{
    color:#2d69fb;
    border-color: #2d69fb;
  }
  .myTable {
    margin-top: 20px;
    max-height: 50vh;
    overflow: auto;
  }
</style>