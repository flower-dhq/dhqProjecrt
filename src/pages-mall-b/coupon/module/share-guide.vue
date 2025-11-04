<template>
	<view>
        <view class="tui-alert-mask" :class="[show?'tui-alert-mask-show':'']"  >
            <view style="position: absolute;top: 0;right: 0;">
                <view>
                    <image src="/pages-mall-b/static/point_bg.png" style="width: 400rpx;" mode="widthFix" />
                </view>
                <view @click="handleClose" style="text-align: center;">
                    <image src="/pages-mall-b/static/point_btn.png" style="width: 60%;" mode="widthFix" />
                </view>
            </view>
        </view>
	</view>
</template>

<script>
	export default {
		name: 'ShareGuide',
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			handleClose() {
				this.$emit("close")
			}
		}
	}
</script>

<style scoped>
.tui-alert-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1110;
  opacity: 0;
  outline: 0;
  text-align: center;
  -ms-transform: scale(1.185);
  transform: scale(1.185);
  backface-visibility: hidden;
  perspective: 2000upx;
  background: rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease-in-out 0s;
  pointer-events: none;
}
.tui-alert-mask-show {
  opacity: 1;
  transition-duration: 0.3s;
  -ms-transform: scale(1);
  transform: scale(1);
  overflow-x: hidden;
  overflow-y: auto;
  pointer-events: auto;
}
</style>
