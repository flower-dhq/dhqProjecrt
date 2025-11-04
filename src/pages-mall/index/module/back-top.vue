<template>
	<view v-if="scrollTop>1400" class="backTop" :class="{'mescroll-fade-in':isShowToTop}" @click="toTopClick">
    <cl-icon name="cl-icon-top" :size="32"></cl-icon>
    <text class="backtop-text">顶部</text>
	</view>
</template>

<script>
	export default {
		name: "backTop",
		props: {
			scrollTop: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				isShowToTop: true
			}
		},
		methods: {
			toTopClick() {
				this.isShowToTop = false; // 回到顶部按钮需要先隐藏,再执行回到顶部,避免闪动

        uni.pageScrollTo({
          scrollTop: 0,
          duration: 300
        });

			}
		},

	}
</script>

<style>
	.mescroll-lazy-in,
	.mescroll-fade-in {
		-webkit-animation: mescrollFadeIn .3s linear forwards;
		animation: mescrollFadeIn .3s linear forwards;
	}

	.backTop {
		z-index: 999;
		position: fixed;
		right: 20rpx;
    bottom: calc(var(--window-bottom) + 150rpx);
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
    /* background-color: #fff; */
    background-color: rgba(255, 255, 255, 0.8);
		transform: translateZ(0);
		-webkit-transform: translateZ(0);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
	}

  .backtop-text{
    font-size: 18rpx;
    color: #444;
  }


</style>
