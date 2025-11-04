<template>
  <view class="mask" :class="!show ? '' : 'mask-show'" :style="{ backgroundColor: show ? maskBg : 'rgba(0,0,0,0)' }" @tap="tapMask">
    <view class="popups" :class="[theme]" :style="{ top: popupsTop, left: popupsLeft, flexDirection: direction }">
      <text :class="dynPlace" :style="{ width: '0px', height: '0px' }" v-if="triangle"></text>
      <view v-for="(item, index) in popData" :key="index" @tap.stop="tapItem(item)" class="itemChild view" :class="[direction == 'row' ? 'solid-right' : 'solid-bottom', item.disabled ? 'disabledColor' : '']">
        <image class="image" :src="item.icon" v-if="item.icon"></image>
        {{ item.title }}
      </view>
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    maskBg: {
      type: String,
      default: 'rgba(0,0,0,0)'
    },
    placement: {
      type: String,
      default: 'default' //default top-start top-end bottom-start bottom-end
    },
    direction: {
      type: String,
      default: 'column' //column row
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    value: {
      type: Boolean,
      default: false
    },
    popData: {
      type: Array,
      default: () => []
    },
    theme: {
      type: String,
      default: 'light' //light dark
    },
    triangle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      popupsTop: '0px',
      popupsLeft: '0px',
      show: false,
      dynPlace: ''
    }
  },
  mounted() {
    this.popupsPosition()
  },
  methods: {
    tapMask() {
      this.$emit('input', !this.value)
    },
    tapItem(item) {
      if (item.disabled) return
      this.$emit('tapPopup', item)
      this.$emit('input', !this.value)
    },
    async popupsPosition() {
      let promise = new Promise((resolve, reject) => {
        let popupsDom = uni.createSelectorQuery().in(this).select('.popups')
        popupsDom
          .fields(
            {
              size: true
            },
            (data) => {
              console.log(data)
              let width = data.width
              let height = data.height
              console.log(this.y, this.x)
              switch (this.dynPlace) {
                case 'top-start':
                  this.popupsTop = `${this.y + 9}px`
                  this.popupsLeft = `${this.x - 15}px`
                  break
                case 'top-end':
                  this.popupsTop = `${this.y + 9}px`
                  this.popupsLeft = `${this.x + 15 - width}px`
                  break
                case 'bottom-start':
                  this.popupsTop = `${this.y - 18 - height}px`
                  this.popupsLeft = `${this.x - 15}px`
                  break
                case 'bottom-center':
                  this.popupsTop = `${this.y - height - 11}px`
                  this.popupsLeft = `${this.x - width / 2}px`
                  console.log(this.popupsTop, this.popupsLeft)
                  break
                case 'bottom-end':
                  this.popupsTop = `${this.y - height}px`
                  this.popupsLeft = `${this.x - width}px`
                  break
              }
              resolve()
            }
          )
          .exec()
      })
      return promise
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: async function (newVal, oldVal) {
        if (newVal) await this.popupsPosition()
        this.show = newVal
      }
    },
    placement: {
      immediate: true,
      handler(newVal, oldVal) {
        this.dynPlace = newVal
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  transition: background 0.3s ease-in-out;
  visibility: hidden;

  &.mask-show {
    visibility: visible;
  }
}
.popups {
  position: absolute;
  padding: 10rpx 32rpx;
  border-radius: 5px;
  display: flex;
  .view {
    padding: 24rpx 0;
    font-size: 28rpx;
    color: #333333;
  }
  .image {
    display: inline-block;
    vertical-align: middle;
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
  }
}
.dark {
  background-color: #4c4c4c;
  color: #fff;
  .top-start:after {
    content: '';
    position: absolute;
    top: -18rpx;
    left: 10rpx;
    border-width: 0 20rpx 20rpx;
    border-style: solid;
    border-color: transparent transparent #4c4c4c;
  }
  .top-end:after {
    content: '';
    position: absolute;
    top: -18rpx;
    right: 10rpx;
    border-width: 0 20rpx 20rpx;
    border-style: solid;
    border-color: transparent transparent #4c4c4c;
  }
  .bottom-start:after {
    content: '';
    position: absolute;
    bottom: -18rpx;
    left: 10rpx;
    border-width: 20rpx 20rpx 0;
    border-style: solid;
    border-color: #4c4c4c transparent transparent;
  }
  .bottom-center:after {
    content: '';
    position: absolute;
    bottom: -18rpx;
    left: 10rpx;
    border-width: 20rpx 20rpx 0;
    border-style: solid;
    border-color: #4c4c4c transparent transparent;
  }
  .bottom-end:after {
    content: '';
    position: absolute;
    bottom: -18rpx;
    right: 10rpx;
    border-width: 20rpx 20rpx 0;
    border-style: solid;
    border-color: #4c4c4c transparent transparent;
  }
  .disabledColor {
    color: #c5c8ce;
  }
}
.light {
  color: #515a6e;
  box-shadow: 0upx 0upx 30upx rgba(0, 0, 0, 0.2);
  background: #fff;
  .top-start:after {
    content: '';
    position: absolute;
    top: -18rpx;
    left: 10rpx;
    border-width: 0 20rpx 20rpx;
    border-style: solid;
    border-color: transparent transparent #fff;
  }
  .top-end:after {
    content: '';
    position: absolute;
    top: -18rpx;
    right: 10rpx;
    border-width: 0 20rpx 20rpx;
    border-style: solid;
    border-color: transparent transparent #fff;
  }
  .bottom-start:after {
    content: '';
    position: absolute;
    bottom: -18rpx;
    left: 10rpx;
    border-width: 20rpx 20rpx 0;
    border-style: solid;
    border-color: #fff transparent transparent;
  }
  .bottom-center:after {
    content: '';
    position: absolute;
    bottom: -18rpx;
    left: 80rpx;
    border-width: 20rpx 20rpx 0;
    border-style: solid;
    border-color: #fff transparent transparent;
  }
  .bottom-end:after {
    content: '';
    position: absolute;
    bottom: -18rpx;
    right: 10rpx;
    border-width: 20rpx 20rpx 0;
    border-style: solid;
    border-color: #fff transparent transparent;
  }
  .disabledColor {
    color: #c5c8ce;
  }
}
.solid-bottom {
  border-bottom: 1rpx solid #eaeaea;
}
.solid-right {
  border-right: 1rpx solid #eaeaea;
}
.popups .itemChild:last-child {
  border: none;
}
</style>
