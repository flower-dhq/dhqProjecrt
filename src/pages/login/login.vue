<style lang="scss" scoped>
.login {
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  & > div {
    margin-top: 100px;
    width: 500px;
  }
}
</style>

<script setup>
import { ref, toRaw, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getVerifyCode, qpiUserLogin } from '@/service/landcrm';
import md5 from 'js-md5';

const router = useRouter();
const form = ref({
  userName: '',
  password: '',
  verifyCode: '',
  verifyCodeToken: '',
  codeImage: '',
});

const getVerificationCode = () => {
  getVerifyCode().then((res) => {
    const { img, verifyCodeToken } = res.data || {};
    form.value.codeImage = 'data:image/gif;base64,' + img;
    form.value.verifyCodeToken = verifyCodeToken;
  });
};

// 登录
const loginAction = () => {
  const { userName, password, verifyCode, verifyCodeToken } = toRaw(form.value);
  const params = {
    data: {
      userAccount: form.value.userName,
      password: md5(form.value.password).toUpperCase(),
      verifyCode,
      verifyCodeToken,
    },
  };
  qpiUserLogin(params).then((res) => {
    if (res.success) {
      const { users = [] } = res;
      const user = users[0] || {};
      const { token } = user
      const { TOKEN, USER_INFO } = window.GlobalProperties.$constant || {};
      const { storageAction } = window.GlobalProperties.$utils || {};
      storageAction({ key: TOKEN, value: token, action: 'set' });
      storageAction({ key: USER_INFO, value: user, action: 'set' });
      router.push({ path: '/' });
    }
  });
};

onMounted(() => {
  getVerificationCode();
});
</script>

<template>
  <div class="login">
    <div>
      <Input v-model="form.userName" placeholder="账号" style="width: 300px" />
      <Input type="password" v-model="form.password" placeholder="密码" style="width: 300px" />
      <div>
        <Input v-model="form.verifyCode" placeholder="验证码" style="width: 300px" />
        <Image :src="form.codeImage" fit="contain" width="70px" height="26px" :alt="fit" />
        <Button type="primary" @click="getVerificationCode">验证码</Button>
      </div>
      <Button type="primary" @click="loginAction">登录</Button>
    </div>
  </div>
</template>
