<style lang="scss" scoped>

.login {
  -webkit-text-size-adjust: 100%; 
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 200rpx;
  box-sizing: border-box;
  .background-image {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 288rpx;
    image {
      width: 100%;
      height: 100%;
      background-color: #f3f3f3;
    }
  }
  .mb-64 {
    width: 100%;
    height: 64rpx;
  }
  .form {
    margin: 0 auto;
    width: 616rpx;
    background-color: #fff;
    position: relative;
    z-index: 6;
    box-sizing: border-box;
    padding: 32rpx 38rpx 0 36rpx;
    border-radius: 24rpx;
    &__title {
      display: inline-block;
      font-size: 44rpx;
    }
    ::v-deep .u-input {
      border-radius: 40rpx;
      font-family: Arial, Helvetica, sans-serif;
    }
    .verification {
      font-size: 26rpx;
      color: var(--app-primary-color);
      .is-counting {
        color: #b7b7b7;
      }
      & > text {
        font-size: 26rpx;
      }
    }
    .agreement-forgot-psw {
      width: 100%;
      height: 110rpx;
      margin-top: 32rpx;
      position: relative;
      font-size: 28rpx;
      @include flx-dsp($jsc: center, $ali: flex-start);
      ::v-deep .u-radio-group {
        flex: inherit;
      }
      & > text {
        position: absolute;
        right: 0;
        color: var(--app-primary-color);
        font-size: 28rpx;
      }
    }
    .custom-style {
		height: 68rpx;
	}
  ::v-deep .u-button{
		height: 68rpx;
  }
  }
  .register-account {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20rpx;
    @include flx-dsp($jsc: center, $ali: center);
    font-size: 28rpx;
    & > view > text:first-child {
      color: #333;
      font-size: 28rpx;
    }
    & > view > text:last-child {
      color: var(--app-primary-color);
    }
  }
  .wx-auth {
    position: fixed;
    left: 0;
    bottom: 160rpx;
    width: 100%;
    @include flx-dsp($jsc: center, $ali: center, $drt: column);
    &__line {
      position: relative;
      width: 100%;
      & > text:first-child {
        display: block;
        width: 100%;
        height: 2rpx;
        background-color: var(--app-primary-color);
      }
      & > text:last-child {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: block;
        background-color: #fff;
        padding: 10rpx 20rpx;
        font-size: 24rpx;
        color: var(--app-primary-color);
      }
    }
    .wx-icon {
      padding-top: 30rpx;
      text {
        color: var(--app-primary-color);
        font-size: 60rpx;
      }
    }  
  }
}

</style>

<template>
  <view class="login" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <!-- 背景图 -->
    <view class="background-image">
      <image :src="bgImg" mode="aspectFill"></image>
    </view>
    <!-- 表单 -->
    <view class="form">
      <text class="form__title">{{ typeText }}</text>
      <view class="mb-64"></view>
      <view>
        <u--input type="number" placeholder="请输入手机号码" border="surround" clearable v-model="phone" class="phone-input" placeholderStyle="font-size:13px;color:#d6d6d6" customStyle="padding-left:15px"></u--input>      

        <view class="mb-64"></view>
        <u--input v-if="isLogin" placeholder="请输入密码" type="password" border="surround" clearable v-model="password" class="pass-input" placeholderStyle="font-size:13px;color:#d6d6d6" customStyle="padding-left:15px;font-family:Arial,Microsoft YaHei,PingFangSC-Regular,Hiragino Sans GB,Droid Sans Fallback,WenQuanYi Micro Hei,sans-serif;"></u--input>
        <!-- #ifndef H5 -->
        <u-input v-if="!isLogin" type="number" placeholder="请输入验证码" border="surround" clearable v-model="verificationCode" placeholderStyle="font-size:13px;color:#d6d6d6" customStyle="padding-left:15px">
          <!-- #endif -->

          <!-- #ifdef H5 -->
        <u--input v-if="!isLogin" type="number" placeholder="请输入验证码" border="surround" clearable v-model="verificationCode" customStyle="padding-left:15px">
            <!-- #endif -->

            <template slot="suffix">
              <view class="verification">
                <text class="is-counting" v-if="isCounting">{{ countdown }}(s)</text>
                <text v-else @click="getVerifyCode">获取验证码</text>
              </view>
            </template>

            <!-- #ifdef H5 -->
          </u--input>
          <!-- #endif -->

          <!-- #ifndef H5 -->
        </u-input>
        <!-- #endif -->

        <!-- 协议/忘记密码 -->
        <view class="agreement-forgot-psw">
          <text v-if="isLogin" @click="pageNavigate('reset-password')">忘记密码?</text>
          <u-radio-group v-else v-model="agreed">
            <!-- <u-radio size="13" label="阅读并同意用户协议" labelSize="13" :name="true"></u-radio> -->
            <u-radio size="13"  labelSize="13" :name="true"><span @click="goPrivacy()" style="color:#606266;font-size: 26rpx;line-height: 26rpx;">阅读并同意用户协议</span></u-radio>
          </u-radio-group>
        </view>
      </view>

      <!-- 注册/登录按钮 -->
      <u-button type="primary" shape="circle" class="custom-style" :text="typeText" @click="authAction"></u-button>
    </view>

    <!-- 微信授权 -->
    <view class="wx-auth" v-if="showWxAuth && false">
      <view class="wx-auth__line">
        <text class=""></text>
        <text>微信登录</text>
      </view>
      <view class="wx-icon" @click="pageNavigate('wx-auth')">
        <text class="iconfont">&#xe619;</text>
      </view>
    </view>

    <!-- 注册/登录切换 -->
    <view class="register-account">
      <view v-if="isLogin" @click="isLogin = false">
        <text>没有账号？</text>
        <text>马上注册</text>
      </view>
      <view v-else @click="isLogin = true">
        <text>有账号吗？</text>
        <text>马上登录</text>
      </view>
    </view>

    <!-- toast -->
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { getSmsCode, loginMember, registerMember } from '@/service/community';
import commLogic from '@/js/comm-logic';
import utils from '@/js/utils';
const md5 = require('js-md5');

export default {
  data() {
    return {
      isLogin: true,
      phone: '',
      password: '',
      verificationCode: '',
      countdown: 0,
      countSecond: 59,
      isCounting: false,
      countTimer: null,
      agreed: false,
      requesting: false,
      companyId:'',
    };
  },
  computed: {
    // 标题、按钮文本
    typeText() {
      return this.isLogin ? '登录' : '注册';
    },
    // 背景图片
    bgImg() {
      return `${this.IMG_BASE_URL}/pages-a/static/${this.THEME_NAME}/top_bg.png`;
    },
    // 是否显示微信授权
    showWxAuth() {
      const { uniPlatform } = uni.getSystemInfoSync();
      const isWeb = uniPlatform === 'web';
      const isWeixinBrowser = isWeb && commLogic.isWeixinBrowser();
      return !isWeb || (isWeb && isWeixinBrowser); // web端不显示
    },
  },
  onLoad(option) {
    //  console.log(244,option)
     this.phone = option.phone
     this.companyId = option.companyId
  },
  methods: {
    
    // 校验表单
    verifyForm(action) {
      const vm = this;
      const rules = {
        phone() {
          const phone = vm.phone.trim();
          const empty = phone == '';
          return empty ? '请输入手机号码' : !/\d{11}/.test(phone) ? '请输入正确的手机号码' : '';
        },
        password() {
          return vm.password.trim() == '' ? '请输入密码' : '';
        },
        code() {
          return vm.verificationCode.trim() == '' ? '请输入验证码' : '';
        },
        agreement() {
          return vm.agreed ? '' : '请同意用户协议';
        },
        login() {
          const phoneMsg = this.phone();
          const passwordMsg = this.password();
          return phoneMsg ? phoneMsg : passwordMsg;
        },
        register() {
          const phoneMsg = this.phone();
          const codeMsg = this.code();
          const agreementMsg = this.agreement();
          return phoneMsg ? phoneMsg : codeMsg ? codeMsg : agreementMsg;
        },
        getCode() {
          return this.phone();
        },
      };
      const invalidMsg = rules[action]();
      if (invalidMsg) uni.showToast({ title: invalidMsg, icon: 'none' });
      return !!invalidMsg;
    },
    // 获取验证码
    getVerifyCode() {
      const invalidCode = this.verifyForm('getCode');
      const { projectType } = commLogic.getProjectConfig();
      const args = {
        data: {
          mobiles: this.phone,
          projectType,
        },
        responseToast: true,
        successfulText: '验证码发送成功',
        loadingText: '发送中',
      };
      if (this.requesting || this.isCounting || invalidCode) return;
      this.requesting = true;
      getSmsCode(args)
        .then((res) => {
          this.requesting = false;
          if (res.success) {
            this.isCounting = true;
            this.countdown = this.countSecond;
            this.countTimer = setInterval(() => {
              if (this.countdown == 0) {
                this.clearCounter();
              } else {
                this.countdown--;
              }
            }, 1000);
          }
        })
        .catch((_) => {
          this.requesting = false;
        });
    },
    // 清空定时器
    clearCounter() {
      this.isCounting = false;
      clearInterval(this.countTimer);
      this.countTimer = null;
    },
    // 注册/登录
    authAction() {
      const requesting = this.requesting;
      const isLogin = this.isLogin;
      const isStop = !requesting && this.verifyForm(isLogin ? 'login' : 'register');
      const { companyId: companyIds } = commLogic.getProjectConfig();
      const phone = this.phone;
      if (requesting || isStop) return;
      this.requesting = true;
      // 登录
      if (isLogin) {
        const password = md5(this.password.trim()).toUpperCase();
        const args = {
          data: {
            companyIds:this.companyId?this.companyId:companyIds,
            username: phone,
            password,
          },
          hideLoading: true,
          responseToast: false
        };
        uni.showLoading({title: '登录中'});
        loginMember(args)
          .then(async (res) => {
            if (res.success) {
              let info = res.data
              const authRedirectPage = commLogic.getQueryVariable('redirectPage')
              this.setUserInfo({ action: 'login', data: res.data });
              // 商城登录及获取用户信息
              const { errMsg } = await commLogic.mallLoginByMbid();
              if (errMsg) uni.showToast({icon: 'none', title: errMsg}) 
              this.$refs.uToast.show({
                message: '登录成功',
                position: 'bottom',
                duration:'500'
              })
              setTimeout(() => {
                uni.reLaunch({ url: '/pages/index/index' });
              }, 500)
              //  uni.reLaunch({ url: '/pages/index/index' });

            } else {
              this.$refs.uToast.show({
                message: res.message
              })
            }
            this.requesting = false;
            uni.hideLoading();
          })
          .catch((_) => {
            this.$refs.uToast.show({
              message: '请求失败，请稍后再试'
            })
            this.requesting = false;
            uni.hideLoading();
          });
      } 
      // 注册
      else {
        const args = {
          data: {
            companyIds,
            phoneNumber: phone,
            code: this.verificationCode,
            invitationCode: '',
          },
          loadingText: '注册中',
        };
        registerMember(args)
          .then((res) => {
            this.requesting = false;
            if (res.success) {
              const redirectPage = commLogic.getQueryVariable('redirectPage')
              let redirectArgs = ''
              this.setUserInfo({ action: 'register', data: res.data });
              // 其他参数字段名与字段(redirectPage、lastPageArg)冲突，另起其他名字
              if (redirectPage) {
                const lastPageArg = commLogic.getQueryVariable('lastPageArg')
                const lastPageArgStr = `${lastPageArg ? `&lastPageArg=${lastPageArg}` : ''}`
                redirectArgs = `?redirectPage=${redirectPage}${lastPageArgStr}`
              }
              uni.navigateTo({ url: `/pages-a/authorization/complete-profile${redirectArgs}`});
            }
          })
          .catch((_) => {
            this.requesting = false;
          });
      }
    },
    // 页面跳转
    pageNavigate(page) {
      const url = `/pages-a/authorization/${page}?phone=${this.phone}`;
      uni.navigateTo({ url });
    },
    // 设置用户信息
    setUserInfo(params) {
      const { data, action } = params || {};
      const { TOKEN, MEMBER_ID, O_USER_INFO } = this.$constant;

      if (action === 'login') {
        const { id, token } = data || {};
        const storage = commLogic.setOwerUserInfo('loginPage', data)
        utils.storageAction({ key: TOKEN, action: 'set', value: token });
        utils.storageAction({ key: MEMBER_ID, action: 'set', value: id });
        utils.storageAction({ key: O_USER_INFO, action: 'set', value: storage });
      } else if (action === 'register') {
        const { token, member } = data || {};
        const { id } = member || {};
        utils.storageAction({ key: TOKEN, action: 'set', value: token });
        utils.storageAction({ key: MEMBER_ID, action: 'set', value: id });
      }
      
    },
    // 用户协议
     goPrivacy(){
          uni.navigateTo({ url: '/pages-a/authorization/privacy' });  
        },
  },
  beforeDestroy() {
    this.clearCounter();
  },
};
</script>
