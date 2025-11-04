<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="tab-group" v-if="isTabShow">
      <view class="item" :class="{selectedTabClass:visitType}" @click="tabChange(true)">
        <text :class="{tab_botton:visitType}">访客登记</text>
      </view>
      <view class="item" v-if="existProperty" :class="{selectedTabClass:!visitType}" @click="tabChange(false)">
        <text :class="{tab_botton:!visitType}">邀请访客</text>
      </view>
    </view>
    <!-- 访客登记 -->
    <view v-show="visitType">
      <!-- 用户信息表单 -->
      <view class="title-container">请填写拜访的业主信息</view>
      <u-form labelPosition="left" :model="formModel" ref="elFormUser" labelWidth="112px" class="ufrom">
        <u-form-item prop="toVisitPersonName">
          <text slot="label">被访人姓名<text class="icon_x">*</text></text>
          <u-input v-model="formModel.toVisitPersonName" placeholder="请填写被访问人姓名" border="none" inputAlign="right" clearable/>
        </u-form-item>
        <u-form-item prop="toVisitPersonName">
          <text slot="label">被访人手机号<text class="icon_x">*</text></text>
          <u-input v-model="formModel.toVisitPersonPhone" placeholder="请填写被访问人手机号" border="none" inputAlign="right" :maxlength="11" clearable/>
        </u-form-item>
        <u-form-item prop="cityName">
          <text slot="label">城市<text class="icon_x">*</text></text>
          <u-input 
            class="input-box" 
            readonly
            @click.native="goSelectCity()" 
            clearable 
            type="text" 
            placeholder="请选择" 
            border="none"
            inputAlign="right"
            v-model="formModel.cityName"/>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        <u-form-item prop="projectName">
          <text slot="label">项目<text class="icon_x">*</text></text>
          <u-input 
            class="input-box" 
            readonly
            @click.native="SelectProject()" 
            clearable 
            type="text" 
            placeholder="请选择" 
            border="none"
            inputAlign="right"
            v-model="formModel.projectName"/>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        <u-form-item prop="projectName">
          <text slot="label">被访地址<text class="icon_x">*</text></text>
          <u-input 
            class="input-box" 
            readonly
            @click.native="toChoiseHome()" 
            clearable 
            type="text" 
            placeholder="请选择" 
            border="none"
            inputAlign="right"
            v-model="formModel.houseName"/>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        
      </u-form>

      <u-gap height="10" bgColor="#f5f5f5" />

      <!-- 物品详情表单 -->
      <view class="title-container">访客信息</view>
      <u-form labelPosition="left" :model="formModel" ref="elFormGoods" labelWidth="112px"  class="ufrom">
        <u-form-item prop="visitPersonName">
          <text slot="label">访客姓名<text class="icon_x">*</text></text>
          <u-input v-model="formModel.visitPersonName" placeholder="请填写访客姓名" border="none" inputAlign="right" clearable style="padding-right: 20rpx;" readonly/>
        </u-form-item>
        <u-form-item prop="visitPersonPhone">
          <text slot="label">访客手机号<text class="icon_x">*</text></text>
          <u-input v-model="formModel.visitPersonPhone" type="number" placeholder="请填写访客手机号" border="none" inputAlign="right" clearable style="padding-right: 20rpx;" :readonly="havePhone"/>
        </u-form-item>
        <u-form-item prop="planVisitTime" @click="startDateObj.isShow = true">
          <text slot="label">拜访日期<text class="icon_x">*</text></text>
          <u-input v-model="formModel.planVisitTime" disabled disabledColor="#ffffff" placeholder="请选择拜访日期" inputAlign="right" border="none" />
          <u-icon slot="right" name="arrow-right" />
        </u-form-item>
        <u-form-item prop="visitableNum">
          <text slot="label">拜访次数<text class="icon_x">*</text></text>
          <u-number-box :min="1" v-model="formModel.visitableNum" inputAlign="right" style="margin-left: 320rpx;"></u-number-box>
        </u-form-item>
        <u-form-item prop="visitReason">
          <text slot="label">拜访事由<text class="icon_x">*</text></text>
          <u-input 
            class="input-box" 
            readonly
            @click.native="showRegister" 
            clearable 
            type="text" 
            placeholder="请选择" 
            border="none"
            inputAlign="right"
            v-model="formModel.visitReason"/>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </u-form>
      <view class="footer-panel">
        <view class="submit-btn" @click="submitRegister">提交申请</view>
        <u-safe-bottom />
      </view>
    </view>
    <view v-show="!visitType">
      <view class="title-container">请填写访客信息</view>
      <u-form labelPosition="left" :model="authApplyInfoList" ref="elFormUser" labelWidth="112px" class="ufrom">
        <u-form-item prop="authVisitPersonName">
          <text slot="label">访客姓名<text class="icon_x">*</text></text>
          <u-input v-model="authApplyInfoList.authVisitPersonName" placeholder="请填写被访问人姓名" border="none" inputAlign="right" clearable/>
        </u-form-item>
        <u-form-item prop="authVisitPersonPhone">
          <text slot="label">访客手机号<text class="icon_x">*</text></text>
          <u-input v-model="authApplyInfoList.authVisitPersonPhone" placeholder="请填写被访问人手机号" border="none" inputAlign="right" :maxlength="11" clearable/>
        </u-form-item>
        <u-form-item prop="authPlanVisitTime" @click="startDateObj.isShow = true">
          <text slot="label">拜访日期<text class="icon_x">*</text></text>
          <u-input v-model="authApplyInfoList.authPlanVisitTime" disabled disabledColor="#ffffff" placeholder="请选择拜访日期" inputAlign="right" border="none" />
          <u-icon slot="right" name="arrow-right" />
        </u-form-item>
        <u-form-item prop="authVisitableNum">
          <text slot="label">拜访次数<text class="icon_x">*</text></text>
          <u-number-box :min="1" v-model="authApplyInfoList.authVisitableNum" inputAlign="right" style="margin-left: 320rpx;"></u-number-box>
        </u-form-item>
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
            v-model="authApplyInfoList.authVisitReason"/>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </u-form>
      <view class="title-container">我的信息</view>
      <u-form labelPosition="left" :model="ownerInfo" ref="elFormUser" labelWidth="112px" class="ufrom">
        <u-form-item label="联系人" prop="name" @click="selectAddress">
          <text style="width: 100%; text-align: right;">{{ ownerInfo.name }}</text>
        </u-form-item>
        <u-form-item label="联系电话" prop="phone" @click="selectAddress">
          <text style="width: 100%; text-align: right;">{{ ownerInfo.phone }}</text>
        </u-form-item>
        <u-form-item label="联系地址" prop="add" @click="selectAddress">
          <text style="width: 100%; text-align: right;">{{ ownerInfo.add }}</text>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </u-form>
      <view class="footer-panel">
        <view class="submit-btn"  @click="submitInvite">提交申请</view>
        <u-safe-bottom />
      </view>
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
import commLogic from '@/js/comm-logic';
import Utils from '@/js/utils'
import { getOwnerBuildingListComm, getUserRole, getVisitReason, getListByMap,saveVisitApproval, findLocations } from '@/service/community'
import { uploadMutiFile } from '@/service/landcrm'
import { insertDecpass } from '@/service/wxmanage'
import { getDictDetailList } from '@/service/returnVisit'
import { getDictDetail } from '@/service/landcrm'
export default {
  name: 'AddGoodsRelease',
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
        authPlanVisitTime:'',       // 计划拜访日期
        authVisitableNum: 1,        // 拜访次数
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

      isTabShow: true, 
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
        planVisitTime:'',       // 计划拜访日期
        visitableNum: 1,        // 拜访次数
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
      dialogTips: '', // 弹窗提示语
      showVisNum:true,
      contactPhone: '', //操作人手机号

      formRules: {
        userAddress: { type: 'string', required: true, message: '请选择房源地址' },
        ownerName: { type: 'string', required: true, message: '请填写完整' },
        contactPhone: [
          { type: 'string', required: true, message: '请填写完整' },
          { validator: (rule, value, callback) => uni.$u.test.mobile(value), message: '手机号码不正确' }
        ],
        companyName: { type: 'string', required: true, message: '请填写完整' },
        releaseName: { type: 'string', required: true, message: '请填写完整' },
        releasePhone: [
          { type: 'string', required: true, message: '请填写完整' },
          { validator: (rule, value, callback) => uni.$u.test.mobile(value), message: '手机号码不正确' }
        ],
        releaseIdCard: [
          { type: 'string', required: true, message: '请填写完整' },
          { validator: (rule, value, callback) => uni.$u.test.idCard(value), message: '身份证格式错误' }
        ],
        startTime: { type: 'string', required: true, message: '请选择' },
      },
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
      havePhone: '',
      canLoadVuexCache: false,
      existProperty: false
    }
  },
  computed: {
    ...mapGetters('houseAuth', {
      getAuthInfo: 'getAuthInfo',
    }),
    
  },
  created() {
    const { O_USER_INFO, USER_TYPE } = this.$constant
    let data = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
    const visitPersonPhone =  data.ownerPhone || data.phoneNumber || data.contactPhone || ''
    this.havePhone = visitPersonPhone
    this.formModel.visitPersonPhone = visitPersonPhone
    this.formModel.visitPersonName = data.contactName || data.userName || data.nickname || data.fullName

    this.contactPhone = data.ownerPhone || data.phoneNumber || data.contactPhone || '' 
    if(process.env.currProjectName == 'zhongjian'){
      this.showVisNum = false;
    }
    this.lsUserName = data.userName
    this.lsNickname = data.nickname
    this.lsFullName = data.fullName
    this.contactName = data.contactName

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
    

    this.getVisitReasonList()
  },
  onShow() {
    // 访客登记
    let data = this.getAuthInfo
    if (data.pageFrom == 'selectCity') {
      // 选择城市
      this.formModel.cityName = data.cityName

      // 重置项目和房产地址
      this.formModel.projectName = ''
      this.formModel.projectId = ''
      this.formModel.houseName = ''
      this.formModel.houseId = ''
    } else if (data.pageFrom == 'selectAddr') {
      // 选择房产地址
      this.formModel.houseName = data.addrDetail.addrstr
      this.formModel.houseId = data.addrDetail.houseId
    }
    console.log('this.getAuthInfo====',data)
    this.toAuth()
    // 邀请访客
    const repairsInfo = this.getRepairsInfo
    if (repairsInfo && this.canLoadVuexCache) {
      this.canLoadVuexCache = false
      this.ownerInfo = {
        name: repairsInfo.ownerInfo?.name ?? '',
        phone: repairsInfo.ownerInfo?.phone ?? '',
        add: repairsInfo.ownerInfo?.add ?? '',
        ownerId: repairsInfo.ownerInfo?.ownerId ?? '',
        projectId: repairsInfo.ownerInfo?.projectId ?? '',
        addrId: repairsInfo.ownerInfo?.addrId ?? '',
      }
    }
  },
  beforeDestroy() {
    this.clearAuthInfo()
  },
  methods: {
    ...mapMutations('houseAuth', [
      'saveAuthInfo',
      'clearAuthInfo'
    ]),
    ...mapMutations('repair', [
			  'clearRepairsInfo',
			  'saveRepairsInfo'
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

      // 重置房产地址
      this.formModel.houseName = ''
      this.formModel.houseId = ''
    },
    // 拜访事由 弹窗----确定
    registerObjConfirm({ indexs, value, values }) {
      this.registerObj.isShow = false
      if (indexs.length <= 0) return

      if (this.visitType) {
        this.formModel.visitReason = value[0].name
        this.formModel.visitReasonId = value[0].value
      }else {
        this.authApplyInfoList.authVisitReason = value[0].name
        this.authApplyInfoList.authVisitReasonId = value[0].value
      }
    },

    startDateConfirm(val) {
      if (this.visitType) {
        this.formModel.planVisitTime = val[0] 
      }else {
        this.authApplyInfoList.authPlanVisitTime = val[0]
      }
      this.startDateObj.isShow = false

    },
    // 上传图片
    async uploadPic(event) {
      const fileList = {
        ...event.file,
        status: 'uploading',
        message: '上传中',
      }
      this.formModel.fileList.push(fileList)

      const res = await uploadMutiFile(fileList.url)
      const fileInfo = res.fileInfo

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
      this.formModel.fileList.splice(event.index, 1)
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
    /**添加物品 */
    addGoodsItem() {
      this.formModel.goodsList.push({ itemName: '', itemNum: '' })
    },
    /**删除物品 */
    delGoodsItem(index) {
      this.formModel.goodsList.splice(index, 1)
    },
    async handleSubmit() {
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
        companyName: this.companyName,
        items: JSON.stringify(this.formModel.goodsList),
        notePicture: JSON.stringify(this.formModel.fileList.map(item => item.url))
      }
      const res = await insertDecpass(params)
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
    },
    linkTo() {
      uni.navigateTo({ url: '/pages-c/goods-release/goods-release-list' })
    },
    // 切换
    tabChange(val){
      this.visitType = val
    },
    // 选择城市
    goSelectCity(){
      uni.navigateTo({
        url: '/pages-b/house-info/city-index-list'
      });
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
              let owner=localStorage.ownerPhone=="undefined" ? null : localStorage.ownerPhone
              let number=localStorage.phoneNumber=="undefined" ? null : localStorage.phoneNumber
              let contact=localStorage.contactPhone=="undefined" ? null : localStorage.contactPhone

              item.regNumber=owner || number || contact
            }
            return item
          })
          if (list.length) {
            this.existProperty = true
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
    // 获取拜访事由列表-----访客登记
    // getVisitReasonList() {
    //   // let projectId = this.project[0];
    //   // if(!projectId){
    //   //   this.showToast("请先选择项目");
    //   //   return;
    //   // }
    //   const companyId = this.$appConfig.COMPLANY_ID
    //   const params = {
    //     data: {
    //       companyId,
    //       dictCode: 'visitReason' // 编码，住宅拜访：visitReason
    //     }
    //   }
    //   getDictDetailList(params).then(res => {
    //     if(res.status = 200){
    //       const reasonList = res.data || []
    //       this.registerObj.list[0] = reasonList.map(item => ({
    //         name: item.detailName,
    //         value: item.detailId
    //       }))
    //     }
    //   })
    // },

    //configCode字典：VisitReason-住宅拜访 CompanyVisitReason-企业拜访
     // 获取拜访事由列表-----访客登记
    //  getVisitReasonList(){
    //   let params = {
    //     data: {
    //       projectId:  this.formModel.projectId || this.projectId,  // 项目id
    //       configCode: "VisitReason"    // 编码，住宅拜访：VisitReason
    //     }
    //   }
    //   getVisitReason(params).then(res => {
    //     if(res.status = 200){
    //       let reasonList = res.data
    //       this.registerObj.list = res.data?[[]]:[]
    //       for(let reason of reasonList){
            
    //         this.registerObj.list[0].push({
    //           name: reason.detailName,
    //           value:reason.detailId
    //         })
    //       }
    //     }
    //   })
    // },

    getVisitReasonList(){
        var params = {
                data: {
                    dictCode: 'visitReason'
                },
                "hideLoading": true,
                responseToast: false
            }
            getDictDetail(params).then(res => {
                if (res.resultCode == 200) {
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
      let { projectType } = commLogic.getProjectConfig();
      let params = {
        data: {
          cityName: this.formModel.cityName,
          projectType: projectType
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
      // if (this.projectObj.list[0].length == 0) {
      //   uni.showToast({
      //     title: '请先选择项目',
      //     icon: 'none'
      //   })
      //   return
      // }
      await this.getVisitReasonList()
      this.registerObj.isShow = true
    },
     // 打开邀请访客-拜访事由
    async showAuthRegister() {
      // await this.getVisitReasonList()
      this.registerObj.isShow = true
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
      if(this.formModel.toVisitPersonPhone == ''){
         uni.showToast({
          title: '请填写被访人手机号',
          icon: 'none'
        })
        return;
      }
      if(this.formModel.cityName == ''){
        uni.showToast({
          title: '请选择城市',
          icon: 'none'
        })
        return;
      }
      if(this.formModel.projectName == ''){
        uni.showToast({
          title: '请选择项目',
          icon: 'none'
        })
        return;
      }
      if(this.formModel.houseName == ''){
        uni.showToast({
          title: '请选择被访地址',
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
      if(this.formModel.visitPersonPhone == ''){
        uni.showToast({
          title: '请填写访客手机号',
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
      if(process.env.currProjectName != 'zhongjian' && this.formModel.visitableNum == ''){
        uni.showToast({
          title: '请填写拜访次数',
          icon: 'none'
        })
        return;
      }
      if(this.formModel.visitReasonId == ''){
        uni.showToast({
          title: '请选择拜访事由',
          icon: 'none'
        })
        return;
      }

      let address = this.formModel.cityName + '-' + this.formModel.projectName + '-' + this.formModel.houseName
      const companyIda = this.$appConfig.COMPLANY_ID
      let params = {
        data: {
          toVisitPersonName: this.formModel.toVisitPersonName,   // 被访人姓名
          toVisitPersonPhone: this.formModel.toVisitPersonPhone,  // 被访人手机号
          visitPersonId: this.memberId,  // 访客id
          visitPersonName: this.formModel.visitPersonName,     // 访客姓名
          visitPersonPhone: this.formModel.visitPersonPhone,    // 访客手机号
          planVisitTime: this.formModel.planVisitTime,       // 计划拜访日期 
          creator: this.memberId,             // 操作人id
          creatorPhone: this.contactPhone,        // 操作人手机号
          creatorName: this.contactName||this.lsUserName||this.lsNickname||this.lsFullName,         // 操作人姓名
          configDetailId: this.formModel.visitReasonId,      // 访问事由的id
          companyId: companyIda,        // 公司id，业主端
          recordType: 1,                      // 提交类型，访客登记：1， 访客邀请：2
          projectId: this.formModel.projectId,  // 项目id
          address: address,     // 拜访地址
          addrId: this.formModel.houseId,   // 房间id
          visitType: 2,      // 拜访类型，1：企业， 2：住宅
        },
        responseToast: false
      }
       // creatorName creatorPhone，两字段且有值方传，否两都不传
       const validCreator = this.contactPhone &&  params.data.creatorName
      if (!validCreator) {
        delete params.data.creatorPhone
        delete params.data.creatorName
      }

      if(process.env.currProjectName != 'zhongjian'){
          params.data.visitableNum = this.formModel.visitableNum; // 拜访次数
      }
      
      console.log("data-------",params.data);
      saveVisitApproval(params).then(res => {
        if(res.status == 200){
          this.$refs.elToast.show({
            type: 'success',
            message: '登记成功'
          })
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/service/service'
            })
          }, 1000)
        }else{ 
          this.$refs.elToast.show({
            type: 'success',
            message: res.message
          })
        }
      })
    },
    // '邀请访客'——提交
    submitInvite(){ 
      if(this.authApplyInfoList.authVisitPersonName == ''){
        uni.showToast({
          title: '请填写被访问人姓名',
          icon: 'none'
        })
        return;
      }
      if(this.authApplyInfoList.authVisitPersonPhone == ''){
        uni.showToast({
          title: '请填写被访问人手机号',
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
      if(this.authApplyInfoList.authVisitableNum == ''){
        uni.showToast({
          title: '请填写拜访次数',
          icon: 'none'
        })
        return;
      }
      if(this.authApplyInfoList.authVisitReasonId == ''){
        uni.showToast({
          title: '请选择拜访事由',
          icon: 'none'
        })
        return;
      }
      console.log('this.ownerInfo',this.ownerInfo)
      const companyIda = this.$appConfig.COMPLANY_ID
      let params = {
        data: {
          toVisitPersonId: this.ownerInfo.ownerId, // 被访人id
          toVisitPersonName: this.ownerInfo.name,   // 被访人姓名
          toVisitPersonPhone: this.ownerInfo.phone,  // 被访人手机号
          visitPersonName: this.authApplyInfoList.authVisitPersonName,     // 访客姓名
          visitPersonPhone: this.authApplyInfoList.authVisitPersonPhone,    // 访客手机号
          planVisitTime: this.authApplyInfoList.authPlanVisitTime,       // 计划拜访日期
          visitableNum: this.authApplyInfoList.authVisitableNum,        // 拜访次数
          pushType: 1,           // 提交人  住宅拜访的访客邀请传1
          creator: this.memberId,             // 操作人id
          creatorPhone: this.contactPhone,        // 操作人手机号
          creatorName: this.contactName||this.lsUserName||this.lsNickname||this.lsFullName,         // 操作人姓名
          configDetailId: this.authApplyInfoList.authVisitReasonId,      // 访问事由的id
          companyId: companyIda,        // 公司id，业主端
          recordType: 2,                           // 提交类型，访客登记：1， 访客邀请：2
          projectId: this.ownerInfo.projectId,  // 项目id
          address: this.ownerInfo.add,     // 拜访地址
          addrId: this.ownerInfo.addrId,   // 房间id
          visitType: 2,      // 拜访类型，1：企业， 2：住宅
        },
        responseToast: false
      }
      
      console.log("data-----",params.data); 
      saveVisitApproval(params).then(res => {
        if(res.status == 200) {
          this.$refs.elToast.show({
            type: 'success',
            message: '提交成功'
          })
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/service/service'
            })
          }, 1000)
        }else{
          this.$refs.elToast.show({
            type: 'error',
            message: res.message || '提交失败'
          })
        }
      }).catch(err => {
        this.$refs.elToast.show({
          type: 'error',
          message: '提交超时，请重试'
        })
      })

    },
    // 选择业主的房产地址
    selectAddress() {
      this.canLoadVuexCache = true
      uni.navigateTo({
        url:'/pages-b/house-info/auth-address-list?page=reportingRorRepairs&taskType=2'
      })
    },
    // 授权绑定
    toAuth() {
      const { PROGRAM_TYPE } = this.$appConfig
      const { O_USER_INFO } = this.$constant
      const userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const h5 = ['wechat', 'appH5'].includes(PROGRAM_TYPE)
      if (userInfo) {
        const {STRG_phone = '', STRG_wxUserName = '', nickname = ''} = userInfo
        const d = {
          visitPersonPhone: STRG_phone,
          visitPersonName: nickname || STRG_wxUserName 
        }
        this.contactPhone = STRG_phone
        Object.assign(this.formModel, d)
      } else {
        uni.navigateTo({ url: h5 ? '/pages-a/authorization/bindingMobile' : '/pages-a/authorization/bindingMobile' })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  background-color: #f5f5f5;
}
.form-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  height: 38px;
  line-height: 1;
  font-weight: bold;
  padding-left: 20px;

  &::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 18px;
    background-color: var(--app-primary-color);
    margin-right: 2px;
  }
}
.cell-border {
  border-bottom: 1px solid #D9D9D9;
}
::v-deep .u-form-item {
  background-color: #fff;
  padding: 0 30rpx;
  box-sizing: border-box;
}
::v-deep .u-number-box {
  justify-content: flex-end;
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
.u-upload {
  padding: 8px 8px 0;
}

.tab-group {
  width: 100%;
  height: 80rpx;
  display: flex;

  .item {
    flex: 1;
    height: 100%;
    background-color: #D7D7D7;
    line-height: 80rpx;
    font-size: 28rpx;
    color: #999999;
    text-align: center;
    
  }

  .selectedTabClass {
    background-color: #fff;
    color: var(--app-primary-color); 
    
  }
}

.title-container {
  padding: 30rpx;
  font-size: 28rpx;
}

.ufrom {
  background: #fff;
}

.icon_x {
  color: var(--app-primary-color);
  margin-left: 6rpx;
}
.footer-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  z-index: 2;
}
.submit-btn {
  background-color: var(--app-primary-color); 
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  color: whitesmoke;
}
</style>