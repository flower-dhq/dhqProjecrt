<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="page-bg" />

    <!-- 个人信息 -->
    <view class="pd-20 form-panel">
      <cell-text class="cell-title" :label="formType === 'invite' ? '访客信息' : '您的信息'" labelColor="#333"/>
      <cell-text label="姓名*" :labelWidth="80" padding="12px 0" labelColor="#666" isDesc>
        <u--input :placeholder="formType === 'invite' ? '请填写访客姓名' : '请填写您的姓名'" border="none" v-model="formObj.visitPersonName" />
      </cell-text>
      <!-- <cell-text label="手机*" :labelWidth="80" padding="12px 0" labelColor="#666" @click.native="openPhoneModal('user')">
        <text :class="{ 'gray-text': !formObj.visitPersonPhone }">{{ formObj.visitPersonPhone || (formType === 'invite' ? '请填写访客手机号码' : '请填写您的手机号码') }}</text>
      </cell-text> -->
			<cell-text label="手机*" :labelWidth="80" padding="12px 0" labelColor="#666">
				<u--input type="number" :placeholder="(formType === 'invite' ? '请填写访客手机号码' : '请填写您的手机号码')" border="none" v-model="formObj.visitPersonPhone" @change="changeNum($event,'user')"/>
			</cell-text>
      <cell-text label="日期*" :labelWidth="80" padding="12px 0" isRight @click.native="dateObj.isShow = true" labelColor="#666">
        <text :class="{ 'gray-text': !formObj.planVisitTime }">{{ formObj.planVisitTime || '请选择日期' }}</text>
        <u-icon slot="right" name="arrow-right" />
      </cell-text>
      <cell-text label="事由*" :labelWidth="80" padding="12px 0" border="none" labelColor="#666" isDesc>
          <u-radio-group slot="desc" placement="row" :value="formObj.configDetailId" @change="radioChange">
            <u-radio v-for="item in visitReasonList" :key="item.detailId" :activeColor="THEME_COLOR" :label="item.detailName" :name="item.detailId" />
          </u-radio-group>
      </cell-text>
    </view>

    <!-- 被访人信息 -->
    <view class="pd-20 form-panel" v-if="formType === 'regist'">
      <cell-text class="cell-title" label="被访人信息" labelColor="#333" labelWidth="100px" />
      <cell-text label="姓名*" :labelWidth="80" padding="12px 0" labelColor="#666">
        <u--input placeholder="请填写被访人姓名" border="none" v-model="formObj.toVisitPersonName" />
      </cell-text>
      <!-- <cell-text label="手机*" :labelWidth="80" padding="12px 0" labelColor="#666" border="none" @click.native="openPhoneModal('toVisit')">
        <text :class="{ 'gray-text': !formObj.toVisitPersonPhone }">{{ formObj.toVisitPersonPhone || '请填写被访人手机号' }}</text>
      </cell-text> -->
			<cell-text label="手机*" :labelWidth="80" padding="12px 0" labelColor="#666" border="none">
				<u--input type="number" placeholder="请填写被访人手机号" border="none" v-model="formObj.toVisitPersonPhone" @change="changeNum($event,'toVisit')"/>
			</cell-text>
    </view>

    <!-- 同行人信息 -->
    <view class="pd-20 form-panel">
      <cell-text class="cell-title" label="同行人信息" labelColor="#333" labelWidth="100px" />
      <block v-for="(item, index) in formObj.fellowPerson" :key="index">
        <cell-text :labelWidth="0" isRight>
          <u-tag :text="index + 1" size="mini" shape="circle" />
          <u-icon slot="right" name="trash-fill" size="20" color="#f56c6c" @click="delFellow(index)" />
        </cell-text>
        <cell-text label="姓名" :labelWidth="80" padding="12px 0" labelColor="#666">
          <u--input placeholder="请填写同行人姓名" border="none" v-model="item.fellowPersonName" />
        </cell-text>
        <!-- <cell-text label="手机号" :labelWidth="80" padding="12px 0" labelColor="#666" @click.native="openPhoneModal('fellow', index)">
          <text :class="{ 'gray-text': !item.fellowPersonPhone }">{{ item.fellowPersonPhone || '请填写同行人手机号' }}</text>
        </cell-text> -->
				<cell-text label="手机号" :labelWidth="80" padding="12px 0" labelColor="#666">
					<u--input type="number" placeholder="请填写同行人手机号" border="none" v-model="item.fellowPersonPhone" @change="changeNum($event,'fellow',index)"/>
				</cell-text>
      </block>
      <cell-text class="add-btn" :labelWidth="0" padding="12px 0" border="none" contentAlign="center" @click.native="addFellow">
        <u-icon name="plus-circle" :color="THEME_COLOR" />
        <text :style="[{color: THEME_COLOR}]">新增同行人信息</text>
      </cell-text>
    </view>

    <!-- 车牌号 -->
    <view class="pd-20 form-panel">
      <cell-text class="cell-title" label="车牌号" labelColor="#333" labelWidth="100px" />
      <view v-for="(item, index) in formObj.carNum" :key="index" class="car-all-box">
        <cell-text :labelWidth="0" isRight>
          <u-tag :text="index + 1" size="mini" shape="circle" />
          <u-icon slot="right" name="trash-fill" size="20" color="#f56c6c" @click="delCarNum(index)" />
        </cell-text>
        <cell-text label="车牌号" :labelWidth="80" padding="12px 0" labelColor="#666" @click.native="openCarModal(index)">
          <text :class="{ 'gray-text': !item }">{{ item || '请填写车牌号' }}</text>
        </cell-text>
				<view class="carNumber" :class="'carNumber'+index"></view>
      </view>
      
      <cell-text class="add-btn" :labelWidth="0" padding="12px 0" border="none" contentAlign="center" @click.native="addCarNum">
        <u-icon name="plus-circle" :color="THEME_COLOR" />
        <text :style="[{color: THEME_COLOR}]">新增车牌号</text>
      </cell-text>
    </view>

    <view class="footer-bottom">
      <u-button text="提交申请" shape="circle" type="primary" :customStyle="{ margin: '40px 0px ' + getKeyboardHeight }" @click="handleSubmit" />
    </view>
		
    <view class="keyboard-pd" :class="carObj.isShow?'':'hideView'"></view>
		
    <u-calendar :show="dateObj.isShow" mode="single" :maxDate="dateObj.maxDate" @close="dateObj.isShow = false" @confirm="dateConfirm" closeOnClickOverlay />
    <u-keyboard
      mode="number" dotDisabled :show="phoneObj.isShow"
      :showTips="false" safeAreaInsetBottom
      @change="phoneValChange" @backspace="phoneDel" @close="phoneCancel"
      @cancel="phoneCancel" @confirm="phoneObj.isShow = false"
    />
    <u-keyboard
      mode="car" :show="carObj.isShow" :showTips="false"
      safeAreaInsetBottom @change="carValChange"
      @backspace="carDel" @close="carCancel" @cancel="carCancel"
      @confirm="carObj.isShow = false"
    />
    <u-toast ref="elToast" />
  </view>
</template>

<script>
import CellText from '@/components/cell-text/cell-text'
import Utils from '@/js/utils'
import commLogic from '@/js/comm-logic'
import { getVisitReason, saveVisitApproval, getOwnerBuildingListComm } from '@/service/community'

/**
 * query: type
 */
export default {
  name: 'VisitRegist',
  components: {
    CellText
  },
  data() {
    const { MEMBER_ID, PROJECT_ID, O_USER_INFO } = this.$constant
    const userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' })

    return {
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      companyId: commLogic.getProjectConfig().companyId,
      formType: 'regist', // regist: 访客登记,  invite: 邀请访客
      formObj: {
        fullName: userInfo.fullName || userInfo.STRG_realName || '',
        address: '',
        visitPersonName: '',
        visitPersonPhone: userInfo.ownerPhone || userInfo.phoneNumber || userInfo.contactPhone || '',
        planVisitTime: '',
        toVisitPersonName: '',
        toVisitPersonPhone: '',
        fellowPerson: [], // [{ fellowPersonName: '', fellowPersonPhone: '' }]
        carNum: [],
        configDetailId: '',
      },
			userInfoData:userInfo,
      visitReasonList: [],
      dateObj: {
        isShow: false,
        maxDate: Utils.formatDate({ value: Utils.getFutureDate(365, 'back'), type: 's2d', format: 'YY-MM-DD' }),
        value: []
      },
      phoneObj: {
        isShow: false,
        type: 'user', // user: 用户信息的手机号码, toVisit: 被访人的手机号码, fellow: 同行人的手机号码，需要传index
        value: '', // 存储旧值
        index: 0
      },
      carObj: {
        isShow: false,
        value: '', // 存储旧值
        index: 0
      },
			setCarNumber:0,
			zeroSetCarNumber:0,
			isLoading:false,
    }
  },
  computed: {
    getKeyboardHeight() {
      return (this.phoneObj.isShow || this.carObj.isShow) ? '120px' : '40px'
    }
  },
  onLoad({ type }) {
    this.formType = ['regist', 'invite'].includes(type) ? type : 'regist'
    uni.setNavigationBarTitle({ title: type == 'invite' ? '访客邀请' : '访客登记' })
    this.getVisitReasonList()
    // this.getBuildingList()
		if(this.formType == 'invite'){
			this.formObj.visitPersonPhone = ''
		}else if(this.formType == 'regist'){
			this.formObj.visitPersonName = this.formObj.fullName
		}
  },
  methods: {
		textL(index){
			setTimeout(()=>{
				let pageScrollTop = this.zeroSetCarNumber+(this.setCarNumber*index)
				// console.log(this.zeroSetCarNumber,this.setCarNumber,pageScrollTop,'this.setCarNumber*index')
				uni.pageScrollTo({
				    scrollTop: pageScrollTop, //滚动的距离
				    duration: 0, //过渡时间
				})	
			},0)
			console.log('uni.pageScrollTo')
		},
		changeNum(value,type,index){
			let newValue = value.replace(/[^0-9]/g,'')
			setTimeout(()=>{
				if (type === 'user') {
					this.formObj.visitPersonPhone = newValue
				} else if (type === 'toVisit') {
					this.formObj.toVisitPersonPhone = newValue
				} else if (type === 'fellow') {
					const item = this.formObj.fellowPerson[index]
					this.formObj.fellowPerson.splice(index, 1, {
						...item,
						fellowPersonPhone: newValue
					})
				}
			},0)	
		},		
    openPhoneModal(type, index) {
      if (type === 'user') {
        this.phoneObj.value = this.formObj.visitPersonPhone
      } else if (type === 'toVisit') {
        this.phoneObj.value = this.formObj.toVisitPersonPhone
      } else if (type === 'fellow') {
        this.phoneObj.value = this.formObj.fellowPerson[index].fellowPersonPhone
        this.phoneObj.index = index
      }
      this.phoneObj.isShow = true
      this.phoneObj.type = type
    },
    phoneValChange(val) {
      const type = this.phoneObj.type
      const index = this.phoneObj.index
      if (type === 'user') {
        this.formObj.visitPersonPhone += val
      } else if (type === 'toVisit') {
        this.formObj.toVisitPersonPhone += val
      } else if (type === 'fellow') {
        const item = this.formObj.fellowPerson[index]
        this.formObj.fellowPerson.splice(index, 1, {
          ...item,
          fellowPersonPhone: item.fellowPersonPhone + val
        })
      }
    },
    // 手机号码键盘的删除操作
    phoneDel() {
      const type = this.phoneObj.type
      const index = this.phoneObj.index
      if (type === 'user') {
        const length = this.formObj.visitPersonPhone.length
        if (length) {
          this.formObj.visitPersonPhone = this.formObj.visitPersonPhone.substring(0, length - 1)
        }
      } else if (type === 'toVisit') {
        const length = this.formObj.toVisitPersonPhone.length
        if (length) {
          this.formObj.toVisitPersonPhone = this.formObj.toVisitPersonPhone.substring(0, length - 1)
        }
      } else if (type === 'fellow') {
        const item = this.formObj.fellowPerson[index]
        const length = item.fellowPersonPhone.length
        if (length) {
          this.formObj.fellowPerson.splice(index, 1, {
            ...item,
            fellowPersonPhone: item.fellowPersonPhone.substring(0, length - 1)
          })
        }
      }
    },
    // 手机号码键盘的取消操作
    phoneCancel() {
      const type = this.phoneObj.type
      const index = this.phoneObj.index
      if (type === 'user') {
        this.formObj.visitPersonPhone = this.phoneObj.value
      }  else if (type === 'toVisit') {
        this.formObj.toVisitPersonPhone = this.phoneObj.value
      } else if (type === 'fellow') {
        const item = this.formObj.fellowPerson[index]
        this.formObj.fellowPerson.splice(index, 1, {
          ...item,
          fellowPersonPhone: this.phoneObj.value
        })
      }
      this.phoneObj.isShow = false
    },
    dateConfirm(val) {
      this.formObj.planVisitTime = val[0]
      this.dateObj.isShow = false
    },
    // 新增同行人
    addFellow() {
      this.formObj.fellowPerson.push({
        fellowPersonName: '',
        fellowPersonPhone: ''
      })
    },
    openCarModal(index) {
      this.carObj.value = this.formObj.carNum[index]
      this.carObj.index = index
      this.carObj.isShow = true
			setTimeout(()=> {
				this.setScrollTopNum()
				this.textL(index)
			}, 500);
    },
    carValChange(val) {
      const index = this.carObj.index
      const item = this.formObj.carNum[index]
      this.formObj.carNum.splice(index, 1, item + val)
    },
    // 车牌号键盘的删除操作
    carDel() {
      const index = this.carObj.index
      const item = this.formObj.carNum[index]
      const length = item.length
      if (length) {
        this.formObj.carNum.splice(index, 1, item.substring(0, length - 1))
      }
    },
    // 车牌号键盘的取消操作
    carCancel() {
      const index = this.carObj.index
      this.formObj.carNum.splice(index, 1, this.carObj.value)
      this.carObj.isShow = false
    },
    delFellow(index) {
      this.formObj.fellowPerson.splice(index, 1)
    },
    // 新增车牌号
    addCarNum() {
      this.formObj.carNum.push('')
			setTimeout(()=>{
				this.setScrollTopNum()
			},1000)
    },
		setScrollTopNum(){
			let className = '.carNumber0'
			let scrollTopY = ''
			const query = uni.createSelectorQuery()
			uni.createSelectorQuery().selectViewport().scrollOffset(res => {
				scrollTopY = Math.round(res.scrollTop)
			}).exec();
			query
			  .select(className)
			  .boundingClientRect((data) => {
			    let pageScrollTop = (Math.round(data.top)+scrollTopY*1)/2
					this.zeroSetCarNumber = pageScrollTop
			}).exec()  
			query
			  .select('.car-all-box')
			  .boundingClientRect((data) => {
					this.setCarNumber = Math.round(data.height)
			}).exec() 
		},
    delCarNum(index) {
      this.formObj.carNum.splice(index, 1)
    },
    // 获取拜访事由列表
    async getVisitReasonList() {
      const params = {
        projectId: this.projectId,  // 项目id
        configCode: 'CompanyVisitReason' // 企业拜访
      }
      const res = await getVisitReason({ data: params })
			if(this.formType == 'invite'){
				let delIndex = null
				res.data.map((item,index)=>{
					if(item.detailName == '拜访'){
						delIndex = index
					}
				})
				res.data.splice(delIndex,1)
			}
      const tmp = this.visitReasonList = res.data || []
      this.formObj.configDetailId = tmp[0]?.detailId || ''
    },
    // 获取房产地址列表
    async getBuildingList() {
      const params = {
        companyId: this.companyId,
        memberId: this.memberId
      }
      const res = await getOwnerBuildingListComm({ data: params })
      const tmp = res.data || []
      this.formObj.address = tmp[0]?.address || ''
			console.log(JSON.stringify(this.formObj),'this.formObj')
    },
    radioChange(name) {
      this.formObj.configDetailId = name
    },
    * verifyParams() {
      if (!this.formObj.visitPersonName) yield { success: false, error: '请填写姓名' }
      if (!this.formObj.visitPersonPhone) yield { success: false, error: '请填写手机号码' }
      if (!uni.$u.test.mobile(this.formObj.visitPersonPhone)) yield { success: false, error: '手机号码格式不正确' }
      if (!this.formObj.planVisitTime) yield { success: false, error: '请选择日期' }
      if (this.formType === 'regist' && !this.formObj.toVisitPersonName) yield { success: false, error: '请填写被访人姓名' }
      if (this.formType === 'regist' && !this.formObj.toVisitPersonPhone) yield { success: false, error: '请填写被访人手机号码' }
      if (this.formType === 'regist' && !uni.$u.test.mobile(this.formObj.toVisitPersonPhone)) yield { success: false, error: '被访人手机号码格式不正确' }

      for (let index in this.formObj.fellowPerson) {
        let item = this.formObj.fellowPerson[index]
        let posi = index + 1
        if (!item.fellowPersonName) yield { success: false, error: `请填写第${posi}个同行人姓名` }
        if (!item.fellowPersonPhone) yield { success: false, error: `请填写第${posi}个同行人手机号码` }
        if (!uni.$u.test.mobile(item.fellowPersonPhone)) yield { success: false, error: `第${posi}个同行人手机号码格式不正确` }
      }

      for (let index in this.formObj.carNum) {
        let item = this.formObj.carNum[index]
        if (!item) yield { success: false, error: `请填写第${index + 1}个车牌号` }
        if (!uni.$u.test.carNo(item)) yield { success: false, error: `第${index + 1}个车牌号格式不正确` }
      }

      return { success: true }
    },
    // 提交申请
    async handleSubmit() {
			if(this.isLoading){
				return
			}
			this.isLoading = true
      const { success, error } = this.verifyParams().next().value
      if (!success) {
        this.$refs.elToast.show({
          type: 'error',
          message: error
        })
				this.isLoading = false
        return
      }

      const params = {
        address: this.formObj.address,
        visitPersonId: this.memberId, // 访客id
        visitPersonName: this.formObj.visitPersonName, // 访客姓名
        visitPersonPhone: this.formObj.visitPersonPhone, // 访客手机号
        planVisitTime: this.formObj.planVisitTime, // 放行日期
        visitableNum: 100, // 拜访次数
        creator: this.memberId, // 操作人id
        creatorPhone: this.formObj.visitPersonPhone,
        creatorName: this.formObj.visitPersonName,
        configDetailId: this.formObj.configDetailId, // 访问事由的id
        companyId: this.companyId, // 公司id，业主端
        recordType: this.formType === 'invite' ? 2 : 1, // 提交类型。1: 访客登记, 2: 访客邀请
        projectId: this.projectId, // 项目id
        visitType: 1, // 拜访类型。1: 企业, 2: 住宅
        fellowPerson: this.formObj.fellowPerson, // 同行人信息
        carNum: this.formObj.carNum, // 车牌号
      }
      if (this.formType === 'regist') {
        params.toVisitPersonName = this.formObj.toVisitPersonName // 被访人姓名
        params.toVisitPersonPhone = this.formObj.toVisitPersonPhone // 被访人手机号
      } else if (this.formType === 'invite') {
        // 被访人为当前提交人信息
				params.creatorName = this.userInfoData.fullName || this.userInfoData.STRG_realName
				params.creatorPhone = this.userInfoData.ownerPhone || this.userInfoData.phoneNumber || this.userInfoData.contactPhone
        params.toVisitPersonName = this.formObj.fullName // 被访人姓名
        params.toVisitPersonPhone = this.userInfoData.ownerPhone || this.userInfoData.phoneNumber || this.userInfoData.contactPhone // 被访人手机号
      }
      const res = await saveVisitApproval({ data: params })
			this.isLoading = false
      if (res.status == 200) {
        this.$refs.elToast.show({
          type: 'success',
          message: '提交成功'
        })

        uni.navigateTo({ url: '/pages-a/visit-apply/visit-list' })
      } else {
        // this.$refs.elToast.show({
        //   type: 'error',
        //   message: '提交失败'
        // })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  background-color: #f4fafb;
  padding: 30px 15px 0;
  box-sizing: border-box;
}
.page-bg {
  background-image: url(@/static/components/visit-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 200px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
}
.pd-20 {
  padding: 0 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  position: relative;
  z-index: 1;
}
.form-panel {
  background-color: #fff;
}
::v-deep .cell-text:not(.cell-title) .cell-text-panel {
  font-size: 14px;
}
::v-deep .cell-title .cell-text-panel {
  font-size: 15px !important;
  font-weight: bold !important;
}
.gray-text {
  color: #c0c9db;
}
::v-deep .u-radio-group {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;

  .u-radio {
    margin-right: 6px;
  }
}
::v-deep .add-btn .u-icon {
  margin-right: 8px;
}
::v-deep .u-tag--mini {
  padding: 0 7px !important;
}
.footer-bottom {
  padding: 0 30px;
}
.keyboard-pd{
	width: 100%;
	height: 120rpx;
}
.hideView{
	display: none;
}
.carNumber{
	width: 100%;
	height: 1px;
}
</style>