<script setup>
import { ref, onMounted } from 'vue';
import { getUserButtons } from '@/service/landcrm';

const request = () => {
  const { TOKEN, USER_INFO } = window.GlobalProperties.$constant || {};
  const { storageAction } = window.GlobalProperties.$utils || {};
  const { userid } = storageAction({ action: 'get', key: USER_INFO }) || {};

  const params = {
    data: {
      userId: userid,
      menuId: 100010101
    },
    // hideLoading: true
    // responseToast: false,
    // successfulText: '请求成功',
    // failureText: '请求失败'
  };
  getUserButtons(params).then((res) => {
    console.log(res);
  })
};
</script>

<template>
  <div class="home">
    {{ $route.meta.title }}
    <Button type="primary" @click="request">request</Button>
  </div>
</template>

<style lang="scss" scoped>
.home {
}
</style>
