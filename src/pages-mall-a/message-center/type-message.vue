<style  scoped lang="scss">
	.type-message{
		width: 100%;
		height: 100%;
		background-color: $uni-bg-color-grey;
		padding: 20rpx;
		box-sizing: border-box;
		.message-item{
			width: 100%;
			background-color: #fff;
			margin-bottom: 20rpx;
			padding: 26rpx;
			box-sizing: border-box;
			&:last-child{
				margin-bottom: 0;
			}
			border-radius: 20rpx;
			.shop-info{
				$mg: 16rpx;
				padding-bottom: $mg;
				margin-bottom: $mg;
				border-bottom: 1rpx solid #eee;
				@include flx-dsp($jsc: space-between, $ali: center);
				.shop-img {
					@include flx-dsp($jsc: center, $ali: center);
					&> view{
						border-radius: 50%;
						width: 48rpx;
						height: 48rpx;
						background-color: #eee;
						margin-right: 6rpx;
						background-size: cover;
						background-position: center;
						background-repeat: no-repeat;
						margin-right: 12rpx;
					}
					text{
						@include ellipsis($line: 1);
						font-size: 28rpx;
					}
				}
			}
			&-head{
				@include flx-dsp($jsc: space-between, $ali: center);
				& > view{
					font-size: 34rpx;
					width: 50%;
					@include flx-dsp($jsc: flex-start, $ali: center);
					text:nth-child(1){
						@include ellipsis($line: 1);
					}
				}
				& > text{
					font-size: 26rpx;
					color: #999;
				}
				.unread-red{
					background-color: red;
					width: 10rpx;
					height: 10rpx;
					border-radius: 50%;
					margin-left: 10rpx;
				}
			}
			.msg-cont{
				@include flx-dsp($jsc: flex-start, $ali: flex-start);
				background-color: $uni-bg-color-grey;
				$tfs: 28rpx;
				margin-top: 20rpx;
				.pure-text{
					width: 100%;
					padding: 20rpx;
					box-sizing: border-box;
					font-size: $tfs;
				}
				.image-text{
					@include flx-dsp($jsc: flex-start, $ali: flex-start);
					box-sizing: border-box;
					image{
						width: 140rpx;
						height: 140rpx;
						background-color: #eee;
					}
					& > view {
						flex: 1;
						padding: 10rpx 15rpx;
						box-sizing: border-box;
						font-size: $tfs;
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
	<view class="type-message">
		<cl-scroller ref="scroller" @up="onUp" @down="onDown">
			<view class="message-item" v-for="(item, index) in messageList" :key="index" @tap="detailJump(item)">
				<view class="shop-info" @tap.stop="toShop(item)">
					<view class="shop-img">
						<view :style="{'background-image': `url(${item.images})`}"></view>
						<text>{{item.sellerName}}</text>
					</view>
					<view class="shop-jump">
						<cl-icon name="cl-icon-arrow-right"  :size="30"></cl-icon>
					</view>
				</view>
				<view class="message-item-head">
					<view>
						<text>{{item.title}}</text>
						<text class="unread-red" v-if="item.isRead === 0"></text>
					</view>
					<text>{{item.time}}</text>
				</view>
				<view class="msg-cont">
					<view class="image-text" v-if="item.msgType === 2">
						<image :src="item.poster" mode="aspectFill"></image>
						<view class="" v-html="item.html"></view>
					</view>	
					<view class="pure-text" v-else v-html="item.html"></view>
				</view>
			</view>
			<cl-loadmore v-show="inited && load.show" :text="load.text" :finish="load.finish" :finish-text="load.finishText" :loading="load.pending"></cl-loadmore>
		</cl-scroller>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				load: {
					show: true,
					text: '上拉加载更多',
					finishText: '我是底线',
					finish: false,
					pending: false,
					current: 1,
					pageSize: 10
				},
				messageList: [],
				query: null,
				inited: false
			}
		},
		methods: {
			setTitle(title) {
				if (title) uni.setNavigationBarTitle({title});
			},
			getMessageList(params = {}) {
				const {sessionId, msgType} = this.query || {}; 
				const {isReset} = params;
				const {current, pageSize} = this.load;
				const testPms = new Promise((resolve) => {
				  setTimeout(() => {
						  const list = [];
						  const curNum = (current - 1) * pageSize;
						  const mockTotal = 18;
						  const leng = (mockTotal - curNum) / pageSize > 1 ? pageSize : mockTotal - curNum;
						  for (let i = 0; i < leng; i++) {
							  const r = Math.random();
							  const msgType = r > .5 ? 1 : 2;
							  list.push({
								title: `${curNum + i}三只松鼠年货坚果大礼包 7袋装 每日坚果 节日`,
								msgType,
								time: '2021-06-30',
								poster: 'https://cms.wuyeface.com/filemanager/filedatabase/img/2020/12/8/0c14b77b-3192-4077-8a3d-70df20a7f71e.png',
								html: msgType === 1 ? '今日起有特多精品优惠券，赶紧点击去领取吧>>>' : `您的包裹已发送<br/> 快递单号：SF-055648764464646`,
							  });
						  }
						  resolve({statusCode: 200, data: {records: list}})
					  }, 200);
				});
				const args = {
					data: {},
					hideLoading: this.inited,
					pathParams: `/${pageSize}/${current}/${msgType}`
				}
				const prodPms = this.$mallApi.data.getSessionMsgListByType(args)
				const pms = prodPms;
				if (isReset) {
					this.messageList = [];
					this.load.show = false;
				} else {
					this.load.show = true;
					this.load.text = '加载中';
				}
				return pms.then(res => {
					this.load.pending = false;
					if (!this.inited) this.inited = true;
					if (res.statusCode === 200) {
						const list = res.data && Array.isArray(res.data.records) && res.data.records || [];
						const allLoaded = list.length < pageSize;
						const precision = this.$cmMth.precision;
						const messageList = [];
						let dividerText = '';
						list.forEach((item, i) => {
							const {title, sendContent, sendDate, imageUrl, messageType} = item;
							const msg = {
								...item,
								title,
								msgType: messageType,
								time: sendDate  || '',
								poster: imageUrl,
								html: sendContent
							};
							messageList.push(msg);
						});
						
						dividerText = messageList.length <= 0 ? '暂无消息~' : allLoaded ? '我的底线' : '上拉加载'
						console.log('dividerText', dividerText)
						this.load.text = dividerText;
						this.load.finish = allLoaded;
						this.messageList = this.messageList.concat(messageList);
						this.load.finishText = allLoaded && this.messageList.length === 0 ? '暂无消息~' : '我的底线'
						if (isReset) this.$refs["scroller"].end();
						if (list.length) ++this.load.current;
					}
				})
			},
			onUp () {
				this.load.pending = true;
				this.getMessageList();
			},
			onDown() {
				this.load.finish = false;
				this.load.current = 1;
				this.load.finish = true;
				this.getMessageList({isReset: 1});
			},
			detailJump(params) {
				const {sendId, url, messageId} = params || {};
				const {msgType} = this.query || {};
				const orderNum = Number(sendId);
				const startsWithSlash = typeof url === 'string' && url.startsWith('/');
				let pageUrl = '';
				switch(msgType) {
					case '1': // 商品、售后订单
						pageUrl = orderNum === 1 ? `/pages-mall-a/order/order-detail?orderId=${url}` : orderNum === 2 ? `/pages-mall-a/order-after-sale/return-approval-info?afterSaleId=${url}` : ''
						break
					case '2': // 物流
						pageUrl = `/pages-mall-a/order/order-detail?orderId=${url}`
						break
				}
				//if (pageUrl) uni.navigateTo({url: pageUrl})
				if (url) {
					params.isRead = 1
					this.$mallApi.data.readSystemMessage({data: [messageId], responseToast: false, hideLoading: true})
					uni.navigateTo({url: `${startsWithSlash ? '' : '/'}${url}`})
				}
			},
			toShop(params) {
				uni.navigateTo({url: `/pages-mall-a/shop/detail?shopId=${params.sellerId}`})
			}
		},
		onLoad(options) {
			const {title, sessionId} = options;
			this.setTitle(title);
			this.query = options;
			this.getMessageList();
		}
	}
</script>


