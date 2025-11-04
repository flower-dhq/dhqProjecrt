<style lang="scss" scoped>
.index {
  position: relative;
  width: 100%;
  background-color: #f5f6f8;
  min-height: 100vh;
  box-sizing: border-box;
  $itv: 24rpx;
  padding-top: calc(#{$itv});

  .bgc {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 160rpx;
    background-color: var(--app-primary-color);
  }

  .section {
    position: relative;
    z-index: 1;
    background-color: #fff;
    width: 710rpx;
    border-radius: 8rpx;
    margin: 0rpx auto $itv auto;
    box-sizing: border-box;
    padding: 24rpx 0;

    &__label {
      position: relative;
      display: block;
      color: #000;
      font-weight: bold;
      font-size: 32rpx;
      padding-bottom: 16rpx;
      padding: 0 32rpx 16rpx 32rpx;

      &::before {
        position: absolute;
        left: 0;
        bottom: 0;
        display: block;
        content: '';
        width: 100%;
        height: 1rpx;
        transform: translateY(50%);
        background-color: #eaeaea;
      }
    }

    &__content {
      margin-top: 20rpx;
      padding: 0 12rpx;
      @include flx-dsp($jsc: flex-start, $ali: center);
      flex-wrap: wrap;
    }

    &__function {
      @include flx-dsp($jsc: flex-start, $ali: center, $drt: column);
      width: calc(100% / 4);
      margin: 20rpx 0;

      ::v-deep .u-image {
        width: 48rpx !important;
        height: 48rpx !important;

        .u-image__loading,
        .u-image__image {
          width: 100% !important;
          height: 100% !important;
        }
      }

      text {
        display: block;
        width: 100%;
        margin-top: 16rpx;
        color: #000;
        font-size: 26rpx;
        text-align: center;
      }
    }

    .skeleton-function {
      .skeleton-img {
        width: 24px;
      }

      .skeleton-name {
        margin-top: 10px;
        width: 38px;
      }
    }
  }

  .lockBox {
    // height: 100%;
    background: #FFFFFF;
    text-align: center;

    position: absolute;
    left: 0;
    right: 0;
    top: 20%;
    margin: 0 auto; 

    image {
      width: 540rpx;
      height: 300rpx;
    }

    .lock-text {
      font-size: 28rpx;
      font-weight: bold;
      line-height: 30rpx;
      color: #333333;
    }

    .lock-text2 {
      font-size: 24rpx;
      font-weight: 400;
      line-height: 30rpx;
      color: #999999;
      height: 38px;
      line-height: 38px;
    }
   .lock-btn{ 
    display: flex;
    align-items: center;
    justify-content: center;
   }
    .close-btn {
      background: #1989F7;
      font-size: 30rpx;
      color: #FFFFFF;
      width: 330rpx; 
      height: 80rpx;
      line-height: 80rpx; 
    }

  }
}

.indexBg {
  background: #FFFFFF;
}
</style>

<template>
  <view class="index" :class="[menus.length > 0 ? '' : 'indexBg']" :style="[THEME_CSS_VAR]">
    <template v-if="loading">
      <view class="section" v-for="(i) in 3" :key="i">
        <view class="section__label"><u-skeleton titleWidth="50" titleHeight="10" :loading="true"
            :animate="true"></u-skeleton></view>
        <view class="section__content">
          <view class="section__function skeleton-function" v-for="(j) in [1, 2, 3, 4]" :key="j">
            <view class="skeleton-img"><u-skeleton rowsWidth="24" titleWidth="24" titleHeight="24" avatarShape
                :loading="true" :animate="true"></u-skeleton></view>
            <view class="skeleton-name"><u-skeleton titleWidth="38" titleHeight="10" :loading="true"
                :animate="true"></u-skeleton></view>
          </view>
        </view>
      </view>
    </template>
    <template v-else-if="menus.length > 0">
      <view class="bgc"></view>
      <view class="section" v-for="(item, index) in menus" :key="index">
        <text class="section__label"> {{ item.label }}</text>
        <view class="section__content">
          <view class="section__function" v-for="(func, fIdx) in item.list" :key="fIdx" @click="skip(func)">
            <u--image width="24" height="24" :src="require(`@/static/index/${func.icon}.png`)"></u--image>
            <text>{{ func.name }}</text>
          </view>
        </view>
      </view>
    </template>
    <template v-if="noPermissions">
      <view class="lockBox">
        <view>
          <image :src="require(`@/static/theme-default/common/lock.png`)"></image>
        </view>
        <view class="lock-text">您没有权限访问该页面</view>
        <view class="lock-text2">如需访问，请联系系统管理员开通权限</view>
        <view class="lock-btn" slot="confirmButton">
          <navigator open-type="exit" target="miniProgram" class="close-btn complete">我知道了</navigator>
        </view>
      </view>
    </template>

    <add-order-popup :show.sync="showAddOrder" :customStyle="{bottom: '50px'}" />

    <!-- 底部导航栏 -->
    <c-tabbar :value="0"></c-tabbar>
  </view>
</template>

<script>
import cTabbar from '@/components/c-tabbar.vue';
import AddOrderPopup from '../modules/add-order-popup.vue'
import { getFunctionButtons2 } from '@/service/landcrm'
import utils from '@/js/utils';
import MenuList from './menu'

export default {
  components: {
    cTabbar,
    AddOrderPopup
  },
  data() {
    return {
      menus: [],
      showAddOrder: false,
      loading: false,
      noPermissions:false,
    };
  },
  methods: {
    // 获取首页菜单权限
    async getMenu() {
      const { O_USER_INFO } = this.$constant
      const userInfo = utils.storageAction({ key: O_USER_INFO, action: 'get' })

      const params = {
        data: {
          userId: userInfo.userId,
          menuTypes: 101,
          belongSystem: 'gj_applet'
        },
        hideLoading: true,
        responseToast: false,
      }
      const res = await getFunctionButtons2(params).finally(() => {
        uni.hideLoading()
      })

      /**
       * @type {Array<{name: string, items: Array<{name: string}>}>}
       */
      const data = res?.data?.[0]?.items ?? []
      if (res.resultCode !== 200 || data.length == 0) {
        // 跳转到无权限页面
        this.noPermissions = true
        return
      }

      /**
       * 将原菜单里的 list 数组转换为以 name 为key的对象，name表示菜单名称
       * @type {Record<string, {name: string, icon: string, path: string}>}
       */
      const originMenu = MenuList.reduce((store, group) => {
        const child = group.list || []
        child.forEach(item => {
          const key = item.name
          if (key) {
            store[key] = item
          }
        })
        return store
      }, {})

      // 判断该分组是否属于菜单分组
      const hasGroup = (groupName) => {
        return groupName && MenuList.some(item => item.label == groupName)
      }

      // 将接口请求到的分组，过滤出只属于当前菜单的分组
      const reqMenu = data.filter(item => hasGroup(item.name))

      this.menus = reqMenu.map(group => {
        return {
          label: group.name,
          list: group.items.map(item => {
            const key = item.name
            if (['数据报告', '运营日志'].includes(key)) {
              return originMenu['运营日志']
            } else {
              return originMenu[key]
            }
          }).filter(Boolean)
        }
      })

      if (this.menus.length == 0) {
        this.noPermissions = true
      }

      // if (result.resultCode == 200 && result.data) {
      //   let list = result.data?.[0]?.items ?? [];
      //   let sj = {};
      //   list.forEach(item => {
      //     let child = item?.items ?? [];
      //     sj[item.name] = child;
      //   });
      //   let defaultMenus = JSON.parse(JSON.stringify(this.menusList))
      //   let data = defaultMenus.filter((item) => {
      //     if (sj.hasOwnProperty(item.label)) {
      //       let child = sj[item.label];
      //       let menuList = item.list;
      //       const childArr = menuList.filter(x => child.some(y => {
      //         if(y.name === x.name) {
      //           return true
      //         } else if(x.name == "运行日志") {
      //           if(y.name == "数据报告" || y.name == "运行日志") {
      //             return true;
      //           }
      //           else {
      //             return false;
      //           }
      //         } else {
      //           return false
      //         }
      //       }));
      //       item.list = childArr;
      //       return item;
      //     }
      //   })
      //    this.menus = data;
      //   this.noPermissions = data.length == 0; 
      //  }else{
      //   this.noPermissions = true;
      //  }
    },

    skip({ path, name, showModal }) {
      if (showModal) {
        this[showModal] = true;
        return;
      }
      if (['催收管理', '发票管理'].includes(name)) {
        const title = name == '业户档案' ? '业主档案' : '收费宝'
        uni.navigateTo({ url: `/pages/webview/webview?url=${encodeURIComponent(path)}&title=${title}` })
      } else if (typeof (path) == 'string') {
        uni.navigateTo({ url: path })
      } else if (typeof (path) == 'function') {
        path.call(this)
      } else {
        uni.showModal({
          title: '提示',
          content: '功能暂未开放',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        });
      }
    }
  },
  async onLoad() {
    uni.showLoading({ title: '加载中' })

    // #ifdef MP-WEIXIN
    const res = wx.getSystemInfoSync();
    if (res.environment) {
      await this.$onLaunched;
    }
    // #endif
    // 用户是否开启企微
    let { O_USER_INFO } = this.$constant;
    let userInfo = utils.storageAction({ key: O_USER_INFO, action: 'get' });
    if(userInfo && userInfo.isEnableQw && userInfo.isEnableQw == 1){
      this.getMenu();
    } else{
      uni.hideLoading()
      this.noPermissions = true;
    }

  }
};
</script>
