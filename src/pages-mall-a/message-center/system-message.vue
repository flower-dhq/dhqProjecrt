
<style scoped lang="scss">
	.system-message{
		width: 100%;
		height: 100%;
		background-color: $uni-bg-color-grey;
		.message-wr:first-child{
			.msg-cont{
				border-top: none !important;
			}
		}
		.message-item{
			@include flx-dsp($jsc: flex-start, $ali: center);
			width: 100%;
			padding: 0 20rpx;
			box-sizing: border-box;
			.msg-img{
				background-color: #eee;
				border-radius: 50%;
				width: 90rpx;
				height: 90rpx;
				margin-right: 20rpx;
				image{
					width: 100%;
					height: 100%;
				}
				.shop-image{
					border-radius: 50%;
				}
			}
			.msg-cont{
				width: calc(100% - 110rpx);
				@include flx-dsp($jsc: flex-start, $ali: flex-start, $drt: column);
				border-top: 1rpx solid #eee;
				padding: 30rpx 0rpx;
				&-up{
					width: 100%;
					@include flx-dsp($jsc: space-between, $ali: center);
					text:nth-child(1){
						font-size: $uni-font-size-lg;
						width: 48%;
						@include ellipsis($line: 1);
					}
					text:nth-child(2){
						font-size: 24rpx;
						color: #999;
					}
				}
				&-down{
					margin-top: 10rpx;
					width: 100%;
					min-height: 30rpx;
					@include flx-dsp($jsc: space-between, $ali: center);
					& > text:nth-child(1){
						font-size: $uni-font-size-base;
						width: 80%;
						@include ellipsis($line: 1);
						color: #666;
					}
					.unread{
						@include flx-dsp($jsc: center, $ali: center);
						// background-color: $uni-color-primary;
						// border-radius: 50%;
						// padding: 4rpx 12rpx;
						// text{
						// 	color: #fff;
						// 	font-size: 24rpx;
						// }
						& > view{
							display: block !important;
						}
						::v-deep .cl-badge{
							display: block;
							.cl-badge__content{
								background-color: $uni-color-primary;
							}
						}
					}
				}
			}
		}
		.operate{
			width: 100%;
			height: 100%;
			@include flx-dsp($jsc: flex-start, $ali: center);
			text{
				@include flx-dsp($jsc:center, $ali: center);
				flex: 1;
				height: 100%;
				font-size: $uni-font-size-base;
				color: #fff;
			}
			.stick{
				
				background-color: $uni-color-primary;
			}
			.del{
				background-color: red;
			}
			
		}
		::v-deep .cl-list-item{
			.cl-list-item__container{
				padding: 0;
				.cl-list-item__append{
					width: 100%;
				}
			}
			.cl-list-item__menu-right{
				width: 300rpx;
			}
		}
		::v-deep .cl-divider__line{
			background: #e6e6e6 !important;
		}
	}
</style>

<template>
	<view class="system-message">
		<!-- 系统消息 -->
		<cl-scroller ref="scroller" @up="onUp" @down="onDown">
			<view class="message-wr" v-for="(item, index) in messageList" :key="index">
				<cl-list-item  swipe="right">
					<view slot="append" class="message-item" @tap="toMessageTypeList({data: item})">
						<view class="msg-img">
							<image class="shop-image" v-if="item.msgType === 4" :src="item.shopImage" mode="aspectFill"></image>
							<image v-else-if="item.msgType === 2" src="/pages-mall-a/static/green_car.png" mode=""></image>
							<image v-else src="/pages-mall-a/static/blue_bell.png" mode=""></image>
						</view>
						<view class="msg-cont">
							<view class="msg-cont-up">
								<text v-if="item.msgType === 4">{{item.shopName}}</text>
								<text v-else>{{item.msgTypeName}}</text>
								<text>{{item.time}}</text>
							</view>
							<view class="msg-cont-down">
								<text>{{item.newestMsg}}</text>
								<view class="unread"  v-if="item.unread">
									<!-- <text>{{item.unread}}</text> -->
									<cl-badge :value="item.unread"></cl-badge>
								</view>
							</view>
						</view>	
						
					</view>
					<view class="operate"slot="menu">
						<text class="stick" @tap="operateClick({clickType: '2top', index, data: item})">{{item.sessionClientState === 3 ? '取消置顶' : '置顶'}}</text>
						<text class="del" @tap="operateClick({clickType: 'del', index})">删除</text>
					</view>
				</cl-list-item>
			</view>
			<cl-loadmore v-show="inited && load.show" :text="load.text" :finish="load.finish" :finish-text="load.finishText" :loading="load.pending"></cl-loadmore>
		</cl-scroller>
		<!-- 确认弹框 -->
		<cl-confirm ref="confirm"></cl-confirm>
	</view>
</template>

<script>
	import socketConfig from'@/socket/config';
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
					pageSize: 100,
				},
				inited: false,
				messageList: [],
				msgListLoading: false
			}
		},
		methods: {
			getMessageList(params = {}) {
				const {isReset, hideLoading} = params;
				const {current, pageSize} = this.load;
				const testPms = new Promise((resolve) => {
				  setTimeout(() => {
						  const list = [];
						  const curNum = (current - 1) * pageSize;
						  const mockTotal = 38;
						  const leng = (mockTotal - curNum) / pageSize > 1 ? pageSize : mockTotal - curNum;
						  for (let i = 0; i < leng; i++) {
							  const r = Math.random();
							  const mode = r > .2 ? 1  : r > .4 ? 2 : r > .6 ? 3 : 4;
							  list.push({
								msgType: mode, // 1.服务通知,2.物流服务，3.优惠券服务，4.商家会话
								msgTypeName: mode === 1 ? '服务通知' : mode === 2 ? '物流服务' : mode === 3 ? '优惠券服务' : '商家会话',
								newestMsg: `${curNum + i}三只松鼠年货坚果大礼包 7袋装 每日坚果 节日`,
								time: '2021-06-30',
								unread: parseInt(Math.random() * 10)
							  });
						  }
						  resolve({statusCode: 200, data: {records: list}})
					  }, 200);
				});
				const args = {
					data:{
						toSeller:0
					},
					pathParams: `/${pageSize}/${current}`,
				}
				if (isReset && hideLoading) args.hideLoading = true;
				const prodPms = this.$mallApi.data.getSystemMsgList(args)
				const pms = prodPms;
				if (isReset) {
					this.messageList = [];
					this.load.show = false;
				} else {
					this.load.show = true;
					this.load.text = '加载中';
				}
				this.msgListLoading = true;
				return pms.then(res => {
					this.msgListLoading = false;
					this.load.show = true;
					if (!this.inited) this.inited = true;
					if (res.statusCode === 200) {
						const list = res.data && Array.isArray(res.data.records) && res.data.records || [];
						const allLoaded = list.length < pageSize;
						const precision = this.$cmMth.precision;
						const messageList = [];
						let dividerText = '';
						list.forEach((item, i) => {
							const {sessionType, lastMessageList, unread, sessionServiceUserName, sessionServiceUserHeadImg} = item;
							const mode = Number(sessionType);
							const lastMessage = Array.isArray(lastMessageList) && lastMessageList[0] || {};
							const contentHtml = lastMessage && lastMessage.sendContent && typeof lastMessage.sendContent === 'string' && lastMessage.sendContent || '';
							const pureText = contentHtml.replace(/<\/?.+?\/?>/g,'')
							const msg = {
								...item,
								msgType: mode, // 1.服务通知,2.物流服务，3.优惠券服务，4.商家会话
								msgTypeName: mode === 1 ? '服务通知' : mode === 2 ? '物流服务' : mode === 3 ? '优惠券服务' : mode === 4 ? '商家会话' : '未知',
								newestMsg: pureText,
								time: lastMessage && lastMessage.sendDate || '',
								unread
							};
							if (mode === 4) {
								msg.shopName = sessionServiceUserName;
								msg.shopImage = sessionServiceUserHeadImg;
							}
							messageList.push(msg);
						});
						
						dividerText = messageList.length <= 0 ? '暂无消息~' : allLoaded ? '我的底线' : '上拉加载'
						this.load.text = dividerText;
						this.load.finish = allLoaded;
						this.messageList = this.messageList.concat(messageList);
						this.load.finishText = allLoaded && this.messageList.length === 0 ? '暂无消息~' : '我的底线'
						if (isReset) this.$refs["scroller"].end();
						if (list.length) ++this.load.current;
					}
				}).catch(_ => {
					this.msgListLoading = false;
				})
			},
			onUp () {
				this.load.pending = true;
				this.getMessageList();
			},
			onDown(hideLoading = 1) {
				this.load.finish = false;
				this.load.current = 1;
				this.load.finish = true;
				this.getMessageList({isReset: 1, hideLoading});
			},
			operateClick(params) {
				const {clickType, index, data} = params || {};
				const {sessionClientState} = data || {};
				const msgText = clickType === '2top' ? `您确定${sessionClientState === 3 ? '取消置顶' : '置顶'}此消息吗？` : clickType === 'del' ? "您确定要删除此消息吗？"  : '';
				this.$refs["confirm"].open({
					title: "提示",
					message: msgText,
					callback: ({ action }) => {
						if (action === 'confirm'){
							if (clickType === '2top') {
								this.local2Top(index);
							} else if (clickType === 'del') {
								this.local2del(index);
								this.updateListNode();	
							}
						}
					}
				});
				
			},
			local2Top(index) {
				const {sessionId} = this.messageList[index] || {};
				const args = {
					pathParams: `/${sessionId}`
				}
				this.$mallApi.data.systemMsg2top(args).then(res => {
					if (res.statusCode === 200) {
						// const topItem = this.messageList.splice(index, 1)[0];
						// if (topItem) this.messageList.unshift(topItem);
						// this.updateListNode();
						this.onDown();
					}
				})
				
			},
			local2del(index) {
				const {sessionId} = this.messageList[index] || {};
				const args = {
					pathParams: `/${sessionId}`
				}
				this.$mallApi.data.delSystemMsg(args).then(res => {
					if (res.statusCode === 200) {
						// this.messageList.splice(index, 1)
						this.onDown();
					}
				})
			},
			updateListNode() {
				const tempList = this.messageList;
				this.messageList = [];
				this.$nextTick(_ => {
					this.messageList = tempList;
				})
			},
			toMessageTypeList(params) {
				const {data} = params || {};
				const {msgTypeName, sessionId, msgType, sessionType, shopName} = data || {};
				const typeMsgUrl = `/pages-mall-a/message-center/type-message?title=${msgTypeName}&sessionId=${sessionId}&msgType=${msgType}`;
				const sessionMsgUrl = `/pages-mall-b/chatroom/chatroom?sessionId=${sessionId}&shopName=${shopName}`
				uni.navigateTo({
					url: sessionType === 4 ? sessionMsgUrl : typeMsgUrl
				})
			},
			runSocket() {
                const {baseUrl, im} = socketConfig;
                const {memberId} = this.$cmMth.getUserStatusInfo();
                const url = `${baseUrl}${im}/${memberId}/0/0`;
                this.socket = this.$cmMth.initSocket({url, socketId: 'system-message'});
                this.socket && this.socket.obj.on({
                    eventName: 'onMessage',
                    callback: (msg) => {
                        const {data} = msg || {};
                        const {sessionId, sendContent} = data || {};
						const idx = this.messageList.findIndex(item => sessionId === item.sessionId);
						if (idx !== -1) this.messageList.splice(idx, 1);
						try {
							const item = JSON.parse(sendContent)
							const {sessionType, lastMessageList, unread, sessionServiceUserName} = item;
							const mode = Number(sessionType);
							const lastMessage = Array.isArray(lastMessageList) && lastMessageList[0] || {};
							const contentHtml = lastMessage && lastMessage.sendContent && typeof lastMessage.sendContent === 'string' && lastMessage.sendContent || '';
							const pureText = contentHtml.replace(/<\/?.+?\/?>/g,'')
							const msg = {
								...item,
								msgType: mode, // 1.服务通知,2.物流服务，3.优惠券服务，4.商家会话
								msgTypeName: 4,
								newestMsg: pureText,
								time: lastMessage && lastMessage.sendDate || '',
								unread,
								shopName: sessionServiceUserName,
								shopImage: lastMessage.sessionClientHeadImg
							};
							this.messageList.unshift(msg);
						} catch (error) {
							console.log(error, 'error')
						}                       
                    }
                })
            },
		},
		onPullDownRefresh() {
			
		},
		onReachBottom() {
			
		},
		onLoad() {
			this.getMessageList();
			this.runSocket();
		},
		onShow() {
			const msgListLoading = this.msgListLoading;
			if (!msgListLoading) this.onDown(0);
		}
	}
</script>

