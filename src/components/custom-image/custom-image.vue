<style scoped lang="scss">
	.custom-image{
		display: inline-block;
		width: 100%;
		height: 100%;
		background-color: #e4e4e4;
		display: flex;
		justify-content: center;
		align-items: center; 
		&.no-background-color{
			background-color: transparent;
		}
		.img-show{
			display: block; 
		}
		& > image{
			display: none;
			width: 100%;
			height: 100%;
		}
		& > image.default-img{
			width: 50%;
			height: 43%;
		}
	}
	
</style>

<template>
	<view class="custom-image" :class="{'no-background-color': loadStatus === 'loaded'}">
		<image class="default-img" :style="{width: plhW, height: plhH}" :class="{'img-show': loadStatus === 'loading'}"  mode="aspectFit" :lazyLoad="lazyLoad" :fadeShow="fadeShow"  src="@/pages-mall/static/default_img.png"></image>
		<image class="default-img" :style="{width: plhW, height: plhH}" :class="{'img-show': loadStatus === 'error'}"  mode="aspectFit" :lazyLoad="lazyLoad" :fadeShow="fadeShow"  src="@/pages-mall/static/default_img.png"></image>
		<image :class="{'img-show': loadStatus === 'loaded'}" :mode="mode" @error="error"  @load="load" :src="src"></image>
	</view>
</template>

<script>
export default {
	name: 'CustomIamge',
	data() {
		return {
			loadStatus: 'loading'
		};
	},
	props: {
		src: {
			type: String,
			default: ''
		},
		mode: {
			type: String,
			default: 'aspectFill'
		},
		lazyLoad: {
			type: Boolean,
			default: false
		},
		fadeShow: {
			type: Boolean,
			default: true
		},
		plhW: {
			type: String,
			default: '50%'
		},
		plhH: {
			type: String,
			default: '43%'
		}
	},
	onLoad() {},
	onShow() {},
	methods: {
		error(evt) {
			this.loadStatus = 'error';
			this.$emit('error', evt);
		},
		load(evt) {
			this.loaded = true;
			this.loadStatus = 'loaded';
			this.$emit('load', evt);
		}
	}
};
</script>
