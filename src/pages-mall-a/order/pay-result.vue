<style scoped lang="scss">
page{
	height: 100%;
}
.pay-successful{
	width: 100%;
	min-height: 100%;
	$bg-h: 272rpx;
	background-color: $uni-bg-color-grey;
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
	.status-background{
		width: 100%;
		height: $bg-h;
		background-color: $uni-color-primary;
		background-size: cover;
		@include flx-dsp($jsc: center, $ali: center, $drt: column);
		.query-tips{
			@include flx-dsp($jsc: center, $ali: center, $drt: column);
			text{
				font-size: 40rpx;
				color: #fff;
			}
		}
		.pay-status{
			@include flx-dsp($jsc: center, $ali: center);
			color: #fff;
			image{
				width: 44rpx;
				height: 44rpx;
			}
			.tips-text{
				margin-left: 10rpx;
				font-size: 40rpx;
			}
		}
		.buttons{
			margin-top: 36rpx;
			@include flx-dsp($jsc: center, $ali: center);
			.back-index{
				margin-right: 40rpx;
			}
			text{
				@include flx-dsp($jsc: center, $ali: center);
				color: #fff;
				width: 200rpx;
				height: 60rpx;
				border-radius: 30rpx;
				border: 1px solid #fff;
				font-size: 26rpx;
			}
		}
	}
	.recommend4you{
		margin:  0rpx auto 0 auto;
		width: 500rpx;
		height: 130rpx;
		@include flx-dsp($jsc: center, $ali: center);
		& > text{
			font-size: 28rpx;
		}
	}
	.recommend4you-list{
		margin: 0 auto;
		width: 710rpx;
		height: calc(100vh - 130rpx  - 272rpx - var(--window-top));
		.swiper-container{
			width: 100%;
			height: 100%;
			padding: 0 20rpx;
			box-sizing: border-box;
		}
		.goods-swiper{
			width: 100%;
			height: 100%;
			.good-item{
				background-color: #fff;
				border-radius: 8rpx;
				width: 100%;
				padding-bottom: 20rpx;
				margin-bottom: 20rpx;
				.goods-image{
					width: 100%;
					height: 320rpx;
					border-radius: 8rpx 8rpx 0 0;
					&view, ::v-deep .img-show{
						border-radius: 8rpx 8rpx 0 0;
					}
				}
				.goods-desc{
					font-size: 26rpx;
					@include ellipsis();
					color: #333;
					margin: 14rpx 20rpx;
				}
				.goods-bottom{
					margin: 0 20rpx;
					@include flx-dsp($jsc: space-between, $ali: center);
					image{
						width: 30rpx;
						height: 30rpx;
					}
					
				}
			}
		}
	}
	.init-recommend4you{
		@include flx-dsp($jsc: center, $ali: center);
		text{
			color: #333;
			font-size: 28rpx;
		}
	}
	.no-data{
		width: 100%;
		@include flx-dsp($jsc: center, $ali: center);
		text{
			color: #999;
			font-size: 28rpx;
		}
		.iconfont{
			margin-right: 6rpx;
			font-size: 40rpx;
		}
	}
	::v-deep .cl-divider__text{
		background-color: $uni-bg-color-grey !important;
	}
	::v-deep .cl-divider__line{
		background: #e6e6e6 !important;
	}
}
</style>

<template>
	<view class="pay-successful">
		<view class="status-background">
			<view class="result-tips" v-if="loaded">
				<view class="pay-status" v-if="payStatus === 1">
					<image src="/pages-mall-a/static/smile.png" mode=""></image>
					<text class="tips-text">支付成功</text>
				</view>
				<view class="pay-status" v-else>
					<image src="/pages-mall-a/static/sad.png" mode=""></image>
					<text class="tips-text">支付失败</text>
				</view>
				<view class="buttons">
					<text class="back-index" @tap="buttonsEvent({type: 'index'})">返回首页</text>
					<text @click="buttonsEvent({type: 'order'})">查看订单</text>
				</view>
			</view>
			<view class="query-tips" v-else>
				<text>正在查询支付结果...</text>
			</view>
		</view>
		<!-- 为您推荐 -->
		<view class="recommend4you">
			<text>· 为 / 您 / 推 / 荐 ·</text>
		</view>
		<view class="recommend4you-list">
			<view class="swiper-container">
				<scroll-view :scroll-y="true"  class="goods-swiper">
					<cl-scroller ref="scroller" @up="onUp" @down="onDown">
						<cl-waterfall ref="waterfall"  v-model="recommend4you.list">
							<cl-waterfall-column v-for="(child, index) in recommend4you.list" :key="index">
									<view class="good-item" v-for="(item, i) in child" :key="i" @click="toGoodsDetail(item)">
										<image class="goods-image"  mode="aspectFill" :src="item.url"></image>
										<text class="goods-desc">{{item.title}}</text>
										<view class="goods-bottom">
											<view class="price">
												<text class="price__symbol">&yen;</text>
												<text class="price__money">{{item.money && item.money.int}}</text>
												<text class="price__decimals">{{item.money && item.money.flt}}</text>
											</view>
										</view>
									</view>
							</cl-waterfall-column>
						</cl-waterfall>
						<cl-loadmore finish-text="我是底线" v-if="recommend4you.list.length && !recommend4you.refreshing" :finish="!recommend4you.hasData" :loading="recommend4you.pending"></cl-loadmore>
						<view class="no-data" v-if="recommend4you.inited && !recommend4you.refreshing && !recommend4you.list.length">
							<text>下拉刷新，发现商品~</text>
						</view>
						<view v-if="!recommend4you.inited" class="init-recommend4you">
							<text>加载中...</text>
						</view>
					</cl-scroller>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				recommend4you: {
					list: [],
					inited: false,
					refreshing: false,
					hasData: true,
					pending: false,
					current: 1,
					pageSize: 10
				},
				loaded: false,
				payStatus: 0,
				timer: null,
				pollEnd: false
			}
		},
		onLoad(option) {
			const {status} = option || {};
			const isCancelpay = status === 'WAIT_BUYER_PAY';
			this.loadRecommendData();
			if (isCancelpay) {
				this.loaded = true;
			} else {
				this.getPayResult(option);
				this.pollResult(option);
			}
		},
		methods: {
			...mapMutations({
				updateOrderAddress: 'mall/updateOrderAddress'		
			}),
			loadRecommendData(params) {
				const {refresh, inited} = params || {};
				const { current, list: recommendList, pageSize } = this.recommend4you;
				const canLoad = this.recommend4you.hasData || !recommendList.length;
				const isMock = false;
				if (isMock) {
					const total = 36;
					const list = [];
					const num = recommendList.length >= total ? 0 : total - recommendList.length >= pageSize ? pageSize : total - recommendList.length;
					for (let i = 0; i < num; i++) {
						list.push({
							id: '6050ab963b36f3349833149d',
							title: '芝华士12年500ml+ 百龄坛特醇 威士忌 洋酒',
							url: 'https://cms.wuyeface.com/filemanager/filedatabase/img/2021/1/21/ec341f00-f0bb-43c9-a73d-ba62604f2ce1.jpg',
							price: 1999,
							money: {
								int: '1999',
								flt: '.00'
							}
						});
					}
					const mockResp = {
						statusCode: 200,
						message: '请求成功',
						data: {
							list,
							total
						}
					};
					if (canLoad) {
						this.recommend4you.pending = false;
						return this.$mallApi.Test.mock({ mock: mockResp, hideLoading: true, timeout: 1000 }).then(res => {
							this.recommend4you.pending = false;
							this.recommend4you.inited = true;
							if (res.statusCode === 200) {
								const list = res.data.list;
								list.forEach(item => {
									this.recommend4you.list.push(item);
								});
								if (list.length) ++this.recommend4you.current;
								this.recommend4you.hasData = !(list.length < pageSize);
								
							}
							if (refresh) {
								this.$refs["scroller"].end();
								this.recommend4you.refreshing = false;
							}
							
						});
					} else {
						return Promise.resolve();
					}
				} else {
					if (canLoad) {
						this.recommend4you.pending = true;
						const {memberId} = this.$cmMth.getUserStatusInfo() || {};
						return this.$mallApi.data.getRecommendGoods({ data: {memberId}, pathParams: `/${pageSize}/${current}`, hideLoading: true }).then(res => {
							this.recommend4you.pending = false;
							this.recommend4you.inited = true;
							if (res.statusCode === 200) {
								const list = res.data && Array.isArray(res.data.records) && res.data.records || [];
								const waterfallList = []
								list.forEach(item => {
									const {gmName, lowestPrice, files, logo, ...ohters} = item;	
									const url = logo;
									const money = this.$cmMth.formatSum({value: lowestPrice, type: 'UpperCamelCase'});
									const goods = {
										...ohters,
										title: gmName,
										url,
										money
									};
									waterfallList.push(goods);
								});
								if (list.length) ++this.recommend4you.current;
								this.$refs["waterfall"].append(waterfallList);
								this.recommend4you.hasData = !(list.length < pageSize);
								console.log(this.recommend4you)
							}
							if (refresh) {
								this.$refs["scroller"].end();
								this.recommend4you.refreshing = false;
							}
							
						});
					} 
				}
			},
			onDown() {
				const ref = this.$refs["waterfall"];
				this.recommend4you.refreshing = true;
				this.recommend4you.current = 1;
				this.recommend4you.list = [];
				ref && ref.refresh && ref.refresh([]);
				this.loadRecommendData({refresh: true});
			},
			onUp () {
				this.recommend4you.pending = true;
				this.loadRecommendData();
			},
			toGoodsDetail(goods) {
				const {gmId} = goods;
				uni.navigateTo({
					url: `/pages-mall-a/shopping-info/shopping-info?shopId=${gmId}`
				});
			},
			buttonsEvent(params) {
				const {type} = params || {};
				if (type === 'index') {
					uni.switchTab({
					    url: '/pages-mall/index/index'
					});
				} else if (type === 'order') {
					uni.navigateTo({
						url: `/pages-mall-a/order/list?orderStatus=${this.payStatus}`
					});
				}
			},
			getPayResult(option) {
				const {paySn} = option || {};
				const testPms = new Promise((resolve) => {
				  setTimeout(() => {
					  const rd = Math.random();
					  resolve({statusCode: rd > .5 ? 200 : 204})
				  }, 100);
				});
				const prodPms = this.$mallApi.data.getPayResult({pathParams: `/${paySn}`, hideLoading: true, responseToast: false});
				const pms = prodPms;
				pms.then(res => {
					if (res.statusCode === 200) {
						this.payStatus = 1;
						this.pollEnd = true;
						this.loaded = true;
					}
				})
			},
			pollResult(option) {
				const isWebViewApp = this.$cmMth.isWebViewApp(); 
				const countTime = isWebViewApp ? 10 : 5;
				let count = 0;
				this.timer = setInterval(_ => {
					const pollEnd = this.pollEnd;
					if (pollEnd || count >= countTime) {
						clearInterval(this.timer);
						this.pollEnd = true;
						this.loaded = true;
					} else {
						count = count + 1;
						this.getPayResult(option);
					}
				}, 2000)
			}
		},
		beforeDestroy(){
			clearInterval(this.timer);
		},
		onShow() {
			this.updateOrderAddress(null);
		}
		
	}
</script>


