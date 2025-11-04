<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <!-- 用户信息表单 -->
    <view class="form-title cell-border">用户信息</view>
    <u-form class="form-data" labelPosition="left" :model="formModel" :rules="formRules" ref="elFormUser" labelWidth="112px" style="padding: 0 20rpx;">
      <u-form-item label="地址" borderBottom prop="userAddress" @click="addressObj.isShow = true">
        <!-- <u-input v-model="formModel.userAddress" disabled disabledColor="#ffffff" placeholder="请选择房源地址" border="none" /> -->
        <text>{{formModel.userAddress}}</text>
        <u-icon slot="right" name="arrow-right" />
      </u-form-item>
      <u-form-item :label="formModel.isEnterpriseHouse == 1 ? '联系人': '业主'" borderBottom prop="ownerName">
        <u-input v-model="formModel.ownerName" disabled disabledColor="#ffffff" placeholder="请输入申请人姓名" border="none" />
      </u-form-item>
      <u-form-item label="联系电话" borderBottom prop="contactPhone">
        <u-input v-model="formModel.contactPhone" disabled disabledColor="#ffffff" placeholder="请输入联系电话" border="none" :maxlength="11" />
      </u-form-item>
      <u-form-item label="所属公司名称" prop="companyName" v-if="haveCompany">
        <u-input v-model="formModel.companyName" :rules="[{
	type: 'string', required: true , message: '请填写完整', trigger: ['blur', 'change']
	}]"
    disabled disabledColor="#ffffff" placeholder="请输入请求人公司名称" border="none" />
      </u-form-item>
    </u-form>

    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 物品详情表单 -->
    <view class="form-title">详情</view>
    <view class="flex-between cell-item" v-for="(item, index) in formModel.goodsList" :key="index">
      <u-input v-model="item.itemName" placeholder="请填写物品名称" :customStyle="{ width: '34%', 'flex': '0 0 auto'}" />
      <u-input v-model="item.itemNum" placeholder="数量和单位" :customStyle="{ width: '34%', 'flex': '0 0 auto'}" />
      <u-icon name="trash" :color="THEME_COLOR" size="28" @click="delGoodsItem(index)" />
    </view>
    <u-button type="primary" icon="plus" size="12px" text="新增物品" :customStyle="{width: '120px', 'margin-top': '10px'}" @click="addGoodsItem" />
    <u-form class="form-data" labelPosition="left" :model="formModel" :rules="formRules" ref="elFormGoods" labelWidth="112px">
      <u-form-item label="放行人员" borderBottom prop="releaseName">
        <u-input v-model="formModel.releaseName" placeholder="请输入放行人员" border="none" />
      </u-form-item>
      <u-form-item label="联系电话" borderBottom prop="releasePhone">
        <u-input v-model="formModel.releasePhone" placeholder="请输入联系电话" border="none" />
      </u-form-item>
      <u-form-item label="身份证号" borderBottom prop="releaseIdCard">
        <u-input v-model="formModel.releaseIdCard" placeholder="请输入身份证号" border="none" />
      </u-form-item>
      <u-form-item label="放行日期" borderBottom prop="startTime" @click="startDateObj.isShow = true" ref="startTimes">
        <u-input v-model="formModel.startTime" disabled disabledColor="#ffffff" placeholder="请选择放行日期" border="none" />
        <u-icon slot="right" name="arrow-right" />
      </u-form-item>
    </u-form>

    <u-textarea v-model="formModel.releaseDescription" placeholder="如有特殊要求，请在此填写（如需车辆进出，请填写车牌号）" border="bottom" />
    <view class="isnonoAuthority">
    	<u-upload :fileList="formModel.fileList" :maxCount="6" :previewFullImage="true" @afterRead="uploadPic" @delete="deletePic"/>
			<view class="noAuthority" @click="uplplll(1)" v-if="isNoAuthority"></view>
    </view>

    <view class="gap">放行申请审核通过后，请提前准备身份证，用于门岗放行查验！</view>

    <view class="flex-around">
      <!-- <u-button class="myfx-btn" shape="circle" :customStyle="{ width: '40%', 'flex-shrink': 0 }" @click="linkTo">我的放行</u-button> -->
      <view class="myfx-btn" @click="linkTo">我的放行</view>
      <u-button type="primary" shape="circle" :customStyle="{ width: '40%', 'flex-shrink': 0 ,height:'84rpx'}" @click="handleSubmit">提交申请</u-button>
    </view>

    <u-picker :show="addressObj.isShow" :columns="addressObj.list" keyName="address" @cancel="addressObj.isShow = false" @confirm="addressConfirm" closeOnClickOverlay @close="addressObj.isShow=false"/>
    <u-calendar :show="startDateObj.isShow" mode="single" :maxDate="startDateObj.maxDate" @close="startDateObj.isShow = false" @confirm="startDateConfirm" closeOnClickOverlay /> 
    <u-toast ref="elToast" />
    <uniPop ref="rzModal" />
  </view>
</template>

<script>
import Utils from '@/js/utils'
import { getOwnerBuildingListComm , getCompanyConfig} from '@/service/community'
import { uploadMutiFile } from '@/service/landcrm'
import { insertDecpass } from '@/service/wxmanage'
	import commLogic from '@/js/comm-logic';
export default {
  name: 'AddGoodsRelease',
  options: { styleIsolation: 'shared' },
  data() {
    const { MEMBER_ID, AREA_ID, PROJECT_ID,COMPLANY_ID } = this.$constant 

    return {
      companyId: Utils.storageAction({ key: COMPLANY_ID, action: 'get' }),
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      formModel: {
        userAddress: '',
        ownerName: '',
        contactPhone: '',
        companyName: '',
        releaseName: '',
        releasePhone: '',
        releaseIdCard: '',
        startTime: '',
        releaseDescription: '',
        isEnterpriseHouse:'',
        fileList: [],
        goodsList: [
          { itemName: '', itemNum: '' }
        ]
      },
      haveCompany:true,
      formRules: {
        userAddress: { type: 'string', required: true, message: '请选择房源地址' },
        ownerName: { type: 'string', required: true, message: '请填写完整' },
        contactPhone: [
          { type: 'string', required: true, message: '请填写完整' },
          { validator: (rule, value, callback) => uni.$u.test.mobile(value), message: '手机号码不正确' }
        ],
        // companyName: { type: 'string', required: true , message: '请填写完整', trigger: ['blur', 'change'] },
        releaseName: { type: 'string', required: true, message: '请填写完整', trigger: ['blur', 'change'] },
        releasePhone: [
          { type: 'string', required: true, message: '请填写完整', trigger: ['blur', 'change'] },
          { validator: (rule, value, callback) => uni.$u.test.mobile(value), message: '手机号码不正确' }
        ],
        releaseIdCard: [
          { type: 'string', required: true, message: '请填写完整', trigger: ['blur', 'change']},
          { validator: (rule, value, callback) => uni.$u.test.idCard(value), message: '身份证格式错误' }
        ],
        startTime: { type: 'string', required: true, message: '请选择', trigger: ['blur', 'change'] },
      },
      addressObj: {
        isShow: false,
        list: [[]],
        value: ''
      },
      startDateObj: {
        isShow: false,
        maxDate: Utils.formatDate({ value: Utils.getFutureDate(365, 'back'), type: 's2d', format: 'YY-MM-DD' }),
        value: []
      },
      submitLoading:false,
			isNoAuthority:false,
    }
  },
  created() {
    this.getBuildingList()
  },
  onReady(){
    this.$refs.elFormGoods.setRules(this.formRules);
    this.$refs.elFormUser.setRules(this.formRules);

  },
	async onShow(){
    const { O_USER_INFO } = this.$constant;
		const {phoneNumber} = Utils.storageAction({ key: O_USER_INFO, action: 'get' });
    if(!phoneNumber){
				  uni.navigateTo({ url: '/pages-a/authorization/bindingMobile'});
					return
			}
    const hasAuth = await this.setAuthType()
    if (!hasAuth) return
		this.uplplll(2)
	},
  methods: {
    addressConfirm({ indexs, value, values }) {
      this.addressObj.isShow = false
      if (indexs.length <= 0) return

      this.addressObj.value = value[0]
      this.formModel.userAddress = value[0].address
      // this.formModel.ownerName = value[0].regName
      this.formModel.contactPhone = value[0].ownerPhones
      // this.formModel.contactPhone = value[0].ownerPhones
      this.formModel.isEnterpriseHouse = value[0].isEnterpriseHouse
      if(this.formModel.isEnterpriseHouse == 1){
        this.haveCompany = true 
        this.formModel.ownerName = value[0].contactName
        this.formModel.companyName = value[0].regName
      }else{
        this.haveCompany = false
        this.formModel.ownerName = value[0].regName
      }
      console.log(145,this.formModel)
    },
    startDateConfirm(val) {
      // this.formModel.startTime = val[0]
      this.$set(this.formModel,'startTime', val[0])
      this.$nextTick(()=>{
        this.$refs['startTimes'].clearValidate()
      })
      this.startDateObj.isShow = false
    },
		async uplplll(showTip = 1){
			if(this.isNoAuthority = true){
				const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['camera', 'readStorage']},showTip)
				if (code !== 1 && code !== -2) {
					return
				}
			}
			const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['camera', 'readStorage']},showTip)
			if (code !== 1 && code !== -2) {
				this.isNoAuthority = true
				return
			}else{
				this.isNoAuthority = false
			}
		},
    // 上传图片
    async uploadPic(event) {
			const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['camera', 'readStorage']})
			if (code !== 1 && code !== -2) {
				return
			}
      const fileList = {
        ...event.file,
        status: 'uploading',
        message: '上传中',
      }
      this.formModel.fileList.push(fileList)

      const res = await uploadMutiFile(fileList.url)
      const fileInfo = res.fileInfo
			if(!fileInfo){
				uni.showToast({title:res.msg,icon:'none'})
				return
			}
      let lastIndex = this.formModel.fileList.length - 1
      let item = this.formModel.fileList[lastIndex]
      this.formModel.fileList.splice(lastIndex, 1, {
        ...item,
        url: fileInfo.resPath,
        fileId: fileInfo.fid,
        status: 'success',
        message: ''
      })
    },
    /**删除图片 */
    deletePic(event) {
			console.log('时间触发')
      this.formModel.fileList.splice(event.index, 1)
    },
    // 获取房源地址数据
    async getBuildingList() {
      const params = {
        companyId: this.companyId,
        memberId: this.memberId,
        authState: 1
      }
      const res = await getOwnerBuildingListComm({ data: params })
      // const list = res.data.filter((i)=>{return i.isEnterpriseHouse ==1 }) || []
      console.log(191,list)
      const list = res.data || []
      if (!list.length) return

      this.addressObj.value = list[0]
      this.addressObj.list = [list]
      this.formModel.userAddress = list[0].address
      // this.formModel.ownerName = list[0].regName
      this.formModel.contactPhone = list[0].ownerPhones
      this.formModel.isEnterpriseHouse = list[0].isEnterpriseHouse
      if(this.formModel.isEnterpriseHouse == 1){
        this.haveCompany = true 
        this.formModel.ownerName = list[0].contactName
        this.formModel.companyName = list[0].regName
      }else{
        this.haveCompany = false
        this.formModel.ownerName = list[0].regName
      }
      console.log(199,this.formModel)
    },
    /**添加物品 */
    addGoodsItem() {
      this.formModel.goodsList.push({ itemName: '', itemNum: '' })
    },
    /**删除物品 */
    delGoodsItem(index) {
      this.formModel.goodsList.splice(index, 1)
    },
    async handleSubmit() {
			if(this.submitLoading){
				return
			}
      const vali = await Promise.all([this.$refs.elFormUser.validate(), this.$refs.elFormGoods.validate()]).catch(err => [false])
      if (vali[0] === false) return

      // 物品是必填的
      let isEmpty = this.formModel.goodsList.length === 0
      isEmpty = isEmpty ? true : this.formModel.goodsList.some(item => !item.itemName || !item.itemNum)
      if (isEmpty) {
        this.$refs.elToast.show({
          type: 'error',
          message: '搬出物品及数量不能为空'
        })
        return
      }

			this.submitLoading = true

      if(this.formModel.isEnterpriseHouse == 1){
        const params = {
        addrId: this.addressObj.value.addrId, // 房产id
        address: this.addressObj.value.address, // 房产地址
        areaId: this.areaId, // 区域id
        projectId: this.projectId, // 项目id
        ownerInfoId: this.memberId, // 业主ownerId
        ownerName: this.formModel.ownerName, // 业主姓名
        ownerPhone: this.formModel.contactPhone, // 业主电话
        source: 1,
        submitter: this.memberId, // 提交人(申请人memberId)
        submitterName: this.formModel.ownerName,
        submitterPhone: this.formModel.contactPhone,
        pedestriansName: this.formModel.releaseName, // 放行人姓名
        telephone: this.formModel.releasePhone, // 放行人电话 
        startTime: this.formModel.startTime + ' 00:00:00', // 放行开始时间
        endTime: this.formModel.startTime + ' 23:59:59', // 放行结束时间
        descriptionContent: this.formModel.releaseDescription || '无', // 事由
        type: 1, // 1、放行，2、来访
        isEnterpriseHouse: 1,//标识企业申请放行
        idCardNum: this.formModel.releaseIdCard,
        companyName: this.formModel.companyName,
        items: JSON.stringify(this.formModel.goodsList),
        notePicture: JSON.stringify(this.formModel.fileList.map(item => item.url))
        }
        const res = await insertDecpass(params).finally(err => {
          this.submitLoading = false
        })
      console.log(249,params)
      if (res.status == 400) {
        this.$refs.elToast.show({
          type: 'error',
          message: '该房间没有业主，请联系管家'
        })
        return
      } else if (res.status != 200) {
        this.$refs.elToast.show({
          type: 'error',
          message: '提交失败，请联系管家'
        })
        return
      }

      this.$refs.elToast.show({
        type: 'success',
        message: '提交成功'
      })

      setTimeout(() => {
        uni.redirectTo({
          url: Utils.spliceGetUrl('/pages-c/goods-release/goods-release-detail', { passId: res.data.releaseId })
        })
      }, 500)
      }else{
        const params = {
        addrId: this.addressObj.value.addrId, // 房产id
        address: this.addressObj.value.address, // 房产地址
        areaId: this.areaId, // 区域id
        projectId: this.projectId, // 项目id
        ownerInfoId: this.memberId, // 业主ownerId
        ownerName: this.formModel.ownerName, // 业主姓名
        ownerPhone: this.formModel.contactPhone, // 业主电话
        source: 1,
        submitter: this.memberId, // 提交人(申请人memberId)
        submitterName: this.formModel.ownerName,
        submitterPhone: this.formModel.contactPhone,
        pedestriansName: this.formModel.releaseName, // 放行人姓名
        telephone: this.formModel.releasePhone, // 放行人电话 
        startTime: this.formModel.startTime + ' 00:00:00', // 放行开始时间
        endTime: this.formModel.startTime + ' 23:59:59', // 放行结束时间
        descriptionContent: this.formModel.releaseDescription || '无', // 事由
        type: 1, // 1、放行，2、来访
        idCardNum: this.formModel.releaseIdCard,
        // companyName: this.formModel.companyName,
        items: JSON.stringify(this.formModel.goodsList),
        notePicture: JSON.stringify(this.formModel.fileList.map(item => item.url))
        }
        const res = await insertDecpass(params).finally(err => {
          this.submitLoading = false
        })
      console.log(274,params)
      if (res.status == 400) {
        this.$refs.elToast.show({
          type: 'error',
          message: '该房间没有业主，请联系管家'
        })
        return
      } else if (res.status != 200) {
        this.$refs.elToast.show({
          type: 'error',
          message: '提交失败，请联系管家'
        })
        return
      }

      this.$refs.elToast.show({
        type: 'success',
        message: '提交成功'
      })

      setTimeout(() => {
        uni.redirectTo({
          url: Utils.spliceGetUrl('/pages-c/goods-release/goods-release-detail', { passId: res.data.releaseId })
        })
      }, 500)
      }
      // const res = await insertDecpass(params)
      // console.log(274,params)
      // if (res.status == 400) {
      //   this.$refs.elToast.show({
      //     type: 'error',
      //     message: '该房间没有业主，请联系管家'
      //   })
      //   return
      // } else if (res.status != 200) {
      //   this.$refs.elToast.show({
      //     type: 'error',
      //     message: '提交失败，请联系管家'
      //   })
      //   return
      // }

      // this.$refs.elToast.show({
      //   type: 'success',
      //   message: '提交成功'
      // })

      // setTimeout(() => {
      //   uni.redirectTo({
      //     url: Utils.spliceGetUrl('/pages-c/goods-release/goods-release-detail', { passId: res.data.releaseId })
      //   })
      // }, 500)
    },
    linkTo() {
      uni.navigateTo({ url: '/pages-c/goods-release/goods-release-list' })
    },
    // 如果未认证，则设置认证类型
    async setAuthType() {
          if (this.hasAuth()) return Promise.resolve(true)
          const { COMPLANY_ID } = this.$constant
          const companyId = Utils.storageAction({ key: COMPLANY_ID, action: 'get' })
          const params = {
            data: {
          companyId
            }
          }
          const res = await getCompanyConfig(params)
          const authTypes = this.parseStr2JSON(res.data?.authType).filter(Boolean)
          // 设置认证类型
          let temp = 0
          if (authTypes.length == 1) {
            const num = parseInt(authTypes[0])
            temp = isNaN(num) ? 0 : num
          } else if (authTypes.length == 2) {
            temp = 0
          }
          this.showFWQY = temp
    
          this.showAuthModal()

          return Promise.resolve(false)
        },
        // 将字符串转换为数组，例如 "["2", "1"]" => ["2", "1"]
        parseStr2JSON(val) {
          try {
            return JSON.parse(val)
          } catch (error) {
            return []
          }
        },
        // 弹出认证窗口
        showAuthModal() {
            this.$refs.rzModal.showModal({ modalType: 'rz' })
            this.$refs.rzModal.showCompanyConfig()
        },
        // 判断业主是否认证
        hasAuth() {
          const { IS_ASSOCIATION } = this.$constant
          const isAssociation = Utils.storageAction({ key: IS_ASSOCIATION, action: 'get' })
          return (isAssociation != void 0 && isAssociation != '0' && isAssociation != '-1')
        }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
}
.form-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  height: 38px;
  line-height: 1;
  font-weight: bold;
  padding: 0 15px;

  &::before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 16px;
    background-color: var(--app-primary-color);
    margin-right: 5px;
  }
}
.form-data {
  padding: 0 10rpx;
}

.cell-border {
  border-bottom: 1px solid #D9D9D9;
}
::v-deep .u-form-item>.u-form-item__body {
  padding: 10px 15px;
}
.gap {
  background-color: rgb(245, 245, 245);
  color: rgb(153, 153, 153);
  font-size: 12px;
  line-height: 2;
  padding: 10px 15px;
}
.flex-around {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px 0;
}
.myfx-btn {
  width: 40%;
  font-size: 28rpx;
  text-align: center;
  line-height: 80rpx;
  box-sizing: border-box;
  border-radius: 46rpx;
  margin-left: 52rpx;
  border: 2rpx solid var(--app-primary-color);
  color: var(--app-primary-color);
}
/* ::v-deep .flex-between .myfx-btn {
  border: 1rpx solid var(--app-primary-color) !important;
}
::v-deep .flex-between .u-button--plain.u-button--info {
  color: var(--app-primary-color) !important;
} */
::v-deep .u-form {
  padding: 0 20rpx;
}
::v-deep .u-textarea{
  padding: 9px 20px !important;
}
::v-deep .u-upload {
  padding: 8px 16px 0;
}
::v-deep .uni-input-wrapper {
  font-size: 28rpx !important;
}
::v-deep .u-line {
  width: 664rpx !important;
  margin: 0 auto !important;
}

::v-deep .u-input__content__field-wrapper__field{
  font-size: 28rpx !important;
}
::v-deep .u-form-item__body__left__content__label, .u-form-item__body__right {
  font-size: 28rpx !important;
}
::v-deep .u-popup__content .u-popup__content__close--top-right .u-icon__icon{
  width: 50px;
  height: 40px;
  justify-content: center;
}
::v-deep .u-popup__content .u-popup__content__close--top-right{
  top: 0px;
  right: 0px;
}

.isnonoAuthority{
	position: relative;
}
.noAuthority{
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
}
</style>