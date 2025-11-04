<style>
page{
  background:#f5f5f5;
}
</style>
<style lang="scss" scoped>
.tab_cont{
  height: 112rpx;
  display: flex;
  background-color: #fff;
  margin-bottom: 20rpx;
  .tab_item{
    width: 50%;
    text-align: center;
    line-height: 112rpx;
    text{
      color: #666;
      font-size: 30rpx;
    }
  }
  .select_item{
    position: relative;
    text{
      color: var(--app-primary-color);
    }

    view{
      position: relative;
      top: -20rpx;
      width: 46rpx;
      border-radius: 2rpx;
      margin: auto;
      height: 6rpx;
      background-color: var(--app-primary-color);
    }
  }
}
.form-cont{
  padding:0 44rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  .form-item{
    // height: 100rpx;
    padding: 28rpx 0;
    display: flex;
    text{
      width: 168rpx;
      font-size: 30rpx;
    }
    .input-box{
      flex: 1;
      padding: 0 !important;
      border: none;
    }
    .text-bold{
      font-size: 32rpx;
      font-weight: bold;
    }
    .text-bold2{
      min-height: 48rpx;
      font-weight: 30rpx;
      font-weight: bold;
      flex: 1;
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
}
.fixed_button{
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
}
.link_cont{
  height: 350rpx;
  margin-bottom: 20rpx;
  padding-top: 120rpx;
  background-color: #fff;
  .form_item{
    width: 540rpx;
    padding: 20rpx 25rpx;
    border-radius:42rpx;
    margin: auto;
    background-color: #FAFAFC;
  }
  .tip_text{
    padding: 20rpx 120rpx 60rpx;
    color:var(--app-primary-color);
    font-size: 20rpx;
  }
  .btn_cont{
    width: 540rpx;
    margin: auto;
    background-color: #fff;
    .add_btn{
      width: 100%;
      height: 68rpx;
      line-height: 68rpx;
      border-radius: 34rpx;
      font-size: 26rpx;
      color: var(--app-primary-color);
      background-color: #fff;
      border: 2rpx solid var(--app-primary-color);
    }
  }
}
</style>
<template>
  <view class="invite_staff_cont" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <!-- <view class="tab_cont" v-if="isContacts">
      <view class="tab_item"  v-for='(tab,i) in tabItem' :class="{'select_item':tabShow==i}" :key="i">
        <text @click="staffInfoTab(i)">{{tab}}</text>
        <view class="tab_line"></view>
      </view>
    </view> -->
    <!-- 表单 -->
    <view class="form-cont" v-show="tabShow==0">
      <view class="form-item">
        <text class="text-bold">申请类型</text>
        <text>企业员工</text>
      </view>
      <view class="half-line"></view>
      <view class="form-item">
        <text>姓名</text>
        <u-input class="input-box" clearable type="text" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="请填写姓名" v-model="formData.employeeName"/>
      </view>
      <view class="half-line"></view>
      <view class="form-item">
        <text>手机号码</text>
        <u-input class="input-box" clearable type="text" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="请填写手机号码" v-model="formData.phoneNumber"/>
      </view>
      <view class="half-line"></view>
      <view class="form-item">
        <text>所在部门</text>
        <u-input class="input-box" clearable type="text" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="请填写所在部门" v-model="formData.department"/>
      </view>
    </view>
    <!-- 分享链接 -->
    <view class="link_cont" v-show="tabShow==1">
      <view class="form_item">
        <u-input class="input-box" clearable type="text" v-model="shareLink"/>
      </view>
      <view class="tip_text">
        <text>分享链接给其它同事，邀请他们加入本公司(7天有效)</text>
      </view>
      <view class="btn_cont">
        <button class="add_btn copy-link" :data-clipboard-text="shareLink" @click="copyLink">复制链接</button>
      </view>
    </view>
    <view class="form-cont">
      <view class="form-item">
        <text class="text-bold">认证企业</text>
      </view>
      <view class="half-line"></view>
      <view class="form-item" @click="goSelectCompany()">
        <text class="text-bold2">{{ companyInfo.name }}</text>
        <view class="img-cont">
          <image class="icon-r" src="@/static/icon-img/icon_right.png"></image>
        </view>
      </view>
    </view>
    <view class="fixed_button">
      <auth-btn :btnName="'提交'" @click.native="submit()"></auth-btn>
    </view>
  </view>
</template>
<script>
import Clipboard from 'clipboard';
import authBtn from './components/authBtn.vue'
import utils from '@/js/utils';
import {mapGetters, mapMutations } from 'vuex'
import { inviteEmployeeAuth, getInviteEmployeeUrl, findCompanyAuthInfoListPage } from '../../service/community'
import commLogic from '@/js/comm-logic';

export default {
  name:'invite-staff',
  components:{
    authBtn
  },
  data(){
    return{
      applyType:'',
      applyTypeSign:1,
      shareLink:'',
      tabShow:0,  //默认显示的tab
      tabItem:['邀请员工','生成链接邀请'],
      companyInfo:{},
      isContacts:false,
      formData:{
        employeeName:'',
        employeeType:'1',  // 0:企业管理员, 1:企业员工
        department:'',
        phoneNumber:'',
      },
      companyId:'',
      memberId:'',
			isLoading:false,
    }
  },

  onLoad(){
    this.getMemberInfo()
    this.getCompanyList()  //获取公司列表
  },

  computed:{
    ...mapGetters('enterpriseAuth', {
      getAuthInfo: 'getAuthInfo',
    }),
  },

  onShow() {
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

    // 复制链接
    copyLink(){
      var self = this;
      var clipboard = new Clipboard('.copy-link') //绑定数据标签的类名
      clipboard.on('success', e => {
        self.showToast('复制成功')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // Toast.fail('该浏览器或手机权限不支持复制功能');
        // 释放内存
        clipboard.destroy()
      })
    },
    //提交
    submit(){
			if(this.isLoading){
				return
			}
			this.isLoading = true
      if(this.companyInfo.id==null || this.companyInfo.id==undefined){
        this.showToast("请选择企业");
          return;
      }
      if(this.formData.employeeName==''){
        this.showToast("请输入姓名");
          return;
      }
      if(this.formData.phoneNumber==''){
        this.showToast("请输入手机号码");
          return;
      }
      if(!utils.checkPhone(this.formData.phoneNumber)){
        this.showToast("请输入正确的手机号码");
          return false;
      }
      const {employeeName, employeeType, department, phoneNumber} = this.formData
      const {contactName, contactPhone, id, name, projectId, projectName, address }=this.companyInfo
      const params = {
        data : {
          companyId: this.companyId,
          companyLinkman: contactName,
          companyLinkmanPhone: contactPhone,
          department,
          employeeName,
          employeeType,
          enterpriseId: id + '',
          enterpriseName: name,
          phoneNumber,
          projectId: projectId,
          projectName: projectName,
          auditorMemberId: this.memberId,
          enterpriseAddress: address,
          invitationWay: 1 //1.直接邀请，2.链接邀请(必填)
        }
      }
      inviteEmployeeAuth(params).then(res =>{
				this.isLoading = false
        if(res.status=='200'){
          this.showToast('操作成功！');
          setTimeout(e=>{
            uni.navigateBack({
              delta: 1
            });
          },300)
        }else{
          this.showToast(res.message)
        }
      })

    },

    //tab切换
    staffInfoTab(i){
      if(i==1){
        if(!this.companyInfo.id || !this.companyInfo.name){
          this.showToast("请选择公司")
          return
        }else{
          this.getShareUrl()
        }
      }
      this.tabShow=i
    },

    // 获取分享链接
    getShareUrl(){
      const {contactName, contactPhone, id, name, projectId, projectName, address }=this.companyInfo
      const params = {
        data:{
          companyId: this.companyId,
          auditorMemberId: this.memberId,
          companyLinkman: contactName,
          companyLinkmanPhone: contactPhone,
          enterpriseId: id+'',
          projectId: projectId,
          projectName: projectName,
          enterpriseName: name,
          enterpriseAddress: address
        }
      }
      getInviteEmployeeUrl(params).then(res =>{
        if(res.status=="200"){
          this.shareLink=res.data || ''
        }
      })
    },

    //获取已认证公司列表
    getCompanyList(){
      let params={
        data:{
          "memberId":this.memberId,
          "companyId":this.companyId,
          employeeType:0,
          applyStatus:'9'
        },
        pathParams:`/100/1`
      };
      this.loading= true
      findCompanyAuthInfoListPage(params).then(res =>{
        if(res.status == "200"){
          this.loading= false
          let arr =res.data.records
          let list=[]
          arr.forEach(item => {
            const {companyLinkman, companyLinkmanPhone, enterpriseName, enterpriseId, projectId, projectName, enterpriseAddress }=item
            const obj={
              contactName: companyLinkman,
              contactPhone: companyLinkmanPhone,
              id: enterpriseId,
              name: enterpriseName,
              projectId: projectId,
              projectName: projectName,
              address:enterpriseAddress ? enterpriseAddress.substring(1, enterpriseAddress.length-1).split(","): []
            }
            list.push(obj)
          });
          this.companyList = list
          if(this.companyList.length>0){
            this.companyInfo=this.companyList[0]
          }
        }
      })
    },

    //选择公司
    goSelectCompany(){
      this.setCache()
      uni.navigateTo({
        url: '/pages-d/enterprise-info/select-company?type=2' //1为申请加入公司，2邀请员工时选择公司（邀请人已认证的公司）
      });
    },
    // 提示
    showToast (tips) {
      uni.showToast({ title: tips, icon: 'none' });
    },

    //获取会员信息
    getMemberInfo(){
      const { O_USER_INFO, USER_TYPE_NUM } = this.$constant;
      const { id } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
      const num = utils.storageAction({ key: USER_TYPE_NUM, action: 'get' });
      const { companyId } = commLogic.getProjectConfig();
      this.companyId  = companyId
      this.memberId = id,
      this.isContacts = num==4 ? true : false
    },

    //设置缓存
    setCache(){
      const data={
        employeeName: this.formData.employeeName,
        phoneNumber: this.formData.phoneNumber,
        department: this.formData.department,
        companyInfo:this.companyInfo
      }
      this.saveAuthInfo(JSON.parse(JSON.stringify(data)));
    },

    // 获取缓存
    getCache(){
      const {employeeName, phoneNumber, department, companyInfo } = this.getAuthInfo
      this.formData.employeeName = employeeName
      this.formData.phoneNumber = phoneNumber
      this.formData.department = department
      this.companyInfo = companyInfo
    }
  }
}
</script>
