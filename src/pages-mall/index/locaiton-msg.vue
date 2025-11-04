<style scoped lang="scss">
.location-msg{
	width: $comm-width;
	height: 46rpx;
	padding: 20rpx 0 14rpx;
	@include flx-dsp($jsc: flex-start, $ali: center);
	.get-location{
		max-width: 280rpx;
		@include flx-dsp($jsc: flex-start, $ali: center);
		text{
			margin: 0 4rpx;
			display: inline-block;
			max-width: 360rpx;
			color: #fff;
			font-size: 28rpx;
			@include ellipsis($line: 1);
		}
		.arc{
			position: relative;
			top: 2rpx;
			/*  #ifdef  MP-WEIXIN  */
			top: -2rpx;
			/*  #endif  */
		}
	}

	.icon-group{
		@include flx-dsp($jsc: center, $ali: center);
		// height: 100%;

		image {
			width: 40rpx;
			height: 40rpx;
			margin: auto;
			margin-right: 20rpx;
		}
		
		.msg-bagde{
			position: relative;
			width: 41rpx;
			height: 40rpx;
			image{
				width: 100%;
				height: 100%;
			}
			text{
				position: absolute;
				top: -20rpx;
				right: -4rpx;
				z-index: 2;
				@include flx-dsp($jsc: center, $ali: center);
				width: 32rpx;
				height: 32rpx;
				background-color: #ff2300;
				color: #fff;
				font-size: 24rpx;
				border-radius: 50%;
			}
			::v-deep .cl-badge{
				position: absolute;
				top: -12rpx;
				right: -4rpx;
				display: block !important;
				.cl-badge__content{
					border-color: transparent;
				}
			}
		}
	}
	
}
.search-input-box {
	flex: 1;
	min-width: 120rpx;
	margin: 0 20rpx;
}
.search-input {
	height: 60rpx;
	border-width: 0;
	font-size: 20rpx;
	line-height: 20rpx;
	padding: 0 16rpx;

	::v-deep .cl-input__wrap {
		padding-left: 34rpx;
	}
	::v-deep .cl-input__icon {
		font-size: 28rpx;
	}
	::v-deep  .cl-input{
  	height: 60rpx;
	}
}
::v-deep cl-noticebar .cl-noticebar{
	padding:0 !important;
}
::v-deep .cl-noticebar__scroller {
	height: 46rpx;
	line-height: 40rpx;
}
.location-text {
	font-size: 28rpx;
}
</style>

<template>
	<view class="location-msg common-width">
		<view class="get-location" @tap="nav(1)">
			<cl-icon  name="cl-icon-map" color="#fff" :size="42"></cl-icon>
			<text v-if="!isTextOver">{{address}}</text>
			<cl-noticebar v-else :text="address" scrollable background-color="initial" color="#fff" style=" width:206rpx;padding:0"></cl-noticebar>
			<cl-icon class="arc" name="cl-icon-arrow-right" color="#fff" :size="26"></cl-icon>
		</view>
		<!-- 关键字搜索 -->
		<view class="search-input-box" @click="pageClick">
			<cl-input
				prefix-icon="cl-icon-search" class="search-input" placeholder="搜索" disabled
				placeholder-style="color: #adadad;" round
			/>
		</view>
		<view class="icon-group">
			<!-- 分享 -->
			<image  src="/pages-mall/static/share_icon.png" @tap="toSharePoster"></image>
			
			<view class="msg-bagde" @tap="nav(2)">
				<image src="/pages-mall/static/msg_icon.png" mode=""></image>
				<!-- <text v-if="msgBagde">{{msgBagde}}</text> -->
				<cl-badge v-if="msgBagde" :value="msgBagde"></cl-badge>
			</view>
		</view>
		
		<!-- 隐藏的文本，用来计算文本长度 -->
		<text style="position: absolute; top: -999px; opacity: 0;" class="location-text">{{address}}</text>
	</view>
</template>

<script>
	import { mapMutations} from 'vuex'
	export default {
		data() {
			return {
				address: '请选择',
				msgBagde: 0,
				isChangeProject: false,
				lastProjectId: null,
				isTextOver: false, // 地址文本是否超出宽度
			}
		},
		options:{ styleIsolation: 'shared' },
		methods: {
			...mapMutations({
				updateHomeJumpOtherPage: 'mall/updateHomeJumpOtherPage'		
			}),
			async getLocationMsg() {
				// 角色无房产时，商城配置 》 社区url带过来的
				// 角色有房产时，用户设置 》 社区url带过的 》商城配置
				const {PROJECT_INFO, PROJECT_INFO_FROM_URL} = this.$constant;
				const {memberId} = this.$cmMth.getUserStatusInfo();
				let shopConfig = await this.$cmMth.setDefaultProject2local() // 全局APP.vue onLaunch 没有设置/响应完，再次请求下
				const data = this.$cmMth.storageAction({key: PROJECT_INFO, action: 'get'});
				const params = this.$cmMth.storageAction({key: PROJECT_INFO_FROM_URL, action: 'get'});
				let proInfo = {}
				if(params.isHouseProperty==0){
					proInfo.projectName = data.projectName || shopConfig.configName || params.projectName
					proInfo.projectId = data.projectId || shopConfig.configDesc || params.projectId
				}else{
					proInfo.projectName = data.projectName || params.projectName || shopConfig.configName
					proInfo.projectId = data.projectId || params.projectId || shopConfig.configDesc
				}
				if (JSON.stringify(proInfo)!='{}') {
					const {projectName, projectId} = proInfo;
					this.address = projectName;
					this.isChangeProject = this.lastProjectId !== projectId;
					this.lastProjectId = projectId;

					// 计算 .location-text 是否超出宽度，超出则滚动文字
					this.$nextTick(() => {
						uni.createSelectorQuery().in(this).select('.location-text').boundingClientRect(node => {
							const MAX_WIDTH = 180
							if (node) {
								this.isTextOver = node.width >= MAX_WIDTH
							}
						}).exec()
					})
				}
				if(!memberId) return;
				this.$mallApi.data.getUnreadMsgNum({hideLoading: true}).then(res => {
					if (res.statusCode === 200) {
						this.msgBagde = res.data || 0;
					}
				})
			},
			nav(index) {
				const {memberId} = this.$cmMth.getUserStatusInfo();
				const url = index === 1 ? '/pages-mall-a/address-mng/get-location' : '/pages-mall-a/message-center/system-message';
				if (!memberId) {
					this.$cmMth.checkAuth();
				}
				else if (url) {
					this.updateHomeJumpOtherPage(index !== 1);
					uni.navigateTo({url});
				} else {
					const prms = {
					    title: '暂未开放此功能，请敬请期待!',
					    duration: 2000,
						icon: 'none'
					}
					uni.showToast(prms);
				}
			},
			// 跳转至分享海报页面
			toSharePoster(){
				uni.navigateTo({
					url: "/pages-mall-b/share-poster/share-poster?source=0"
				});
			},
			pageClick() {
				uni.navigateTo({ url: '/pages-mall-b/search/history-search' })
			}
		},
		onLoad() {
			this.getLocationMsg();
		}
	}
</script>


