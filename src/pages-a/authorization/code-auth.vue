<style lang="scss" scoped>
.token-refresh {
}
</style>

<template>
  <div class="token-refresh">
    <u-modal :show="failureShow" content="自动授权失败，需要手动登录~" confirmText="去登录" @confirm="onConfirm"></u-modal>
  </div>
</template>

<script>
import utils from '@/js/utils';
import { wxOauthNew } from '@/service/community';
import commLogic from '@/js/commLogic';

export default {
  data() {
    return {
      failureShow: false,
    };
  },
  created() {
    this.authAction();
  },
  methods: {
		// 授权
		async authAction() {
      uni.showLoading({title: '自动授权中'});
			const { failure } = await commLogic.owerAuthByWX()
			if (failure) {
				this.failureShow = true
        uni.hideLoading();
			} else {
        const { errMsg } = await commLogic.mallLoginByMbid()
        uni.hideLoading();
        if (errMsg) uni.showToast({icon: 'none', title: errMsg})
        // 授权完重定向回原来页面
        commLogic.authPageRedirect()
			}
        
		},
    // 确认回调
    onConfirm() {
      const redirectPage = commLogic.getQueryVariable('redirectPage')
      const lastPageArg = commLogic.getQueryVariable('lastPageArg')
      const lastPageArgStr = `${lastPageArg ? `&lastPageArg=${lastPageArg}` : ''}`
      uni.redirectTo({ url: `/pages-a/authorization/login?redirectPage=${redirectPage}${lastPageArgStr}`});
    },
  },
};
</script>
