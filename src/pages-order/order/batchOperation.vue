<template>
	<!-- 各类操作页面 -->
	<view class="max-box" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
		<view class="main-li" v-if="isProcess">
			<e-input v-if="jdczlxFlag=='1'" :columns="otherValues['processList']" type="radio" v-model="otherDetail.processBranch" name="分支结果" :required="true" isLink />
			<e-input v-if="jdczlxFlag=='2'" v-model="processNum" name="分支结果" :required="true" type="InputNumber" placeholder="请填写" />
		</view>
		<view class="all-form-box">
			<textarea v-model="formItem.taskDesc" placeholder="详情描述" class="textarea-box" rows="5" maxlength="-1" />
			<e-input :bLine="false" :isShowImg="true" :projectName="basicInfo.projectName" :required="required['taskAttachment']" v-model="formItem.taskAttachment" type="upload" placeholder="请填写" />
		</view>

		<view class="form-cont" style="background:#fff;">
			<e-input v-if="isAuth('areaName') || isAuth('projectName')" :value="info.areaName && info.projectName ? info.areaName + '-' + info.projectName : ''" @on-click="selectArea" :name="fieldNames['areaName'] + fieldNames['projectName']" :required="required['projectName']" isLink />
			<e-input v-if="isAuth('orignSource')" v-model="formItem.orignSource" :name="fieldNames['orignSource']" :required="required['orignSource']" isLink />
			<e-input v-if="isAuth('ownerName')" v-model="formItem.ownerName" :name="fieldNames['ownerName']" :required="required['ownerName']" isLink @on-click="selectOwner" />
			<e-input v-if="isAuth('contactName')" v-model="formItem.contactName" :name="fieldNames['contactName']" :required="required['contactName']" type="input" placeholder="请填写" />
			<e-input v-if="isAuth('contactPhone')" v-model="formItem.contactPhone" :name="fieldNames['contactPhone']" :required="required['contactPhone']" type="input" placeholder="请填写" />
			<e-input v-if="isAuth('location')" v-model="formItem.location" :name="fieldNames['location']" :required="required['location']" type="input" placeholder="请填写" />
      <e-input v-if="isAuth('taskSource')" :columns="fieldValues['taskSource']" :required="required['taskSource']" v-model="formItem.taskSource" type="radio" :name="fieldNames['taskSource']" isLink />
      <e-input v-if="isAuth('emergencyLevel')" :columns="fieldValues['emergencyLevel']" :required="required['emergencyLevel']" v-model="formItem.emergencyLevel" type="radio" :name="fieldNames['emergencyLevel']" isLink />
			<e-input v-if="isAuth('appointmentDate')" v-model="formItem.appointmentDate" :name="fieldNames['appointmentDate']" :required="required['appointmentDate']" type="DatePicker" placeholder="请选择" mode="datetime" />			
			<e-input v-if="isAuth('orignUserName')" v-model="formItem.orignUserName" @on-click="userShow=true" :name="fieldNames['orignUserName']" :required="required['orignUserName']" isLink />
			<e-input v-if="isAuth('followUserName')" v-model="formItem.followUserName" @on-click="followUpUserList.length>0?userShow=true:toChosePeople()" :name="fieldNames['followUserName']" :required="required['followUserName']" isLink />
      <e-input v-if="isAuth('cancelReason')" :columns="fieldValues['cancelReason']" :required="required['cancelReason']" v-model="formItem.cancelReason" type="radio" :name="fieldNames['cancelReason']" isLink />
			<e-input v-if="isAuth('pauseDeadline')" :minValue="taskProcessingTime.submitDate" v-model="formItem.pauseDeadline" :name="fieldNames['pauseDeadline']" :required="required['pauseDeadline']" type="DatePicker" placeholder="请选择" mode="datetime" />
      <e-input v-if="isAuth('isPublic')" :columns="fieldValues['isPublic']" :required="required['isPublic']" v-model="formItem.isPublic" type="radio" :name="fieldNames['isPublic']" isLink />
      <e-input v-if="isAuth('isPaid')" :columns="fieldValues['isPaid']" :required="required['isPaid']" v-model="formItem.isPaid" type="radio" :name="fieldNames['isPaid']" isLink />
			<e-input v-if="isAuth('payType')" v-model="formItem.payType" :name="fieldNames['payType']" :required="required['payType']" isLink />
			<e-input v-if="isAuth('taskSubTypeId')" v-model="formItem.taskSubTypeId" :name="fieldNames['taskSubTypeId']" :required="required['taskSubTypeId']" isLink />
			<e-input v-if="isAuth('ownerCardType')" :columns="fieldValues['ownerCardType']"  v-model="formItem.ownerCardType" :name="fieldNames['ownerCardType']" :required="required['ownerCardType']" isLink type="radio" />
			<e-input v-if="isAuth('ownerCardNum')" v-model="formItem.ownerCardNum" :name="fieldNames['ownerCardNum']" :required="required['ownerCardNum']" type="input" placeholder="请填写" />
			<e-input v-if="isAuth('orignUserId')" v-model="formItem.orignUserId" :name="fieldNames['orignUserId']" :required="required['orignUserId']" isLink />
			<e-input v-if="isAuth('actualPrice')" v-model="formItem.actualPrice" :name="fieldNames['actualPrice']" :required="required['actualPrice']" type="input" placeholder="请填写" />
			<e-input v-if="isAuth('pauseReason')" v-model="formItem.pauseReason" :name="fieldNames['pauseReason']" :columns="fieldValues['pauseReason']" type="radio" :required="required['pauseReason']" isLink />
			<e-input v-if="isAuth('ownerSign')" v-model="formItem.ownerSign" :name="fieldNames['ownerSign']" :required="required['ownerSign']" placeholder="请填写" />
			
			<e-input v-if="isAuth('jiashiRealityTime')" type="input" v-model="formItem.jiashiRealityTime" :name="fieldNames['jiashiRealityTime']" :required="required['jiashiRealityTime']" placeholder="请填写" />
			<e-input v-if="isAuth('jiashiOriginalTime')" type="input" v-model="formItem.jiashiOriginalTime" :name="fieldNames['jiashiOriginalTime']" :required="required['jiashiOriginalTime']" placeholder="请填写" />
			<e-input v-if="isAuth('jiashiMoney')" type="input" v-model="formItem.jiashiMoney" :name="fieldNames['jiashiMoney']" :required="required['jiashiMoney']" placeholder="请填写" />
			<e-input v-if="isAuth('jiashiDate')" v-model="formItem.jiashiDate" :name="fieldNames['jiashiDate']" :required="required['jiashiDate']" type="DatePicker" placeholder="请选择" mode="date" />			
			<!-- <e-input v-if="isAuth('ownerSign')" v-model="formItem.ownerSign" :name="fieldNames['ownerSign']" :required="required['ownerSign']" placeholder="请填写" /> -->

			<helpr-list v-if="isAuth('helper')" ref="helperList" :required="required['helper']" :basicInfo="basicInfo" :quesTaskId="quesTaskId"></helpr-list>
			<!--<e-input :required="required['taskDesc']" v-model="formItem.taskDesc" type="textarea" name="操作描述" placeholder="请填写" />
			<e-input :required="required['taskAttachment']" v-model="formItem.taskAttachment" type="upload" name="操作附件" placeholder="请填写" />
			 <e-input v-if="isAuth('isNeedMaterial')" :columns="fieldValues['isNeedMaterial']" :required="required['isNeedMaterial']" v-model="formItem.isNeedMaterial" type="radio" :name="fieldNames['isNeedMaterial']" isLink /> -->
							
		</view>
		<!-- <view class="other-wrap">
			<e-input v-for="(item, index) in customFormFieldJson" isCustom :columns="item.options" :key="index"
				:required="item.required" v-model="formItem.customFields[item.key]" :type="item.type" :name="item.name"
				:placeholder="item.placeholder" :isLink="item.isLink" :projectName="basicInfo.projectName" />
		</view> -->
		<view class="other-wrap" style="background-color: #FFFFFF;">
		 <u-collapse accordion v-if="customFormFieldJson.length" :value="activeNames">
			 <view v-for="(item, index) in customFormFieldJson" :key="index">
				<u-collapse-item :title="item.groupName" :name="index" v-if="item.hasAuth && item.rule && item.rule.length">
					<e-input v-for="(item1, index1) in item.rule" isCustom :columns="item1.options" :key="index1"
						:required="item1.required" v-model="formItem.customFields[item1.key]" :type="item1.type" :name="item1.title"
						:placeholder="item1.placeholder" :isLink="item1.isLink" :projectName="basicInfo.projectName" :mode="item1.modeType"/>	
				</u-collapse-item>				 
			 </view>
		</u-collapse>
		</view>

		<view class="flex-around" style="margin-top: 10px;">
			<u-button type="primary" :customStyle="{ width: '80%', 'flex-shrink': 0 }" @click="handleSubmit">提交
			</u-button>
		</view>

		<!-- 经办人 -->
		<u-action-sheet @close="userShow=false" :actions="followUpUserList" :show="userShow" @select="selectUser">
		</u-action-sheet>
	</view>
</template>

<script>
	import eInput from '../components/eInput/index.vue';
	import eUpload from '../components/eUpload/index';
	import helprList from "./component/helprList"
	import {
		saveAndUpdateQuestionTask
	} from '@/service/wuyecrm.js'
	import {
		getQuestionTaskDetailByQuesTaskId,
		getServerSettingFiledInfoByOperate,
		getServerSettingBtnByTaskNodeKey,
		getQuesRecordList,
		getOrignUserList
	} from '@/service/crm6.0';
	export default {
		components: {
			eInput,
			'e-upload': eUpload,
			helprList
		},
		data() {
			return {
				quesTaskId:"",
				basicInfo:{},
				btnInfo: {},
				fApi: {},
				rule: [],
				uploadImgList: [],
				uploadImguuIdList: [], //上传图片uuid列表
				formData: {},
				reasonShow: false,
				userShow: false,
				stopShow: false,
				timeShow: false,
				startDateObj: {
					isShow: false,
					minDate: new Date().getTime(),
					value: ''
				},
				required: {},
				commonFields: [],
				baseCommonFieldsData: [],
				followUpUserList: [],
				fieldValues: {},
				fieldNames: {},
				formItem: {
					areaId: '',
					customFields: {},
				},
				taskProcessingTime:{},
				customFormFieldJson: [],
				isLinkList: ['radio', 'checkbox', 'DatePicker'],
				selectedOwner: {},
				selectedPeople:{},
				userInfo: {},
				otherValues:[],
				otherDetail:{},
				isProcess:false,
				processList:[],
				jdczlxFlag:'',
				processNum:'',
				activeNames: 0,
				query: {},
				fromPage: '',
				createdData: ''
			}
		},
		onLoad(option) {
			const { O_USER_INFO } = this.$constant;
      this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
			this.quesTaskId = option.quesTaskId
			this.fromPage = option.fromPage || ''
			this.createdData = option.createdData || ''
			if(uni.getStorageSync('btnInfo')){
				this.btnInfo = JSON.parse(uni.getStorageSync('btnInfo'))
			}
			this.getDetail();
			uni.setNavigationBarTitle({
				title: this.btnInfo.btnName
			})
			//是否是处理流程分支
			if(option.isProcess){
				this.jdczlxFlag=option.jdczlxFlag;
				let processList = uni.getStorageSync('processList') || '[]'
				let newProcess=JSON.parse(processList);
				this.processList=JSON.parse(processList);
				newProcess.forEach(item=>{
					item.fieldLabel=item.btnName;
					item.fieldVal=item.btnCode;

				})
				this.otherValues['processList']=newProcess;
			}
		},
		onReady() {},
		onHide() {},
		onNavigationBarButtonTap(e) {
		   this.handleSubmit();
		},
		methods: {
		getDetail() {
			let params = {
				data: {
					quesTaskId: this.quesTaskId,
					userId: this.userInfo.userId,
				}
			}
			getQuestionTaskDetailByQuesTaskId(params).then(res => {
				if (res.status == 200) {
					this.basicInfo = res.data.basicInfo;
					let customInfo= res.data.customInfo ? JSON.parse(res.data.customInfo) : {};
					Object.keys(customInfo).forEach(key => {
						const value = customInfo[key]
						if (Array.isArray(value)) {
 							customInfo[key] = value
						} else if (value === undefined || value === null) {
							customInfo[key] = ''
						}
					})

					this.formItem={
					  	...res.data.basicInfo,
					  	customFields:customInfo,
					  };
					this.formItem.followUserName = ''
					this.formItem.followUserId = ''
					this.taskProcessingTime=res.data.taskProcessingTime;
					this.getBtnInfo();
				} else {
					uni.showToast({ title: res.message, icon: 'none' })
				}
			})
		},
			selectOwner() {
			  if (!this.basicInfo.projectId) {
			    uni.showToast({ title: '请选择区域项目', icon: 'none' })
			    return
			  }
			  let params = {
			    areaId: this.basicInfo.areaId,
			    projectId: this.basicInfo.projectId
			  }
			  // this.setRepairsInfo(this.formItem)
			  uni.navigateTo({
			    url: this.$utils.spliceGetUrl('/pages-order/select/selectOwner', params),
					events: {
					  dataEvent: (data) => {
					    this.selectedOwner = data.data
					    this.formItem = {
					      ...this.formItem,
					      ...this.selectedOwner
					    }
					  }
					}
			  })
			},
			isAuth(code) {
				let Idx = this.commonFields.findIndex((ele) => ele.fieldCode === code)
				return Idx > -1
			},
			toChosePeople() {
				let params = {
					areaId: this.formItem.areaId,
					projectId: this.formItem.projectId
				}
				uni.navigateTo({
					url: this.$utils.spliceGetUrl('/pages-order/order/choosePeople', params),
					events: {
						dataEvent: (data) => {
							this.selectedPeople=data.data;
							this.formItem = {
								...this.formItem,
								...this.selectedPeople
							}
						}
					}
				})
			},
			toSign(){
				uni.navigateTo({
					url: '/pages-order/order/signName'
				})
			},
			handleSubmit() { //提交
				let isValidate = false
				let msg = '';
				let self=this;
				if(self.isProcess){//如果是处理分支流程 保存使用另一种方法
					self.saveProcess();
					return false;
				}
				this.commonFields.forEach((ele) => {
				  if (!isValidate && this.required[ele.fieldCode] && !this.formItem[ele.fieldCode] && ele.fieldCode !== 'helper') {
				    msg = '请补充' + ele.fieldName
				    isValidate = true
				  }
				})
				this.customFormFieldJson.forEach((item) => {
					if (!item.hasAuth) return
					item.rule.forEach((ele) => {
						if (!isValidate && ele.required && !this.formItem.customFields[ele.key]) {
						  msg = ele.placeholder ? ele.placeholder : '请补充' + ele.name
						  isValidate = true
						}
					})
				  
				})
				if (isValidate) {
				  uni.showToast({ title: msg, icon: 'none' })
				  return
				}
				const { btnCode } = this.query
				let submitData = JSON.parse(JSON.stringify(this.formItem));
				const lastNode = ['退场结项', '出具报告'].includes(btnCode) //最后节点不传跟进人
				if (lastNode) {
					submitData.followUserId = ''
					submitData.followUserName = ''
				}
				submitData.quesTaskId = this.quesTaskId
				submitData.operationCode = this.btnInfo.btnCode;
				submitData.operationName = this.btnInfo.btnName;
				submitData.taskNodeKey = this.basicInfo.nodeCode;
				submitData.conditionExpression = this.btnInfo.conditionExpression;
				submitData.jobInfo=this.userInfo.jobInfo || '';

				if(this.isAuth('helper') && !this.$refs.helperList.isValidate() ){
					return
				}
				if(this.isAuth('helper') && this.$refs.helperList.isValidate()){
					let helperData = this.$refs.helperList.getData()
					submitData.actualityManHour = helperData.actualityManHour;
					submitData.helpers = helperData.helpers;
				}

				let params = {
					data: {
						...submitData,
						customFields: JSON.stringify(this.formItem.customFields),
					}
				}
				if(params.data.customFields=='{}'){
					delete params.data.customFields;
				}
				if(this.btnInfo.yzqzFlag=='1'){
					uni.setStorageSync('saveParams', JSON.stringify(params));
					uni.navigateTo({
						url: '/pages-order/order/signName'
					})
				}else{
					uni.showLoading({
						mask:true 
					}); 				
					saveAndUpdateQuestionTask(params).then(result => {
					uni.hideLoading();
						if (result.status == '200') {		
							if(this.fromPage == 'todoTask'){
								uni.navigateBack({
									delta: 2
								});
								uni.$emit('nextTask', {
									createdData: this.createdData
								});
								return
							}
								uni.showToast({
									title: result.message,
									duration: 1000,
									icon:'success',
								});
								setTimeout(function () {
									 uni.navigateBack();
								}, 1000);
							
						} else {
						 uni.showToast({ title: result.message, icon: 'none' })
						}
					})
				}
			},
			saveProcess(){
				let params={};
				let self=this;
				if(this.jdczlxFlag=='1'){
				  this.processList.forEach(item=>{
				    if(item.btnCode==this.otherDetail.processBranch){
				      params.conditionExpression=item.conditionExpression;
				      params.operationCode=item.btnCode;
				      params.operationName=item.btnName;
				    }
				  })
				}else if(this.jdczlxFlag=='2'){
				  //当流程为输入型时  需要判断输入的值 在哪个区间内
				  this.processList.forEach(item=>{
				    if(item.btnName.indexOf('~') !== -1){
				     let btnArr=item.btnName.split('~');
				     if(parseFloat(this.processNum)>=parseFloat(btnArr[0])&&this.processNum<=parseFloat(btnArr[1])){
				       params.processBranch=item.btnCode;
				       params.conditionExpression=item.conditionExpression;
				       params.operationCode=item.btnCode;
				       params.operationName=item.btnName;
				       return false;
				     }
				    }else if(item.btnName.indexOf('>') !== -1){
				      let btnArr=item.btnName.split('>');
				      if(parseFloat(this.processNum)>parseFloat(btnArr[1])){
				        params.processBranch=item.btnCode;
				        params.conditionExpression=item.conditionExpression;
				        params.operationCode=item.btnCode;
				        params.operationName=item.btnName;
				        return false;
				      }
				    }
				  })
				}
				if(!params.conditionExpression){
					uni.showToast({ title: '请补充分支结果', icon: 'none' })
					return
				}
				params.quesTaskId=this.quesTaskId,
				params.jdczlxFlag=this.jdczlxFlag;
				params.jobInfo= this.userInfo.jobInfo || '';
				let params1 = {
					data: {
						...params,
					}
				}								 
				uni.showLoading({
					mask:true 
				});
				saveAndUpdateQuestionTask(params1).then(result => {
					uni.hideLoading();
				  if (result.status == '200') {
							if(this.fromPage == 'todoTask'){
								uni.navigateBack({
									delta: 2
								});
								uni.$emit('nextTask', {
									createdData: this.createdData
								});
								return
							}
				  		uni.showToast({
				  			title: result.message,
				  			duration: 1000,
				  			icon:'success',
				  		});
				  		setTimeout(function () {
				  			 self.$router.go(-1)
				  		}, 1000);
				  	
				  } else {
				   uni.showToast({ title: result.message, icon: 'none' })
				  }
				})
			},
			selectUser(value) { //选择经办人
				// this.formItem.orignUserId = value.userId;
				// this.formItem.orignUserName = value.userName;
				// this.formItem.orignUserAccount = value.userAccount;
				this.formItem.followUserId = value.userId;
				this.formItem.followUserAccount = value.userAccount;
				this.formItem.followUserName = value.userName;
			},
			getBtnInfo() {
				if (this.btnInfo && this.btnInfo.btnCode) {
						this.formItem.areaId = +this.basicInfo.areaId;
						this.formItem.projectId = this.basicInfo.projectId;
					let params = {
						data: {
							operateType: this.btnInfo.btnCode,
							taskNodeKey: this.basicInfo.nodeCode,
							taskSubTypeId: this.basicInfo.taskSubTypeId,
							serverSettingId: this.basicInfo.serverSettingId,
							areaId: this.basicInfo.areaId,
							projectId: this.basicInfo.projectId,
							userId: this.userInfo.userId,
							companyId: this.userInfo.companyId,
						}

					}
					getServerSettingFiledInfoByOperate(params).then(res => {
						if (res.status == 200) {
							this.commonFields = res.data.commFormFieldJson;
							this.commonFields.forEach((ele) => {
								this.required[ele.fieldCode] = ele.required || false
								this.fieldValues[ele.fieldCode] = ele.fieldValueList || []
								this.fieldNames[ele.fieldCode] = ele.fieldName || ''
							})
							// let hasOrignUser = this.commonFields.find(item => item.fieldCode == 'orignUserName');
							 let hasFollowUser = this.commonFields.find(item => item.fieldCode == 'followUserName');
							 if(hasFollowUser && (this.btnInfo.nextNodeAssigneeType && this.btnInfo.nextNodeAssigneeType < 4)){
								let params = {
									data: {
										quesTaskId: this.quesTaskId,
										btnCode: this.btnInfo.btnCode,
									}
								}
								// getOrignUserList(params).then(res => {
								// 	if (res.status == 200 && res.data.length > 0) {
								// 		res.data.forEach(item => {
								// 			item.name = item.userName;
								// 		})
								// 		this.followUpUserList = res.data;
								// 	} else {
								// 		this.followUpUserList = [];
								// 	}
								// })
							}

							/** @type {GroupRule[]} */
              let groupRule = []
              try {
                groupRule = JSON.parse(res.data.customFormFieldJson || '[]')
              } catch (error) {
                groupRule = []
              }
							const userJob = this.userInfo.jobInfo || ''
              this.customFormFieldJson = groupRule.map(group => {
                /** @type {PostUser[]} */
                const postUser = group.postUser || []

                if (postUser.length == 0) {
                  // 该分组没有绑定岗位权限，任何人都可以操作
                  group.hasAuth = true
                } else {
									// 当前用户与该分组的岗位相等，有权限操作该分组
									const hasItem = postUser.some(item => userJob.indexOf(item.jobName) > 0)
									group.hasAuth = !!hasItem
								}
								const rule = group.rule || []
								group.rule = rule.map(item => {
									return {
										...item,
										key: item.field,
										name: item.title,
										required: item.validate[0].required,
										isLink: this.isLinkList.includes(item.type),
										placeholder:item.validate[0].message || '',
										modeType: item.props.type || item.validate[0].type ||'',
										options: (item.options || []).map(opt => {
											return {
												fieldLabel: opt.label,
												fieldVal: opt.value
											}
										})
									}
								})
								group.rule.sort((a, b) => a.title.localeCompare(b.title))
                return group
              })

							// if (res.data.customFormFieldJson) {
							// 	let list = JSON.parse(res.data.customFormFieldJson);
							// 	list.forEach(item1=>{
							// 		item1.rule.forEach(ele=>{
							// 			let item = {}
							// 			ele.key=ele.field;
							// 			ele.name=ele.title;
							// 			ele.required=ele.validate[0].required;
							// 			ele.isLink= this.isLinkList.includes(ele.type);
							// 			ele.placeholder=ele.validate[0].message || '';
							// 			if (ele.options && ele.options.length) {
							// 				item.options = ele.options.map((option) => {
							// 					option.fieldLabel = option.label
							// 					option.fieldVal = option.label
							// 					return option
							// 				})
							// 			}	
							// 		})
							// 	})
							// 	this.customFormFieldJson=JSON.parse(JSON.stringify(list));
							// } else {
							// 	this.customFormFieldJson = [];
							// }

						}
			 	})
				}
			},
			DateConfirm(type, data) {
				if (type == 'start') {
					this.formItem.pauseDeadline = uni.$u.timeFormat(data.value, 'yyyy-mm-dd hh:MM');
					this.timeShow = false;
				}
			},
			fileChange(list) {
				if (this.isCustom) {
					let fileIds = list.map((ele) => ele.url)
					// this.$emit('input', fileIds.join(','))
				} else {
					let fileIds = list.map((ele) => ele.fileId)
			  // this.$emit('input', fileIds.join(','))
			 }
			},		
		}
	}
</script>

<style lang="scss" scoped>
	.max-box{
		width: 100%;
		height: 100%;
		background: #f3f3f3;		
	}
	.all-form-box {
		width: 100%;
		min-height: 300rpx;
		padding: 30rpx 20rpx;
		padding-top: 18rpx;
		box-sizing: border-box;
		border-bottom: 2rpx solid #eeeeee;
		background: #FFFFFF;
		margin-bottom: 24rpx;
		.textarea-box{
			width: 100%;
		}

		.form-box {
			width: 100%;
			height: 140rpx;
			// margin-bottom: 32rpx;
			@include flx-dsp($jsc: flex-start, $ali: center);

			.form-box-img-box {
				margin-right: 20rpx;

				.form-box-img {
					width: 88rpx;
					height: 80rpx;
				}
			}

			.upload-img-list {
				width: 590rpx;

				.upload-list {
					width: 800rpx;
					height: 140rpx;
					@include flx-dsp($jsc: flex-start, $ali: center);

					.upload-box {
						width: 130rpx;
						height: 120rpx;
						position: relative;
						display: inline-block;
						overflow: unset;

						.upload-img {
							width: 90%;
							height: 110rpx;
							padding: 0 5%;
						}

						.del-img {
							position: absolute;
							right: 0;
							top: -10rpx;
							background: #ffffff;
							border-radius: 100%;
						}
					}
				}
			}

			text {
				color: #c4c4c4;
				text-align: left;
				font-size: 28rpx;
			}
		}
	}

</style>
<style scoped>	
	.max-box /deep/ .u-action-sheet{
		height: 400px !important;
		overflow-y: scroll !important;
	}
	.other-wrap /deep/ .u-collapse-item__content__text{
		padding: 0;
	}
</style>
