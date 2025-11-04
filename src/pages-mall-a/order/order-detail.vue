<style scoped lang="scss">
page{
	height: 100%;
}
.order-detail{
	width: 100%;
	min-height: 100%;
	background-color: $uni-bg-color-grey;
	$cw: 690rpx;
	.price{
		@include flx-dsp($jsc: flex-start, $ali: flex-end);
		color: $uni-color-primary;
		&__symbol{
			font-size: 26rpx;
			margin-right: 4rpx;
		}
		&__money{
			position: relative;
			top: 6rpx;
			font-size: 36rpx;
		}
		&__decimals{
			position: relative;
			top: 4rpx;
			font-size: 28rpx;
		}
	}
	.progress-content{
		overflow : hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2; /* 可以显示的行数，超出部分用...表示*/
		-webkit-box-orient: vertical;
	}
	.order-top{
		position: relative;
		overflow: hidden;
		.status-background{
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			width: 100%;
			height: 196rpx;
			background-color: $uni-color-primary;
		}
		.status-info{
			position: relative;
			z-index: 2;
			padding: 0 10rpx;
			box-sizing: border-box;
			@include flx-dsp($jsc: space-between, $ali: center);
			&-left{
				@include flx-dsp($jsc: flex-start, $ali: center);
				margin-top: 45rpx;
				margin-bottom: 60rpx;
				image{
					width: 40rpx;
					height: 40rpx;
					margin-right: 24rpx;
				}
				& > text {
					font-size: 32rpx;
					color: #fff;
				}
			}
			&-right{
				text:first-child{
					font-size: 26rpx;
					color: #fff;
					margin-right: 18rpx;
				}
				text:last-child{
					font-size: 30rpx;
					color: #fff;
				}
			}
		}
	}
	.interval{
		width: 100%;
		height: 30rpx;
		background-color:  $uni-bg-color-grey;
	}
	.distribution-info{
		position: relative;
		z-index: 2;
		border-radius: 24rpx;
		overflow: hidden;
		$pd: 32rpx 20rpx 40rpx 14rpx;
		background-color: #fff;
		.delivery-info{
			width: 100%;
			background-color: #fff;
			padding: $pd;
			min-height: 196rpx;
			@include flx-dsp($jsc: space-between, $ali: center);
			box-sizing: border-box;
			.location-icon{
				width: 56rpx;
				height: 56rpx;
				margin-right: 18rpx;
			}
			.person-info{
				flex: 1;
				& > view{
					font-size: 24rpx;
					margin-bottom: 16rpx;
					text:first-child{
						margin-right: 10rpx;
					}
				}
				.addr{
					@include ellipsis($line: 2);
					font-size: 28rpx;
				}
			}
		}
		.express-info-wr{
			width: 100%;
			height: 180rpx;
			overflow: hidden;
			border-bottom: 1rpx solid #f3f3f3;
			.swiper{
				width: 100%;
				height: 100%;
			}
		}
		.express-info{
			width: 100%;
			background-color: #fff;
			padding: $pd;
			height: 180rpx;
			@include flx-dsp($jsc: space-between, $ali: center);
			box-sizing: border-box;
			
			& > image{
				width: 56rpx;
				height: 56rpx;
				margin-right: 18rpx;
			}
			.progress-info{
				flex: 1;
				@include flx-dsp($jsc: flext-start, $ali: flext-start, $drt: column);
				text:first-child{
					font-size: 28rpx;
					margin-bottom: 10rpx;
				}
				text:last-child{
					font-size: 24rpx;
					color: #ccc;
				}
			}
		}
	}
	.shop-goods{
		width: 100%;
		background-color: #fff;	
		.shop-item{
			$pd: 30rpx;
			margin: 0 auto;
			width: $cw;
			padding: $pd 0;
			.shop-name{
				@include flx-dsp($jsc: flex-start, $ali: center);
				image{
					width: 32rpx;
					height: 32rpx;
					margin-right: 6rpx;
				}
				text{
					font-size: $uni-font-size-base;
					color: #666;
				}
			}
			.goods-item{
				width: 100%;
				image{
					width: 180rpx;
					height: 180rpx;
					border-radius: 8rpx;
					margin-right: 24rpx;
				}
				.goods-item-top{
					@include flx-dsp($jsc: flex-start, $ali: flex-start);
					margin: $pd 0;
				}
				.goods-info{
					@include flx-dsp($jsc: space-between, $ali: flex-start, $drt: column);
					flex: 1;
					height: 180rpx;
					.title-price{
						width: 100%;
						@include flx-dsp($jsc: space-between, $ali: flex-start);
						.price{
							position: relative;
							top: -10rpx;
							justify-content: flex-end;
							width: 45%;
							color: #333
						}
					}
					.goods-name{
						font-size: $uni-font-size-base;
						@include ellipsis($line: 2);
						width: 50%;
					}
					.actually-paid{
						@include flx-dsp($jsc: flex-end, $ali: flex-end);
						& > text{
							font-size: 26rpx;
							color: #999;
							margin-right: 10rpx;
						}
					}
					.goods-spec{
						color: $gray-1;
						font-size: 24rpx;
						@include ellipsis($line: 1);
					}
					& > view{
						width: 100%;
					}
					.price-container{
						margin-top: 10rpx;
						width: 100%;
						@include flx-dsp($jsc: space-between, $ali: center);
						& > text{
							@include flx-dsp($jsc: flex-end, $ali: flex-end);
							font-size: 24rpx;
						}
					}
				}
				.goods-item-bottom{
					@include flx-dsp($jsc: flex-end, $ali: center);
					margin-bottom: $pd;
					text{
						@include flx-dsp($jsc: center, $ali: center);
						margin-left: 20rpx;
						width: 144rpx;
						height: 56rpx;
						border-radius: 28rpx;
						border: 1rpx solid #e5e5e5;
						color: #666;
						font-size: 24rpx;
					}

				}
			}
		}
	}
	.list-cell-container{
		width: 100%;
		background-color: #fff;
		padding: 20rpx 0;
		.list-cell{
			margin: 0 auto;
			padding: 20rpx 0;
			width: $cw;
			@include flx-dsp($jsc: space-between, $ali: center);
			.cell-left{
				@include flx-dsp($jsc: flex-start, $ali: center);
				.label{
					font-weight: bold;
					font-size: $uni-font-size-base;
					margin-right: 36rpx;
				}
				.express-value{
					color: #a5a5a5;
					font-size: 24rpx;
				}
			}
			.cell-right{
				@include flx-dsp($jsc: flex-end, $ali: center);
				.cell-value{
					font-size: $uni-font-size-base;
					
				}
				.cell-copy{
					font-size: 16rpx;
					border: 1px solid #d7d7d7;
					padding: 6rpx 8rpx;
					color: #3d3d3d;
					border-radius: $uni-border-radius-base;
					margin-left: 16rpx;
				}
				.arrow-right{
					margin-left: 14rpx;
				}
				.ellipsis-text{
					@include ellipsis(1);
				}
				.more-text {
					font-size: 28rpx;
				}
			}
			.leave-msg{
				text-align: right;
				padding-right: 10rpx;
				font-size: $uni-font-size-base;
			}
		}
	}
	.summarizing{
		text.cell-value{
			color: $uni-color-primary;
		}
	}
	.order-info{
		text.cell-value{
			color: #666;
		}
	}
	.pay-way {
		padding: 10rpx 0rpx 10rpx 0rpx;
		.cell-value{
			color: #ccc;
		}
	}
	.invoice{
		padding: 10rpx 0rpx;
		.cell-value{
			color: #666;
		}
	}
	.bottom-buttons{
		margin: 0 auto;
		width: $comm-width;
		height: 156rpx;
		@include flx-dsp($jsc: center, $ali: center);
		text{
			@include flx-dsp($jsc: center, $ali: center);
			width: 224rpx;
			height: 80rpx;
			border-radius: 40rpx;
			color: #fff;
			font-size: 28rpx;
		}
		.left{
			background-color: #F7BC3E;
		}
		.right{
			margin-left: 26rpx;
			background-color: $uni-color-primary;
		}
	}

	.invoices-title{
		font-size: $uni-font-size-base;
		font-weight: bold;
		text-align: center;
		height: 60rpx;
		line-height: 50rpx;
		border-bottom: 1px solid #F7F7F7;
	}
}
</style>

<template>
	<view class="order-detail">
		<view class="order-top">
			<view class="status-background"></view>
			<view class="status-info common-width">
				<view class="status-info-left">
					<image v-if="orderInfo.statusCode <= 2" src="/pages-mall-a/static/money.png" mode=""></image>
					<image v-if="orderInfo.statusCode === 3 || orderInfo.statusCode === 4" src="/pages-mall-a/static/clock.png" mode=""></image>
					<image v-if="orderInfo.statusCode === 5" src="/pages-mall-a/static/done.png" mode=""></image>
					<image v-if="orderInfo.statusCode === 6" src="/pages-mall-a/static/cancel.png" mode=""></image>
					<text>{{orderInfo.statusText}}</text>
				</view>
				<view class="status-info-right" v-if="orderInfo.statusCode === 1">
					<text>剩余</text>
					<text> {{countDown.text}}</text>
				</view>
			</view>
			<view class="distribution-info common-width">
				<view class="express-info-wr" v-if="expressInfo.length && orderInfo.statusCode !== 1">
					<swiper class="swiper" vertical circular :autoplay="true" :interval="3000">
						<swiper-item v-for="(item, index) in expressInfo" :key="index">
							<view class="express-info" @tap="pageTap({actionType: 'logistics', data: item})">
								<image v-if="item.statusCode === 1" class="goods-icon" src="/pages-mall-a/static/goods_icon.png" mode=""></image>
								<image v-if="item.statusCode === 2" class="cart-icon" src="/pages-mall-a/static/cart_icon.png" mode=""></image>
								<image v-if="item.statusCode === 3" class="user-icon" src="/pages-mall-a/static/user_icon.png" mode=""></image>
								<view class="progress-info">
									<text class="progress-content">{{item.statusText}}</text>
									<text>{{item.time}}</text>
								</view>
								<cl-icon v-if="!item.orderCancel" :size="30" color="#b6b6b6" name="cl-icon-arrow-right"></cl-icon>
							</view>
						</swiper-item>
					</swiper>
				</view>
				<!--  @tap="pageTap({actionType: 'address'})"   暂时取消待付款支持切换收货地址 -->
				<view class="delivery-info" v-else>
					<image class="location-icon" src="/pages-mall-a/static/location_icon.png" mode=""></image>
					<view class="person-info">
						<view class="">
							<text>{{deliveryInfo.name}}</text>
							<text>{{deliveryInfo.phone}}</text>
						</view>
						<text class="addr">{{deliveryInfo.address}}</text>
					</view>
					<!-- <cl-icon :size="30" color="#b6b6b6" name="cl-icon-arrow-right"></cl-icon> -->
				</view>
			</view>
			<view class="interval"></view>
			<view class="shop-goods">
				<view class="shop-item" v-for="(shop, index) in orderList" :key="index">
					<view class="shop-name">
						<image src="/pages-mall-a/static/shop_icon.png" mode=""></image>
						<text>{{shop.shopName}}</text>
					</view>
					<view class="goods-item" v-for="(item, i) in shop.goodsList" :key="i">
						<view class="goods-item-top" @tap="toGoodsDetail(item)">
							<image :src="item.img" mode="aspectFill"></image>
							<view class="goods-info">
								<view class="title-price">
									<text class="goods-name">{{item.goodsName}}</text>
									<view class="price">
										<text class="price__symbol">&yen;</text>
										<text class="price__money">{{item.salePrice.int}}</text>
										<text class="price__decimals">{{item.salePrice.flt}}</text>
									</view>
								</view>
								<view class="">
									<text class="goods-spec">{{item.spec}}</text>
									<view class="price-container">
										<text>x {{item.buyNumber}}</text>
										<view class="actually-paid">
											<text>实付</text>
											<view class="price">
												<text class="price__symbol">&yen;</text>
												<text class="price__money">{{item.price.int}}</text>
												<text class="price__decimals">{{item.price.flt}}</text>
											</view>
										</view>
									</view>
								</view>
								
							</view>
						</view>
						<view class="goods-item-bottom">
							<!--  && orderInfo.supplyOrder == '0' -->
							<text v-if="afterApplyButton(item)" class="right" @tap="pageTap({actionType: 'return', data: item, shop})">{{afterApplyButtonText(item)}}</text>
							<!-- {{item.orderStatusStr}} -->
							<!-- {{item.deliveryStatusStr}} -->
							<!-- orderInfo.statusCode === 5 && !item.evaluateStatus -->
							<text v-if="orderInfo.deliveryStatus==1&&item.evaluateStatus==0" class="right" @tap="pageTap({actionType: 'evaluate', data: item, shop})">评价晒单</text>
						</view>
					</view>
				</view>
			</view>
			<view class="interval"></view>
			<view class="list-cell-container order-info">
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">订单编号</text>
					</view>
					<view class="cell-right">
						<text class="cell-value">{{orderInfo.orderNo}}</text>
						<text v-if="orderInfo.orderNo" class="cell-copy" @click="handleCopy(orderInfo.orderNo)">复制</text>
					</view>
					<!-- <view>
						<text>复制</text>
					</view> -->
				</view>
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">下单时间</text>
					</view>
					<view class="cell-right">
						<text class="cell-value">{{orderInfo.orderTime}}</text>
					</view>
				</view>
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">订单留言</text>
					</view>
					<view class="cell-right">
						<text style="width:458rpx;" :class="['cell-value',isBuyerRemark?'ellipsis-text':'']">
							{{orderInfo.leaveMsg}}
						</text>
						<span class="more-text" v-if="isBuyerRemark" @click="isBuyerRemark = false">更多</span>
					</view>
				</view>
			</view>
			<view class="interval"></view>
			<view class="list-cell-container summarizing">
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">商品总价</text>
					</view>
					<view class="cell-right">
						<!-- <text class="cell-value">&yen; {{goodsSum}}</text> -->
						<text class="cell-value">&yen; {{orderInfo.orderAmountStr}}</text>
					</view>
				</view>
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">优惠券</text>
					</view>
					<view class="cell-right">
						<text class="cell-value">- &yen; {{orderInfo.discountAmountStr || "0"}}</text>
					</view>
				</view>
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">使用积分</text>
					</view>
					<view class="cell-right">
						<text class="cell-value">- {{orderInfo.useIntegral}}</text>
					</view>
				</view>
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">运费</text>
					</view>
					<view class="cell-right">
						<text class="cell-value">+ &yen; {{freight}}</text>
					</view>
				</view>
					<view class="list-cell">
					<view class="cell-left">
						<text class="label">实付价</text>
					</view>
					<view class="cell-right">
						<text class="cell-value">&yen; {{orderInfo.payAmountStr}}</text>
					</view>
				</view>
			</view>
			<view class="interval"></view>
			<view class="list-cell-container invoice" @tap="invoicesDetailPop = true" v-if="orderInfo.headType">
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">发票</text>
					</view>
					<view class="cell-right">
						<text class="cell-value" v-if="orderInfo.headType == 1">(个人){{orderInfo.invoiceHead}}</text>
						<text class="cell-value" v-else-if="orderInfo.headType == 2">(企业){{orderInfo.invoiceHead}}</text>
						<cl-icon class="arrow-right" :size="30" color="#b6b6b6" name="cl-icon-arrow-bottom"></cl-icon>
					</view>
				</view>
			</view>
			<!-- <view class="interval"></view> -->
			<view class="list-cell-container pay-way">
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">支付方式</text>
					</view>
					<view class="cell-right" @tap="choosePayWay({callPage: 'order-detail'})">
						<text class="cell-value">{{payWay.label}}</text>
						<cl-icon class="arrow-right" v-if="paywayArrowShow()" :size="30" color="#b6b6b6" name="cl-icon-arrow-right"></cl-icon>
					</view>
				</view>
			</view>
			<template v-if="isGroupType">
				<view class="interval"></view>
				<view class="list-cell-container group-tip">
					<view class="list-cell">
						<view class="cell-left">
							<text class="label">团购订单，若当天不成团即全额退款</text>
						</view>
						<view class="cell-right">
							<cl-checkbox v-model="joinGroupTip" :round="true"></cl-checkbox>
						</view>
					</view>
				</view>
			</template>
			<view class="interval"></view>
			<view class="bottom-buttons" v-if="orderInfo.statusCode === 1">
				<text class="left" @tap="cancelOrder">取消订单</text>
				<text class="right"  @tap="pageTap({actionType: 'pay'})">立即支付</text>
			</view>
			<view class="bottom-buttons" v-if="false">
				<text class="left" @tap="pageTap({actionType: 'return'})">售后申请</text>
			</view>
		</view>
		<cl-confirm ref="confirm"></cl-confirm>
		<cl-toast ref="toast"></cl-toast>
    	<!-- 发票详情 -->
		<cl-popup :visible.sync="invoicesDetailPop" direction="bottom">
			<view class="invoices-title">发票详情</view>
			<view class="list-cell-container">
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">发票类型</text>
					</view>
					<view class="cell-right">
						<text class="cell-value" v-if="orderInfo.invoiceType == 1">普通发票</text>
						<text class="cell-value" v-if="orderInfo.invoiceType == 2">增值税专用发票</text>
					</view>
				</view>
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">抬头类型</text>
					</view>
					<view class="cell-right">
						<text class="cell-value" v-if="orderInfo.headType == 1">个人</text>
						<text class="cell-value" v-if="orderInfo.headType == 2">企业</text>
					</view>
				</view>
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">发票抬头</text>
					</view>
					<view class="cell-right">
						<text class="cell-value">{{orderInfo.invoiceHead}}</text>
					</view>
				</view>
				<template v-if="orderInfo.headType == 2">
					<view class="list-cell">
						<view class="cell-left">
							<text class="label">税号</text>
						</view>
						<view class="cell-right">
							<text class="cell-value">{{orderInfo.taxNumber}}</text>
						</view>
					</view>
					<view class="list-cell">
						<view class="cell-left">
							<text class="label">开户银行</text>
						</view>
						<view class="cell-right">
							<text class="cell-value">{{orderInfo.bankName}}</text>
						</view>
					</view>
					<view class="list-cell">
						<view class="cell-left">
							<text class="label">银行账号</text>
						</view>
						<view class="cell-right">
							<text class="cell-value">{{orderInfo.bankAccount}}</text>
						</view>
					</view>
					<view class="list-cell">
						<view class="cell-left">
							<text class="label">企业地址</text>
						</view>
						<view class="cell-right">
							<text class="cell-value">{{orderInfo.companyAddress}}</text>
						</view>
					</view>
					<view class="list-cell">
						<view class="cell-left">
							<text class="label">企业电话</text>
						</view>
						<view class="cell-right">
							<text class="cell-value">{{orderInfo.companyPhone}}</text>
						</view>
					</view>
				</template>
			</view>


		</cl-popup>
		<!-- 支付方式 -->
		<cl-action-sheet ref="action-sheet"></cl-action-sheet>
	</view>
</template>

<script>
import { paymentMx } from '@/js/minxins.js';
import Payment from '@/js/payment.js'

	export default {
		data() {
			return {
				orderId: '', // 订单编号,
				isBuyerRemark: false,
				orderInfo: {
					statusText: '',
					statusCode: '', // 待付款1  已付款2 待发货3 待收货4 已完成5 已取消6
					orderNo: '',
					orderTime: '',
					leaveMsg: '',
					evaluated: false,
					isApplyReturn: false,
					useIntegral: 0
				},
				deliveryInfo: {
					name: '',
					phone: '',
					address: '',
				},
				expressInfo: [],
				countDown: {
					text: '00:00:00',
					timer: null
				},
				orderList: [],
				freight: 0,
				goodsSum: 0,
				couponSum: '0.00',
				total: {
					int: '0',
					flt: '.00',
					value: 0
				},
				payTypeStr: '',
				detailLoading: false,
				query: null,
				invoicesDetailPop: false,
				payWay: {
					label: '微信支付',
					code: 'wx'
				},
				// isGroupType: false, // 当参团时候，就需要勾选这个提示
			}
		},
		computed: {
			// 获取活动类型
			isGroupType() {
				// promotionType = 1 团购类型
				return this.orderInfo.promotionType === 1
			}
		},
		onLoad(option) {
			this.orderId = option.orderId
			this.initData(option);
		},
		onShow() {
			const detailLoading = this.detailLoading;
			if (!detailLoading) this.getOrderDetail(this.query)
		},
		mixins: [paymentMx],
		methods: {
			afterApplyButton(params) {
				const {isAfterSale} = params || {};
				const {orderAfterSaleState} = this.orderInfo;
				return isAfterSale !== 0 || (orderAfterSaleState === 1 && isAfterSale === 0)
			},
			clearCountDown() {
				clearInterval(this.countDown.timer);
				this.countDown.timer = null;
				this.countDown.text = '00:00:00';
			},
			startCountDown() {
				const formatDate = this.$cmMth.formatDate;
				const {statusCode, timeoutTime} = this.orderInfo;
				const invalidTimeout = !(typeof timeoutTime === 'string' && timeoutTime.trim() !== '');
				const today = formatDate({ type: 'd2d', value: new Date(), format: 'YY-MM-DD'});
				const endTime = formatDate({ type: 'd2s', value: timeoutTime});
				const displayTime = () => {
					const startTime = new Date().getTime();
					const second = (endTime - startTime) / 1000;
					if (second > 0) {
						let days = 0, h = 0, m = 0, s = 0;
						days = Number.parseInt(second / 60 / 60 / 24);
						h = Number.parseInt(second / 3600) % 24;
						m = Number.parseInt(second / 60) % 60;
						s = Math.floor(second % 60);
						this.countDown.text = `${h >= 10 ? h : '0' + h}:${m >= 10 ? m : '0' + m}:${s >= 10 ? s : '0' + s}`;
					}
				}
				if (statusCode !== 1 || invalidTimeout) return
				
				displayTime();
				this.countDown.timer = setInterval(_ => {
					const startTime = new Date().getTime();
					const second = (endTime - startTime) / 1000;
					if (second <= 0) {
						clearInterval(this.countDown.timer);
						this.countDown.timer = null;
						this.countDown.text = '00:00:00';
					} else {
						let days = 0, h = 0, m = 0, s = 0;
						days = Number.parseInt(second / 60 / 60 / 24);
						h = Number.parseInt(second / 3600) % 24;
						m = Number.parseInt(second / 60) % 60;
						s = Math.floor(second % 60);
						this.countDown.text = `${h >= 10 ? h : '0' + h}:${m >= 10 ? m : '0' + m}:${s >= 10 ? s : '0' + s}`;
					}
				}, 1000);
			},
			getOrderDetail(option) {
				const {orderId} = option || {};
				if (!orderId) return;
				this.detailLoading = true;
				return this.$mallApi.data.getOrderById({pathParams: `/${orderId}`,  hideLoading: true}).then(res => {
					this.detailLoading = false;
					if (res.statusCode === 200) {
						const orderInfo = res.data || {}
						const {evaluateStatus, isAfterSale, sellerName, payAmount, freightStr, orderGoodsList, orderId, orderNo, orderStatus, orderStatusStr, createTime, timeoutTime, payTypeStr, consigneeName, consigneePhone, consigneeAddress, buyerRemark, invoiceType, headType, invoiceHead, taxNumber, bankName, bankAccount, companyAddress, companyPhone, payType, useIntegral, completeConsigneeAddress} = orderInfo; 
						const statusCode = orderStatus === 0 ? 1 : orderStatus + 2;
						const precision = this.$cmMth.precision;
						const goodsList = [];
						
						this.orderList = [
							{
								shopName: sellerName,
								goodsList: []
							}
						]
						this.deliveryInfo = {
							name: consigneeName,
							phone: consigneePhone,
							address: completeConsigneeAddress,
						};
						if (statusCode === 1 || statusCode === 6) {
							// this.expressInfo = [
							// 	{
							// 		time: statusCode === 6 ? closeTime : '',
							// 		statusCode: 1,
							// 		statusText: statusCode === 6 ? '您的订单已取消' : orderStatusStr,
							// 		orderCancel: statusCode === 6 ? 1 : 0
							// 	}
							// ]
						}
						if(buyerRemark&&buyerRemark.length>18) {
							this.isBuyerRemark = true
						}
						this.orderInfo = {
							...orderInfo,
							orderId,
							orderAmount: payAmount,
							statusText: orderStatusStr,
							statusCode, // 待付款1  已付款2 待发货3 待收货4 已完成5 已取消6
							orderNo,
							orderTime: createTime,
							leaveMsg: buyerRemark,
							timeoutTime,
							// evaluated: evaluateStatus,
							// orderStatusStr: orderStatusStr,
							orderStatus: orderStatus,
							isApplyReturn: isAfterSale,
							invoiceType,
							headType,
							invoiceHead,
							taxNumber,
							bankName,
							bankAccount,
							companyAddress,
							companyPhone,
							payType,
							useIntegral
						};
						Array.isArray(orderGoodsList) && orderGoodsList.forEach(item => {
							const {goodsName, goodsImageUrl, numbers, goodsSpec, salePriceStr, payAmountStr} = item;
							const {int, flt} = this.$cmMth.formatSum({value: Number(payAmountStr), type: 'UpperCamelCase'});
							const salePrice = this.$cmMth.formatSum({value: Number(salePriceStr), type: 'UpperCamelCase'});
							const goods = {
								...item,
								img: goodsImageUrl,
								goodsName,
								spec: goodsSpec,
								price: {
									int,
									flt,
									value: Number(payAmountStr)
								},
								salePrice,
								buyNumber: numbers,
								referrer: '',
							}
							console.log('goods===',goods)
							goodsList.push(goods);
						});
						this.orderList[0].goodsList = goodsList;
						this.freight = freightStr;
						this.payTypeStr = payTypeStr;
						this.payWay.code = payType
						this.payWay.label = payTypeStr
						this.calcPrice({freight: Number(freightStr)});
						this.clearCountDown();
						this.startCountDown();
					}
				}).catch(_ => {
					this.detailLoading = false;
				})
			},
			cancelOrder(params = {}) {
				const {orderId} = this.orderInfo;
				this.$refs['confirm'].open({
					title: '确认提示',
					message: `您确定取消订单吗`,
					callback: (data) => {
						const {action} = data;
						if (action === 'confirm') {
							this.$mallApi.data.cancelOrder({pathParams: `/${orderId}`, loadingText: '取消中'}).then(res => {
								if (res.statusCode === 200) {
									this.getOrderDetail({orderId})
								}
							})
						}
					}
				})
			},
			pageTap(params = {}) {
				console.log('2222222222222222222',params)
				const {actionType, data, shop} = params;
				const orderId = this.orderInfo.orderId;

				// 点击立即支付时(actionType)，如果是团购类型(isGroupType)，需要勾选成团提示(joinGroupTip)
				if (actionType === 'pay' && this.isGroupType && !this.joinGroupTip) {
					this.$refs.toast.open({
						message: '请勾选协议，否则无法进行操作',
						position: 'bottom'
					})
					return
				}

				let url = '';
				if (actionType === 'pay') {
					this.payOrder();
				} else if (actionType === 'address') {
					url = '/pages-mall-a/address-mng/address-mng';
				} else  if (actionType === 'logistics') {
					url = `/pages-mall-a/order/logistics-list?orderId=${this.orderId}`;
				} else if (actionType === 'return') {
					const {orderAfterSaleState} = this.orderInfo;
					const isAfterSale = data.isAfterSale;
					const asId = data.asId;
					const afterSaleDetailUrl = `/pages-mall-a/order-after-sale/return-approval-info?afterSaleId=${asId}`;
					const applyAfterSaleUrl = `/pages-mall-a/editor-upload/return-request?orderId=${orderId}&goodsSpecId=${data.goodsSpecId}`;
					url = isAfterSale !== 0 ? afterSaleDetailUrl : orderAfterSaleState === 1 && isAfterSale === 0 ? applyAfterSaleUrl : '';
				} else if (actionType === 'evaluate') {
					const {img, goodsId, goodsSpec, goodsSpecId, goodsName} = data;
					const args = encodeURIComponent(JSON.stringify({
						orderId,  // 订单id
						gmId: goodsId, // 商品id
						gsId: goodsSpecId, // 规格id
						imgUrl: img, // 图片地址
						specName: goodsSpec,
						shopName: shop.shopName, // 商品名称
						goodsName
					}))
					url = `/pages-mall-a/editor-upload/editor-upload?args=${args}`
				}
				
				if (url) uni.navigateTo({url});
			},
			requestPayment(params = {}) {
				const {paySn, timeStamp, nonceStr, package: pkg, signType, paySign} = params;
				return new Promise((resolve) => {
					uni.getProvider({
					    service: 'oauth',
					    success: (res) => {
					       const [provider] = res.provider;
						   uni.requestPayment({
						       provider,
						       timeStamp,
						       nonceStr,
						       package: pkg,
						       signType,
						       paySign,
						       success: (res) => {
						           uni.navigateTo({url: `/pages-mall-a/order/pay-result?paySn=${paySn}`});
								   resolve(res)
						       },
						       fail:  (err) => {
						          resolve(err)
						       }
						   });
					    }
					});
				})
			},
			toGoodsDetail(params) {
				const {goodsId, promotionType} = params;
				uni.navigateTo({
					url: `/pages-mall-a/shopping-info/shopping-info?shopId=${goodsId}&shopType=${promotionType}`
				});
			},
			async payOrder(params) {
				/** 支付参数 */
				const payType = this.payWay.code
				const { orderId, orderAmount } = this.orderInfo

				let args = {}
				if (payType === 'wx') {
					args = Payment.submitByWX(orderId, orderAmount)
				} else if (payType === 'zfb') {
					args = Payment.submitByZFB(orderId, orderAmount)
				}

				// #ifdef  H5
				const isAPP = this.isWebViewApp()
				if (!isAPP) args.returnUrl = this.getPayResultPage()
				// #endif
				/** 支付参数 */

				const res = await this.$mallApi.data.payOrder({data: args, loadingText: '去支付中'})
				if (!res.success) return

				const { payInfo, payAmount, payOrderSn } = res.data || {}
				const isIntegralPay = payInfo === null && payAmount === 0
				if (isIntegralPay) {
					// 积分支付
					this.integralPay({ paySn: payOrderSn })
				} else {
					const { success } = await Payment.wxPayAll(payType, res.data)

					if (success) {
						// 跳转到支付结果页面
						Payment.payToResultPage(payOrderSn)
					}
				}





				// const {orderId, orderAmount} = this.orderInfo;
				// const isWebViewApp = this.isWebViewApp(); 
				// let tradeType = '';
				// // #ifdef  MP
				// tradeType = 'mini'
				// // #endif

				// // #ifdef  H5
				// tradeType = isWebViewApp ? 'app' : 'jsapi'
				// // #endif
				// //const {cip} = await this.$mallApi.data.getIpAddress({loadingText: '去支付中', hideLoading: false});
				// const {openId} = this.$cmMth.getUserStatusInfo() || {};
				
				// const args = {
				// 	//clientIp: cip,
				// 	orderId, 
				// 	tradeType,
				// 	payType: this.payWay.code,
				// 	payAmount: orderAmount,
				// 	payUserId: openId, 
				// }
			
				// // #ifdef  H5
				// if (!isWebViewApp) args.returnUrl = this.getPayResultPage();
				// // #endif
				
				// this.$mallApi.data.payOrder({data: args, loadingText: '去支付中'}).then(res => {
				// 	if (res.statusCode === 200) {
				// 		const {payOrderSn, payInfo, tradeType, payAmount} = res.data;
				// 		const isIntegralPay = payInfo === null && payAmount === 0;
				// 		if (isIntegralPay) {
				// 			this.integralPay({paySn: payOrderSn})
				// 		}
				// 		else if (tradeType == 'mini') {
				// 			const payArg = JSON.parse(payInfo);
				// 			this.requestPayment({...payArg, paySn: payOrderSn});
				// 		} else {
				// 			this.otherPay(res.data || {});
				// 		}
				// 	}
				// })
			},
			calcPrice(params = {}) {
				const {freight} = params;
				const orderList = this.orderList;
				const freightFormatSum = this.$cmMth.formatSum({value: freight, type: 'UpperCamelCase'});
				const precision = this.$cmMth.precision;
				const goodsSum = (_ => {
					let totalGoodsSum = 0;
					orderList.forEach(shop => {
						Array.isArray(shop.goodsList) && shop.goodsList.forEach(goods => {
							const {price, buyNumber} = goods;
							const thePrice = precision.times(buyNumber, price.value);
							totalGoodsSum = precision.plus(totalGoodsSum, thePrice);
						})
					});
					totalGoodsSum = this.$cmMth.formatSum({value: totalGoodsSum, type: 'UpperCamelCase'});
					return totalGoodsSum || {};
				})();
				const totalSum = (() => {
					const val = Number(`${goodsSum.int}${goodsSum.flt}`);
					const totalSumNum = precision.plus(val, freight);
					const {int, flt} = this.$cmMth.formatSum({value: totalSumNum, type: 'UpperCamelCase'});
					return {
						int,
						flt,
						value: val
					}
				})()
				
				this.goodsSum = `${goodsSum.int}${goodsSum.flt}`;
				this.freight = `${freightFormatSum.int}${freightFormatSum.flt}`;
				this.total = totalSum;
			},
			getLogisticsInfo(option) {
				const {orderId} = option;
				return this.$mallApi.data.getLogisticsInfo({ pathParams: `/${orderId}`, hideLoading: true}).then(res => {
					if (res.statusCode === 200) {
						const list = res.data && Array.isArray(res.data) && res.data || [];
						const expressInfo = [];
						list.forEach(item => {
							const {lastUpdateTime, expressType, expressDescribe} = item;
							const express = {
								...item,
								time: lastUpdateTime || '',
								statusCode: 2,
								statusText: expressDescribe,
							}
							expressInfo.push(express);
						});
						this.expressInfo = expressInfo;
					}
				})
			},
			async initData(option) {
				this.query = option;
				uni.showLoading({title: '加载中'});
				await this.getLogisticsInfo(option).catch();
				await this.getOrderDetail(option).catch();
				this.setSelectedPayWay({payType: this.orderInfo.payType});
				uni.hideLoading();
				
			},
			afterApplyButtonText(params) {
				const {isAfterSale} = params;
				console.log('isAfterSale=====',isAfterSale)
				return isAfterSale ? '查看售后' : '售后申请'
			},
			//订单编号 复制
			handleCopy(val) {
				uni.setClipboardData({
					data: val,
					success: () => {
						uni.showToast({
							title: '复制成功'
						})
					}
				})
			}
		},
		beforeDestroy() {
			this.clearCountDown();
		}
	}
</script>


