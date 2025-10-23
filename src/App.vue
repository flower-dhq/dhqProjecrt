<script>
import commLogic from '@/js/comm-logic';

export default {
  onLaunch: function () {
     // #ifdef MP-WEIXIN      
      // 搬家到首页去  避免分享页面进来时候被清空存储信息接口异常
      // uni.clearStorageSync();
      this.Update();  
    // #endif
    //#ifdef APP-PLUS
    commLogic.isLogin();
    //#endif
    const { PROGRAM_TYPE } = this.$appConfig;
     //  业主打包成h5给APP获取用户信息
    if (PROGRAM_TYPE == 'appH5') {
      let init = () => {
        commLogic.getLocalUserInfo();
        // commLogic.setTabbar();
        commLogic.setProjectType();
        commLogic.setInterceptor(); 
      }
      document.addEventListener('deviceready', init, false)
    } else {
      // commLogic.setTabbar();
      commLogic.setProjectType();
      commLogic.setInterceptor();
    }



  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
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
  }
};
</script>

<style lang="scss">
/*每个页面公共css */

// 组件库
@import 'uview-ui/index.scss';
@import 'cl-uni/index.scss';
@import '@/theme-skin/u-view-var.scss';
@import '@/theme-skin/uni-ui-var.scss';

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

/* #endif */</style>
