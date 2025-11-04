<style scoped lang="scss">
	.limit-time-seckill{
		$pdt: 260rpx;
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
			height: 286rpx;
			background-color: $uni-color-primary;
			padding-top: 46rpx;
			.seckill-date{
				margin: 0 auto;
				width: $comm-width;
				@include flx-dsp($jsc: space-between, $ali: center);
				& > view{
					opacity: .6;
					flex: 1;
					@include flx-dsp($jsc: flex-start, $ali: center, $drt: column);
					text{
						color: #fff;
					}
					text:nth-child(1){
						font-size: 36rpx;
						margin-bottom: 20rpx;
					}
					text:nth-child(2){
						font-size: 24rpx;
					}
				}
				.current-date{
					opacity: 1;
				}
			}
			.count-down-wrapper{
				margin-top: 34rpx;
				width: 100%;
				height: 50rpx;
				@include flx-dsp($jsc: center, $ali: center);
				.count-down{
					padding: 0 30rpx;
					height: 100%;
					border-radius: 26rpx;
					background-color: rgba($color: #fff, $alpha: .17);
					@include flx-dsp($jsc: flex-start, $ali: center);
					text{
						color: #fff;
					}
					text:nth-child(1){
						margin-right: 10rpx;
						font-size: 24rpx;
					}
					text:nth-child(2){
						font-size: 36rpx;
					}
				}
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
							text.tobe-buy{
								background-color: #e2e2e2;
							}
						}
					}
				}
			}
		}
		.no-data{
			padding-top: 200rpx;
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
	<view class="limit-time-seckill">
		<!-- 背景 -->
		<view class="bg">
			<!-- 抢购日期 -->
			<view class="seckill-date">
				<view @tap="switchDate(index)" :class="{'current-date': sekillDateIndex === index}" v-for="(item, index) in sekillDate" :key="index">
					<text>{{item.dayText}}</text>
					<text>{{item.text}}</text>
				</view>
			</view>
			<!-- 倒计时 -->
			<view class="count-down-wrapper">
				<view class="count-down" v-if="sekillDateIndex === 0">
					<text>距离结束</text>
					<text>{{countDown.h}}:{{countDown.m}}:{{countDown.s}}</text>
				</view>
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="goods-list common-width">
			<cl-scroller ref="scroller" @up="onUp" @down="onDown">
				<view class="goods-style" v-for="(item, index) in goodsList" :key="index" @tap.stop="toGoodDetail(item)">
					<view class="image-container">
						<image :src="item.poster" mode="aspectFill"></image>
						<view class="sold-out" v-if="item.soldOut">
							<image src="/pages-mall-a/static/sold_out.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="goods-info">
						<view class="goods-info-top">
							<view class="goods-name">
								<text class="shop-type" v-if="item.shopType && item.sellerSource === 0">{{item.shopType}}</text>
								{{item.name}}
							</view>
							<view class="group-a-coupon">
								<text class="cp" v-for="(tag, i) in item.coupon" :key="i">满{{tag.full}}减{{tag.minus}}</text>
							</view>
						</view>
						<view class="goods-info-down">
							<view class="price-wrapper">
								<cl-text class="now-price" type="price" :value="item.nowPrie"></cl-text>
								<view class="origin-price">
									<text>原价</text> <cl-text type="price" :size="30" :value="item.originPrice"></cl-text>
								</view>
							</view>
							<view class="buttons">
								<!-- <text v-if="storeCount(item) === 0" class="tobe-buy">已售罄</text> -->
								<text v-if="sekillDateIndex === 0" @tap.stop="toGoodDetail(item)">去抢购</text>
								<text v-else class="tobe-buy">待抢购</text>
							</view>
						</view>
					</view>
				</view>
				<cl-loadmore v-show="goodsList.length && load.show" :text="load.text" :finish="load.finish" :finish-text="load.finishText" :loading="load.pending"></cl-loadmore>
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
				isBegin: true,
				sekillDate: [],
				sekillDateIndex: 0,
				countDown: {
					h: '00',
					m: '00',
					s: '00',
					timer: null
				},
			}
		},
		methods: {
			// 库存是否为空。如果是活动商品，则获取promotionActivity里的库存；如果是普通商品，则获取普通库存
			storeCount(item) {
				return item.specList.map(spec => spec.promotionActivity?.availableCount || spec.storeCount || 0).reduce((sum, count) => (sum += count, sum), 0)
			},
			startCountDown() {
				const formatDate = this.$cmMth.formatDate;
				const today = formatDate({ type: 'd2d', value: new Date(), format: 'YY-MM-DD'});
				const countDown = `${today} 23:59:59`;
				const endTime = formatDate({ type: 'd2s', value: countDown});
				const displayTime = () => {
					const startTime = new Date().getTime();
					const second = (endTime - startTime) / 1000;
					if (second > 0) {
						let days = 0, h = 0, m = 0, s = 0;
						days = Number.parseInt(second / 60 / 60 / 24);
						h = Number.parseInt(second / 3600) % 24;
						m = Number.parseInt(second / 60) % 60;
						s = Math.floor(second % 60);
						this.countDown.h = h >= 10 ? h : '0' + h;
						this.countDown.m = m >= 10 ? m : '0' + m;
						this.countDown.s = s >= 10 ? s : '0' + s;
					}
				}
				
				displayTime();
				this.countDown.timer = setInterval(_ => {
					const startTime = new Date().getTime();
					const second = (endTime - startTime) / 1000;
					if (second <= 0) {
						this.clearCountDown();
					} else {
						let days = 0, h = 0, m = 0, s = 0;
						days = Number.parseInt(second / 60 / 60 / 24);
						h = Number.parseInt(second / 3600) % 24;
						m = Number.parseInt(second / 60) % 60;
						s = Math.floor(second % 60);
						this.countDown.h = h >= 10 ? h : '0' + h;
						this.countDown.m = m >= 10 ? m : '0' + m;
						this.countDown.s = s >= 10 ? s : '0' + s;
					}
				}, 1000);
			},
			clearCountDown() {
				clearInterval(this.countDown.timer);
				this.countDown.timer = null;
				this.countDown.h = '00';
				this.countDown.m = '00';
				this.countDown.s = '00';
			},
			getGoodsList(params = {}) {
				const {isReset, init} = params;
				const {companyId} = this.$cmMth.getUserStatusInfo();
				const {current, pageSize} = this.load;
				const {dateFormat} = this.sekillDate[this.sekillDateIndex];
				const {PROJECT_INFO} = this.$constant;
				const {projectId} = this.$cmMth.storageAction({key: PROJECT_INFO, action: 'get'}) || {};
				const today = this.$cmMth.formatDate({value: new Date(), type: 'd2d', format: 'YY-MM-DD'})
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
					  }, 2000);
				});
				const args = {
					data: {
						promotionType: 2,
						//activityDate: dateFormat,
						activityDateEnd: dateFormat,
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
					if(init) uni.hideLoading();
					this.load.show = true;
					this.load.pending = false;
					if (res.statusCode === 200) {
						const list = res.data && Array.isArray(res.data.records) ? res.data.records : [];
						const allLoaded = list.length < pageSize;
						let dividerText = '';
						const goodsList = [];
						list.forEach((item, i) => {
							const {gmName, priceStr, activityPriceStr, logo, files, source, specList} = item;
							const poster = logo;
							// const {nowPrie, originPrice} = (_ => {
							// 	let nowPrie = 0, originPrice = 0;
							// 	Array.isArray(specList) && specList.some(spec => {
							// 		if (spec.promotionActivity) {
							// 			originPrice = spec.price
							// 			nowPrie = Number(spec.promotionActivity.activityPrice)
							// 			return true
							// 		}
							// 	})
							// 	return { nowPrie, originPrice}
							// })()
							const goods = {
								...item,
								name: gmName,
								poster,
								coupon: [],
								shopType: source === 0 ? '自营' : source === 1 ? '京东' : source === 2 ? '阿里巴巴' : source === 3 ? '天猫' : '',
								nowPrie: activityPriceStr,
								originPrice: priceStr,
								soldOut: false,
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
						if (this.goodsList.length) this.startCountDown();
					}
				})
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
			getDate() {
				const dayNum = [
					{index: 0, text: '抢购中', dayText: '今天'},
					{index: 1, text: '即将开始', dayText: '明天'},
					{index: 2, text: '即将开始'},
					{index: 3, text: '即将开始'},
					{index: 4, text: '即将开始'}
				];
				const formatDate = this.$cmMth.formatDate;
				dayNum.forEach((item, i) => {
					const today = new Date();
					today.setDate(today.getDate() + Number(i));
					const dstr = formatDate({value: today, type: 'd2d', format:'YY-MM-DD'});
					const [y, m, d] = dstr.split('-');
					item.dateFormat = dstr;
					if (i >= 2) {
						item.dayText = `${m}/${d}`;
					}
				})
				return dayNum;
			},
			switchDate(index) {
				this.sekillDateIndex = index;
				this.load.finish = false;
				this.load.current = 1;
				this.load.finish = true;
				this.goodsList = [];
				this.getGoodsList({init: 1});
			},
			toGoodDetail(params = {}) {
				uni.navigateTo({
					url: `/pages-mall-a/shopping-info/shopping-info?shopId=${params.gmId}&shopType=2`
				});
			},
		},
		onLoad() {
			this.sekillDate = this.getDate();
			this.getGoodsList({init: 1});
		},
		beforeDestroy() {
			this.clearCountDown();
		}
	}
</script>



