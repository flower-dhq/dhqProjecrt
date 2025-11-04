<template>
	<view class="decoration-list" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
		<view class="tabs-box">
			<u-tabs :list="tabList" :itemStyle="{width:'150rpx',height:'88rpx',boxSizing:'border-box'}"
			:lineColor="THEME_COLOR" @change="onTabsChange" />
		</view>
		<view class="scrollBox">
			<view class="content" v-for="(item, index) in list" :key="index">
				<view class="roomInfo" @click="goInfo(item)">
					<view class="top">
						<view class="box">
							<view class="box-h2">{{ item.address }}<span class="fkzt">{{ stateText }}</span>
								<view>
									<view style="margin-bottom: 24rpx">
										<view class="hyrq">装修时间： {{ item.decorationDate }}</view>
										<view class="hyrq">装修负责人：{{ item.decorationLeader }}-{{ item.leaderTelephone }}
										</view>
										<view class="hyrq">装修公司：{{ item.decorationCompanyName }}</view>
									</view>
									<!-- <view class="price" style="color:#fbb960">
                 装修押金：￥<span>{{ Number(230).toFixed(2).split(".")[0] }}</span>.{{ Number(230).toFixed(2).split(".")[1] }}
               </view> -->
								</view>
							</view>

							<view class="line"></view>

							<view class="bottom" style="text-align: right">
								<view v-if="state == '4'" @click.stop="cancelRow(item)" class="btnClass">取消</view>
								<view v-if="state == '1' && item.decorationState == '1'" class="btnClass"
									@click.stop="checkRow(item)">申请验收</view>
								<!-- <Button type="primary">去支付</Button> -->
							</view>

						</view>
					</view>
				</view>
			</view>
			<view v-if="!list.length" class="nodata"></view>
		</view>
	</view>
</template>

<script>
	import {
		getDecorateApplyList,
		selectNumber,
		applyAcceptance,
		cancelDecorate
	} from '@/service/decorationManage'
	import Utils from '@/js/utils'
	export default {
		data() {
			const {
				MEMBER_ID,
				PROJECT_ID,
				COMPLANY_ID,
				AREA_ID
			} = this.$constant
			return {
				projectId: Utils.storageAction({
					key: PROJECT_ID,
					action: 'get'
				}),
				areaId: Utils.storageAction({
					key: AREA_ID,
					action: 'get'
				}),
				memberId: Utils.storageAction({
					key: MEMBER_ID,
					action: 'get'
				}),
				tabList: [{
						name: '待确认',
						type: 0,
						id: 1,
						badge: {
							value: 0
						}
					},
					{
						name: '进行中',
						type: 1,
						id: 2,
						badge: {
							value: 0
						}
					},
					{
						name: '已完成',
						type: 2,
						id: 3,
						badge: {
							value: 0
						}
					},
					{
						name: '已取消',
						type: 3,
						id: 4,
						badge: {
							value: 0
						}
					},
					{
						name: '审核中',
						type: 4,
						id: 5,
						badge: {
							value: 0
						}
					}
				],
				numbers: {
					dqr: 0,
					jxz: 0,
					ywc: 0,
					yqx: 0,
					dsh: 0
				},
				nodata: '',
				state: 4,
				stateText: '待确认',
				list: [],
				loading: false,
				finished: false,
				pageNum: 0,
				contactPhone: '',
			}
		},
		onLoad() {
			const {
				O_USER_INFO
			} = this.$constant
			let data = Utils.storageAction({
				key: O_USER_INFO,
				action: 'get'
			})
			this.contactPhone = data.ownerPhone || data.phoneNumber || data.contactPhone || ''
			this.onLoadList()
		},
		onReachBottom() {
			if (!this.finished) this.onLoadList();
		},
		methods: {
			onTabsChange(item) {
				switch (item.type) {
					case 0:
						this.state = 4
						this.stateText = '待确认'
						break
					case 1:
						this.state = 1
						this.stateText = '进行中'
						break
					case 2:
						this.state = 5
						this.stateText = '已完成'
						break
					case 3:
						this.state = 6
						this.stateText = '已取消'
						break
					case 4:
						this.state = 0
						this.stateText = '审核中'
						break
					default:
						this.state = null
				}
				this.pageNum = 0
				this.list = []
				this.finished = false
				this.onLoadList()
			},
			goInfo(item) {
				const {decorationId} = item || {}
				uni.navigateTo({url: `/pages-c/houseCorrelation/decorateInfo?id=${decorationId}`})
			},
			cancelRow(item) {
				let _this = this
				uni.showModal({
					title: '请确认是否取消',
					success: function(res) {
						if (res.confirm) {
							const params = {
								pathParams: `/${item.decorationId}`,
								successfulText: '取消成功'
							}
							cancelDecorate(params).then(res => {
								if (res.status == 200) {
									_this.pageNum = 0
									_this.list = []
									_this.onLoadList()
								}
							})
						} else if (res.cancel) {

						}
					}
				})
			},
			checkRow(item) {
				applyAcceptance(item.decorationId, {}).then(res => {
					if (res.status == 200) {
						uni.showToast({
							title: '申请成功',
							icon: 'none'
						})
						this.pageNum = 0
						this.list = []
						this.onLoadList()
					}
				})
			},
			getNumber() {
				let self = this
				selectNumber({
					data: {
						operatorId: self.memberId,
					 telephone: self.contactPhone,
						areaId: self.areaId,
						projectId: self.projectId,
						abnormal: "",
						current: 1,
						decorationDate: "",
						decorationState: "",
						examineState: "",
						ownerNamePhoto: "",
						size: 10
					}
				}).then(res => {
					const tabList = this.tabList
					res.data.forEach((data) => {
						const { total = 0, examineState } = data
						switch (examineState) {
							case 4:
								tabList[0].badge.value = total
								break;
							case 5:
								tabList[2].badge.value = total
								break;
							case 1:
								tabList[1].badge.value = total
								break;
							case 6:
								tabList[3].badge.value = total
								break;
							case 0:
								tabList[4].badge.value = total
								break;
							default:
								break;
						}
					});
				})
			},
			onLoadList() {
				this.getNumber()
				this.loading = true
				this.filterShow = false
				this.pageNum++
				let pathArr = [10, this.pageNum]
				let postData = {
					data: {
						areaId: this.areaId,
						projectId: this.projectId,
						examineState: this.state
					}
				}
				getDecorateApplyList(pathArr, postData).then(res => {
					if (res.status == 200) {
						if (res.data.records.length != 10) {
							this.finished = true
						}
						for (let i in res.data.records) {
							this.list.push(res.data.records[i])
						}
						this.loading = false
					} else {
						this.loading = false
						this.finished = true
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	$pdt: 100rpx;
	.decoration-list{
		padding-top: $pdt;

		background-color: #eee;
	}
	.tabs-box {
		position: fixed;
		width: 100vw;
		height: 88rpx;
		left: 0;
		top: 0;
		z-index: 999;
		background-color: #fff;
	}

	::v-deep .u-tabs__wrapper__nav__item {
		position: relative;
	}

	::v-deep .u-badge {
		position: absolute;
		right: 0;
		top: 12rpx;
	}

	::v-deep .cell-text-label text {
		font-size: 28rpx !important;
	}

	::v-deep .cell-text-content {
		font-size: 28rpx !important;
	}

	::v-deep .u-button .u-button__text {
		font-size: 28rpx !important;
	}

	.content {
		width: 100%;
		padding: 30rpx 15rpx 15rpx 15rpx;
		background: #fffeff;
		margin-bottom: 20rpx;
		box-sizing: border-box;
	}

	.roomInfo {
		.line {
			width: 100%;
			border-top: 1px solid #f5f5f5;
			margin: 20rpx 0;
		}

		.top {
			overflow: hidden;
			margin-bottom: 16rpx;
			position: relative;

			.price {
				text-align: right;

				span {
					font-size: 50rpx;
				}
			}

			.box {
				.box-h2 {
					font-size: 30rpx;
					margin-bottom: 20rpx;

					.fkzt {
						float: right;
						color: #f5c883;
					}
				}

				.hyrq {
					color: #888689;
					line-height: 46rpx;
					font-size: 26rpx
				}

				.fwlb {
					color: #bab8bb;
					font-size: 24rpx
				}

				.info {
					color: #828083;
					margin-bottom: 20rpx;
				}
			}
		}
	}

	.nodataBox {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #fff;

		image {
			width: 60%;
		}
	}

	.btnClass {
		display: inline-block;
		background: #e7b834;
		color: #fff;
		padding: 10rpx 40rpx;
		border-radius: 50rpx;
    font-size: 12px;
	}

	.nodata {
		height: calc(100vh - #{$pdt});
		background: url("@/static/theme-default/multiplexing/tips.png");
		background-position: center;
		background-repeat: no-repeat;
		background-size: 175px;
		position: relative;
		background-position: center 25%;
		background-color: #ffffff;
	}

	.nodata::after {
		content: "暂无数据~";
		color: #999;
		font-size: 14px;
		text-align: center;
		margin-top: 10px;
		margin-bottom: 50px;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
