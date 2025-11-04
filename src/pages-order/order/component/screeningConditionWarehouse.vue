<template>
	<view>
		<view class="common-bar">
			<view class="select-area" @click="handleShowPanelList('1')">
				<view class="cmn-text">选择仓库</view>
				<img src="@/static/icon-img/icon-drop.png" :class="['drop-icon',{'rotate180': selectType=='1'}]" />
			</view>
			<view class="select-area" @click="handleShowPanelList('2')">
				<view class="cmn-text">物料分类</view>
				<img src="@/static/icon-img/icon-drop.png" :class="['drop-icon',{'rotate180':  selectType=='2'}]" />
			</view>
		</view>

		<view v-show="showScreen" class="pull-down-panel" :style="{'top': top,'height':`calc(100vh - ${top})`}"
			@click.stop="handleCloseView">
			<view class="panel-wrapper" @click.stop>
				<view class="wrapper-content">

					<view class="list-wrapper" v-if="selectType==1">
						<view class="wrap-left">
							<view :class="['cmn-list',{'cmn-active':areaId == item.areaId}]" v-for="item in areaList"
								:key="item.areaId" @click="selectArea(item)">{{item.areaName}}</view>
						</view>
						<view class="wrap-center">
							<view :class="['cmn-list list-right',{'cmn-active':projectId == item.id}]"
								v-for="item in projectList" :key="item.id" @click="selectProject(item)">
								{{item.title}}
							</view>
						</view>
						<view class="wrap-right">
							<view :class="['cmn-list list-right',{'cmn-active active-right':twId == item.twId}]"
								v-for="item in warehouseList" :key="item.twId" @click="handleSelectWare(item)">
								{{item.twName}}
							</view>
						</view>
					</view>

					<view class="list-wrapper" v-if="selectType==2">
						<view class="wrap-left">
							<view :class="['cmn-list',{'cmn-active':kindId1 == item.gcId}]" v-for="item in kindList1"
								:key="item.gcId" @click="changeKind(item.gcId, 1)">{{item.gcName}}</view>
						</view>
						<view class="wrap-center">
							<view :class="['cmn-list list-right',{'cmn-active':kindId2 == item.gcId}]"
								v-for="item in kindList2" :key="item.gcId" @click="changeKind(item.gcId, 2)">
								{{item.gcName}}
							</view>
						</view>
						<view class="wrap-right">
							<view :class="['cmn-list list-right',{'cmn-active active-right':kindId3 == item.gcId}]"
								v-for="item in kindList3" :key="item.gcId" @click="changeKind(item.gcId, 3)">
								{{item.gcName}}
							</view>
						</view>
					</view>

				</view>
				<view class="footer-btn">
					<view class="confirm" @click="handleConfirm">确认</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getAreaList
	} from '@/service/landcrm.js'
	import {
		getProjectAndQuesRange
	} from '@/service/wuyecrm.js'
	import {
		getWarehouseList,
		getMaterialsCategory
	} from '@/service/crm6.0.js'
	export default {
		data() {
			return {
				areaId: '',
				projectId: '',
				twId: '',
				areaList: [],
				projectList: [],
				warehouseList: [], //仓库列表
				top: '110px',
				selectType: '', //【1】选择仓库【2】物料分类
				showScreen: false,
				kindList1: [],
				kindList2: [],
				kindList3: [],
				kindId1: '',
				kindId2: '',
				kindId3: '',
				isFirstShow:true,
				resultKindId:'',
				userInfo:{}
			}
		},
		created() {
			const { O_USER_INFO } = this.$constant;
			this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
		},
		onLoad() {},
		omShow() {},
		methods: {
			initData() {
				this.getAreaData();
				this.getMaterialKindData();
			},
			getMaterialKindData() {
				// 查询材料分类
				var self = this
				this.kindList1 = [];
				this.kindList2 = [];
				this.kindList3 = [];
				getMaterialsCategory({}).then(res => {
					self.kindList1 = res.data[0].children;
					if (self.kindList1.length > 0) {
						self.changeKind(self.kindList1[0].gcId, 1);
					}
				})
			},
			changeKind(val, index) {
				var list = []
				switch (index) {
					case 1: {
						if (this.kindId1 == val) {
							return
						}
						list = this.kindList1;
						this.kindId1 = val;
						break
					}
					case 2: {
						if (this.kindId2 == val) {
							return
						}
						list = this.kindList2;
						this.kindId2 = val;
						break
					}
					case 3: {
						if (this.kindId3 == val) {
							return
						}
						list = this.kindList3;
						this.kindId3 = val;
						break
					}
					default: {

					}
				}
				if (index < 5) {
					for (var i = 0; i < list.length; i++) {
						if (list[i].gcId === val) {
							if (list[i].children.length > 0) {
								if (index == 1) {
									this.kindList2 = list[i].children;
								} else if (index == 2) {
									this.kindList3 = list[i].children;
								}
								this.changeKind(list[i].children[0].gcId, index + 1);
							} else {
								if (index == 1) {
									this.kindList2 = [];
									this.kindList3 = [];
									this.kindId2 = '';
									this.kindId3 = '';
								} else if (index == 2) {
									this.kindList3 = [];
									this.kindId3 = '';
								}
							}
						}
					}
				}
			},
			handleShowPanelList(type) {
				if (this.showScreen) {
					this.selectType = '';
				} else {
					this.selectType = type;
				}
				this.showScreen = !this.showScreen;

			},
			getAreaData() {
				/**
				 * 根据userId查询城市公司
				 */
				var self = this;
				self.areaList = [];
				let params = {
					data: {
						userId: this.userInfo.userId,
					}
				}
				getAreaList(params).then(res => {
					self.areaList = res.items;
					if (self.areaList.length > 0) {
						self.areaId = self.areaList[0].areaId;
						self.selectArea(self.areaList[0]);
					}
				});
			},
			// handleSelectArea(item) {
			// 	this.areaId = item.areaId;
			// 	this.selectArea();
			// },
			// handleSelectProject(item) {
			// 	this.projectId = item.id;
			// 	this.selectProject();
			// },
			handleSelectWare(item) {
				this.twId = item.twId;
				this.leiXing=item.leiXing;
			},
			selectArea(item) {
				this.projectId = '';
				this.projectList = [];
				this.areaId = item.areaId;
				let params = {
					data: {
						userId: this.userInfo.userId,
						areaId: this.areaId
					}
				}
				getProjectAndQuesRange(params).then(res => {
					if (res.resultCode == '200' && res.data && res.data.length > 0) {
						this.projectList = res.data
						if (res.data.length > 0) {
							this.projectId = res.data[0].id;
							this.selectProject(res.data[0]);
						}
					} else {
						uni.showToast({
							title: res.resultDesc,
							icon: 'none'
						})
					}
				})
			},
			selectProject(item) {
				let self = this;
				self.projectId = item.id;
				let param = {
					data: {
						companyId: localStorage.companyId,
						areaId: this.areaId,
						projectId: this.projectId,
					}
				}
				self.warehouseList = [];
				getWarehouseList(param).then(res => {
					if (res.statusCode == 200 && res.data.data) {
						var orginList = [];
						for (var i = 0; i < res.data.data.length; i++) {
							if (res.data.data[i].twTypeCode == "material_type") {
								orginList.push(res.data.data[i]);
							}
						}
						self.warehouseList = self.warehouseList.concat(orginList);
						if (self.warehouseList.length > 0) {
							self.twId = self.warehouseList[0].twId;
						}else{
							self.twId='';
						}
						if(self.isFirstShow){
							let tabWarehouse = {
								twId: this.twId,
								gcId: this.resultKindId,
								projectId: this.projectId,
								areaId: this.areaId,
								leiXing: this.leiXing
							}
							self.$emit('tabWarehouse', tabWarehouse)
							self.$emit("on-search", {}); //父组件监听
							self.isFirstShow = false;
						}
					}
				})
			},
			handleCloseView() {

			},
			handleConfirm() { //确认查询
				if(this.selectType==2){
					var kindId = ''
					if (this.kindId3.length > 0) {
					  kindId = this.kindId3
					}
					else if (this.kindId2.length > 0) {
					  kindId = this.kindId2
					}
					else {
					  kindId = this.kindId1
					}
					this.resultKindId = kindId
				}
				
				this.showScreen = false;
				this.selectType='';
				let tabWarehouse = {					
					twId: this.twId,
					gcId: this.resultKindId,
					projectId: this.projectId,
					areaId: this.areaId,
					leiXing: this.leiXing
				}
				this.$emit('tabWarehouse', tabWarehouse)
				this.$emit("on-search", {}); //父组件监听
			},
		}
	}
</script>

<style scoped lang="scss">
	.common-bar {
		position: relative;
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 44px;
		padding: 0 12px;
		border-bottom: 1px solid #eaeaea;
		box-sizing: border-box;
		background: #FFFFFF;
	}

	.select-area {
		display: flex;
		align-items: center;
	}

	.cmn-text {
		font-size: 30rpx;
		line-height: 0px;
		color: #333333;
	}

	.pull-down-panel {
		position: absolute;
		width: 100%;
		background: rgba($color: #000, $alpha: 0.5);
		z-index: 1;
		overflow: hidden;

		.panel-wrapper {
			position: relative;
			width: 100%;
			max-height: 62%;
			display: flex;
			flex-direction: column;
			background: #fff;
			overflow: hidden;
			z-index: 999;

			.wrapper-content {
				position: relative;
				flex: 1;
				height: 100%;
				display: flex;
				flex-direction: column;
				overflow: hidden;

				.list-wrapper {
					flex: 1;
					display: flex;
					overflow: hidden;

					.wrap-left {
						width: 32%;
						background: #f7f7f7;
						overflow: auto;
					}

					.wrap-center {
						// flex: 1;
						width: 32%;
						overflow: auto;
					}

					.wrap-right {
						flex: 1;
						overflow: auto;
					}

					.cmn-list {
						height: 51px;
						line-height: 51px;
						text-align: center;
						font-size: 30rpx;
						
					}

					.list-right {
						padding: 0 15px;
						text-align: left;
						border-bottom: 0.5px solid #eaeaea;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.cmn-active {
						background: #ffffff;
						color: #2761ff;
					}

					.active-right {
						display: flex;
						justify-content: space-between;
						align-items: center;

						&::after {
							position: relative;
							top: 3px;
							content: url('@/static/icon-img/icon-select.png');
						}
					}
				}
			}

			.footer-btn {
				width: 100%;
				display: flex;
				height: 44px;

				.confirm {
					flex: 1;
					text-align: center;
					line-height: 44px;
					color: #fff;
					background: #2761ff;
					font-size: 32rpx;


				}
			}
		}
	}

	.rotate180 {
		transform: rotate(-180deg);
	}
</style>
