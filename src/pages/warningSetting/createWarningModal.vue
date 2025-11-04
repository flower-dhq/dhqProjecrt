<template>
    <div v-if="operateFlag" class="full-screen-modal">
        <Card class="modal-content">
            <template #title>
                <div v-if="operateFlag=='1'" class="topTitle">新增预警</div> 
                <div v-else class="topTitle">编辑预警</div>
            </template>
            <template #extra>
                <Button icon="md-close" @click="$emit('close')"></Button>
            </template>
            <Row>
                <Col span="6">
                    <div class="title">预警类型<div class="redStar">*</div></div>
                </Col>
                <Col span="18">
                    <div class="content">
                        <Select v-model="formData.warnType" placeholder="预警类型" filterable @on-change="setWarnType">
                            <Option v-for="(item, index) in warnTypeList" :key="index" :value="item.value">{{ item.name }}
                            </Option>
                        </Select>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="6">
                    <div class="title">预警规则<div class="redStar">*</div></div>
                </Col>
                <Col span="18">
                    <div class="ruleContent">
                        <RadioGroup v-model="ruleFrequency">
                            <Radio label="week">每周</Radio>
                            <Radio v-if="formData.warnType==2" label="daily">每天</Radio>
                        </RadioGroup>
                        <div class="row">
                            <Select v-show="ruleFrequency=='week'" v-model="formData.warnRuleWeek" placeholder="请选择日期" style="width: 263px;" filterable>
                                <Option v-for="(item, index) in weekList" :key="index" :value="item.value">{{ item.name }}
                                </Option>
                            </Select>
                            <Input v-show="ruleFrequency=='daily' && formData.warnType==2" v-model="formData.warnRuleDaily" disabled placeholder="次日" value="次日" style="width: 263px;" />
                            <TimePicker v-model="formData.warnRuleTime" @on-change="changeTime" type="time" placeholder="请选择时间" format="HH:mm" style="width: 263px;margin-left: 10px;" />
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="6">
                    <div class="title">说明</div>
                </Col>
                <Col span="18">
                    <div class="content" >
                        汇报填写提醒：设置指定项目在指定时间点，提醒对应岗位人员填写汇报； <br> 

                        汇报超期提醒：设置指定项目在超过指定时间点后，预警未填写汇报的岗位人员； <br>

                        指定汇报超期预警：在截止时间内，对应项目未填写汇报的岗位人员（指定项目的汇报岗位），预警给不限制项目的指定岗位（预警到岗）；</div>
                </Col>
            </Row>
            <Row>
                <Col span="6">
                    <div class="title">项目名称<div class="redStar">*</div></div>
                </Col>
                <Col span="18">
                    <div class="content">
                        <Select transfer v-model="formData.projectId" placeholder="请选择项目名称" filterable>
                            <Option v-for="(item, index) in projectList" :key="index" :value="item.projectId">{{ item.projectName }}
                            </Option>
                        </Select>
                    </div>
                </Col>
            </Row>
            <Row v-if="formData.warnType == 2">
                <Col span="6">
                    <div class="title">汇报到岗<div class="redStar">*</div></div>
                </Col>
                <Col span="18">
                    <div class="content">
                        <Button type="primary" @click="showReportJob">选择岗位</Button>
                        <Tag class="tag" closable v-for="(item,index) in reportPositionArray" @on-close="removeReportPosition(index)">{{ item.name }}</Tag>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="6">
                    <div class="title">预警到岗<div class="redStar">*</div></div>
                </Col>
                <Col span="18">
                    <div class="content">
                        <Button type="primary" @click="showWarnJob">选择岗位</Button>
                        <Tag class="tag" closable v-for="(item,index) in warnPositionArray" @on-close="removeWarnPosition(index)">{{ item.name }}</Tag>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="6">
                    <div class="title" style="border-bottom-style: solid;">预警描述</div>
                </Col>
                <Col span="18">
                    <div class="content" style="border-bottom-style: solid; ">
                        <Input rows="5" v-model="formData.remark" placeholder="请输入预警描述" type="textarea"/>
                    </div>
                </Col>
            </Row>
            <div class="buttonView">
                <Button @click="$emit('close')">取消</Button>
                <Button type="primary" @click="submit" style="margin-left: 10px;">确定</Button>
            </div>
        </Card>
        <ChooseJobModal :isVisible="showChooseJob" :isWarnPosition="isWarnPosition" :associatedJobs="isWarnPosition?warnPositionArray:reportPositionArray" @close="showChooseJob=false" @changeAssociatedJobs="changeAssociatedJobs"></ChooseJobModal>
    </div>
</template>

<script>
import { warnSaveOrUpdate } from '@/service/officeSystem';
import { getProjectList } from '@/service/landcrm';
import ChooseJobModal from "./chooseJobModal.vue"
export default {
        name:'createWarningModal',
        props:{
            operateFlag:String,//1：新建； 2：编辑
            oldData:Object,
        },
        watch:{
            operateFlag(newValue,oldValue){
                if(newValue == "1"){
                    //新建
                    this.formData = {
                        warnType:"",//预警类型 0、汇报填写提醒 1、汇报超期提醒 2、指定汇报超期提醒
                        warnRuleWeek:"",//预警规则 1~7 代表 周一~周日	
                        warnRuleTime:"",//预警规则时间 时分秒格式
                        projectId:"",//项目ID
                        projectName:"",//项目名称
                        warnPosition:"",//预警岗位ID，不限制项目ID
                        warnPositionName:"",//预警岗位名称
                        reportPosition:"",//汇报岗位ID，限制项目ID	
                        reportPositionName:"",//汇报岗位名称
                        remark:"",//预警描述
                        operator:this.userInfo.userid,//操作人ID
                        operatorName:this.userInfo.userName,//操作人名
                        operateDate:"",//操作时间
                    } 
                } else if(newValue == "2"){
                    //编辑
                    this.formData = this.oldData;
                    if(this.oldData.warnRuleWeek==8){
                      this.ruleFrequency="daily";
                    }else{
                      this.ruleFrequency="week";
                    }
                }
            }
        },
        components: {
            ChooseJobModal,
        },
        computed:{
            userInfo(){
                const { storageAction } = window.GlobalProperties.$utils || {};
                const { USER_INFO } = window.GlobalProperties.$constant || {};
                const info = storageAction({ key: USER_INFO, action: 'get' });
                return info;
            },
            warnPositionArray(){
                if(!this.formData.warnPosition){
                    return [];
                }
                const idArray = this.formData.warnPosition.split(",");
                const nameArray = this.formData.warnPositionName.split(",");
                return idArray.map((id,index)=>{
                    let result = {};
                    result.id=id;
                    result.name = nameArray[index];
                    return result;
                })
            },
            reportPositionArray(){
                if(!this.formData.reportPosition){
                    return [];
                }
                const idArray = this.formData.reportPosition.split(",");
                const nameArray = this.formData.reportPositionName.split(",");
                return idArray.map((id,index)=>{
                    let result = {};
                    result.id=id;
                    result.name = nameArray[index];
                    return result;
                })
            },
        },
        data() {
            return {
                //选择岗位弹窗
                showChooseJob:false,
                isWarnPosition:false,
                associatedJobs:[],


                projectList:[],
                ruleFrequency:"week",
                formData:{
                    warnType:"",//预警类型 0、汇报填写提醒 1、汇报超期提醒 2、指定汇报超期提醒
                    warnRuleWeek:"",//预警规则 1~7 代表 周一~周日	
                    warnRuleTime:"",//预警规则时间 时分秒格式
                    warnRuleDaily:"次日",
                    projectId:"",//项目ID
                    warnPosition:"",//预警岗位ID，不限制项目ID
                    warnPositionName:"",//预警岗位名称
                    reportPosition:"",//汇报岗位ID，限制项目ID	
                    reportPositionName:"",//汇报岗位名称
                    remark:"",//预警描述
                },
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
                        name:"定岗汇报超期提醒",
                        value:2
                    },
                ],
                weekList:[
                    {
                        name:"周一",
                        value:1
                    },
                    {
                        name:"周二",
                        value:2
                    },
                    {
                        name:"周三",
                        value:3
                    },
                    {
                        name:"周四",
                        value:4
                    },
                    {
                        name:"周五",
                        value:5
                    },
                    {
                        name:"周六",
                        value:6
                    },
                    {
                        name:"周日",
                        value:7
                    },
                ],
            }
        },
        mounted(){
            this.requestProjectList();
        },
        methods:{
            setWarnType(val){
              if(val!=2){
                this.ruleFrequency="week"
              }
            },
            removeWarnPosition(index){
                // 拆分formData中的warnPosition和warnPositionName为数组
                let positions = this.formData.warnPosition.split(",");
                let positionNames = this.formData.warnPositionName.split(",");

                // 删除指定索引的元素
                positions.splice(index, 1);
                positionNames.splice(index, 1);

                // 重新拼接字符串并更新formData
                this.formData.warnPosition = positions.join(",");
                this.formData.warnPositionName = positionNames.join(",");
            },
            removeReportPosition(index){
                // 拆分formData中的warnPosition和warnPositionName为数组
                let positions = this.formData.reportPosition.split(",");
                let positionNames = this.formData.reportPositionName.split(",");

                // 删除指定索引的元素
                positions.splice(index, 1);
                positionNames.splice(index, 1);

                // 重新拼接字符串并更新formData
                this.formData.reportPosition = positions.join(",");
                this.formData.reportPositionName = positionNames.join(",");
            },
            changeAssociatedJobs(newJobs){
                
                if(this.isWarnPosition){
                    //预警岗位
                    const ids = newJobs.map(item=>item.id);
                    const names = newJobs.map(item=>item.name);
                    this.formData.warnPosition = ids.join();
                    this.formData.warnPositionName = names.join();
                } else {
                    //汇报岗位
                    const ids = newJobs.map(item=>item.id);
                    const names = newJobs.map(item=>item.name);
                    this.formData.reportPosition = ids.join();
                    this.formData.reportPositionName = names.join();
                }
                console.log("this.formData",this.formData);
            },
            showWarnJob(){
                //选择预警岗位
                this.showChooseJob = true;
                this.isWarnPosition = true;
                this.associatedJobs = this.warnPositionArray;
            },
            showReportJob(){
                //选择汇报岗位
                this.showChooseJob = true;
                this.isWarnPosition = false;
                this.associatedJobs = this.reportPositionArray;
            },
            changeTime(value){
                this.formData.warnRuleTime = value;
            },
            requestProjectList(){
                const { storageAction } = window.GlobalProperties.$utils || {};
                const { USER_INFO } = window.GlobalProperties.$constant || {};
                const info = storageAction({ key: USER_INFO, action: 'get' });
                let dic = {userId:info.userid, areaId: ""};
                const params = {
                    data: dic
                };
                let self = this;
                
                getProjectList(params).then((res)=>{
                    self.projectList = res.items;
                })
            },
            getCurrentFormattedTime() {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1; // 月份是从0开始的
                const day = now.getDate();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const seconds = now.getSeconds();

                // 使用`padStart()`来确保月、日、时、分、秒为双位数
                const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                return `${formattedDate} ${formattedTime}`;
            },



            submit(){
                console.log("this.formData",this.formData);
           
                if(this.formData.warnType===""){
                    this.$Message.error("预警类型不能为空")
                    return;
                }
                if(this.ruleFrequency=="week" && (!this.formData.warnRuleWeek || !this.formData.warnRuleTime) ){
                    this.$Message.error("预警规则不能为空")
                    return;
                }
                if(this.ruleFrequency=="daily" && !this.formData.warnRuleTime){
                  this.$Message.error("预警规则不能为空")
                  return;
                }
                if(this.ruleFrequency=="daily"){
                  this.formData.warnRuleWeek="8";
                }
                if(!this.formData.projectId){
                    this.$Message.error("项目名称不能为空")
                    return;
                }
                if(this.formData.warnType == 2 && !this.formData.reportPosition){
                    this.$Message.error("汇报到岗不能为空")
                    return;
                }
                if(!this.formData.warnPosition){
                    this.$Message.error("预警到岗不能为空")
                    return;
                }
                let self =this;
                this.formData.operateDate = this.getCurrentFormattedTime();
                const projectData = this.projectList.find(item=>item.projectId==this.formData.projectId);
                this.formData.projectName = projectData.projectName;
                if(this.formData.warnType != 2){
                    //不是指定汇报超期提醒
                    this.formData.reportPosition = "";
                    this.formData.reportPositionName = "";
                }
                if(this.formData.warnRuleTime.length == 5){
                    this.formData.warnRuleTime += ":00"
                }
                const params = {
                    data: this.formData
                };
                warnSaveOrUpdate(params).then((res)=>{
                    if(res.status=="200"){
                        self.$Message.success("提交成功")
                        self.$emit('success');
                    }else{
                        self.$Message.error(res.message);
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
.full-screen-modal {
    font-family: "PingFang SC";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  }
  .modal-content {
    width: 800px; /* 或任何适合的宽度 */
    background-color: white;
  }
  .topTitle{
    font-size: 24px;
    font-weight: bold;
  }
  .title{
    font-size: 14px;
    min-height: 45px;
    border-top-style: solid;
    border-left-style: solid;
    border-color: lightgray;
    border-width: 1px;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    padding-left: 10px;
    height: 100%;
  }
  .content {
    line-height: 150%;
    font-size: 14px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-top-style: solid;
    border-left-style: solid;
    border-right-style: solid;
    border-width: 1px;
    border-color: lightgray;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    height: 100%;
    flex-wrap: wrap;
  }
  .ruleContent {
    font-size: 14px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 20px;
    padding-bottom: 5px;
    border-top-style: solid;
    border-left-style: solid;
    border-right-style: solid;
    border-width: 1px;
    border-color: lightgray;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    height: 93px;
  }
  .redStar {
    color: red;
  }
  .buttonView{
    display: flex;
    flex-direction: row;
    justify-content: right;
    align-items: center;
    padding-top: 10px;
  }
  .row{
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    padding-top: 14px;
  }
  .tag{
    margin: 5px
  }
</style>