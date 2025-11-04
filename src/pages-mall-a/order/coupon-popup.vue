<style scoped lang="scss">
::v-deep .cl-popup{
	border-radius: 16rpx 16rpx 0 0;
}
.coupon-popup{
	&__header{
		position: relative;
		//padding-top: 40rpx;
		@include flx-dsp($jsc: space-between, $ali: center);
		& > view {
			position: relative;
			flex: 1;
			height: 80rpx;
			$bdw: 4rpx;
			&.cur-tab{
				.bdl{
					background-color: $cl-color-primary;
				}
			}
			@include flx-dsp($jsc: center, $ali: center);
			text{
				font-size: 30rpx;
			}
			.bdl{
				display: block;
				position: absolute;
				left: 50%;
				bottom: 0;
				width: 120rpx;
				height: $bdw;
				transform: translateX(-50%);
				background-color: transparent;
			}
		}
		& > .close-icon{
			position: absolute;
			top: -6rpx;
			right: 8rpx;
		}
 	}
	.page-cont{
		position: relative;
		.loading-wr{
			@include flx-dsp($jsc: center, $ali: center);
			position: absolute;
			z-index: 999;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
	&__body{
		
		height: 600rpx;
		$cuc:#fd6944;
		$uuc: #aeaeae;
		scroll-view{
			height: 100%;
		}
		.can-use-coupon{
			position: relative;
			height: 100%;
		}
		.emp-cp{
			height: 100%;
			@include flx-dsp($jsc: center, $ali: center);
			flex-direction: column;
			image{
				width: 321rpx;
				height: 216rpx;
			}
			text{
				font-size: 28rpx;
				color: #888;
			}
		}
		.coupon-item{
			position: relative;
			.checkbox{
				position: absolute;
				right: 40rpx;
    			bottom: 60rpx;

			}
			::v-deep .cl-checkbox__input {
				background-color: transparent !important;
				border-color: #ddd !important;
				color: #999 !important;
			}
			::v-deep .is-checked{
				.cl-checkbox__input{
					background-color: $cl-color-primary !important;
					border-color: $cl-color-primary !important;
					color: #fff !important;
				}
			}
			&.cp-can-use{
				background-image: url('~@/pages-mall/static/shop/coupon_receiving_icon.png');
				.rmb-sbl{
					color: $cuc;
				}
				.mny-val{
					color: $cuc;
				}
			}
			&.cp-unuse{
				background-image: url('~@/pages-mall/static/shop/coupon_intergal_icon.png');
				.rmb-sbl{
					color:$uuc;
				}
				.mny-val{
					color: $uuc;
				}
			}
			width: 705rpx;
			height: 278rpx;
			box-sizing: border-box;
			padding: 52rpx 44rpx 44rpx 80rpx;
			background-size: cover;
			@include flx-dsp($jsc: flex-start, $ali: flex-start);
			&__left{
				text-align: left;
				.coupon-text-h{
					@include flx-dsp($jsc: flex-start, $ali: center);
				}
				.coupon-title{
					font-size: 30rpx;
					color: #333;
					margin-bottom: 8rpx;
				}
				.spcn{
					padding: 0 0 4rpx 20rpx;
					line-height: 40rpx;
					color: $cl-color-primary;
				}
				text{
					display: block;
					color: #666;
					font-size: 24rpx;
				}
				.coupon-desc{
					@include ellipsis(3);
				}
				.coupon-use {
					@include ellipsis(1);
				}
			}
			&__right{
				flex: 1;
				@include flx-dsp($jsc: flex-end, $ali: flex-end);
				.coupon-val{
					.rmb-sbl{
						font-size: 44rpx;
						margin-right: 6px;
					}
					.mny-val{
						font-size: 60rpx;
					}
				}
			}
		}
	}
	&__footer{
		margin-top: 10rpx;
		$h: 70rpx;
		width: 100%;
		height: $h;
		button{
			width: 80%;
			line-height: $h;
			color: #fff;
			text-align: center;
			background-color: $cl-color-primary;
			border-radius: 40rpx;
			border: none;
			outline: none;
			font-size: 32rpx;
		}
	}
}
</style>

<template>
	<cl-popup :visible.sync="popupShow" direction="bottom">
		<view class="coupon-popup">
			<view class="coupon-popup__header">
				<view :class="{'cur-tab': tabIndex === 1}" @tap="tabIndex = 1">
					<text>可使用优惠券</text>
					<text class="bdl"></text>
				</view>
				<view :class="{'cur-tab': tabIndex === 0}" @tap="tabIndex = 0">
					<text>不可使用优惠券</text>
					<text class="bdl"></text>
				</view>
				<view class="close-icon" v-if="false" @tap="popupShow = false">
					<cl-icon class="close" color="#dadada" name="cl-icon-close-border" :size="50"></cl-icon>
				</view>
			</view>
			<view class="page-cont">
				
				<view class="coupon-popup__body">
					
					<!-- 可用优惠券 -->
					<view class="can-use-coupon" v-if="tabIndex">
						<view class="loading-wr" v-if="loading">
							<cl-loading theme="spin"></cl-loading>
						</view>
						<template v-if="canUseCoupop.length">
							<scroll-view :scroll-y="true">
								<view class="coupon-item cp-can-use" v-for="(item, index) in canUseCoupop" :key="index" @tap="clickCoupon({data: item, index})">
									<view class="coupon-item__left">
										<view class="coupon-text-h">
											<text class="coupon-title">{{item.title}}</text>
											<text class="spcn" v-if="item.superposition">可叠加</text>
										</view>
										<text class="coupon-desc">{{item.couponDesc}}</text>
										<text class="coupon-use" v-if="item.limitUse">{{item.limitUse}}</text>
										<text>有效期至{{item.effectiveDate}}</text>
									</view>
									<view class="coupon-item__right">
										<view class="coupon-val">
											<text class="rmb-sbl" v-if="!item.isDiscount">&yen;</text>
											<text class="mny-val">{{item.couponVal}}</text>
										</view>
									</view>
									<cl-checkbox class="checkbox" :disabled="disabledCbx" v-model="item.checked" round></cl-checkbox>
								</view>
							</scroll-view>
						</template>
						<view class="emp-cp" v-if="!canUseCoupop.length && !loading">
							<image src="@/pages-mall-a/static/empty/coupon_none_icon.png" mode="aspectFit" />
							<text>您暂无可用的优惠券~</text>
						</view>
					</view>
					<!-- 不可用优惠券 -->
					<view class="can-use-coupon" v-else>
						<template v-if="unUseCoupop.length">
							<scroll-view :scroll-y="true">
								<view class="coupon-item cp-unuse" v-for="(item, index) in unUseCoupop" :key="index">
									<view class="coupon-item__left">
										<view class="coupon-text-h">
											<text class="coupon-title">{{item.title}}</text>
										</view>
										<text class="coupon-desc">{{item.couponDesc}}</text>
										<text  class="coupon-use" v-if="item.limitUse">{{item.limitUse}}</text>
										<text>有效期至{{item.effectiveDate}}</text>
									</view>
									<view class="coupon-item__right">
										<view class="coupon-val">
											<text class="rmb-sbl" v-if="!item.isDiscount">&yen;</text>
											<text class="mny-val">{{item.couponVal}}</text>
										</view>
									</view>
								</view>
							</scroll-view>
						</template>	
						<view class="emp-cp" v-else>
							<image src="@/pages-mall-a/static/empty/coupon_none_icon.png" mode="aspectFit" />
							<text>您暂无不可用的优惠券~</text>
						</view>
					</view>
				</view>
				<view class="coupon-popup__footer" v-if="tabIndex && canUseCoupop.length">
					<button @tap="confirmCouponUseing">确定</button>
				</view>
			</view>
			<cl-toast ref="toast"></cl-toast>
		</view>
  </cl-popup>
</template>

<script>
	import { orderCoupon } from '@/js/minxins.js';
	export default {
		options: { styleIsolation: 'shared' },
		data() {
			return {
				tabIndex: 1,
				canUseCoupop: [],
				unUseCoupop: [],
				loading: false,
				disabledCbx: true,
				cacheCanUseCoupop: '[]'
				//orderList: []
			}
		},
		mixins: [orderCoupon],
		props: {
			showCoupon: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			popupShow: {
				get () {
					return this.showCoupon
				},
				set (val) {
					this.$emit('update:showCoupon', val)
				}
			}
		}, 
		watch: {
			popupShow(n) {
				if (n) this.tabIndex = 1;
				if (!n) this.loading = false;
			}
		},
		methods: {
			// toast提示
			toastTips(params) {
				const {message, position, duration} = params;
				const toastRef = this.$refs["toast"];
				if (toastRef) {
					toastRef.open({
						message,
						position: position || 'middle',
						duration: duration || 2000
					});
				}
			},
			// 点击可用优惠券
			clickCoupon(params) {
				const {data, index} = params || {};
				const {superposition, checked, id} = data || {};
				const lastStatus = checked; // 缓存上次状态
				const allSuperposition = !this.canUseCoupop.some(item => !item.superposition); // 全可叠加
				const allNotSuperposition = !this.canUseCoupop.some(item => item.superposition); // 全非叠加
				let currentSuperpositionStatus = true // 当前是否是叠加
				// 若都是可叠加优惠券，去掉/替换互斥优惠券
				const rejectCpFn = () => {
					let replaceIndex = -1, replaceCpNm = ''; 
					const replaceCps = []
					this.canUseCoupop.forEach((item, i) => {
						const isRjItem = item.superposition && item.checked && Array.isArray(item.rejectIds) && item.rejectIds.includes(id);
						if (isRjItem) {
							replaceIndex = i;
							replaceCpNm = item.title;
							replaceCps.push({replaceIndex: i, title: item.title})
						}
					});
					// 替换已选的互斥优惠券
					this.canUseCoupop[index].checked = !checked;
					if (replaceCps.length) {
						let tips = ''
						const curCpTitle = this.canUseCoupop[index].title;
						replaceCps.forEach((item, i) => {
							this.canUseCoupop[item.replaceIndex].checked = false;
							tips += `${item.title}${i >= replaceCps.length - 1 ? '' : '、'}`
						})
						this.toastTips({message: `${curCpTitle}与${tips}优惠券不能同时使用`, duration: 3500});
					}
				}
				// 更新当前是可叠加还是不可叠加状态
				this.canUseCoupop.some(item => {
					if (item.checked) {
						currentSuperpositionStatus = item.superposition
						return true
					}
				});
				if (allSuperposition) { // 全可叠加
					rejectCpFn();
				} else if (allNotSuperposition) { // 全非叠加
					this.canUseCoupop.forEach(item => {
						item.checked = false;
					});
					this.canUseCoupop[index].checked = !lastStatus;
				} else if (currentSuperpositionStatus === superposition) { // 当前为相同状态时
					const isNotSpsn = superposition === false;
					if (isNotSpsn) {
						this.canUseCoupop.forEach((item, i) => {
							if (!item.superposition) item.checked = false;
						});
					}
					rejectCpFn();
				} else if (!currentSuperpositionStatus && superposition) { // 当前为不可叠加状态，点击了可叠加
					this.canUseCoupop.forEach(item => {
						if (!item.superposition) item.checked = false;
					});
					this.canUseCoupop[index].checked = !lastStatus;
				} else if (currentSuperpositionStatus && !superposition) { // 当前为可叠加状态，点击了不可叠加
					let spsnList = this.canUseCoupop.filter(item => item.superposition && item.checked);
					if (spsnList.length === 0) { 
						this.canUseCoupop.forEach(item => {
							if (item.superposition) item.checked = false;
						});
						this.canUseCoupop[index].checked = !checked;
					} else {
						this.toastTips({message: '该优惠券不可叠加'});
					}
					
				}	
			},
			showCouponFn(orderList) {
				const cacheCanUseCoupop = this.cacheCanUseCoupop
				this.orderList = orderList;
				this.popupShow = true;
				if (cacheCanUseCoupop) this.canUseCoupop = JSON.parse(cacheCanUseCoupop);
				this.getDataList();
			}
		}
	}
</script>


