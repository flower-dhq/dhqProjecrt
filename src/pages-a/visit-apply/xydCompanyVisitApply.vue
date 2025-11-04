<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  background-color: #f5f5f5;
}
.form-title {
  display: flex;
  align-items: center;
  font-size: 32rpx;
  height: 76rpx;
  line-height: 1;
  font-weight: bold;
  padding-left: 40rpx;

  &::before {
    content: '';
    display: inline-block;
    width: 10rpx;
    height: 36rpx;
    background-color: var(--app-primary-color);
    margin-right: 2px;
  }
}
.cell-border {
  border-bottom: 1px solid #D9D9D9;
}

/*  #ifdef  MP-WEIXIN  */
::v-deep .u-form-item .u-form-item__body {
	// margin-right:30rpx;
  padding: 20rpx 30rpx 20rpx 0;
	line-height: 60rpx;
}
/*  #endif  */

.u-form-item ::v-deep .u-form-item__body {
	// margin-right:30rpx;
   padding: 20rpx 30rpx 20rpx 0;
	line-height: 60rpx;
}

.gap {
  background-color: rgb(245, 245, 245);
  color: rgb(153, 153, 153);
  font-size: 24rpx;
  line-height: 2;
  padding: 20rpx 30rpx;
}
.flex-around {
  display: flex;
  justify-content: space-around;
  padding: 40rpx 0;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 30rpx 0;
}
.u-upload {
  padding: 16rpx 16rpx 0;
}

.tab-group {
  width: 100%;
  height: 80rpx;
  display: flex;

  .item {
    width: 50%;
    height: 100%;
    background-color: #D7D7D7;
    line-height: 80rpx;
    font-size: 28rpx;
    color: #999999;
    text-align: center;
    border-bottom: 1px solid #D7D7D7;
  }

  .selectedTabClass {
    background-color: #fff;
    color: var(--app-primary-color); 
    border-bottom: 1px solid var(--app-primary-color);
  }
}

.title-container {
  padding: 30rpx;
  font-size: 28rpx;
}
/*  #ifdef  MP-WEIXIN  */
::v-deep .u-form{
	background: #fff;
	padding:0 30rpx 0 30rpx
}
// ::v-deep .uicon-arrow-right{
// 	position: absolute;
// 	right: 20rpx;
// }
/*  #endif  */
// .uicon-arrow-right{
// 	position: absolute;
// 	right: 20rpx;
// }
.ufrom {
  background: #fff;
	padding:0 30rpx 0 30rpx
}

.icon_x {
  // color: var(--app-primary-color);
  color: red;
  margin-left: 6rpx;
}

.submit-btn {
  position: fixed;
  bottom: 0;
  background-color: var(--app-primary-color); 
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  color: whitesmoke;
	z-index: 1;
}
.submit-box-btn{
	width: 100%;
	height: 80rpx;
}
.greyColor {
  color: rgb(192, 196, 204);
}
.textRight{
	text-align: right;
}
.form-line{
	width: 100%;
	border-top: 1px solid #D9D9D9;
}
</style>
<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]" :class="[THEME_NAME]">
    <view class="tab-group" v-if="isTabShow">
      <view class="item" :class="{selectedTabClass:visitType}" @click="tabChange(true)">
        <text :class="{tab_botton:visitType}">邀请访客</text>
      </view>
      <view class="item" :class="{selectedTabClass:!visitType}" @click="tabChange(false)">
        <text :class="{tab_botton:!visitType}">访客登记</text>
      </view>
    </view>
    <!-- 访客登记 -->
    <view v-if="!visitType">
      <!-- 用户信息表单 -->
      <view class="title-container">请填写拜访的业主信息</view>
      <u-form labelPosition="left" :model="formModel" ref="elFormUser" labelWidth="112px" class="ufrom" style="background: #fff;">
        <u-form-item prop="toVisitPersonName" :borderBottom="true">
          <text slot="label">被访人姓名<text class="icon_x">*</text></text>
          <u-input v-model="formModel.toVisitPersonName" placeholder="请填写被访问人姓名" border="none" inputAlign="right" clearable placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
        </u-form-item>
        <u-form-item prop="toVisitPersonName" :borderBottom="true">
          <text slot="label">被访人手机号<text class="icon_x">*</text></text>
          <u-input v-model="formModel.toVisitPersonPhone" placeholder="请填写被访问人手机号" border="none" inputAlign="right" :maxlength="11" clearable placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
        </u-form-item>
        <u-form-item :borderBottom="true">
          <text slot="label">公司名称</text>
          <u-input 
            class="input-box" 
            readonly
            @click.native="goSelectCompany(1)" 
            clearable 
            type="text" 
            placeholder="请选择" 
            border="none"
            inputAlign="right"
            v-model="companyInfo.name" placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        <u-form-item>
          <text slot="label">企业详细地址</text>
          <text :class="companyInfo.address[0]?'':'greyColor'" style="flex: 1;text-align: right;">{{companyInfo.address[0]?companyInfo.address[0]:'请输入企业详细地址'}}</text>
        </u-form-item>   
      </u-form>

      <u-gap height="10" bgColor="#f5f5f5" />

      <!-- 物品详情表单 -->
      <view class="title-container">访客信息</view>
      <u-form labelPosition="left" :model="formModel"ref="elFormGoods" labelWidth="112px"  class="ufrom">
        <u-form-item prop="visitPersonName" :borderBottom="true">
          <text slot="label">访客姓名<text class="icon_x">*</text></text>
          <u-input v-model="formModel.visitPersonName" placeholder="请填写访客姓名" border="none" inputAlign="right" clearable style="padding-right: 20rpx;" :readonly="isTabShow" placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
        </u-form-item>
        <u-form-item prop="visitPersonPhone" :borderBottom="true">
          <text slot="label">访客手机号<text class="icon_x">*</text></text>
          <u-input v-model="formModel.visitPersonPhone" placeholder="请填写访客手机号" border="none" inputAlign="right" clearable style="padding-right: 20rpx;" readonly placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
        </u-form-item>
				<u-form-item prop="visitPersonIdCard" :borderBottom="true">
				  <text slot="label">访客证件号<text class="icon_x">*</text></text>
				  <u-input v-model="formModel.visitPersonIdCard" placeholder="请填写访客证件号" border="none" inputAlign="right" clearable style="padding-right: 20rpx;" placeholder-style="font-size: 28rpx;color: #c0c4cc;" :maxlength="18"/>
				</u-form-item>
				<u-form-item prop="visitPersonPlate" :borderBottom="true">
				  <text slot="label">访客车牌号</text>
				  <u-input v-model="formModel.visitPersonPlate" placeholder="请填写访客车牌号" border="none" inputAlign="right" clearable style="padding-right: 20rpx;" placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
				</u-form-item>
        <u-form-item prop="planVisitTime" @click="startDateObj.isShow = true" :borderBottom="true">
          <text slot="label">拜访日期<text class="icon_x">*</text></text>
          <u-input v-model="formModel.planVisitTime" disabled disabledColor="#ffffff" placeholder="请选择放行日期" inputAlign="right" border="none"  placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
          <u-icon slot="right" name="arrow-right"/>
        </u-form-item>
        <!-- <u-form-item prop="visitableNum">
          <text slot="label">拜访次数<text class="icon_x">*</text></text>
          <u-number-box :min="1" v-model="formModel.visitableNum" inputAlign="right" style="margin-left: 320rpx;"></u-number-box>
        </u-form-item> -->
        <u-form-item prop="visitReason">
          <text slot="label">拜访事由<text class="icon_x">*</text></text>
          <u-input 
            class="input-box" 
            readonly
            @click.native="showAuthRegister" 
            clearable 
            type="text" 
            placeholder="请选择" 
            border="none"
            inputAlign="right"
            v-model="formModel.visitReason" placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </u-form>
			<view class="submit-box-btn"></view>
      <view class="submit-btn"  @click="submitRegister">提交申请</view>
    </view>
    <view v-if="visitType">
      <view class="title-container">请填写访客信息</view>
      <u-form labelPosition="left" :model="authApplyInfoList" ref="elFormUser" labelWidth="112px" class="ufrom">
        <u-form-item prop="authVisitPersonName" :borderBottom="true">
          <text slot="label">访客姓名<text class="icon_x">*</text></text>
          <u-input v-model="authApplyInfoList.authVisitPersonName" placeholder="请填写访客姓名" border="none" inputAlign="right" clearable placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
        </u-form-item>
        <u-form-item prop="authVisitPersonPhone" :borderBottom="true">
          <text slot="label">访客手机号<text class="icon_x">*</text></text>
          <u-input v-model="authApplyInfoList.authVisitPersonPhone" placeholder="请填写访客手机号" border="none" inputAlign="right" :maxlength="11" clearable placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
        </u-form-item>
				<u-form-item prop="visitPersonIdCard" :borderBottom="true">
				  <text slot="label">访客证件号<text class="icon_x">*</text></text>
				  <u-input v-model="authApplyInfoList.visitPersonIdCard" placeholder="请填写访客证件号" border="none" inputAlign="right" :maxlength="18" clearable placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
				</u-form-item>
				<u-form-item prop="visitPersonPlate" :borderBottom="true">
				  <text slot="label">访客车牌号</text>
				  <u-input v-model="authApplyInfoList.visitPersonPlate" placeholder="请填写访客车牌号" border="none" inputAlign="right" :maxlength="11" clearable placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
				</u-form-item>
        <u-form-item prop="authPlanVisitTime" @click="startDateObj.isShow = true" :borderBottom="true">
          <text slot="label">拜访日期<text class="icon_x">*</text></text>
          <u-input v-model="authApplyInfoList.authPlanVisitTime" disabled disabledColor="#ffffff" placeholder="请选择放行日期" inputAlign="right" border="none" placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
          <u-icon slot="right" name="arrow-right" />
        </u-form-item>
        <!-- <u-form-item prop="authVisitableNum">
          <text slot="label">拜访次数<text class="icon_x">*</text></text>
          <u-number-box :min="1" v-model="authApplyInfoList.authVisitableNum" inputAlign="right" style="margin-left: 320rpx;"></u-number-box>
        </u-form-item> -->
        <u-form-item prop="authVisitReason">
          <text slot="label">拜访事由<text class="icon_x">*</text></text>
          <u-input 
            class="input-box" 
            readonly
            @click.native="showAuthRegister" 
            clearable 
            type="text" 
            placeholder="请选择" 
            border="none"
            inputAlign="right"
            v-model="authApplyInfoList.authVisitReason" placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </u-form>
      <view class="title-container">我的企业信息</view>
      <u-form labelPosition="left" :model="ownerInfo" ref="elFormUser" labelWidth="112px" class="ufrom">
        <u-form-item :borderBottom="true">
					<text slot="label">联系人</text>
          <u-input v-model="contactName" border="none" inputAlign="right" clearable readonly placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
        </u-form-item>
        <u-form-item :borderBottom="true">
					<text slot="label">联系电话</text>
          <u-input v-model="contactPhone" border="none" inputAlign="right" clearable readonly placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
        </u-form-item>
        <u-form-item @click="goSelectCompany(2)" :borderBottom="true">
					<text slot="label">拜访企业</text>
          <!-- <u-input v-model="authCompanyInfo.name?authCompanyInfo.name:'未选择公司'" border="none" inputAlign="right" clearable readonly/> -->
          <text style="flex: 1;text-align: right;">{{authCompanyInfo.name?authCompanyInfo.name:'未选择公司'}}</text>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        <u-form-item prop="add">
					<text slot="label">企业详细地址</text>
          <!-- <u-input v-model="authCompanyInfo.address[0]" border="none" inputAlign="right" clearable readonly type="textarea"/> -->
					<text class="textRight">{{authCompanyInfo.address[0]}}</text>
        </u-form-item>
      </u-form>
			<view class="submit-box-btn"></view>
      <view class="submit-btn"  @click="submitInvite">提交申请</view>
    </view> 


    <u-picker :show="addressObj.isShow" :columns="addressObj.list" keyName="address" @cancel="addressObj.isShow = false" @confirm="addressConfirm" />
    <!-- 城市弹窗 -->
    <u-picker :show="projectObj.isShow" :columns="projectObj.list" keyName="name" @cancel="projectObj.isShow = false" @confirm="projectObjConfirm" />
    <!-- 访客登记-拜访事由弹窗 -->
    <u-picker :show="registerObj.isShow" :columns="registerObj.list" keyName="name" @cancel="registerObj.isShow = false" @confirm="registerObjConfirm" />
    <!-- 日历 -->
    <u-calendar :show="startDateObj.isShow" mode="single" :maxDate="startDateObj.maxDate" @close="startDateObj.isShow = false" @confirm="startDateConfirm" />
    <u-toast ref="elToast" />
  </view>
</template>

<script>
import {mapGetters, mapMutations } from 'vuex'
import Utils from '@/js/utils'
import {isCardID} from '@/js/tool.js'
import { getOwnerBuildingListComm, findCompanyAuthInfoList, getVisitReason, getListByMap,saveVisitApproval, findLocations } from '@/service/community'
import { uploadMutiFile } from '@/service/landcrm'
import { insertDecpass } from '@/service/wxmanage'

export default {
  name: 'xydCompanyVisitApply',
  data() {
    const { MEMBER_ID, AREA_ID, PROJECT_ID, COMPLANY_ID, PROJECT_TYPE ,USER_TYPE } = this.$constant

    return {
      isTabShow: true,
      visitType:true,

      companyId: Utils.storageAction({ key: COMPLANY_ID, action: 'get' }),
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      projectType: Utils.storageAction({ key: PROJECT_TYPE, action: 'get' }),
      userTypes: Utils.storageAction({ key: USER_TYPE, action: 'get' }),
      authApplyInfoList:{   // '邀请访客'模块
        authVisitPersonName:'',     // 访客姓名
        authVisitPersonPhone:'',    // 访客手机号
				visitPersonIdCard:'',				// 访客证件号
				visitPersonPlate:'',				// 访客车牌号
        authPlanVisitTime:'',       // 计划拜访日期
        authVisitableNum: 99,        // 拜访次数
        authVisitReason: '',    //拜访事由
        authVisitReasonId: '',
      },
      authVisitReasonList:[     // '邀请访客'——拜访事由列表
       
      ], 
      authVisitReason:[],      // '邀请访客'——拜访事由
      ownerInfo: {  // 业主地址信息
        name: '',
        phone: '',
        add: ''
      },

      loading: false,
      showPositionValue: false,
      showToastValue: "",
      selectCity: {  // 城市
        cityName: ''
      },
      projects: [], // 项目列表
      project: [],  // 选中项目的值
      projectName:'', // 选中的项目名称
      showProjectPopup: false, 
      houseId: "", //  房号
      houseName: "", // 被访地址
      formModel: {   // '访客登记'模块
        toVisitPersonName:'',   // 被访人姓名
        toVisitPersonPhone:'',  // 被访人手机号
        visitPersonName: '',     // 访客姓名
        cityName: '',   //拜访城市
        projectName: '',  //拜访项目
        projectId: '', // 拜访项目id
        houseName: '',  //被访地址
        houseId: '',
        // visitPersonPhone:localStorage.ownerPhone||localStorage.phoneNumber||localStorage.contactPhone||'',    // 访客手机号
        visitPersonPhone: '',    // 访客手机号
        visitPersonIdCard: '',    // 访客证件号
        visitPersonPlate: '',    // 访客车牌号
        planVisitTime:'',       // 计划拜访日期
        visitableNum: 99,        // 拜访次数
        visitReason: '',  //拜访事由的值
        visitReasonId: '',  //拜访事由的值

      },
      visitReasonList:[  // '访客登记'——拜访事由列表
        // []
      ],  
      visitReason:[],      // '访客登记'——拜访事由     
      submitter:'',   // 提交人 
      contactName: '' ,  // localStorage.contactName 
      lsUserName:'',  // localStorage.userName
      lsNickname:'',  // localStorage.nickname
      lsFullName:'',  // localStorage.fullName
      dialogObject: { // 弹窗
        isShowDailog: false,
        isDoubleBtn: false
      },
      showVisNum:true,
      contactPhone: '', //操作人手机号

      addressObj: {
        isShow: false,
        list: [[]],
        value: ''
      },
      projectObj: {
        isShow: false,
        list: [[]],
        value: ''
      },
      registerObj: {
        isShow: false,
        list: [[]],
        value: ''
      },
      startDateObj: {
        isShow: false,
        maxDate: Utils.formatDate({ value: Utils.getFutureDate(365, 'back'), type: 's2d', format: 'YY-MM-DD' }),
        value: []
      },
      
      // 我的企业信息
      syProjectId: '',
      authCompanyInfo: {
        address: [],
        name: ''
      },
      //访客登记---公司
      companyInfo:{
        name:'',
        address:[]
      }, 
      submitter: '',
      selectedTabIndex: 0,
			userInfo:{},
    }
  },
  computed: {
    ...mapGetters('houseAuth', {
      getAuthInfo: 'getAuthInfo',
    }),
  },

  onLoad() {
    const { O_USER_INFO, USER_TYPE, USER_TYPE_NUM } = this.$constant
    let data = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
		this.userInfo = data || {}
    this.formModel.visitPersonPhone = data.ownerPhone || data.phoneNumber || data.contactPhone || '' 
    this.formModel.visitPersonName = data.contactName || data.userName || data.nickname || data.fullName || ''
		console.log(this.memberId,"memberId")
    this.contactPhone = data.ownerPhone || data.phoneNumber || data.contactPhone || '' 
    if(process.env.currProjectName == 'zhongjian'){
      this.showVisNum = false;
    }
    this.lsUserName = data.userName
    this.lsNickname = data.nickname
    this.lsFullName = data.fullName
    this.contactName = data.contactName || data.userName || data.nickname || data.fullName || ''

    // localStorage.userTypesNum   4:企业联系人  6：企业员工  其他：访客(会员或游客)
    // 如果是访客进来，就不显示 '邀请访客' 功能
    if(this.userTypes == '游客'){
        this.isTabShow = false
    }

    console.log(2222,this.getRepairsInfo)

    if(this.getRepairsInfo == null){
      this.loadAddress();
    }else{
      const {name,add,phone} = this.getRepairsInfo.ownerInfo
      this.ownerInfo = {
        name,add,phone
      }
    }
    
    let userTypesNum = Utils.storageAction({ key: USER_TYPE_NUM, action: 'get' });  // 当前身份  4:企业联系人  6：企业员工  其他：访客(会员或游客)
    console.log('userTypesNum===',userTypesNum)
    switch (userTypesNum) {
      case 4:
        this.submitter = 2
        break;
      case 6:
        this.submitter = 1
        break;
      default:
        this.submitter = ''
        this.visitType = false
        this.isTabShow = false  // 访客身份只显示 '访客身份' 这栏
        break;
    }

    this._getVisitQyReasor()
    // 房企认证
    this.getAuthCompanyList()
		// let carIfd = ''
		// console.log("isCardID('carIfd')-----------",isCardID(carIfd))
  },
  onShow() {
    //没有memberId,就去授权
    const { MEMBER_ID } = this.$constant
    let memberId = Utils.storageAction({ key: MEMBER_ID, action: 'get' })
    if(!memberId){
      uni.navigateTo({ url:'/pages-a/authorization/bindingMobile?type=1'});
      return
    }
    
    let data = this.getAuthInfo
    if (data.pageFrom == 'selectCity') {
      this.formModel.cityName = data.cityName
    }
    if (data.addrDetail) {
      this.formModel.houseName = data.addrDetail.addrstr
      this.formModel.houseId = data.addrDetail.houseId
    }
    let _this = this
    uni.$on('selectCompanyInfo',function(data){
      console.log('企业信息====',data)
      if (_this.visitType) {
        _this.authCompanyInfo = data 
      }else {
        _this.companyInfo = data 
      }
    })
  },
  methods: {
    ...mapMutations('houseAuth', [
      'saveAuthInfo',
      'clearAuthInfo'
    ]),
    addressConfirm({ indexs, value, values }) {
      this.addressObj.isShow = false
      if (indexs.length <= 0) return

      this.addressObj.value = indexs[0]
      this.formModel.userAddress = value[0].address
      this.formModel.ownerName = value[0].regName
      this.formModel.contactPhone = value[0].ownerPhones
    },
    // 项目-确定
    projectObjConfirm({ indexs, value, values }) {
      this.projectObj.isShow = false
      if (indexs.length <= 0) return

      this.formModel.projectName = value[0].name
      this.formModel.projectId = value[0].value
    },
    // 拜访事由 弹窗----确定
    registerObjConfirm({ indexs, value, values }) {
      this.registerObj.isShow = false
      if (indexs.length <= 0) return

      if (!this.visitType) {
        this.formModel.visitReason = value[0].name
        this.formModel.visitReasonId = value[0].value
      }else {
        this.authApplyInfoList.authVisitReason = value[0].name
        this.authApplyInfoList.authVisitReasonId = value[0].value
      }
    },

    startDateConfirm(val) {
      if (!this.visitType) {
        this.formModel.planVisitTime = val[0] 
      }else {
        this.authApplyInfoList.authPlanVisitTime = val[0]
      }
      this.startDateObj.isShow = false

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
      this.formModel.userAddress = list[0].address
      this.formModel.ownerName = list[0].regName
      this.formModel.contactPhone = list[0].ownerPhones
    },
    linkTo() {
      uni.navigateTo({ url: '/pages-c/goods-release/goods-release-list' })
    },
    // 切换
    tabChange(val){
      this.visitType = val
      // val? localStorage.setItem('visitType','') : localStorage.setItem('visitType','visitInvite')
    },
    // 选择城市
    goSelectCity(){
      uni.navigateTo({
        url: '/pages-b/house-info/city-index-list'
      });

      this.$router.push({path:'/selectCompany',query:{type:type}})
    },
    // 选择项目之前的处理
    SelectProject(){
      if (!this.formModel.cityName) {
        uni.showToast({
          title: '请先选择城市',
          icon: 'none'
        })
        return false
      }
      this.getProjects()
      this.projectObj.isShow = true
      // this.showProjectPopup = true
    },
    // 加载默认认证地址
    loadAddress() {
      let params = {
        data: {
          memberId: this.memberId,
          projectId: this.projectId,
          companyId: this.companyId
        },
        pathParams: '/1'
      }
      const pms = findLocations(params)
      return pms.then(res => {
        if (res.status === '200') {
          let list = res.data && res.data.authBuildings && Array.isArray(res.data.authBuildings) && res.data.authBuildings || [];
          list =list.filter(item =>{if(item.authType==1 || item.isEnterpriseHouse == 1) return item})
          list.forEach(item =>{
            if(item.isEnterpriseHouse == 1){
							let userData = this.userInfo
              let owner=userData.ownerPhone=="undefined" ? null : userData.ownerPhone
              let number=userData.phoneNumber=="undefined" ? null : userData.phoneNumber
              let contact=userData.contactPhone=="undefined" ? null : userData.contactPhone

              item.regNumber=owner || number || contact
            }
            return item
          })
          if (list.length) {
            let defaultAdd = null;
            list.some(item => {
              if (item.isDefault === 1) {
                defaultAdd = item;
                return true
              }
            });
            const {regNumber, regName, address, addrId, projectId, relateId, ownerId,authType} = defaultAdd === null ? list[0] : defaultAdd;
            this.ownerInfo = {
              name: regName,
              phone:regNumber,
              add: address,
              addrId,
              projectId,
              relateId,
              ownerId,
              authType:authType
            };
          }
        }
      })
    },
     // 获取拜访事由列表-----邀请访客
    _getVisitQyReasor(){
      let params = {
        data: {
          projectId: this.projectId,  // 项目id
          configCode: "CompanyVisitReason"    //编码，企业拜访：CompanyVisitReason
        }
      }
      getVisitReason(params).then(res => {
        if(res.status = 200){
          let reasonList = res.data
          this.registerObj.list = res.data?[[]]:[]
          for(let reason of reasonList){
            
            this.registerObj.list[0].push({
              name: reason.detailName,
              value:reason.detailId
            })
          }
        }
      })
    },
    // 获取拜访事由列表-----访客登记
    getVisitReasonList(){
      let params = {
        data: {
          projectId: this.formModel.projectId,  // 项目id
          configCode: "CompanyVisitReason"    // 编码，企业拜访：CompanyVisitReason
        }
      }
      getVisitReason(params).then(res => {
        if(res.status = 200){
          let reasonList = res.data
          this.registerObj.list = res.data?[[]]:[]
          for(let reason of reasonList){
            
            this.registerObj.list[0].push({
              name: reason.detailName,
              value:reason.detailId
            })
          }
        }
      })
    },
    // 获取项目列表
    getProjects() {
      // let { projectType } = commLogic.getProjectConfig();
      let params = {
        data: {
          cityName: this.formModel.cityName,
          projectType: this.projectId
        }
      };
      getListByMap(params)
        .then(res => {
          if (res.status === "200") {
            let proList = res.data
            this.projectObj.list = res.data ?[[]]:[];
            for(let pro of proList){
              this.projectObj.list[0].push({
                name: pro.projectName,
                value: pro.projectId
              })
            }
            
            console.log("this.projects-------",this.projectObj.list)
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    // 选择被访地址
    toChoiseHome(){
      if (!this.formModel.cityName) {
        uni.showToast({
          title: '请先选择城市',
          icon: 'none'
        })
        return
      }
      if (!this.projectObj.list[0]) {
        uni.showToast({
          title: '请先选择项目',
          icon: 'none'
        })
        return
      }
      // this.setCache(1); //设置缓存
      uni.navigateTo({
        url: `/pages-b/house-info/choose-houses?type=0&projectId=${this.formModel.projectId}`
      })      
    },
    // 打开访客登记-拜访事由
    async showRegister() {
      if (this.projectObj.list[0].length == 0) {
        uni.showToast({
          title: '请先选择项目',
          icon: 'none'
        })
        return
      }
      await this.getVisitReasonList()
      this.registerObj.isShow = true
    },
     // 打开邀请访客-拜访事由
    async showAuthRegister() {
      this.registerObj.isShow = true
    },
    // 获取拜访事由列表
    _getVisitReasonList(){
      let params = {
        projectId: this.projectId,  // 项目id
        configCode: "VisitReason"    // 编码，住宅拜访：VisitReason
      }
      getVisitReason(params).then(res => {
        if(res.status = 200){
          let reasonList = res.data
          this.authVisitReasonList = reasonList.length>0?[[]]:[];
          for(let reason of reasonList){
            this.authVisitReasonList[0].push({
              name: reason.detailName,
              value:reason.detailId
            })
          }
        }
      })
    },
		checkIDNumber (input) {
			console.log(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(input),"--------------")
			if(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(input)){
        return true;
      }
      else {
        return false;
      }
    },    
    // 访客登记--提交
    submitRegister(){
      if(this.formModel.toVisitPersonName == ''){
        uni.showToast({
          title: '请填写被访人姓名',
          icon: 'none'
        })
        return;
      }
      if(!Utils.checkPhone(this.formModel.toVisitPersonPhone)){
         uni.showToast({
          title: '请填写正确的被访人手机号',
          icon: 'none'
        })
        return;
      }
      if(this.formModel.visitPersonName == ''){
        uni.showToast({
          title: '请填写访客姓名',
          icon: 'none'
        })
        return;
      }
			if(!Utils.checkPhone(this.formModel.visitPersonPhone)){
			  uni.showToast({
			    title: '请填写正确的访客手机号',
			    icon: 'none'
			  })
			  return;
			}
			if(this.formModel.visitPersonIdCard == '' || !isCardID(this.formModel.visitPersonIdCard)){
			  uni.showToast({
			    title: '请填写正确的访客证件号',
			    icon: 'none'
			  })
			  return;
			}
      if(this.formModel.planVisitTime == ''){
        uni.showToast({
          title: '请填写拜访日期',
          icon: 'none'
        })
        return;
      }
      // if(process.env.currProjectName != 'zhongjian' && this.formModel.visitableNum == ''){
      //   uni.showToast({
      //     title: '请填写拜访次数',
      //     icon: 'none'
      //   })
      //   return;
      // }
      if(this.formModel.visitReasonId == ''){
        uni.showToast({
          title: '请选择拜访事由',
          icon: 'none'
        })
        return;
      }

      let params = {
        data: {
          toVisitPersonName: this.formModel.toVisitPersonName,   // 被访人姓名
          toVisitPersonPhone: this.formModel.toVisitPersonPhone,  // 被访人手机号
          toVisitCompanyId: this.companyInfo.id,    // 被访企业id
          toVisitCompanyName: this.companyInfo.name,  // 被访企业名称
          toVisitCompanyAddr: this.companyInfo.address[0],  // 企业详细地址 (选填)
          toVisitCompanyContactName: this.companyInfo.contactName,  // 企业联系人姓名
          toVisitCompanyContactPhone: this.companyInfo.contactPhone, // 企业联系人电话
          visitPersonId: this.memberId,  // 访客id
          visitPersonName: this.formModel.visitPersonName,     // 访客姓名
          visitPersonPhone: this.formModel.visitPersonPhone,    // 访客手机号
          visitPersonIdCard: this.formModel.visitPersonIdCard,    // 访客证件号
          carNum: this.formModel.visitPersonPlate,    // 访客车牌号
          planVisitTime: this.formModel.planVisitTime,       // 计划拜访日期
          visitableNum: this.formModel.visitableNum,        // 拜访次数
          creator: this.memberId,             // 操作人id
          creatorPhone: this.contactPhone,        // 操作人手机号
          creatorName: this.contactName,         // 操作人姓名
          configDetailId: this.formModel.visitReasonId,      // 访问事由的id
          companyId: this.companyId || '424',        // 公司id，业主端
          recordType: 1,                           // 提交类型，访客登记：1， 访客邀请：2
          projectId: this.companyInfo.projectId,  // 项目id
          visitType: 1,      // 拜访类型，1：企业， 2：住宅
          address: this.companyInfo.address[0],     // 拜访地址
					
        }
      }
      
      console.log("data-------",params.data);
      saveVisitApproval(params).then(res => {
        if(res.status == 200){
          uni.redirectTo({
            url: '/pages-d/visit-apply/myVisitorsRecordDetail?recordId='+res.data
          })
        }else{ 
          // this.$refs.elToast.show({
          //   type: 'success',
          //   message: res.message
          // })
        }
      })
    },
    // '邀请访客'——提交
    submitInvite(){ 
      if(this.authApplyInfoList.authVisitPersonName == ''){
        uni.showToast({
          title: '请填写访客姓名',
          icon: 'none'
        })
        return;
      }
      if(!Utils.checkPhone(this.authApplyInfoList.authVisitPersonPhone)){
        uni.showToast({
          title: '请填写正确的访客手机号',
          icon: 'none'
        })
        return;
      }
			if(this.authApplyInfoList.visitPersonIdCard == '' || !isCardID(this.authApplyInfoList.visitPersonIdCard)){
			  uni.showToast({
			    title: '请填写正确的访客证件号',
			    icon: 'none'
			  })
			  return;
			}
      if(this.authApplyInfoList.authPlanVisitTime == ''){
        uni.showToast({
          title: '请填写拜访日期',
          icon: 'none'
        })
        return;
      }
      // if(this.authApplyInfoList.authVisitableNum == ''){
      //   uni.showToast({
      //     title: '请填写拜访次数',
      //     icon: 'none'
      //   })
      //   return;
      // }
      if(this.authApplyInfoList.authVisitReasonId == ''){
        uni.showToast({
          title: '请选择拜访事由',
          icon: 'none'
        })
        return;
      }
      let params = {
        data: {
          toVisitPersonName: this.contactName,   // 被访人姓名
          toVisitPersonPhone: this.contactPhone,  // 被访人手机号
          toVisitCompanyId: this.authCompanyInfo.id,    // 被访企业id
          toVisitCompanyName: this.authCompanyInfo.name,  // 被访企业名称
          toVisitCompanyAddr: this.authCompanyInfo.address[0],  // 企业详细地址 (选填)
          toVisitCompanyContactName: this.authCompanyInfo.contactName,  // 企业联系人姓名
          toVisitCompanyContactPhone: this.authCompanyInfo.contactPhone, // 企业联系人电话
          toVisitCompanyProjectId: this.authCompanyInfo.projectId,    // 被访企业所属项目id
          visitPersonId:'',  // 访客id
          visitPersonName: this.authApplyInfoList.authVisitPersonName,     // 访客姓名
          visitPersonPhone: this.authApplyInfoList.authVisitPersonPhone,    // 访客手机号
          visitPersonPhone: this.authApplyInfoList.visitPersonIdCard,    // 访客证件号
          carNum: this.authApplyInfoList.visitPersonPlate,    // 访客车牌号
          planVisitTime: this.authApplyInfoList.authPlanVisitTime,       // 计划拜访日期
          visitableNum: this.authApplyInfoList.authVisitableNum,        // 拜访次数
          pushType: this.submitter,           // 提交人  访客：null，企业员工：1，企业联系人：2
          creator: this.memberId,             // 操作人id
          creatorPhone: this.contactPhone,        // 操作人手机号
          creatorName: this.contactName,         // 操作人姓名
          configDetailId: this.authApplyInfoList.authVisitReasonId,      // 访问事由的id
          companyId: this.companyId || '424',        // 公司id，业主端
          recordType: 2,                           // 提交类型，访客登记：1， 访客邀请：2
          projectId: this.projectId,  // 项目id
          visitType: 1,      // 拜访类型，1：企业， 2：住宅
          address: this.authCompanyInfo.address[0],     // 拜访地址
        }
      }
      
      console.log("data-----",params.data); 
      saveVisitApproval(params).then(res => {
        if(res.status == 200){
					uni.redirectTo({
					  url: '/pages-d/visit-apply/myVisitorsRecordDetail?recordId='+res.data
					})
        }else{
          uni.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })

    },
    //获取已认证公司列表
    getAuthCompanyList(){
      let params={
        memberId: this.memberId,
        applyStatus: 9,  //申请记录状态(9查询所有已通过的申请记录)
        companyId: this.companyId,
      };
      findCompanyAuthInfoList(params).then(res =>{
        if(res.status == "200"){
          let arr =res.data
          let list=[]
          arr.forEach(item => {
            const {companyLinkman, companyLinkmanPhone, enterpriseName, enterpriseId, projectId, projectName, enterpriseAddress  }=item
            const obj={
              contactName: companyLinkman,
              contactPhone: companyLinkmanPhone,
              id: enterpriseId,
              name: enterpriseName,
              projectId: projectId,
              projectName: projectName,
              address: enterpriseAddress ? enterpriseAddress.substring(1, enterpriseAddress.length-1).split(","): []
            }
            list.push(obj)
          }); 
          this.syProjectId = list[0].projectId;
          this.authCompanyInfo = list[0] 
          console.log("获取列表中的authCompanyInfo",this.authCompanyInfo);
        }
      })
    },
    // 选择企业
    goSelectCompany(type){
      // this.setCache()
      this.selectType = type
      uni.navigateTo({
        url: `/pages-d/enterprise-info/select-company?type=${type}` //1为申请加入公司，2邀请员工时选择公司（邀请人已认证的公司）
      });
    },
  }
}
</script>