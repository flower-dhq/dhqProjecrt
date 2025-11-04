<style lang="scss" scoped>
.token-refresh {
}
</style>

<template>
  <div class="token-refresh">
    <u-modal :show="failureShow"  content="接口令牌刷新失败，需要手动登录刷新~" confirmText="去登录" @confirm="onConfirm"></u-modal>
  </div>
</template>

<script>
import utils from '@/js/utils';
import { loginByMemberId } from '@/service/api-gateway';
export default {
  data() {
    return {
      failureShow: false,
    };
  },
  created() {
		this.refreshTokenByApi()
	},
  methods: {
    // 刷新商城token
    refreshTokenByApi() {
      const { MEMBER_ID, M_TOKEN } = this.$constant;
      const mbid = utils.storageAction({ key: MEMBER_ID, action: 'get' });
      const { platform } = this.$cmMth.getTerminalPlatformArg();
      const args = {
        data: {
          memberId: mbid,
          equipment: platform,
        },
        loadingText: '令牌刷新中'
      };
      loginByMemberId(args).then((res) => {
        if (res.success) {
          const { token } = res.data;
          // 存商城token
          utils.storageAction({ key: M_TOKEN, action: 'set', value: token });
          uni.navigateBack();
        } else {
					this.failureShow = true
				}
      });
    },
		// 确认回调
		onConfirm() {
			uni.redirectTo({url: '/pages-a/authorization/login'})
		}
  },
};
</script>
