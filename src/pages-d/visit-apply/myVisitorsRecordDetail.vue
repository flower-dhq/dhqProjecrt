<style scoped lang="scss">
.myVisitorsRecordDetail{
	width: 100%;
	min-height: 100%;
	background: #F5F5F5;
}
.release-results {
  padding: 0 40rpx;
  width: 100%;
	position: relative;
	box-sizing: border-box;
  .results-type {
		margin: 20rpx 0;
    .type-title {
      font-size: 56rpx;
      color: #ffffff;
    }
    .type-subtitle {
      font-size: 30rpx;
      color: #ffffff;
    }
  }
  .results-qrCodes {
    margin: 20rpx 0;
    height: 516rpx;
    width: 670rpx;
    border-radius: 20rpx;
    background: #ffffff;
		.results-qrCodes-box{
			padding: 56rpx;
			@include flx-dsp($jsc: center, $ali: center);
		}
  }
}
.results-info {
  margin-bottom: 80rpx;
	.van-cell-group{
		background-color: #fff;
		.van-cell{
			position: relative;
			display: flex;
			box-sizing: border-box;
			width: 100%;
			padding: 20rpx 32rpx;
			overflow: hidden;
			color: #323233;
			font-size: 28rpx;
			line-height: 48rpx;
			background-color: #fff;
			.van-cell-left{
				flex: 1;
			}
			.van-cell-right{
				width: 75%;
				color: #969799;
				text-align: left;
				vertical-align: middle;
				word-wrap: break-word;
			}
		}
	}
}
.cellValue {
  text-align: left;
  min-width: 75%;
}
.showImg {
  width: 140rpx;
  height: 140rpx;
  display: inline-block;
  padding: 10rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
.celltitle1 ::v-deep .van-field__control {
  color: #969799;
}

.btn-group {
  position: fixed;
  bottom: 0;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  width: 100%;
  color: whitesmoke;
  display: flex;

  .share-btn {
    background-color: var(--app-primary-color);
    width: 100%;
    flex: 2;
  }
  .cancel-btn {
    background-color: #AEAEAE;
    // width: 30%;
    width: 100%;
    flex: 1;
  }
	.pass-btn{
		flex: 1;
	}
}

.scroller-body {
  width: 100%;
  min-height: calc(100vh - 80rpx);
  overflow: hidden;
}

.share-tips {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.66);
  top: 0;
  left: 0;
  z-index: 105;

  image {
    width: 70%;
    position: absolute;
    right: 0;
  }

}

::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: #F5F5F5;
}

.head_title{
  font-weight: bold;
}
.qr_box_l{
   margin: 20rpx;
   background-color: #FFFFFF;
    padding-bottom: 20rpx;
}
.qr_box{
   position: relative;
}
.myVisitorsRecordDetail_headImg{
  color: #FFFFFF;
  width: 100%;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  // padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

}
.indexBg{
	width: 100%;
	position: absolute;
	left: 0;
	top: 0;
}
.qrcode-box{
	width: 450rpx;
	height: 450rpx;
	// position: relative;
}
.qrcode{
		width: 450rpx;
		height: 450rpx;
		position: absolute;
		left: 50%;
		top: 53%;
		transform: translate(-50%,-50%);
	}			
		.setTitle{
			position: relative;
			z-index: 1;
		}
</style>

<template>
  <view class="myVisitorsRecordDetail" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
      <view  height="calc(100vh - 40px)">
      <view   class="scroller-body">
        <image class="indexBg" :src="indexBg" mode="widthFix"></image>
         <view class="release-results">
          <view class="results-type">
            <text class="type-title" v-if="recordInfo.recordStatus == 1">待拜访</text>
            <text class="type-title" v-if="recordInfo.recordStatus == 2">已拜访</text>
            <text class="type-subtitle" v-if="recordInfo.recordStatus == 0">待审核</text>
            <text class="type-subtitle" v-if="recordInfo.recordStatus == 1">已审核</text>
            <text class="type-subtitle" v-if="recordInfo.recordStatus == 2">已完成</text>
            <text class="type-subtitle" v-if="recordInfo.recordStatus == 3">已拒绝</text>
            <text class="type-subtitle" v-if="recordInfo.recordStatus == 4">已取消</text>
            <text class="type-subtitle" v-if="recordInfo.recordStatus == 5">已过期</text>
          </view>
          <view class="results-qrCodes" v-if="recordInfo.recordStatus != 3 && recordInfo.recordStatus != 4">
            <!-- <qrcode
              style="padding: 28px; text-align: center;"
              :value="recordInfo.recordId + '@WPFX'"
            ></qrcode> -->
						<view class="results-qrCodes-box" v-if="false">
							<!-- #ifndef MP-WEIXIN || APP-NVUE -->
							<canvas id="qrcode" canvas-id="qrcode" :style="{ width: `${size}px`, height: `${size}px` }"></canvas>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN -->
							<canvas id="qrcode" canvas-id="qrcode" type="2d" :style="{ width: `${size}px`, height: `${size}px` }"></canvas>
							<image :src="setMask" style="width: 160px;height: 160px;" v-if="isShowTips"></image>
							<!-- #endif -->
							<!-- <canvas id="qrcode" canvas-id="qrcode" :style="{ width: `${size}px`, height: `${size}px` }"></canvas> -->
							<!-- <view style="width: 320rpx;height: 320rpx;background-color: red;">{{recordInfo.recordId + '@WPFX'}}</view> -->
						</view>
						<view class="qrcode-box">
							<image  class="qrcode" :src="QrCodeUrl"  v-show="QrCodeUrl"></image>
						</view>
            <view style=" text-align: center;" class="setTitle">
              <!-- <text>门岗放行时，请出示此二维码和身份证</text> -->
              <text v-if="recordInfo.sweepType == 1">放行方式：道闸扫码</text>
              <text v-if="recordInfo.sweepType == 2">放行方式：星光门禁扫码</text>
            </view>
          </view>
        </view>
        <view class="results-info">
					<view class="van-cell-group">
						<view class="van-cell" style="font-weight: bold;">信息详情</view>
						<!-- visitType 1: 企业 2：住宅 -->
						<view class="van-cell" v-if="recordInfo.toVisitCompanyName && recordInfo.visitType === 1">
							<view class="van-cell-left">企业名称</view>
							<text class="van-cell-right">{{recordInfo.toVisitCompanyName}}</text>
						</view>
						<view class="van-cell" v-if="recordInfo.toVisitCompanyAddr">
							<view class="van-cell-left">企业地址</view>
							<text class="van-cell-right">{{recordInfo.toVisitCompanyAddr}}</text>
						</view>
						<view class="van-cell">
							<view class="van-cell-left">被访人员</view>
							<text class="van-cell-right">{{recordInfo.toVisitPersonName}}</text>
						</view>
						<view class="van-cell">
							<view class="van-cell-left">访问时间</view>
							<text class="van-cell-right">{{recordInfo.planVisitTime | getDataTime}}</text>
						</view>
						<!-- <view class="van-cell">
							<view class="van-cell-left">可用次数</view>
							<text class="van-cell-right">{{recordInfo.visitableNum}}</text>
						</view> -->
						<view class="van-cell">
							<view class="van-cell-left">拜访事由</view>
							<text class="van-cell-right">{{recordInfo.configDetailName}}</text>
						</view>
						<view class="van-cell">
							<view class="van-cell-left">访客信息</view>
							<text class="van-cell-right" v-if="recordInfo.visitPersonName">{{recordInfo.visitPersonName +''+ recordInfo.visitPersonPhone}}</text>
						</view>
					</view>
        </view>
      </view>
    </view>

    <view class="btn-group" v-if="!isVistors">
			<!-- #ifdef MP-WEIXIN -->
				<view class="share-btn" @click="showTip">分享</view>
			<!-- #endif -->
      <view class="cancel-btn" v-if="recordInfo.recordStatus == 1" @click="showModel(4)">取消</view>
      <view class="cancel-btn" v-if="recordInfo.recordStatus === 0 && showAudit" @click="showModel(3)">拒绝</view>
      <view class="share-btn pass-btn" v-if="recordInfo.recordStatus === 0 && showAudit" @click="showModel(1)">通过</view>
    </view>

    <view class="share-tips" v-if="isShowTips">
      <image :src="clickshare" style="top: 0" mode="widthFix"></image>
      <image :src="iknow" style="bottom: 30%" mode="widthFix" @click="hideTips"></image>
    </view>
		
		<u-modal :show="modalShow" showCancelButton asyncClose @confirm="handleVisitRecord" @cancel="closeModal">
			<view class="slot-content">
				<text style="margin: 0 auto;">{{modalContent}}</text>
			</view>				
		</u-modal>
  </view>
</template>

<script>
import Utils from '@/js/utils'
import { getVisitRecordDetailList, auditVisitApproval ,BindGenerateCode} from '@/service/wxmanage.js';
import UQRCode from 'uqrcodejs'
export default {
  name: "myVisitorsRecordDetail",
  data() {
		const { MEMBER_ID, AREA_ID, PROJECT_ID, COMPLANY_ID, PROJECT_TYPE ,USER_TYPE } = this.$constant
    return {
			modalShow:false,
			modalContent:'是否确认取消？',
      recordId: "",
      recordInfo:{},
      isShowTips: false,
      userTypesNum: '',  // 当前身份  4:企业联系人  6：企业员工  其他：访客(会员或游客)
      contactPhone: '',
      isVistors: false,          // 访客通过分享链接进入页面的标识
			size:160,
			qr:null,
			memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
			recordStatus:4,
			showAudit:false,
			companyId:'',
			QrCodeUrl:''
    };
  },
	filters: {
    getDataTime(val) {
      // return formatDateTimeOfYMD(val)
      return uni.$u.timeFormat(val)
    }
  },
	computed:{
		indexBg(){
			return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/index/index_bg.png`
		},
		iconBg(){
			return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/icon-bg.png`
		},
		clickshare(){
			return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/clickshare.png`
		},
		iknow(){
			return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/iknow.png`
		},
		setMask(){
			return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/setMask.png`
		},
	},
	onLoad(options){
		const { O_USER_INFO, USER_TYPE, USER_TYPE_NUM,COMPLANY_ID } = this.$constant
		let data = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
		this.userInfo = data || {}
		this.contactPhone = data.ownerPhone || data.phoneNumber || data.contactPhone || ''
		this.userTypesNum = Utils.storageAction({ key: USER_TYPE_NUM, action: 'get' })
		this.companyId = Utils.storageAction({ key: COMPLANY_ID, action: 'get' })
		this.recordId = options.recordId;
		this.isVistors = options.isVistors ? true : false;  // 访客通过分享链接进入页面的标识
		this.showAudit = options.BtnStatus == '1'?true:false
		this.reqVisitRecordDetailList()
		// this.setWxShare()
	},
	onReady(){
		// 获取uQRCode实例
		 //  var qr = new UQRCode();
			// // this.qr = qr
		 //  // 设置二维码内容
		 //  // qr.data = "https://uqrcode.cn/doc";
		 //  qr.data = "666";
		 //  // 设置二维码大小，必须与canvas设置的宽高一致
		 //  qr.size = 160;
		 //  // 调用制作二维码方法
		 //  qr.make();
		 //  // 获取canvas上下文
		 //  var canvasContext = uni.createCanvasContext('qrcode', this); // 如果是组件，this必须传入
		 //  // 设置uQRCode实例的canvas上下文
		 //  qr.canvasContext = canvasContext;
		 //  // 调用绘制方法将二维码图案绘制到canvas上
		 //  qr.drawCanvas();
		 this.newGetQrcode()
	},
  methods: {
		newGetQrcode(){
			 let data = {
					userId:this.recordId,
					type:'2'
				}
			const params = {
				data: data,
				header: {
					'content-type': 'application/json;charset=UTF-8',
					// 'token':"8579a9f36176f60485993c4c6838e1b5",
					// 'sign':commLogic.createMd5Key(data),
					'companyId':this.companyId
				},
				hideLoading: false,
				responseToast: false
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
		closeModal(){
			this.modalShow = false
		},
		showModel(index){
			this.recordStatus = index
			this.modalContent = index == 1?'是否确认通过？':index == 3?'是否确认拒绝？':'是否确认取消？'
			this.modalShow = true
		},
    formatDate(dateTime) {
      return moment(dateTime).format("YYYY-MM-DD");
    },
		showTip(){
			this.size = 0
			this.isShowTips = true
		},
		hideTips(){
			this.size = 160
			this.isShowTips = false
		},
		// 绘制二维码
		async creadQrcode(){
			// 获取uQRCode实例
			  var qr = new UQRCode();
				// this.qr = qr
			  // 设置二维码内容
			  // qr.data = "https://uqrcode.cn/doc";
			  qr.data = this.recordInfo.recordId + '@WPFX';
			  // 设置二维码大小，必须与canvas设置的宽高一致
			  qr.size = this.size;
			  // 调用制作二维码方法
			  qr.make();
				/* 获取canvas上下文 */
				// #ifndef MP-WEIXIN || APP-NVUE
				/* uniapp获取canvas上下文方式 */
				const canvasContext = uni.createCanvasContext('qrcode');
				// #endif
				// #ifdef MP-WEIXIN
				/* 微信小程序获取canvas上下文方式 */
				const canvas = await new Promise(resolve => {
				  uni
				    .createSelectorQuery()
				    .select(`#qrcode`)
				    .fields({
				      node: true,
				      size: true
				    })
				    .exec(res => {
				      resolve(res[0].node);
				    });
				});
				const canvasContext = canvas.getContext('2d');
				const dpr = uni.getSystemInfoSync().pixelRatio;
				canvas.width = this.size * dpr;
				canvas.height = this.size * dpr;
				canvasContext.scale(dpr, dpr);
				// #endif
			  /* 设置uQRCode实例的canvas上下文 */
			  qr.canvasContext = canvasContext;
			  /* 调用绘制方法将二维码图案绘制到canvas上 */
			  qr.drawCanvas();
		},
    reqVisitRecordDetailList(){
      let data = {
				data:{
					recordId: this.recordId
				}
			}
      getVisitRecordDetailList(data).then(res => {
        if(res.status == 200) {
          // console.log("获取的结果--------",res.data);
          this.recordInfo = res.data
					// this.creadQrcode()
          this.recordInfo.recordStatusText = ""
          switch (res.data.recordStatus) {
            case 0:
               this.recordInfo.recordStatusText ='待审核'
              break;
            case 1:
               this.recordInfo.recordStatusText ='待拜访'
              break;
            case 2:
               this.recordInfo.recordStatusText ='已拜访'
              break;
            case 3:
               this.recordInfo.recordStatusText ='已拒绝'
              break;
            case 4:
               this.recordInfo.recordStatusText ='已取消'
              break;
            case 5:
               this.recordInfo.recordStatusText ='已过期'
              break;
            default:
              break;
          }
          console.log("记录列表------------",this.recordInfo);
        }
      })
    },
    handleVisitRecord(){
      let data = {
        recordId: this.recordId,                   // 访客邀请记录id
        recordStatus: this.recordStatus,                 // 审核通过：1，审核不通过：3，取消：4
        operator: this.memberId,      // 操作者id
        // toVisitPersonPhone:'',                 // 企业员工电话（仅企业员工操作时传）
        // toVisitCompanyContactPhone:'',        // 企业联系人电话（仅企业员工操作时传）
        // visitPersonPhone:'',                  // 访客电话（仅访客操作时传）
        // operateType:'',              //  操作类型，PC端：0，访客：1，被访人人：2，企业联系人：3
      }
      switch (this.userTypesNum.toString()) {
        case '4':
          data.toVisitCompanyContactPhone = this.contactPhone
          data.operateType = 3
          break;
        case '6':
          data.toVisitPersonPhone = this.contactPhone
          data.operateType = 2
          break;
        default:
          data.visitPersonPhone = this.contactPhone
          data.operateType = 1
          break;
      }
			let params = {
				data
			}
      auditVisitApproval(params).then(res => {
				this.modalShow = false
        if(res.status == 200){
					uni.showToast({title:'操作成功！',duration:1000,icon: 'none',})
          setTimeout(()=> {
						this.reqVisitRecordDetailList()
					}, 500);
        }else{
					uni.showToast({title:res.message,duration:1000,icon: 'none',})
        }
      })
    },
    // 设置分享
    setWxShare() {
      this.$wxShare({
        desc: "访客邀请",
        link: window.location.href + "&isVistors=1" + "&isWxShare=1"
      });
    },
  },
	onShareAppMessage(res) {
			if (res.from === 'menu') {
				// 来自页面内分享按钮
				//
			}
			return {
				title: "访客详情",
				path: '/pages-d/visit-apply/myVisitorsRecordDetail?isVistors=1&isWxShare=1&recordId='+this.recordId
			};
		}
};
</script>
