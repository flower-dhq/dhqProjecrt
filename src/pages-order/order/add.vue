<style lang="scss" scoped>
.order-add {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #f5f5f5;
  @include flx-dsp($jsc: center, $ali: center, $drt: column);
  .list-wrap {
    width: 100%;
    flex: 1;
    overflow: auto;
    .main-wrap {
      margin-bottom: 24rpx;
    }
  }
  .btn-wrap {
    width: 100%;
    .btn {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      background-color: var(--app-primary-color);
      color: #ffffff;
      font-size: 32rpx;
    }
  }
  ::v-deep .u-collapse-item__content__text {
    padding: 0 !important;
  }
  .relate-task-wrap{
    padding: 0 30rpx 8rpx;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    .task-wrap{
      padding: 12rpx 20rpx;
      background: #f6f6f6;
      border-radius: 8rpx;
      margin-bottom: 8rpx;
      display: flex;
      align-items: center;
      .task-code{
        font-size: 30rpx;
        color: #2761ff;
        padding: 0 16rpx;
        flex: 1;
      }
      .task-status{
        font-size: 30rpx;
        padding-right: 16rpx;
        color: #333333;
      }
    }
  }
}
</style>

<template>
  <view class="order-add" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="list-wrap">
      <view class="main-wrap">
        <e-input v-if="isAuth('areaName') || isAuth('projectName')" :value="info.areaName && info.projectName ? info.areaName + '-' + info.projectName : ''" @on-click="selectArea" :name="fieldNames['areaName'] + fieldNames['projectName']" :required="required['projectName']" isLink />
        <e-input v-if="isAuth('orignSource')" v-model="info.orignSource" type="Radio" :columns="fieldValues['orignSource']" :name="fieldNames['orignSource']" :required="required['orignSource']" @dataChange="orignSourceChanged" />
        <e-input v-if="isAuth('taskSubTypeName')" v-model="info.taskSubTypeName" @on-click="selectType" :name="fieldNames['taskSubTypeName']" :required="required['taskSubTypeName']" isLink />
        <e-input v-if="isAuth('ownerName')" v-model="info.ownerName" @on-click="selectOwner" :name="fieldNames['ownerName']" :required="required['ownerName']" isLink />
        <e-input v-if="isAuth('contactName')" :required="required['contactName']" v-model="info.contactName" type="input" :name="fieldNames['contactName']" placeholder="请填写" />
        <e-input v-if="isAuth('contactPhone')" :required="required['contactPhone']" v-model="info.contactPhone" type="input" :name="fieldNames['contactPhone']" placeholder="请填写" />
        <e-input v-if="isAuth('ownerCardType')" :columns="fieldValues['ownerCardType']" :required="required['ownerCardType']" v-model="info.ownerCardType" type="select" :name="fieldNames['ownerCardType']" isLink />
        <e-input v-if="isAuth('ownerCardNum')" :required="required['ownerCardNum']" v-model="info.ownerCardNum" type="input" :name="fieldNames['ownerCardNum']" placeholder="请填写" />
        <e-input v-if="isAuth('location')" :required="required['location']" v-model="info.location" type="input" :name="fieldNames['location']" placeholder="请填写" />
        <e-input v-if="isAuth('taskSource')" :columns="fieldValues['taskSource']" :required="required['taskSource']" v-model="info.taskSource" type="select" :name="fieldNames['taskSource']" isLink />
        <e-input v-if="isAuth('emergencyLevel')" :columns="fieldValues['emergencyLevel']" :required="required['emergencyLevel']" v-model="info.emergencyLevel" type="select" :name="fieldNames['emergencyLevel']" isLink />
        <e-input v-if="isAuth('relatetask')" :required="required['relatetask']" @on-click="selectTask" :name="fieldNames['relatetask']" isLink :bLine="false"/>
        <view v-if="isAuth('relatetask')" class="relate-task-wrap">
          <view class="task-wrap" v-for="(item, index) in relateTasks" :key="index">
            <uni-icons type="link" size="40rpx" color="#999999"></uni-icons>
            <view class="task-code" >{{ item.taskCode }}</view>
            <view class="task-status" >{{ item.taskStateName }}</view>
            <uni-icons type="closeempty" size="36rpx" color="#999999" @click="delTask(index)"></uni-icons>
          </view>
        </view>
        <e-input v-if="isAuth('appointmentDate')" :columns="fieldValues['appointmentDate']" :required="required['appointmentDate']" v-model="info.appointmentDate" type="DatePicker" mode="datetime" :name="fieldNames['appointmentDate']" isLink />
        <e-input v-if="isAuth('followUserName') && fieldValues['followUserName'] && fieldValues['followUserName'].length" :columns="fieldValues['followUserName']" :required="required['followUserName']" v-model="info.followUserName" type="select" :name="fieldNames['followUserName']" isLink />
        <e-input v-if="isAuth('followUserName') && (!fieldValues['followUserName'] || !fieldValues['followUserName'].length)" :required="required['followUserName']" v-model="info.followUserName" @on-click="selectStaff" :name="fieldNames['followUserName']" isLink />
        <e-input v-if="isAuth('isPublic')" :columns="fieldValues['isPublic']" :required="required['isPublic']" v-model="info.isPublic" type="select" :name="fieldNames['isPublic']" isLink />
        <e-input v-if="isAuth('isPaid')" :columns="fieldValues['isPaid']" :required="required['isPaid']" v-model="info.isPaid" type="select" :name="fieldNames['isPaid']" isLink />
        <e-input v-if="isAuth('cancelReason')" :columns="fieldValues['cancelReason']" :required="required['cancelReason']" v-model="info.cancelReason" type="select" :name="fieldNames['cancelReason']" isLink />
        <e-input v-if="isAuth('pauseDeadline')" :columns="fieldValues['pauseDeadline']" :required="required['pauseDeadline']" v-model="info.pauseDeadline" type="DatePicker" mode="datetime" :name="fieldNames['pauseDeadline']" isLink />
        <e-input v-if="isAuth('actualPrice')" :required="required['actualPrice']" v-model="info.actualPrice" type="input" :name="fieldNames['actualPrice']" placeholder="请填写" />
        <e-input v-if="isAuth('payType')" :columns="fieldValues['payType']" :required="required['payType']" v-model="info.payType" type="radio" :name="fieldNames['payType']" isLink />
        <e-input v-if="isAuth('associatedDevice')" @on-click="selectDevice" :required="required['associatedDevice']" v-model="info.associatedDevice" :name="fieldNames['associatedDevice']" isLink />
        <e-input v-if="isAuth('zhuangXiuDanHao')" @on-click="selectDecorate" :required="required['zhuangXiuDanHao']" v-model="info.zhuangXiuDanHao" :name="fieldNames['zhuangXiuDanHao']" isLink />
        <e-input v-if="isAuth('ownerSign')" :required="required['ownerSign']" v-model="info.ownerSign" type="input" :name="fieldNames['ownerSign']" placeholder="请填写" />
        <e-input v-if="isAuth('taskDesc')" :required="required['taskDesc']" v-model="info.taskDesc" type="textarea" :name="fieldNames['taskDesc']" placeholder="请填写" />
        <e-input v-if="isAuth('jiashiDate')" :required="required['jiashiDate']" v-model="info.jiashiDate" type="DatePicker" mode="date":name="fieldNames['jiashiDate']" placeholder="请选择" isLink />
        <e-input v-if="isAuth('jiashiMoney')" :required="required['jiashiMoney']" v-model="info.jiashiMoney" type="input" :name="fieldNames['jiashiMoney']" placeholder="请填写" />
        <e-input v-if="isAuth('jiashiOriginalTime')" :required="required['jiashiOriginalTime']" v-model="info.jiashiOriginalTime" type="input" :name="fieldNames['jiashiOriginalTime']" placeholder="请填写" />
        <e-input v-if="isAuth('jiashiRealityTime')" :required="required['jiashiRealityTime']" v-model="info.jiashiRealityTime" type="input" :name="fieldNames['jiashiRealityTime']" placeholder="请填写" />
        <e-input v-if="isAuth('taskAttachment')" :required="required['taskAttachment']" v-model="info.taskAttachment" type="upload" :name="fieldNames['taskAttachment']" placeholder="请填写" :projectName="info.projectName" />
      </view>
      <!-- <view class="other-wrap">
        <e-input
          v-for="(item, index) in customFormFieldJson"
          isCustom
          :columns="item.options"
          :key="index"
          :required="item.required"
          v-model="info.customFields[item.key]"
          :type="item.type"
          :name="item.name"
          :mode="item.modeType"
          :projectName="info.projectName"
          :placeholder="item.placeholder"
          :isLink="item.isLink"
        />
      </view> -->
      <view class="other-wrap" style="background-color: #FFFFFF;">
			 <u-collapse value="0" accordion>
          <view v-for="(item, index) in customFormFieldJson" :key="index">
            <u-collapse-item :title="item.groupName" :name="index" v-if="item.rule && item.rule.length">
              <e-input v-for="(item1, index1) in item.rule" isCustom :columns="item1.options" :key="index1"
                :required="item1.required" v-model="info.customFields[item1.key]" :type="item1.type" :name="item1.title"
                :placeholder="item1.placeholder" :isLink="item1.isLink" :projectName="info.projectName" :mode="item1.modeType" />	
            </u-collapse-item>				 
          </view>
        </u-collapse>
			</view>
    </view>
    <view class="btn-wrap">
      <view class="btn" @click="submitTask"> 提交 </view>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import Utils from '@/js/utils';
import { getFieldAndValList, getServerSettingFiledInfoByOperate, saveAndUpdateQuestionTask } from '@/service/wuyecrm.js';
import eInput from '../components/eInput/index.vue';
import uCollapse from 'uview-ui/components/u-collapse/u-collapse.vue';
export default {
  name: 'order-add',
  components: { eInput, uCollapse },
  computed: {},
  data() {
    return {
      commonFields: [],
      contactName: '',
      contactPhone: '',
      info: {
        customFields: {},
      },
      customFormFieldJson: [],
      required: {},
      fieldValues: {},
      fieldNames: {},
      isLinkList: ['radio', 'checkbox', 'DatePicker'],
      selectedProject: {},
      selectedOwner: {},
      selectedPeople: {},
      query: {},
      userInfo: {},
      relateTasks:[]
    };
  },
  onLoad(query) {
    console.log(query);
    let { O_USER_INFO } = this.$constant;
    this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
    this.query = query;
    if (this.query.areaId) {
      this.selectedProject = {
        areaId: this.query.areaId || '',
        areaName: this.query.areaName || '',
        projectId: this.query.projectId || '',
        projectName: this.query.projectName || '',
        projectProperty: this.query.projectProperty || '',
      };
    }
    this.getFieldList();
    this.info = {
      ...this.query,
      customFields: {},
    };
  },
  methods: {
    getFieldList() {
      const params = {
        data: {
          userId: this.userInfo.userId,
          userName: this.userInfo.userName,
          companyId: this.userInfo.companyId,
          commFieldShowScene: 1,
          fieldCategory: 1,
        },
      };
      getFieldAndValList(params).then((result) => {
        if (result.status == '200') {
          this.commonFields = result.data.list;
          this.commonFields.forEach((ele) => {
            this.required[ele.fieldCode] = true;
            this.fieldValues[ele.fieldCode] = ele.fieldValueList || [];
            this.fieldNames[ele.fieldCode] = ele.fieldName || '';
          });
          this.customFormFieldJson = [];
          this.getOtherFieldList();
        } else {
          this.tbData = [];
        }
      });
    },
    getOtherFieldList() {
      if (!this.info.areaId || !this.info.taskSubTypeId) {
        return false;
      }
      const params = {
        data: {
          operateType: 1,
          taskSubTypeId: this.info.taskSubTypeId,
          areaId: this.info.areaId,
          projectId: this.info.projectId,
          userId: this.userInfo.userId,
          companyId: this.userInfo.companyId,
        },
      };
      getServerSettingFiledInfoByOperate(params).then((res) => {
        if (res.status == '200') {
          this.commonFields = res.data.commFormFieldJson;
          this.commonFields.forEach((ele) => {
            this.required[ele.fieldCode] = ele.required || false;
            this.fieldValues[ele.fieldCode] = ele.fieldValueList || [];
            this.fieldNames[ele.fieldCode] = ele.fieldName || '';
          });
          if (res.data.customFormFieldJson) {
            let list = JSON.parse(res.data.customFormFieldJson);

            list.forEach(item1=>{
							item1.rule.forEach(ele=>{
								let item = {}
								ele.key=ele.field;
								ele.name=ele.title;
								ele.required=ele.validate[0].required;
								ele.isLink= this.isLinkList.includes(ele.type);
								ele.placeholder=ele.validate[0].message || '';
                ele.modeType = ele.props.type || ele.validate[0].type || ''
								if (ele.options && ele.options.length) {
									item.options = ele.options.map((option) => {
										option.fieldLabel = option.label
									option.fieldVal = option.label
										return option
									})
								}	
							})
						})
						this.customFormFieldJson=JSON.parse(JSON.stringify(list));
            console.log(this.customFormFieldJson, 'this.customFormFieldJson')
            // this.customFormFieldJson = list.map((ele) => {
            //   let item = {
            //     key: ele.field,
            //     name: ele.title,
            //     type: ele.type,
            //     required: ele.validate[0].required,
            //     isLink: this.isLinkList.includes(ele.type),
            //     placeholder: ele.props.placeholder || ele.validate[0].message || '',
            //     modeType: ele.props.type || ele.validate[0].type || '',
            //   };
            //   if (ele.options && ele.options.length) {
            //     item.options = ele.options.map((option) => {
            //       option.fieldLabel = option.label;
            //       option.fieldVal = option.label;
            //       return option;
            //     });
            //   }
            //   this.$set(this.info.customFields, item.key, '');
            //   // this.info.customFields[item.key] = ''
            //   return item;
            // });
          }
        } else {
          uni.showToast({ title: res.message, icon: 'none' });
        }
      });
    },
    getFollowerList() {
      let params = {
        btnCode: btnInfo.btnCode,
      };
      getOrignUserList(params).then((res) => {
        if (res.status == 200) {
          this.followUpUserList = res.data;
        } else {
          this.followUpUserList = [];
        }
      });
    },
    isAuth(code) {
      let Idx = this.commonFields.findIndex((ele) => ele.fieldCode === code);
      return Idx > -1;
    },
    selectArea() {
      uni.navigateTo({
        url: '/pages-order/select/selectProject',
        events: {
          dataEvent: (data) => {
            this.selectedProject = data.data;
            this.info = {
              ...this.selectedProject,
              orignSource: this.info.orignSource || '',
              location: this.query.location || '',
              taskDesc: this.query.taskDesc || '',
              sourceType: this.query.sourceType || '',
              customFields: {},
            };
            if (this.info.orignSource === 'internalTask') {
              this.info.contactName = this.userInfo.userName; //服务请求人
              this.info.contactPhone = this.userInfo.userPhone; //联系电话
            }
            this.getFieldList();
          },
        },
      });
    },
    selectType() {
      if (!this.info.projectId) {
        uni.showToast({ title: '请选择区域项目', icon: 'none' });
        return;
      }
      if (!this.info.orignSource) {
        uni.showToast({ title: '请选择工单性质', icon: 'none' });
        return;
      }
      let params = {
        areaId: this.info.areaId,
        projectId: this.info.projectId,
        applyType: this.info.orignSource == 'internalTask' ? '0' : '1',
      };
      uni.navigateTo({
        url: Utils.spliceGetUrl('/pages-order/select/selectType', params),
        events: {
          dataEvent: (data) => {
            this.info = {
              ...this.selectedProject,
              orignSource: this.info.orignSource || '',
              location: this.query.location || '',
              taskDesc: this.query.taskDesc || '',
              sourceType: this.query.sourceType || '',
              ...data.data,
              customFields: {},
            };
            if (this.info.orignSource === 'internalTask') {
              const { userName, userPhone }  = this.userInfo || {}
              this.info.contactName = userName; //服务请求人
              this.info.contactPhone = this.info.contactPhone || userPhone; //联系电话
            }
            this.getFieldList();
          },
        },
      });
    },
    selectStaff() {
      if (!this.info.projectId) {
        uni.showToast({ title: '请选择区域项目', icon: 'none' });
        return;
      }
      let params = {
        areaId: this.info.areaId,
        projectId: this.info.projectId,
      };
      uni.navigateTo({
        url: Utils.spliceGetUrl('/pages-order/order/choosePeople', params),
        events: {
          dataEvent: (data) => {
            this.selectedPeople = data.data;
            this.info = {
              ...this.info,
              ...this.selectedPeople,
            };
          },
        },
      });
    },
    selectTask() {
      if (!this.info.projectId) {
        uni.showToast({ title: '请选择区域项目', icon: 'none' });
        return;
      }
      let params = {
        areaId: this.info.areaId,
        projectId: this.info.projectId,
        checkactive: '1'
      };
      uni.setStorageSync('relateTasks', JSON.stringify(this.relateTasks));
      uni.navigateTo({
        url: Utils.spliceGetUrl('/pages-order/order/myTaskList', params),
        events: {
          dataEvent: (data) => {
            this.relateTasks = data || []
            let orderIds = this.relateTasks.map(item => {
              return item.quesTaskId;
            });
            this.info.relatetask = orderIds.join(',');
            this.info.relateIds = orderIds.join(',');
          },
        },
      });
    },
    delTask(index){
      this.relateTasks.splice(index, 1);
      let orderIds = this.relateTasks.map(item => {
        return item.quesTaskId;
      });
      this.info.relatetask = orderIds.join(',');
      this.info.relateIds = orderIds.join(',');
    },
    selectOwner() {
      if (!this.info.projectId) {
        uni.showToast({ title: '请选择区域项目', icon: 'none' });
        return;
      }
      let params = {
        areaId: this.info.areaId,
        projectId: this.info.projectId,
      };
      uni.navigateTo({
        url: Utils.spliceGetUrl('/pages-order/select/selectOwner', params),
        events: {
          dataEvent: (data) => {
            this.selectedOwner = data.data;
            this.info = {
              ...this.info,
              ...this.selectedOwner,
            };
            if (this.info.orignSource === 'internalTask') {
              const { userName, userPhone }  = this.userInfo || {}
              this.info.contactName = userName; //服务请求人
              this.info.contactPhone = this.info.contactPhone || userPhone; //联系电话
            }
          },
        },
      });
    },
    orignSourceChanged() {
      this.info = {
        orignSource: this.info.orignSource,
        ...this.selectedProject,
        location: this.query.location || '',
        taskDesc: this.query.taskDesc || '',
        sourceType: this.query.sourceType || '',
        customFields: {},
      };
      if (this.info.orignSource === 'internalTask') {
        const { userName, userPhone }  = this.userInfo || {}
        this.info.contactName = userName; //服务请求人
        this.info.contactPhone = this.info.contactPhone || userPhone; //联系电话
      }
      this.getFieldList();
    },
    submitTask() {
      let isValidate = false;
      let msg = '';
      uni.showLoading({
        mask: true,
      });
      this.commonFields.forEach((ele) => {
        // console.log(ele, 'eleele')
        if (!isValidate && this.required[ele.fieldCode] && !this.info[ele.fieldCode]) {
          console.log(ele.fieldCode,this.info[ele.fieldCode], 'this.info[ele.fieldCode]this.info[ele.fieldCode]')
          msg = '请补充' + ele.fieldName;
          isValidate = true;
        }
      });
      this.customFormFieldJson.forEach((item) => {
        item.rule.forEach((ele) => {
        if (!isValidate && ele.required && !this.info.customFields[ele.key]) {
          msg = ele.placeholder ? ele.placeholder : '请补充' + ele.name;
          isValidate = true;
        }
        })
      });
      if (isValidate) {
        uni.hideLoading();
        uni.showToast({ title: msg, icon: 'none' });
        return;
      }
      this.info.taskFacilityCorrelationBos=[];
			if(this.selectDevices){
				this.info.taskFacilityCorrelationBos=this.selectDevices;
			}
			if(this.info.zhuangXiuDanHao){
				this.info.taskFacilityCorrelationBos.push({facilityTaskId:this.facilityTaskId,type:1,facilityTaskCode:this.info.zhuangXiuDanHao})
			}			
      const { O_USER_INFO } = this.$constant;
      const { userId: usid, userAccount: uacc, userName: usname } = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }) || {};
      const userId = uni.getStorageSync('userId') || usid
      const userAccount = uni.getStorageSync('userAccount') || uacc
      const userName = uni.getStorageSync('userName') || usname
      let params = {
        header: {
          'x-userId-header': userId,
          'x-userAccount-header': userAccount,
          'x-userName-header': encodeURIComponent(userName)
        },
        data: {
          ...this.info,
          customFields: JSON.stringify(this.info.customFields),
          operationCode: 'submittask',
          operationName: '新增任务',
          sourceType: this.info.sourceType || '-1',
          taskTopic: this.query.taskTopic || '',
          recordTopic: this.query.recordTopic || '',
          thirdTaskId: this.query.thirdTaskId || '',
          configId: this.query.configId || '',
          configId: this.query.configId || '',
          deductPoint: this.query.deductPoint || '', //问题扣分
        },
      };
      let selectDevices = this.selectDevices;
			let self=this;
			if(selectDevices&&selectDevices.length>0){
			  let flag=false;
			  selectDevices.forEach(item1=>{
          debugger;
			    if(item1.repairedNumber+1>=item1.repairedNumberMax){
			      flag=true;
			      return false;
			    }
			  })
			  if(flag){
					uni.showModal({
						title: '提示',
						content: '当前设备维修已达到最大维修次数',
						showCancel:false,
						success (res) {
							if (res.confirm) {
								self.saveData(params);
							} else if (res.cancel) {
								// console.log('用户点击取消')
							}
						}
					})
			  }else{
			    self.saveData(params);
			  }
			}else{
			  self.saveData(params);
			}
      
    },
    saveData(params){
      uni.showLoading({
        mask: true
      })
      saveAndUpdateQuestionTask(params).then((res) => {
        uni.hideLoading();
        if (res.status == 200) {
          this.$refs.uToast.show({
            type: 'success',
            message: '新增成功',
            iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
            duration: 1500,
            complete() {
              uni.navigateBack();
            },
          });
        } else {
          uni.showToast({ title: res.message || '保存失败', icon: 'none' });
        }
      });
		},
    selectDevice(){
			let params = {
			  areaId: this.info.areaId,
			  projectId: this.info.projectId,
			}
			if(this.selectDevices){
				uni.setStorageSync('selectDatas', JSON.stringify(this.selectDevices));
			}else{
				uni.setStorageSync('selectDatas', '[]');
			}		
			uni.navigateTo({
			  url: Utils.spliceGetUrl('/pages-order/select/selectDevice', params),
			  events: {
			    dataEvent: (data) => {
						this.info = {
						  ...this.info,
							associatedDevice:data.data.associatedDevice,
						};
						this.selectDevices=data.data.selectDatas;
						// this.info.taskFacilityCorrelationBos=data.data.selectDatas;
			    }
			  }
			})
		},
		selectDecorate(){
			uni.navigateTo({
			  url: Utils.spliceGetUrl('/pages-order/select/selectDecorate'),
			  events: {
			    dataEvent: (data) => {
						this.info = {
						  ...this.info,
							zhuangXiuDanHao:data.data.decorationCode,
						};
						this.facilityTaskId=data.data.decorationId;
			    }
			  }
			})
		},
  },
};
</script>
