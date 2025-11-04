<style scoped lang="scss">
	
.shop-list{
	$search-h: 76rpx;
	width: 100%;
	min-height: 100%;
	padding: calc(#{$search-h} + 50rpx) 20rpx 30rpx 20rpx;
	box-sizing: border-box;
	background-color: $uni-bg-color-grey;
	.search-input-wr{
		@include flx-dsp($jsc: center, $ali: center);
		position: fixed;
		top: var(--window-top);
		left: 0rpx;
		z-index: 2;
		width: 100%;
		height: calc(#{$search-h} + 40rpx);
		background-color: $uni-bg-color-grey;
	}
	::v-deep .search-input{
		margin: 0 auto;
		width: 710rpx !important;
		height: $search-h;
		background-color: #fff !important;
		border-radius: 34rpx;
		.custom-search-input{
			background-color: #fff !important;
		}
		
	}
	&-container{
		.shop{
			@include flx-dsp($jsc: flex-start, $ali: flex-start);
			width: 100%;
			min-height: 200rpx;
			padding: 40rpx 30rpx;
			background-color: #fff;
			box-sizing: border-box;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			&-info{
				flex: 1;
				margin-right: 20rpx;
				@include flx-dsp($jsc: flex-start, $ali: flex-start);
				.shop-name{
					max-width: calc(100% - 70rpx);
					font-size: $uni-font-size-lg;
					margin-right: 10rpx;
					@include ellipsis($line: 2);
				}
				.tag{
					display: block;
					width: 70rpx;
					text-align: center;
					padding: 4rpx 0;
					background-color: $uni-color-primary;
					border-radius: 10rpx 0 10rpx 0;
					color: #fff;
					font-size: 12px;
				}
			}
			.poster{
				width: 224rpx;
				height: 150rpx;
				border-radius: 10rpx;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
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
	<view class="shop-list">
		<view class="search-input-wr">
			<custom-search-input class="search-input" ref="searchIpt" placeholder="请点击输入店铺名称" style="width: 100%;" v-model="keyWord" @confirm="onSearchConfirm"
			 @clear="cancelSearch"></custom-search-input>
		</view>
		<!-- 店铺列表 -->
		<view class="shop-list-container common-width">
			<view class="shop" v-for="(item, index) in shopList" :key="index" @tap="toShopDetail(item)">
				<view class="shop-info">
					<text class="shop-name">{{item.name}}</text>
					<text class="tag" v-if="item.type === '自营'">{{item.typeText}}</text>
				</view>
				<view class="poster">
					<image :src="item.img" mode="aspectFill"></image>
				</view>
			</view>
			<cl-loadmore v-show="load.show" :text="load.text" :finish="load.finish" :finish-text="load.finishText" :loading="load.pending"></cl-loadmore>
		</view> 
	</view>
</template>

<script>
	export default {
		options: { styleIsolation: 'shared' },
		data() {
			return {
				keyWord: '',
				shopList: [],
				load: {
					show: true,
					text: '上拉加载更多',
					finishText: '我是底线',
					finish: false,
					pending: false,
					current: 1,
					pageSize: 30
				},
				inited: false,
				projectId: '',
				fromCircum: false
			}
		},
		onLoad(options) {
			const {fromCircum} = options;
			if (fromCircum) this.fromCircum = true;
			this.getLocalProject();
			this.getShopList({inited: 1});
		},
		methods: {
			cancelSearch() {
				this.resetLoad();
				this.getShopList({inited: 1});
			},
			onSearchConfirm() {
				this.resetLoad();
				this.getShopList();
			},
			resetLoad(){
				this.load.finish = false;
				this.load.current = 1;
				this.shopList = [];
				this.inited = false;
			},
			getShopList(params = {}) {
				const {inited, isReset} = params;
				const {current, pageSize} = this.load;
				const testPms = new Promise((resolve) => {
				  setTimeout(() => {
						  const list = [];
						  const curNum = (current - 1) * pageSize;
						  const mockTotal = 40;
						  const leng = (mockTotal - curNum) / pageSize > 1 ? pageSize : mockTotal - curNum;
						  for (let i = 0; i < leng; i++) {
							  const r = Math.random();
							  const mode = r > .3 ? 0  : r > .6 ? 1 : 2;
							  const newProduct = r > .5 ? 1 : 0; 
							  const poster = r > .5 ? 'https://cms.wuyeface.com/filemanager/filedatabase/img/2020/12/8/0c14b77b-3192-4077-8a3d-70df20a7f71e.png' : 'https://cms.wuyeface.com/filemanager/filedatabase/img/2021/5/25/0106da29-04c8-41b8-839e-3eaa4f33bda3.jpg'
							  list.push({
								name: `${curNum + i}三只松鼠sdfsfsf年货坚松鼠sdfsfs松鼠sdfsfs果大礼包 7袋装 每日坚果 节日`,
								type: mode,
								typeText: mode == 1 ? '自营' : mode == 2 ? '加盟' : '',
								img: 'https://cms.wuyeface.com/filemanager/filedatabase/img/2021/3/30/319531a9-0fb3-4c65-9dd3-0d2716a64ee1.jpg'
							  });
						  }
						  resolve({statusCode: 200, data: {records: list}})
					  }, 300);
				});
				const {memberId} = this.$cmMth.getUserStatusInfo() || {};
				const keyWord = this.keyWord.trim();
				const args = {
					pathParams: `/${pageSize}/${current}`,
					hideLoading: true,
					data: {
						projectId: ''
					}
				}
				if (this.fromCircum) args.data.projectId = this.projectId
				if (keyWord) args.data.sellerName = keyWord;
				const prodPms = this.$mallApi.data.getShopList(args);
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
						const list = res.data && Array.isArray(res.data.records) ? res.data.records : [];
						const allLoaded = list.length < pageSize;
						let dividerText = '';
						const shopList = [];
						list.forEach((item, i) => {
							const {sellerName, sellerType, logoFile} = item;
							const typeText = sellerType === 1 ? '加盟' : sellerType === 2 ? '自营' : sellerType === 3 ? '京东' : sellerType === 4 ? '天猫' : sellerType === 5 ? '阿里巴巴' : '未知';
							const shop = {
								...item,
								name: sellerName,
								type: sellerType,
								typeText,
								img: logoFile
							};
							shopList.push(shop);
						});
						this.shopList = this.shopList.concat(shopList);
						dividerText = list.length <= 0 ? '暂无商家~' : allLoaded ? '我的底线' : '上拉加载'
						this.load.text = dividerText;
						this.load.finish = allLoaded;
						++this.load.current;
						this.inited = true;
						this.load.finishText = allLoaded && this.shopList.length === 0 ? '暂无商家~' : '我的底线'
						if (isReset) uni.stopPullDownRefresh();
					} else {
						if (this.shopList.length === 0) {
							this.load.text = '暂无商家~'
						}
					}
				})
			},
			toShopDetail(params = {}) {
				const {sellerId} = params;
				uni.navigateTo({url: `/pages-mall-a/shop/detail?shopId=${sellerId}`});
			},
			getLocalProject() {
				const {PROJECT_INFO} = this.$constant;
				const data = this.$cmMth.storageAction({key: PROJECT_INFO, action: 'get'});
				if (data) {
					this.projectId = data.projectId
				}
			},
		},
		onPullDownRefresh() {
			this.resetLoad();
			this.getShopList({isReset: 1});
		},
		onReachBottom() {
			const inited = this.inited;
			const {finish} = this.load;
			if (!inited || finish) return;
			this.getShopList();
		}
	}
</script>


