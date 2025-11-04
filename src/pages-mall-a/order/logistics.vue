<style scoped lang="scss">
.logistics{
	min-height: 100%;
	background-color: $uni-bg-color-grey;
	padding-top: 20rpx;
	box-sizing: border-box;
	&-no{
		@include flx-dsp($jsc: flex-start, $ali: center);
		border-radius: 8rpx;
		background-color: #fff;
		height: 84rpx;
		padding: 0 36rpx;
		box-sizing: border-box;
		font-size: 32rpx;
		.wl-btn {
			background: #21b1fd;
			color: #fff;
			font-size: 24rpx;
			padding: 8rpx 12rpx;
			border-radius: 8rpx;
			margin-left: 20rpx;
		}
	}
	&-flow{
		margin-top: 20rpx;
		padding: 40rpx 20rpx;
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 8rpx;
		$gray: #e6e6e6;
		.flow-item{
			position: relative;
			.icon-wr{
				height: 100%;
				padding-right: 20rpx;
			}
			.node-info-text{
				flex: 1;
				@include flx-dsp($jsc: space-between, $ali: center);
			}
			.child-node-info-text{
				flex: 1;
				@include flx-dsp($jsc: space-between, $ali: flex-start, $drt: column);
				padding: 20rpx 0;
			}
			.node-text{
				flex: 1;
				font-size: 28rpx;
			}
			.child-node-text{
				flex: 1;
				font-size: 24rpx;
			}
			
			.node-time{
				display: inline-block;
				max-width: 260rpx;
				font-size: 24rpx;
				color: #dcdcdc;
			}
			.node-status{
				width: 100%;
				@include flx-dsp($jsc: flex-start, $ali: center);
				.icon-img{
					width: 56rpx;
					height: 56rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				
				
			}
			.node-child-status-wr{
				width: 100%;
				@include flx-dsp($jsc: flex-start, $ali: flex-start, $drt: column);
			}
			.node-child-status{
				width: 100%;
				height: 100%;
				@include flx-dsp($jsc: flex-start, $ali: center);
				.only-line{
					@include flx-dsp($jsc: center, $ali: center);
					width: 56rpx;
					height: 100%;
					text {
						width: 2rpx;
						height: 100%;
						background-color: $gray;
					}
				}
				.circle-line{
					@include flx-dsp($jsc: center, $ali: center, $drt: column);
					width: 56rpx;
					height: 100%;
					.l{
						width: 2rpx;
						height: calc((100% - 24rpx) / 2);
						background-color: $gray;
					}
					.cl{
						width: 24rpx;
						height: 24rpx;
						border-radius: 50%;
						background-color: $gray;
					}
				}
			}
		}
		.no-logistics{
			display: inline-block;
			width: 100%;
			text-align: center;
			font-size: 28rpx;
		}
	}
	.line-ALL{
		width: 1px;
		position: absolute;
		left: 28rpx;
		top: 0;
		bottom: 0;
		background: #e6e6e6;
	}
}
</style>

<template>
	<view class="logistics">
		<view class="logistics-no common-width" v-if="logisticsFlow.length">
			<text>物流单号：{{logisticsNo}}</text>
			<!--  v-if="logisticsNo&&subscribe==1" -->
			<!-- #ifdef H5 -->
			<text v-if="logisticsNo&&subscribe==1" class="wl-btn h5" @tap="goPage">实时物流</text>
			<!-- #endif -->
			<!-- #ifdef MP -->
			<text v-if="logisticsNo&&subscribe==1" class="wl-btn wx" @tap="goWXPage">实时物流</text>
			<!-- #endif -->
		</view>
		<view class="logistics-flow common-width">
			<template v-if="logisticsFlow.length">
				<view class="flow-item"  v-for="(item, index) in logisticsFlow" :key="index">
					<view class="line-ALL"></view>
					<view class="node-status">
						<view class="icon-wr">
							<view class="icon-img">
								<image v-if="item.iconCode === 4" src="/pages-mall-a/static/sign_icon.png" mode=""></image>
								<image v-if="iconStatus({...item, iconStatusCode: 3, active: 1})" src="/pages-mall-a/static/user_icon.png" mode=""></image>
								<image v-if="iconStatus({...item, iconStatusCode: 3, active: 0})" src="/pages-mall-a/static/user_grey_icon.png" mode=""></image>
								<image v-if="iconStatus({...item, iconStatusCode: 2, active: 1}) || item.iconCode === 0" src="/pages-mall-a/static/cart_icon.png" mode=""></image>
								<image v-if="iconStatus({...item, iconStatusCode: 2, active: 0})" src="/pages-mall-a/static/cart_grey_icon.png" mode=""></image>
								<image v-if="iconStatus({...item, iconStatusCode: 1, active: 1})" src="/pages-mall-a/static/goods_icon.png" mode=""></image>
								<image v-if="iconStatus({...item, iconStatusCode: 1, active: 0})" src="/pages-mall-a/static/goods_grey_icon.png" mode=""></image>
							</view>
						</view>
						<view class="node-info-text ">
							<text class="node-text">{{item.codeText}}</text>
							<text class="node-time" v-if="index>0">{{item.time}}</text>
						</view>
					</view>
					<view class="node-child-status-wr">
						<view class="node-child-status" :style="{minHeight: item.height ? item.height + 'rpx' : 'auto' }" :class="flow.className" v-for="(flow, i) in item.details" :key="i">
							<view class="icon-wr" :style="{opacity: i === 0 && index === logisticsFlow.length - 1 && item.details.length == 1 ? 0 : 1}">
								<view class="only-line" v-if="isLine(index, i)">
									<text></text>
								</view>
								<view class="circle-line" v-else>
									<text class="l"></text>
									<text class="cl"></text>
									<text class="l"></text>
								</view>
							</view>
							<view class="child-node-info-text" >
								<text class="node-time" v-if="flow.time">{{flow.time}}</text>
								<text class="child-node-text">{{flow.text}}</text>
							</view>
						</view>
					</view>
				</view>
			</template>
			<text class="no-logistics" v-else>暂无物流信息~</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logisticsNo: '暂无单号信息',
				subscribe: 0,	//订阅状态  0=未订阅，1=已订阅，-1=订阅失败
				logisticsFlow: [],
				logisticsFlowT: [
					{
						iconCode: 4,
						nodeStatus: 6,
						codeText: '已签收',
						time: '2020-02-12 15:22:23',
						details: [
							{
								text: '广东省广州市天河区天河北路国际科贸大厦890号1502',
								time: '2020-02-12 15:22:23',
							}
						]
					},
					{
						iconCode: 3,
						nodeStatus: 5,
						codeText: '待取件',
						time: '2020-02-12 15:22:23',
						details: [
							{
								text: '您的快件已到达菜鸟驿站',
								time: '2020-02-12 15:22:23',
							}
						]
					},
					{
						iconCode: 3,
						nodeStatus: 4,
						codeText: '派送中',
						time: '2020-02-12 15:22:23',
						details: [
							{
								text: '您的快件正在派送中，请耐心等候',
								time: '2020-02-12 15:22:23',
							}
						]
					},
					{
						iconCode: 2,
						nodeStatus: 3,
						codeText: '运输中',
						time: '2020-02-12 15:22:23',
						details: [
							{
								text: '快件已到天河区',
								time: '2020-02-12 15:22:23',
							},
							{
								text: '快件已到广州中心'
							},
						]
					},
					{
						iconCode: 2,
						nodeStatus: 2,
						codeText: '已揽收',
						time: '2020-02-12 15:22:23',
						details: [
							{
								text: '快件已被物流公司揽件',
								time: '2020-02-12 15:22:23',
							}
						]
					},
					{
						iconCode: 1,
						nodeStatus: 1,
						codeText: '已发货',
						show: 1,
						time: '2020-02-12 15:22:23',
						details: [
							{
								text: '包裹正在等待揽收',
								time: '2020-02-12 15:22:23',
							},
							{
								text: '包裹正在等待揽收包裹正在等待揽收包裹正在等待揽收包裹正在等待揽收',
								time: '2020-02-12 15:22:23',
							}
						]
					},
					{
						iconCode: 1,
						nodeStatus: 0,
						codeText: '已下单',
						time: '2020-02-12 15:22:23',
						show: 1,
						details: [
							{
								text: '用户已下单'
							}
						]
					},
				]
			}
		},
		onLoad(option) {
			this.getLogisticsInfo(option);
		},
		methods: {
			iconStatus(params = {}) {
				const {iconCode, active, iconStatusCode, nodeStatus} = params;
				const currentIndex = this.logisticsFlow.length - 1;
				const currentIcon = iconCode === iconStatusCode;
				return (currentIcon && active && currentIndex === nodeStatus) ||  (currentIcon && !active && currentIndex > nodeStatus);
			},
			generateClass(index, i) {
				return `node-${index}-${i}`;
			},
			setNodeHeight(index, i) {
				const logisticsFlow = this.logisticsFlow;
				logisticsFlow.forEach((item, index) => {
					Array.isArray(item.details) && item.details.forEach((node, i) => {
						const className = `.node-${index}-${i}`;
						const view = uni.createSelectorQuery().in(this).select(className);
						view.fields({
						  size: true,
						  scrollOffset: true
						}, data => {
						  item.height = data.height * 2.3 ;
						  this.$forceUpdate();
						}).exec()
					})
				})
			},
			isLine(index, i){
				return i === 0 || index === this.logisticsFlow.length - 1;
			},
			getLogisticsInfo(option) {
				const {args} = option;
				const {expressNo,subscribe, logistics: list} = JSON.parse(decodeURIComponent(args));
				this.subscribe = subscribe
				const logisticsFlow = [];
				if (expressNo) this.logisticsNo = expressNo;
				list.forEach((item, index) => {
					const {nodeStatus, node, lastUpdateTime, records} = item;
					const iconCode = nodeStatus <= 1 ? 1 : (nodeStatus <= 2 && nodeStatus <= 3) ? 2 : (nodeStatus <= 4 && nodeStatus <= 5) ? 3 : nodeStatus === 6 ? 4 : 0;
					const nodeItem = {
						iconCode,
						nodeStatus,
						codeText: node,
						time: lastUpdateTime,
						details: []
					}
					Array.isArray(records) && records.forEach((child, i) => {
						const {describe, updateTime} = child;
						const childNode = {
							text: describe,
							time: updateTime,
							className: `node-${index}-${i}`
						}
						nodeItem.details.push(childNode);
					});
					logisticsFlow.push(nodeItem);
				});
				this.logisticsFlow = logisticsFlow;
			},
			// h5跳转快递100 h5
			goPage() {
				console.log('location.href====',location.href)
				let url = encodeURIComponent(location.href)
				// let url = encodeURIComponent('http://localhost:8080/xd105nt21/mall/#/pages-mall-a/order/order-detail?orderId=1579410937276928000')
				let href = `https://m.kuaidi100.com/app/query/?coname=yibei&nu=9851232898129&com=&callbackurl=${url}`
				window.open(href, '_blank')
			},
			// 微信跳转快递100 小程序
			goWXPage() {
				uni.navigateTo({
					url: "plugin://kdPlugin/index?num=9851232898129&appName=yibei",
				})
			}
		},
		mounted() {
			this.setNodeHeight();
		}
	}
</script>


