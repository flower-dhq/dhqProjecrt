<style scoped lang="scss">
	.create-edit-addr{
		width: 100%;
		min-height: 100%;
		padding-bottom: 120rpx;
		box-sizing: border-box;
		.form{
			margin: 0 auto;
			width: 690rpx;
			&__control{
				@include flx-dsp($jsc: flex-start, $ali: center);
				width: 100%;
				height: 96rpx;
				border-bottom: 1rpx solid #fafafa;
			}
			&__label{
				width: 120rpx;
				text-align: left;
				font-size: 28rpx;
				color: #333;
			}
			.area{
				@include flx-dsp($jsc: flex-end, $ali: center);
				padding-right: 0;
				.uni-data-tree {
					width: 100%;
					.input-value.input-value-border{
						padding: 0;
						border: none;
					}
				}
				uni-data-picker{
					width: 100%;
				}
				&-text{
					display: block;
					width: 100%;
					text-align: left;
					font-size: 28rpx;
				}
				&-placeholder{
					display: block;
					width: 100%;
					text-align: left;
					font-size: 28rpx;
					color: #909090;
				}
			}
			&__value{
				position: relative;
				flex: 1;
				height: 100%;
				margin-left: 20rpx;
				padding-right: 40rpx;
				input{
					width: 100%;
					height: 100%;
					font-size: 28rpx;
					
				}
				.close-icon{
					position: absolute;
					top: 50%;
					right: 0rpx;
					transform: translateY(-50%);
					width: 28rpx;
					height: 28rpx;
				}
			}
		}
		.save-addr{
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 114rpx;
			background-color: #fff;
			@include flx-dsp($jsc: center, $ali: flex-start);
			& > text{
				@include flx-dsp($jsc: center, $ali: center);
				width: 704rpx;
				height: 88rpx;
				background: $uni-color-primary;
				border-radius: 8rpx;
				font-size: 30rpx;
				color: #fff;
			}
		}
	}
</style>

<template>
	<view class="create-edit-addr">
		<view class="form">
			<view class="form__control">
				<text class="form__label">收货人</text>
				<view class="form__value">
					<input :value="consignee" @input="evt => onInput({evt, key: 'consignee'})" placeholder="输入收货人" />
					<image v-if="consignee" class="close-icon" @click="onClear('consignee')" mode="aspectFill" src="@/pages-mall/static/close.png"></image>
				</view>
			</view>
			<view class="form__control">
				<text class="form__label">联系电话</text>
				<view class="form__value">
					<input type="number" :value="phone" @input="evt => onInput({evt, key: 'phone'})" placeholder="输入联系电话" />
					<image v-if="phone" class="close-icon" @click="onClear('phone')" mode="aspectFill" src="@/pages-mall/static/close.png"></image>
				</view>
			</view>
			<view class="form__control">
				<text class="form__label">所在区域</text>
				<view class="form__value area" @tap="openSelectCity">
					<text class="area-text" :class="{'area-placeholder': !areaText}">{{areaText ? areaText : '请选择区域'}}</text>
					<cl-icon name="cl-icon-arrow-right" color="#b6b6b6"></cl-icon>
				</view>
			</view>
			<view class="form__control">
				<text class="form__label">详细地址</text>
				<view class="form__value">
					<input :value="detailAddr" @input="evt => onInput({evt, key: 'detailAddr'})" placeholder="输入详细地址" />
					<image v-if="detailAddr" class="close-icon" @click="onClear('detailAddr')" mode="aspectFill" src="@/pages-mall/static/close.png"></image>
				</view>
			</view>
		</view>
		<custom-select-city :initValue="selectedCityCode" @confirm="cityConfirm" ref="selectCity"></custom-select-city>
		<view class="save-addr"><text @tap="saveAddr">保存</text></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				consignee: '',
				phone: '',
				areaCode: '',
				areaText: '',
				detailAddr: '',
				cityOption: [],
				cityModel: '',
				saveType: 0,
				isDefault: 0,
				addressId: '',
				selectedCityCode: '',
				selectedCityData: null
			}
		},
		onLoad(option) {
			const {addrInfo} = option || {};
			if (addrInfo !== undefined) {
				const {id, isDefault, consignee, phone, consigneeAddress, inputAddress, provinceCode, cityCode, countyCode, streetCode} = JSON.parse(decodeURIComponent(addrInfo));
				this.addressId = id;
				this.consignee = consignee;
				this.phone = phone;
				this.areaText = consigneeAddress;
				this.detailAddr = inputAddress || '';
				this.isDefault = isDefault;
				this.selectedCityCode = `${provinceCode},${cityCode},${countyCode},${streetCode}`;
				this.saveType = 1;
				uni.setNavigationBarTitle({
				　　title: '编辑地址'
				})
			}
			
		},
		methods: {
			onClear(key) {
				this[key] = '';
			},
			onInput(params = {}) {
				const {evt, key} = params;
				const value = evt.detail.value;
				this[key] = value;
			},
			verifyForm() {
				const consignee = this.consignee;
				const phone = this.phone;
				const areaCode = this.areaText;
				const detailAddr = this.detailAddr;
				const consigneeInvalid = consignee.trim() === '';
				const phoneEmpty = phone.trim() === '';
				const phoneInvalid = !phoneEmpty && !/^1\d{10}$/.test(phone);
				const areaCodeInvalid = areaCode.trim() === '';
				const detailAddrInvalid = detailAddr.trim() === '';
				const detailAddrOverlong = !detailAddrInvalid && detailAddr.length > 45;
				const tips = consigneeInvalid ? '请填写收货人'  : phoneEmpty ? '请输入联系电话' : areaCodeInvalid ? '请选择所属区域' : detailAddrInvalid ? '请填写详细地址' : detailAddrOverlong ? '详细地址不能超过45个字符' : '';
				const prms = {
				    title: tips,
				    duration: 2000,
					icon: 'none'
				}
				if (tips) uni.showToast(prms);
				return !tips;
			},
			saveAddr() {
				const pass = this.verifyForm();
				if (pass) {
					const saveType = this.saveType;
					const consignee = this.consignee;
					const phone = this.phone;
					const cityData = this.selectedCityData.selectedCity;
					const selectedCity = (() => {
						let provinceCode = '', provinceName = '', cityCode = '', cityName = '', countyCode = '', countyName = '', streetCode = '', streetName = ''; 
						cityData.forEach((item, index) => {
							const {label, value} = item;
							switch(index) {
								case 0:
								provinceCode = value;
								provinceName = label;
								break
								case 1:
								cityCode = value;
								cityName = label;
								break
								case 2:
								countyCode = value;
								countyName = label;
								break
								case 3:
								streetCode = value;
								streetName = label;
								break
							}
						})
						return {
							provinceCode,
							provinceName, 
							cityCode,
							cityName, 
							countyCode,
							countyName, 
							streetCode,
							streetName
						}
					})()
					const addressText = this.areaText;
					const detailAddr = this.detailAddr;
					const isDefault = this.isDefault;
					const {memberId} = this.$cmMth.getUserStatusInfo() || {};
					const args = {
						memberId,
						consignee,
						receivingTelephone: phone,
						consigneeAddress: addressText,
						...selectedCity,
						inputAddress: detailAddr,
						isDefault,
					}
					if(saveType) {
						args.receivingAddressId = this.addressId;
					}
					this.$mallApi.data[saveType ? 'editAddr' : 'creatAddr']({data: args}).then(res => {
						if (res.statusCode === 200) {
							//触发商品详情页-配送地址弹窗列表刷新 
							uni.$emit('changeAddress')		
							uni.navigateBack();
						}
					}) 
				}
			},
			openSelectCity(){
				this.$refs['selectCity'].openSelect();
			},
			cityConfirm(evt) {
				const {selectedCityName, selectedCityCode} = evt;
				this.areaText = selectedCityName;
				this.selectedCityData = evt;
			}
		},
		
	}
</script>


