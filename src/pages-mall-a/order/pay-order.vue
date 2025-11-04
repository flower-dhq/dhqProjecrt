<style scoped lang="scss">
page{
	height: 100%;
}
.order-pay{
	position: relative;
	width: 100%;
	min-height: 100%;
	background-color: $uni-bg-color-grey;
	$bar-h: 96rpx;
	padding-bottom: $bar-h;
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
	.interval{
		width: 100%;
		height: 20rpx;
	}
	.bgc{
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		width: 100%;
		height: 184rpx;
		background-color: $uni-color-primary;
	}
	.content-wraper{
		position: relative;
		z-index: 2;
		width: 100%;
		padding-top: 36rpx;
	}
	.delivery-info{
		background-color: #fff;
		border-radius: 28rpx;
		padding: 46rpx 20rpx 46rpx 14rpx;
		min-height: 216rpx;
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
		.no-addr{
			flex: 1;
			font-size: 28rpx;
			color: #999;
		}
	}
	.group-buy{
		background-color: #fff;
		width: 100%;
		&-cont{
			margin: 0 auto;
			width: $cw;
			padding-top: 30rpx;
			$hcl: #fd6944; // #f98d08
			.explain-text{
				font-weight: bold;
				font-size: 24rpx;
				text{
					color: $hcl;
				}
			}
			.head-img{
				box-sizing: border-box;
				padding: 44rpx 0;
				@include flx-dsp($jsc: center, $ali: center);
				& > view.dynamic-img {
					@include flx-dsp($jsc: center, $ali: center, $drt: column);
					margin-left: 46rpx;
					&.ict{
						
						image{
							border-color: $hcl;
						}
						text{
							background-color: $hcl;
							text{
								background-color: $hcl;
							}
						}
					}
					&:first-child{
						margin-left: 0;
					}
					image{
						position: relative;
						top: 6rpx;
						background-color: $uni-bg-color-grey;
						width: 80rpx;
						height: 80rpx;
						border: 2rpx solid $uni-color-primary;
						border-radius: 50%;
					}
					
					text{
						position: relative;
						z-index: 2;
						@include flx-dsp($jsc: center, $ali: center, $drt: column);
						padding: 0rpx 4rpx;
						border-radius: 16rpx;
						background-color: $uni-color-primary;
						text{
							font-size: 24rpx;
							color: #fff;
							transform: scale(.8);
							background-color: $uni-color-primary;
						}
					}
					
				}
				.who-join{
					position: relative;
					top: -10rpx;
					@include flx-dsp($jsc: center, $ali: center);
					width: 80rpx;
					height: 80rpx;
					border: 1rpx dashed #bebebe;
					border-radius: 50%;
					margin-left: 46rpx;
					text{
						color: rgba(0, 0, 0, 0.4);
						font-size: 28rpx;
					}
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
					@include ellipsis($line: 1);
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
					.goods-name{
						font-size: $uni-font-size-base;
						@include ellipsis($line: 2);
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
					@include flx-dsp($jsc: space-between, $ali: center);
					margin-bottom: 10rpx;
					text{
						font-weight: bold;
						font-size: $uni-font-size-base;
					}
					input{
						text-align: right;
						color: #666;	
						font-size: $uni-font-size-base;
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
				.arrow-right{
					margin-left: 14rpx;
				}
			}
			.leave-msg{
				text-align: right;
				padding-right: 10rpx;
				font-size: $uni-font-size-base;
			}
		}
		
	}
	.express-info{
		padding: 0;
		.cell-value{
			color: #666;
		}
	}
	.summarizing{
		text.cell-value{
			color: $uni-color-primary;
		}
	}
	.pay-way {
		padding: 10rpx 0rpx 10rpx 0rpx;
		.cell-value{
			color: #ccc;
		}
	}
	.group-tip {
		padding: 0;
	}
	.invoice{
		padding: 10rpx 0rpx;
		.cell-value{
			color: #666;
		}
	}
	.pay-bar{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: $bar-h;
		background-color: #fff;
		border-top: 1rpx solid #ddd;
		padding: 0 26rpx;
		box-sizing: border-box;
		@include flx-dsp($jsc: space-between, $ali: center);
		.text-sum{
			@include flx-dsp($jsc: flex-start, $ali: flex-end);
			& > text{
				font-size: $uni-font-size-lg;
			}
			
		}
		.submit-order{
			@include flx-dsp($jsc: center, $ali: center);
			width: 232rpx;
			height: 64rpx;
			background: $uni-color-primary;
			border-radius: 8rpx;
			font-size: $uni-font-size-lg;
			color: #fff;
		}
	}
	::v-deep .cl-radio {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		margin-bottom: 40rpx;
		height: auto;
	}
	::v-deep .cl-radio__input {
		top: 0;
	}
	::v-deep .cl-radio__label {
		flex: 1;
		font-size: 26rpx;
		color: $uni-text-color;
		padding-left: 10rpx;
		text-align: left;
	}
	::v-deep .cl-radio + .cl-radio {
		margin-left: 0px;
		margin-top: 1px;
	}
	::v-deep .cl-dialog__wrapper .cl-dialog__container {
		padding: 10px 10px 15px 10px;
	}
}

.addressModel {
	.address-tips {
		color: #333;
		font-size: 26rpx;
		text-align: left;
		padding: 0px 20px 14px;
	}
	.address-list {
		height:500rpx;
		.address-scroll {
			height: 500rpx;
		}
		.addItem {
			padding: 0 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			.addItem_text {
				flex: 1;
				display: block;
				font-size: 26rpx;
				color: $uni-text-color;
				padding-top: 8rpx;
				padding-left: 10rpx;
			}
		}
	}
	.address-btn {
		margin-top: 40rpx;
		::v-deep .cl-button{
			width: 240rpx;
			height: 69rpx;
		}
		.add_address {
			width: 240rpx;
			height: 69rpx;
			// border: 1px solid $uni-color-primary;
			::v-deep .cl-button__text {
				color: $uni-color-primary;
			}
		}
		.change_btn {
			width: 240rpx;
			height: 69rpx;
			// background-color: $uni-color-primary;
		}
	}
}
</style>

<template>
	<view class="order-pay">
		<view class="bgc"></view>
		<view class="content-wraper">
			<!-- 收货地址 -->
			<view class="delivery-info common-width" @tap="toSelectAddr">
				<image class="location-icon" src="/pages-mall-a/static/location_icon.png" mode=""></image>
				<view class="person-info" v-if="deliveryInfo.name">
					<view class="">
						<text>{{deliveryInfo.name}}</text>
						<text>{{deliveryInfo.phone}}</text>
					</view>
					<text class="addr">{{deliveryInfo.address}}</text>
				</view>
				<text class="no-addr" v-else>请添加收货地址</text>
				<cl-icon :size="30" color="#b6b6b6" name="cl-icon-arrow-right"></cl-icon>
			</view>
			<!-- 拼团/开团 -->
			<view class="interval" v-if="groupInfo"></view>
			<view class="group-buy" v-if="groupInfo">
				<view class="group-buy-cont">
					<text class="explain-text" v-if="groupInfo.type === 1"><text> 【正在开团】</text>立即支付，即可开团成功</text>
					<text class="explain-text" v-else><text> 【我要参团】</text>为你推荐仅差1人的团，完成支付即可拼购成功</text>
					<view class="head-img">
						<view class="dynamic-img" :class="{'ict': img.captain}" v-for="(img, index) in groupInfo.headImgs" :key="index">
							<image :src="img.url" mode="aspectFill"></image>
							<text><text>{{img.captain ? '团长' : '待支付'}}</text></text>
						</view>
						<view class="who-join" v-if="groupInfo.type === 1">
							<text>?</text>
						</view>
					</view>
				</view>
			</view>
			<view class="interval"></view>
			<!-- 店铺/商品 -->
			<view class="shop-goods">
				<view class="shop-item" v-for="(shop, index) in orderList" :key="index">
					<view class="shop-name">
						<image src="/pages-mall-a/static/shop_icon.png" mode=""></image>
						<text>{{shop.shopName}}</text>
					</view>
					<view class="goods-item" v-for="(item, i) in shop.goodsList" :key="i">
						<view class="goods-item-top">
							<image :src="item.img" mode="aspectFill"></image>
							<view class="goods-info">
								<text class="goods-name">{{item.goodsName}}</text>
								<view class="">
									<text class="goods-spec">{{item.spec}}</text>
									<view class="price-container">
										<view class="price">
											<text class="price__symbol">&yen;</text>
											<text class="price__money">{{item.price.int}}</text>
											<text class="price__decimals">{{item.price.flt}}</text>
										</view>
										<text>x {{item.buyNumber}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="goods-item-bottom" v-if="false">
							<text>推荐人</text>
							<input v-model="item.referrer" placeholder-style="color:#ccc; font-size: 26rpx;" placeholder="请输入推荐人" />
						</view>
						<view class="list-cell-container">
							<view class="list-cell">
								<view class="cell-left">
									<text class="label">配送方式</text>
								</view>
								<view class="cell-right">
									<text class="cell-value">{{item.freightText}}</text>
								</view>
							</view>
						</view>
					</view>
					<!-- 配送 -->
					<view class="list-cell-container express-info">
						<view class="list-cell">
							<view class="cell-left">
								<text class="label">配送费用</text>
								<!-- <text class="express-value">{{freightText}}</text> -->
							</view>
							<view class="cell-right">
								<text class="cell-value">&yen; {{shop.freight}}</text>
								<cl-icon class="arrow-right" :size="30" v-if="false" color="#b6b6b6" name="cl-icon-arrow-right"></cl-icon>
							</view>
						</view>
						<view class="list-cell">
							<view class="cell-left">
								<text class="label">优惠券</text>
							</view>
							<view class="cell-right">
								<text class="cell-value">&yen; {{shop.shopCouponSum || 0}}</text>
							</view>
						</view>
						<view class="list-cell">
							<view class="cell-left">
								<text class="label">我要留言</text>
							</view>
							<view class="cell-right">
								<input class="leave-msg" v-model="shop.leaveMsg" placeholder-style="color:#ccc; font-size: 26rpx;" placeholder="备注" />
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 总汇 -->	
			<view class="interval"></view>
			<view class="list-cell-container summarizing">
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">商品金额</text>
					</view>
					<view class="cell-right">
						<text class="cell-value">&yen; {{goodsSum}}</text>
					</view>
				</view>
				<view class="list-cell" v-if="hasIntActivity">
					<view class="cell-left">
						<text class="label">使用积分</text>
					</view>
					<view class="cell-right">
						<text class="cell-value">-{{totalIntegral}}</text>
					</view>
				</view>
				<view class="list-cell" v-if="hasIntActivity">
					<view class="cell-left">
						<text class="label">可用积分</text>
					</view>
					<view class="cell-right">
						<text class="cell-value">{{canUseIntegral}}</text>
					</view>
				</view>
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">优惠券</text>
					</view>
					<view class="cell-right" @tap="openCoupon">
						<text class="cell-value">- &yen; {{usingCoupon.yuanSum}}</text>
						<cl-icon class="arrow-right" :size="30"  color="#b6b6b6" name="cl-icon-arrow-right"></cl-icon>
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
			</view>
			<view class="interval"></view>
			<view class="list-cell-container invoice" @tap="applyInvoice">
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">发票</text>
					</view>
					<view class="cell-right">
						<text class="cell-value" v-if="invoicesInfo&&invoicesInfo.headType == 1">(个人){{invoicesInfo.invoiceHead}}</text>
						<text class="cell-value" v-else-if="invoicesInfo&&invoicesInfo.headType == 2">(企业){{invoicesInfo.invoiceHead}}</text>
						<text class="cell-value" v-else>{{invoicePlhTxt}}</text>
						<cl-icon v-if="invoiceStatus == 1" class="arrow-right" :size="30" color="#b6b6b6" name="cl-icon-arrow-right"></cl-icon>
					</view>
				</view>
			</view>
			<view class="interval"></view>
			<view class="list-cell-container pay-way">
				<view class="list-cell">
					<view class="cell-left">
						<text class="label">支付方式</text>
					</view>
					<view class="cell-right" @tap="choosePayWay({callPage: 'pay-order'})">
						<text class="cell-value">{{payWay.label}}</text>
						<cl-icon class="arrow-right" v-if="paywayArrowShow() || isSupportOfflinePay" :size="30" color="#b6b6b6" name="cl-icon-arrow-right"></cl-icon>
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
			<view class="pay-bar">
				<view class="text-sum">
					<text>总计：</text>
					<view class="price">
						<text class="price__symbol">&yen;</text>
						<text class="price__money">{{total.int}}</text>
						<text class="price__decimals">{{total.flt}}</text>
					</view>
				</view>
				<text class="submit-order" @tap="submitOrder">提交订单</text>
			</view>
			<!-- toast提示 -->
			<cl-toast ref="toast"></cl-toast>
			<cl-message ref="elMessage"></cl-message>
			<!-- 优惠券弹框 -->
			<coupon-popup ref="cpnPopup" @cpConfirmUsing="cpConfirmUsing" :showCoupon.sync="showCoupon"></coupon-popup>
			<!-- 支付方式 -->
			<cl-action-sheet ref="action-sheet"></cl-action-sheet>
			<!-- 收货地址弹窗  暂不抽取组件 -->
			<cl-dialog class="addressModel" title="切换地址" :visible.sync="isShowAddress">
				<view class="address-tips" v-if="isAddressTips">
					<text>您的配送地址已切换，是否匹配更换</text>
				</view>
				 <view class="address-list">
					 	<scroll-view class="address-scroll" scroll-y="true">
							<cl-radio-group v-model="addressValue" @change="selectChange">
								<cl-radio
									v-for="(item,index) in addessList"
									:key="item.receivingAddressId"
									:label="item.receivingAddressId"
									round
								>{{item.consigneeAddress}}{{item.inputAddress}}</cl-radio>
							</cl-radio-group>
						</scroll-view>
					</view>
					<view class="address-btn">
						<cl-button class="add_address" @tap="createEditAddr" plain round>新建地址</cl-button>
						<cl-button class="change_btn" @tap="changeAddrBtn" type="warning" round>确认</cl-button>
					</view>
			</cl-dialog>
		</view>
	</view>
</template>

<script>
	import { paymentMx, orderCoupon } from '@/js/minxins.js';
	import CouponPopup from './coupon-popup.vue';
	import {mapState, mapMutations} from 'vuex'
import Payment from '@/js/payment.js'

	export default {
		data() {
			return {
				isShowAddress: false,		//弹窗切换地址  start
				addressValue: '',
				addessList: [],
				isAddressTips: false,
				cureentAddrData: {},	//弹窗切换地址  end

				deliveryInfo: {
					name: '',
					phone: '',
					address: ''
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
				leaveMsg: '',
				submitting: false,
				orderListT: [
					{
						shopName: '天天有家超市',
						shopId: 'shopId', // 商家id
						promotionId: 'promotionId', // 促销ID
						promotionType: 'promotionType', // 促销类型:0未参与,1团购、2秒杀，3积分、4分销
						secKillSn: 'secKillSn', // 秒杀序列号，秒杀订单必填
						goodsList: [
							{
								goodsId: '1', // 商品id
								img: 'https://cms.wuyeface.com/filemanager/filedatabase/img/2021/1/21/ec341f00-f0bb-43c9-a73d-ba62604f2ce1.jpg',
								goodsName: 'BEBEHOO START 轻便四轮婴儿 高级景观 推车-亚麻灰 ',
								spec: '1.8L', // 商品规格
								specId: 'specId2', // 商品规格id
								price: {
									int: '18',
									flt: '.08',
									value: 18.08
								},
								buyNumber: 1,
								integrals: 'integrals', // 使用积分 暂时无传空字符
							},
							{
								goodsId: '2',
								img: 'https://cms.wuyeface.com/filemanager/filedatabase/img/2021/1/21/ec341f00-f0bb-43c9-a73d-ba62604f2ce1.jpg',
								goodsName: 'BEBEHOO START 轻便四轮婴儿 高级景观 推车-亚麻灰 ',
								spec: '1.8L',
								specId: 'specId1',
								price: {
									int: '18',
									flt: '.08',
									value: 18.08
								},
								buyNumber: 1,
								integrals: 'integrals',
							}
						]
					}
				],
				groupInfoT: {
					type: 2, // 1 是开团 2 参团
					headImgs: [
						{
							url: 'https://cms.wuyeface.com/filemanager/filedatabase/img/2021/1/21/ec341f00-f0bb-43c9-a73d-ba62604f2ce1.jpg', // 头像地址
							captain: 1 // 是否团长 1 是 0 否
						},
						{
							url: 'https://cms.wuyeface.com/filemanager/filedatabase/img/2021/1/21/ec341f00-f0bb-43c9-a73d-ba62604f2ce1.jpg', // 头像地址
							captain: 0 // 是否团长 1 是 0 否
						},
					]
				},
				groupInfo: null,
				freightCode: 0,
				freightText: '',
				deliveryMethod: 0,
				hasIntActivity: false, // 是否积分商品
				totalIntegral: 0,
				canUseIntegral: 0,
				showCoupon: false,
				payWay: {
					label: '微信支付',
					code: 'wx'
				},
				seKillSnError: false, // 秒杀序列号是否请求!=200
				usingCoupon: {
					ids: [],
					sum: 0,
					yuanSum: 0,
					couponAmountList: []
				},
				houseAddr: '',
				invoiceStatus: 0, // 是否开发票。{ 0: 不开, 1: 开}
				joinGroupTip: false, // 当参团时候，就需要勾选这个提示
				hasShareCode:null,//分销过来的
				isSupportOfflinePay:false,//是否支持线下支付
				shareId:'',//链接过来的shareId
				isDecodeUrl: false, // 是否对url decode
			}
		},
		computed:{
			...mapState('mall', {
				orderAddress: state => state.orderAddress,
				invoicesInfo: state => state.invoicesInfo
			}),
			invoicePlhTxt() {
				const invoiceStatus = this.invoiceStatus;
				return invoiceStatus == 0 ? '不支持开发票' : '不开发票';
			},
			// 获取活动类型
			isGroupType() {
				// promotionType = 1 团购类型
				return this.orderList[0]?.promotionType === 1
			}
		},
		components: {
			CouponPopup
		},
		mixins: [paymentMx, orderCoupon],
		methods: {
			...mapMutations({
				updateOrderAddress: 'mall/updateOrderAddress'		
			}),
			getAddress() {
				const testPms = new Promise((resolve) => {
				  setTimeout(() => {
					  const list = [
						  {
							name: '张雯雯',
							phone: '13209121234',
							address: '广东省广州市天河区天河北路国际科贸大厦890号1502',
							isDefault: 1  
						  }
					  ];
					  resolve({statusCode: 200, data: list})
				  }, 100);
				});
				const orderAddress = this.orderAddress;
				if (orderAddress) {
					const {consignee, receivingTelephone, consigneeAddress, inputAddress} = orderAddress;
					this.deliveryInfo = {
						...orderAddress,
						name: consignee,
						phone: receivingTelephone,
						address: `${consigneeAddress}${inputAddress}`
					};
					return Promise.resolve()
				}
				const {memberId} = this.$cmMth.getUserStatusInfo() || {};
				const prodPms = this.$mallApi.data.addrList({hideLoading: true, responseToast: false});
				const pms = prodPms;
				return pms.then(res => {
					this.shopCartNum = 0;
					if (res.statusCode === 200) {
						const list = Array.isArray(res.data) ? res.data : [];
						let addr = null, firstAddr = null;
						list.some((item, index) => {
							const {consignee, receivingTelephone, consigneeAddress, inputAddress} = item;
							if (index === 0) {
								firstAddr = {
									...item,
									name: consignee,
									phone: receivingTelephone,
									address: `${consigneeAddress}${inputAddress}`
								};
							}
							if (item.isDefault) {
								addr = {
									...item,
									name: consignee,
									phone: receivingTelephone,
									address: `${consigneeAddress}${inputAddress}`
								};
								this.addressValue = item.receivingAddressId
								// 默认当前地址参数
								this.cureentAddrData = item
								return
							}
						})
						if (list.length) this.deliveryInfo = addr ? addr : firstAddr;
						this.addessList = list
					} else {
						this.toastTips({message: res.message});
					}
				})
			},
			getOrderDetail() {
				const testPms = new Promise((resolve) => {
				  setTimeout(() => {
					  const data = {
						freight: 8,
						orderList: this.orderListT
					  };
					  resolve({statusCode: 200, data})
				  }, 100);
				});
				const pms = testPms;
				return pms.then(res => {
					this.orderList = [];
					if (res.statusCode === 200) {
						const {orderList, freight} = res.data || {};
						this.orderList = orderList;
						this.calcPrice({freight});
					}
				})
			},
			getOrderDetailByQuery(options = {}) {
				const {orderList, freight } = options;
				const precision = this.$cmMth.precision;
				const isDecodeUrl = this.isDecodeUrl
				let totalIntegral = 0
				this.orderList = JSON.parse(isDecodeUrl ? decodeURIComponent(orderList) : orderList);
				this.orderList.forEach(item => {
					const {promotionType, goodsList} = item;
					const hasIntActivity = this.hasIntActivity;
					if (promotionType === 3 && !hasIntActivity) this.hasIntActivity = true;
					item.leaveMsg = '';
					Array.isArray(goodsList) && goodsList.forEach(goods => {
						const {integrals, buyNumber} = goods;
						const int = precision.times(Number(integrals) || 0, buyNumber)
						if (promotionType === 3) totalIntegral = precision.plus(totalIntegral, int || 0);
					})
				})
				this.totalIntegral = totalIntegral;
				this.calcPrice({init: 1});
			},
			calcPrice(params = {}) {
				const {init} = params;
				const orderList = this.orderList;
				const precision = this.$cmMth.precision;
				let expressFee = 0;
				const goodsSum = (_ => {
					let totalGoodsSum = 0;
					orderList.forEach(shop => {
						Array.isArray(shop.goodsList) && shop.goodsList.forEach(goods => {
							const {price, buyNumber} = goods;
							const thePrice = precision.times(buyNumber, price.value);
							totalGoodsSum = precision.plus(totalGoodsSum, thePrice);
						})
						// 初始化运费字段
						if (init) shop.freight = '0.00'
						if (shop.freight !== undefined) {
							expressFee =  precision.plus(expressFee, Number(shop.freight));
						}
					});
					totalGoodsSum = this.$cmMth.formatSum({value: totalGoodsSum, type: 'UpperCamelCase'});
					return totalGoodsSum || {};
				})();
				const totalSum = (() => {
					const usingCoupon = this.usingCoupon;
					const val = Number(`${goodsSum.int}${goodsSum.flt}`);
					const totalSumNum = precision.minus(precision.plus(val, expressFee), usingCoupon.yuanSum);
					const {int, flt} = this.$cmMth.formatSum({value: totalSumNum, type: 'UpperCamelCase'});
					return {
						int,
						flt,
						value: totalSumNum
					}
				})()
				const freightFormatSum = this.$cmMth.formatSum({value: expressFee, type: 'UpperCamelCase'});
				this.goodsSum = `${goodsSum.int}${goodsSum.flt}`;
				this.freight = `${freightFormatSum.int}${freightFormatSum.flt}`;
				this.total = totalSum;
			},
			hasOpenId() {
				const userInfo = this.$cmMth.storageAction({key: USER_INFO, action: 'get'});
				const hasOpenId = !!(userInfo && userInfo.openId);
				if (!hasOpenId) this.$cmMth.toAuth();
				return !!hasOpenId;
			},
			isOverIntegral() {
				const hasIntActivity = this.hasIntActivity;
				let bool = false;
				if (hasIntActivity) bool =  this.totalIntegral > this.canUseIntegral;
				if (bool) uni.showToast({title: '使用积分大于可用积分', duration: 2000, icon: 'none'});
				return bool;
			},
			async submitOrder() {
				// 如果是团购类型，需要勾选成团提示
				if (this.isGroupType && !this.joinGroupTip) {
					this.$refs.toast.open({
						message: '请勾选协议，否则无法进行操作',
						position: 'bottom'
					})
					return
				}

				const {USER_INFO, SHARE_ID} = this.$constant;
				const submitting = this.submitting;
				const consignee = this.deliveryInfo.name;
				const isWebViewApp = this.isWebViewApp();
				const userInfo = this.$cmMth.storageAction({key: USER_INFO, action: 'get'});
				// const shareId = this.$cmMth.storageAction({key: SHARE_ID, action: 'get'});
				const shareId = this.shareId;
				const hasOpenId = !!(userInfo && userInfo.openId);
				const overIntegral = this.isOverIntegral();
				if (!consignee) return uni.showToast({title: '请添加收货地址', duration: 2000, icon: 'none'});
				if (submitting || overIntegral) return;
				if (!submitting) {
					this.submitting = true;
					let args = await this.getOrderParams();
					args.shareId = shareId	
					await this.querySecKillSn(args).catch();
					if (this.secKillSnError) {
						this.submitting = false;
						return
					}; // 查询秒杀序列号失败，不给提交订单
					const res = await this.$mallApi.data.submitOrder({ data: args, loadingText: '提交中', responseToast: false })
					if (!res.success) {
						this.submitting = false
						this.toastTips({ message: res.message })
						return
					}

					const { payInfo, payAmount, payOrderSn, tradeType} = res.data || {}
					const isIntegralPay = payInfo === null && payAmount === 0
					const notNeedInvokePay = isIntegralPay || tradeType == "offline" || tradeType === 'zeropay'
					if (notNeedInvokePay) {
						uni.navigateTo({url: `/pages-mall-a/order/pay-result?paySn=${payOrderSn}`});
					} else {
						const { success, data } = await Payment.wxPayAll(this.payWay.code, res.data)
						this.submitting = false
						if (success) {
							if (data === 'success') {
								// 跳转到支付结果页面
								Payment.payToResultPage(payOrderSn)
							} else if (data === 'cancel') {
								// 跳转到订单列表页面
								uni.redirectTo({ url: '/pages-mall-a/order/list?orderStatus=0' })
							}
						}
					}
				}
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
								   this.submitting = false;
						           uni.navigateTo({url: `/pages-mall-a/order/pay-result?paySn=${paySn}`});
								   resolve(res)
						       },
						       fail:  (err) => {
								   const {errMsg} = err;
								   if (errMsg === 'requestPayment:fail cancel') {
										uni.redirectTo({
											url: `/pages-mall-a/order/list?orderStatus=0`
										});
								   }
						          resolve(err)
						       }
						   });
					    }
					});
				})
			},
			async getOrderParams() {
				const {PROJECT_INFO} = this.$constant;
				const orderList = this.orderList;
				const {value: totalVal} = this.total;
				const {memberId, memberName, memberPhone} = this.$cmMth.getUserStatusInfo() || {};
				const goodsSum = this.goodsSum;
				const freight = this.freight;
				const precision = this.$cmMth.precision;
				const {name: consigneeName, phone: consigneePhone, address: consigneeAddress, receivingAddressId} = this.deliveryInfo;
				const projectData = this.$cmMth.storageAction({key: PROJECT_INFO, action: 'get'}) || {};
				let params = {
					orderParams: [],
					receivingAddressId,
					invoiceInfo: this.invoicesInfo,
					projectId: projectData.projectId || '',
					projectName: projectData.projectName || '',
				}
				if (this.houseAddr) params.memberCertifiedRoomAddress = this.houseAddr;

				/** 支付参数 */
				const payType = this.payWay.code
				const payAmount = precision.times(totalVal, 100)

				let args = {}
				if (payType === 'wx') {
					args = Payment.submitByWX(null, payAmount)
				} else if (payType === 'zfb') {
					args = Payment.submitByZFB(null, payAmount)
				} else if (payType === 'offline'){
					args = Payment.submitByOffline(null, payAmount)
				}

				// #ifdef  H5
				const isAPP = this.isWebViewApp()
				if (!isAPP) args.returnUrl = this.getPayResultPage()
				// #endif
				/** 支付参数 */

				params = Object.assign({}, params, args)

				orderList.forEach(item => {
					const {shopId, secKillSn, promotionId, promotionType, goodsList, groupSn, leaveMsg} = item;
					
					const exampleArgs = {
						buyerId: '', // 买方(会员)ID
						buyerName: '', // 买方姓名
						buyerPhone: '', // 买方联系方式
						buyerRemark: '', // 买方留言
						consigneeAddress: '', // 收货地址
						consigneeName: '', // 收货人姓名
						consigneePhone: '', // 收货人联系方式
						couponList: [], // *
						deliveryType: 0, // 配送方式:0、快递，1、自提点
						estimateIntegral: '', // 预计订单可获得积分 *
						freight: '', // 运费
						orderAmount: '', // 订单总金额
						orderType: 0, // 订单类型:0、商品订单，1、服务订单
						payAmount: '', // 订单实付金额
						promotionId: '', // 促销ID
						promotionType: '', // 促销类型:0未参与,1团购、2秒杀，3积分、4分销
						secKillSn: '', // 秒杀序列号，秒杀订单必填
						sellerId: '', // 卖家(店铺)ID
						totalCouponsAmount: '', // 优惠券总额=(优惠券集合内的总额)
						useIntegral: '', // 使用积分 *
						orderGoodsList: [
							{
								couponsAmount: '', // 优惠券金额(按比例分摊) *
								goodsId: '',
								goodsName: '',
								goodsSpec: '', // 商品规格
								integrals: '', // 使用积分 *
								numbers: '', // 购买数量
								payAmount: '', // 支付总金额(单位:分)
								promotionId: '', // 商品促销活动ID
								promotionStatus: '', // 商品促销状态：0未参与，1团购、2秒杀，3积分、4分销
								specId: '', // 商品规格ID
								totalAmount: '', // 商品总价(单位:分)
								unitPrice: '', // 单价(单位:分)
							}
						]
					}
					let shopPayAmount = 0;
					const shopArg = {
						buyerId: memberId, // 买方(会员)ID
						buyerName: memberName, // 买方姓名
						buyerPhone: memberPhone, // 买方联系方式
						buyerRemark: leaveMsg, // 买方留言
						//consigneeAddress, // 收货地址
						//consigneeName, // 收货人姓名
						//consigneePhone, // 收货人联系方式
						couponIdList: [], // *
						deliveryType: 0, // 配送方式:0、快递，1、自提点
						estimateIntegral: '', // 预计订单可获得积分 *
						freight: precision.times(Number(item.freight) || 0, 100), // 运费
						//orderAmount: 0, // 订单总金额
						orderType: 0, // 订单类型:0、商品订单，1、服务订单
						//payAmount: 0, // 订单实付金额
						promotionId, // 促销ID
						promotionType, // 促销类型:0未参与,1团购、2秒杀，3积分、4分销
						secKillSn: '', // 秒杀序列号，秒杀订单必填
						sellerId: shopId, // 卖家(店铺)ID
						//totalCouponsAmount: 0, // 优惠券总额=(优惠券集合内的总额)
						useIntegral: 0, // 使用积分 *
						orderGoodsList: [],
						groupSn, // 团购序列号(非必填)，有值视为参团，无值视为开团
					}
					if(this.hasShareCode){
						shopArg.distributionCode = this.hasShareCode.shareCode;
						shopArg.promotionType = this.hasShareCode.promotionType;
						shopArg.promotionId = this.hasShareCode.promotionId;
					}
					Array.isArray(goodsList) && goodsList.forEach(goods => {
						const {img, price, buyNumber, goodsId, spec, specId, goodsName, integrals, deliveryMethod, supplySpecId} = goods;
						const salePrice = precision.times(price.value, 100);
						const totalAmount = precision.times(salePrice, buyNumber);
						const {cpnIds, couponsAmount} = (_ => {
							let cpnIds = [], couponsAmount = 0;
							const couponAmountList = this.usingCoupon.couponAmountList;
							couponAmountList.some(item => {
								if (item.specId === specId) {
									if (typeof item.couponIds === 'string') cpnIds = cpnIds.concat(item.couponIds.split(','));
									couponsAmount = precision.plus(couponsAmount, item.couponAmount || 0);
									return true;
								}
							})
							return {
								cpnIds,
								couponsAmount
							}
						})()
						const gdsInt = precision.times(Number(integrals) || 0, buyNumber) // 单个商品总积分
						const goodsArg = {
							//couponsAmount, // 优惠券金额(按比例分摊) *
							goodsId,
							//goodsImageUrl: img,
							//goodsName,
							//goodsSpec: spec, // 商品规格
							integrals: integrals || 0, // 使用积分 *
							numbers: buyNumber, // 购买数量
							//payAmount: precision.minus(totalAmount, couponsAmount) , // 支付总金额(单位:分)
							promotionId, // 商品促销活动ID
							promotionType, // 商品促销状态：0未参与，1团购、2秒杀，3积分、4分销
							specId, // 商品规格ID
							//totalAmount, // 商品总价(单位:分)
							//unitPrice: price.price, // 单价(单位:分)
							salePrice, // 结算价/销售价
							deliveryMethod,
							supplySpecId,
							gsName: spec,
							sellerId: shopId,
							gmName: goodsName
						}
						shopPayAmount = precision.plus(shopPayAmount, totalAmount);
						if (cpnIds) {
							shopArg.couponIdList = shopArg.couponIdList.concat(cpnIds)
						}
						//shopArg.totalCouponsAmount = precision.plus(shopArg.totalCouponsAmount, couponsAmount);
						shopArg.orderGoodsList.push(goodsArg); 
						shopArg.useIntegral = precision.plus(shopArg.useIntegral, gdsInt || 0);
					})
					//shopArg.orderAmount = shopPayAmount;
					// 支付金额+运费-优惠券金额
					//shopArg.payAmount = precision.minus(precision.plus(shopPayAmount, shopArg.freight), shopArg.totalCouponsAmount);
					params.orderParams.push(shopArg);
				});
				return params;
			},
			// 打开收货地址（改版后弹窗）
			toSelectAddr() {
				this.isShowAddress = true
				// uni.navigateTo({
				//     url: '/pages-mall-a/address-mng/address-mng?fromPage=order'
				// });
			},
			getExpressFee() {
				const freightCode = this.freightCode;
				const {address, inputAddress, consignee, phone, provinceName, cityName, countyName, streetName} = this.deliveryInfo || {}
				if (address) {
					const list = (_ => {
						const tempList = []
						this.orderList.forEach(shopItem => {
							const {shopId, goodsList} = shopItem;
							const shop = {
								sellerId: shopId,
								list: []
							}
							Array.isArray(goodsList) && goodsList.forEach(goods => {
								const {goodsId, buyNumber, specId, deliveryMethod, supplySpecId, spec, goodsName} = goods;
								const g = {
									gmId: goodsId,
									number: buyNumber,
									gsId: specId,
									deliveryMethod,
									supplySpecId,
									gsName: spec,
									sellerId: shopId,
									gmName:goodsName
								}
								tempList.push(g);
							})
							// tempList.push(shop)
						})
						return tempList
					})()
					const params = {
						data: {
							address: {
								consignee,
								description: inputAddress,
								phone,
								province: provinceName,
								city: cityName,
								area: countyName,
								street: streetName,
							},
							spuList: list,
						},
						hideLoading: true,
						responseToast: false
					}
					return this.$mallApi.data.getExpressFee(params).then(res => {
						const freeObj = res.data || {};
						if(res.statusCode === 200) {
							const orderList = this.orderList;
							let hasValue = false
							for(const key in freeObj) {
								hasValue = true
								orderList.some(item => {
									if (item.shopId === String(key) && freeObj[key]) {
										item.freight = freeObj[key]
										return true
									}
								})
							}
							if (hasValue) this.calcPrice()
						} else {
							this.toastTips({message: res.message});
						}
					})
				} else {
					return Promise.resolve()
				}
				
			},
			async querySecKillSn(params) {
					const list = params.orderParams;
					this.secKillSnError = false;
					for(let i = 0; i < list.length; i++) {
						const {buyerId, promotionType, orderGoodsList} = list[i] || {};
						const isSeckill = Number(promotionType) === 2;
						if (this.secKillSnError) break;
						if (isSeckill) {
							const {goodsId, promotionId, specId, numbers: buyNumber} = Array.isArray(orderGoodsList) && orderGoodsList[0] || {};
							const arg = {
								buyerId,
								goodsId,
								goodsSpecId: specId,
								promotionId,
								goodsSpecQuantity: buyNumber
							}
							await this.$mallApi.data.querySeckillSn({data: arg, responseToast: false}).then(res => {
								if (res.statusCode === 200 && res.data) {
									params.orderParams[i].secKillSn = res.data;
								} else {
									this.secKillSnError = true;
									this.toastTips({message: res.message});
								}
							}).catch(_ => {});
						}
						
					}
				},
			getCanUseIntegral() {
				const {memberId} = this.$cmMth.getUserStatusInfo() || {};
				const params = {
					pathParams: `/${memberId}`
				}
				return this.$mallApi.data.getMemberIntegralValue(params).then(res => {
						if(res.statusCode === 200) {
							this.canUseIntegral = res.data || 0;
						} else {
							this.toastTips({message: res.message});
						}
					})
			},
			async updateAddrExpressFee() {
				const hasIntActivity = this.hasIntActivity;
				uni.showLoading({title: '加载中'});
				await this.getAddress().catch(() => {});
				if (hasIntActivity) await this.getCanUseIntegral().catch(() => {});
				await this.getExpressFee().catch(() => {});
				await this.getOwnerHouseInfo().catch(() => {});
				await this.initPopupData().catch(() => {});

				uni.hideLoading();
			},
			initPageData(options = {}) {
				const {orderList, groupInfo, freightCode, freightText, deliveryMethod, invoiceStatus , hasShareCode , shareId} = options;
				const hasGroup = typeof groupInfo === 'object' && !Array.isArray(groupInfo) && Object.keys(groupInfo).length
				const { platform } = this.$cmMth.getTerminalPlatformArg();
				const isDecodeUrl = this.isDecodeUrl = platform === 'APPLET'
				if (deliveryMethod) this.deliveryMethod = Number(deliveryMethod)
				if (freightCode) this.freightCode = Number(freightCode);
				if (freightText) this.freightText = decodeURIComponent(freightText);
				if (hasGroup) this.groupInfo = JSON.parse(decodeURIComponent(groupInfo));
				if (orderList) this.getOrderDetailByQuery(options),this.isSupportOfflinePayBySellerId(JSON.parse( isDecodeUrl ? decodeURIComponent(orderList) : orderList));
				if (invoiceStatus) this.invoiceStatus = invoiceStatus
				if (hasShareCode) this.hasShareCode = JSON.parse(hasShareCode)
				if (shareId) this.shareId = shareId

				this._getConfigByCode()
			},
			// 获取判断是否支持线下支付
			async isSupportOfflinePayBySellerId(orderList){
				let ids = []
				orderList.map(item=>{
					ids.push(item.shopId)
				})
				const params = {
					pathParams: `/${ids.join(",")}`,
					hideLoading: true,
					responseToast: false
				}
				let res = await this.$mallApi.data.supportOfflinePay(params)
				if(res.statusCode == 200){
					this.isSupportOfflinePay = true
				}else{
					this.isSupportOfflinePay = false
				}
			},
			// 申请开票
			applyInvoice(){
				if (this.invoiceStatus == 0) return

				uni.navigateTo({
					 url: '/pages-mall-b/invoices/invoices'
				});
			},
			// 优惠券确认使用
			cpConfirmUsing(params) {
				const {goodsList, couponIdList} = params || {};
				const odls = this.orderList;
				const goodsSum = this.goodsSum;
				const validData = Array.isArray(goodsList) && Array.isArray(couponIdList);
				if (validData) {
					const precision = this.$cmMth.precision;
					let couponSum = 0;
					goodsList.forEach(item => {
						couponSum = precision.plus(item.couponAmount, couponSum)
					});
					odls.forEach((item, i) => {
						const {goodsList: gdls} = item;
						let shopCouponSum = 0;
						Array.isArray(gdls) && gdls.forEach((gd, j) => {
							const {specId} = gd;
							let couponSum = 0;
							goodsList.some(itm => {
								if (itm.specId === specId) {
									couponSum = itm.couponAmount
									
									return true
								}
							})
							shopCouponSum = precision.plus(shopCouponSum, couponSum);
						});
						item.shopCouponSum = precision.divide(shopCouponSum, 100)
					})
					const yuanSum = precision.divide(couponSum, 100);
					const isEquSum = yuanSum == goodsSum && false;
					this.usingCoupon.ids = couponIdList;
					this.usingCoupon.sum = isEquSum ? precision.minus(couponSum, 1) : couponSum;
					this.usingCoupon.yuanSum = isEquSum ? precision.minus(yuanSum, 0.01) : yuanSum;
					this.usingCoupon.couponAmountList = goodsList;
					this.calcPrice();
				}
			},
			// 打开优惠券弹框
			openCoupon() {
				const ref = this.$refs['cpnPopup'];
				if (ref && ref.showCouponFn) {
					ref.showCouponFn(this.orderList)
				}
			},
			// 初始化优惠券数据
			initPopupData() {
				return new Promise(async (resolve) => {
					const {available} = await this.getDataList().catch();
					const hasValue = Array.isArray(available) && available.length;
					if (hasValue) await this.confirmCouponUseing({whoCall: 'payOrder', init: 1}).catch();
					resolve();
				})
			},
			// 获取业主房产信息
			getOwnerHouseInfo() {
				const {memberId} = this.$cmMth.getUserStatusInfo() || {};
				const params = {
					pathParams: `/${memberId}`,
					hideLoading: true, 
					responseToast: false
				}
				return this.$mallApi.data.getOwnerHouseInfo(params).then(res => {
					if (res.statusCode === 200) {
						const list = Array.isArray(res.data) ? res.data : [];
						let houseAddr = '';
						const cacheAddr = this.houseAddr;
						list.some(item => {
							if (item.isDefault) {
								houseAddr = item.address;
								return true;
							}
						});
						if (!houseAddr && list[0]) houseAddr = list[0].address;
						this.houseAddr = houseAddr ? houseAddr : cacheAddr;
					}
				}).catch(err => {})
			},
			// 切换收货地址
			selectChange(val) {
				this.cureentAddrData = this.addessList.find(item => item.receivingAddressId == val)
				this.isAddressTips = true
			},
			// 选择其他收货地址   --跳到新增页面
			createEditAddr() {
				uni.navigateTo({
					url: '/pages-mall-a/address-mng/create-edit-addr'
				})
			},
			// 切换地址---确认
			// changeAddrBtn() {
			// 	this.isAddressTips = false
			// },
			// 选中
			async changeAddrBtn() {

				let {
					receivingAddressId,
					consignee,
					receivingTelephone,
					consigneeAddress,
					inputAddress,
					provinceName,
					cityName,
					countyName,
					streetName,
					memberId
				} = this.cureentAddrData
				// this.$emit('update:addressData', addressData)
				let params = {
					memberId,
					receivingAddressId,
					consignee,
					receivingTelephone,
					consigneeAddress,
					inputAddress,
					provinceName,
					cityName,
					countyName,
					streetName,
					isDefault: 1
				}

				uni.showLoading({ title: '设置中' })
				const res = await this.$mallApi.data.editAddr({ hideLoading: true, data: params })
				if (res.statusCode === 200) {
					// this.getAddress()
					// this.$parent.getAddrStock()
					// this.$emit('getAddrStock')
					await this.getAddress()
					await this.getExpressFee()
					this.isShowAddress = false
					this.isAddressTips = false
				} else {
					this.toastTips({ message: res.message })
				}
				uni.hideLoading()
			},

			//支付 默认值
			async _getConfigByCode() {
				const params = {
					pathParams: '/DefaultPaymentMethod'
				}
				const { data: res } = await this.$mallApi.data.getConfigByCode(params)
				// configDesc offline或 zfb改变   否则默认微信支付 wx
				if(res.configDesc == 'offline'&& this.isSupportOfflinePay) {
					this.payWay.label = '线下支付'
					this.payWay.code = 'offline'
				}else if(res.configDesc == 'zfb'){
					this.payWay.label = '支付宝'
					this.payWay.code = 'zfb'
				}
			},
			
		},
		onLoad(option) {
			const optionsTest = {
				orderList: encodeURIComponent(JSON.stringify(this.orderListT)),
				freight: 8
			}
			this.initPageData(option);
		},
		onShow(){
			this.setAlipayWay();
			this.updateAddrExpressFee();
		},
		created() {
			uni.$on('changeAddress', this.getAddress)
		},
		mounted() {
			
		},
		beforeDestroy() {
			uni.$off('changeAddress', this.getAddress)
		}
	}
</script>


