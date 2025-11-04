<template>
  <view :class="['dropdown-menu', getCustomClass]" :style="[THEME_CSS_VAR, getCustomStyle]" catchtouchmove="moveHandle">
    <view :class="['overlay-wrap', { show: maskShow, hide: !maskAnimate }]" :style="{ top: maskTop }" catchtouchmove @tap="showMenuEvent({ isShow: false})"></view>
    <view class="dropdown-box" :style="[{ zIndex: navIndex }]">
      <view class="navigator-panel" :style="[getNavigatorStyle]">
        <view class="navigator-text-panel" :style="[getNavItemStyle]" v-for="(item, index) in dataForm" :key="index" @tap="showMenuEvent({ itemData: item })">
          <text>{{ item.label }}</text>
					<image v-if="item.label == '筛选'" :src="require(`@/static/${THEME_NAME}/common/screen-icon.png`)" style="width:24rpx;height:24rpx;" />
					<image v-else :src="require(`@/static/${THEME_NAME}/common/down-icon.png`)" style="width:24rpx;height:24rpx;" />
        </view>
      </view>
      <view :class="['content-panel', { show: maskShow, hide: !maskAnimate }]" :style="[{ top: navHeight, zIndex: navIndex - 1, minHeight: contentMinHeight, height: contentHeight, overflow: 'hidden' }]">
        <slot :item="selItem"></slot>
      </view>
    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'

/**
 * @event showMask 隐藏菜单栏事件
 * @event hideMask 显示菜单栏事件
 * @function showMaskEvent 显示/隐藏遮罩层
 */
export default {
  name: 'DropdownMenu',
  mixins: [mpMixin],
  props: {
    /**设置导航条高度 */
    navHeight: {
      type: String,
      default: '88rpx'
    },
    /**设置导航条的z-index */
    navIndex: {
      type: Number,
      default: 0
    },
    /**
     * @typedef {object} ItemData
     * @property {string} label 文本
     * @property {string} name 唯一id，必填
     * @property {string} icon uni-icon的图标
     */
    /**
     * @type {import('vue/types/options').PropValidator<Array<ItemData>>} 数据
     */
    dataForm: {
      type: Array,
      default: () => []
    },
    /**下拉菜单的最小高度 */
    contentMinHeight: {
      type: String,
      default: '200rpx'
    },
    /**下拉菜单的固定高度 */
    contentHeight: {
      type: String,
      default: '200rpx'
    },
    // 遮罩层距离顶部
    maskTop: {
      type: String,
      default: '0rpx'
    }
  },
  data() {
    return {
      maskShow: false,
      maskAnimate: false,
      selItem: {}, // 被选中的菜单
      loading: false, // 动画在执行中
    }
  },
  computed: {
    getNavigatorStyle() {
      return {
        height: this.navHeight,
        zIndex: this.navIndex
      }
    },
    getNavItemStyle() {
      return {
        flexBasis: (100 / this.dataForm.length) + '%'
      }
    }
  },
  methods: {
    async showMenuEvent({ isShow, itemData = {} }) {
      if (typeof(isShow) == 'boolean') {
        isShow = isShow
      } else if (itemData.name && itemData.name != this.selItem.name) {
        // 切换菜单操作
        isShow = true
      } else {
        isShow = !this.maskShow
      }

      this.showMaskEvent(isShow, itemData)
    },
    // 显示/隐藏遮罩层
    showMaskEvent(isShow, itemData) {
      if (this.loading) return
      this.loading = true

      if (isShow) {
        this.maskAnimate = true
        this.selItem = itemData
        setTimeout(() => {
          this.loading = false
          this.maskShow = true
          this.$emit('showMask', this.selItem)
        }, 150)
      } else {
        this.maskShow = false
        setTimeout(() => {
          this.loading = false
          this.maskAnimate = false
          this.selItem = {}
          this.$emit('hideMask')
        }, 200)
      }
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
.navigator-panel {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #EAEAEA;
}
.navigator-text-panel {
  flex: 1 1 auto;
  height: 100%;
  text-align: center;
  font-size: 26rpx;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content-panel {
  width: 100%;
  background-color: #fff;
  transition: transform 0.15s linear;
  transform-origin: 0 0;
  transform: scaleY(0);
  position: absolute;
  left: 0;

  &.show {
    transform: scaleY(1);
  }
  &.hide {
    display: none;
  }
}
</style>