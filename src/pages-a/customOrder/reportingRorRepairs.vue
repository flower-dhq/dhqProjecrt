<style lang="scss" scoped>
	.reportingRorRepairs {
		@include flx-dsp($jsc: flex-start, $ali: center, $drt:column);
		min-height: 100vh;
		background-color: #F5F5F5;
		.report-pd{
			background-color: #ffffff;
			padding: 0 35rpx;
		}
	}
	.tip-wrap{
		@include flx-dsp($jsc: flex-start, $ali: center);
		height: 72rpx;
		width: 100%;
    background: #1D3252;
    .img-wrap{
      width: 36rpx;
      height: 36rpx;
      margin: 0 18rpx 0 34rpx;
    }
    .info-wrap{
      font-size: 28rpx;
      font-weight: 400;
      line-height: 40rpx;
      color: #D1D6DC;
      margin-right: 4rpx;
    }
    .tel-wrap{
      font-size: 28rpx;
      font-weight: 400;
      line-height: 40rpx;
      color: var(--app-primary-color);
    }
  }  
	.all-form-box {
		width: 680rpx;
		min-height: 300rpx;
		padding-top: 18rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #eeeeee;

		.textarea-box {
			width: 100%;
			height: 188rpx;
			font-size: 28rpx;
			margin-bottom: 20rpx;
			color:#000000;
		}

		.form-box {
			width: 100%;
			height: 140rpx;
			// margin-bottom: 32rpx;
			@include flx-dsp($jsc: flex-start, $ali: center);
			.form-box-img-box{
				margin-right: 20rpx;
				.form-box-img{
					width: 88rpx;
					height: 80rpx;
				}
			}
			.upload-img-list{
				width:590rpx;
				.upload-list{
					width: 800rpx;
					height: 140rpx;
					@include flx-dsp($jsc: flex-start, $ali: center);
					.upload-box{
						width: 130rpx;
						height: 120rpx;
						position: relative;
						display: inline-block;
						overflow: unset;
						.upload-img{
							width: 90%;
							height: 110rpx;
							padding:0 5%;
						}
						.del-img{
							position: absolute;
							right: 0;
							top: -10rpx;
							background: #ffffff;
							border-radius: 100%;
						}
					}
				}
			}
			text {
				color: #c4c4c4;
				text-align: left;
				font-size: 28rpx;
			}
		}
	}
	.task-type{
		width: 680rpx;
		border-bottom: 1px solid #eeeeee;
		.task-type-title{
			font-size: 28rpx;
			padding: 36rpx 0 35rpx 0;
			font-weight: bold;
			color: #333333;    
		}
		.task-btns{
			@include flx-dsp($jsc: flex-start, $ali: center);
			padding-left: 12rpx;
			margin-bottom: 38rpx;
			overflow: initial;  
			.task-btn{
				width: 166rpx;
				height: 70rpx;
				margin-right: 44rpx;
				line-height: 68rpx;
				text-align: center;
				color: #aaaaaa;
				border: 1px solid #d7d7d7;
				border-radius: 8rpx;
				font-size: 26rpx;
				background-color: #fff;  
				margin-left: 0;
			}
			.active{
				border: 1px solid var(--app-primary-color);
				color: var(--app-primary-color);
				background-color:rgba(96, 212, 163, 0.10);
			}
		}
	}
	.com-w{
		width: 680rpx;
	}
	.owner-info{
		padding: 20rpx 0 20rpx 0;
		min-height: 200rpx;
		display: flex;
		.left_cont{
			flex: 1
			
		}
		.left_cont > view{
			@include flx-dsp($jsc: flex-start, $ali: center);
			overflow: hidden;
			font-size: 36rpx;
			padding: 16rpx 0; 
			.left_cont-label{
				width: 200rpx;
				text-align: left;
				font-size: 28rpx;
				color: #333333;
				float: left;
				display: inline-block;
				line-height: 40rpx;   
			}
			.left_cont-text{
				width: calc(100% - 200rpx);
				font-size: 28rpx;
				text-align: left;
				color: #666666;
				float: left;
				display: inline-block;
				line-height: 40rpx;    
			}
		}
		.right_cont{
			width: 48rpx;
			@include flx-dsp($jsc: center, $ali: center);
			.imgarray{
				width: 48rpx;
				height: 48rpx;
			}
		}
	}
	.operate-btn{
		width: 560rpx;
		margin: 50rpx auto;
		@include flx-dsp($jsc: space-between, $ali: center);
		overflow: hidden;
		.btn-box{
			min-width: 260rpx;
			line-height: 68rpx;
			text-align: center;
			border: 1px solid var(--app-primary-color);
			background-color: inherit;
			color: var(--app-primary-color);
			font-size: 30rpx;
			border-radius: 40rpx;    
		}
		.active{
			background-color: var(--app-primary-color);
			color: #fff;
		}
	}
	.submit-success{
		&.success-show {
			@include flx-dsp($jsc: center, $ali: center);
      display: flex;
      opacity: 1;
    }  
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		transition: opacity .3s;
		opacity: 0;
		display: none;   
		.submit-success-cont{
			@include flx-dsp($jsc: center, $ali: center, $drt:column);
			overflow: hidden;
			width: 550rpx;
			height: 394rpx;
			background: #ffffff;
			border-radius: 10rpx;
			.submit-success-img{
				width: 102rpx;
				margin-bottom: 20rpx;
			}
			.submit-success-text{
				font-size: 30rpx;
				color: #555555;
				margin-bottom: 50rpx;
				padding-left: 20rpx;    
			}
			.btn-box{
				width: 260rpx;
				height: 68rpx;
				line-height: 68rpx;
				background: var(--app-primary-color);
				border-radius: 46rpx;
				color: #fff;  
				padding: 0;
				font-size: 28rpx;
			}
			 button::after {
             border: none ;
			}
		}
	}

	.max-tips {
        display: block;
        width: 100%;
        line-height: 26rpx;
        color: #c4c4c4;
        text-align: left;
        font-size: 26rpx;
		padding-bottom: 18rpx;
      }
			.setTxt{
				width: 250rpx;
				text-align: center;
				font-size: 26rpx;
				color: #B3B3B3;
			}
</style>

<template>
	<view class="reportingRorRepairs" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
		<view class="tip-wrap" v-if="needtip">
      <image class="img-wrap" :src="iconNight"></image>
      <view class="info-wrap">夜间紧急服务:</view>
      <view class="tel-wrap">{{hotTel}}</view>
    </view>
		<view class="report-pd">
			<view class="all-form-box">
				<textarea v-model="description" placeholder="请填写描述信息" 	placeholder-style="color:#AAAAAA" class="textarea-box" rows="5" maxlength="-1"/>
				<view class="form-box">
					<view class="form-box-img-box">
						<image :src="uploadcamera" class="form-box-img" @click="uploadImgData" v-if="uploadImgList.length < 6"></image>
					</view>
					<scroll-view scroll-x="true" class="upload-img-list" v-if="uploadImgList.length>0">
						<view class="upload-list">
							<view class="upload-box" v-for="(item,index) in uploadImgList" :key="index">
								<image :src="item.filePath" class="upload-img" @click="previewImg(item.filePath)"></image>
								<view class="del-img">
									<u-icon name="close-circle-fill" color="red" @click="delUploadImg(index)"></u-icon>
								</view>
							</view>
						</view>
					</scroll-view>
					<text v-else>最多上传6张图片</text>
					
				</view>
				<!-- <span class="max-tips">最多可上传6张图片</span> -->
			</view>
			<view class="task-type" v-if="taskType == '1'">
				<view class="task-type-title">{{repairType.title}}</view>
				<view class="task-btns">
					<button plain class="task-btn" @click="selectClick({key: 'repairType', index})" :class="[item.selected?'active':'']" v-for="(item,index) in repairType.list" :key="index">{{item.name}}</button>
				</view>
			</view>
			<view class="task-type" v-if="taskType == '1' && showArea && nonDecoration">
				<view class="task-type-title">{{repairArea.title}}</view>
				<view class="task-btns">
					<button plain class="task-btn" @click="selectClick({key: 'repairArea', index})" :class="[item.selected?'active':'']" v-for="(item,index) in repairArea.list" :key="index">{{item.name}}</button>
				</view>
			</view>
			<view class="task-type" v-if="taskType == '2'">
				<view class="task-type-title">{{complaintType.title}}</view>
				<view class="task-btns">
					<button plain class="task-btn" @click="selectClick({key: 'complaintType', index})" :class="[item.selected?'active':'']" v-for="(item,index) in complaintType.list" :key="index">{{item.name}}</button>
				</view>
			</view>
			<!-- 服务地址 -->
			<view class="owner-info com-w" @click="selectAddress">
				<view class="left_cont">
					<view v-if="ownerInfo.isEnterpriseHouse == 1">
						<text class="left_cont-label">公司名称</text>
						<text class="left_cont-text">{{ownerInfo.companyName}}</text>
					</view>
					<view>
						<text class="left_cont-label">联系人</text>
						<text class="left_cont-text">{{ownerInfo.name}}</text>
					</view>
					<view>
						<text class="left_cont-label">联系电话</text>
						<text class="left_cont-text">{{ownerInfo.phone}}</text>
					</view>
					<view>
						<text class="left_cont-label">服务地址</text>
						<text class="left_cont-text">{{ownerInfo.add}}</text>
					</view>
				</view>
				<view class="right_cont">
					<image :src="iconArray" class="imgarray" />
				</view>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="operate-btn">
		  <button plain class="btn-box" @click="toMyReportAndRepair">{{taskType=='1'?'我的报事报修':'我的投诉建议'}}</button>

		  <button plain class="btn-box active" @click="submit">提交</button>
 		</view>
		<view class="submit-success" :class="{'success-show': submitSuccess}">
		  <view class="submit-success-cont">
		    <image :src="iconSuccess" mode="widthFix" class="submit-success-img"/>
		    <text class="submit-success-text">提交成功！</text>
		    <button class="btn-box" @click="toIndex">{{isTrApp==1?'确定':'返回首页'}}</button>
		  </view>
		</view>
		<!-- toast提示 -->
		<u-toast ref="uToast"></u-toast>
		<!--  #ifndef MP-WEIXIN -->
		<u-modal :show="nightReportShow" :zoom="false" showCancelButton title='温馨提示' confirmText='继续下单' cancelText="立即拨打" @confirm='goOnReport' @cancel="callNumber" :closeOnClickOverlay="true" @close="closeNight">
				<view class="slot-content">
					<view class="setTxt">{{nightReportTitle}}</view>
				</view>	
		</u-modal>
		<!--  #endif -->
	</view>
</template>

<script>
	import {getAuthCompanyList,findBuildLocation,uploadFileByLocal,fileDownload,fileUpload,grantMemberGrowthIntegral,getSubscribeTemplateGroup,appletLogin} from '@/service/community';
	import {getIsServiceTime,uploadFeedBackOrder} from '@/service/landcrm';
import { saveQuestionTask, getDispatchByLocation } from '@/service/wycrm60'
	import utils from '../../js/utils';
	import {mapGetters, mapMutations } from 'vuex'
	import commLogic from '@/js/comm-logic';

	/** 华船项目，业主端下单报事报修后，提交到自定义工单系统做为待编辑工单 */
	export default {
		options: {
			styleIsolation: 'shared'
		},
		data() {
			return {
				isShowFriload:false,
				taskType:"1",
				submitSuccess:false,
				isTrApp:'',
				memberId:'',
				projectId:'',
				companyId:'',
				projectType:'',
				nightReportShow:false,
				nightReportTitle:'',
				ownerInfo: {
					name: '',
				  phone: '',
				  add: '',
				  companyName: '',
				  concatName: '',
				  isEnterpriseHouse: ''
				},
				userInfo:{},
				repairArea: {
          title: '报修区域',
          list: [
            {
              name: '户内报修',
              selected: true,
              identity: '0'
            },
            {
              name: '公共区域',
              selected: false,
              identity: '1'
            }
          ]
        },
        repairType: {
          title: '报事报修类型',
          list: [
            {
              name: '报事',
              selected: false,
              identity: '618'
            },
            {
              name: '报修',
              selected: true,
              identity: '620'
            },
			// 跟报报事一样，只是界面视角上多了此项
			// {
            //   name: '装修申请',
            //   selected: false,
            //   identity: '618'
            // }
          ]
        },
       complaintType: {
          title: '投诉建议类型',
          list: [
            {
              name: '投诉',
              selected: false,
              identity: '619'
            },
            {
              name: '建议',
              selected: true,
              identity: '622'
            }
          ]
        },
				showArea:true,
				uploadImgList:[],//上传图片列表
				uploadImguuIdList:[],//上传图片uuid列表
				description:"",
				needtip:0,
				hotTel:'',//电话
				canLoadVuexCache:false,
				submitLoading:false,
			};
		},
		components: {},
		computed: {
      ...mapGetters('repair', {
        getRepairsInfo: 'getRepairsInfo',
      }),
			uploadcamera(){
				return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/upload_camera.png`
			},
			iconArray(){
				return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/icon-array.png`
			},
			iconSuccess(){
				return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/icon_success.png`
			},
			iconNight(){
				return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/icon-night.png`
			},
			nonDecoration() {
				const { name } = this.repairType.list.find(item => item.selected) || {}
				return name !== '装修申请'
			}
    },
		onLoad(option) {
			// 报事报修、投诉建议需要授权登录
			const { O_USER_INFO } = this.$constant;
			const { phoneNumber } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
			if(!phoneNumber){
				  //登录
          // #ifdef MP-WEIXIN 
          this.wxMiniLogin();
          // #endif
          // #ifdef H5
          uni.navigateTo({ url: '/pages-a/authorization/bindingMobile'});
          // #endif
			}
			this.taskType = option.taskType;
			if(this.taskType =='1' ){
				uni.setNavigationBarTitle({title:'报事报修'})
			}else{
				uni.setNavigationBarTitle({title:'投诉建议'})
			}     
			
			
			this.clearRepairsInfo(this.getRepairsInfo)
		},
		onShow(){
			if(this.isShowFriload){
				this.isShowFriload = false
				return
			}
			this.initData()
			const repairsInfo = this.getRepairsInfo;
			if (repairsInfo && this.canLoadVuexCache) {
				this.canLoadVuexCache = false
				this.loadVuexCache();
			}
		},
		methods: {
			...mapMutations('repair', [
			  'clearRepairsInfo',
			  'saveRepairsInfo'
			]),  
      // 获取微信授权code
      getWxCode(pvd) {
            return new Promise((resolve) => {
                uni.getProvider({
                    service: 'oauth',
                    success: (provider) => {
                        uni.login({
                            provider: pvd || provider,
                            onlyAuthorize: !!pvd, // 微信登录仅请求授权认证
                            success: (res) => {
                                resolve(res);
                            },
                            fail: (error) => {
                                resolve(error);
                            },
                        });
                    },
                    fail: (error) => {
                        resolve(error);
                    },
                });
            });
        },

      async wxMiniLogin() {
            const { companyId } = commLogic.getProjectConfig();
            const { PROJECT_TYPE } = this.$appConfig;
            const { errMsg: loginMsg, code } = await this.getWxCode().catch(_ => { });
            let params = {
                data: {
                    code: code,
                    appletId: PROJECT_TYPE,
                    companyId: companyId,
                    source: 'wxMini'
                }
            }
            const res = await appletLogin(params)
            if (res.status == '200') {
                let data = {}
                let obj = res.data
                // 有手机号码就是授权过，没有则需要授权
                if (res.data.memberPhone) {
                    data = res.data.appMemberJson ? JSON.parse(res.data.appMemberJson) : {}
                    data.wxUserId = res.data.wxUserId
                } else {
                    data = {
                        companyId: obj.companyId,
                        id: obj.memberId,
                        token: obj.token,
                        wxUserId: obj.wxUserId,
                        nickname: obj.wxUserName
                    }
                }
                const { token, id, wxUserId } = data
                // 有手机号码，设置缓存
                const { TOKEN, MEMBER_ID, O_USER_INFO, WX_USERID } = this.$constant;
                const combineData = {...obj, ...data}
                // 用的是微信小程序登录接口，用mpWeixin方法处理
                const storage = commLogic.setOwerUserInfo('mpWeixin', combineData)
                utils.storageAction({ key: TOKEN, action: 'set', value: token });
                utils.storageAction({ key: MEMBER_ID, action: 'set', value: id });
                utils.storageAction({ key: O_USER_INFO, action: 'set', value: storage });
                utils.storageAction({ key: WX_USERID, action: 'set', value: wxUserId });
                this.initData();
                
            }
        }, 
			async initData(){
				const {PROJECT_CODE,PROJECT_TYPE } = this.$appConfig
				const { MEMBER_ID, PROJECT_ID ,O_USER_INFO, COMPLANY_ID} = this.$constant;

        const { phoneNumber } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
        if(!phoneNumber){
            //未登录
            return;
        }

				this.memberId = utils.storageAction({ key: MEMBER_ID, action: 'get' });
				this.projectId = utils.storageAction({ key: PROJECT_ID, action: 'get' });
				this.userInfo = utils.storageAction({ key: O_USER_INFO, action: 'get' });
				this.companyId = utils.storageAction({ key: COMPLANY_ID, action: 'get' })
				this.projectType = PROJECT_TYPE;
				const repairsInfo = this.getRepairsInfo;
				const newApi = PROJECT_CODE === "DE_HUAN"
				// this.loadAddress()
				// await this.loadAddress().catch(_ => {})
				// this.loadIsServiceTime();
				if (repairsInfo === null) {
				  newApi ? (await this.loadAddressNewApi().catch(_ => {})) : await this.loadAddress().catch(_ => {});
				} else {
				  await this.loadVuexCache();
				}
				this.loadIsServiceTime()
			},
			async loadAddress(){
				const params = {
					data:{
						memberId: this.memberId,
						companyId:this.companyId,
						projectType:this.projectType,
					}
				};			
				// let enterpriseAuthList = await this.getEnterpriseAuthList();
				findBuildLocation(0,params).then(res=>{
					if(res.status == 200){
						let list = res.data && res.data.authBuildings && Array.isArray(res.data.authBuildings) && res.data.authBuildings || [];
						if(list){
							const list1 = list.some(item => item.authType == 1)
							const list2 = list.some(item => item.isEnterpriseHouse == 1)
							console.log(534,list1,list2)
							if(list1 || (list1 &&list2)){
								list =list.filter(item =>{if(item.authType==1) return item})
								list.forEach(item =>{
							          if(item.isEnterpriseHouse == 1){
						              let number=this.userInfo.phoneNumber=="undefined" ? null : this.userInfo.phoneNumber
						              item.regNumber=number
						            }
						            return item
					          	})
								  if(list.length){
							          this.configInformation(list,1)
						          }
							}
							if(list2 && !list1){
								list =list.filter(item =>{if(item.isEnterpriseHouse==1) return item})
								list.forEach(item =>{
							          if(item.isEnterpriseHouse == 1){
						              let number=this.userInfo.phoneNumber=="undefined" ? null : this.userInfo.phoneNumber
						              item.regNumber=number
						            }
						            return item
					          	})
								  console.log(list,"list2------------")
								  if(list.length){
									this.configInformation(list,2)
						          }else{
								    console.log('没有认证地址')
							      }
							}
						}
						// list =list.filter(item =>{if(item.authType==1 || item.isEnterpriseHouse == 1) return item})
						// list.forEach(item =>{
						// 	if(item.isEnterpriseHouse == 1){
						//     let number=this.userInfo.phoneNumber=="undefined" ? null : this.userInfo.phoneNumber
						//     item.regNumber=number
						//   }
						//   return item
						// })    
						// console.log(list,"list------------")
						// if(list.length){
						// 	this.configInformation(list,1)
						// }else{
						// 	if(enterpriseAuthList.length>0){
						// 		this.configInformation(enterpriseAuthList,2)
						// 	}else{
						// 		console.log('没有认证地址')
						// 	}
						// }
					}
				})
			},
			async loadAddressNewApi() {
        const params = {
          memberId: this.memberId,
          companyId:JSON.parse(localStorage.getItem('currProject')).companyId,
          projectType:localStorage.getItem('projectType'),
        };
        // this.$vux.loading.show(); 
        const pms = getMemberAuthHouseList(params)
        return pms.then(res => {
          // this.$vux.loading.hide();
          if (res.status === '200') {
            let list = res.data && res.data.authBuildings && Array.isArray(res.data.authBuildings) && res.data.authBuildings || [];
            list =list.filter(item =>{if(item.authType==1 || item.isEnterpriseHouse == 1) return item})
            list.forEach(item =>{
              if(item.isEnterpriseHouse == 1){
                let owner=localStorage.ownerPhone=="undefined" ? null : localStorage.ownerPhone
                let number=localStorage.phoneNumber=="undefined" ? null : localStorage.phoneNumber
                let contact=localStorage.contactPhone=="undefined" ? null : localStorage.contactPhone

                item.regNumber=owner || number || contact
              }
              return item
            })
            if (list.length) {
              let defaultAdd = null;
              let projectRoom = [];
              list.forEach(item=>{
                 if (item.projectId == localStorage.projectId) {
                  projectRoom.push(item); 
                }
              })
              list.some(item => {
                if (item.projectId == localStorage.projectId) {
                  if(item.isDefault === 1){
                      defaultAdd = item;
                      return true;
                  }
                }
              }); 
              const {regNumber, regName, ownerName, ownerCalls, address, addrId, infoId, projectId, relateId, ownerId,authType, isEnterpriseHouse, companyName, concatName, phoneNumber} = defaultAdd === null ? projectRoom[0] : defaultAdd;
              const isEnterprise = isEnterpriseHouse == 1
              this.ownerInfo = {
                isEnterpriseHouse,
                companyName,
                name: isEnterprise  ? concatName  : ownerName,
                phone: isEnterprise ? phoneNumber : ownerCalls,
                add: address,
                addrId: isEnterprise ? infoId : addrId,
                projectId,
                relateId,
                ownerId,
                authType:authType
              };
            } else {
              this.showNoAuthAlert();
            }
          }
        }).catch(_ => {
          this.$vux.loading.hide()
        })
      },
			//查询认证企业
			getEnterpriseAuthList(){
				let params={
				  data:{
						memberId:this.memberId,
						companyId:this.companyId,
						applyStatus:9  //已通过企业
					}
				}; 
				return new Promise(resolve => {
					getAuthCompanyList(params).then(res =>{
				    if(res.status == "200"){
				      let list=res.data || []
				      resolve(list)
				    }else{
				      resolve([])
				    }
				  })
				})        
			},
			// 配置认证地址参数
			configInformation(list,type){
				let defaultAdd = null;
				let projectRoom = [];
				list.forEach(item=>{
				   if (item.projectId == this.projectId) {
				    //  if(item.i)
				    projectRoom.push(item); 
				  }
				})
				list.some(item => {
				  // if (item.projectId == this.projectId) {
				  //   projectRoom.push(item); 
				  //   if(item.isDefault === 1){
				  //       defaultAdd = item;
				  //       return;
				  //   }
				  // }
					if (item.isDefault === 1){
							defaultAdd = item;
							return;
					}
				}); 
				if(type == 1){
					const {areaId, areaName, projectId, projectName, ownerPhones, regName, address, addrId, relateId, ownerId,authType,ownerName, buildingId} = defaultAdd === null ? (projectRoom[0] || {}) : defaultAdd;
					this.ownerInfo = {
						areaId,
						areaName,
						projectId,
						projectName,
						name: ownerName,
						phone:ownerPhones,
						add: address,
						addrId,
						relateId,
						ownerId,
						authType,
						buildingId,
						dispatchPerson: '',
						dispatchPersonName: '',
					};	              
				}else{
					const {areaId, areaName, projectId, projectName, regNumber, regName, ownerName, ownerCall, address, addrId, infoId, relateId, ownerId,authType, isEnterpriseHouse, companyName, concatName, phoneNumber} = defaultAdd === null ? projectRoom[0] : defaultAdd;
					// const {phoneNumber, employeeName, enterpriseAddress, enterpriseId, projectId, relateId, ownerId,authType} = defaultAdd === null ? projectRoom[0] : defaultAdd;
					// this.ownerInfo = {
					// 	name: employeeName,
					//   phone:phoneNumber,
					//   add: enterpriseAddress,
					//   enterpriseId,
					//   projectId,
					//   relateId,
					//   ownerId,
					//   authType:authType
					// };    
					this.ownerInfo = {
						areaId,
						areaName,
						projectId,
						projectName,
					  companyName,
                      name: concatName  || ownerName,
					  phone:  phoneNumber || ownerCall,
					  addrId:  infoId ||  addrId,
					  add: address,
					  relateId,
					  ownerId,
					  authType:authType,
						dispatchPerson: '',
						dispatchPersonName: '',
						isEnterpriseHouse,
					};  
				}

				this.reqDispatchByLocation()
			},
			// 报修区域、类型
			selectClick(params) {
			  const {key, index} = params || {};
			  const list = this[key].list;
			  list.forEach(item => {
			    item.selected = false
			  });
			  this[key].list[index].selected = true;
			  if(key == 'repairType'){
			      this.typeSign = index;
			      this.showArea =index==0? false:true;
			      if(index == 0){
			        this.repairArea.list.forEach(item=>{
			          item.selected = false;
			        })
			      }else{
			          this.repairArea.list[0].selected = true;
			      }
			     
			  }
			   
			},      
			//获取夜间报事配置
			loadIsServiceTime(){
				let params = {
					data:{
						projectId:this.projectId
					}
        }
				getIsServiceTime(params).then(res =>{
				  if(res.status == 1){
				    this.needtip = res.needtip;
				    this.hotTel = res.hotTel;
				  }
				})
			},
			async uploadImgData(){
				this.isShowFriload = true
				const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['camera', 'readStorage']})
				if (code !== 1 && code !== -2) return
				uni.chooseImage({
				//   count: 1, //默认9
				  count: 1, 
				  sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				  success: async (res) => {
					console.log(683,res)
				    const { tempFilePaths, tempFiles } = res;
				    let filePath = tempFilePaths[0];
				    let fileData = tempFiles[0];
						this.uploadImgList.push({ filePath, fileData })
						console.log(683,this.uploadImgList)
						this.uploadAvatar({ filePath, fileData })
				  },
				});
			},
			previewImg(url){
				uni.previewImage({
				  urls: [url],
				});
			},
			delUploadImg(index){
				this.uploadImgList.splice(index,1)
				this.uploadImguuIdList.splice(index,1)
			},
			// 上传文件
			async uploadAvatar(uploadObj) {
			  const uuid = utils.uuid();
			  const { name, size, path} = uploadObj.fileData
			  const { uniPlatform } = uni.getSystemInfoSync();
			  const mpWeixinApp = uniPlatform === 'mp-weixin' || uniPlatform === 'app'
			  const suffix = () => {
			    const [ suffix ] = typeof path === 'string'  && path.match(/\.[a-z]+$/) || []
			    return suffix
			  }
			  const filename = mpWeixinApp ? `${uuid}${suffix() || '.png'}` : name;
			  await fileUpload({
			    filePath: uploadObj.filePath,
			    name: 'file',
			    header: {
			      fileid: uuid,
			      filename,
			      type: 1,
			      range: 0,
			      source: 's1',
			      totalsize: size,
			      filecreatetime: utils.formatDate({ value: new Date().getTime(), type: 's2d' }),
			    },
			    hideLoading: true,
			  });
				this.uploadImguuIdList.push(uuid)
			  return fileDownload({
			    header: {
			      fileid: uuid,
			      type: 2,
			    },
					hideLoading: true,
			  });
			},
			 // 加载认证地址
      async loadAddressNewApi() {
        const params = {
          memberId: this.memberId,
          companyId:JSON.parse(localStorage.getItem('currProject')).companyId,
          projectType:localStorage.getItem('projectType'),
        };
        // this.$vux.loading.show(); 
        const pms = getMemberAuthHouseList(params)
        return pms.then(res => {
          // this.$vux.loading.hide();
          if (res.status === '200') {
            let list = res.data && res.data.authBuildings && Array.isArray(res.data.authBuildings) && res.data.authBuildings || [];
            list =list.filter(item =>{if(item.authType==1 || item.isEnterpriseHouse == 1) return item})
            list.forEach(item =>{
              if(item.isEnterpriseHouse == 1){
                let owner=localStorage.ownerPhone=="undefined" ? null : localStorage.ownerPhone
                let number=localStorage.phoneNumber=="undefined" ? null : localStorage.phoneNumber
                let contact=localStorage.contactPhone=="undefined" ? null : localStorage.contactPhone

                item.regNumber=owner || number || contact
              }
              return item
            })
            if (list.length) {
              let defaultAdd = null;
              let projectRoom = [];
              list.forEach(item=>{
                 if (item.projectId == localStorage.projectId) {
                  projectRoom.push(item); 
                }
              })
              list.some(item => {
                if (item.projectId == localStorage.projectId) {
                  if(item.isDefault === 1){
                      defaultAdd = item;
                      return true;
                  }
                }
              }); 
              const {regNumber, regName, ownerName, ownerCall, address, addrId, infoId, projectId, relateId, ownerId,authType, isEnterpriseHouse, companyName, concatName, phoneNumber} = defaultAdd === null ? projectRoom[0] : defaultAdd;
              const isEnterprise = isEnterpriseHouse == 1
              this.ownerInfo = {
                isEnterpriseHouse,
                companyName,
                name: isEnterprise  ? concatName  : ownerName,
                phone: isEnterprise ? phoneNumber : ownerCall,
                add: address,
                addrId: isEnterprise ? infoId : addrId,
                projectId,
                relateId,
                ownerId,
                authType:authType
              };
            } else {
              this.showNoAuthAlert();
            }
          }
        }).catch(_ => {
          // this.$vux.loading.hide()
        })
      },
			toMyReportAndRepair(){
        if( this.taskType=== '1'){
					uni.navigateTo({
						url:'/pages-a/customOrder/myReportAndRepair?categories=5,11&taskType=1&title=物业报事报修'
					})
        }else if(this.taskType == '2'){
			console.log(803)
					uni.navigateTo({
						url:'/pages-a/customOrder/myReportAndRepair?categories=6,9&taskType=2&title=物业投诉建议'
					})
        }else{
					uni.navigateTo({
						url:'/pages-a/customOrder/myReportAndRepair'
					})
        }
			},
			goOnReport(){
				this.nightReportShow = false
				this.submitToServer();
			},
			async callNumber(){
				const self = this;
				console.log('用户点击立即拨打');
				const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['callPhone']})
				if (code !== 1 && code !== -2) return
				uni.makePhoneCall({
					phoneNumber:self.hotTel
				})
			},
			closeNight(){
				this.nightReportShow = false
			},
			submit(){
				const desc = this.description;
        if (!desc) {
					this.$refs.uToast.show({ message: '请填写描述信息' });
          return
        }
        if(this.needtip){
					// #ifndef MP-WEIXIN
					this.nightReportTitle = `夜间紧急服务,请拨打${this.hotTel}`
					this.nightReportShow = true
					// #endif
					// #ifdef MP-WEIXIN
          var self = this;
					uni.showModal({
						title: '温馨提示',
						content: `夜间紧急服务,请拨打${self.hotTel}`,
						cancelText:'立即拨打',
						confirmText:'继续下单',
						success: async function (res) {
							if (res.confirm) {
								console.log('用户点击继续下单');
								self.submitToServer();
							} else if (res.cancel) {
								console.log('用户点击立即拨打');
								const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['callPhone']})
								if (code !== 1 && code !== -2) return
								uni.makePhoneCall({
									phoneNumber:self.hotTel
								})
							}
						}
					});
					// #endif
          // this.$vux.confirm.show({
          //   title: "温馨提示",
          //   content: `夜间紧急服务,请拨打${self.hotTel}`,
          //   confirmText: '立即拨打',
          //   cancelText: '继续下单',
          //   onCancel() {
          //     self.submitToServer();
          //   },
          //   onConfirm() {
          //     window.location.href="tel:"+ self.hotTel;
          //   }
          // })
        }else{
          this.submitToServer();
        }
			},
			submitToServer(){
        // const {serverIds,isApp} = this.uploadImgObj;
        // if (serverIds.length && !isApp) {
        //   // this.$vux.loading.show(); 
        //   this.uploadImage();
        // } else {
          this.uploadRepairOrder();
        // }
      },
			// 上传报事报修单
      uploadRepairOrder() {
				if(this.submitLoading){
					return
				}
				this.submitLoading = true

				const typeReport = this.repairType.list.find(item => item.selected) || {}
				const quesParams = {
					data: {
						creator: this.memberId,
						memberId: this.memberId,
						areaId: this.ownerInfo.areaId,
						areaName: this.ownerInfo.areaName,
						projectId: this.ownerInfo.projectId,
						projectName: this.ownerInfo.projectName,
						typeReport: typeReport.identity || '', // 工单类型: 618报事 620报修 619投诉 621表演 622咨询与建议
						contactName: this.ownerInfo.name, // 客户名称
						contactPhone: this.ownerInfo.phone, // 客户联系电话
						ownerId: this.ownerInfo.ownerId || this.ownerInfo.enterpriseId, // 客户id
						ownerName: this.ownerInfo.name, // 客户
						location: this.ownerInfo.add, // 问题位置
						houseinfoId: this.ownerInfo.addrId, // 房间ID
						taskDesc: this.description, // 详细描述
						taskAttachment: this.uploadImguuIdList.join(','), // 附件id
						dispatchPerson: this.ownerInfo.dispatchPerson,
						dispatchPersonName: this.ownerInfo.dispatchPersonName,
					}
				}
				return saveQuestionTask(quesParams).then(res => {
          // this.$vux.loading.hide();
          //const resJson = this._x2js.xml_str2json(res);
          if (res.status == '200') {
            // this.$toast({
            //   message: `提交成功`,
            //   position: 'middle',
            //   duration: 1000
            // });
            this.submitSuccess = true;
            // this.getScoreMethod();
              var json = {
                data:{
									memberId: this.memberId,
									source: 'REPORT_REPAIR',
									calculationMethod: 1,
									condition: 1,
								}
              }
              if(this.taskType =='1'){
                json.data.source = 'REPORT_REPAIR'
              }else{
                json.data.source = 'COMPLAINTS_SUGGESTIONS'
              }
			  
              // grantMemberGrowthIntegral(json);
			  this.getWechatMsgTemplate()
          } else {
						uni.showToast({title:'提交失败',duration:1000,icon: 'none'})
          }
        })
      },

      // 生成UUid
      uuid() {
        const s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
      },
			/*积分规则根据积分获取积分*/
      getScoreMethod(){
        let self=this;
        var json={
          moduleName:"crm",
            memberId:self.memberId,
            orderMoney:0,
            companyId:0
          }
          getScore(json).then(res => {
            if(res.status==200){
          
            }else{
							uni.showToast({title:'积分增加失败',duration:1000,icon: 'none'})
            }
          })  
      },
			// 设置缓存数据
      setVuexCache() {
        const d = {
          ownerInfo: this.ownerInfo,
          repairTypeList: this.repairType.list,
          repairAreaList: this.repairArea.list,
          description: this.description,
          localIds: this.uploadImgList,
          //localIds: [require('@/assets/images/repair/camera_video.png'), require('@/assets/images/repair/repair-success.png')],
          // serverIds: this.uploadImgObj.serverIds
        };
				console.log(d,'d')
        this.saveRepairsInfo(JSON.parse(JSON.stringify(d)));
      },
      // 获取缓存数据
      loadVuexCache() {
        const {ownerInfo, repairTypeList, repairAreaList, description, localIds, serverIds} = this.getRepairsInfo;
        this.ownerInfo = ownerInfo;
        this.repairType.list = repairTypeList;
        this.repairArea.list = repairAreaList;
        this.description = description;
        this.uploadImgObj = localIds;
        // this.uploadImgObj.serverIds = serverIds;

        // this.$nextTick(_=>{
        //   const d = {localIds};
        //   if (this.$refs.chooseImage) this.$refs.chooseImage.updateImages(JSON.parse(JSON.stringify(d)));
        // })

				this.reqDispatchByLocation()
      },
      // 选择其他认证地址
      selectAddress() {
        this.setVuexCache();
        // this.$router.push({path: '/MyHouseAuth', query: {type: 'reportingRorRepairs'}});
				this.canLoadVuexCache = true
				uni.navigateTo({
					url:'/pages-b/house-info/auth-address-list?page=reportingRorRepairs&taskType=2'
				})
      },
      // 返回首页
      toIndex() {  
        this.submitSuccess = false;
				this.submitLoading = false
        if(this.isTrApp && this.isTrApp==1){ 
             this.description = "";
            this.uploadImgObj= {
              maxNum: 6,
              localIds: [],
              serverIds: [],
              isApp:false
            };
            this.orderId = null;
          this.$refs.chooseImage.initChooseImage();
       
        }else{ 
			this.description = "";
			this.clearRepairsInfo(this.getRepairsInfo)
         // this.$router.push({path: '/indexNew'});
				 uni.switchTab({url:'/pages/index/index'})
        } 
      },
	  getWechatMsgTemplate(){ 
		let that = this;
		let tparams = {
				data: {
					tokenId: that.projectType,//小程序ID
					bizType: 'gd',//模板类别  模板组需要后台在tbw_template_group_config表配置,根据配置表中的模板类别获取模板组
				},
				hideLoading: true,
				responseToast: false
			}
			getSubscribeTemplateGroup(tparams).then(res => {
				if(res.status  == 200){
					let code = res.data.map(m=>{
						return m.modelCode
					})
					console.log('模板',code);
 						// #ifdef MP-WEIXIN
						uni.requestSubscribeMessage({
							tmplIds: code,
							success(succ) {

							},
							fail(err) {
								console.log('消息订阅错误信息', err);
							},
							complete() {
								// that.toIndex()
							}
						})
						// #endif
  						 
				}else{
					that.submitSuccess = true;
				}
			 
			})
	  },
		/**
     * 只有客户工单才需要判断；
     * 如果选择工单类型，则取字典表里配置的相关人员带出；
     * 如果选择楼栋，则取字典表里配置的楼栋相关人员带出；
     * 最后才选择项目，则取字典表里配置的相关人员带出；
     */
    async reqDispatchByLocation() {
			const { companyId } = commLogic.getProjectConfig();
			const typeReport = this.repairType.list.find(item => item.selected) || {};
      const params = {
        data: {
					companyId,
					typeId: typeReport.identity || '',
					buildingId: this.ownerInfo.buildingId,
					projectId: this.ownerInfo.projectId,
				}
      }
      const res = await getDispatchByLocation(params)

      const data = res.data || {}
      this.ownerInfo.dispatchPerson = data.pdUserId // 派单人
      this.ownerInfo.dispatchPersonName = data.pdUserName
    },
		},
	};
</script>
