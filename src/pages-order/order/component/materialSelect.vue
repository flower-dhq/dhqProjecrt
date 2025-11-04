<template>
	<view v-if="showMaterial">
		<view class="detail-info-new" v-if="taskDetail.taskState=='2'" @click="moreShow=true;">
			<view class="flex_row">
				<dt style="color: #717171;">维修材料：</dt>
				<view v-if="num == 0">{{materialDesc}}</view>
				<view v-if="num!=0||materials.length!=0">{{num+materials.length}}件</view>
			</view>
			<u-icon size="32rpx" color="#999999" name="arrow-right" v-if="materials.length==0&&!materialStoreBean.tabName"></u-icon>
		</view>
		<view v-if="materials.length>0">
			<view class="common_flex_row_center" style="margin-top: 5px" v-for="(item1,index1) in materials" :key="index1">
				<p> {{item1.materialName}} (￥ {{item1.price}})</p>
				<view class="common_flex_row">
					<view>{{item1.num}}</view>
						<!-- <u-input v-model="item1.num" readonly class="com-input" type="number"></u-input> -->
				</view>
			</view>
		</view>
		<view v-for="(item,key,index) in materialStoreBean" :key="index"
			v-if="showRepairMaterialContentView">
			<view class="common_flex_row_center" style="margin-top: 5px" v-for="(content,pos) in item" :key="pos">
			<!-- 	<p> {{content.sgName}} (￥ {{content.sgSellPrice}})({{approveStatus}}) </p> -->
				<p> {{content.sgName}} (￥ {{content.sgSellPrcice?content.sgSellPrcice:0}})</p>
				<view class="common_flex_row">
					<!-- <view>1</view> -->
					<u-input v-model="content.number" class="com-input" type="number" @on-change="dataChange"></u-input>
					<u-icon name="trash" color="#2979ff" size="20" v-if="!(content.isCk == '0' || content.isCk == '1' || content.isCk == '2')" @click="deleteMaterial(key,pos,content)"></u-icon>
				</view>
			</view>
		</view>

		<view v-if="taskDetail.taskState=='2'" style="display: flex;flex-direction: row;align-items: center;justify-content: flex-end" >
			<u-button v-if="materialStoreBean.tabName||materials.length>0" class="repair_material" type="info" @click="addMaterial">添加</u-button>
			<u-button v-if="materialStoreBean.tabName" class="repair_material repair_padding" @click="confirmMaterial"
				type="info">确认</u-button>
		</view>
		<u-action-sheet @close="moreShow=false" :actions="showList" :show="moreShow" @select="changeShow">
		</u-action-sheet>
	</view>
</template>

<script>
	import {mapMutations,mapState} from 'vuex'
	import {
		saveWarehouseAndTaskNew
	} from "@/service/crm6.0.js";
	export default {
		data() {
			return {
				moreShow: false,
				showMaterial: true,
				materialDesc: '',
				showMaterialArrow: true,
				showRepairMaterialContentView: true,
				showMaterialOptions: true,
				showList: [
					{name: '需要',index: 1,},
					{name: '不需要',index: 2,},
				],
				mDeleteGoodInfos: [],
				userInfo: {}
			}
		},
		props: {
			taskDetail: {
				type: Object,
				default: {}
			},
			materials: {
				type: Array,
			},
			flag: {
				type: Boolean,
				default: true
			}
		},
		created() {
			const { O_USER_INFO } = this.$constant;
			this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
		},
		onLoad(){},
		computed: {
			...mapState({
				materialStoreBean: state => state.warehouse.materialStore,
			}),
			num() {
				let count = 0
				for (let item in this.materialStoreBean.tabName) {
					count++;
				}
				return count;
			},
			approveStatus(item) {
				let info = "待出库"
				if (item.isCk == '0') {
					info = "待出库"
				} else if (item.isCk == '1') {
					info = "已出库"
				} else if (item.isCk == '2') {
					info = "审批中"
				} else if (item.isCk == '3') {
					info = "审批驳回"
				} else if (item.isCk == '4') {
					info = "出库失败"
				}

				return info
			}

		},
		methods: {
			...mapMutations('warehouse', [
				'deleteMaterialsPos',
				'saveMaterials',
				'clearMaterilas'
			]),
			changeShow(obj) {
				if (obj.index == 1) {
					this.addMaterial();
				}else{
					this.materialDesc='不需要'
				}
				this.$emit('on-changeOther','1',obj);
			},
			addMaterial() {
				uni.navigateTo({
					url: '/pages-order/order/warehouseList'
				})
			},
			confirmMaterial() {
				let self=this;
				uni.showModal({
					title: '提示',
					content: '确认提交吗？',
					success: function (res) {
						if (res.confirm) {
				let isExceed = false;
				let isNegative = false;
				console.log('提交----', self.materialStoreBean)
				let object = {};
				object.quesTaskId = self.taskDetail.quesTaskId;
				object.creator = this.userInfo.userId;
				object.operator = this.userInfo.userId;
				object.callType = 1;
				object.data = [];
				let array = [];
				for (let key in self.materialStoreBean) {
					let datas = self.materialStoreBean[key];
					datas.forEach(infor => {
						if (!(infor.isCk == '0' || infor.isCk == '1' || infor.isCk == '2')) {
							let obj = {}
							obj.warehouseId = infor.twId;
							obj.materialId = infor.sgId;
							obj.materialName = infor.sgName;
							obj.materialSpec = infor.standardModel;
							obj.num = infor.number || '1';
							console.log(infor)
							if(Number(obj.num) < 0){
								isNegative = true;
							}
							if(Number(obj.num) > Number(infor.usableStocks)){
								isExceed = true;
							}
							obj.price = infor.sgPurchasePrcice;
							obj.unit = infor.unit;
							obj.sgSellPrice = infor.sgSellPrcice;
							obj.standardModel = infor.standard;
							if (infor.id) {
								obj.id = infor.id;
								obj.operate = 1;
							}
							array.push(obj);
						}
					})
				}
				for (let i = 0; i < self.mDeleteGoodInfos.length; i++) {
					let infor = self.mDeleteGoodInfos[i];
					if (!(infor.isCk == '0' || infor.isCk == '1' || infor.isCk == '2')) {
						let obj = {}
						obj.warehouseId = infor.twId;
						obj.materialId = infor.sgId;
						obj.materialName = infor.sgName;
						obj.materialSpec = infor.standardModel;
						obj.num = infor.number || '0';
						if(Number(obj.num) < 0){
							isNegative = true;
						}
						if(Number(obj.num) > Number(infor.usableStocks)){
							isExceed = true;
						}
						obj.price = infor.sgPurchasePrcice;
						obj.unit = infor.unit;
						obj.sgSellPrice = infor.sgSellPrcice;
						obj.standardModel = infor.standard;
						if (infor.id) {
							obj.id = infor.id;
							obj.operate = 2;
						}
						array.push(obj);
					}
				}
				if(isNegative){
					uni.showToast({
						title: '数量设置错误，请修改后重新提交',
						duration: 1000,
						icon: 'none'
					});
					return
				}
				if(isExceed){
					uni.showToast({
						title: '超出可用库存，请修改后重新提交',
						duration: 1000,
						icon: 'none'
					});
					return
				}
				// object.data = array;
				object.data = JSON.stringify(array)
				let params = {
					data: {
						...object
					}
				}
				saveWarehouseAndTaskNew(params).then(res => {
					if(res.status=='200'){
						uni.showToast({
							title: '添加成功',
							duration: 1000,
							icon:'success',
						});
						self.clearMaterilas();
						setTimeout(function () {
							self.$emit('on-update');
							self.$emit('on-changeOther','2',1);
						}, 1000);	
					}else{
						uni.showToast({ title: res.message, icon: 'none' })
					}
				}).catch(e => {

				})
				console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});	
			},
			dataChange(event) {},
			deleteMaterial(key, pos, item) {
				let data = {
					"key": key,
					"pos": pos
				}
				this.deleteMaterialsPos(data);
				if (item.id) {
					this.mDeleteGoodInfos.push(item)
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.detail-info-new {
		display: flex;
		font-size: 14px;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
		width: 100%;
		margin: 8px 0;

		dt {
			width: 80px;
		}
	}

	.flex_row {
		display: flex;
		flex-direction: row;
	}


	.repair_layout {
		padding: 10px 0px;
	}


	.repair_material {
		height: 28px;
		margin-top: 6px;
		margin-bottom: 6px;
		width: 60px;
		margin-right: inherit;
		font-size: 13px;
		color: var(--app-primary-color);
	}

	.repair_padding {
		margin-left: 10px;
	}

	.common_flex_row_center {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		.com-input{
			width: 36px;
			padding: 2px 4px !important;
		}

		p {
			// margin-left: 10px;
			font-size: 14px;
			color: #717171;
		}
	}

	.material_title {
		font-size: 14px;
		color: black;
	}

	.common_flex_row {
		display: flex;
		flex-direction: row;
		align-items: center
	}
</style>
