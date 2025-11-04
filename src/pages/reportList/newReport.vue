<template>
   <div class="background">
        <div v-if="isForCreate" class="topTitle">
            新增工作汇报
        </div>
        <div class="topView" v-else>
            <div style="font-size: 20px;">{{ oldData.title }}</div>
            <div style="font-size: 10px; margin-left: 10px;">{{ oldData.submitTime }}</div>
            <div class="unread">{{ oldData.readCount }}人已读</div>
        </div>
        <!-- <div class="title"><div class="redStar">*</div>区域：</div>
        <Select filterable :disabled="!isEditable" v-model="formData.areaId" placeholder="区域" @on-change="areaChanged" >
            <Option v-for="(item, index) in areaList" :key="index" :value="item.areaId">{{ item.areaName }}
            </Option>
        </Select>
        <div class="title"><div class="redStar">*</div>项目：</div>
        <Select filterable :disabled="!isEditable" v-model="formData.projectId" placeholder="项目" >
            <Option v-for="(item, index) in projectList" :key="index" :value="item.projectId">{{ item.projectName }}
            </Option>
        </Select> -->
        <div class="title"><div class="redStar">*</div>所属项目：</div>
        <Select filterable  v-if="isEditable" v-model="formData.projectId" placeholder="项目" >
            <Option v-for="(item, index) in currentProjectList" :key="index" :value="item.projectId">{{ item.projectName }}
            </Option>
        </Select>
        <div v-else>{{formData.projectName}}</div>
        <div class="title"><div class="redStar">*</div>本次汇报内容：</div>
        <Input v-if="isEditable" v-model="formData.workContent" type="textarea" rows="4" placeholder="请输入"></Input>
        <div v-else>{{formData.workContent}}</div>
        <div class="title"><div class="redStar">*</div>工作计划安排：</div>
        <Input v-if="isEditable" v-model="formData.nextWeekWorkPlan" type="textarea" rows="4" placeholder="请输入"></Input>
        <div v-else>{{formData.nextWeekWorkPlan}}</div>
        <div class="title">需要协助和帮助：</div>
        <Input v-if="isEditable" v-model="formData.remark" type="textarea" rows="4" placeholder="请输入"></Input>
        <div v-else>{{formData.remark}}</div>
        <div class="title">附件：</div>
        <NameTag v-for="(item, index) in formData.attachmentList" :name="item.fileName" :closable="isEditable" @on-close="removeFile(index)" @click=downloadFile(index)></NameTag>
        <Upload ref="refUpload" v-if="isEditable"  :on-success="uploadSuccess"
                :on-error="uploadFailed"
                action="/landcrm/rest/uploadFileInfo/uploadMutiFile" 
                >
                <div class="uploadButton">点击或将文件拖拽到这里上传</div>
              </Upload>
        <div class="title"><div class="redStar">*</div>汇报给谁：<Button v-if="isForCreate || (formData.isDraft==1 && !isForShow)" class="choosePoepleButton" @click="showChoosePeopleModel=true">选择人员</Button></div>
        <Table :data="formData.weeklyReportRelateVoList" :columns="userColumn"></Table>
        <div class="buttonView">
            <Button v-if="isEditable" @click="$emit('close')">取消</Button>
            <Button v-if="isForCreate || (isForEdit && formData.isDraft==1)" @click="submit(true)" style="margin-left: 10px;">保存草稿</Button>
            <Button v-if="isEditable" type="primary" @click="submit(false)" style="margin-left: 10px;">提交</Button>
            <Button v-else @click="$emit('close')">关闭</Button>
        </div>
        <ChoosePeopleModel :isVisible="showChoosePeopleModel" @close="showChoosePeopleModel=false" @done="getPeople"></ChoosePeopleModel>
   </div>

</template>

<script>
import ChoosePeopleModel from "./choosePeopleModel.vue"
import { h, resolveComponent } from 'vue'
import {saveOrUpdate} from '@/service/officeSystem';
import NameTag from "@/components/NameTag.vue"
import { getAreaList, getProjectList } from '@/service/landcrm';
 export default {
        name:'NewReport',
        props: {
            isForCreate: Boolean,
            isForEdit: Boolean,
            isForShow:Boolean,
            isVisible:Boolean,
            oldData:Object,
        },
        components: {
            ChoosePeopleModel,
            NameTag,
        },
        computed:{
            userInfo(){
                const { storageAction } = window.GlobalProperties.$utils || {};
                const { USER_INFO } = window.GlobalProperties.$constant || {};
                const info = storageAction({ key: USER_INFO, action: 'get' });
                return info;
            },
            isEditable(){
                if(this.isForCreate || this.isForEdit){
                    return true
                } else {
                    return false
                }
            },
            userColumn(){
                let result =[
                    {
                        title:"姓名",
                        key:"receiveUserName"
                    },
                    {
                        title:"岗位",
                        key:"jobName"
                    },
                    {
                        title:"电话",
                        key:"phoneNumber"
                    }];
                    if(this.isForCreate || (this.formData.isDraft==1 && !this.isForShow)){
                        result.splice(0,0,{
                            title: '操作',
                            key: 'action',
                            render: (h, params) => {
                                return h(resolveComponent('Button'), {
                                    type: 'text',
                                    size: 'small',
                                    style: {
                                        marginRight: '5px',
                                        color:"#2d69fb",
                                    },
                                    onClick: () => {
                                        this.removePeople(params.index)
                                    }
                                }, {
                                    default() {
                                        return '删除'
                                    }
                                })
                            }
                        })
                    }
                    if(this.isForShow){
                        result.push({
                            title: '状态',
                            key: 'action',
                            render: (h, params) => {
                                if (this.formData.isDraft == 1) {
                                    return h(
                                        'div',
                                        '--'
                                    )
                                } else {
                                    let colorStr = 'green';
                                    if (params.row.isReadVal == '未读') {
                                        colorStr = 'red'
                                    }
                                    return h(
                                        'div',
                                        {
                                            type: 'text',
                                            size: 'small',
                                            style: {
                                                marginRight: '5px',
                                                color: colorStr,
                                            },
                                        },
                                        params.row.isReadVal
                                    )
                                }
                            }
                        })
                    }
                
                
                return result
            }
        },
        data() {
            return {
                formData:{
                    areaId:"",
                    projectId:"",
                    title:"",
                    submitTime:"",
                    creatorName: "",
                    creator: "",
                    workContent:"",//本周工作内容
                    nextWeekWorkPlan:"",//下周工作计划
                    remark:"",//需要协助和帮助
                    attachmentList:[],//附件
                    weeklyReportRelateVoList:[],//汇报给谁
                    companyId:"",
                    isDraft:0,//是否为草稿，1：是，0：否
                },
                showChoosePeopleModel:false,
                areaList:[],
                projectList:[],
                currentProjectList: [],
            }
            
           
        },
        watch: {
            // whenever question changes, this function will run
            isVisible(newValue, oldValue) {
            if (newValue = true) {
                if(this.isForEdit || this.isForShow){
                    this.formData = this.oldData;
                    // if(this.formData.areaId){
                    //     this.requestProjectList();
                    // }
                    console.log("this.formData",this.formData);
                } else {
                    this.formData = {
                        areaId:"",
                        // projectId:"",
                        creatorName: "",
                        creator: "",
                        workContent:"",//本周工作内容
                        nextWeekWorkPlan:"",//下周工作计划
                        remark:"",//需要协助和帮助
                        attachmentList:[],//附件
                        weeklyReportRelateVoList:[],//汇报给谁
                        companyId:"",
                        isDraft:0,//是否为草稿，1：是，0：否
                    }
                }
            }
            }
        },
        mounted(){
            // this.requestAreaList();
            // this.getCurrnetProjectList()
        },
        methods:{
            areaChanged(){
                this.formData.projectId = "";
                this.projectList = [];
                this.requestProjectList();
            },
            requestAreaList(){
                const { storageAction } = window.GlobalProperties.$utils || {};
                const { USER_INFO } = window.GlobalProperties.$constant || {};
                const info = storageAction({ key: USER_INFO, action: 'get' });
                let dic = {userId:info.userid};
                const params = {
                    data: dic
                };
                let self = this;
                getAreaList(params).then((res)=>{
                    self.areaList = res.items.map(item=>{
                        item.areaId = item.areaId.toString();
                        return item;
                    });
                    console.log("self.areaList",self.areaList)
                })
            },
            requestProjectList(){
                const { storageAction } = window.GlobalProperties.$utils || {};
                const { USER_INFO } = window.GlobalProperties.$constant || {};
                const info = storageAction({ key: USER_INFO, action: 'get' });
                let dic = {userId:info.userid, areaId: this.formData.areaId};
                const params = {
                    data: dic
                };
                let self = this;
                getProjectList(params).then((res)=>{
                    self.projectList = res.items;
                    if(self.projectList.length>0){
                        self.formData.projectId = self.projectList[0].projectId;
                    }
                })
            },
            downloadFile(index){
                let file = this.formData.attachmentList[index];
                fetch(file.fileUrl).then(response => response.blob()).then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const anchor = document.createElement('a');
                    anchor.href = url;
                    anchor.download = file.fileName || 'download';
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);
                    window.URL.revokeObjectURL(url);
                });
            },
            uploadFailed(){
                this.$Message.error("上传文件失败")
            },
            removeFile(index){
                this.formData.attachmentList.splice(index,1)
            },
            uploadSuccess(res, file,fileList){
                let dic = {}
                dic.fileName = res.fileInfo.fName;
                dic.fileUrl = res.fileInfo.resPath;
                dic.fileId = res.fileInfo.fid;
                if(!this.formData.attachmentList){
                    this.formData.attachmentList = [];
                }
                this.formData.attachmentList.push(dic);
                this.$refs.refUpload.clearFiles();
            },
            getPeople(users) {
                users.forEach((item) => {
                    if(!this.formData.weeklyReportRelateVoList){
                        this.formData.weeklyReportRelateVoList = [];
                    }
                    // 检查当前用户是否已存在于列表中
                    const userExists = this.formData.weeklyReportRelateVoList.find((user) => user.receiveUserId === item.userId);
                    if (!userExists) {
                        // 如果用户不存在，创建新用户对象并添加到数组中
                        let user = {};
                        user.receiveUserId = item.userId;
                        user.receiveUserName = item.userName;
                        user.jobName = item.jobs;
                        user.jobId = item.jobIds;
                        user.phoneNumber = item.telephone;
                        this.formData.weeklyReportRelateVoList.push(user);
                    }
                });
                this.showChoosePeopleModel = false;
            },

            removePeople(index){
                this.formData.weeklyReportRelateVoList.splice(index,1);
            },
            submit(isDraft){
                if(isDraft){
                    this.formData.isDraft=1;
                }else {
                    // if(!this.formData.areaId){
                    //     this.$Message.error("区域不能为空")
                    //     return
                    // }
                    if(!this.formData.projectId){
                        this.$Message.error("项目不能为空")
                        return false;
                    }
                    if(!this.formData.workContent){
                        this.$Message.error("本周工作内容不能为空")
                        return false;
                    }
                    if(!this.formData.nextWeekWorkPlan){
                        this.$Message.error("下周工作计划不能为空")
                        return false;
                    }
                    if(undefined==this.formData.weeklyReportRelateVoList){
                        this.$Message.error("汇报给谁不能为空")
                        return false;
                    }
                    this.formData.isDraft=0;
                }
                
                if(this.isForCreate){
                    this.formData.creatorName = this.userInfo.userName;
                    this.formData.creator = this.userInfo.userid;
                    this.formData.companyId = this.userInfo.companyId;
                    this.formData.title = this.userInfo.userName + "的工作汇报";
                }
                let param = {
                    data:this.formData
                }
                this.$Spin.show();
                saveOrUpdate(param).then(res=>{
                    this.$Spin.hide();
                    if(res.status == "200"){
                        this.$emit("submit")
                    }else{
                        this.$Message.error(res.message)
                    }

                })
            },
            // 获取所属项目
            getCurrnetProjectList(projectId){
                const { storageAction } = window.GlobalProperties.$utils || {};
                const { USER_INFO } = window.GlobalProperties.$constant || {};
                const info = storageAction({ key: USER_INFO, action: 'get' });

                const params = {
                    data: { 
                        userId: info.userid, 
                        areaId: '' 
                    }
                }

                getProjectList(params).then((res)=>{
                    this.currentProjectList = res.items || []
                    if (projectId) {
                        this.formData.projectId = projectId
                    }else {
                        this.formData.projectId = res.items[0]?.projectId
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
.background {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: stretch;
}

.topTitle{
    padding-left: 15px;
    font-size: 20px;
    color: white;
    background-color: #2d69fb;
    display: flex;
    align-items: center;
    height: 58px;
}

.topView{
    padding-left: 15px;
    color: white;
    background-color: #2d69fb;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    height: 58px;
}

.unread{
    font-size: 10px;
    color: #2d69fb;
    background-color: white;
    border-radius: 5px;
    padding: 5px;
    margin-left: 10px;
}

.redStar {
    color: red;
}

.title {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    margin-top:20px;
    margin-bottom: 10px;
}

.buttonView{
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: right;
    align-items: center;
}

.choosePoepleButton{
    color:#2d69fb;
    border-color: #2d69fb;
}
.uploadButton{
    border-style: dashed;
    border-color: lightgray;
    border-width: 1px;
    border-radius: 5px;
    height: 50px;
    width:660px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>