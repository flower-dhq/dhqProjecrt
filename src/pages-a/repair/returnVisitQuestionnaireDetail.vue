<template><!--问卷列表-->
  <view class="ques-page-wrap" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="ques-main-wrap">
      <view class="main-card-wrap">
        <view class="card-title-wrap">
          <view class="status-wrap">
            {{ respAuth ? '待评价' : visitState == 2 ?  '已评价' : '已超时' }}
          </view>
          <view class="title-wrap">
            {{ taskDetail.taskTypeNmae || '' }}
          </view>
        </view>
        <view class="card-quesDesc-wrap">
          {{ taskDetail.quesDesc || '' }}
        </view>
      </view>
      <view class="main-card-wrap">
        <view class="topic-wrap">
          <view class="topic-title">
            <text class="topic-required">*</text>
            请您确认问题是否已经处理完成
          </view>
          <view class="all-rate-wrap">
            <view :class="['all-rate-item', {'rate-item-active': isSolve == '1'}]" @click="changeFinishState('1')">
              <image v-if="isSolve == '1'" src="@/static/icon-img/smile_act.png" style="width: 50rpx; height: 44rpx;" mode="aspectFill" />
              <image v-else src="@/static/icon-img/smile.png" style="width: 50rpx; height: 44rpx;" mode="aspectFill" />
              <text class="rate-item-text">已解决</text>
            </view>
            <view :class="['all-rate-item', {'rate-item-active': isSolve == '2'}]" @click="changeFinishState('2')">  
              <image v-if="isSolve == '2'" src="@/static/icon-img/angry_act.png" style="width: 50rpx; height: 44rpx;" mode="aspectFill" />
              <image v-else src="@/static/icon-img/angry.png" style="width: 50rpx; height: 44rpx;" mode="aspectFill" />
              <text class="rate-item-text">未解决</text>
            </view>
          </view>
        </view>
      </view>
      <view class="main-card-wrap">
      <view v-for="(item, index) in questions" :key="index" class="topic-wrap">
        <view class="topic-title">
          <text v-if="item.required == '1'" class="topic-required" >*</text>
          {{(index + 1)}}. {{item.title}}
        </view>
        <star-rating v-if="item.type == 3" :disabled="!respAuth" :elementList="item.elementList" v-model="item.rate" @change="e => onRaterChange(e, item, index)" />
        <view v-if="item.type == 0" class="ques-select ques-input">
            <u-radio-group  :disabled="!respAuth" v-model="item.select" placement="column" activeColor="var(--app-primary-color)">
              <view v-for="(elementItem, elementIndex) in item.elementList" :key="elementIndex" style="margin: 10rpx 0 20rpx">
              <u-radio
               :key="elementIndex"
              @change="onRadioChange(item,elementItem, index)"
              :label="elementItem.title"
						  :name="elementItem.title"
              style="padding-bottom: 20rpx;"
              ></u-radio>
              </view>
            </u-radio-group>
            <u--textarea :disabled="!respAuth" v-if="elementItem.remarkFlag && elementItem.select" placeholder="请输入描述" :rows="5"
                   v-model="elementItem.remark"></u--textarea>
        </view>
        <view v-if="item.type == 1" class="ques-checklist ques-input">
					<u-checkbox-group  :disabled="!respAuth" v-model="item.select" placement="column" >
						<view v-for="(elementItem, elementIndex) in item.elementList" :key="elementIndex">
								<u-checkbox
										:customStyle="{marginBottom: '8px'}"
										@change="onCheckboxChange(item,elementItem, index)"
										:label="elementItem.title"
										:name="elementItem.title"
								>
								</u-checkbox>          
							<u--textarea :disabled="visitState == 2" v-if="elementItem.remarkFlag && elementItem.select" placeholder="请输入描述" :rows="5"
										 v-model="elementItem.remark"></u--textarea>
						</view>
					</u-checkbox-group>
        </view>
        <view v-if="item.type == 2" class="ques-input">
          <u--textarea :disabled="!respAuth" placeholder="请输入描述" :rows="5" v-model="item.answerText" :maxlength="500" autosize></u--textarea>
        </view>
      </view>
      </view>
    </view>
    <view v-if="respAuth" class="ques-btn-wrap">
      <view class="ques-btn" @click="successVisit">提交</view>
    </view>
    <custom-modal ref="customModal"></custom-modal>
    <u-modal v-if="isErrorMessage" :show="isErrorMessage" title="提示" :width="260" @confirm="goback">
          <view class="slot-content">
              <text> {{ errorMessage }}</text>
          </view>
    </u-modal>
  </view>
</template>

<script>
	import {getReturnVisitRecordById,getQuestionnaireById,saveQuestionnaire,getAnswerValueById} from '@/service/returnVisit.js';
	import {feedBackOrderDetailToJson} from '@/service/landcrm.js';
	import starRating from './star-rating.vue'
	import util from '@/js/utils.js';
  export default {
    name: 'returnVisitQuestionnaireDetail',
    components: {
      starRating
    },
    computed: {
      respAuth() {
        // 待回访，允许作答
        return this.visitState == '1' || this.visitState == '6';
      }
    },
    data() {
      return {
        originData: '',
        questions: [],
        successSaveData: { //
          visitIds: '', //必传 回访ID
          ownerNameye: '', //业主name
          ownerTel: '', //业主电话
          houseInfoId: '', //房间id
          address: '', //地址
          mpqId: '', //问卷id
          desc: '', //问卷描述
          answerValueList: [], //答题内容 必传  题目ID和分数值
          visitDesc: '', //回访说明
          // userName: localStorage.ownerName,//用户名称
          userName: '',//用户名称
          satisfied: '',
          source: 1,
        },
        visitId: '',
        taskDetail: {},
        visitState: '',
        questionnaireId: '',
        type: '', //判断是否从推送进入
        isSolve: '',
        satisfiesDesc:["非常不满意", "不满意", "一般", "满意", "非常满意"],
        satisfied:0,
        isSatisfied:false,
        taskState: '4',
        orderId: '',
        scrollHeight: "100%",
        memberId:'',
				userInfo:{},
        temp:'',
        isErrorMessage: false, //是否显示超时提示
        errorMessage:''
      };
    },
		onLoad(options){
 				const { MEMBER_ID, PROJECT_ID ,O_USER_INFO } = this.$constant;
				this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
				// this.companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' });
				this.userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' });
				this.visitId = options.visitId ? options.visitId : '';
				this.type = options.type ? options.type : '';
				this.successSaveData.userName = this.userInfo.memberName
				this.getReturnVisitRecord();
		},
    methods: {
      goback(){
               uni.reLaunch({
                              url: "/pages/index/index",
                           });
      },
      findCorrelationSubjects(correlationSubjectsIds) {
        var arr = this.originData.filter(item => {
          return correlationSubjectsIds.indexOf(item.id + '') > -1;
        });
        return $.extend(true, [], arr);

      },
      onRadioChange(item, elementItem, index) {
        if(this.visitState == 2){
          return;
        }
        if (!elementItem.select) {
          item.elementList.forEach(e => {
            this.$set(e, 'select', false);
          })
          this.$set(elementItem, 'select', true);
          var correlationSubjectsId = elementItem.correlationSubjectsId;
          if (correlationSubjectsId) {
            if (item.correlationSubjectsIds == correlationSubjectsId) {
              return;
            }
            if (item.correlationSubjectsIds) {
              this.questions.splice(index + 1, item.correlationSubjectsIds.split(',').length);
            }
            item.correlationSubjectsIds = correlationSubjectsId;
            var items = this.findCorrelationSubjects(item.correlationSubjectsIds.split(','));
            this.questions.splice(index + 1, 0, ...items);
          } else {
            if (item.correlationSubjectsIds) {
              this.questions.splice(index + 1, item.correlationSubjectsIds.split(',').length);
              item.correlationSubjectsIds = '';
            }
          }
        }
      },
      onCheckboxChange(item, elementItem, index) {
        if(this.visitState == 2){
          return;
        }
        if (elementItem.select) {
          this.$set(elementItem, 'select', false);
          var correlationSubjectsId = elementItem.correlationSubjectsId;
          if (correlationSubjectsId) {
            if (elementItem.differenceSubjectsIds){
              this.questions.splice(index + 1, elementItem.differenceSubjectsIds.length);
            }

            item.correlationSubjectsIds.splice(item.correlationSubjectsIds.indexOf(correlationSubjectsId), 1);
          }

        } else {
          //控制多选选项答案
          if(item.limitNum){
            var seleceds = item.elementList.filter(e => {
              return e.select;
            })
            if(seleceds.length == item.limitNum){
              this.$vux.alert.show({
                title: '提示',
                content: '最多选择' + item.limitNum + '个选项'
              })
              this.$forceUpdate();
              return;
            }
          }

          this.$set(elementItem, 'select', true);
          var correlationSubjectsId = elementItem.correlationSubjectsId;
          if (correlationSubjectsId) {
            var originSubjectIds = [];
            if (!item.correlationSubjectsIds) {
              item.correlationSubjectsIds = [];
            }
            item.correlationSubjectsIds.forEach(e => {
              originSubjectIds.push(...e.split(','));
            })
            var differenceSubjectsIds = correlationSubjectsId.split(',').filter(e => {
              return originSubjectIds.indexOf(e) == -1;
            })
            item.correlationSubjectsIds.push(correlationSubjectsId);
            elementItem.differenceSubjectsIds = differenceSubjectsIds;
            var items = this.findCorrelationSubjects(differenceSubjectsIds);
            this.questions.splice(index + 1, 0, ...items);
          }
        }
        this.$forceUpdate();
      },
      getReturnVisitRecord() { //查询不成功回访的列表
        var self = this;
        getReturnVisitRecordById({visitId : self.visitId}).then(res => {
          if(res.status == '200') {
            self.taskDetail = res.data || {}
            self.visitState = res.data.visitState;
            self.questionnaireId = res.data.mpqId;
            if(self.visitState == 6 || self.visitState == 1){
              self.getQuestionData()
              self.orderId = res.data.taskId;
              self.getTaskDetail();
            }else if(self.visitState == 2){
              self.isSolve = res.data.isSolve;
              self.getsuccessSaveData();
            }else if (self.visitState == 3){
              self.isErrorMessage = true;
              self.errorMessage ='已超时，不能回访'
              }
              // else if (self.visitState == 1){
              // self.isErrorMessage = true;
              // self.errorMessage ='已转客服回访，不能回访'
              // self.$refs.customModal.show({
              //               title: '提示',
              //               content: '已超时，不能回访',
              //               showConfirmButton: true,
              //               confirmText: "确认",
              //               onConfirm: () => {
              //                 uni.switchTab({ url: "/pages/index/index"})
              //                 // uni.reLaunch({
              //                 //        url: "/pages/index/index",
              //                 //      });
              //               }
              //           })
            // }

          }
        })
      },
      getQuestionData() { //获取回访的题目
        var self = this;
        let jsonData = {
          mpqId: this.questionnaireId,
        };
        getQuestionnaireById(jsonData).then(res => {
					
          if(res.status == '200') {
            if(res.data.subjectsList && res.data.subjectsList.length > 0) {
              let arrayData = [];
              self.originData = res.data.subjectsList;
              var levelTwoQues = []
              if (self.originData.length > 0) {
                self.originData.forEach(item => {

                  if (item.type < 2 || item.type == 3) {
                    item.elementList.forEach(elementItem => {
                      if (elementItem.correlationSubjectsId) {
                        levelTwoQues.push(...elementItem.correlationSubjectsId.split(','));
                      }
                    })
                    if (item.type == 3) {
                      item.elementList = item.elementList.sort((a,b)=>{
                        return a.score - b.score
                      })
                      item.elementList = item.elementList.filter(e => {
                        return e.score != 0
                      })
                    }

                  }
                })
                
                self.originData.forEach(item => {
                  if (levelTwoQues.indexOf(item.id + '') == -1)
                   item.answerText="";
									 item.rate = 0
                   this.$set(item,'rate',0)
                    self.questions.push(item);
                })
              } 
            }
            console.log('res----',res)
          }
        });
      },
      successVisit() {
        /**
         * 成功回访
         * 总体满意度必填，其他选项可不必填
         */
        var self = this;
        var flag = true;
        var length = self.questions.length;
        if (!this.isSolve) {
          uni.showToast({
            title: '请您确认问题是否已经处理完成',
            duration: 2000,
            icon: 'none'
          })
          return;
        }
        if (length > 0) {
          self.successSaveData.answerValueList = [];
          for (var i = 0; i < length; i++) {
            var item = self.questions[i];
            var answer = {
              result: [],
              elements: [],
              remarks: [],
              subjectsId: item.id,
              text: '',
            };
            //单选题
            if (item.type == 0 || item.type == 3) {
              item.elementList.forEach((radioElement,index)=> {
                if(item.type == 3 && item.rate){
                  if((item.rate - 1) == index) {
                    radioElement.select = true;
                  }
                }
                if (radioElement.select) {
                  answer.elements.push(radioElement.id);
                  answer.result.push(radioElement.title);
                  if (radioElement.remarkFlag && radioElement.remark) {
                    answer.remarks.push({
                      id: radioElement.id,
                      remark: radioElement.remark,
                    });
                  }
                }
              })
            }
            //多选题
            if (item.type == 1) {
              item.elementList.forEach(elementItem => {
                if (elementItem.select) {
                  answer.elements.push(elementItem.id);
                  answer.result.push(elementItem.title);
                  if (elementItem.remarkFlag && radioElement.remark) {
                    answer.remarks.push({
                      id: elementItem.id,
                      remark: elementItem.remark,
                    });
                  }
                }

              })
            }

            if ((item.type < 2 || item.type == 3) && item.required == 1 && !answer.elements.length) {
              flag = false;
              break;
            }
            //填空题
            if (item.type == 2) {
              if (item.answerText) {
                answer.text = item.answerText;
                answer.result.push(item.answerText);
              } else if (item.required == 1) {
                flag = false;
                break;
              }
            }

            answer.elements = answer.elements.join(',');
            if (answer.remarks.length > 0) {
              answer.remarks = JSON.stringify(answer.remarks);
            } else {
              answer.remarks = '';
            }
            if (answer.result.length > 0) {
              answer.result = answer.result.join(',');
            } else {
              answer.result = '';
            }
            self.successSaveData.answerValueList.push(answer);
          }
        }
         if(!flag){
					uni.showToast({
						title:'问卷填写不完整',
						duration: 2000,
						icon: 'none'
					})
          return;
        }
				uni.showModal({
					title: '提示',
					content: '是否确认提交？',
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
							uni.showLoading({title: '正在提交'})
							self.confirmQuestionnaire();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
      },
      confirmQuestionnaire(){
        const { MEMBER_ID } = this.$constant;
        let self= this;
        self.successSaveData.visitIds = self.visitId;
        self.successSaveData.isSolve = self.isSolve;
        self.successSaveData.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
        saveQuestionnaire(self.successSaveData).then(res => {
          uni.hideLoading()
          if(res.status == 200) {
            //回访添加积分
       //        let json = {
       //          memberId: this.memberId,
       //          source: 'SERVICE_EVALUATION',
       //          calculationMethod: 1,
       //          condition: 1,
       //        }
							// let params = {
							// 	data:json
							// }
       //        grantMemberGrowthIntegral(params);
            const pages = getCurrentPages()
            const processingProgressPage = pages.find(item => item.route == 'pages-a/repair/processingProgress')  
            const multiplePage = pages.length > 1
            if (multiplePage || processingProgressPage) {
              self.confirmCloseWindow();
            } else {
              this.visitState = 2
            }
            // self.confirmCloseWindow();
          }else {
						uni.showToast({
							title:res.message,
							duration: 2000,
							icon: 'none'
						})
          }
        })
      },
      confirmCloseWindow(){
        let self = this;
				uni.showToast({
					title:'回访成功',
					duration: 2000,
					icon: 'none'
				})
        // uni.$emit('refreshData');
				uni.navigateBack()

      },
      getsuccessSaveData() { //查看状态下，查看回访结果
        var self = this;
        getAnswerValueById({visitId: self.visitId, }).then(res => {
          if(res.status == 200){
            self.subjectsList = res.data.questionnaireMpqExtend.subjectsList;
            self.subjectsList.forEach((subjectItem, subjectIndex) => {
              var answers = res.data.questionnaireAnswerValues.filter( answerItem => {
                return subjectItem.id == answerItem.subjectsId;
              })
              if(answers.length > 0){
                var answer = answers[0];
                if(subjectItem.type < 2 || subjectItem.type == 3){
                  if(answer.elements){
                    var elementIds = answer.elements.split(',');
										let arr = []
                    elementIds.forEach((remarkItem) => {
                      if(subjectItem.type == 3){
                        subjectItem.elementList = subjectItem.elementList.sort((a,b)=>{
                          return a.score - b.score
                        })
                        subjectItem.elementList = subjectItem.elementList.filter(e => {
                          return e.score != 0
                        })
                      }
                      subjectItem.elementList.forEach( (elementItem,elementIndex) => {

                        if(remarkItem == elementItem.id){
                          if(subjectItem.type==0){
                            subjectItem.select = elementItem.title;
                          }else if(subjectItem.type==1){
                            arr.push(elementItem.title)
                            subjectItem.select = arr
                          }else if( subjectItem.type == 3){
                            subjectItem.rate = elementIndex + 1;
                            subjectItem.satisfied = elementItem.title;
                          }
                        }
                      })
                    });
                  }

                  if(answer.remarks){
                    var  remarks = JSON.parse(answer.remarks);
                    remarks.forEach(remarkItem => {
                      subjectItem.elementList.forEach( elementItem => {
                        if(remarkItem.id == elementItem.id){
                          elementItem.remark = remarkItem.remark;
                        }
                      })
                    });
                  }
                }else if(subjectItem.type == 2){
                  subjectItem.answerText = answer.text;
                }
                self.questions.push(subjectItem);
              }
            })
						console.log('self.questions',self.questions)
          }else{
            self.$Message.error(res.message);
          }
        });
      },
      onRaterChange(eleItem, item, index) {
        if(this.visitState == 2){
          return;
        }
        this.$set(item, 'rate', eleItem.score);
        this.$set(item, 'satisfied', eleItem.title);
        if(item.overallScoreFlag == '1'){
          this.successSaveData.satisfied = item.rate;
        }
        var correlationSubjectsId = '';
        correlationSubjectsId = eleItem.correlationSubjectsId;
        if (correlationSubjectsId) {
          if (item.correlationSubjectsIds == correlationSubjectsId) {
            return;
          }
          if (item.correlationSubjectsIds) {
            this.questions.splice(index + 1, item.correlationSubjectsIds.split(',').length);
          }
          item.correlationSubjectsIds = correlationSubjectsId;
          var items = this.findCorrelationSubjects(item.correlationSubjectsIds.split(','));
          this.questions.splice(index + 1, 0, ...items);
        } else {
          if (item.correlationSubjectsIds) {
            this.questions.splice(index + 1, item.correlationSubjectsIds.split(',').length);
            item.correlationSubjectsIds = '';
          }
        }
      },
      handleChangeRate(){
        this.isSatisfied = true
      },
      changeFinishState(state){
        if(!this.respAuth){
          return;
        }
        this.isSolve = state;
      },
      getTaskDetail(){
        var self = this;
				let params = {
					data:{
						orderId:this.orderId
					},
          responseToast:false
				}
        feedBackOrderDetailToJson(params).then(res => {
          if(res.status == 1 || res.status == 0){
            self.taskState = res.data.stateId;
            if(self.taskState == 6){
              self.scrollHeight = "100%";
            }
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .ques-page-wrap{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #F5F5F5;
    .ques-main-wrap{
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      padding: 0 30rpx;
    }
    .main-card-wrap{
      background: #FFFFFF;
      border-radius: 20rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
      &:first-child{
        margin-top: 20rpx;
      }
      .card-title-wrap{
        display: flex;
        align-items: center;
        padding-bottom: 12rpx;
        .status-wrap{
          border-radius: 46rpx;
          border: 2rpx solid #57AEAE;
          padding: 4rpx 10rpx;
          font-size: 26rpx;
          color: #57AEAE;
          line-height: 36rpx;
          margin-right: 14rpx;
        }
        .title-wrap{
          font-weight: bold;
          font-size: 32rpx;
          color: #333333;
          line-height: 44rpx;
        }
      }
      .card-quesDesc-wrap{
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;
        text-align: left;
         display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
    .topic-wrap{
      padding-bottom: 40rpx;
      &:last-child{
        padding-bottom: 0;
      }
      .topic-required{
        font-size: 32rpx;
        color: #FF0000;
        padding-right: 4rpx;
      }
      .topic-title{
        font-weight: bold;
        font-size: 32rpx;
        color: #333333;
        line-height: 44rpx;
        padding-bottom: 20rpx;
      }
      .all-rate-wrap{
        display: flex;
        flex-direction: row;
        .all-rate-item{
          flex: 1;
          border-radius: 20rpx;
          background: #F6F6F6;
          border: 2rpx solid #CCCCCC;
          padding: 0 0 10rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          .rate-item-text{
            font-weight: 400;
            font-size: 30rpx;
            padding-top: 8rpx;
            padding-left: 8rpx;
          }
          &:first-child{
            margin-right: 26rpx;
          }
        }
        .rate-item-active{
          background: #F0F8F8;
          border: 2rpx solid var(--app-primary-color);
        }
      }
      .rates-wrap{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
      }
    }
    .ques-btn-wrap{
      padding: 36rpx 44rpx;
      .ques-btn{
        padding: 22rpx 0;
        background: var(--app-primary-color);
        border-radius: 16rpx;
        font-size: 28rpx;
        color: #FFFFFF;
        text-align: center;
      }
    }
  }
</style>