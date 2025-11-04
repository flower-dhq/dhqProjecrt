<script setup>
import { ref, toRaw, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { qpiUserLogin } from '@/service/landcrm';
const router = useRouter();

// 登录
const loginAction = () => {
  const { redirectedFrom = {} } = toRaw(router.currentRoute.value) || {};
  const { query = {}, path, params } = redirectedFrom;
  const { token, ...others } = query;
  const q = { ...others };

  const args = {
    data: {
      token,
    },
  };

  qpiUserLogin(args).then((res) => {
    if (res.success) {
      const { users = [] } = res;
      const user = users[0] || {};
      const { token } = user;
      const { TOKEN, USER_INFO } = window.GlobalProperties.$constant || {};
      const { storageAction } = window.GlobalProperties.$utils || {};
      storageAction({ key: TOKEN, value: token, action: 'set' });
      storageAction({ key: USER_INFO, value: user, action: 'set' });
      router.push({ path, replace: true, query: q, params });
    }
  });
};

onBeforeMount((_) => {
  loginAction()
});
</script>

<template>
  <div class="home">
    
  </div>
</template>

<style lang="scss" scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
