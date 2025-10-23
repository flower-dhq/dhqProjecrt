<style scoped lang="scss">
	.custom-search-input{
		$h: 68rpx;
		$fs: 28rpx;
		background-color: #fff;
		@include flx-dsp($jsc: flex-start, $ali: center);
		width: 100%;
		height: $h;
		padding: 10rpx 25rpx;
		box-sizing: border-box;
		& > view {
			@include flx-dsp($jsc: flex-start, $ali: center);
			width: 100%;
		}
		.icon-wr {
			width: 220rpx;
			height: 100%;
			@include flx-dsp($jsc: flex-end, $ali: center);
			padding-right: 10rpx;
			box-sizing: border-box;
			transition: width 0.2s;
		}
		.ic-shrink {
			width: 60rpx;
		}
		input {
			flex: 1;
			height: $h;
			line-height: $h;
			font-size: $fs;
		}
		.input-placeholder {
			font-size: $fs;
		}
	}
	
</style>

<template>
	<view class="custom-search-input" style="border-radius: 34rpx;background: #f6f6f6;">
		<view >
			<view class="icon-wr" :class="{ 'ic-shrink': search.shrink}"><cl-icon name="cl-icon-search" size="22" color="#999" ></cl-icon></view>
			<input
				@focus="focus"
				@blur="blur"
				@confirm="confirm"
				@input="input"
				@keyboardheightchange="keyboardheightchange"
				v-model="inputValue"
				type="text"
				placeholder-class="input-placeholder"
				:placeholder="placeholder"
			/>
			<text @tap="clear" >
				<cl-icon v-if="inputValue" name="cl-icon-close-border" size="26" color="#999" ></cl-icon>
			</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CustomSearchInput',
	data() {
		return {
			search: {
				keyWord: '',
				shrink: false
			}
		};
	},
	props: {
		value: {
			type: String,
			default: ''
		},
		closeIcon: {
			type: Boolean,
			default: true
		},
		placeholder: {
			type: String,
			default: '输入你要搜索的内容'
		}
	},
	computed: {
		inputValue: {
		     get () {
		       return this.value
		     },
		     set (val) {
		       this.$emit('update:value', val)
		     }
		   }
	}, 
	created() {
		
	},
	methods: {
		// 聚焦
		focus(evt) {
			this.search.shrink = true;
			this.$emit('focus', evt);
		},
		// 失去焦点
		blur(evt) {
			const v = this.value;
			this.search.shrink = v !== '';
			this.$emit('blur', evt);
		},
		// 搜索确认
		confirm(evt) {
			this.$emit('confirm', evt);
		},
		input (evt) {
			this.$emit('input', evt.detail.value);
		},
		keyboardheightchange () {
			this.$emit('keyboardheightchange', evt);
		},
		clear () {
			this.$emit('input', '');
			this.$emit('clear');
			setTimeout(_=>{
				this.search.shrink = this.value !== '';
			})
		},
		setShrink (shrink) {
			this.search.shrink = shrink;
		}
	}
};
</script>
