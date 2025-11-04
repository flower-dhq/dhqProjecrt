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
      padding: 60rpx 0;
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
					width: 260px;
					height: 260px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 15rpx;
					// background: linear-gradient(135deg,rgb(1, 255, 234),rgb(255, 251, 14),rgb(0, 238, 255));
					// animation: color 3s linear infinite;
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
    <view class="qrcode-main">
      <view class="qrcode-title">二维码</view>
      <view class="line"></view>
      <view class="qrcode-box">
        <view class="qrcode-box-color-line">
          <canvas canvas-id="qrcodeCanvas" style="width:250px;height:250px"/>
					<!-- <view class="qrcode-dev"></view> -->
				</view>
				<image class="qrcode" :src="QrCodeUrl" v-show="QrCodeUrl"></image>
      </view>
      <image :src="dottedLine" style="margin-bottom:10px" class="line-box"></image>
    </view>
  </view>
</template>

<script>
  import UQRCode from 'uqrcodejs';
  import {getCustomerQRCode} from "@/service/community.js";
	import Utils from '@/js/utils'
  // import '../../../static/encry.min.js'; //接口加密工具
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
				menuList:[],
        memberId:'',
        customerQRCodeTxt:''//需要转换的二维码内容
      }
    },
		computed:{
			dottedLine(){
				return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/dotted-line.png`
			}
		},
    onReady() {
      // this.getList()
			const { O_USER_INFO, USER_TYPE, USER_TYPE_NUM,COMPLANY_ID,MEMBER_ID } = this.$constant
			const { DOMAIN_PRO } = this.$appConfig
      this.memberId = Utils.storageAction({ key: MEMBER_ID, action: 'get' });
			let data = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
			this.contactPhone = data.ownerPhone || data.phoneNumber || data.contactPhone || '' 
			this.userTypesNum = Utils.storageAction({ key: USER_TYPE_NUM, action: 'get' })
			this.companyId = Utils.storageAction({ key: COMPLANY_ID, action: 'get' })
			this.domain = DOMAIN_PRO
      this.newGetQrcode()
			this.getConvenienceTel()
    },
    methods: {
      //  返回
      goBack() {
        this.$router.go(-1);
      },
      newGetQrcode(){
				const params = {
					data: {
						memberId:this.memberId,
					},
					hideLoading: false
				}
				getCustomerQRCode(params).then(res=>{
          if(res.status=="200"){
            console.log(res.data,'res.data=======');
            this.customerQRCodeTxt = res.data
            // 获取uQRCode实例
            var qr = new UQRCode();
            // 设置二维码内容
            qr.data = this.customerQRCodeTxt;
            // 设置二维码大小，必须与canvas设置的宽高一致
            qr.size = 250;
            // 调用制作二维码方法
            qr.make();
            // 获取canvas上下文
            var canvasContext = uni.createCanvasContext('qrcodeCanvas', this); // 如果是组件，this必须传入
            // 设置uQRCode实例的canvas上下文
            qr.canvasContext = canvasContext;
            // 调用绘制方法将二维码图案绘制到canvas上
            qr.drawCanvas();
            // this.creatQrCode()
            return
            const base64 = uni.arrayBufferToBase64(res.data)
            let img = 'data:image/png;base64,'+base64
            this.QrCodeUrl = img
            setTimeout(()=>{
              this.newGetQrcode()
            },180000)
          }else{
							uni.showToast({title:'请先认证或重新上传人脸信息，谢谢！！',duration:1000,icon: 'none',})
          }
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
        QRCode.make({
        canvasId: 'qrcodeCanvas',
        text: this.customerQRCodeTxt,
        size: 200,
        margin: 10,
        success: res => console.log('生成成功')
      })
        // new QRCode(this.$refs.qrCode, {
        //   text: this.customerQRCodeTxt, // 需要转换为二维码的内容
        //   width: 200,
        //   height: 200,
        //   colorDark: '#000000',//二维码颜色
        //   colorLight: '#ffffff',//二维码背景色
        //   correctLevel: QRCode.CorrectLevel.H //容错率，L/M/H
        // })
      }
    }
  }
</script>
