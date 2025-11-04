<style scoped lang="scss">
	.reportingRorRepairs{
		min-height: 100vh;
		width: 100%;
		background: #F5F5F5;
	}
	.reportingRorRepairs-tab {
		width: 100%;
		height: 88rpx;
		.rorRepairs-box {
			width: 100%;
			height: 88rpx;
			position: fixed;
			top: 0;
			left: 0;
			background: #fff;
			z-index: 1;
			border-bottom: 1px solid rgba(245, 240, 240, 1);
		}
	}

	.all-select {
		.detail-list {
			margin-top: 20rpx;

			&-cont {
				margin-bottom: 20rpx;
				padding: 0 40rpx;
				box-sizing: border-box;
				background-color: #fff;
				.cont-up {
					padding: 30rpx 0 2rpx 0;
					color: #393939;

					.service-no {
						line-height: 45rpx;
						@include flx-dsp($jsc: flex-start, $ali: center);

						&>view:nth-of-type(1) {
							width: 157rpx;
							text-align: left;
							font-size: 24rpx;
							color: #333;
						}

						&>view:nth-of-type(2) {
							flex: 1;

							text {
								font-size: 24rpx;
								color: #666;
							}

							@include flx-dsp($jsc: space-between, $ali: center);

							&>text:nth-of-type(2) {
								color: var(--app-primary-color);
							}
						}
					}

					.problem-desc {
						@include flx-dsp($jsc: flex-start, $ali: flex-start);

						&>view:nth-child(1) {
							width: 157rpx;
							text-align: left;
							font-size: 24rpx;
							color: #333;
							line-height: 45rpx;
						}

						&>view:nth-child(2) {
							flex: 1;
							line-height: 45rpx;
							font-size: 24rpx;
							color: #666;
							word-wrap: break-word;
							word-break: break-all;
						}
					}
					// border-bottom: 1px solid rgba(245, 240, 240, 1);
				}

				.cont-down {
					padding: 8rpx 0 2rpx 157rpx;

					// .time {
					// 	color: #aaa;
					// 	font-size: 24rpx;
					// }

					&>view:nth-child(1) {
						@include flx-dsp($jsc: flex-start, $ali: center);
						margin: 24rpx 0;

						button {
							width: 172rpx;
							height: 68rpx;
							border: 1px solid var(--app-primary-color);
							border-radius: 48rpx;
							color: var(--app-primary-color);
							outline: none;
							background-color: #fff;
							font-size: 24rpx;
							margin-left: 0;
						}
						button::after{
							border: none;
						}
						&>button:nth-child(1) {
							margin-right: 20rpx;
							border: 1px solid #AAAAAA;
							color: #AAAAAA;
						}
					}
				}
			}
		}
		.base-lien {
      position: relative;
      margin: 0rpx auto 20rpx auto;
      width: 476rpx;
      height: 60rpx;
      @include flx-dsp($jsc: center, $ali: center);
      font-size: 28rpx;
      & > view {
        width: 100%;
        height: 1rpx;
        background-color: #e0e0e0;
      }
      & > text {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 180rpx;
        height: 40rpx;
        text-align: center;
        background-color: #f5f5f5;
        transform: translate(-50%, -50%);
        display: block;
        color: #606266;
      }
    }
	}
	
	.centerDisplay{
		@include flx-dsp($jsc: center, $ali: center);
	}
	.centerDisplays{
		@include flx-dsp($jsc: center, $ali: center);
		color:#AAAAAA;
	}
.nodata {
    height: calc(100vh - 100rpx);
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

<template>
	<view>
		<view class="reportingRorRepairs" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
			<view class="reportingRorRepairs-tab">
				<view class="rorRepairs-box">
					<u-tabs :list="tabList" @click="tabItemClick" itemStyle="width:50%;padding:0;height:88rpx"
						lineWidth="100rpx" lineColor="var(--app-primary-color)"
						activeStyle="font-size:28rpx;color:var(--app-primary-color)" inactiveStyle="font-size:28rpx" :current="selectedTabIndex">
					</u-tabs>
				</view>
			</view>
			<view class="all-select">
				<view class="detail-list">
					<view class="detail-list-cont" v-for="(item, index) in currentList" :key="index">
						<view class="cont-up">
							<view class="service-no">
								<view>工单单号</view>
								<view>
									<text>{{item.serviceNo}}</text>
									<text>{{item.statusText}}</text>
								</view>
							</view>
							<view class="service-no">
								<view>工单类型</view>
								<view>
									<text>{{item.matterType}}</text>
								</view>
							</view>
							<view class="problem-desc">
								<view>问题描述</view>
								<view>
									{{item.desc}}
								</view>
							</view>
							<view class="problem-desc">
								<view>时间</view>
								<view>
									{{item.time}}
								</view>
							</view>

						</view>
						<view class="cont-down">
							<view>
								<button @click="buttonEvent({type: 'progress', data: item})" class="centerDisplays">处理进度</button>
								<button @click="buttonEvent({type: 'tel', data: item})" class="centerDisplay">联系客服</button>
								<button v-if="item.payStatus===0&&selectedTabIndex===0"
									@click="buttonEvent({type: 'pay', data: item})"
									style="margin-left: .2rpx;">去支付</button>
								<button v-if="item.payStatus==1&&selectedTabIndex===0"
									style="margin-left: .2rpx;color:#ACACAC;border: 1px solid #ACACAC;">已支付</button>
							</view>
						</view>
					</view>
				</view>
				<view v-if="isNoDataBack" class="nodata"></view>
				<!-- <u-loadmore v-show="isEndData" :status="status" background-color="#fbf9fe" line /> -->
				<view class="base-lien"  v-if="isEndData">
					<view class="line"></view>
					<text>没有更多了</text>
				</view>
			</view>
		</view>
		<!-- 消息提示 -->
		<cl-toast ref="elMessage"></cl-toast>
		<u-modal :show="callPhoneShow" content='联系号码为空' width="500rpx" @confirm="callPhoneShow = false" />
	</view>
</template>

<script>
	import { feedBackOrderLists } from '@/service/landcrm.js';
	import { findBuildLocation } from '@/service/community.js'
	import { findOwnerTaskListByPage } from '@/service/wycrm60'
	import commLogic from '@/js/comm-logic';
	// import { controlFunction } from "@/assets/js/mixin.js";
import util from '@/js/utils';

	/** 华船项目，查询的是自定义工单系统的提交记录 */
	export default {
		name: "myReportAndRepair",
		data() {
			return {
				ownerInfo: {},
				tabList: [{
					name: '未完成'
				}, {
					name: '已完成'
				}],
				selectedTabIndex: 0,
				currentList: [],
				pageSize: 10,
				categories: '5,11',
				undone: {
					list: [],
					currentPage: 1,
					isNoData: false,
				},
				done: {
					list: [],
					currentPage: 1,
					isNoData: false,
				},
				pullDownConfig: {
					content: '',
					pullUpHeight: 60,
					height: 40,
					autoRefresh: true,
					downContent: '释放后加载',
					upContent: '',
					loadingContent: '加载中...',
					clsPrefix: 'xs-plugin-pullup-'
				},
				scrollerStatus: {
					pullupStatus: 'default'
				},
				taskType: "",
 				thatOptions:{
					type:'',
					categories:'',
					taskType:'',
					title:""
				},
				memberId:'',
				companyId:'',
				projectType:'',
				userInfo:{},
				bottomTip:"已无其它内容",
				isNoDataBack:false,
				lsStatus:'',
				isEndData:false,
				callPhoneShow: false
			}
		},
		computed: {
			isNoData() {
				const key = this.selectedTabIndex ? 'done' : 'undone';
				console.log(this.selectedTabIndex,"this.selectedTabIndex")
				return this[key].isNoData;
			}
		},
		onLoad(options) {
			const { O_USER_INFO } = this.$constant;
			const { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
			const { companyId ,projectType} = commLogic.getProjectConfig();
			this.companyId = companyId
 			this.projectType = projectType;
			if(!phoneNumber){
				  uni.navigateTo({ url: '/pages-a/authorization/bindingMobile'});
					return
			}
			this.thatOptions = options
  		}, 
		onShow(options){
			const {PROJECT_CODE,PROJECT_TYPE, COMPLANY_ID } = this.$appConfig
			const { MEMBER_ID, PROJECT_ID ,O_USER_INFO } = this.$constant;
			this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
			// this.companyId = COMPLANY_ID
			this.userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' });
 			// this.projectType = PROJECT_TYPE;
			this.initData();
		},
		onReachBottom(){
			this.loadMore()
		}, 
		onShareAppMessage(res) {
  	  return {
  	    title: '物业报事报修',
  	    path: '/pages-a/customOrder/myReportAndRepair?categories='+this.thatOptions.categories+'&taskType='+this.thatOptions.taskType+'&title='+this.thatOptions.title
  	  }
  	},
		// mixins: [controlFunction],
		methods: {
			// tab切换
			tabItemClick(e) {
				const key = e.index ? 'done' : 'undone';
				this.selectedTabIndex = e.index;
				const list = this.currentList = this[key].list = [];
 				this[key].currentPage = 1;
				this.isEndData= false;
				console.log(this[key].currentPage);
				console.log("list", list) 
				this.loadListData({indexType: e.index})
			},
			// 加载列表数据
			loadListData(params) {
				const {
					indexType,
					initKey
				} = params || {};
				const key = indexType ? 'done' : 'undone';
				const {COMPLANY_ID , O_USER_INFO} = this.$constant
				const args = {
					data:{
						categories: this.categories,
						perSize: this.pageSize,
						pageNum: this[key].currentPage,
						status: indexType ? 2 : 1,
						companyId: util.storageAction({ key: COMPLANY_ID, action: 'get' }),
						// userId: util.storageAction({ key: O_USER_INFO, action: 'get' }).memberId,
						memberId: util.storageAction({ key: O_USER_INFO, action: 'get' }).memberId,
					},
					hideLoading:true,
					responseToast:false,
				};
				this.isNoDataBack = false
				this.isEndData= false;
				uni.showLoading({title:'加载中...'})
				const p = findOwnerTaskListByPage(args);
				if (initKey) this[initKey].list = []
				this.currentList = this[key].list;
 
				return p.then(res => {
					console.log('res===', res)
					uni.hideLoading()
					if (res.status === '200') {
						const data = res.data || {}
						const list = data.records || []
						const totalCount = Number(res.total) || 0;
						// if (list.length === this.pageSize) this[key].currentPage = this[key].currentPage + 1;

						// 每次下拉 页数加一
						// list没有值 代表数据加载完了 isNoDate = true
						this[key].currentPage = this[key].currentPage + 1;
						list.forEach(item => {
							const rc = {
								serviceNo: item.taskCode,
								status: item.taskState,
								statusText: item.taskStateStr ,
								desc: item.taskDesc || '',
								time: item.createDate,
								orderId: item.quesTaskId,
								managerTel: item.managerTel,
								payStatus: -1,
								money: '0',
								notifyUrl: '',
								matterType: item.typeReportStr, // 工单类型
								receivableId: '',
							};
							this[key].list.push(rc);
						});
						this[key].isNoData = this[key].list.length < total ? false : true

						if (this[key].isNoData) {
						  this[key].isNoData = true;
							this.bottomTip = '已无其他内容';
							this.isEndData= true;
							this[key].currentPage = 1
						}
						else{
							this.bottomTip = '加载中...'
						}
						this.currentList = this[key].list;
						if(this.currentList.length < 1 ){
							this.isNoDataBack = true
						}else {
							this.isNoDataBack = false
						}
 					} else {
						this.$refs.elMessage.open({
						  message:res.message || '',
						  position: 'bottom'
						})
					}
					// this.resetScroller();
				}).catch(_ => {
					// this.resetScroller();
					uni.hideLoading()
				})
			},
			// 处理进度/联系客服
			async buttonEvent(params) {
				const {
					type,
					data
				} = params;
				if (type === 'progress') {
					const arg = {
						orderId: data.orderId
					};
					uni.navigateTo({
						url:'/pages-a/customOrder/processingProgress?arg='+encodeURIComponent(JSON.stringify(arg)),
					})
				} else if (type === 'tel') {
					// window.location.href = `tel:${data.managerTel}`;
					const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['callPhone']})
					if (code !== 1 && code !== -2) return
					if(data.managerTel){
						uni.makePhoneCall({
						phoneNumber: data.managerTel,
					})
					} else {
						// this.callPhoneShow = true
						uni.showToast({ title: "联系号码为空，暂时无法联系", icon: 'none' })
					}
					
				} else if (type === 'pay') {
					let url = location.href;
					const arg = {
						orderId: data.orderId
					};
					let returnUrl = url.substr(0, url.lastIndexOf('#') + 1) + "/processingProgress?arg=" +
						encodeURIComponent(JSON.stringify(arg));
					let orderInfo = {
						orderId: data.receivableId, //订单ID
						totalAmount: data.money, //缴费金额
						isCountdown: false, //是否倒计时
						// countdownDate:countdownDate,//倒计时时间  2020-12-01 17:00:00
						PaymentInfo: data.matterType, //支付信息
						returnUrl: returnUrl, //支付成功跳转页面
						notifyUrl: data.notifyUrl,
						// banktransferUrl:'http://wwww.xxx.com/yyyyy',//转账回调
						model: 'workOrder',
					}
					console.log("跳转参数", orderInfo)
					this.$router.push({
						path: '/toBePaid',
						query: {
							orderInfo: JSON.stringify(orderInfo)
						}
					})
				}
			},
			// 获取业主信息
			getOwnerInfo() {
				// uni.showLoading({ title:'加载中...' })
				let params = {
					data:{
						memberId: this.memberId,
						projectType: this.projectType,
					},
					hideLoading:true,
				}
				const pms = findBuildLocation(1,params);
				return pms.then(res => {
					// uni.hideLoading()
					if (res.status === '200') {
						const list = res.data && Array.isArray(res.data.authBuildings) && res.data.authBuildings ||
							[];
						for (let i = 0; i < list.length; i++) {
							const item = list[i];
							if (item.isDefault === 1) {
								this.ownerInfo = item;
								break
							}
							this.ownerInfo = item;
						}
						// if (!list.length) {
						// 	this.showNoAuthAlert();
						// }
					} else {
						// this.$refs.elMessage.open({
						//   message:res.message,
						//   position: 'middle'
						// })
					}
				}).catch(_ => {
					// uni.hideLoading()
				})
			},
			// 未认证提示
			showNoAuthAlert() {
				this.$confirmPage.show({
					'path': '-1'
				});
			},
			// 下拉加载更多数据
			loadMore() {
				const key = this.selectedTabIndex ? 'done' : 'undone';
				
				if (this[key].isNoData) {
					// this.$vux.toast.text('已经到底了', 'middle');
					// this.resetScroller();
				} else {
					this.loadListData({
						indexType: this.selectedTabIndex
					});
				}
			},
			// 重置Scroller
			resetScroller() {
				this.$nextTick(_ => {
					const containerEle = $('.xs-plugin-pullup-container');
					const isNoData = this.isNoData;
					const display = isNoData ? 'none' : 'block';
					const padding = isNoData ? '0px' : '40px';
					this.scrollerStatus.pullupStatus = 'default';
					containerEle.css('display', 'block');
					containerEle.css('display', display);
					$('.scl-wr').css('padding-bottom', padding);
					const key = this.selectedTabIndex ? 'done' : 'undone';
					// isNoData ? $('.xs-container').addClass('back0') :  $('.xs-container').removeClass('back0');
				})
			},
			// 初始化数据
			async initData() {
				const {
					type,
					categories,
					taskType,
					title
				} = this.thatOptions;
				if (taskType == '1') {
					if (!title) {
						uni.setNavigationBarTitle({
							title:'物业报事报修'
						})
					}
				} else {
					if (!title) {
						uni.setNavigationBarTitle({
							title:'物业投诉建议'
						})
					}else{
						uni.setNavigationBarTitle({
							title:'物业投诉建议'
						})
					}
				}
				const idx = type === 'done' ? 1 : 0;
				this.selectedTabIndex = idx;
				this.categories = categories;
				await this.getOwnerInfo().then(data => [null, data]).catch(err => {
					return [err, null]
				});
				this.undone = { //进入详情页返回时控制页面从1开始
					list: [],
					currentPage: 1,
					isNoData: false,
				},
				this.done = {
					list: [],
					currentPage: 1,
					isNoData: false,
				},
				this.loadListData({
					indexType: idx,
					initKey: 'undone'
				});
			}
		},
		
	}
</script>
