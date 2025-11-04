
<style lang="scss" scoped>
  .button-fixed-bottom {
    position: fixed;
    width: 80%;
    margin: 0 10%;
    bottom: 16rpx;
		/* #ifdef MP-WEIXIN */
		bottom: 38rpx;
		/* #endif */
    text-align: center;
    @include flx-dsp($jsc: center, $ali: center);

    & > button {
        // min-width: 250rpx;
				font-size: 28rpx;
				height: 70rpx;
        padding: 15rpx 80rpx;
				background: #E6B932 ;
        // border-radius: 48rpx;
				@include flx-dsp($jsc: center, $ali: center);
      }
  }

  .ques-top {
    padding: 60rpx 40rpx 40rpx;
  }

  .ques-top-content1 {
    color: #000000;
    font-size: 30rpx;
    margin-bottom: 24rpx;
  }

  .ques-top-content2 {
    color: #000000;
    font-size: 26rpx;
    margin-bottom: 10rpx;
  }

  .ques-gap {
    background-color: #F2F2F2;
    height: 10rpx;
  }

  .ques-content {
     padding: 60rpx 40rpx 100rpx 40rpx;
   }
  .ques-content-visited {
    padding: 60rpx 40rpx 10rpx 40rpx;
  }

  .left-title {
    color: #333333;
    font-size: 24rpx;
    width: 240rpx;
    margin-right: 20rpx;
  }

  .right-result {
    color: rgba(0, 0, 0, 0.4);
    font-size: 20rpx;
    margin-left: 20rpx;
  }

  .ques-rater {
    display: flex;
    flex-direction: column;
    margin-bottom: 30rpx;
  }

  .ques-select {
    display: flex;
    flex-direction: column;
    margin-bottom: 30rpx;
    justify-content: space-between;
  }

  .ques-select ::v-deep label {
    color: #333333;
    font-size: 24rpx;
    font-weight: 400;
  }

  .ques-checklist {
    margin-bottom: 30rpx;
  }

  .ques-checklist .title {
    color: #333333;
    font-size: 24rpx;
    display: flex;
    margin-bottom: 10rpx;
  }

  .ques-checklist ::v-deep .weui-cells:before {
    border-top: 1px solid #fff;
  }

  .ques-checklist ::v-deep .weui-cells:after {
    border-bottom: 1px solid #fff;
  }

  .ques-checklist ::v-deep .weui-cell:before {
    border-top: 1px solid #fff;
  }

  .ques-checklist ::v-deep .weui-cells label {
    flex-direction: row-reverse;
  }

  .ques-checklist ::v-deep .weui-cells label p {
    color: #333333;
    font-size: 24rpx;
  }

  .ques-checklist .content {
    border: 1px solid #E8E8E9;
    padding: 20rpx;
  }

  .vux-check-icon {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    margin: 16rpx 0;
  }

  .ques-checklist ::v-deep .ivu-tree ul li {
    line-height: 0;
  }

  .ques-checklist ::v-deep .ivu-tree-arrow {
    display: none;
  }

  .ques-checklist ::v-deep .ivu-checkbox-group {
    display: flex;
    flex-direction: column;
  }

  .ques-checklist ::v-deep .ivu-checkbox-wrapper {
    height: 60rpx;
    line-height: 60rpx;
  }

  .ques-input {
    margin-bottom: 30rpx;
  }

  .ques-input .title {
    // color: #333333;
    font-size: 24rpx;
    display: flex;
    margin-bottom: 10rpx;
  }

  .ques-input ::v-deep .vux-x-textarea {
    border: 1px solid #E8E8E9;
    margin-top: 10rpx;
  }

  .ques-input ::v-deep .weui-cell:before {
    border-top: none;
  }

  .ques-select .title {
    // color: #333333;
    font-size: 24rpx;
    margin-right: 20rpx;
  }

  .ques-select ::v-deep .ivu-radio-checked:hover .ivu-radio-inner {
    border-color: #E6B932;
  }

  .ques-select ::v-deep .ivu-radio-inner:after {
    background-color: #E6B932;
  }

  .ques-select ::v-deep .ivu-radio-checked .ivu-radio-inner {
    border-color: #E6B932;
  }

  .ques-checklist ::v-deep .ivu-radio-wrapper {
    color: #333333;
    font-weight: 400;
  }

  .ques-checklist ::v-deep .ivu-checkbox-checked:hover .ivu-checkbox-inner {
    border-color: #E6B932;
    background-color: #E6B932;
  }

  .ques-checklist ::v-deep .ivu-checkbox-checked .ivu-checkbox-inner {
    border-color: #E6B932;
    background-color: #E6B932;
  }

  .ques-checklist ::v-deep .ivu-checkbox-wrapper {
    color: #333333;
    font-weight: 400;
  }

  .finish-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 20rpx;
    margin-bottom: 28rpx;
  }

  .finish-container .item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 12rpx 30rpx;
    background: rgba(247, 247, 247, 1);
    border-radius: 30rpx;
    color: #333333;
  }

  .finish-container .item image {
    width: 30rpx;
    height: 30rpx;
    margin-right: 2px;
  }

  .finish-container .item view {
    font-size: 26rpx;
  }

  /*.bottom .item:last-child {*/
  /*margin-left: 60rpx;*/
  /*}*/

  .finish-container .active {
    background-color: #E6B932;
    color: #fff;
  }

	.zan-img{
		width: 40rpx !important;
		height:40rpx !important;
	}
	
	.h4view{
		font-size: 28rpx;
    &::before{
      content: '*';
      color: red;
      font-size: 28rpx;
    }
	}
	.titleSize{
		font-size: 28rpx !important;
		padding-bottom: 10rpx;
	}
  ::v-deep .u-radio{
    padding-bottom: 24rpx;
    font-size: 28rpx;
  }
  ::v-deep .u-radio:last-child{
    padding-bottom: 0;
  }
  .btn-box{
				width: 260rpx;
				height: 68rpx;
				line-height: 68rpx;
				background: var(--app-primary-color);
				border-radius: 46rpx;
				color: #fff;  
				padding: 0;
				font-size: 28rpx;
			}
      .actives{
				border: 1px solid var(--app-primary-color);
				// color: var(--app-primary-color);
				background-color:rgba(96, 212, 163, 0.10);
			}
      .error-message {
    position: absolute;
    right: 40rpx;
    //  bottom: 10px;
    border-radius: 50rpx;
    background-color: gray;
    text-align: center;
    color: #fff;
    min-width: 120rpx;
    height: 76rpx;
    line-height: 76rpx;
    font-weight: bold;
    font-size: 32rpx;
    padding: 0 24rpx;
}
</style>
<template><!--问卷列表-->
  <view class="grey-bg-body" style="background: #fff;">
    <scroll-view  scroll-y :height="scrollHeight">
        <view :class="visitState == 6 ? 'ques-content': 'ques-content-visited'">
      <view>
        <view class="h4view">请您确认问题是否已经处理完成</view>
        <view class="finish-container" >
          <view  class="item" :class="{active: isSolve == 1}" @click="changeFinishState(1)">
            <image v-if="isSolve == 2 || isSolve == '' " :src="solved" class="zan-img"></image>
            <image v-if="isSolve == 1" :src="solvedFocus" class="zan-img"></image>
            <view>已解决</view>
          </view>
          <view  style="margin-left: 20rpx" class="item" :class="{active: isSolve == 2}" @click="changeFinishState(2)">
            <image v-if="isSolve == 1 || isSolve == ''" :src="unsolved" class="zan-img"></image>
            <image v-if="isSolve == 2" :src="unsolvedFocus" class="zan-img"></image>
            <view>未解决</view>
          </view>
        </view>
      </view>
      <!-- 评分 -->
      <view style="margin-bottom: 28rpx;">
        <view class="h4view" style="padding-bottom: 10rpx;">请您对整体服务进行评价</view>
          <view style="display: flex;gap: 24rpx;">
            <u-rate :readonly="!showFinished" :count="5" v-model="satisfied" active-color="#F5CA23" :size="20"
              @change="handleChangeRate"></u-rate>
            <text>{{ satisfiesDesc[satisfied - 1] }}</text>
          </view>
        </view>
      <view v-for="(item, index) in questions" :key="index" class="rate-list-li">
        <view v-if="item.type == 3" class="ques-rater">
          <view class="left titleSize">{{(index + 1)}}. {{item.title}}</view>
          <view style="display: flex;gap: 24rpx;">
              <u-rate :readonly="visitState == 2" :count="5" v-model="item.rate" active-color="#F5CA23" :minCount="0"
              :size="20" @change="onRaterChange(item)"></u-rate>
              <text v-if="showFinished">{{ item.satisfied[item.rate -1 ]}}</text>
              <text v-else>{{ item.satisfied}}</text>
            </view>

          <!-- <rater :disabled="visitState == 2" v-model="item.rate" active-color="#F5CA23" :step="1" :min="0" :max="5"
                 @click.native="onRaterChange(item)"></rater> -->
        </view>
        <view v-if="item.type == 0" class="ques-select ques-input">
          <view class="title titleSize">{{(index + 1)}}. {{item.title}}</view>
          <view v-for="(elementItem, elementIndex) in item.elementList"  style="margin: 10rpx 0">
            <u-radio-group v-model="item.select" placement="column">
              <u-radio
               :key="elementIndex"
              :disabled="visitState == 2" 
              @change="onRadioChange(item,elementItem, index)"
              :label="elementItem.title"
						  :name="elementItem.title"
              ></u-radio>
            </u-radio-group>
            <u--textarea :disabled="visitState == 2" v-if="elementItem.remarkFlag && elementItem.select" placeholder="请输入描述" :rows="5"
                   v-model="elementItem.remark"></u--textarea>
          </view>
        </view>
        <view v-if="item.type == 1" class="ques-checklist ques-input">
          <view class="title titleSize">{{(index + 1)}}. {{item.title}}</view>
					<u-checkbox-group :disabled="visitState == 2" v-model="item.select" placement="column" >
						<view v-for="(elementItem, elementIndex) in item.elementList" :key="elementIndex">
						 <!-- <Checkbox :disabled="visitState == 2" v-model="elementItem.select" @click.native.stop="onCheckboxChange(item,elementItem, index)">
								{{elementItem.title}}
							</Checkbox> -->
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
          <view class="title titleSize">{{(index + 1)}}. {{item.title}}</view>
          <u--textarea :readonly="visitState == 2" placeholder="请输入描述" :rows="5" v-model="item.answerText" :maxlength="500" autosize></u--textarea>
        </view>
      </view>
    </view>
    </scroll-view>
    <view class="button-fixed-bottom" v-if="visitState == 6">
       <button plain  class="btn-box actives"  @click="successVisit" >提交</button>
    </view>
    <custom-modal ref="customModal"></custom-modal>
    <u-modal :show="isErrorMessage" title="提示" :width="260" @confirm="goback">
          <view class="slot-content">
              <text> {{ errorMessage }}</text>
          </view>
    </u-modal>
  </view>
</template>

<script>
	import {getReturnVisitRecordById,getQuestionnaireById,saveQuestionnaire,getAnswerValueById} from '@/service/returnVisit.js';
	import {feedBackOrderDetailToJson} from '@/service/landcrm.js';
	import {grantMemberGrowthIntegral} from '@/service/community.js';
	import util from '@/js/utils.js';
  export default {
    name: 'returnVisitQuestionnaireDetail',
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
        errorMessage:'',
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
        console.log(403,this.showFinished)
		},
    computed: {
      showFinished() { // 仅待回访和已生成状态可以操作
        if (this.visitState == '6' || this.visitState == '1') {
          return true
        } else {
          return false
        }
        // if(this.questions.length == 0 && this.visitState != '3'){
        //   return false;
        // }
        // if(this.visitState == '6' && this.taskState != 4){
        //   return true;
        // }else if(this.visitState== '2' && this.isSolve > 0){
        //   return true
        // }
        // return false;
      },
			solved(){
				return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/solved.png`
			},
			solvedFocus(){
				return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/solvedFocus.png`
			},
			unsolved(){
				return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/unsolved.png`
			},
			unsolvedFocus(){
				return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/unsolvedFocus.png`
			},
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
            self.visitState = res.data.visitState;
            self.questionnaireId = res.data.mpqId;
            if(self.visitState == 6 || self.visitState == 1){
              self.getQuestionData()
              self.orderId = res.data.taskId;
              self.getTaskDetail();
            }else if(self.visitState == 2){
              self.isSolve = res.data.isSolve;
              self.satisfied = Number(res.data.satisfied);
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
                      item.satisfied = item.elementList.map(e=>{return e.title})
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
        if (!this.isSatisfied) {
          uni.showToast({
            title: '请您对整体服务进行评价',
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
        self.successSaveData.satisfied = self.satisfied;
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
            const processingProgressPage = pages.find(item => item.route == 'pages-a/customOrder/processingProgress')  
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
      onRaterChange(item) {
        if(this.visitState == 2){
          return;
        }
        // this.$set(item, 'rate', index + 1);
        var index = item.rate -1;
        var correlationSubjectsId = '';
        correlationSubjectsId = item.elementList[index].correlationSubjectsId;
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
        if(!this.showFinished){
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