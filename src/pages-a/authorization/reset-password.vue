<style lang="scss" scoped>
.reset-password {
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 32rpx 48rpx;
  .mb {
    width: 100%;
    height: 12rpx;
  }
  ::v-deep .u-input {
      font-family: Arial, Helvetica, sans-serif;
    }
  .verification {
    font-size: 28rpx;
    color: var(--app-primary-color);
    .is-counting {
      color: #b7b7b7;
    }
  }
  ::v-deep .u-button {
    margin-top: 80rpx;
		height: 68rpx;

  }
  .custom-style {
		height: 68rpx;
    // width: 542rpx;
	}
  .pass-input {
    font-family:Arial,'Microsoft YaHei','PingFangSC-Regular','Hiragino Sans GB','Droid Sans Fallback','WenQuanYi Micro Hei',sans-serif;
  }
}
.phone-box{
  border-bottom: 1px solid #d6d6d6;
  padding-bottom: 14rpx;
}
</style>

<template>
  <view class="reset-password" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <u--input placeholder="请输入手机号码" type="number" border="bottom" placeholderStyle="font-size:14px;color:#d6d6d6" clearable v-model="phone" customStyle="padding-left:15px;padding-top:7px;padding-bottom:7px"></u--input>
    <view class="mb"></view>

    <!-- #ifndef H5 -->
    <u-input v-if="!isLogin" type="number" placeholder="请输入验证码" placeholderStyle="font-size:14px;color:#d6d6d6" border="bottom" clearable v-model="verificationCode" customStyle="padding-left:15px;padding-top:7px;padding-bottom:7px">
      <!-- #endif -->

      <!-- #ifdef H5 -->
      <u--input v-if="!isLogin" type="number" placeholder="请输入验证码" placeholderStyle="font-size:14px;color:#d6d6d6" border="bottom" clearable v-model="verificationCode" customStyle="padding-left:15px;padding-top:7px;padding-bottom:7px">
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

    <u--input placeholder="设置新密码" type="password" border="bottom" clearable v-model="password"  placeholderStyle="font-size:14px;color:#D6D6D6" class="pass-input" customStyle="padding-left:15px;padding-top:7px;padding-bottom:7px"></u--input>
    <view class="mb"></view>
    <u--input placeholder="再次确认密码" type="password" border="bottom" clearable v-model="confirmPsw"  placeholderStyle="font-size:14px;color:#D6D6D6" class="pass-input" customStyle="padding-left:15px;padding-top:7px;padding-bottom:7px"></u--input>
    <!-- 提交按钮 -->
    <view style="width:542rpx;margin: 0 auto;">
      <u-button class="submit-button custom-style" type="primary" shape="circle" text="提交" @click="submit"></u-button>
    </view>
  </view>
</template>

<script>
import util from '../../js/utils'
import commLogic from '@/js/comm-logic';
import { getSmsCode, changPwdByCode } from '@/service/community';
const md5 = require('js-md5');

export default {
  data() {
    return {
      phone: '',
      password: '',
      confirmPsw: '',
      verificationCode: '',
      countdown: 0,
      countSecond: 59,
      isCounting: false,
      countTimer: null,
      requesting: false,
    };
  },
  components: {},
  onLoad(option) {
    this.phone = option.phone ? option.phone : ''
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
        confirmPsw() {
          return vm.confirmPsw.trim() == '' ? '请输入确认密码' : '';
        },
        code() {
          return vm.verificationCode.trim() == '' ? '请输入验证码' : '';
        },
        getCode() {
          return this.phone();
        },
        modify() {
          const phoneMsg = this.phone();
          const passwordMsg = this.password();
          const confirmPswMsg = this.confirmPsw();
          const passwordEqualMsg = vm.password === vm.confirmPsw ? '' : '两次密码不一致';
          return phoneMsg ? phoneMsg : passwordMsg ? passwordMsg : confirmPswMsg ? confirmPswMsg : passwordEqualMsg;
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
    // 提交按钮
    submit() {
      const requesting = this.requesting;
      const { companyId: companyIds } = commLogic.getProjectConfig();
      const newPassword = md5(this.password.trim()).toUpperCase();
      const args = {
        data: {
          companyIds,
          code: this.verificationCode,
          mobile: this.phone,
          newPassword,
        },
        responseToast: true,
        successfulText: '修改成功',
        loadingText: '修改中',
      };
      const isStop = !requesting && this.verifyForm('modify');
      if (requesting || isStop) return;
      this.requesting = true;
      changPwdByCode(args)
        .then((res) => {
          this.requesting = false;
          if (res.success) {
            uni.showToast({title: '修改密码成功', icon: 'none'})
            setTimeout(() => {
					       uni.navigateBack();
                            }, 800) 
          }else {
            uni.showToast({title: '修改密码失败', icon: 'none'})
                }
        })
        .catch((_) => {
          this.requesting = false;
        });
    },
  },
  beforeDestroy() {
    this.clearCounter();
  },
};
</script>
