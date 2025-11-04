<template>
	<view class="shop-detail">
		<!-- 商店顶部 -->
		<view class="top-block">
			<view class="shop-info common-width">
				<view class="text-info">
					<view class="shop-title">
						<text class="s-n">{{shopInfo.name}}</text>
						<view v-if="shopInfo.tag === '自营'" class="tag">
							<text>{{shopInfo.tag}}</text>
						</view>
						<view class="follow" v-if="!followStatus" @tap="handleFollowSeller(1)">关注</view>
						<view class="unfollow" v-if="followStatus" @tap="handleFollowSeller(0)">取消关注</view>
					</view>
					<text class="business" v-if="shopInfo.business">{{shopInfo.business}}</text>
					<view class="coupon-list" @click="showCouponModal">
						<!-- <view class="coupon-item" v-for="(item, index) in shopInfo.coupon" :key="index">
							<text>券</text>
							<text>{{item.text}}</text>
						</view> -->
						<!-- <button class="title-coupon-more" @click="showCouponModal" v-if="showCoupon"> -->
							<!-- 打开或关闭优惠券弹窗 -->
						<!-- 	<cl-icon v-if="!isShowCoupon" name="cl-icon-arrow-bottom" size="26rpx"></cl-icon>
							<cl-icon v-else name="cl-icon-arrow-top" size="26rpx"></cl-icon>
						</button> -->
						<view class="coupon-item" v-for="(tab,index) in couponList" :key="index">
							<text>券</text>
							<text>{{tab.couponConditionsOfUse}}</text>
						</view>
					</view>
				</view>
				<view class="poster">
					<image :src="shopInfo.poster" mode="aspectFit"></image>
				</view>
			</view>
			<view class="bottom-border-radius"></view>
		</view>
		<!-- 商店详情 -->
		<view class="tab-container common-width">
			<view class="tab-pane">
				<view class="" v-for="(item, index) in tabs" :key="index" @tap="tabClick(index)">
					<text>{{item.name}}</text>
					<text :class="{'active': index === tabIndex}"></text>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="goods-info-tab" v-show="tabIndex === 0">
				<!-- 搜索栏 -->
				<view class="header">
					<image class="list-icon" v-if="false" src="@/pages-mall/static/shop/category_list_icon.png" @click="linkTo('category')" />
					<shop-input-search v-model="searchValue" @confirm="refresh" />
					<!-- <view class="click-pd" @click="goSearch"></view> -->
				</view>
				<cl-scroller ref="scroller" @up="onUp" @down="onDown">
						<cl-waterfall ref="waterfall" :column="2" v-model="waterfallList">
							<cl-waterfall-column v-for="(child, index) in waterfallList" :key="index">
								<view v-for="(item, i) in child" :key="i" @tap="toGoodDetail(item)">
									<view class="fall-item goods">
										<image class="poster" :src="item.goodsPic" mode="aspectFill"></image>
										<text class="goods-info">
											<text v-if="shopInfo.tag === '自营'" class="goods-tag">{{shopInfo.tag}}</text>
											{{item.title}}
										</text>
										<view class="goods-btm">
											<cl-text type="price" :size="36" :value="item.salePrice/100"></cl-text>
											<text class="sales-volume">{{item.totalSalesCount}}人付款</text>
										</view>
									</view>
								</view>
							</cl-waterfall-column>
						</cl-waterfall>
						<!--  v-if="load.show" -->
						<cl-loadmore :text="load.text" :finish="load.finish" :finish-text="load.finishText" :loading="load.pending"></cl-loadmore>
				</cl-scroller>	
			</view>
			<!-- 用户评论 -->
			<view class="user-cm-tab" v-show="tabIndex === 1">
				<cl-scroller ref="cmScroller" @up="onUp('comment')" @down="onDown('comment')">
					<view class="comment-item" v-for="(item, index) in commentList" :key="index">
						<view class="user-time">
							<view class="user-info">
								<image :src="item.headImg" mode=""></image>
								<text>{{item.userName}}</text>
							</view>
							<text>{{item.time}}</text>
						</view>
						<text class="goods-name">{{item.goodsName}}</text>
						<view class="evaluate-spec">
							<view class="star-item" v-for="i in 5" :key="i">
								<image class="star-active" v-if="i <= item.score" src="/pages-mall-a/static/star_active.png" mode=""></image>
								<image class="star-unactive" v-if="i > item.score" src="/pages-mall-a/static/star_un_active.png"></image>
							</view>
							<text class="vertical-line"></text>
							<text class="g-spec">{{item.spec}}</text>
						</view>
						<text class="user-cmm">{{item.comment}}</text>
						<view class="cmm-imgs" v-if="item.cmmImgs.length">
							<view class="" :style="{width: cmmImgWidth(item.cmmImgs.length)}">
								<image @tap="previewImage(img)" v-for="(img, i) in item.cmmImgs" :src="img" mode="aspectFill" :key="i"></image>
							</view>
						</view>
						<view class="shop-reply" v-if="item.cutShopReply">
							<text class="triangle"></text>
							<text class="shop-flag">商家回复</text>
							<text v-if="item.unfoldStatus" class="omit">{{item.cutShopReply}}<text>...</text><text class="unfold" @tap="item.unfoldStatus = !item.unfoldStatus">展开</text></text>
							<template v-else>
								<div class="omit omit-box" :class="{ 'omit-hor': j !== 0 }" v-for="(reply, j) in item.children" :key="j">
									<text class="omit-txt">{{ reply.reviewDesc }}</text>
									<text>{{reply.createTime}}</text>
								</div>
							</template>
						</view>
					</view>	
					<view :style="{opacity: noCm ? 0 : 1}" v-if="cmLoad.show">
						<cl-loadmore :text="cmLoad.text" :finish="cmLoad.finish" :finish-text="cmLoad.finishText" :loading="cmLoad.pending"></cl-loadmore>
					</view>
					<view class="no-comment" v-if="noCm">
						<image src="@/pages-mall-a/static/empty/comment_none_icon.png" mode=""></image>
						<text>暂无评价~</text>
					</view>	
				</cl-scroller>	
				
			</view>
			<!-- 商家信息 -->
			<view class="shop-info-tab" v-show="tabIndex === 2">
				<view class="info-card">
					<view class="card-control bdl">
						<view class="card-control-label">
							<view class="img-wr">
								<image class="tel-icon" src="/pages-mall-a/static/tel_icon.png" mode=""></image>
							</view>
							<text>联系方式</text>
						</view>
						<view class="card-control-value">
							<text class="tel-text" v-if="shopInfo.linkman">{{shopInfo.linkman}}</text>
							<text>{{shopInfo.tel}}</text>
						</view>
					</view>
					<view class="card-control">
						<view class="card-control-label">
							<view class="img-wr">
								<image class="addr-icon" src="/pages-mall-a/static/addr_icon.png" mode=""></image>
							</view>
							<text>所在地址</text>
						</view>
						<view class="card-control-value">
							<text>{{shopInfo.address}}</text>
						</view>
					</view>
				</view>
				<view class="info-card">
					<view class="card-control bdl">
						<view class="card-control-label">
							<view class="img-wr">
								<image class="clock-icon" src="/pages-mall-a/static/clock_icon.png" mode=""></image>
							</view>
							<text>营业时间</text>
						</view>
						<view class="card-control-value">
							<text>{{shopInfo.businessHours}}</text>
						</view>
					</view>
					<view class="card-control">
						<view class="card-control-label">
							<view class="img-wr">
								<image class="star-icon" src="/pages-mall-a/static/star_icon.png" mode=""></image>
							</view>
							<text>主营业务</text>
						</view>
						<view class="card-control-value">
							<text>{{shopInfo.mainBusiness}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<coupon-popup identifyParam="/seller" :visible.sync="isShowCoupon" @nocouponlist="noCouponList" @getCouponList="getCouponList"></coupon-popup>
		<cl-message ref="message"></cl-message>
	</view>
</template>

<script>
import ShopInputSearch from '@/pages-mall-a/components/input-search/shop-input-search.vue'
import CouponPopup from '@/pages-mall-a/shopping-info/module/coupon-popup.vue'

	export default {
		options: { styleIsolation: 'shared' },
		components: {
			ShopInputSearch,
			CouponPopup
		},
		data() {
			return {
				searchValue: '',	//搜索
				isSearch: false,
				shopInfo: {
					name: '',
					tag: '',
					business: '',
					coupon: [],
					poster: '',
					tel: '',
					linkman: '',
					address: '',
					businessHours: '',
					mainBusiness: ''
				},
				tabIndex: 0,
				tabs:[
					{
						name: '商品信息',
						
					},
					{
						name: '用户评论',
						list: [
							
						],
						
					},
					{
						name: '商家信息'
					}
				],
				load: {
					show: true,
					text: '上拉加载更多',
					finishText: '我是底线',
					finish: false,
					pending: false,
					current: 1,
					pageSize: 10
				},
				cmLoad: {
					show: true,
					text: '上拉加载更多',
					finishText: '我是底线',
					finish: false,
					pending: false,
					current: 1,
					pageSize: 10
				},
				waterfallList: [],
				commentList: [],
				followStatus: false,
				isShowCoupon: false,
				showCoupon:true,
				couponList:[],
			}
		},
		computed: {
			noCm() {
				return !this.cmLoad.pending && this.commentList.length === 0
			}
		},
		onLoad(option) {
			const {shopId} = option || {}
			if (shopId) this.shopId = shopId;
			this.initData();
			this.getSellerFavoritesState()
		},
		methods: {
			getCouponList(list){
				this.couponList = list
			},
			noCouponList(){
				this.showCoupon = false
			},
			cmmImgWidth(length) {
				return `${length * 160 + (length * 20) - 20}rpx`
			},
			tabClick(index){
				const commentList = this.commentList;
				this.tabIndex = index;
				if (index === 1 && commentList.length === 0) {
					this.getShopCmm({})	
				}
			},
			getShopGoods(params = {}) {
				const {isReset} = params;
				console.log('isReset======',isReset)
				const {current, pageSize} = this.load;
				const {PROJECT_INFO} = this.$constant;
				const {projectId} = this.$cmMth.storageAction({key: PROJECT_INFO, action: 'get'});
				const args = {
					pathParams: `/${pageSize}/${current}`,
					data: {
						keyword: this.searchValue,
						sellerId: this.shopId,  // '1397018657065897985',
						// current,
						// size: pageSize,
						projectId
					},
					hideLoading: true
				}
				const prodPms = this.$mallApi.data.getGoodsByShopId(args);
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
						const waterfallList = [];
						list.forEach((item, i) => {
							const {gmName, price, logoPath, source, salesCount, salePriceStr, clientSalesCount} = item;
							const goods = {
								...item,
								title: gmName,
								poster: logoPath,
								mode: source,
								modeText: source === 0 ? '自营' : source === 1 ? '京东' : source === 2 ? '阿里巴巴' : source === 3 ? '天猫' : '未知',
								price: Number(salePriceStr),
								sv: salesCount || 0,
								clientSalesCount: this.$cmMth.formatSaleCount(clientSalesCount)
							};
							// if (!this.isSearch) {
							// 	waterfallList.push(goods);	
							// }
							waterfallList.push(goods);
						});
						console.log('waterfallList.push(goods)',waterfallList)
						this.$refs["waterfall"].append(waterfallList);
						dividerText = waterfallList.length <= 0 ? '暂无商品~' : allLoaded ? '我的底线' : '上拉加载'
						this.load.text = dividerText;
						this.load.finish = allLoaded;
						const [o, t] = this.waterfallList;
						setTimeout( _=>{
							this.load.finishText = allLoaded && o.length === 0 ? '暂无商品~' : '我的底线';
						}, 100)
						console.log('this.load.finishText===',this.load.finishText,this.load.show)
						if (isReset) this.$refs["scroller"].end();
						if (list.length) ++this.load.current;
						
						console.log('await---=========',waterfallList)
						this.isSearch = false
						return waterfallList
					}
				})
			},
			getShopCmm(params = {}) {
				const {isReset} = params;
				const {current, pageSize} = this.cmLoad;
				const testPms = new Promise((resolve) => {
				  setTimeout(() => {
						  const list = [];
						  const curNum = (current - 1) * pageSize;
						  const mockTotal = 13;
						  const leng = (mockTotal - curNum) / pageSize > 1 ? pageSize : mockTotal - curNum;
						  for (let i = 0; i < leng; i++) {
							  const r = Math.random();
							  const mode = r > .2 ? 1  : r > .4 ? 2 : r > .6 ? 3 : r > .8 ? 4 : 5;
							  const newProduct = r > .5 ? 1 : 0; 
							  const poster = r > .5 ? 'https://cms.wuyeface.com/filemanager/filedatabase/img/2020/12/8/0c14b77b-3192-4077-8a3d-70df20a7f71e.png' : 'https://cms.wuyeface.com/filemanager/filedatabase/img/2021/5/25/0106da29-04c8-41b8-839e-3eaa4f33bda3.jpg'
							  list.push({
								headImg: 'http://thirdwx.qlogo.cn/mmopen/icTdbqWNOwNSzPSTLS2grC5cXOskUicx1ibOX2704PX3yNeX8XcSS9Z7uE5pI7yAN5b8eW5UhIG2hRSHPqKdQQaicryt9Zp7F4xE/132',
								userName: `${curNum + i}三只松鼠`,
								time: '2020-12-17 14:11:36',
								goodsName: '印尼进口Nabati丽芝士 休闲零食威化饼干 奶酪味 美味好吃 网红饼干',
								score: 3,
								spec: '460g/盒',
								comment: '很鲜很甜 物美价廉值得回购',
								cmmImgs: [
									'https://cms.wuyeface.com/filemanager/filedatabase/attach/2021/1/21/02a94ee6-0a79-4c3a-9c35-33bbeda562ab.tencent'
								],
								shopReply: '好评，非常感谢五星好评。好评，非常感谢五星好评。好评，非常感谢五星好评。好评，非常感谢五星好评.好评，非常感谢五星好评。好评，非常感谢五星好评好评，非常感谢五星好评。好评，非常感谢五星好评'
							  });
						  }
						  resolve({statusCode: 200, data: {records: list}})
				  }, 200);
				});
				const {memberId} = this.$cmMth.getUserStatusInfo() || {};
				const args = {
					data: {
						sellerId: this.shopId,
						current,
						size: pageSize
					},
					hideLoading: true
				}
				const prodPms = this.$mallApi.data.getCommentByShopId(args);
				const pms = prodPms;
				if (isReset) {
					this.cmLoad.show = false;
					this.commentList = [];
				} else {
					this.cmLoad.show = true;
					this.cmLoad.text = '加载中';
				}
				this.cmLoad.pending = true;
				return pms.then(res => {
					this.cmLoad.show = true;
					this.cmLoad.pending = false;
					if (res.statusCode === 200) {
						const list = res.data && Array.isArray(res.data.records) ? res.data.records : [];
						const allLoaded = list.length < pageSize;
						let dividerText = '';
						const commentList = [];
						list.forEach((item, i) => {
							const {children, userAvatarUrl, submitName, submitTime, grade, gmName, specName, reviewDesc, filePaths} = item;
							const shopReply = (_ => {
								const cm = children && children[0] || [{}];
								return cm.reviewDesc || '';
							})()
							const shopReplyLength = shopReply.length;
							const num = 46;
							const unfold = shopReplyLength >= num;
							const cmmImgs = filePaths && typeof filePaths === 'string' && filePaths.split(',') || [];
							const cmm = {
								...item,
								headImg: userAvatarUrl,
								userName: submitName || '',
								time: submitTime,
								goodsName: gmName,
								score: grade,
								spec: specName,
								comment: reviewDesc || '',
								cmmImgs,
								shopReply,
								unfold,
								cutShopReply: shopReply.substr(0, 46),
								unfoldStatus: unfold,
							};
							/* #ifdef MP-WEIXIN  */
								cmm.score = grade - 1;
							/* #endif */
							
							commentList.push(cmm);
						});
						this.commentList = this.commentList.concat(commentList)
						dividerText = commentList.length <= 0 ? '暂无评论~' : allLoaded ? '我的底线' : '上拉加载'
						this.cmLoad.text = dividerText;
						this.cmLoad.finish = allLoaded;
					
						this.cmLoad.finishText = allLoaded && this.commentList.length === 0 ? '暂无评论~' : '我的底线';
						if (isReset) this.$refs["cmScroller"].end();
						if (list.length) ++this.cmLoad.current;
					}
				})
			},
			onUp (loadType) {
				const key = loadType === 'comment' ? 'cmLoad' : 'load';
				this.$set(this[key], 'pending', true);
				loadType === 'comment' ? this.getShopCmm() : this.getShopGoods();
			},
			onDown(loadType) {
				const ref = this.$refs[`${loadType === 'comment' ? 'cmScroller': 'waterfall'}`]
				const key = loadType === 'comment' ? 'cmLoad' : 'load';
				this[key].finish = false;
				this[key].current = 1;
				this[key].finish = true;
				ref && ref.refresh && ref.refresh([]);
				
				loadType === 'comment' ? this.getShopCmm({isReset: 1}) : this.getShopGoods({isReset: 1});
			},
			previewImage(url) {
				uni.previewImage({
					urls: [url]
				});
			},
			toGoodDetail(params = {}) {
				uni.navigateTo({
					url: `/pages-mall-a/shopping-info/shopping-info?shopId=${params.gmId}`
				});
			},
			getShopDetail() {
				const params = {
					pathParams: `/${this.shopId}`,
					hideLoading: true
				}
				return this.$mallApi.data.getShopDetail(params).then(res => {
					if (res.statusCode === 200) {
						const {sellerName, logoFile, tradeName, sellerType, telephone, linkMan, address, linkman, businessTime, mainBusiness, couponList} = res.data || {};
						const tag = sellerType === 2 ? '自营' : '加盟'
						const shopInfo = {
							name: sellerName || '',
							tag,
							business: tradeName || '',
							coupon: couponList.slice(0, 2).map(item => ({ ...item, text: item.couponName })),
							poster: logoFile || '',
							tel: telephone || '',
							linkman: linkman || '',
							address: address || '',
							businessHours: businessTime || '',
							mainBusiness: mainBusiness || ''
						}
						Object.assign(this.shopInfo, shopInfo)
					}
				})
			},
			async initData() {
				uni.showLoading({title: '加载中'});
				await this.getShopDetail().catch();
				await this.getShopGoods().catch();
				uni.hideLoading();
			},
			async handleFollowSeller(status){
				const {memberId} = this.$cmMth.getUserStatusInfo() || {};
				const data = {
					favoriteList:[{
						memberId,
						sellerId: this.shopId
					}]
				}

				const res = await this.$mallApi.shop.editorFavorites({data})
				console.log('res: ', res);
				if(res.statusCode == 200){
					switch (status) {
						case 1:
							this.$refs["message"].open({
								type: 'success',
								message: '关注成功！',
								position: 'middle'
							});
							break;
						default:
							this.$refs["message"].open({
								type: 'error',
								message: '取消关注成功！',
								position: 'middle'
							});
							break;
					}
					this.getSellerFavoritesState()
				}
			},
			// 查询关注店铺得状态
			async getSellerFavoritesState(){
				const {memberId} = this.$cmMth.getUserStatusInfo() || {};
				const data = {
					memberId,
					sellerInfoId:this.shopId
				}
				const { data:res } = await this.$mallApi.shop.querySellerFavoritesState({data})
				this.followStatus = res
			},
			// 打开店铺优惠券弹窗
			showCouponModal() {
				this.isShowCoupon = true
			},
			// 搜索
			async refresh() {
				this.load.current = 1
				// this.$refs["waterfall"].append([]);
				this.isSearch = true
				this.$refs["waterfall"]?.refresh([])
				const res = await this.getShopGoods()
				console.log('res======',res)

			}
		}
	}
</script>

<style scoped lang="scss">
page{
	height: 100%;
}
.shop-detail{
	height: 100%;
	background-color: $uni-bg-color-grey;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	.top-block{
		$bh: 70rpx;
		position: relative;
		width: 100%;
		padding-top: 30rpx;
		background-color: $uni-color-primary;
		overflow: hidden;
		flex-shrink: 0;
		.shop-info{
			@include flx-dsp($jsc: space-between, $ali: flex-start);
			position: relative;
			z-index: 2;
			border-radius: 20rpx;
			background-color: #fff;
			padding: 46rpx 30rpx 30rpx 30rpx;
			box-sizing: border-box;
			.text-info{
				flex: 1;
				.shop-title{
					width: 100%;
					@include flx-dsp($jsc: flex-start, $ali: center);
					.s-n{
						font-size: 36rpx;
						max-width: 80%;
					}
					.tag{
						width: 20%;
						margin-left: 6rpx;
						position: relative;
						top: -4rpx;
						text{
							background-color: $uni-color-primary;
							border-radius: 10rpx 0 10rpx 0;
							color: #fff;
							padding: 2rpx 8rpx;
							font-size: 24rpx;
						}
					}

					.unfollow {
						width:120rpx;
						height:40rpx;
						border-radius:22rpx;
						color: #FFFFFF;
						background: #FD8444;
						margin-left: 10rpx;
						margin-top: 10rpx;
						text-align: center;
						font-size: 24rpx;
						line-height: 40rpx;
					}

					.follow {
						width:100rpx;
						height:38rpx;
						line-height: 38rpx;
						border-radius:22rpx;
						margin-left: 10rpx;
						margin-top: 10rpx;
						text-align: center;
						font-size: 24rpx;
						color: #333333;
						border: 1rpx solid #CCCCCC;
					}
				}
				.business{
					display: inline-block;
					margin: 18rpx 0;
					font-size: 24rpx;
					color: #999;
				}
				.coupon-list{
					@include flx-dsp($jsc: flex-start, $ali: flex-start);
					flex-wrap: wrap;
					position: relative;
					box-sizing: content-box;
    			// padding-right: 10px;
					max-height: 140rpx;
					overflow: hidden;	
					.coupon-item{
						$br: 4rpx;
						margin-right: 10rpx;
						margin-bottom: 14rpx;
						border-radius: $br;
						overflow: hidden;
						$t-h: 40rpx;
						text:nth-child(1) {
							display: inline-block;
							border-radius: $br 0 0 $br;
							background-color: $uni-color-primary;
							font-size: 24rpx;
							height: $t-h;
							line-height: $t-h;
							text-align: center;
							color: #fff;
							padding: 0 4rpx;
						}
						text:nth-child(2) {
							border-radius: 0 $br $br 0;
							display: inline-block;
							font-size: 24rpx;
							height: $t-h;
							line-height: $t-h;
							color: $uni-color-primary;
							background-color: rgba(230, 185, 50, 0.3);
							padding: 0 4rpx;
						}
					}
					
				}
				.title-coupon-more {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin: 0;
					padding: 0;
					border: 0;
					border-radius: 0;
					line-height: 1;
					background-color: initial;
					font-size: 20rpx;
					color: #acacac;
					position: absolute;
					right: 0px;
					top: 10rpx;

					&::after {
						border: 0;
					}
				}
			}
			.poster{
				margin-top: 20rpx;
				width: 200rpx;
				height: 138rpx;
				border-radius: 10rpx;
				overflow: hidden;
				margin-left: 30rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.bottom-border-radius{
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 1;
			width: 100%;
			height: $bh;
			background-color: $uni-bg-color-grey;
			border-radius: 30rpx 30rpx 0 0;
		}
	}
	.tab-container{
		padding-top: 29rpx;
		display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	overflow: hidden;
	flex: 1;
		.tab-pane{
			width: 100%;
			background-color: #fff;
			height: 92rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			@include flx-dsp($jsc: space-between, $ali: center);
			border-radius: 20rpx;
			flex-shrink: 0;
			& > view {
				position: relative;
				flex: 1;
				height: 100%;
				@include flx-dsp($jsc: center, $ali: center);
				text{
					font-size: 28rpx;
				}
				text:nth-child(2) {
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					display: block;
					width: 50rpx;
					height: 8rpx;
					background-color: #ffff;
				}
				text.active{
					background-color: $uni-color-primary;
				}
			}
			
		}
		.goods-info-tab{
			padding-top: 32rpx;
			box-sizing: border-box;
			width: 100%;
			flex: 1;
			overflow: hidden;
			.fall-item{
				$h: 330rpx;
				width: $h;
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
						max-height: $h;
					}
					.goods-info{
						padding: $pd;
						margin: 20rpx 0;
						flex-wrap: wrap;
						@include flx-dsp($jsc: flex-start, $ali: flex-start);
						font-size: $uni-font-size-base;
						@include ellipsis($line: 2);
					}
					.goods-tag{
						background-color: $uni-color-primary;
						border-radius: 10rpx 0 10rpx 0;
						color: #fff;
						padding: 2rpx 8rpx;
						font-size: 24rpx;
						margin-right: 10rpx;
					}
					.goods-btm{
						@include flx-dsp($jsc: flex-start, $ali: center);
						padding: 0 20rpx;
						box-sizing: border-box;
						::v-deep .cl-text{
							color: $uni-color-primary !important;
						}
						.sales-volume{
							margin: 10rpx 0 0 10rpx;
							font-size: 20rpx;
							color: #999;
						}
					}
				}
				
			}
		}
		.user-cm-tab{
			width: 100%;
			flex: 1;
			overflow: hidden;
			margin-top: 32rpx;
			border-radius: 20rpx;
			overflow: hidden;
			$c-gray: #bbb;
			.comment-item{
				margin-top: 20rpx;
				width: 100%;
				padding: 30rpx 25rpx 0 32rpx;
				background-color: #fff;
				padding-bottom: 28rpx;
				border-radius: 20rpx;
				border-bottom: 1rpx solid #f7f7f7;
				box-sizing: border-box;
				&:last-child{
					border-bottom: none;
				}
				.user-time{
					@include flx-dsp($jsc: space-between, $ali: center);
					.user-info{
						@include flx-dsp($jsc: flex-start, $ali: center);
						image{
							width: 88rpx;
							height: 88rpx;
							margin-right: 23rpx;
							border-radius: 50%;
						}
						text{
							font-weight: bold;
							font-size: 28rpx;
						}
					}
					& > text{
						font-size: $uni-font-size-sm;
						color: $c-gray;
					}
				}
				.goods-name{
					margin: 20rpx 0;
					font-size: 24rpx;
					color: #999;
					@include ellipsis($line: 1);
				}
				.evaluate-spec{
					@include flx-dsp($jsc: flex-start, $ali: center);
					.star-item{
						margin-right: 12rpx;
						@include flx-dsp($jsc: center, $ali: center);
						.star-active{
							width: 36rpx;
							height: 37rpx;
						}
						.star-unactive{
							width: 39rpx;
							height: 39rpx;
						}
					}
					.vertical-line{
						margin: 0 20rpx 0 10rpx;
						display: inline-block;
						width: 1rpx;
						height: 28rpx;
						background-color: $c-gray;
					}
					.g-spec{
						font-size: 24rpx;
						color: $c-gray;
					}
				}
				.user-cmm{
					display: inline-block;
					margin: 20rpx 0 20rpx 0;
					font-size: 28rpx;
				}
				.cmm-imgs{
					width: 100%;
					overflow-x: auto;
					border-radius: 8rpx;
					margin-bottom: 40rpx;
					&::-webkit-scrollbar {
						display:none
					}
					image{
						display: inline-block;
						width: 160rpx;
						height: 160rpx;
						border-radius: 8rpx;
						margin-right: 20rpx;
						&:last-child{
							margin-right: 0;
						}
					}
				}
				.shop-reply{
					@include flx-dsp($jsc: flex-start, $ali: flex-start, $drt: column);
					width: 100%;
					padding: 20rpx;
					box-sizing: border-box;
					
					border-radius: 8rpx;
					position: relative;
					background-color: #f7f7f7;
					.triangle{
						position: absolute;
						left: 20rpx;
						top: -9rpx;
						width: 26rpx;
						height: 26rpx;
						background-color: #f7f7f7;
						transform: rotate(45deg);
					}
					.shop-flag{
						display: inline-block;
						font-size: 24rpx;
						color: #999;
						font-weight: bold;
						margin-bottom: 10rpx;
					}
					.omit{
						font-size: 24rpx;
						color: #666;
						
						&.omit-hor {
							display: flex;
							justify-content: space-between;
							width: 100%;
							border-top: 2rpx solid #e1e1e1;
							padding-top: 10rpx;
						}
					}
					.omit-box{
						width: 100%;
						display: flex;
						justify-content: space-between;
						.omit-txt{
							width: 60%;
							line-height: 1.5;
						}
					}
					.unfold{
						display: inline-block;
						padding-left: 10rpx;
						color: $uni-color-primary;
						font-size: 24rpx;
					}
				}
			}
		}
		.shop-info-tab{
			padding-top: 32rpx;
			width: 100%;
			width: 100%;
			flex: 1;
			overflow: hidden;
			.info-card{
				width: 100%;
				border-radius: 20rpx;
				background-color: #fff;
				padding:10rpx 30rpx;
				box-sizing: border-box;
				&:last-child{
					margin-top: 20rpx;
				}
				.bdl{
					border-bottom: 1rpx solid #f7f7f7;
				}
				.card-control{
					@include flx-dsp($jsc: flex-start, $ali: center);
					&-label{
						@include flx-dsp($jsc: flex-start, $ali: center);
						margin-bottom: 20rpx;
						margin-top: 20rpx;
						margin-right: 16rpx;
						text{
							font-size: 26rpx;
							font-weight: bold;
						}
						.img-wr{
							@include flx-dsp($jsc: center, $ali: center);
							width: 30rpx;
							margin-right: 6rpx;
						}
						.tel-icon{
							width: 29rpx;
							height: 29rpx;
						}
						.addr-icon{
							width: 23rpx;
							height: 33rpx;
						}
						.clock-icon{
							width: 27rpx;
							height: 27rpx;
						}
						.star-icon{
							width: 24rpx;
							height: 30rpx;
						}
					}
					&-value{
						@include flx-dsp($jsc: flex-start, $ali: center);
						flex: 1;
						flex-wrap: wrap;
						text{
							font-size: 26rpx;
						}
						.tel-text{
							display: inline-block;
							margin-right: 10rpx;
						}
					}
				}
				
			}
		}
		.no-comment{
			padding-top: 60rpx;
			@include flx-dsp($jsc: center, $ali: center, $drt: column);
			image{
				width: 320rpx;
				height: 228rpx;
			}
			text{
				font-size: 26rpx;
				color: #888;
			}
		}
	}
	::v-deep .cl-divider__line{
		background: #e6e6e6 !important;
	}
}
.pdtop20{
	padding-top: 20rpx;
}
.header {
  width: 100%;
  box-sizing: border-box;
  @include flx-dsp(flex-start, center);
  padding: 0rpx 20rpx 40rpx;
  /* position: fixed;
  left: 0;
  z-index: 1;
  background-color: #fff;
  top: 0; */
	/* background-color: #fff; */
  .list-icon {
    width: 44rpx;
    height: 36rpx;
    @include flx-size('keep');
    padding-left: 8rpx;
    padding-right: 26rpx;
  }
  ::v-deep .cl-input {
    @include flx-size('stretch');
		background-color: #fff;
  }
  shop-input-search {
    @include flx-size('stretch');
  }
}
</style>

