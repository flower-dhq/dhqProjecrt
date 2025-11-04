
<style lang="scss" scoped>
.vehicle-container{
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  overflow-x: hidden;
  overflow-y: auto;
  .face-container{
    overflow: auto;
  }
  .upload-tip{
    height: 36rpx;
    box-sizing: content-box;
    padding: 60rpx 0;
    text-align: center;
    line-height: 36rpx;
    color: #1C1C1C;
    font-size: 26rpx;
  }
  .upload-form{
    height: 344rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .upload-image{
      // width: 344rpx;
      // height: 344rpx;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .upload-handle{
    height: 400rpx;
    padding: 80rpx 104rpx;
    box-sizing: border-box;
    .van-button{
      margin-bottom: 40rpx;
    }
  }
  .upload-tip-grid{
    .upload-tip-grid-label{
      width: 584rpx;
      font-size: 26rpx;
      line-height: 36rpx;
      color: #1C1C1C;
      margin-bottom: 12rpx;
    }
    display: flex;
    justify-content: center;
    ::v-deep .u-grid{
      width: 728rpx;
      .u-grid-item__content{
        padding: 0;
      }
    }
  }
  .face-form{
    padding: 48rpx 80rpx;
    .face-form-name{
      width: 100%;
      padding: 40rpx 0 20rpx;
      text-align: center;
      line-height: 60rpx;
      font-size: 40rpx;
      color: #333333;
      font-weight: bold;
    }
    .face-form-label{
      width: 100%;
      padding: 40rpx 0 20rpx;
      line-height: 40rpx;
      font-size: 28rpx;
      color: #333333;
    }
    .face-form-label:after{
      content: '*';
      font-size: 28rpx;
      color: #FF2020;
      margin-left: 10rpx;
    }
    .face-form-handle{
      margin-left: -16rpx;
      float: left;
      .face-form-button{
        height: 48rpx;
        float: left;
        box-sizing: border-box;
        margin: 0 16rpx 24rpx;
        padding: 0px 16rpx;
        border: 1px solid #CCCCCC;
        border-radius: 24rpx;
        display: flex;
        justify-content: center;
        font-size: 24rpx;
        line-height: 44rpx;
        color: #999999;
        white-space: nowrap;
      }
      .face-form-button-check{
        color: var(--app-primary-color);
        border-color: var(--app-primary-color);
      }
    }
    .form-handle{
      width: 100%;
      float: left;
      padding: 40rpx 24rpx;
    }
  }
}
.allBtn{
  width: 100%;
  background: #F5F5F5;
  .btns{
    width: 100%;
    background: #FFF;
    cursor: pointer;
    text-align: center;
  }
  .btn-option{
    height: 110rpx;
    line-height: 110rpx;
    font-size: 36rpx;
    border-bottom: 1px solid #F5F5F5;
    color: #00C6D2;
    font-weight: bold;
  }
  .btn-option2{
    border: none;
    font-size: 32rpx;
    color: #333;
  }
  .btn-cancel{
    height: 124rpx;
    line-height: 124rpx;
    font-size: 32rpx;
    color: #999;
    margin-top: 10rpx;
  }
}
.grid-img{
	width: 92rpx;
	height: 92rpx;
}
/*  #ifdef  MP-WEIXIN  */
::v-deep .u-grid{
	width: 672rpx !important;
}
/*  #endif  */
// .uicon-arrow-right{
// 	position: absolute;
// 	right: 20rpx;
// }
.u-grid-box {
  width: 672rpx !important;
}
.KeyButton{
	width: 540rpx;
	height: 88rpx;
	background: var(--app-primary-color);
	border-radius: 40rpx;
	@include flx-dsp($jsc: center, $ali: center);
	color: #fff;
	font-size: 28rpx;
	cursor: pointer;
	margin-bottom: 40rpx;
}
.uploadAgain{
	background-color: #fff;
	border: 1px solid var(--app-primary-color);
	color: var(--app-primary-color);
}
.faceTip{
	color: #CCCCCC;
	font-size: 28rpx;
	padding-top: 10rpx;
	width: 100%;
	text-align: center;
}
</style>

<template>
  <view class="vehicle-container" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="face-container" style="height: calc(100vh - 46px)">
      <view class="upload-tip">拍照时请不要戴墨镜，帽子等遮挡物</view>
      <view class="upload-form">
        <view class="upload-image">
          <u-image :src="faceForm.filePath ? faceForm.filePath : faceBgXyd" width="172px" height="172px" />
        </view>
      </view>
      <view class="upload-handle">
        <input class="add-input" style="display:none;" type="file" ref="fileH5" accept="image/*" multiple @change="pcChange($event)" />
        <view v-if="!faceForm.filePath" @click="showOptions" class="KeyButton">拍照</view>
        <view @click="toThirdCheck" v-if="faceForm.filePath" class="KeyButton">确定</view>
        <view @click="resetFaceImage" v-if="faceForm.filePath" class="KeyButton uploadAgain">重新上传</view>
				<view class="faceTip">支持图片格式.jpg/.png</view>
      </view>
      <view class="upload-tip-grid">
        <view class="upload-tip-grid-label">错误示例</view>
      </view>
      <view class="upload-tip-grid">
        <u-grid gutter="32" :border="false" :col="4" class="u-grid-box">
          <u-grid-item >
						<image :src="facetipIcon1"  class="grid-img"></image>
						<text class="grid-text">侧脸</text>
					</u-grid-item>
					<u-grid-item >
						<image :src="facetipIcon2"  class="grid-img"></image>
						<text class="grid-text">模糊</text>
					</u-grid-item>
					<u-grid-item >
						<image :src="facetipIcon3"  class="grid-img"></image>
						<text class="grid-text">遮挡</text>
					</u-grid-item>
					<u-grid-item >
						<image :src="facetipIcon4"  class="grid-img"></image>
						<text class="grid-text">残缺</text>
					</u-grid-item>
        </u-grid>
      </view>
      <view class="face-form" v-if="false">
<!--        <van-field v-model="faceForm.name" placeholder="请输入姓名" style="border: 1px solid #CCCCCC;border-radius: 4px;" />-->
        <view class="face-form-name">{{faceForm.name}}</view>
        <view class="face-form-label">标签</view>
        <view class="face-form-handle" style="width: calc(100% + 16px);">
          <view class="face-form-button" v-for="(item, index) in labelList" :key="index" @click="()=>{faceForm.label = item.value}"
               style="width: calc(25% - 16px);" :class="faceForm.label == item.value ? 'face-form-button-check' : ''">{{item.label}}</view>
        </view>
        <view class="face-form-label">是否需要进行人员出入提醒</view>
        <view class="face-form-handle" style="width: calc(100% + 16px);">
          <view class="face-form-button" v-for="(item, index) in warningList" :key="index" @click="()=>{faceForm.warning = item.value}"
               style="width: calc(25% - 16px);" :class="faceForm.warning == item.value ? 'face-form-button-check' : ''">{{item.label}}</view>
        </view>
        <view class="form-handle">
          <u-button :loading="btnLoading" :disabled="btnLoading" loading-text="提交中..." round block type="info" :color="mainColor" @click="submitFaceForm">确认</u-button>
        </view>
      </view>
    </view>
    <u-popup :show="showOptionsPopup" mode="bottom" class="agreement-popup">
      <view class="allBtn">
        <view class="btns btn-option" @click="getFaceImage">拍照</view>
        <view class="btns btn-option btn-option2" @click="getFaceImage2">从相册上传</view>
        <view class="btns btn-cancel" @click="hideOption">取消</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
		import {fileDownload,fileUpload,imageUpload} from '@/service/community.js';
		import {faceImgCheckout} from '@/service/doorService.js';
		import Utils from '@/js/utils'
    import commLogic from '@/js/comm-logic';
		import {
				DOMParser
			} from 'xmldom'
    export default {
      name: 'newFaceForm',
      data() {
        return {
          loading: false,
          showOptionsPopup:false,
          btnLoading: false,
          faceInfo: {
            faceId: '',
            uploadFace: false,
          },
          faceForm: {
            relateId: '',
            filePath: '',
            name: '',
            label:'',
            warning: 0,
            access: [],
            userPhone:''
          },
          labelList: [
            {label: '爸爸', value: '爸爸'},
            {label: '妈妈', value: '妈妈'},
            {label: '儿子', value: '儿子'},
            {label: '女儿', value: '女儿'},
            {label: '其他', value: '其他'},
          ],
          warningList: [
            {label: '是', value: 1},
            {label: '否', value: 0},
          ],
          accessList: [],
          ownerId: '',
          ownerinfoId: '',
          faceToken: null,
          faceAuthTxt: '人脸识别',
          idCfArgs: null,
          watchTimer: null,
          appIsCallback: false, // app是否有切回过页面
					userId:"",
        }
      },
      onLoad(options) {
        this.faceForm.name = options.userName || ''
        this.faceForm.userPhone = options.userPhone || ''
        this.ownerinfoId = options.ownerinfoId || ''
				const { O_USER_INFO, USER_TYPE, USER_TYPE_NUM } = this.$constant
				let data = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
				this.ownerId = data.ownerId || ''
				this.userId = data.id || ''
        // 获取门禁接口变更
        // this.getAccessList0()
        // this.toBaiduFaceAuth();
        // this.getPropertyInfo0()
      },
			computed:{
				faceBgXyd(){
					return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/face_bg_xyd.png`
				},
				facetipIcon1(){
					return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/face_tip_icon1.png`
				},
				facetipIcon2(){
					return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/face_tip_icon2.png`
				},
				facetipIcon3(){
					return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/face_tip_icon3.png`
				},
				facetipIcon4(){
					return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/face_tip_icon4.png`
				},
			},
      methods: {
				hideOption(){
					this.showOptionsPopup = false
				},
        getAccessList0() {
          getDeviceFace({
            ownerId: this.ownerinfoId,
            current: 1,
            size:500
          }).then(res => {
            if (res.status == 200) {
              if (res.data && res.data.length) {
                this.accessList = res.data.map(item =>{
                  return {
                    ...item,
                    check: true
                  }
                })
              } else {
                this.accessList = []
              }
            } else {
							uni.showToast({title:res.message,duration:1000,icon: 'none',})
            }
          })
        },
        //提交人脸图片
        toThirdCheck(){
          this.loading = true
          let params = {
						data:{
							type:'0',
							userId:this.userId,
							userPhone:this.faceForm.userPhone,
							empFace:this.faceForm.filePath
						},
						responseToast: false,
					}
          faceImgCheckout(params).then(res=>{
            this.loading = false
            if(res.status == 200){
							uni.showToast({title:res.message || '上传成功！',duration:1000,icon: 'none',})
              uni.$emit('refreshData');

              uni.navigateBack()
            }else{
              let msg = res.message.indexOf('errorMsg：') > -1?res.message.split('errorMsg：')[1] || '图片未通过校验':res.message
							uni.showToast({title:msg,duration:1000,icon: 'none',})
            }
          })
        },
        showOptions(){
          this.showOptionsPopup = true
        },
        //  获取人脸图片
        async getFaceImage(){
          this.showOptionsPopup = false
          let that = this
          const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['camera']})
				  if (code !== 1 && code !== -2) return
          // if (window.EbeiPlugins) {
            	uni.chooseImage({
            	  count: 1, //默认9
          			sourceType: ['camera'], //从相册选择
            	  sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            	  success: async (res) => {
            		console.log(683,res)
                  let allowedTypes = ['image/jpeg', 'image/png'];
                  if (!allowedTypes.includes(res.tempFiles[0].type)) {
                    uni.showToast({ title: '仅支持jpg/png格式', icon: 'none' });
                    return;
                  }
            	    const { tempFilePaths, tempFiles } = res;
            	    let filePath = tempFilePaths[0];
            	    let fileData = tempFiles[0];
            			// this.uploadImgList.push({ filePath, fileData })
										this.getFaceImageNew2({ filePath, fileData })
            			// this.uploadAvatar({ filePath, fileData })
            	  },
            	});
        },
        async getFaceImageNew2(uploadObj){
          const { MEMBER_ID,COMPLANY_ID } = this.$constant;
          const memberId = Utils.storageAction({ key: MEMBER_ID, action: 'get' });
          const uuid = Utils.uuid();
				  const { name, size, path} = uploadObj.fileData
				  const { uniPlatform } = uni.getSystemInfoSync();
				  const mpWeixinApp = uniPlatform === 'mp-weixin' || uniPlatform === 'app'
				  const suffix = () => {
				    const [ suffix ] = typeof path === 'string'  && path.match(/\.[a-z]+$/) || []
				    return suffix
				  }
					uni.showLoading({
						title:'正在上传图片...',
					})
				  const filename = mpWeixinApp ? `${uuid}${suffix() || '.png'}` : name;
				  await imageUpload({
				    filePath: uploadObj.filePath,
				    name: 'file',
				    hideLoading: true,
            memberId,
				  }).then(res=>{
						console.log(res.data,'========')
            let data = JSON.parse(res.data)
            uni.hideLoading()
            if(data.status == '200'){
              uni.showToast({title:'提交成功',icon:'none'})
              setTimeout(() => {
                uni.navigateBack()
              }, 1000);
            }else{
              uni.showToast({title:data.message,icon:'none'})
            }
					});
        },
        async getFaceImage2(){
          this.showOptionsPopup = false
          let that = this
          const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['readStorage']})
				  if (code !== 1 && code !== -2) return
          // if (window.EbeiPlugins) {
            	uni.chooseImage({
            	  count: 1, //默认9
								sourceType: ['album'], //从相册选择
            	  sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            	  success: async (res) => {
            		console.log(683,res)
                  let allowedTypes = ['image/jpeg', 'image/png'];
                  if (!allowedTypes.includes(res.tempFiles[0].type)) {
                    uni.showToast({ title: '仅支持jpg/png格式', icon: 'none' });
                    return;
                  }
            	    const { tempFilePaths, tempFiles } = res;
            	    let filePath = tempFilePaths[0];
            	    let fileData = tempFiles[0];
									// if(filePath.indexOf('jpg') > -1){
										this.getFaceImageNew2({ filePath, fileData })
									// }else{
									// 	uni.showToast({
									// 		title:'需要上传jpg格式的图片',
									// 		icon:'none'
									// 	})
									// }
            			// this.uploadImgList.push({ filePath, fileData })
            			// this.uploadAvatar({ filePath, fileData })
            	  },
            	});
          // } else {
          //   //人脸
          //   that.faceForm.filePath = 'http://183.239.172.150:5905/filemanager/previewFile?fileId=56bb9cd4-121d-41a8-9866-7c96efa377fa&type=filedatabase/e384b14e91332da480a797c17dcf3c53.jpg'
          // }
        },
        //  提交人脸图片
        submitFaceImage(){
          this.faceInfo.uploadFace = true
        },
				async uploadAvatar(uploadObj) {
				  const uuid = Utils.uuid();
				  const { name, size, path} = uploadObj.fileData
				  const { uniPlatform } = uni.getSystemInfoSync();
				  const mpWeixinApp = uniPlatform === 'mp-weixin' || uniPlatform === 'app'
				  const suffix = () => {
				    const [ suffix ] = typeof path === 'string'  && path.match(/\.[a-z]+$/) || []
				    return suffix
				  }
					uni.showLoading({
						title:'正在上传图片...',
					})
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
				      filecreatetime: Utils.formatDate({ value: new Date().getTime(), type: 's2d' }),
				    },
				    hideLoading: true,
				  });
					// this.uploadImguuIdList.push(uuid)
				  fileDownload({
				    header: {
				      fileid: uuid,
				      type: 2,
				    },
						hideLoading: true,
				  }).then(res=>{
						uni.hideLoading()
						this.faceForm.filePath = this.xmlParse(res.data)
					});
				},
				//xml解析
				xmlParse(xmldata){
					let url = ''
					const doc = new DOMParser().parseFromString(xmldata, 'text/xml')
					let allResult = doc.documentElement.getElementsByTagName('fileWebPath')
					url = allResult[0].firstChild.data
					return url
				},
        getFaceToken() {
          return new Promise(resolve => {
            getFaceVerificationToken().then(res => {
              const {status, data} = res
              if (status == 200) {
                this.faceToken = data;
              } else {
								uni.showToast({title:'获取token失败',duration:1000,icon: 'none',})
              }
              resolve(data ? data : null)
            }).catch(_ => {
              resolve(null)
            })
          })
        },
        // 生成回调url
        getCallBacKUrl(token) {
          const baseUrl = `https://${process.env.domain}/wechat/#/faceVerificationResult`;
          const successUrl = `${baseUrl}?status=1&verifyToken=${token}`;
          const failedUrl = `${baseUrl}?status=0&verifyToken=${token}`;
          return {
            successUrl: encodeURIComponent(successUrl),
            failedUrl: encodeURIComponent(failedUrl)
          }
        },
        //  重置人脸图片
        resetFaceImage(){
          // this.faceForm.filePath = '';
          this.faceToken = null;
          this.faceAuthTxt = '人脸识别';
          this.appIsCallback = false;
          this.showOptionsPopup = true
        },
      }
    }
</script>
