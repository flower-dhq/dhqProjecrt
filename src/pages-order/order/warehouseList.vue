<template>
	<view class="ware-list" :class="[THEME_NAME,{'ware-other': dataList.length>0}]" :style="[THEME_CSS_VAR]">
		<view class="top-search">
			<view :class="['search-input-boxtwo-new']">
				<u-search v-model="searchContent" placeholder="物料名称、编码、规格" :showAction="false"></u-search>
			</view>
			<view class="search-opt" style="cursor: pointer; right: 50px; width: 40px" @click="searchInput">搜索</view>
			<view class="confirm-opt" style="cursor: pointer; right: 5px" @click="confirmBtnClick">提交</view>
		</view>
		<!--筛选条件-->
		<screening-condition @showStoreClose="showStoreClose" v-on:tabWarehouse="tabWarehouse"
			ref="refScreeningCondition" @on-search="querySeach"></screening-condition>

		<!--列表数据-->
		<view class="list-head">
			<span>物料信息</span>
			<span>可用库存</span>
		</view>
		<view ref="refWrapper" class="list-content">
			<u-list @scrolltolower="scrolltolower" v-if="dataList.length>0">
					<u-list-item v-for="(item, index) in dataList" :key="index" class="data-list">
						<view class="list-ui" @click="singleMaterialClick(item)">
							<view class="ware-check " :class="[{'checkAct':selectIndex.indexOf(item) !== -1}]"></view>
							<view class="item-info">
								<span class="stock">{{item.usableStocks}}</span>
								<view class="gs-code">{{item.firstGcName}}-{{item.firstGcName}}</view>
								<view>{{item.sgName}}({{item.sgCode}})</view>
								<view class="item-bottom">
									<p>规格型号：{{item.standardModel}}</p>
									<p>价格：{{item.sgSellPrcice?item.sgSellPrcice:0}}元</p>
									<p>单位：{{item.unit}}</p>
								</view>
							</view>
						</view>
					</u-list-item>
			</u-list>
			<view v-if='dataList.length==0' class="nodata"></view>
		</view>
	</view>
</template>

<script>
	import {
		getMaterialList,
		getMaterialListNew
	} from '@/service/crm6.0';
	import ScreeningCondition from './component/screeningConditionWarehouse.vue';
  import { mapState, mapMutations} from 'vuex'
	export default {
		components: {
			'screening-condition': ScreeningCondition,
		},
		data() {
			return {
				isFinished: false, // 是否加载完
				searchContent: '',
				searchForm: {
				  projectId: '',
				  areaId: '',
				  twId: '', // 仓库id
				  gcId: '', // 分类id
				  unoinParam: '', //  查询参数
				  sgName: '',//  查询参数
				  startIndex: 1,
				  pageSize: 50,
				  userAccount: '',
				  leiXing: '',
					userId: '',
					followUpProcessorId: '',
					orderUserId: '',
				},
				dataList:[],
				selectIndex: [],
				userInfo: {}
			}
		},
		onLoad() {
			const { O_USER_INFO } = this.$constant;
    	this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
			this.searchForm.userAccount = this.userInfo.userAccount;
			this.searchForm.userId = this.userInfo.userId;
			this.searchForm.followUpProcessorId = this.userInfo.userId;
			this.searchForm.orderUserId = this.userInfo.userId;
			this.$nextTick(() => {
				this.$refs.refScreeningCondition.initData();
			})
			// this.querySeach()
		},
		computed:{
		
		},
		/**监听用户下拉刷新 */
		onPullDownRefresh() {
			this.searchForm.startIndex = 1;
		  this.querySeach();
			uni.stopPullDownRefresh()
		},
		methods: {
			...mapMutations('warehouse', [
			    'saveMaterials',
			]),
			tabWarehouse(text) {
			  this.searchForm.projectId = text.projectId
			  this.searchForm.twId = text.twId
			  this.searchForm.gcId = text.gcId
			  this.searchForm.areaId = text.areaId
			  // this.searchForm.leiXing = text.leiXing
			  this.searchForm.leiXing = ''
			},
			scrolltolower(){
				if (!this.isFinished) {
				  this.searchForm.startIndex++
				  this.querySeach() 
				}
			},
			querySeach(){
				// if (!this.searchForm.projectId || !this.searchForm.twId){
				//   this.$vux.toast.show({
				//     text: '仓库不能为空！！',
				//     type:'text',
				//     position:'bottom'
				//   })
				//   return
				// }
				// this.initData();
				let param={
					data:{
						...this.searchForm,
					}
				}
				this.dataList=[];
				this.listCount=0;
				uni.showLoading({
				  mask:true 
				});
				getMaterialList(param).then(res => {
					uni.hideLoading();
				  if(res.status == '200'&&res.data.list) {
						if (this.searchForm.startIndex == 1) {
						  this.dataList = res.data.list
						}else {
						  this.dataList = this.dataList.concat(res.data.list)
						}
						this.dataList.forEach(function (element) {
						  element.tabNameWarehouse = 'tabName';
						})
						// this.dataList=res.data.list;
						this.listCount=res.data.total;
						// 加载到最后一页，就关闭上拉加载
						if (this.dataList.length === this.listCount) {
						  this.isFinished = true
						}
				  }else{
						uni.showToast({ title: res.message, icon: 'none' })
					}
				})
			},			
			// 单个材料点击
			singleMaterialClick(item) {
				item.number=1;
			  if (this.selectIndex.indexOf(item) == -1) {
			    this.selectIndex.push(item)
			  }
			  else {
			    this.selectIndex.splice(this.selectIndex.indexOf(item), 1)
			  }
			},
			searchInput() {
					this.searchForm.unoinParam = this.searchContent;
          this.searchForm.sgName = this.searchContent
          if (!this.searchForm.projectId || !this.searchForm.twId){
						uni.showToast({
							title: '仓库不能为空',
							duration: 1000,
							icon:'exception',
						});
            return
          }
					this.searchForm.startIndex=1;
          this.querySeach();
			},
			confirmBtnClick() {
				let data = {
					'materials':this.selectIndex,
					type:"2"
				  }
				this.saveMaterials(data);
				uni.navigateBack();
			},
		}
	}
</script>

<style scoped lang="scss">
	.ware-other{
		display: grid;
	}
	.ware-list{
		height: 100%;
		overflow: hidden;
		// display: grid;
		// grid-template-rows: 100px 1fr;
		background-color: #f5f5f5;
	}
	.top-search {
		position: relative;
		top: 0;
		width: 100%;
		z-index: 800;
		border-bottom: 1px solid #f3f3f3;
		background: #FFFFFF;

		.search-input-boxtwo-new {
			position: relative;
			top: 0;
			width: calc(100% - 40px - 40px - 20px);
			height: 42px;
			padding: 10px 0 10px 10px;
			overflow: hidden;
			z-index: 500;
		}

		.search-opt {
			position: absolute;
			right: 0;
			top: 0;
			cursor: pointer;
			width: 54px;
			text-align: center;
			font-size: 15px;
			line-height: 52px;
			color: #609af7 !important;
		}

		.confirm-opt {
			position: absolute;
			right: 0;
			top: 0;
			width: 40px;
			text-align: center;
			font-size: 15px;
			line-height: 52px;
			color: #609af7 !important;
		}
	}

	.list-head {
		position: relative;
		width: 100%;
		height: 40px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
		font-size: 14px;
		background-color: #fff;
		border-bottom: 1px solid #eee;
		box-sizing: border-box;

		&::before {
			position: absolute;
			top: 50%;
			left: 0;
			content: '';
			transform: translateY(-50%);
			display: block;
			width: 3px;
			height: 16px;
			background-color: #609af7;
		}

		span:nth-child(1) {}

		span:nth-child(2) {}
	}
	.list-content {
	  display: flex;
	  flex-direction: column;
	  row-gap: 10px;
	  // margin: 0 10px 10px;
	  overflow: auto;
	}

	.data-list {
		padding: 15px;
		background: #ffffff;
		border-radius: 6px;
		margin-bottom: 10px;

		.list-ui {
			position: relative;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			background-color: #fff;
			// padding: 15px 10px;
			box-sizing: border-box;
			font-size: 14px;
			.ware-check{
				background-color: rgb(255, 255, 255);
				    border-color: rgb(200, 201, 204);
				    width: 18px;
				    height: 18px;
						box-sizing: border-box;
						transition-property: border-color, background-color, color;
						transition-duration: 0.2s;
						color: #606266;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: center;
						color: transparent;
						text-align: center;
						margin-right: 6px;
						font-size: 6px;
						border-width: 1px;
						border-color: #c8c9cc;
						border-style: solid;
						position: relative;
			}
			.checkAct{
				background-color: rgb(41, 121, 255);
				border-color: rgb(41, 121, 255);
				width: 18px;
				height: 18px;
				&::before {
				  position: absolute;
				  content: '';
				  width: 5px;
				  height: 8px;
				  transform: rotate(45deg);
				  border-right: 2px solid #fff;
				  border-bottom: 2px solid #fff;
				  top: 1px;
				}
			}
			.checkbox-button {
				margin-right: 10px;
			}

			.gs-code {
				font-size: 15px;
			}

			.item-info {
				flex: 1;

				.stock {
					position: absolute;
					top: 15px;
					right: 10px;
					text-align: right;
				}
			}

			.item-bottom {
				display: flex;
				justify-content: flex-start;
				align-items: center;

				p {
					margin-left: 20px;
				}
				p:first-child {
					margin-left: 0;
				}
			}
		}
	}
	.nodata {
	  height: 100vh;
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
