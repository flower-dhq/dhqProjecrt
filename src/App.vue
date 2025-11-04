<script>
import commLogic from '@/js/comm-logic';
import routingIntercept from '@/js/permission.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  async onLaunch() {
    commLogic.setUvConfig();

    // #ifdef H5 || APP-VUE
    console.log('h5')
    let init = () => {
			this.getLocalUserInfo()
		}
		document.addEventListener('deviceready', init, false)
    //#endif
   
    // #ifdef MP-WEIXIN
    this.Update();
    const res = wx.getSystemInfoSync();
    if (res.environment) {
      await commLogic.wxWorkAuth();
    }
    // #endif
    // #ifdef MP-DINGTALK 
    this.Update();
    await commLogic.ddwxAuth();
    // #endif

    routingIntercept();

  },
  onShow: function () {
    console.log('App Show');
    // #ifdef MP-WEIXIN  
    if (wx.hideHomeButton) {
      wx.hideHomeButton();
    }
    // #endif

  },
  onHide: function () {
    console.log('App Hide');
  },
  computed: {
    // #ifdef H5 || APP-VUE
		...mapGetters(['user'])
     //#endif
	},
  methods: {
    Update() {
      const updateManager = uni.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
      });

      updateManager.onUpdateReady(function (res) {
        uni.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        });
      });

      updateManager.onUpdateFailed(function (res) {
        // 新的版本下载失败
      });
    },
    // #ifdef H5 || APP-VUE
    ...mapActions(['getLocalUserInfo'])
     //#endif
  },

};
</script>

<style lang="scss">
/*每个页面公共css */

// 组件库
@import 'uview-ui/index.scss';
@import '@/theme-skin/u-view-var.scss';

// 主题皮肤
@import '@/theme-skin/default/index.scss';
@import '@/theme-skin/test/index.scss';

// 引入字体图标
@font-face {
  font-family: 'iconfont';
  src: url('~@/static/iconfont/iconfont.ttf?t=1663995538547') format('truetype');
}

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 32rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@font-face {
  font-family: "DIN";
  src: url("https://saas60.wuyeface.com/online-assets/static/iconfont/DIN-Medium.otf")
}

@font-face {
  font-family: "PingFang SC";
  src: url('https://saas60.wuyeface.com/online-assets/static/iconfont/PingFangSC.ttf')
}

.DIN {
  font-family: 'DIN' !important;
}

// 全局设置默认字体
html {
  font-family: 'PingFang SC';
}

// 兼容之前商城样式
.uni-page-body {
  height: 100%;
}

page {
  height: 100%;
}

/* 解决小程序和app滚动条的问题 */
/* #ifdef MP-WEIXIN || APP-PLUS */
::-webkit-scrollbar {
  display: none;
}

/* #endif */
/* 解决H5 的问题 */
/* #ifdef H5 */
uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
  /* 隐藏滚动条，但依旧具备可以滚动的功能 */
  display: none
}

/* #endif */
</style>
