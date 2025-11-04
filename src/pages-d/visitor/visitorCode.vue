<style scoped>
.complete-profile {
  background: #F5F5F5;
  height: 100vh;
}
.all-view-style {
  background: #FFFFFF;
  padding-left:40rpx;
  padding-right: 40rpx;
}
.all-view-style ::v-deep .u-form .u-form-item .u-form-item__body {
  padding:28rpx 0 !important;
}

.all-view-style ::v-deep .u-form .u-form-item .u-form-item__body__left__content__label {
  padding-left: 6rpx;
  color: #333333 !important;
  font-family: PingFang SC;
}
.all-view-style ::v-deep .u-form .u-form-item .u-form-item__body__right .u-textarea {
  padding: 0 !important;
}
 .flex-around {
  display: flex;
  margin-top:80rpx;
 }


</style>
<template>
    <view class="complete-profile" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
     <view class="all-view-style">
      <u-form labelPosition="left" :model="formModel"  :rules="formRules" ref="elFormUser" labelWidth="112px">
        <u-form-item label="区域" borderBottom >
        <u-input v-model="formModel.areaName"   border="none" readonly/>
      </u-form-item>
      <u-form-item label="项目" borderBottom >
        <u-input v-model="formModel.projectName"    border="none" readonly/>
      </u-form-item>
      <u-form-item label="到访地址" borderBottom prop="roomInfo">
        <u-input v-model="formModel.roomInfo" placeholder="请填写"  border="none" />
      </u-form-item>
      <!-- <u-form-item label="到访地址" borderBottom prop="roomInfo" @click="addressObj.isShow = true" ref="visitAdree">
        <u-input v-model="formModel.roomInfo" disabled disabledColor="#ffffff" placeholder="请选择" border="none" />
        <u-icon slot="right" name="arrow-right" />
      </u-form-item> -->
      <u-form-item label="访客姓名" borderBottom prop="name">
        <u-input v-model="formModel.name"  placeholder="请填写" border="none" />
      </u-form-item>
      <u-form-item label="访客电话" borderBottom prop="phone">
        <u-input v-model="formModel.phone"  placeholder="请填写" border="none" :maxlength="11" />
      </u-form-item>
      <u-form-item label="来访时间" borderBottom prop="visitTime" @click="birthShow = true" ref="visitTimes">
        <u-input v-model="formModel.visitTime" disabled disabledColor="#ffffff" placeholder="请选择" border="none" />
        <u-icon slot="right" name="arrow-right" />
      </u-form-item>
      <u-form-item label="来访事由" borderBottom prop="reason">
        <u-textarea v-model="formModel.reason" placeholder="请填写" border="none" autoHeight />
      </u-form-item>
    </u-form>
    <u-picker :show="addressObj.isShow" :columns="addressObj.list" keyName="address" @cancel="addressObj.isShow = false" @confirm="addressConfirm" />
      <u-datetime-picker closeOnClickOverlay @close="birthShow = false" :show="birthShow"
                v-model="startDateObj.value" :minDate="startDateObj.minDate"
                mode="datetime" @cancel="birthShow = false" @confirm="confirmDate">
      </u-datetime-picker>
    </view>
    <view class="flex-around">
      <u-button type="primary" shape="circle" :customStyle="{ width: '75%', 'flex-shrink': 0 ,height: '68rpx'}" @click="submit">提交</u-button>
    </view>
    </view>
</template>

<script>
import Utils from '@/js/utils';
import {getOwnerBuildingListComm ,getSceneMessage,visitorAcess} from '@/service/community'

export default{
    name: "visitorApplication",

    data(){
      const { MEMBER_ID, AREA_ID, PROJECT_ID,O_USER_INFO,COMPLANY_ID} = this.$constant
         return{
          single:'',
          start: uni.$u.timeFormat(Date.now(), 'yyyy-mm-dd hh:MM:ss'),
          birthShow: false,
          btnLoading: false, // 如果为true，提交按钮就不能被点击。用于只能在提交完成后才能再提交
          formModel: {
            areaName:'',
            projectName:'',
            roomInfo: '',
            name: '',
            phone: '',
            visitTime: '',
            reason: '',
          },
          companyId: ls.storageAction({ key: COMPLANY_ID, action: 'get' }),
          memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
          areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
          projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
          userInfo:Utils.storageAction({ key: O_USER_INFO, action: 'get' }),
          formRules: {
            roomInfo: { type: 'string', required: true, message: '请选择', trigger: ['blur', 'change']  },
            name: { type: 'string', required: true, message: '请填写', trigger: ['blur', 'change']  },
            phone: [
                  { type: 'string', required: true, message: '请填写', trigger: ['blur', 'change']  },
                  { validator: (rule, value, callback) => uni.$u.test.mobile(value), message: '手机号码不正确' }
                ],
            visitTime: { type: 'string', required: true, message: '请选择', trigger: ['blur', 'change']  },
            reason: { type: 'string', required: true, message: '请填写', trigger: ['blur', 'change']  },
          },
          addressObj: {
                      isShow: false,
                      list: [[]],
                      value: ''
                    },
           startDateObj: {
                 isShow: false,
                 minDate: new Date().getTime(),
                 value: ''
               },
               scence:'',
               ownerInfo:{}
        }
    },
    onLoad (query) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(query.scene)
    this.scence = scene
    // this.scence= '4DLmQ6bG';
    this.getSceneMessage()
  
    // this.getBuildingList()
    uni.setNavigationBarTitle({title:'访客申请'})

      },
    onReady(){
      this.$refs.elFormUser.setRules(this.formRules);
      uni.setNavigationBarTitle({title:'访客申请'})
    },
    onShow(){
    uni.setNavigationBarTitle({title:'访客申请'})
		      },
    methods:{
        selectChange(e){
            console.log(44,e)
            this.formModel.visitAdress = e
        },
        openDetail(){
            console.log(1)
        },
        confirmDate({ value }) {
            const dateStr = uni.$u.timeFormat(value, 'yyyy-mm-dd hh:MM')
            this.formModel.visitTime = dateStr;
            this.$nextTick(()=>{
                this.$refs['visitTimes'].clearValidate()
              })
            this.birthShow = false;

        },
         // 获取房源地址数据
          async getBuildingList() {
            const params = {
              companyId: this.companyId,
              memberId: this.memberId
            }
            const res = await getOwnerBuildingListComm({ data: params })
            const list = res.data || []
            if (!list.length) return
            this.addressObj.value = list[0]
            this.addressObj.list = [list]
          },
        addressConfirm({ indexs, value, values }) {
          console.log(indexs,value,values)
                 this.addressObj.isShow = false
                 if (indexs.length <= 0) return
                 this.formModel.roomInfo = value[0].address
                 this.$nextTick(()=>{
                this.$refs['visitAdree'].clearValidate()
              })

          },
        async   submit() {
          let self = this;
          let param ={
            data:{
              companyId:self.companyId,
                 memberId: self.memberId,
                 createUserName:self.userInfo.fullName || self.userInfo.STRG_realName,
                areaId: self.ownerInfo.areaId,
                //  infoId: self.ownerInfo.addrId,
                 projectId: self.ownerInfo.projectId,
                 roomInfo:self.formModel.roomInfo,
                 name: self.formModel.name,
                 phone: self.formModel.phone,
                 reason: self.formModel.reason,
                 type: 0,
                 visitTime: self.formModel.visitTime
            }      
          }
          const vali = await Promise.all([this.$refs.elFormUser.validate()]).catch(err => [false])
          if (vali[0] === false) return
          this.btnLoading = true
      const res = await visitorAcess(param)
      this.btnLoading = false
      if (res.status == '200') {
        uni.showToast({
          title: '提交成功',
          duration: 800,
          icon: 'none'
        })
        this.$refs.elFormUser.resetFields();
        this.formModel = {
            roomInfo: '',
            name: '',
            phone: '',
            visitTime: '',
            reason: '',
          }
          this.getSceneMessage()
      } else {
        uni.showToast({
          title: res.message,
          duration: 800,
          icon: 'none'
        })
      }

        },

        async getSceneMessage(){
          let that = this;
            var params = {
                hideLoading: true,
                pathParams: `/${this.scence}`
            }
            getSceneMessage(params).then(res => {
                if (res.status == 200) {
                  this.ownerInfo = res.data
                  this.formModel.areaName = res.data.areaName
                  this.formModel.projectName = res.data.projectName


                }
            })

        }
    }
}
</script>
