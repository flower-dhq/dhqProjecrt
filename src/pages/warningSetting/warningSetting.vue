<template>
    <div>
        <Card class="topCard">
            <template #title>
                <div class="title">预警设置</div> 
            </template>
            <template #extra>
                <Button type="primary" @click="createWarning">新增预警</Button>
            </template>
            <Row :gutter="16">
                <Col span="4">
                    <Select clearable filterable v-model="searchItem.areaId" placeholder="区域" @on-change="areaChanged" @on-clear="areaCleared">
                        <Option v-for="(item, index) in areaList" :key="index" :value="item.areaId">{{ item.areaName }}
                        </Option>
                    </Select>
                </Col>
                <Col span="4">
                    <Select clearable filterable v-model="searchItem.projectId" placeholder="项目" >
                        <Option v-for="(item, index) in projectList" :key="index" :value="item.projectId">{{ item.projectName }}
                        </Option>
                    </Select>
                </Col>
                <Col span="4">
                    <Select clearable filterable v-model="searchItem.warnType" placeholder="预警类型" >
                        <Option v-for="(item, index) in warnTypeList" :key="index" :value="item.value">{{ item.name }}
                        </Option>
                    </Select>
                </Col>
                <Col span="4">
                    <Select clearable filterable v-model="searchItem.enable" placeholder="状态" >
                        <Option v-for="(item, index) in enableList" :key="index" :value="item.value">{{ item.name }}
                        </Option>
                    </Select>
                </Col>
                <Button type="primary" @click="searchClick()">查询</Button>
            </Row>·
        </Card>
        <Card style="margin-top: 10px;">
            <Table :data="records" :columns="column" :border="true">
                <template #warnType="{ row, index }">
                    <div v-if="row.warnType == 0">汇报填写提醒</div>
                    <div v-if="row.warnType == 1">汇报超期提醒</div>
                    <div v-if="row.warnType == 2">指定汇报超期提醒</div>
                </template>
                <template #enable="{ row, index }">
                    <div v-if="row.enable == 0">禁用</div>
                    <div v-if="row.enable == 1">启用</div>
                </template>
                <template #action="{ row, index }">
                    <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                        <Button v-if="row.enable==1" class="tableButton" type="text" @click="disableWarning(row)" >禁用</Button>
                        <Button v-if="row.enable==0" class="tableButton" type="text" @click="enableWarning(row)">启用</Button>
                        <Button class="tableButton" type="text" @click="editWarning(row)">编辑</Button>
                        <Button class="tableButton" type="text" @click="deleteWarning(row)">删除</Button>
                    </div>
                </template>
            </Table>
            <CreateWarningModal :operateFlag="operateFlag" :oldData="detailData" @close="operateFlag=''" @success="createSuccessfully"></CreateWarningModal>
            <Page show-total show-elevator :total="totalCount" :page-size="pageSize" v-model="startIndex" @on-change="changePage" align="right"
              ></Page>
        </Card>
    </div>
</template>

<script>
import { getAreaList, getProjectList } from '@/service/landcrm';
import { warnList, warnDetail, deleteWarn,changeWarnState } from '@/service/officeSystem';
import CreateWarningModal from "./createWarningModal.vue"
export default {
        name:'reportList',
        components: {
            CreateWarningModal,
        },
        data() {
            return {
                operateFlag:"",//1：新建； 2：编辑
                detailData:null,
                totalCount: 0,
            pageSize: 10,
            startIndex: 1,
            records:[],
            searchItem:{
                areaId:"",
                projectId:"",
                warnType:"",
                enable:"",
            },
            column:[
                {
                    title:"操作",
                    slot:"action",
                    align:"center",
                },
                {
                    title:"预警类型",
                    slot:"warnType",
                    align:"center",
                    tooltip:true,
                },
                {
                    title:"预警规则",
                    key:"warnRuleWeekStr",
                    align:"center",
                },
                {
                    title:"项目名称",
                    key:"projectName",
                    align:"center",
                },
                {
                    title:"汇报岗位",
                    key:"reportPositionName",
                    align:"center",
                    tooltip:true,
                },
                {
                    title:"预警到岗",
                    key:"warnPositionName",
                    align:"center",
                    tooltip:true,
                },
                {
                    title:"状态",
                    slot:"enable",
                    align:"center",
                },
                {
                    title:"操作人员",
                    key:"operatorName",
                    align:"center",
                },
                {
                    title:"操作时间",
                    key:"operateDate",
                    align:"center",
                    width:200,
                },
                
            ],
            areaList:[],
            projectList:[],
            warnTypeList:[
                {
                    name:"汇报填写提醒",
                    value:0
                },
                {
                    name:"汇报超期提醒",
                    value:1
                },
                {
                    name:"指定汇报超期提醒",
                    value:2
                },
            ],
            enableList:[
                {
                    name:"禁用",
                    value:0
                },
                {
                    name:"启用",
                    value:1
                },

            ]
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
            createSuccessfully(){
                this.operateFlag = "";
                this.search();
            },
            searchClick(){
                this.startIndex=1;
                this.search();
            },
            enableWarning(row){
                let self = this
                this.$Modal.confirm({
                    title:"是否确认启用？",
                    onOk:()=>{
                        changeWarnState(row.id,1).then(res=>{
                            if(res.status == "200"){
                                self.$Message.success("启用成功")
                                self.search();
                            }
                        })
                    },
                    onCancel:()=>{

                    }
                })
            },
            disableWarning(row){
                let self = this
                this.$Modal.confirm({
                    title:"是否确认禁用？",
                    onOk:()=>{
                        changeWarnState(row.id,0).then(res=>{
                            if(res.status == "200"){
                                self.$Message.success("禁用成功")
                                self.search();
                            }
                        })
                    },
                    onCancel:()=>{

                    }
                })
            },
            deleteWarning(row){
                let self = this
                this.$Modal.confirm({
                    title:"是否确认删除？",
                    onOk:()=>{
                        deleteWarn(row.id).then(res=>{
                            if(res.status == "200"){
                                self.$Message.success("删除成功")
                                self.search();
                            }
                        })
                    },
                    onCancel:()=>{

                    }
                })
            },
            editWarning(row){
                let self = this;
                warnDetail(row.id).then(res=>{
                    self.operateFlag = '2';
                    self.detailData = res.data;
                })
            },
            changePage(index) {//楼栋列表分页
                this.startIndex = index;
                this.search()
            },
            search(){
                const params = {
                    data: this.searchItem
                };
                let self = this;
                warnList(params,this.pageSize,this.startIndex).then(res=>{
                    self.records = res.data.records;
                    self.records = self.records.map(item=>{
                        if(!item.reportPositionName){
                            item.reportPositionName = "--"
                        }
                        return item
                    });
                    self.totalCount = res.data.total;
                })
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
                if(info==null){
                    return;
                }
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
            createWarning(){
                this.operateFlag = '1';
            },
        }
    }
</script>

<style lang="scss" scoped>
.topCard :deep(.ivu-card-body) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.title {
  font-size: 16px; 
  margin: 5px;
}
.tableButton {
    color: #2d69fb;
    padding-left: 5px;
    padding-right: 5px;
}

:deep(.ivu-page-item-active){
    background-color: #2d69fb;
}
:deep(.ivu-page-item-active a){
    color:white;
}
</style>