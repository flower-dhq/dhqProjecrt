<style lang="scss" scoped>
.account {
  width: 200px;
  @include flx-dsp($jsc: flex-end, $ali: center);
  .trigger {
    @include flx-dsp($jsc: center, $ali: center);
    font-size: 13px;
  }
  :deep(.ivu-select-dropdown) {
    top: 48px !important;
  }
  :deep(.ivu-dropdown-item ) {
    font-size: 13px !important;
  }
}
</style>

<template>
  <div class="account">
    <Dropdown trigger="click" @on-click="onClick">
      <a class="trigger" href="javascript:void(0)">
        {{accountInfo.userName}}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <template #list>
        <DropdownMenu>
          <DropdownItem v-if="quitButtonShow" name="logout">退出登录</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { relogin } from '@/assets/js/comm-logic';

const { storageAction } = window.GlobalProperties.$utils || {};
const { TOKEN, USER_INFO } = window.GlobalProperties.$constant || {};
const store = useStore();
const quitButtonShow = localStorage.quitButton != 1 // 1-隐藏 0-不隐藏

const accountInfo = ref({
  userName: '-',
});

// 获取账号信息
const getUserInfo = () => {
  accountInfo.value = storageAction({ key: USER_INFO, action: 'get' }) || { userName: '-' };
};
const logoutAction = () => {
  relogin()
};
// 点击事件
const onClick = (name) => {
  if (name == 'logout') logoutAction();
};

onMounted(() => {
  getUserInfo();
});
</script>
