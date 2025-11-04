
<style>
page{
  background:#f5f5f5;
}
</style>
<style lang="scss" scoped>
.title-cont{
  height: 100rpx;
  line-height: 100rpx;
  padding-left: 48rpx;
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  background: #fff;
}

.form-item{
  display: flex;
  background-color: #fff;
  padding:26rpx 0;
  font-size: 28rpx;
  text{
    width: 160rpx;
  }
  .input-box{
    flex: 1;
    padding: 0 !important;
    border: none;
  }
  .img-cont{
    width: 24rpx;
    display: flex;
    align-items: center;
    margin-left: 20rpx;
    .icon-r{
      width: 24rpx;
      height: 24rpx;
    }
  }
  ::v-deep .u-input{
    padding: 0 !important;
    border: unset;
  }
}
.form_item2{
  margin-bottom: 20rpx;
  padding: 26rpx 36rpx 26rpx 48rpx;
}
.form-info-cont{
  padding: 0 48rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
}
.tips{
  color:#d7d7d7; 
  font-size:28rpx
}
.icon-color{
  color: red;
}

</style>
<template>
  <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="title-cont">公司信息</view>
    <view class="half-line"></view>
    <view class="form-item form_item2">
      <text>公司名称<text class="icon-color">*</text></text>
      <text class="input-box" @click="goSelectCompany()">
        <text v-if="companyInfo.name">{{companyInfo.name}}</text>
        <text v-else class="tips">请选择公司</text>
      </text>
      <view class="img-cont">
        <image class="icon-r" src="@/static/icon-img/icon_right.png"></image>
      </view>
    </view>
    <view class="title-cont">个人信息</view>
    <view class="half-line"></view>
    <view class="form-info-cont">
      <view class="form-item">
        <text>姓名<text class="icon-color">*</text></text>
        <u-input class="input-box" clearable type="text" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="请填写姓名" v-model="employeeName"/>
      </view>
      <view class="half-line"></view>
      <view class="form-item">
        <text>手机号码<text class="icon-color">*</text></text>
        <u-input class="input-box" readonly clearable type="text" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="请填写手机号码" v-model="phoneNumber"/>
      </view>
      <view class="half-line"></view>
      <view class="form-item">
        <text>所在部门</text>
        <u-input class="input-box" clearable type="text" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="请填写所在部门" v-model="department"/>
      </view>
    </view>
    <auth-btn :btnName="'提交'" @click.native="submit()"></auth-btn>
  </view>
</template>
<script>
import authBtn from './components/authBtn.vue'
import utils from '@/js/utils';
import {mapGetters, mapMutations } from 'vuex'
import { applyJoinCompany } from '../../service/community'
import commLogic from '@/js/comm-logic';
import { savePageTitle } from '@/js/router/router-utils'
export default {
  components:{
    authBtn
  },

  data(){
    return{
      employeeName:'',  //真实名字
      phoneNumber:'', //手机号码
      department:'', //所属部门
      companyInfo:{}, //选择的企业信息
      memberId:'', //会员id
      companyId:'' //公司id
    }
  },

  // onShow(){
  //   let pages = getCurrentPages()
  //   if(pages.length>1){
  //     let route = pages[pages.length-2].route
  //     let code = route.substring(route.lastIndexOf("/")+1)
  //     if(code=='select-company'){
  //       this.getCache()
  //     }else{
  //       this.clearAuthInfo()
  //     }
  //   }else{
  //     this.clearAuthInfo()
  //   }
  // },

  onLoad(){
    savePageTitle({ title: "加入企业"});
    this.getMemberInfo()
  },

  computed:{
    ...mapGetters('enterpriseAuth', {
      getAuthInfo: 'getAuthInfo',
    })
  },

  onShow() {
    savePageTitle({ title: "加入企业"});
    let that = this
    uni.$on('selectCompanyInfo',function(data){
      that.companyInfo = data
    })
  },

  methods:{
    ...mapMutations('enterpriseAuth', [
      'saveAuthInfo',
      'clearAuthInfo'
    ]),

    goSelectCompany(){
      this.setCache()
      uni.navigateTo({
        url: '/pages-d/enterprise-info/select-company?type=1'
      });
    },

    //提交申请
    submit(){
      if(this.companyInfo.id==null || this.companyInfo.id==undefined){
        this.showToast("请选择企业");
        return;
      }
      if(this.employeeName==''){
        this.showToast("请输入姓名");
        return;
      }
      if(this.phoneNumber == ''){  
        this.showToast("请输入手机号码");
        return false;
      }
      if(!utils.checkPhone(this.phoneNumber)){  
        this.showToast("请输入正确的手机号码");
        return false;
      }
      const {id, contactName, contactPhone, name, address, projectId, projectName }=this.companyInfo
      let params = {
        data : {
          enterpriseId:id,
          enterpriseName:name,
          companyLinkman:contactName,
          companyLinkmanPhone:contactPhone,
          companyId:Number(this.companyId),
          memberId:this.memberId,
          employeeName:this.employeeName,
          phoneNumber:this.phoneNumber,
          idCardNum:'',
          department:this.department,
          enterpriseAddress:address,
          projectId,
          projectName
        }
      }
      applyJoinCompany(params).then(res =>{
        if(res.status=='200'){
          this.showToast('加入成功，等待审核');
          setTimeout(e=>{
            uni.navigateBack({
              delta: 1
            });
          },500)
        }else{
          this.showToast(res.message);
        }
      })
    },

    // 提示
    showToast (tips) {
      uni.showToast({ title: tips, icon: 'none' });
    },

    //获取会员信息
    getMemberInfo(){
      const { O_USER_INFO } = this.$constant;
      const { phoneNumber, id } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
      const { companyId } = commLogic.getProjectConfig();
      this.companyId  = companyId
      this.phoneNumber = phoneNumber
      this.memberId = id
    },

    //设置缓存
    setCache(){
      const data={
        employeeName: this.employeeName,
        phoneNumber: this.phoneNumber,
        department: this.department,
        companyInfo:this.companyInfo
      }
      this.saveAuthInfo(JSON.parse(JSON.stringify(data)));
    },

    // 获取缓存
    getCache(){
      const {employeeName, phoneNumber, department, companyInfo} = this.getAuthInfo
      this.employeeName = employeeName
      this.phoneNumber = phoneNumber
      this.department = department
      this.companyInfo = companyInfo
    }


  }
}
</script>