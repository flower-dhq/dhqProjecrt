<style scoped lang="scss">
$cw: 690rpx;
$br: 16rpx;

::v-deep .cl-popup{
	border-radius: $br $br 0 0 !important;
	.cl-popup__container{
		padding: 0 !important;
	}
}
.select-city{
	width: 100%;
	border-radius: $br $br 0 0;
	&-header{
		width: 100%;
		height: 106rpx;
		border-radius: $br $br 0 0;
		border-bottom: 1rpx solid #eee;
		.header-content{
			margin: 0 auto;
			width: $cw;
			height: 100%;
			@include flx-dsp($jsc: space-between, $ali: center);
			font-size: 28rpx;
			color: $uni-color-primary;
			.title{
				color: #333;
			}
		}
	}
	&-body{
		position: relative;
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		.city-loading{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: transparent;
			@include flx-dsp($jsc: center, $ali: center);
		}
		.city-value{
			@include flx-dsp($jsc: flext-start, $ali: center);
			background-color: #fff;
			.value-item{
				position: relative;
				padding: 20rpx 0;
				margin-right: 30rpx;
				&:last-child{
					margin-right: 0;
				}
				&.current-index{
					.line{
						background-color: $uni-color-primary;
					}
					.value-text{
						color: $uni-color-primary;
					}
				}
				text.value-text{
					font-size: 32rpx;
				}
				.line{
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 60rpx;
					height: 4rpx;
					background-color: transparent;
				}
			}
		}
		.city-option{
			height: 500rpx;
			overflow-y: auto;
			margin-top: 10rpx;
			padding: 10rpx 0;
			.option-row{
				@include flx-dsp($jsc: space-between, $ali: center);
				height: 70rpx;
				& > text {
					font-size: 28rpx;
				}
				::v-deep .cl-icon-check{
					color: transparent !important;
				}
				::v-deep .selected  .cl-icon-check, .selected{
					color: $uni-color-primary !important;
				}
			}
		}
	}
}
</style>

<template>
	<cl-popup :visible.sync="visible"  direction="bottom">
		<view class="select-city">
			<view class="select-city-header">
				<view class="header-content">
					<text @tap="cancel">取消</text>
					<text class="title">{{title}}</text>
					<text @tap="confirm">确定</text>
				</view>
			</view>
			<view class="select-city-body">
				<view class="city-loading" v-if="loading">
					<cl-loading theme="spin"></cl-loading>
				</view>
				<view class="city-value">
					<view class="value-item" @tap="tapValue({index, data: item})" :class="{'current-index': index === selectedIndex}" v-for="(item, index) in cityValue" :key="index">
						<text class="value-text">{{item.label ? item.label : '请选择'}}</text>
						<text class="line"></text>
					</view>
				</view>
				<scroll-view class="city-option" scroll-y="true">
					<view class="option-row" v-for="(item, index) in cityOption[selectedIndex]" :key="index" @tap="tapOption({data: item, index})">
						<text>{{item.label}}</text>
						<cl-icon :class="{'selected': optionSelected({index})}" name="cl-icon-check" size="40"></cl-icon>
					</view>
				</scroll-view>
			</view>
		</view>
		<cl-toast ref="toast"></cl-toast>
	</cl-popup>
</template>

<script>
	export default {
		data() {
			return {
				visible: false,
				selectedIndex: 0,
				cityValue: [],
				cityOption: [],
				loading: false,
				lastSelected: ''
			}
		},
		options: { styleIsolation: 'shared' },
		props: {
			title: {
				type: String,
				default: '选择所在区域'
			},
			initValue: {
				type: String,
				default: ''
			}
		},
		methods: {
			openSelect() {
				this.visible = true;
			},
			optionSelected(params = {}) {
				const {index} = params;
				const selectedIndex = this.selectedIndex;
				const vIdx = this.cityValue[selectedIndex].index;
				return index === vIdx;
			},
			getCityData(params = {}) {
				const {level = 0, code, indexCode, inc, selectedIndex: vidx, init, isEnd} = params;
				const args = {
					// header: {'token': '355f4660ec980234adcc0ea7a444c8a5'},
					data: {criSuperiorCode: code},
					hideLoading: true
				}
				let pms = null;
				switch(level) {
					case 0:
					pms = this.$mallApi.data.getAllProvince()
					break
					case 1:
					pms = this.$mallApi.data.getChildrenCity(code)
					break
					case 2:
					pms = this.$mallApi.data.getChildrenCity(code)
					break
					case 3:
					pms = this.$mallApi.data.getChildrenCity(code)
					break
				}
				if (pms) {
					this.loading = true;
					return pms.then(res => {
						this.loading = false;
						if (res.statusCode == 200) {
							const list = Array.isArray(res.data) ? res.data : [];
							let selectedIndex = vidx !== undefined ? vidx : null;
			
							list.forEach((item, index) => {
								const {name, code} = item;
								const cityOption = this.cityOption[level];
								const city = {
									...item,
									label: name,
									value: code
								}
								if ((vidx === undefined && init) && indexCode === code) {
									selectedIndex = index;
								}
								if (cityOption) {
									cityOption.push(city)
								} else {
									this.cityOption[level] = [city]
								}
							})
							if (init) {
								const option = this.cityOption[this.selectedIndex];
								const {label, value} = option && option[selectedIndex];
								this.cityValue[this.selectedIndex] = {
									label,
									value,
									index: selectedIndex
								}
								if (!isEnd) this.selectedIndex++;
							} else  {
								if (inc) {
									const option = this.cityOption[this.selectedIndex];
									const {label, value} = option && option[selectedIndex];
									this.cityValue[this.selectedIndex] = {
										label,
										value,
										index: selectedIndex
									}
									this.selectedIndex = ++this.selectedIndex;
								}
								if (list.length) this.cityValue[level] = {};
							}
							
						}
					})
				} else {
					const option = this.cityOption[this.selectedIndex];
					const {label, value} = option && option[vidx];
					this.cityValue[this.selectedIndex] = {
						label,
						value,
						index: vidx
					}
					this.$forceUpdate();
					return Promise.resolve()
				}
				
			},
			tapValue(params = {}) {
				const {data, index} = params;
				this.selectedIndex = index;
			},
			tapOption(params = {}){
				const {data, index} = params;
				const {value} = data || {};
				this.updateOption();
				this.getCityData({level: this.selectedIndex + 1, code: value, inc: 1, selectedIndex: index});
			},
			updateOption() {
				const spliceIndex = this.selectedIndex + 1;
				this.cityValue.splice(spliceIndex);
				this.cityOption.splice(spliceIndex);
			},
			confirm() {
				const cityValue = this.cityValue;
				const validCity = cityValue.length === 4 && !cityValue.some(item => !item.label)
 				if (!validCity) return this.toastTips({message: '必须填选完省市区街道/镇'});
				const {code, name} = (_ => {
					let codeStr = '', nameStr = '';
					cityValue.forEach((item, index) => {
						if (item.value) {
							codeStr += `${item.value}${index === cityValue.length - 1 ? '' : ','}`;
							nameStr += item.label
						}
					})
					return {code: codeStr, name: nameStr}
				})()
				const evt = {
					selectedCity: cityValue,
					selectedCityCode: code,
					selectedCityName: name
				}
				this.lastSelected = code;
				this.$emit('confirm', evt);
				this.visible = false;
			},
			cancel() {
				this.visible = false;
			},
			initCityCode(codeList) {
				return new Promise(async(resolve) => {
					for(let c = 0; c < codeList.length - 1; c++){
						const code = codeList[c];
						if (!code) break;
						await this.getCityData({level: this.selectedIndex, code, indexCode: codeList[c + 1], isEnd: c === codeList.length - 2, init: 1}).catch();
					}
					resolve();
				})
			},
			toastTips(params) {
			const {message, position} = params;
				const toastRef = this.$refs["toast"];
				if (toastRef) {
					toastRef.open({
						message,
						position: position || 'middle'
					});
				}
			},
			async initData() {
				const index = this.selectedIndex;
				const initValue = this.initValue.trim();
				const codeList = initValue && initValue.split(',') || [];
				const params = {};
				if (codeList.length) {
					params.init = 1;
					params.indexCode = codeList[0];
				}
				await this.getCityData(params).catch();
				await this.initCityCode(codeList).catch();
				if(codeList.length) this.confirm();
			}
		},
		mounted() {
			this.initData();
		}
	}
</script>


