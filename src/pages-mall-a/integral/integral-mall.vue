<style scoped lang="scss">
	.integral-mall{
		width: 100%;
		min-height: 100%;
		background-color: $uni-bg-color-grey;
		.bg{
			position: relative;
			@include flx-dsp($jsc: flex-start, $ali: center, $drt: column);
			width: 100%;
			height: 200rpx;
			background-color: $uni-color-primary;
			box-sizing: border-box;
			padding-top: 54rpx;
			& > image{
				width: 192rpx;
				height: 60rpx;
			}
			.my-integral{
				@include flx-dsp($jsc: flex-start, $ali: center);
				position: absolute;
				left: 0;
				bottom: 26rpx;
				background-color: rgba(255,255,255,.42);
				border-radius: 0  26rpx 26rpx 0;
				padding: 8rpx;
				& > image{
					width: 36rpx;
					height: 36rpx;
				}
				text{
					margin: 0 10rpx;
					color: #fff;
					font-size: $uni-font-size-base;
				}
			}
		}
		.integral-condition{
			margin: 30rpx auto;
			overflow-x: auto;
			&::-webkit-scrollbar {display:none}
			.integral-row{
				@include flx-dsp($jsc: flex-start, $ali: center);
				width: 1120rpx;
				/*  #ifdef  MP-WEIXIN */
				width: 1130rpx;
				/*  #endif  */
				.integral-item{
					display: block;	
					&:last-child{
						margin-right: 0;
					}
					margin-right: 20rpx;
					border: 1rpx solid #d3d3d3;
					background-color: #fff;
					font-size: $uni-font-size-base;
					color: #888;
					border-radius: 26rpx;
					padding: 10rpx 20rpx;
					box-sizing: content-box;
					white-space: nowrap;
				}
				text.integral-active{
					$cl: rgba($color: $uni-color-primary, $alpha: .2);
					background-color: $cl;
					border-color: $cl;
					color:  $uni-color-primary;
				}
			}
		}
		.goods-list{
			height: calc(100vh - 340rpx);
			/*  #ifdef  MP-WEIXIN */
			height: calc(100vh - 330rpx);
			/*  #endif  */
			padding-top: 32rpx;
			box-sizing: border-box;
			.fall-item{
				width: 330rpx;
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
					}
					.goods-name{
						padding: $pd;
						margin: 20rpx 0 10rpx 0;
						flex-wrap: wrap;
						@include flx-dsp($jsc: flex-start, $ali: flex-start);
						font-size: $uni-font-size-base;
						@include ellipsis($line: 2);
					}
					.goods-spec{
						margin: 10rpx 0;
						padding: $pd;
						display: inline-block;
						font-size: 24rpx;
						color: #666;
					}
					.goods-btm{
						@include flx-dsp($jsc: flex-start, $ali: center);
						padding: 0 20rpx;
						box-sizing: border-box;
						text{
							font-size: $uni-font-size-base;
						}
						.c-txt{
							color: $uni-color-primary;
							font-size: $uni-font-size-base;
						}
						.jf{
							font-size: 34rpx;
							margin-right: 6rpx;
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
	<view class="integral-mall">
		<!-- 背景 -->
		<view class="bg">
			<image src="/pages-mall-a/static/integral_text.png" mode=""></image>
			<view class="my-integral" @tap="toIntegralDetail">
				<image src="/pages-mall-a/static/integral_icon.png" mode=""></image>
				<text>&nbsp;我的积分:&nbsp;&nbsp;{{myIntegral}}</text>
			</view>
		</view>
		<!-- 积分条件 -->
		<scroll-view scroll-x="" class="integral-condition common-width">
			<view class="integral-row">
				<text class="integral-item" @tap="integralClick(index)" :class="{'integral-active': integralIndex === index}" v-for="(item, index) in integralRange" :key="index">{{item.text}}</text>
			</view>
		</scroll-view>
		<!-- 商品 -->
		<view class="common-width goods-list">
			<cl-scroller ref="scroller" @up="onUp" @down="onDown">
				<cl-waterfall ref="waterfall" :column="2" v-model="waterfallList">
					<cl-waterfall-column v-for="(child, index) in waterfallList" :key="index">
						<view v-for="(item, i) in child" :key="i" @tap="toGoodDetail(item)">
							<view class="fall-item goods">
								<image class="poster" :src="item.poster" mode="widthFix"></image>
								<text class="goods-name">
									{{item.title}}
								</text>
								<text class="goods-spec">{{item.spec}}</text>
								<view class="goods-btm">
									<text><text class="c-txt jf">{{item.integral}}</text>积分+<text  class="c-txt">{{item.rmb}}</text>元</text>
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
				myIntegral: 0,
				integralRange: [
					{
						text: '全部',
						isAll: 1
					},
					{
						text: '1-300',
					},
					{
						text: '301-600',
					},
					{
						text: '601-900',
					},
					{
						text: '901-1500',
					},
					{
						text: '1501-5000',
					},
					{
						text: '5000以上',
						greater: 1
					},
				],
				integralIndex: 0,
				load: {
					show: true,
					text: '上拉加载更多',
					finishText: '我是底线',
					finish: false,
					pending: false,
					current: 1,
					pageSize: 10
				},
				allLoaded: false,
				waterfallList: []
			}
		},
		methods: {
			getGoodsList(params = {}) {
				const {isReset} = params;
				const integralIndex = this.integralIndex;
				const {isAll, greater, text} = this.integralRange[integralIndex];
				const {current, pageSize} = this.load;
				const testPms = new Promise((resolve) => {
				  setTimeout(() => {
						  const list = [];
						  const curNum = (current - 1) * pageSize;
						  const mockTotal = 28;
						  const leng = (mockTotal - curNum) / pageSize > 1 ? pageSize : mockTotal - curNum;
						  for (let i = 0; i < leng; i++) {
							  const poster = Math.random() > .5 ? 'https://cms.wuyeface.com/filemanager/filedatabase/img/2020/12/8/0c14b77b-3192-4077-8a3d-70df20a7f71e.png' : 'https://cms.wuyeface.com/filemanager/filedatabase/img/2021/5/25/0106da29-04c8-41b8-839e-3eaa4f33bda3.jpg'
							  list.push({
								title: `${curNum + i}三只松鼠年货坚果大礼包 7袋装 每日坚果 节日`,
								poster,
								spec: ' 650g1箱',
								integral: 20,
								rmb: 5
							  });
						  }
						  resolve({statusCode: 200, data: {records: list}})
					  }, 200);
				});

				const { projectId } = this.getProjectInfo()
				const args = {
					data: {
						promotionType: 3,
						integralRange: isAll ? '' : text,
						projectId
					},
					pathParams: `/${pageSize}/${current}`,
					hideLoading: true
				};
				const dataAllLoaded = this.allLoaded;
				if (dataAllLoaded) return;
				const prodPms = this.$mallApi.data.getPromotionGoods(args);
				const pms = prodPms;
				if (isReset) {
					this.load.show = false;
					this.$refs["waterfall"].refresh([]);
				} else {
					this.load.show = true;
					this.load.text = '加载中';
				}
				
				return pms.then(res => {
					this.load.show = true;
					if (res.statusCode === 200) {
						const list = res.data && Array.isArray(res.data.records) ? res.data.records : [];
						const allLoaded = list.length < pageSize;
						let dividerText = '';
						const waterfallList = [];
						list.forEach((item, i) => {
							const {gmName, priceStr, files, logo, source, gsName, integral, salesCount, activityPriceStr} = item;
							const poster = logo;
							// const {spec, integral, rmb} = (_ => {
							// 	let specText = '', integral = 0, rmb = 0;
							// 	Array.isArray(specList) && specList.some(spec => {
							// 		if (spec.promotionActivity) {
							// 			specText = spec.gsName
							// 			integral = spec.promotionActivity.integral
							// 			rmb = Number(spec.promotionActivity.activityPrice)
							// 			return true
							// 		}
							// 	})
							// 	return {spec: specText, integral, rmb}
							// })()
							const goods = {
								...item,
								title: gmName,
								poster,
								spec: gsName,
								integral,
								rmb: activityPriceStr
							};
							waterfallList.push(goods);
						});
						this.$refs["waterfall"].append(waterfallList);
						dividerText = waterfallList.length <= 0 ? '暂无商品~' : allLoaded ? '我的底线' : '上拉加载'
						this.load.text = dividerText;
						this.load.finish = allLoaded;
						this.allLoaded = allLoaded;
						const [o, t] = this.waterfallList;
						setTimeout( _=>{
							this.load.finishText = allLoaded && o.length === 0 ? '暂无商品~' : '我的底线';
						}, 100)
						if (isReset) this.$refs["scroller"].end();
						if (!allLoaded) ++this.load.current;
						
					}
				})
			},
			getProjectInfo() {
				const {PROJECT_INFO} = this.$constant;
				const data = this.$cmMth.storageAction({key: PROJECT_INFO, action: 'get'});
				return data || {};
			},
			integralClick(index) {
				this.integralIndex = index;
				this.load.finish = false;
				this.allLoaded = false;
				this.load.current = 1;
				this.load.finish = false;
				this.waterfallList = [];
				this.$refs["waterfall"].refresh([]);
				this.getGoodsList();
			},
			toGoodDetail(params = {}) {
				uni.navigateTo({
					url: `/pages-mall-a/shopping-info/shopping-info?shopId=${params.gmId}&shopType=3`
				});
			},
			onUp () {
				this.load.pending = true;
				this.getGoodsList();
			},
			onDown() {
				this.load.finish = false;
				this.load.current = 1;
				this.load.finish = true;
				this.allLoaded = false;
				this.getGoodsList({isReset: 1});
			},
			getMemberIntegralValue() {
				const {memberId} = this.$cmMth.getUserStatusInfo()
				this.$mallApi.data.getMemberIntegralValue({pathParams: `/${memberId}`, hideLoading: true}).then(res => {
					if (res.statusCode === 200) {
						this.myIntegral = res.data || '0';
					}
				})
			},
			toIntegralDetail() {
				uni.navigateTo({
					url: `/pages-mall-b/integral/integral-detail?myIntegral=${this.myIntegral}`
				})
			}
		},
		onLoad() {
			this.getMemberIntegralValue();
			this.getGoodsList();
		}
	}
</script>


