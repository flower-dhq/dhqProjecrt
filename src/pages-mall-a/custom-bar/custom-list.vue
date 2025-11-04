<style scoped lang="scss">
	.custom-list{
		width: 100%;
		min-height: 100%;
		background-color: $uni-bg-color-grey;
		.query-conditon{
			margin: 0 auto;
			width: 660rpx;
			@include flx-dsp($jsc: space-between, $ali: center);
			height: 80rpx;
			text{
				font-size: 28rpx;
				color: #999;
				
			}
			.active-text{
				text.s-txt{
					color: $uni-color-primary;
					font-weight: bold;
				}
			}
			& > view {
				
				@include flx-dsp($jsc: center, $ali: center);
				& > view {
					@include flx-dsp($jsc: center, $ali: center);
					.sort-icon{
						@include flx-dsp($jsc: center, $ali: center, $drt: column);
						/*  #ifdef  MP-WEIXIN  */
						position: relative;
						top: 2rpx;
						/*  #endif  */
						.s-top{
							position: relative;
							top: 10rpx;
							/*  #ifdef  MP-WEIXIN  */
							top: 14rpx;
							/*  #endif  */
							color: #ccc;
						}
						.s-top-active{
							color: $uni-color-primary;
						}
						.s-bottom{
							position: relative;
							top: -8rpx;
							/*  #ifdef  MP-WEIXIN  */
							top: -15rpx;
							/*  #endif  */
							color: #ccc;
						}
						.s-bottom-active{
							color: $uni-color-primary;
						}
					}
				}
			}
		}
		.goods-list{
			height: calc(100vh - 80rpx - var(--window-top));
			/*  #ifdef  MP-WEIXIN */
			height: calc(100vh - 80rpx - var(--window-top));
			/*  #endif  */
			box-sizing: border-box;
			::v-deep .cl-scroller__wrap{
				border-radius: 16rpx;
			}
			.fall-item{
				$size:330rpx;
				width: $size;
				border-radius: 16rpx;
				&.goods{
					position: relative;
					background-color: #fff;
					padding-bottom: 28rpx;
					$pd: 0 20rpx;
					margin-bottom: 20rpx;
					& > image.poster{
						position: relative;
						z-index: 1;
						border-radius: 16rpx 16rpx 0 0;
						width: 100%;
						max-height: $size;
						background-color: #eee;
					}
					.goods-name{
						padding: $pd;
						margin: 20rpx 0 10rpx 0;
						flex-wrap: wrap;
						@include flx-dsp($jsc: flex-start, $ali: flex-start);
						font-size: $uni-font-size-base;
						@include ellipsis($line: 2);
						.goods-tag{
							background-color: $uni-color-primary;
							border-radius: 10rpx 0 10rpx 0;
							color: #fff;
							padding: 2rpx 8rpx;
							font-size: 24rpx;
							margin-right: 10rpx;
						}
					}

					.goods-btm{
						padding: $pd;
						@include flx-dsp($jsc: flex-start, $ali: center);
						::v-deep .is-price{
							color: $uni-color-primary !important;
							.cl-text__symbol--price{
								font-size: 24rpx;
							}
							.cl-text__value{
								font-size: 34rpx !important;
							}
							.cl-text__precision{
								font-size: 26rpx;
							}
						}
						.cp{
							margin-left: 4rpx;
							border-radius: 4rpx;
							border: 1rpx solid $uni-color-primary;
							color: $uni-color-primary;
							font-size: 24rpx;
							padding: 2rpx 8rpx;
							border-radius: 8rpx;
						}
					}
				}
				
			}
		}
		::v-deep .cl-divider__line{
			background: #e6e6e6 !important;
		}
	}
</style>

<template>
	<view class="custom-list">
		<view class="query-conditon">
			<view @tap="tapConditon(index)" :class="{'active-text': index === conditonIndex || item.sortType === 0}" v-for="(item, index) in conditonList" :key="index">
				<view class="">
					<text class="s-txt">{{item.text}}</text>
					<view class="sort-icon" v-if="item.sortType !== 0">
						<cl-icon name="cl-icon-caret-top" class="s-top" :class="{'s-top-active': sortArrowColor({data: item, index, asc: 1}) }"></cl-icon>
						<cl-icon name="cl-icon-caret-bottom" class="s-bottom" :class="{'s-bottom-active': sortArrowColor({data: item, index, asc: 0})}"></cl-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="goods-list common-width">
			<cl-scroller ref="scroller" @up="onUp" @down="onDown">
				<cl-waterfall ref="waterfall" :column="2" v-model="waterfallList">
					<cl-waterfall-column v-for="(child, index) in waterfallList" :key="index">
						<view v-for="(item, i) in child" :key="i" @tap="toGoodDetail(item)">
							<view class="fall-item goods">
								<image class="poster" :src="item.poster" mode="aspectFill"></image>
								<text class="goods-name">
									<text v-if="item.modeText === '自营'" class="goods-tag">{{item.modeText}}</text>
									{{item.title}}
								</text>
								<view class="goods-btm">
									<cl-text type="price" :size="40" :value="item.price"></cl-text>
									<text class="cp" v-for="(tag, i) in item.coupon" :key="i">满{{tag.full}}减{{tag.minus}}</text>
								</view>
							</view>
						</view>
					</cl-waterfall-column>
				</cl-waterfall>
				<cl-loadmore v-show="load.show" :text="load.text" :finish="load.finish" :finish-text="load.finishText" :loading="load.pending"></cl-loadmore>
			</cl-scroller>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				conditonIndex: 0,
				conditonList: [
					{
						text: '为您推荐',
						sortType: 0
					},
					{
						text: '销量',
						sortType: 1,
						asc: ''
					},
					{
						text: '价格',
						sortType: 2,
						asc: ''
					},
					{
						text: '上架时间',
						sortType: 3,
						asc: ''
					}
				],
				load: {
					show: true,
					text: '上拉加载更多',
					finishText: '我是底线',
					finish: false,
					pending: false,
					current: 1,
					pageSize: 100
				},
				waterfallList: [],
				customId: ''
			}
		},
		methods: {
			setTitle(title) {
				if (title) uni.setNavigationBarTitle({title});
			},
			sortArrowColor(params) {
				const {data, index, asc} = params;
				const isCurrent = this.conditonIndex === index;
				let status = false;
				if (isCurrent) {
					status = ( data.asc !== '' && !data.asc && asc) || ( data.asc !== '' && data.asc && !asc);
				}
				return status;
			},
			tapConditon(index) {
				const conditonIndex = this.conditonIndex;
				const conditonList = this.conditonList;
				const asc = this.conditonList[index].asc;
				conditonList.forEach((item, i) => {
					if (index === i) {
						if (item.justTap) item.asc = !!!asc;
						item.justTap = true;
					} else {
						item.justTap = false;
					}
				})
				this.conditonIndex = index;
				this.load.finish = false;
				this.load.current = 1;
				this.load.finish = false;
				this.waterfallList = [];
				this.$refs["waterfall"].refresh([]);
				this.getGoodsList();
			},
			onUp () {
				this.load.pending = true;
				this.getGoodsList();
			},
			onDown() {
				const ref = this.$refs["waterfall"];
				this.load.finish = false;
				this.load.current = 1;
				this.waterfallList = [];
				ref && ref.refresh && ref.refresh([]);
				this.getGoodsList({isReset: 1});
			},
			toGoodDetail(params = {}) {
				uni.navigateTo({
					url: `/pages-mall-a/shopping-info/shopping-info?shopId=${params.gmId}&shopType=0`
				});
			},
			getGoodsList(params = {}) {
				const {isReset} = params;
				const {current, pageSize, finish} = this.load;
				const index = this.conditonIndex;
				const {asc} = this.conditonList[index];
				const {companyId} = this.$cmMth.getUserStatusInfo();
				const {PROJECT_INFO} = this.$constant;
				const {projectId} = this.$cmMth.storageAction({key: PROJECT_INFO, action: 'get'}) || {};
				const testPms = new Promise((resolve) => {
				  setTimeout(() => {
						  const list = [];
						  const curNum = (current - 1) * pageSize;
						  const mockTotal = 28;
						  const leng = (mockTotal - curNum) / pageSize > 1 ? pageSize : mockTotal - curNum;
						  for (let i = 0; i < leng; i++) {
							  const r = Math.random();
							  const mode = r > .2 ? 1  : r > .4 ? 2 : r > .6 ? 3 : r > .8 ? 4 : 5;
							  const poster = r > .5 ? 'https://cms.wuyeface.com/filemanager/filedatabase/img/2020/12/8/0c14b77b-3192-4077-8a3d-70df20a7f71e.png' : 'https://cms.wuyeface.com/filemanager/filedatabase/img/2021/5/25/0106da29-04c8-41b8-839e-3eaa4f33bda3.jpg'
							  list.push({
								title: `${curNum + i}三只松鼠年货坚果大礼包 7袋装 每日坚果 节日`,
								poster,
								coupon: [
									{
										full: 30,
										minus: 2
									}
								],
								modeText: mode === 1 ? '加盟' : mode === 2 ? '自营' : mode === 3 ? '京东' : mode === 4 ? '天猫' : mode === 5 ? '阿里巴巴' : '未知',
								price: 18.01,
							  });
						  }
						  resolve({statusCode: 200, data: {records: list}})
					  }, 200);
				});
				const args = {
					data: {
						customId: this.customId,
						companyId,
						projectId,
						isRecommend: 0,
						pageSize,
						current
					},
					hideLoading: true,
				}
				if (index !== 0 && asc !== '') args.data[index === 1 ? 'sales' : index === 2 ? 'price' : 'newTime'] = asc ? 2 : 1;
				if (finish) return
				const prodPms = this.$mallApi.data.getRecommendGoodsList(args)
				const pms = prodPms;
				if (isReset) {
					this.load.show = false;
				} else {
					this.load.show = true;
					this.load.text = '加载中';
				}
				return pms.then(res => {
					this.load.show = true;
					if (res.statusCode === 200) {
						const list = Array.isArray(res.data) ? res.data : [];
						const allLoaded = list.length < pageSize;
						const precision = this.$cmMth.precision;
						const waterfallList = [];
						let dividerText = '';
						list.forEach((item, i) => {
							const {gmName, logo, salesCount, lowestPrice, sellerSource} = item;
							const goods = {
								...item,
								title: gmName,
								poster: logo,
								coupon: [],
								modeText: sellerSource === 0 ? '自营' : '加盟',
								price: lowestPrice,
							};
							waterfallList.push(goods);
						});
						this.$refs["waterfall"].append(waterfallList);
						dividerText = waterfallList.length <= 0 ? '暂无商品~' : allLoaded ? '我的底线' : '上拉加载'
						this.load.text = dividerText;
						this.load.finish = allLoaded;
						const [o, t] = this.waterfallList;
						setTimeout( _=>{
							this.load.finishText = allLoaded && o && o.length === 0 ? '暂无商品~' : '我的底线';
						}, 100)
						if (isReset) this.$refs["scroller"].end();
						if (list.length) ++this.load.current;
						
					}
				})
			},
		},
		onLoad(options) {
			const {title, customId} = options;
			this.customId = customId;
			this.setTitle(title);
			this.getGoodsList();
		}
	}
</script>


