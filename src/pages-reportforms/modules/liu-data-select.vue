<template>
	<view class="select-main">
		<view @click.stop="showCard">
			<slot></slot>
		</view>
		<view v-if="show">
 			<view class="arrow" :style="{ background: bgColor, left: (left + 50) + 'rpx' }"></view>
			<view class="arrow-tip"
				:style="{ width: width + 'rpx', background: bgColor, left: left + 'rpx', borderRadius: radius + 'rpx' }"></view>
			<view class="card"
				:style="'height:' + (dHeight ? dHeight + 'rpx' : 'auto') + ';max-height:' + dMaxHeight + 'rpx;background-color:' + bgColor + ';border-radius:' + radius + 'rpx;width:' + width + 'rpx;right:0rpx;top:' + top + 'rpx;'">
				<view class="card-list" v-for="(item, index) in dataList" :key="index" @click="clickItem(item)"
					:style="{color:item.code==selectValue?'#2761FF':'#333333','font-size':fontSize+'rpx','line-height':lineHeight+'rpx'}">
 					{{ item.label }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		selectValue: {
			type: String,
			default: ''
		},
		//所点击元素id
		elementId: {
			type: String,
			default: ''
		},
		//下拉框数据源
		dataList: {
			type: Array,
			default: () => {
				return []
			}
		},
		//下拉框背景色
		bgColor: {
			type: String,
			default: '#FFFFFF'
		},
		//下拉框圆角(rpx)
		radius: {
			type: Number,
			default: 8
		},
		//下拉框宽度(rpx)，不传则默认取所点击元素的宽度
		dWidth: {
			type: Number,
			default: 0
		},
		//下拉框高度(rpx)，不传则默认由内容撑开
		dHeight: {
			type: Number,
			default: 0
		},
		//下拉框最大高度(rpx)，超出则内部滚动
		dMaxHeight: {
			type: Number,
			default: 400
		},
		//字体颜色
		color: {
			type: String,
			default: '#333333'
		},
		//字体大小(rpx)
		fontSize: {
			type: Number,
			default: 28
		},
		//字体行高(rpx)
		lineHeight: {
			type: Number,
			default: 66
		},
	},
	data() {
		return {
			show: false,
			width: 0,
			left: 0,
			top: 0,
			difference: 0
		}
	},
	watch:{
		selectValue(n,o){
		}
	},
	mounted() {
		this.$nextTick(() => {
			if (!this.elementId) return
			// #ifdef MP-WEIXIN
			this.createSelectorQuery().select('.select-main').boundingClientRect(res => {
				this.difference = res.left
				uni.createSelectorQuery().select('#' + this.elementId).boundingClientRect(rect => {
					const systemInfo = uni.getSystemInfoSync()
					const screenWidth = systemInfo.screenWidth
					if (!this.dWidth) {
						this.width = this.px2rpx(rect.width, screenWidth)
					} else {
						this.width = this.dWidth
					}
					this.left = this.px2rpx(rect.left - this.difference, screenWidth)
					this.top = this.px2rpx((rect.height + 15), screenWidth)
				}).exec()
			}).exec()
			// #endif
			// #ifndef MP-WEIXIN
			uni.createSelectorQuery().select('.select-main').boundingClientRect(res => {
				this.difference = res.left
				uni.createSelectorQuery().select('#' + this.elementId).boundingClientRect(rect => {
					const systemInfo = uni.getSystemInfoSync()
					const screenWidth = systemInfo.screenWidth
					if (!this.dWidth) {
						this.width = this.px2rpx(rect.width, screenWidth)
					} else {
						this.width = this.dWidth
					}
					this.left = this.px2rpx(rect.left - this.difference, screenWidth)
					this.top = this.px2rpx((rect.height + 15), screenWidth)
				}).exec()
			}).exec()
			// #endif
		})
	},
	methods: {
		showCard() {
			if (!this.elementId) return
			else this.show = !this.show
		},
		px2rpx(px, screenWidth) {
			return px / (screenWidth / 750)
		},
		//点击选项
		clickItem(item) {
			this.show = false
			console.log('item', item);
			this.$emit('change', item);


		}
	}
}
</script>

<style scoped>
.select-main {
	position: relative;
}

.card {
	position: absolute;
	box-sizing: border-box;
	z-index: 99999;
	overflow: auto;
	padding: 16rpx 20rpx;
	box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1);
}

.arrow {
	position: absolute;
	z-index: 999999;
	width: 20rpx;
	height: 20rpx;
	transform: rotate(135deg);
	bottom: -40rpx;
	box-shadow: -8rpx 6rpx 12rpx -4rpx rgba(0, 0, 0, 0.1);
}

.arrow-tip {
	position: absolute;
	z-index: 999999;
	height: 15rpx;
	bottom: -45rpx;
	left: 20rpx !important;
}
</style>