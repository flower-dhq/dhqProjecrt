<style scoped lang="scss">
	.addressMng{
		width: 100%;
		min-height: 100%;
		padding-bottom: 120rpx;
		box-sizing: border-box;
		.address{
			width: 100%;
			border-bottom: 1rpx solid #fafafa;
			box-sizing: border-box;
			padding: 28rpx 23rpx 20rpx 44rpx;
			&__up{
				@include flx-dsp($jsc: flex-start, $ali: center);
				margin-bottom: 8rpx;
				.name{
					font-size: 30rpx;
					color: #333;
					//font-weight: bold;
					margin-right: 30rpx;
				}
				.phone{
					font-size: 30rpx;
					color: #333;
					//font-weight: bold;
					margin-right: 10rpx;
				}
				.is-default{
					background: $uni-color-primary;
					border-radius: 10rpx 0 10rpx 0;
					font-size: 20rpx;
					transform: scale(.87);
					padding: 6rpx 12rpx;
					color: #fff;
				}
			}
			&__down{
				@include flx-dsp($jsc: flex-start, $ali: center);
				font-size: 26rpx;
				color: #999;
			}
			&__button{
				width: 100%;
				@include flx-dsp($jsc: flex-end, $ali: center);
				margin-top: 36rpx;
				& > text{
					@include flx-dsp($jsc: center, $ali: center);
					margin-left: 16rpx;
					width: 144rpx;
					height: 56rpx;
					border-radius: 28rpx;
					border: 1rpx solid #e5e5e5;
					color: #666;
					font-size: 24rpx;
				}
				text.set-default{
					border: 1rpx solid $uni-color-primary;
					color: $uni-color-primary;
				}
			}
		}
		.add-new{
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
				background: $uni-color-primary;;
				border-radius: 8rpx;
				font-size: 30rpx;
				color: #fff;
			}
		}
		.empty-addr{
			@include flx-dsp($jsc: center, $ali: center, $drt: column);
			width: 100%;
			height: 100%;
			& > view {
				width: 502rpx;
				height: 416rpx;
				background-size: contain;
			}
			.tips{
				margin-top: 30%;
				font-size: $uni-font-size-base;
				color: #888;
			}
		}
	}
	
</style>

<template>
	<view class="addressMng">
		<view class="address" v-for="(item, index) in addressList" :key="index" @tap="tapItem(item)">
			<view class="address__up">
				<text class="name">{{item.name}}</text>
				<text class="phone">{{item.phone}}</text>
				<text class="is-default" v-if="item.isDefault">默认</text>
			</view>
			<text class="address__down">{{item.addr}}</text>
			<view class="address__button">
				<text @tap.stop="deleteConfirm(item)">删除</text>
				<text @tap.stop="createEditAddr({type: 'edit', id: item.id, data: item})">编辑</text>
				<text v-if="!item.isDefault" @tap.stop="setDefault(item)" class="set-default">设为默认</text>
			</view>	
			
		</view>
		<view class="empty-addr" v-if="!addressList.length">
			<text class="tips">没有收货地址哦~</text>
		</view>
		<view class="add-new"><text @tap="createEditAddr({type: 'create'})">新增收货地址</text></view>
		<cl-confirm ref="confirm"></cl-confirm>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				addressList: [],
				fromPage: null
			}
		},
		onLoad(option) {
			const {fromPage} = option;
			if(fromPage) this.fromPage = fromPage;
		},
		onShow() {
			this.getAddressList();
		},
		methods: {
			...mapMutations({
				updateOrderAddress: 'updateOrderAddress'		
			}),
			getAddressList(params) {
				const {hideLoading} = params || {};
				const {memberId} = this.$cmMth.getUserStatusInfo() || {};
				const mid = memberId;
				return this.$mallApi.data.addrList({hideLoading}).then(res => {
					if (res.statusCode === 200) {
						const list = res.data || [];
						const tempList = [];
						list.forEach(item => {
							const {receivingAddressId, consignee, receivingTelephone, isDefault, consigneeAddress, inputAddress} = item;
							tempList.push({
								...item,
								id: receivingAddressId,
								name: consignee,
								phone: receivingTelephone,
								isDefault,
								addr: `${consigneeAddress}${inputAddress}`
							})
						})
						this.addressList = tempList;
					}
				})
			},
			createEditAddr(params) {
				const {type, id, data} = params || {};
				let query = ''; 
				if (type === 'edit') {
					const addrInfo = encodeURIComponent(JSON.stringify(data))
					query = `?addrInfo=${addrInfo}`;
				}
				uni.navigateTo({
					url: `/pages-mall-a/address-mng/create-edit-addr${query}`
				});
			},
			deleteConfirm(addr) {
				this.$refs['confirm'].open({
					title: '删除确认',
					message: `您确定要删除这个地址吗`,
					callback: (data) => {
						const {action} = data;
						if (action === 'confirm') {
							this.delAddr(addr);
						}
					}
				})
			},
			delAddr(params) {
				const {receivingAddressId} = params || {};
				uni.showLoading({title: '删除中'});
				this.$mallApi.data.deleteAddr({hideLoading: true, pathParams: `/${receivingAddressId}`}).then(async res => {
					if(res.statusCode === 200) {
						await this.getAddressList({hideLoading: true}).catch();
					}
					uni.hideLoading();
				})
			},
			setDefault(params) {
				const {memberId} = this.$cmMth.getUserStatusInfo() || {};
				const {receivingAddressId, consignee, phone, addr, consigneeAddress, inputAddress, provinceName, cityName, countyName, streetName} = params || {};
				const data = {
					memberId,
					receivingAddressId,
					consignee,
					receivingTelephone: phone,
					consigneeAddress: consigneeAddress,
					inputAddress,
					provinceName,
					cityName,
					countyName,
					streetName,
					isDefault: 1
				}
				uni.showLoading({title: '设置中'});
				this.$mallApi.data.editAddr({hideLoading: true, data}).then(async res => {
					if(res.statusCode === 200) {
						await this.getAddressList({hideLoading: true}).catch();
					}
					uni.hideLoading();
				})
			},
			tapItem(params) {
				const {id} = params || {};
				const fromPage = this.fromPage;
				if (fromPage === 'order') {
					this.updateOrderAddress(params)
					uni.navigateBack();
				}
				
			}
		}
	}
</script>


