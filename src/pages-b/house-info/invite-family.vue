<style>
page{
  background:#f5f5f5;
}
</style>
<style lang="scss" scoped>
.form-info-cont{
  padding: 0 30rpx;
  margin-bottom: 24rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #fff;
}
.form-item{
  display: flex;
  padding:26rpx 0;
  text{
    width: 160rpx;
  }
  .input-box{
    flex: 1;
    padding: 0 !important;
    border: none;
  }
  .relation-tab{
    flex: 1;
    display: flex;
    view{
      width: 100rpx;
      height: 48rpx;
      line-height: 48rpx;
      margin-right: 40rpx;
      text-align: center;
    }
    .tab-act{
      border-radius: 24rpx;
      color: var(--app-primary-color);
      border: 2rpx solid var(--app-primary-color);
    }
  }
  .addr-box{
    flex: 1;
  }
  .icon-cont{
    width: 24rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    margin-left: 20rpx;
    .icon-r{
      width: 24rpx;
      height: 24rpx;
    }
  }
  .code-text{
    color: var(--app-primary-color);
    width: 23%;
  }
  ::v-deep .u-input{
    padding: 0 !important;
    border: unset;
  }
}
.addr-title{
  font-size: 30rpx;
  font-weight: bold;
  height: 100rpx;
  line-height: 100rpx;
}
.addr-cont{
  display: flex;
  .addr-info{
    flex: 1;
    padding: 14rpx 0;
    view{
      padding: 10rpx 0;
    }
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
}
.btn-cont{
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 68rpx;
  line-height: 68rpx;
  text-align: center;
  font-size: 28rpx;
  color: #fff;
  background: var(--app-primary-color);
}
</style>
<template>
  <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="form-info-cont">
      <view class="form-item">
        <text>关系</text>
        <view class="relation-tab">
          <view v-for="(item,i) in relations" :key="i"
            @click="changeRelation(item)"
            :class="{'tab-act':i==relationId}"
            >{{ item.value }}</view>
        </view>
      </view>
      <view class="half-line"></view>
      <view class="form-item">
        <text>真实姓名</text>
        <u-input class="input-box" clearable type="text" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="请输入真实姓名" v-model="name"/>
      </view>
      <view class="half-line"></view>
      <view class="form-item">
        <text>手机号码</text>
        <u-input class="input-box" clearable type="text" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="请输入手机号码" v-model="phone"/>
      </view>
      <view class="half-line"></view>
      <view class="form-item">
        <text>验证码</text>
        <u-input class="input-box" clearable type="text" :maxlength="6" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="请输入验证码" v-model="code"/>
        <text class="code-text" @click="getCode()" :style="codeDisable?'pointer-events:none':'pointer-events:auto'">{{ codeName }}</text>
      </view>
    </view>
    <view class="form-info-cont">
      <view class="addr-title">认证路址</view>
      <view class="half-line"></view>
      <view class="addr-cont" @click="selectAddress">
        <view class="addr-info">
          <view>联系人：{{addressInfo.ownerName}} </view>
          <view>联系电话：{{addressInfo.ownerPhones}} </view>
          <view>地址：{{addressInfo.address}} </view>
        </view>
        <view class="img-cont">
          <image class="icon-r" src="@/static/icon-img/icon_right.png"></image>
        </view>
      </view>
    </view>
    <view class="btn-cont" @click="invatePersion">提交</view>
    <u-modal width="500rpx" :show="modalShow" title="提示" content='邀请成功！是否继续？' :showCancelButton='true' @confirm='subComfim' @cancel='subCancel'></u-modal>
  </view>
</template>
<script>
import {mapGetters, mapMutations } from 'vuex'
import commLogic from '@/js/comm-logic';
import utils from '@/js/utils';
import { 
  getSmsCode, //获取验证码
  findLocations, //获取认证地址
  invateFamily, //邀请家人
} from '../../service/community'
export default {
  data(){
    return{
      companyId:'',
      memberId:'',
      projectType:'',
      addressList:[],
      relations:[
        { value: '家人', key:'0'},
        { value: '租户', key:'1'},
      ],
      name:'',
      phone:'',
      code:'',
      relationId:'0',
      relationName:'家人',
      codeDisable:false,
      codeName:'获取验证码',
      timeNum:60, 
      addressInfo:{},
      pageFrom:'', //标记从哪个页面来
      modalShow:false, //提交后的提示框
    }
  },

  onLoad(){
     this.getMemberInfo()
  },

  onShow(){
    this.getCache()
    //不是从选择地址页面回来，或者地址为空，则请求地址，选择第一条。
    if(this.pageFrom !='authAddressList' || JSON.stringify(this.addressInfo)=='{}'){
      this.getHouselist()
    }
  },
  destroyed(){
    // 页面销毁删除缓存 
     this.clearInviteFamily();
  },
  computed:{
    ...mapGetters('inviteFamily', {
      familyInfo: 'getInviteFamily',
    }),
  },

  methods:{
    ...mapMutations('inviteFamily', [
      'saveInviteFamily',
      'clearInviteFamily'
    ]),

    selectAddress(){
      this.setCache()
      uni.navigateTo({
        url: '/pages-b/house-info/auth-address-list?page=inviteFamily'
      });
    },

    //提交成功后确定操作
    subComfim(){
      this.name = '';
      this.phone = '';
      this.code = '';
      this.modalShow = false;
      //取消倒计时
      this.codeDisable = false;
      this.codeName = "获取验证码";
      clearInterval(this.timer); //停止循环
      console.log("subComfim 停止循环");
    },

    //提交成功后取消操作
    subCancel(){
      this.modalShow = false
      uni.redirectTo({
        url:'/pages-b/house-info/my-family-house'
      });
    },

    /** 邀请家人 */
    invatePersion() {
      let self = this;
      if(this.name ==''){
        this.showToast('请输入真实姓名')
        return
      }
      if(this.phone ==''){
        this.showToast('请输入手机号码')
        return
      }
      if(!utils.checkPhone(this.phone)){
        this.showToast('请输入正确的手机号码')
        return
      }
      if(this.code==''){
        this.showToast('请输入验证码')
        return
      }
      if(this.addressInfo.authType!=1){
        this.showToast('请选择已认证房产')
        return
      }

      let params = {
        data:{
          name:this.name,
          mobile:this.phone,
          // cardNo:this.cardNo,
          relationOfOwner:this.relationName,
          memberId:this.memberId,
          source:commLogic.isWeixinBrowser() ? 2 : 3, //是否是微信公众号
          selectRelateId:this.addressInfo.relateId,
          // relation: this.relation[0], //以下三个未知,还需对接
          // customerGuid: this.customerGuid,
          // dcInfoId: this.dcInfoId,
          code: this.code, // 验证码
          model: 3, // 1：登录  2：验证码 3：邀请家人
        }
      }
      console.log("这里这里",params)
      invateFamily(params).then(res => {
        if (res.status == '200') {
          this.modalShow = true
        } else {
          // this.showToast(res.message)
        }
      })
    },

    //获取房屋列表
    getHouselist(){
      let params = {
        data:{
          memberId: this.memberId,
          projectType: this.projectType
        },
        pathParams:'/1',
        "hideLoading": true
      }
      findLocations(params).then(res =>{
        if(res.status=='200'){
          let tempArr = res.data.authBuildings
          // item.authType ==1 && item.houseState==2 
          tempArr = tempArr.filter( item => {return item.authType ==1 && item.houseState == 2 })
          for (let i = 0; i < tempArr.length; i++) {
            const item = tempArr[i];
            if(item.isDefault == 1){
              this.addressInfo = item
              break;
            }else{
              this.addressInfo = tempArr[0]
            }
          }
        }
      })
    },

    //获取验证码
    getCode() {
      let self = this;
      if (!self.phone) {
        self.showToast('请输入手机号码')
        return false;
      }
      if (!utils.checkPhone(self.phone)) {
        self.showToast('请输入正确的手机号码')
        return false;
      }
      let jsonData = {
        data:{
          mobiles: self.phone,
          model: 2, //1.登录  2.验证码
          projectType: this.projectType
        }
      };
      self.countdown();
      getSmsCode(jsonData).then(result => {
        if (result.status == "200") {
          self.showToast('短信验证码发送成功')
        } else {
          self.codeDisable = false;
          self.codeName = "重新获取";
          clearInterval(self.timer);
          self.showToast('短信验证码发送失败')
        }
      }).catch(error => {
        self.codeDisable = false;
        self.codeName = "重新获取";
      });
    },

    //倒计时
    countdown() {
      let self = this;
      if (!self.codeDisable) {
        self.codeDisable = true;
        let time = self.timeNum;
        self.codeName = time + "s";
        self.timer = setInterval(() => {
          if (time > 0) {
            time--;
            self.codeName = time + "s";
          } else {
            time = self.timeNum;
            self.codeDisable = false;
            self.codeName = "重新获取";
            clearInterval(self.timer); //停止循环
          }
        }, 1000);
      }
    },
    
    //选择关系
    changeRelation(item){
      this.relationId = item.key;
      this.relationName = item.value;
      this.relations.filter(e =>{
        e.checked = false
      })
      item.checked = true
    },

    // 提示
    showToast (tips) {
      uni.showToast({ title: tips, icon: 'none' });
    },
        
    //设置缓存
    setCache(){
      const data={
        name: this.name,
        phone: this.phone,
        code: this.code,
        addressInfo: this.addressInfo,
        pageFrom: ''
        
      }
      this.saveInviteFamily(JSON.parse(JSON.stringify(data)));
    },

    // 获取缓存
    getCache(){
      const {name = '', phone = '', code = '', pageFrom = '', addressInfo={} } = this.familyInfo 
      this.name = name
      this.phone = phone
      this.code = code
      this.addressInfo = addressInfo
      this.pageFrom = pageFrom
    },

    //获取缓存信息
    getMemberInfo(){
      const { O_USER_INFO } = this.$constant;
      const { companyId, id } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
      const { projectType } = commLogic.getProjectConfig();
      this.companyId = companyId;
      this.memberId = id
      this.projectType = projectType
      
    },
  }
}
</script>