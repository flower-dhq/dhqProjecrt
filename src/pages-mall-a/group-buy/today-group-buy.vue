<style scoped lang="scss">
	.today-group-buy{
		$pdt: 140rpx;
		position: relative;
		width: 100%;
		height: 100%;
		background-color: $uni-bg-color-grey;
		padding-top: $pdt;
		box-sizing: border-box;
		.bg{
			position: absolute;
			left: 0;
			top: 0;
			z-index: 1;
			@include flx-dsp($jsc: flex-start, $ali: center, $drt: column);
			width: 100%;
			height: 252rpx;
			background-color: $uni-color-primary;
			padding-top: 46rpx;
			image{
				width: 378rpx;
				height: 69rpx;
			}
		}
		.goods-list{
			position: relative;
			z-index: 2;
			height: 100%;
			::v-deep .cl-scroller__wrap{
				border-radius: 26rpx;
				height: 100%;
			}
			.goods-style{
				width: 100%;
				background-color: #fff;
				border-radius: 26rpx;
				padding: 24rpx;
				box-sizing: border-box;
				@include flx-dsp($jsc: flex-start, $ali: flex-start);
				margin-bottom: 20rpx;
				&:last-child{
					margin-bottom: 0;
				}
				.image-container{
					position: relative;
					width: 210rpx;
					height: 210rpx;
					margin-right: 26rpx;
					border-radius: 16rpx;
					overflow: hidden;
					& > image{
						width: 100%;
						height: 100%;
					}
					.sold-out{
						@include flx-dsp($jsc: center, $ali: center);
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						height: 100%;
						background-color: rgba($color: #000, $alpha: .2);
						image{
							width: 110rpx;
							height: 100rpx;
						}
						
					}
					.save-mny{
						position: absolute;
						left: 0;
						bottom: 0;
						width: 100%;
						height: 44rpx;
						@include flx-dsp($jsc: center, $ali: center);
						color: #fff;
						font-size: 24rpx;
						background-color: rgba($color: $uni-color-primary, $alpha: .6);
						border-radius: 0 0 16rpx 16rpx;
					}
				}
				.goods-info{
					flex: 1;
					@include flx-dsp($jsc: flex-start, $ali: flex-start, $drt: column);
					&-top{
						.goods-name{
							flex-wrap: wrap;
							@include flx-dsp($jsc: flex-start, $ali: flex-start);
							font-size: $uni-font-size-lg;
							@include ellipsis($line: 1);
							.shop-type{
								background-color: $uni-color-primary;
								border-radius: 10rpx 0 10rpx 0;
								color: #fff;
								padding: 2rpx 8rpx;
								font-size: 24rpx;
								margin-right: 10rpx;
							}	
						}
						.group-a-coupon{
							flex-wrap: wrap;
							@include flx-dsp($jsc: flex-start, $ali: center);
							margin: 16rpx 0;
							text{
								margin-right: 14rpx;
								&:last-child{
									margin-right: 0;
								}
							}
							.g-b-n{
								display: inline-block;
								border-radius: 16rpx;
								background-color: $uni-color-primary;
								color: #fff;
								font-size: 24rpx;
								padding: 2rpx 10rpx;
							}
							.cp{
								border-radius: 4rpx;
								border: 1rpx solid $uni-color-primary;
								color: $uni-color-primary;
								font-size: 24rpx;
								padding: 2rpx 8rpx;
								border-radius: 8rpx;
							}
						}
					}
					&-down{
						width: 100%;
						@include flx-dsp($jsc: space-between, $ali: flex-end);
						.price-wrapper{
							@include flx-dsp($jsc: flex-start, $ali: flex-start, $drt: column);
							::v-deep .now-price{
								color: $uni-color-primary !important;
								.cl-text__symbol--price{
									font-size: 26rpx;
								}
								.cl-text__value{
									font-size: 40rpx !important;
									font-weight: normal;
								}
								.cl-text__precision{
									font-size: 30rpx;
								}
							}
							.origin-price{
								$cl: #cbcbcb;
								color: $cl;
								font-size: $uni-font-size-base;
								
								::v-deep .is-price{
									text-decoration: line-through;
									color: $cl !important;
									.cl-text__symbol--price{
										font-size: 16rpx;
									}
									.cl-text__value{
										font-size: 30rpx !important;
									}
									.cl-text__precision{
										font-size: 20rpx;
									}
								}
							}	
						}
						.buttons{
							text{
								@include flx-dsp($jsc: center, $ali: center);
								width: 136rpx;
								height: 60rpx;
								border-radius: 8rpx;
								font-size: $uni-font-size-base;
								color: #fff;
							}
							text:nth-child(1){
								background-color: $uni-color-primary;
							}
							text:nth-child(2){
								background-color: #e2e2e2;
							}
						}
					}
				}
			}
		}
		.no-data{
			padding-top: 260rpx;
			@include flx-dsp($jsc: center, $ali: center, $drt: column);
			image{
				width: 503rpx;
				height: 418rpx;
			}
			text{
				font-size: 26rpx;
				color: #888;
			}
		}
		::v-deep .cl-divider__line{
			background: #e6e6e6 !important;
		}

	}
</style>

<template>
	<view class="today-group-buy">
		<!-- 背景 -->
		<view class="bg">
			<image src="/pages-mall-a/static/group_buy_text.png" mode=""></image>
		</view>
		<!-- 商品列表 -->
		<view class="goods-list common-width">
			<cl-scroller ref="scroller" @up="onUp" @down="onDown">
				<view class="goods-style" @tap.stop="toGoodDetail(item)" v-for="(item, index) in goodsList" :key="index">
					<view class="image-container">
						<image :src="item.poster" mode="aspectFill"></image>
						<text class="save-mny" v-if="item.save">省{{item.save}}元</text>
					</view>
					<view class="goods-info">
						<view class="goods-info-top">
							<view class="goods-name">
								<text class="shop-type" v-if="item.shopType === '自营'">{{item.shopType}}</text>
								{{item.name}}
							</view>
							<view class="group-a-coupon">
								<text class="g-b-n" v-if="item.groupNum">{{item.groupNum}}人拼</text>
								<text class="cp" v-for="(tag, i) in item.coupon" :key="i">满{{tag.full}}减{{tag.minus}}</text>
							</view>
						</view>
						<view class="goods-info-down">
							<view class="price-wrapper">
								<cl-text class="now-price" type="price" :value="item.lowestPrice"></cl-text>
								<view class="origin-price">
									<text>原价</text> <cl-text type="price" :size="30" :value="item.originPrice"></cl-text>
								</view>
							</view>
							<view class="buttons">
								<text>去拼单</text>
							</view>
						</view>
					</view>
				</view>
				<cl-loadmore v-if="goodsList.length && load.show" :text="load.text" :finish="load.finish" :finish-text="load.finishText" :loading="load.pending"></cl-loadmore>
				<view class="no-data" v-if="!load.pending && goodsList.length === 0">
					<image src="@/pages-mall-a/static/empty/shop_list_none_icon.png" mode=""></image>
					<text>暂无商品~</text>
				</view>	
			</cl-scroller>	
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsList: [],
				load: {
					show: true,
					text: '上拉加载更多',
					finishText: '我是底线',
					finish: false,
					pending: false,
					current: 1,
					pageSize: 10
				},
				isBegin: true
			}
		},
		methods: {
			getGoodsList(params = {}) {
				const {isReset, init} = params;
				const {current, pageSize} = this.load;
				const {companyId} = this.$cmMth.getUserStatusInfo();
				const testPms = new Promise((resolve) => {
				  setTimeout(() => {
						  const list = [];
						  const curNum = (current - 1) * pageSize;
						  const mockTotal = 28;
						  const leng = (mockTotal - curNum) / pageSize > 1 ? pageSize : mockTotal - curNum;
						  for (let i = 0; i < leng; i++) {
							  const rd = Math.random();
							  const poster = rd > .5 ? 'https://cms.wuyeface.com/filemanager/filedatabase/img/2020/12/8/0c14b77b-3192-4077-8a3d-70df20a7f71e.png' : 'https://cms.wuyeface.com/filemanager/filedatabase/img/2021/5/25/0106da29-04c8-41b8-839e-3eaa4f33bda3.jpg'
							  list.push({
								name: `${curNum + i}三只松鼠年货坚果大礼包 7袋装 每日坚果 节日`,
								poster,
								coupon: [
									{
										full: 30,
										minus: 2
									}
								],
								integral: 20,
								shopType: '自营',
								groupNum: 5,
								save: rd > .5 ? 0 : 20,
								nowPrie: 139,
								originPrice: 399,
								soldOut: rd > .5
							  });
						  }
						  resolve({statusCode: 200, data: {records: list}})
					  }, 200);
				});

				const { projectId } = this.getProjectInfo()
				const args = {
					data: {
						promotionType: 1,
						companyId: companyId || '',
						projectId
					},
					pathParams: `/${pageSize}/${current}`,
					hideLoading: true
				};
				const prodPms = this.$mallApi.data.getPromotionGoods(args);
				const pms = prodPms;
				if (isReset || init) {
					this.load.show = false;
					this.goodsList = [];
				} else {
					this.load.show = true;
					this.load.text = '加载中';
				}
				this.load.pending = true;
				if(init) uni.showLoading({title: '加载中'});
				return pms.then(res => {
					this.load.show = true;
					this.load.pending = false;
					if(init) uni.hideLoading();
					if (res.statusCode === 200) {
						const list = res.data && Array.isArray(res.data.records) ? res.data.records : [];
						const allLoaded = list.length < pageSize;
						const goodsList = [];
						const precision = this.$cmMth.precision;
						let dividerText = '';
						list.forEach((item, i) => {
							const {gmName, priceStr, activityPriceStr, files, logo, sellerSource, specList, minLimit} = item;
							const poster = logo;
							const lowestPrice = activityPriceStr
							const originPrice = priceStr
							// const {nowPrie, originPrice, minLimit} = (_ => {
							// 	let nowPrie = 0, originPrice = 0, minLimit = 0;
							// 	Array.isArray(specList) && specList.some(spec => {
							// 		if (spec.promotionActivity) {
							// 			originPrice = spec.price
							// 			nowPrie = Number(spec.promotionActivity.activityPrice)
							// 			minLimit = spec.promotionActivity.minLimit
							// 			return true
							// 		}
							// 	})
							// 	return { nowPrie, originPrice, minLimit}
							// })()
							const goods = {
								...item,
								name: gmName,
								poster,
								coupon: [],
								shopType: sellerSource === 0 ? '自营' : '加盟',
								groupNum: minLimit,
								// nowPrie,
								originPrice,
								lowestPrice,
								soldOut: false,
								save:  precision.minus(originPrice, lowestPrice),
							};
							goodsList.push(goods);
						});
						this.goodsList = this.goodsList.concat(goodsList);
						dividerText = goodsList.length <= 0 ? '暂无商品~' : allLoaded ? '我的底线' : '上拉加载'
						this.load.text = dividerText;
						this.load.finish = allLoaded;
						this.load.finishText = allLoaded && this.goodsList.length === 0 ? '暂无商品~' : '我的底线';
						if (isReset) this.$refs["scroller"].end();
						if (list.length) ++this.load.current;
						
					}
				})
			},
			getProjectInfo() {
				const {PROJECT_INFO} = this.$constant;
				const data = this.$cmMth.storageAction({key: PROJECT_INFO, action: 'get'});
				return data || {};
			},
			onUp () {
				this.load.pending = true;
				this.getGoodsList();
			},
			onDown() {
				this.load.finish = false;
				this.load.current = 1;
				this.load.finish = true;
				this.getGoodsList({isReset: 1});
			},
			joinGroup() {
				const prms = {
				    title: '暂未开放此功能，请敬请期待!',
				    duration: 2000,
					icon: 'none'
				}
				uni.showToast(prms);
			},
			toGoodDetail(params = {}) {
				uni.navigateTo({
					url: `/pages-mall-a/shopping-info/shopping-info?shopId=${params.gmId}&shopType=1`
				});
			},
		},
		onLoad() {
			this.getGoodsList({init: 1});
		}
	}
</script>


