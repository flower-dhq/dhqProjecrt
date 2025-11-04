<style lang="scss" scoped>
.faceIdentity{
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: #f5f5f5;
}
.submit-btn {
  margin: 0 auto 80rpx;
  width: 480rpx;
  height: 68rpx;
  border-radius: 36rpx;
  line-height: 68rpx;
  background: var(--app-primary-color);
  text-align: center;
  font-size: 28rpx;
	margin-top: 40rpx;
  color: #FFF;
}

::v-deep .u-form{
	background: #fff;
	padding:0 30rpx 0 30rpx
}
</style>
<template>
  <view class="faceIdentity" :style="[THEME_CSS_VAR]" :class="[THEME_NAME]">
		<u-form labelPosition="left" ref="elFormUser" labelWidth="112px" class="ufrom" >
		  <u-form-item :borderBottom="true">
				<text slot="label">姓名</text>
		    <u-input v-model="userName" border="none" inputAlign="right" clearable :readonl="!userName?true:false" placeholder-style="font-size: 28rpx;color: #c0c4cc;" placeholder="请输入姓名（必填）" @blur="changeName"/>
		  </u-form-item>
		  <u-form-item :borderBottom="true">
				<text slot="label">联系电话</text>
		    <u-input v-model="userPhone" border="none" inputAlign="right" clearable readonly placeholder-style="font-size: 28rpx;color: #c0c4cc;"/>
		  </u-form-item>
		  <u-form-item>
				<text slot="label">身份证号码</text>
				<u-input v-model="userIdcard" border="none" inputAlign="right" clearable placeholder-style="font-size: 28rpx;color: #c0c4cc;" placeholder="请输入证件号（选填）"/>
		  </u-form-item>
		</u-form>
    <view class="submit-btn"  @click="submitEntry">提交并录入人脸</view>
  </view>
    
</template>

<script>
import { getIdInfoByPhone,updateIdCardByUserId } from '@/service/doorService.js';
import { selectTboMemberInfo,editTboMemberInfo } from '@/service/community';
import Utils from '@/js/utils'
import commLogic from '@/js/comm-logic';
export default {
  name: "faceIdentity",
  data(){
		const { MEMBER_ID } = this.$constant
    return {
      loading: false,
      showPositionValue: false,
      showToastValue: "",
      userName:'',
      userIdcard:'',
      userPhone:'',
      ownerType:'员工',
			memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
			form:{},
    }
  },
  onLoad(options){  
		this.userName = options.userName
		this.userIdcard = options.userIdcard
		this.userPhone = options.userPhone || ''
    // this.getUserIdInfo()
  },
  methods: {
    // 获取用户信息
    getUserIdInfo() {
      this.loading = true;
      let params = {
        ownerPhone:this.ownerPhone,
        ownerId:this.ownerId,
      }
      getIdInfoByPhone(params).then(async res => {
        this.loading = false
        if (res.status == '200') {
          this.cardId = res.data.ownerIDCard
        } else {
					uni.showToast({title:res.message || '获取身份信息失败',duration:1000,icon: 'none',})
        }
      }).catch(_ => {
        this.loading = false;
      })
    }, 
		changeName(){
			if(this.userName){
				this.getProfile()
			}
		},
		// 获取用户信息
		getProfile() {
		    const { MEMBER_ID } = this.$constant;
		    const memberId = Utils.storageAction({ key: MEMBER_ID, action: 'get' });
		    const args = {
		        pathParams: `/${memberId}`,
						hideLoading: true,
		    };
		    selectTboMemberInfo(args).then((res) => {
		        if (res.success) {
		            const { headimg, nickname, fullName, sex, birthDay, phoneNumber } = res.data;
		
		            this.form = {
		                headImg: headimg || require(`@/static/${[this.THEME_NAME]}/index/default-photo.png`),
		                nickname: nickname || '',
		                realName: fullName || '',
		                sex: sex || '',
		                birthday: birthDay || '',
		                phone: phoneNumber || '',
		                oldPhone: phoneNumber || ''
		            };
								if(this.form.realName != this.userName){
									this.form.realName = this.userName
									this.saveUserInfo()
								}
		        }
		    });
		},
		// 保存信息
		async saveUserInfo() {
		    const { nickname, realName, sex, birthday, phone } = this.form;
		    const { companyId } = commLogic.getProjectConfig();
		    const { MEMBER_ID } = this.$constant;
		    const memberId = Utils.storageAction({ key: MEMBER_ID, action: 'get' });
		
		    const args = {
		        data: {
		            nickname,
		            fullName: realName,
		            sex,
		            birthDay: birthday,
		            phoneNumber: phone,
		            memberId,
		            companyId,
		        },
		        hideLoading: true,
		responseToast: false
		
		    };
		    console.log(219, this.fileObj, args.data.headimg)
		
		    editTboMemberInfo(args).then((res) => {})
		},
    submitEntry(){
      if(this.userIdcard){
				if(!this.userName){
					uni.showToast({title:'请输入姓名',duration:1000,icon: 'none',})
					return
				}
        if(Utils.checkIDNumber(this.userIdcard)){
					let params = {
						data:{
							type:'0',
							userPhone:this.userPhone,
							userIdcard:this.userIdcard
						}
					}
					updateIdCardByUserId(params).then(res=>{
					  if(res.status == 200){
							// uni.showToast({title:res.message,duration:1000,icon: 'none',})
					    this.goNextStep()
					  }else{
							uni.showToast({title:res.message,duration:1000,icon: 'none',})
					  }
					})
				}else{
					uni.showToast({title:'身份证号码格式有误',duration:1000,icon: 'none',})
				}
      }else{
        this.goNextStep()
      }
    },
    goNextStep(){
			uni.redirectTo({
				url:'/pages-b/xinyidaiFaceManage/newFaceForm?userName='+this.userName+'&userPhone='+this.userPhone
			})
    },
  },
  
}
</script> 