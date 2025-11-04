<style scoped lang="scss">
.get-location{
	width: 100%;
	height: 100%;
	font-size: $uni-font-size-base;
	$cm-h: 70rpx;
	$pd: 40rpx;
	.grey-label{
		background-color: $uni-bg-color-grey;
		display: inline-block;
		@include flx-dsp($jsc: flex-start, $ali: center);
		width: 100%;
		height: $cm-h;
		padding: 0 $pd;
		box-sizing: border-box;
	}
	box-sizing: border-box;
	.pd{
		width: 100%;
		padding: 0 $pd;
		box-sizing: border-box;
	}
	.white-interval{
		display: inline-block;
		height: 40rpx;
	}
	.select-project{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		.sl-city{
			height: $cm-h;
			@include flx-dsp($jsc:  space-between, $ali: center);
			.sl-btn{
				@include flx-dsp($jsc: flex-start, $ali: center);
				& > text {
					margin-right: 10rpx;
				}
			}
			.gl{
				@include flx-dsp($jsc: flex-end, $ali: center);
				& > text {
					margin-left: 10rpx;
				}
			}
		}
		.project-list{
			width: 100%;
			height: calc(100vh - 210rpx - var(--window-top));
			overflow-y: auto;
			.prj-item{
				width: 100%;
				@include flx-dsp($jsc:  center, $ali: center);
				height: $cm-h;
				text{
					@include flx-dsp($jsc:  flex-start, $ali: center);
					width: calc(100% - #{$pd} * 2);
					height: 100%;
					border-bottom: 1rpx solid $uni-bg-color-grey;
				}
			}
		}
	}
	.select-city{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		.current-city{
			@include flx-dsp($jsc: flex-start, $ali: center);
			height: $cm-h;
		}
		.city-list{
			height: calc(100vh - 250rpx - var(--window-top));
			::v-deep .cl-li{
				.cl-li__scroller{
					height: 100% !important;
				}
				.cl-li__header{
					padding: 16rpx $pd;
				}
				.cl-li__container{
					.cl-avatar{
						display: none;
					}
				}
				.cl-li__bar-block.is-active uni-text{
					background-color: $uni-color-primary !important;
				}
				.cl-li__bar-block.is-active text{
					background-color: $uni-color-primary !important;
				}
			}
		}
	}
}
</style>

<template>
	<view class="get-location">
		<view class="select-project" v-if="pageType === 1">
			<text class="grey-label">当前城市</text>
			<view class="sl-city pd">
				<view class="sl-btn" @tap="pageTap({actionType: 'selectCity'})">
					<text>{{currentCity.text}}</text>
					<cl-icon v-if="!locationLoading" name="cl-icon-arrow-bottom" :size="30"></cl-icon>
				</view>
				<view class="gl" @tap="reloadLocation">
					<cl-icon name="cl-icon-map" :size="30"></cl-icon>
					<text>重新定位</text>
				</view>
			</view>
			<text class="grey-label">全部项目</text>
			<view class="project-list">
				<scroll-view scroll-y="true" style="height: 100%;">
					<view class="prj-item" v-for="(item, index) in projectList" :key="index">
						<text @tap="pageTap({actionType: 'selectProject', data: item})">{{item.name}}</text>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="select-city" v-else>
			<text class="grey-label">当前城市</text>
			<text class="current-city pd" @tap="pageTap({actionType: 'loadProject'})">{{currentCity.text}}</text>
			<text class="grey-label">切换城市</text>
			<text class="white-interval pd"></text>
			<view class="city-list">
				<cl-list-index :index="0" :filterable="false" :list="cityList" @select="onSelect"> </cl-list-index>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageType: 1, // 1选择项目 2选择城市
				currentCity: {
					text: '正在获取地理位置',
					loaded: false,
				},
				locationLoading: true,
				projectList: [],
				cityList: []
			}
		},
		methods: {
			pageTap(params) {
				const {actionType, data} = params || {};
				if (actionType === 'selectCity') {
					this.pageType = 2;
					uni.setNavigationBarTitle({
					    title: '选择城市'
					});
					this.getCityList();
				} else if (actionType === 'selectProject') {
					this.setProject2local(data)
				} else if (actionType === 'loadProject') {
					const {text, id} = this.currentCity;
					if (text || id) {
						this.pageType = 1;
						uni.setNavigationBarTitle({
						    title: '选择项目'
						});
						this.getProjectList();
					}
				}
			},
			setProject2local(project) {
				const {PROJECT_INFO} = this.$constant;
				if (project) {
					this.$cmMth.storageAction({key: PROJECT_INFO, action: 'set', value: project});
					uni.navigateBack();
				}
			},
			onSelect(item) {
				this.pageType = 1;
				this.currentCity.text = item.name;
				this.currentCity.id = item.cityId;
				uni.setNavigationBarTitle({
				    title: '选择项目'
				});
				this.getProjectByLocation();
			},
			async reloadLocation() {
				await this.getLocation().catch();
				this.getProjectByLocation();
			},
			getLocation() {
				return new Promise(async (resolve) => {
					this.locationLoading = true;
					const { data } = await this.$mallApi.data.getCityByIp()
					// const locaiton = await Map.baidu.getLocation();
					this.locationLoading = false;
					if (data) {
						this.currentCity.text = data; //locaiton.city;
						this.currentCity.id = '';
						this.currentCity.loaded = true;
					} else {
						this.currentCity.text = '请手动选择';
						this.currentCity.loaded = false;	
					}
					resolve();
				})
			},
			getProjectList(params) {
				const {cityId, hideLoading} = params || {};
				const {text, id} = this.currentCity;
				return this.$mallApi.data.getProjectListByCity({pathParams: `/${id || text}`, hideLoading, responseToast: false}).then(res => {
					if (res.statusCode === 200) {
						const list = Array.isArray(res.data) ? res.data : [];
						const tempList = [];
						list.forEach(item => {
							const {projectName} = item;
							const prj = {
								...item,
								name: projectName
							}
							tempList.push(prj);
						})
						this.projectList = tempList;
						this.$forceUpdate();
					}
				})
			},
			getCityList() {
				const cityList = this.cityList;
				if (cityList.length) return;
				this.$mallApi.data.getProjectCity().then(res => {
					if (res.statusCode === 200) {
						const cityObj = res.data || {};
						const cityList = [];
						for(const key in cityObj) {
							const children = Array.isArray(cityObj[key]) ? cityObj[key] : [];
							const item = {
								label: key,
								children: []
							}
							children.forEach(city => {
								item.children.push({
									...city,
									name: city.cityName
								})
							})
							cityList.push(item);
						}
						this.cityList = cityList;
					}
				});
			},
			async getProjectByLocation() {
				const {loaded} = this.currentCity;
				 uni.showLoading({title: '加载中'});
				if (!loaded) await this.getLocation().catch();
				await this.getProjectList({hideLoading: true});
				uni.hideLoading();
			}
		},
		onLoad() {
			
		},
		mounted() {
			this.getProjectByLocation();
		}
	}
</script>


