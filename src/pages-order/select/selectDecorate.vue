<style lang="scss" scoped>
	.select-type {
		width: 100%;
		height: 100%;
		overflow: hidden;
		@include flx-dsp($jsc: center, $ali: center, $drt: column);

		.content-wrap {
			flex: 1;
			width: 100%;
			overflow: auto;
			background-color: #efefef;
		}

		.item-wrap {
			padding: 30rpx;
			font-size: 30rpx;
			color: #333333;
			border-bottom: 1px solid #eaeaea;
			@include flx-dsp($jsc: center, $ali: center);

			.item-name {
				flex: 1;
			}
		}

		.active {
			color: var(--app-primary-color) !important;
			background: #ffffff !important;
		}

		.bottom-wrap {
			font-size: 30rpx;
			color: #999999;
			text-align: center;
			padding: 30rpx;
		}

		.e-empty {
			width: 100%;
			height: 100%;
			@include flx-dsp($jsc: center, $ali: center, $drt: column);

			.img-wrap {
				width: 65%;
			}

			.text-wrap {
				font-size: 30rpx;
				color: #999999;
			}
		}
	}
</style>

<template>
	<view class="select-type" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
		<view class="content-wrap">
			<u-list @scrolltolower="scrolltolower" v-if="decorateList.length" height="100%">
				<view v-for="(item,index) in decorateList" :key="index">
					<view class="list-item" @click="selectDecorate(item)">
						<view class="order-header">
							<view class="order-title">{{ item.decorationCode }}</view>
							<view class="order-type"
								:style="{ color:item.examineState==0||item.decorationState==0?'#999':item.decorationState==1||item.decorationState==3||item.decorationState==4||item.decorationState==5?'#57a2fe':item.decorationState==2?'#fba908':item.examineState==2?'#fc4e50':'' }">
								{{item.examineState==0?'待审核':item.decorationState==0?'未开始':item.decorationState==1?'装修中':item.decorationState==2?'待整改':item.decorationState==3?'已初验':item.decorationState==4?'已复验':item.decorationState==6?'待验收':item.examineState==2?'驳回':''}}
							</view>
						</view>
						<view class="order-desc">{{ item.address }}</view>
						<view>
							<view class="order-desc">
								{{ item.ownerName + ' | ' + item.telephone }}
							</view>
							<view class="order-common-text">
								{{ item.decorationDate}}
							</view>
						</view>
					</view>
				</view>
			</u-list>
		</view>
		<view class="e-empty" v-if="!decorateList.length">
			<view class="img-wrap">
				<image style="width: 100%" src="@/static/icon-img/no-data.png" mode="aspectFit"></image>
			</view>
			<view class="text-wrap">暂无数据</view>
		</view>
	</view>
</template>

<script>
	import {
		getDecorationTableList
	} from '@/service/crm6.0.js'

	export default {
		name: '',
		computed: {},
		data() {
			return {
				unionSelect: '',
				query: {
					current: 1,
					size: 50
				},
				totalCount: 0,
				decorateList: [],
				ownerId: ''
			}
		},
		onLoad(query) {
			this.query = {
				...this.query,
			}
			this.getDecorareList()
		},
		onPullDownRefresh() {
			this.query.current = 1
			this.getDecorareList()
		},
		methods: {
			search() {
				this.query.current = 1
				this.getDecorareList()
			},
			getDecorareList() {
				let params = {
					data: {
						...this.query
					}
				}
				uni.showLoading({
					title: '加载中'
				})
				getDecorationTableList(params).then((res) => {
					uni.stopPullDownRefresh()
					uni.hideLoading()
					if ((res.status = 200)) {
						if (this.query.current === 1) {
							this.decorateList = res.data.records || []
						} else {
							this.decorateList = this.decorateList.concat(res.data.records || [])
						}

						this.totalCount = res.data.total;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
				})
			},
			scrolltolower() {
				if (this.decorateList.length < this.totalCount) {
					this.query.current++
					this.getDecorareList()
				}
			},
			selectDecorate(item) {
				let params = {
				  decorationId: item.decorationId,
				  decorationCode: item.decorationCode,
				}

				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('dataEvent', { data: params })
				uni.navigateBack()
			}
		}
	}
</script>
<style lang="scss" scoped>
	.list-item {
		padding: 30rpx;
		background: #ffffff;
		border-radius: 6px;
		margin: 10px;

		.order-header {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			column-gap: 12px;
			padding: 2px 0;

			.order-title {
				flex: 1;
				font-size: 30rpx;
				font-weight: bold;
				color: #333333;
			}

			.order-type {
				font-size: 24rpx;
				color: #ff9900;
			}
		}

		.order-desc {
			padding: 16rpx 0 0;
			font-size: 30rpx;
			color: #333333;
		}

		.order-common-text {
			display: flex;
			font-size: 26rpx;
			padding-top: 8rpx;
			color: #666666;
			border-top: 1px solid #b9b9b9;
			margin-top: 12px;

			&:first-child {
				padding-top: 40rpx;
			}
		}

		.order-state {
			display: inline;
			color: #ff0000;
		}

		.order-btn {
			display: flex;
			justify-content: flex-end;
			margin-top: 12px;

			.c-btn {
				display: inline-block;
				padding: 5px 18px;
				border-radius: 14px;
				font-size: 24rpx;
				text-align: center;
			}

			.btn-1 {
				margin-right: 12px;
				border: 1rpx solid #fe9901;
				color: #fe9901;
			}

			.btn-2 {
				border: 1rpx solid #2761ff;
				color: #2761ff;
			}
		}
	}
</style>
