<style lang="scss" scoped>
.complete-profile {
  -webkit-text-size-adjust: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 32rpx 48rpx;
  .mb {
    margin-bottom: 12rpx;
  }
  .submit-button {
    margin-top: 80rpx;
  }
}
</style>

<template>
  <view class="complete-profile" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <u--input class="mb" placeholder="请输入真实姓名" border="bottom" clearable v-model="realName"></u--input>
    <u--input class="mb" placeholder="请输入昵称" border="bottom" clearable v-model="nickname"></u--input>
    <u--input class="mb" placeholder="设置新密码" type="password" border="bottom" clearable v-model="password" customStyle="font-size:13px;font-family:Arial,Microsoft YaHei,PingFangSC-Regular,Hiragino Sans GB,Droid Sans Fallback,WenQuanYi Micro Hei,sans-serif;"></u--input>
    <u--input placeholder="再次确认密码" type="password" border="bottom" clearable v-model="confirmPsw" customStyle="font-size:13px;font-family:Arial,Microsoft YaHei,PingFangSC-Regular,Hiragino Sans GB,Droid Sans Fallback,WenQuanYi Micro Hei,sans-serif;"></u--input>
    <!-- 提交按钮 -->
    <u-button class="submit-button" type="primary" shape="circle" text="提交" @click="submit"></u-button>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { editTboMemberInfo } from '@/service/community';
import commLogic from '@/js/comm-logic';
import utils from '@/js/utils';
const md5 = require('js-md5');

export default {
  data() {
    return {
      realName: '',
      password: '',
      confirmPsw: '',
      nickname: '',
      isCounting: false,
      requesting: false,
    };
  },
  components: {},
  onLoad() {},
  methods: {
    // 校验表单
    verifyForm(action) {
      const vm = this;
      const rules = {
        realName() {
          return vm.realName.trim() == '' ? '请输入真实姓名' : '';
        },
        nickname() {
          return vm.nickname.trim() == '' ? '请输入昵称' : '';
        },
        password() {
          return vm.password.trim() == '' ? '请输入密码' : '';
        },
        confirmPsw() {
          return vm.confirmPsw.trim() == '' ? '请输入确认密码' : '';
        },
        verify() {
          const realNameMsg = this.realName();
          const nicknameMsg = this.nickname();
          const passwordMsg = this.password();
          const confirmPswMsg = this.confirmPsw();
          const passwordEqualMsg = vm.password === vm.confirmPsw ? '' : '两次密码不一致';
          return realNameMsg ? realNameMsg : nicknameMsg ? nicknameMsg : passwordMsg ? passwordMsg : confirmPswMsg ? confirmPswMsg : passwordEqualMsg;
        },
      };
      const invalidMsg = rules[action]();
      if (invalidMsg) uni.showToast({ title: invalidMsg, icon: 'none' });
      return !!invalidMsg;
    },
    // 提交按钮
    submit() {
      const requesting = this.requesting;
      const { companyId: companyIds } = commLogic.getProjectConfig();
      const password = md5(this.password.trim()).toUpperCase();
      const { MEMBER_ID } = this.$constant;
      const memberId = utils.storageAction({ key: MEMBER_ID, action: 'get'});
      const args = {
        data: {
          password,
          companyIds,
          nickname: this.nickname,
          fullName: this.realName,
          memberId
        },
        responseToast: true,
        // successfulText: '提交成功',
        successfulText: '注册成功，请登录',
        loadingText: '提交中',
      };
      const isStop = !requesting && this.verifyForm('verify');
      if (requesting || isStop) return;
      this.requesting = true;
      editTboMemberInfo(args)
        .then((res) => {
          this.requesting = false;
          if (res.success) {
            // 其他参数字段名与字段(redirectPage、lastPageArg)冲突，另起其他名字
            const authRedirectPage = commLogic.getQueryVariable('redirectPage')
            this.$refs.uToast.show({
                message: '注册成功，请登录',
                position: 'bottom',
                duration:'500'
              })
              setTimeout(() => {
                    if (authRedirectPage) {
                    // 授权完重定向回原来页面
                    commLogic.authPageRedirect()
                  } else {
                    uni.navigateBack();
                  }
              }, 500)
            // if (authRedirectPage) {
            //     // 授权完重定向回原来页面
            //     commLogic.authPageRedirect()
            //   } else {
            //     uni.navigateBack();
            //   }
          }
        })
        .catch((_) => {
          this.requesting = false;
        });
    },
  },
};
</script>
