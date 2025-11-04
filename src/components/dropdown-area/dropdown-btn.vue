<template>
  <view :class="['dropdown-btn', getCustomClass]" :style="[THEME_CSS_VAR, getCustomStyle]" catchtouchmove="moveHandle">
    <view :class="['overlay-wrap', { show: maskShow, hide: !maskAnimate }]" :style="{ top: maskTop }" catchtouchmove @tap="showMenuEvent({ isShow: false})"></view>
    <view class="dropdown-box" :style="[{ zIndex: navIndex }]">
      <view class="btn-panel" :style="[getNavigatorStyle]" @tap="showMenuEvent">
        <text class="btn-text">{{ label }}</text>
        <image :src="require(`@/static/${THEME_NAME}/kanban/icon-white-down.png`)" style="width:16rpx;height:16rpx;margin-left: 10rpx;"></image>
      </view>
      <view :class="['content-panel', { show: maskShow, hide: !maskAnimate }]" :style="[getContentStyle]">
        <dropdown-project :routerName="routerName" :isAllArea="isAllArea" ref="dropdownProject" :autoInit="autoInit" :isAll="isAll" show @confirm="confirmEvent" />
      </view>
    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import DropdownProject from './dropdown-project.vue'

/**
 * @event showMask 隐藏菜单栏事件
 * @event hideMask 显示菜单栏事件
 * @event confirm 确认事件
 * @function showMaskEvent 显示/隐藏遮罩层
 */
export default {
  name: 'DropdownBtn',
  mixins: [mpMixin],
  components: {
    DropdownProject
  },
  props: {
    /**设置导航条高度 */
    navHeight: {
      type: String,
      default: '60rpx'
    },
    /**设置导航条的z-index */
    navIndex: {
      type: Number,
      default: 0
    },
    /**下拉菜单距离导航条的距离 */
    contentTop: {
      type: String,
      default: '0rpx'
    },
    /**下拉菜单的高度 */
    contentHeight: {
      type: String,
      default: '200rpx'
    },
    // 遮罩层距离顶部
    maskTop: {
      type: String,
      default: '0rpx'
    },
    // 是否显示全部项目，默认true
    isAll: {
      type: Boolean,
      default: true
    },
    isAllArea: {
      type: Boolean,
      default: false
    },
    autoInit: {
      type: Boolean,
      default: true
    },
    routerName:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      maskShow: false,
      maskAnimate: false,
      label: '全部'
    }
  },
  computed: {
    getNavigatorStyle() {
      return {
        height: this.navHeight,
        zIndex: this.navIndex
      }
    },
    getContentStyle() {
      let [_1, navHeight, navPrefix] = this.navHeight.match(/^(\-?\d+(?:\.\d+)?)(.+)/)
      navHeight = navHeight ? parseFloat(navHeight) : 0
      let [_2, contentTop, contentPrefix] = this.contentTop.match(/^(\-?\d+(?:\.\d+)?)(.+)/)
      contentTop = contentTop ? parseFloat(contentTop) : 0

      return {
        top: navHeight + contentTop + (navPrefix || contentPrefix),
        zIndex: this.navIndex - 1,
        height: this.contentHeight
      }
    }
  },
  methods: {
    async showMenuEvent({ isShow }) {
      if (typeof(isShow) == 'boolean') {
        isShow = isShow
      } else {
        isShow = !this.maskShow
      }

      this.showMaskEvent(isShow)
    },
    // 显示/隐藏遮罩层
    showMaskEvent(isShow) {
      if (isShow) {
        this.maskAnimate = true
        setTimeout(() => {
          this.maskShow = true
          this.$emit('showMask')
        }, 0)
      } else {
        this.maskShow = false
        setTimeout(() => {
          this.maskAnimate = false
          this.$emit('hideMask')
        }, 200)
      }
    },
    confirmEvent(item) {
      let projectId = item.project.projectId==''? item.project.projectId : item.project.projectId + ''
      let areaId = item.area.areaId =='' ? item.area.areaId : item.area.areaId + ''
      this.label = projectId == '' ? '公司项目' : projectId.includes('-all') ? item.area.areaName : item.project.projectName

      this.showMaskEvent(false)
      this.$emit('confirm', { areaId, projectId: projectId.includes('-all') ? '' : projectId })
    },
    iniArea(areaId, projectId){
      this.$refs.dropdownProject.iniArea(areaId, projectId);
    },
  }
}
</script>

<style lang="scss" scoped>
.overlay-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  transition: background-color 0.15s linear;
  z-index: 10;

  &.show {
    background-color: rgba(0, 0, 0, 0.5);
  }
  &.hide {
    display: none;
  }
}
.dropdown-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  z-index: 11;
  width: 100%;
}
.btn-panel {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 204rpx;
  height: 60rpx;
  background-color: var(--app-primary-color);
  color: #fff;
  border-radius: 6rpx;
  font-size: 26rpx;
  font-family: 'PingFang SC';
  padding: 0 10rpx;
  box-sizing: border-box;
}
.btn-text {
  @include ellipsis(1)
}
.content-panel {
  width: 100vw;
  background-color: #fff;
  transform-origin: 0 0;
  transform: scaleY(0);
  position: absolute;
  left: 0;

  &.show {
    // transition: transform 0.15s linear;
    transform: scaleY(1);
  }
  &.hide {
    display: none;
  }
}
</style>
