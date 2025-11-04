<template>
  <view :class="['dropdown-universal', getCustomClass]" :style="[THEME_CSS_VAR, getCustomStyle]" catchtouchmove="moveHandle">
    <view :class="['overlay-wrap', { show: maskShow, hide: !maskAnimate }]" :style="{ top: maskTop }" catchtouchmove @click="showMaskEvent(false)"></view>
    <view class="dropdown-box">
      <view :class="['content-panel', { show: maskShow, hide: !maskAnimate }]" :style="[{ top: contentTop, height: contentHeight }]">
        <!-- 下拉内容 -->
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'

/**
 * 下拉菜单组件
 * @property {boolean} show 显示/隐藏。使用 .sync
 * @event showMask 隐藏菜单栏事件
 * @event hideMask 显示菜单栏事件
 */
export default {
  name: 'DropdownUniversal',
  mixins: [mpMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    /**下拉菜单的高度 */
    contentHeight: {
      type: String,
      default: '200rpx'
    },
    contentTop: {
      type: String,
      default: '0rpx'
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
  watch: {
    // 不能设置immediate，会导致一开始就执行了hideMask事件
    show(newVal, oldVal) {
      this.showMaskEvent(newVal === true)
    }
  },
  methods: {
    // 显示/隐藏遮罩层
    showMaskEvent(isShow) {
      if (this.loading) return
      this.loading = true

      if (isShow) {
        this.maskAnimate = true
        setTimeout(() => {
          this.loading = false
          this.maskShow = true
          this.$emit('update:show', true)
          this.$emit('showMask')
        }, 150)
      } else {
        this.maskShow = false
        setTimeout(() => {
          this.loading = false
          this.maskAnimate = false
          this.$emit('update:show', false)
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
  z-index: 100;

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
  z-index: 101;
  width: 100%;
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