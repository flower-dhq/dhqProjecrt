<style lang="scss" scoped>

  .vehicle-container{
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
		background: #F5F5F5;
    .qrcode-main{
      background: #fff;
      margin: 80rpx 40rpx 0 40rpx;
      padding: 60rpx 20rpx;
      // width: 650rpx;
      border-radius: 20rpx;
      text-align: center;
      .qrcode-title{
        font-size: 48rpx;
        font-weight: bold;
        color: #000000;
        margin-bottom: 20rpx;
      }
      .line{
        width: 80rpx;
        height: 6rpx;
        background: #EEEEEE;
        opacity: 1;
        margin-bottom: 40rpx;
        display: inline-block;
      }
      .qrcode-box {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 40rpx;
        width: 100%;
        // height: 4rem;
        position: relative;
        overflow: hidden;
				.qrcode-box-color-line{
					width: 520rpx;
					height: 520rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 15rpx;
					background: linear-gradient(135deg,rgb(1, 255, 234),rgb(255, 251, 14),rgb(0, 238, 255));
					animation: color 3s linear infinite;
					position: relative;
					.qrcode-dev{
						width: 500rpx;
						height: 500rpx;
						background-color: #fff;
						position: absolute;
						left:10rpx;
						top: 10rpx;
					}
				}
				.qrcode{
				  width: 500rpx;
				  height: 500rpx;
				  position: absolute;
				  left: 50%;
				  top: 50%;
				  transform: translate(-50%,-50%);
					// position: relative;
				}
      }
      .useful_date{
        font-family: 'Times New Roman';
        margin-top: 10rpx;
      }
    }
  }
	@keyframes color{
	  to{
	    filter: hue-rotate(360deg);
	  }
	}
	.line-box{
		display:block;
		width: 560rpx;
		height: 1px;
		margin: auto;
	}
	.newColor{
		color: #A3C6FD;
	}
	.passTip{
		color: #D0CACC;
		font-size: 26rpx;
	}
	.all-icon-list{
		width: 100%;
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		.menu-grid{
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 25%;
			.menu-icon {
			    height: 60rpx;
			    width: 60rpx;
			    background-repeat: no-repeat;
			    background-size: 60rpx;
			    margin: auto;
			}
			.menu-title {
			    font-size: 24rpx;
			    color: #333333;
			    margin-top: 10rpx;
			}
		}
	}
</style>

<template>
  <view class="vehicle-container">
    <!-- <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack"/> -->
    <view class="qrcode-main">
      <view class="qrcode-title">码上通行</view>
      <view class="line"></view>
      <view class="qrcode-box">
        <view class="qrcode-box-color-line">
					<view class="qrcode-dev"></view>
				</view>
				<image class="qrcode" :src="QrCodeUrl" v-show="QrCodeUrl"></image>
      </view>
			<view class="all-icon-list">
				<view class="menu-grid" v-for="(item, index) in menuList" :key="index" @click="menuJump(item)">
				    <image class="menu-icon" :src="require(`@/static/${[THEME_NAME]}/menu/${item.icon}.png`)"></image>
				    <view class="menu-title">{{item.configName}}</view>
				</view>
			</view>
      <image :src="dottedLine" style="margin-bottom:10px" class="line-box"></image>
      <view class="passTip" @click="callPhone">请出入闸机门禁时亮码扫码<br/>如有疑问请联系：{{telephone}}</view>
      <!-- <view class="useful_date"><text class="newColor" @click="callPhone">{{telephone}}</text></view> -->
      <!-- <view class="useful_date">有效使用：{{date}}</view> -->
    </view>
  </view>
</template>

<script>
  // import QRCode from 'qrcodejs2';
  import {BindGenerateCode,getConvenienceTel} from "@/service/wxmanage.js";
  // import axios from 'axios'
	import Utils from '@/js/utils'
  // import '../../../static/encry.min.js'; //接口加密工具
  // import {Toast} from 'vant';
  // import moment from 'moment';
  export default {
    name: 'QRCodeOpen',
    data() {
			const { MEMBER_ID, PROJECT_ID, COMPLANY_ID, AREA_ID } = this.$constant
      return {
				projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
				areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
        QrCodeUrl: '',
        iotIds: [],
        date:'',
        currProject: {},
        accessList: [], // 门禁列表
				domain:"",
				contactPhone:"",
				companyId:"",
				telephone:"",
				menuList:[
					{"configName":"产业政策","detailCode":"zhengce","icon":"icon-zc","service":"3","url":"https://tg1.chacewang.com/api/home/Guest?act=tgn&name=next"},
					{"configName":"产业智库","detailCode":"zhihuiya","icon":"icon-ctdt","service":"3","url":"","appId":"wx4ddc482d33513336","originalId":"gh_5ad1db8d8a85"},
					{"configName":"产业商机","detailCode":"duijie","icon":"icon-cysj","service":"3","url":"","appId":"wxb131b2ad90150d6d","originalId":"gh_0a07d4e6cd35"},
					{"configName":"产业Link","detailCode":"link","icon":"icon-cyLink","service":"3","url":"/pages/expo/expo","appId":"wx6faf6cc1e8b83bc7","originalId":"gh_b76a9caa50df"},
				]
      }
    },
		computed:{
			dottedLine(){
				return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/dotted-line.png`
			}
		},
    onReady() {
      // this.getList()
			const { O_USER_INFO, USER_TYPE, USER_TYPE_NUM,COMPLANY_ID } = this.$constant
			const { DOMAIN_PRO } = this.$appConfig
			console.log(this.$appConfig,'this.$appConfig')
			console.log(this.$constant,'this.$constant')
			let data = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
			this.contactPhone = data.ownerPhone || data.phoneNumber || data.contactPhone || '' 
			this.userTypesNum = Utils.storageAction({ key: USER_TYPE_NUM, action: 'get' })
			this.companyId = Utils.storageAction({ key: COMPLANY_ID, action: 'get' })
			this.domain = DOMAIN_PRO
			console.log(this.contactPhone,this.userTypesNum,"this.contactPhone")
      this.newGetQrcode()
			this.getConvenienceTel()
    },
    methods: {
			// 跳转第三方小程序方法
			jumpMini(item){
			    // #ifdef MP-WEIXIN
			    uni.navigateToMiniProgram({
			        appId:item.appId,// 第三方小程序appid
			        path:item.url,// 
			        envVersion:"release",
			        success: res => {
			            // 打开成功
			            console.log("打开成功", res);
			        },
			        fail: err => {
			            console.log(err);
			        }
			    })
			    // #endif
			
			    // #ifdef APP-PLUS
			    plus.share.getServices((res) => {
			    let weixin = res.find(i => i.id === 'weixin');
			        if (weixin) {
			            weixin.launchMiniProgram({
			                id: item.originalId,
			                path: item.url,
			                type: 0
			            }, (res) => {
			
			            }, (err) => {
			
			            });
			        }
			    }, (err) => {
			        console.log("获取分享服务列表失败： " + JSON.stringify(e));
			    });
			    // #endif
			},
			
			menuJump(item) {
			    const { USER_TYPE, IS_ASSOCIATION } = this.$constant;
			    const userType = Utils.storageAction({ key: USER_TYPE, action: 'get' });
			    let isAssociation = Utils.storageAction({ key: IS_ASSOCIATION, action: 'get' });
			
			    if(!this.phoneNumber && item.auth=='1'){
			        uni.navigateTo({ url:'/pages-a/authorization/bindingMobile' });
			        return
			    }
			
			    //跳转第三方小程序
			    if(item.appId){
			        this.jumpMini(item)
			        return
			    }
			
			    if (isAssociation=='0' && item.registered) {
			        this.$refs.customModal.show({
			            title: '提示',
			            content: '您还未认证，请先去认证',
			            showConfirmButton: true,
			            showCancelButton: true,
			            confirmText: "去认证",
			            cancelText: '取消',
			            onConfirm: () => {
			                uni.navigateTo({url:'/pages-b/house-info/add-house-address'})
			            }
			        })
			        return;
			    }
			    // if (!phoneNumber) {
			    //     this.$refs.rzModal.showModal({ content: '您还未绑定手机号，请绑定手机号码！', path: '/pages-a/authorization/login' });
			    //     return;
			    // }
			    // if (userType == '游客') {
			    //     this.$refs.rzModal.showModal({ modalType: 'rz' });
			    //     return;
			    // }
			    if (!item.page && !item.url) {
			        this.$refs.customModal.show({
			            title: '提示',
			            content: '此功能暂未开放，敬请期待~',
			            showConfirmButton: true,
			            confirmText: "好的",
			        })
			        return;
			    }
			
			    if (item.isTabbar) {
			        uni.switchTab({ url: item.page })
			    } else {
			        if (item.url) {
			            uni.navigateTo({
			                url: `/pages-d/webview/webview?url=${encodeURIComponent(item.url)}&code=${item.detailCode}`
			            })
			        } else {
			            item.configName && savePageTitle({ title: item.configName })
			            uni.navigateTo({ url: item.page });
			        }
			    }
			},
      //  返回
      goBack() {
        this.$router.go(-1);
      },
			// 获取客服信息
    async getConvenienceTel() {
      const params = {
        data: {
          file: null,
          pageSize: 1000,
          pageNum: 1,
          areaId: this.areaId,
          projectId: this.projectId,
        }
      }
      const res = await getConvenienceTel(params)
			if(res.status == '200'){
				this.telephone = res.data.records.length>0?res.data.records[res.data.records.length-1].fixedPhone:''
			}
      
    },
    // 拨打客服电话
    callPhone() {
      // 唤起手机打电话功能
      uni.makePhoneCall({
        phoneNumber: this.telephone,
        success: res => {
          this.isShow = false
        },
        fail: res => {
          console.log('拨打失败!')
        }
      })
    },
      // 获取门禁列表
      // getList() {
      //   getAccessList({
      //     userId: localStorage.ownerId,
      //     pageNo: 1,
      //     pageSize: 1000,
      //     productCode: '603020',
      //     projectId: this.currProject.projectId
      //   }).then(res => {
      //     if (res.status == 200 && res.data && res.data.data && res.data.data.length) {
      //       this.accessList = Object.freeze(res.data.data || [])
      //       this.iotIds = res.data.data.map(v=>{
      //         return v.iotId
      //       })
      //       this.getQrCode()
      //     } else {
      //       Toast.fail('未获取到门禁列表')
      //     }
      //   })
      // },
      newGetQrcode(){
				const params = {
					data: {
						phoneNumber:this.contactPhone,
						type:'0'
					},
					header: {
						'content-type': 'application/json;charset=UTF-8',
						// 'token':"8579a9f36176f60485993c4c6838e1b5",
						'sign':"e52dae6590d8f20bb448684deda6a705",
						'companyId':this.companyId
					},
					hideLoading: false
				}
				BindGenerateCode(params).then(res=>{
					console.log(res.data);
					const base64 = uni.arrayBufferToBase64(res.data)
					let img = 'data:image/png;base64,'+base64
					this.QrCodeUrl = img
					setTimeout(()=>{
						this.newGetQrcode()
					},180000)
				})
      },
      blobToBase64(blob, callback) { //blob转base64
          let reader = new FileReader();
          reader.onload = function (e) { callback(e.target.result); }
          reader.readAsDataURL(blob);
      },
      getQrCode() {
        scanCodeOpenDoor({
          userId: localStorage.ownerId,
          iotIds: this.iotIds,
          rootSpaceId: this.accessList[0].projectId || ''
        }).then(res => {
          if (res.status == 200) {
            this.QrCodeUrl = res.data.EntranceGuardQrCode
            let right_date = res.data.PlanVisitTime
            let start_time = right_date.substr(0,16)
			      let end_time = right_date.slice(22,-3)
            this.date = `${start_time} - ${end_time}`
            this.creatQrCode()
          }
        })
      },
      creatQrCode() {
        new QRCode(this.$refs.qrCode, {
          text: this.QrCodeUrl, // 需要转换为二维码的内容
          width: 200,
          height: 200,
          colorDark: '#000000',//二维码颜色
          colorLight: '#ffffff',//二维码背景色
          correctLevel: QRCode.CorrectLevel.H //容错率，L/M/H
        })
      }
    }
  }
</script>
