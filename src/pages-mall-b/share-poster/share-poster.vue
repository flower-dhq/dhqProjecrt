<template>
  <view class="page-box-top">
    <!-- 文案分享 -->
    <view class="wa-box" v-if="false">
      <view class="msg-box">
        <view>
          <text v-if="source == 0">{{shareInfo.shareTitle}}</text>
          <text v-if="source == 1">{{goodsPostInfo.goodsTitle}}</text>
        </view>
        <template v-if="source == 1">
          <view>
            <span>——————————————</span>
          </view>
          <view>价格：{{specObj.price}}元</view>
          <view>原价：{{specObj.oldPrice}}元</view>
        </template>
        <view>
          <text>抢购链接：</text>
          <text class="text-link" @click="() => {}">{{shareInfo.shareShortUrl}}</text>
        </view>
      </view>
      <view class="btn-box">
        <!-- #ifndef H5 -->
        <cl-button round plain size="small" type="primary" @tap="copyData(1)">复制全部</cl-button>
        <cl-button round plain size="small" type="primary" @tap="copyData(0)">复制链接</cl-button>
        <!-- #endif -->

        <!-- #ifdef H5 -->
        <view class="copy-btn copy-h5" @tap="copyH5Data(1)">复制全部</view>
        <view class="copy-btn copy-h5" @tap="copyH5Data(0)">复制链接</view>
        <!-- #endif -->
      </view>
    </view>
    <!-- <view class="placeholder-h"></view> -->
    <!-- 海报分享 -->
    <view class="wa-box">
      <!-- <view class="header-box">
        <text class="text-sub">生成海报</text>
      </view>-->
      <view class="content-box">
        <view class="poster-box">
          <image
            style="width:280px;height:520px;border-radius: 6px;box-shadow: 8px 8px 20px 10px rgb(245,245,245);"
            :src="shareInfo.shareImgUrl"
            mode="aspectFit"
            show-menu-by-longpress
          />
        </view>
      </view>
      <view class="footer-box" v-if="platformType === 'H5'">
        <cl-button fill round type="primary" @click="saveImg">查看图片</cl-button>
      </view>
      <view class="footer-webviewAPP" v-if="platformType === 'APP'">
        <cl-button fill round type="primary" @click="shareLinkByAPP">分享链接</cl-button>
        <cl-button fill round type="primary" @click="saveImg">分享图片</cl-button>
      </view>
      <view class="footer-box" v-if="platformType === 'MP-WEIXIN'">
        <cl-button fill round type="primary" @click="getSaveImg">保存图片</cl-button>
      </view>
    </view>

    <!-- 查看海报图片 -->
    <cl-popup :visible.sync="isPosterImgShow" size="100" direction="center">
      <image :src="shareInfo.shareImgUrl" mode="aspectFit" />
      <view style="text-align:center;color:#999999;font-size:10rpx">长按图片保存</view>
    </cl-popup>

    <!-- 消息提示 -->
    <cl-toast ref="elMessage"></cl-toast>
  </view>
</template>

<script>
import Clipboard from 'clipboard'

export default {
  options: { styleIsolation: 'shared' },
  data() {
    return {
      shareInfo: {}, // 接口返回的分享信息
      postInfo: {
        // 海报信息
        headimg: '', // 分享人头像
        nickname: '', // 分享人名称
        shareImgUrl: '', // 分享图
        qrCode: '' // 分享二维码
      },
      source: '', // 跳转来源  0：首页  1：商品详情页
      shopInfo: {}, // 商品信息
      specObj: {}, // 规格信息  price:价格  promotionActivity：券后价（活动价）
      goodsPostInfo: {
        headimg: '', // 分享人头像
        nickname: '', // 分享人名称
        shareImgUrl: '', // 分享图
        qrCode: '', // 分享二维码
        goodsTitle: '' // 海报商品标题
      },
      isPosterImgShow: false,
      posterImg: '',
      memberId: '',
      isWebViewApp: false,
      specId: '' //规格id
    }
  },
  computed: {
    platformType() {
      const isApp = this.$cmMth.isWebViewApp()

      if (isApp) {
        return 'APP' // 套壳APP
      } else {
        /* #ifdef MP-WEIXIN */
        return 'MP-WEIXIN' // 小程序
        /* #endif */

        /* #ifdef H5 */
        return 'H5' // 公众号
        /* #endif */
      }
    }
  },
  onLoad(option) {
    const params = this.$cmMth.getRouteParams(option, 'shopInfo', 'specObj')

    if (option.source == 'goods') {
      // 商品详情的分享
      this.shopInfo = JSON.parse(decodeURIComponent(params.shopInfo))
      this.specObj = JSON.parse(decodeURIComponent(params.specObj))

      console.log('shopInfo--------', this.shopInfo)
      console.log('specObj--------', this.specObj)

      this.source = 1
      this.goodsPostInfo.shareImgUrl = this.shopInfo.logo
      this.goodsPostInfo.goodsTitle = this.shopInfo.gmName
      this.goodsPostInfo.price = this.specObj.price
      this.goodsPostInfo.oldPrice = this.specObj.oldPrice
      this.specId = this.specObj.specId

      this.getConfigLogo()
    } else {
      this.source = 0
    }

    const { USER_INFO } = this.$constant
    const storage = this.$cmMth.storageAction({ key: USER_INFO, action: 'get' })
    this.postInfo.headimg = storage.memberPhoto
    this.goodsPostInfo.headimg = storage.memberPhoto
    this.postInfo.nickname = storage.nickname
    this.goodsPostInfo.nickname = storage.nickname
    this.memberId = storage.memberId

    this.getShareContent()

    // 判断是否为APP
    this.isWebViewApp = this.$cmMth.isWebViewApp()
  },
  methods: {
    // 获取授权判断是否授权相册
    getSaveImg(){ 
      var str=this.shareInfo.shareImgUrl.replace("data:image/png;base64,",""); 
      let that = this;
      uni.getSetting({
          success: (res)=>{
            console.log(res)
            if (!res.authSetting["scope.writePhotosAlbum"]){
              uni.showModal({
                title: '警告',
                content: '检测到您没您未授权相册权限,点击确定获取授权。',
                success: function (res) {
                  console.log(res)
                if (res.confirm) {
                  uni.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success() {
                        // 用户已经同意
                        that.saveImgToAlbum(str);
                      },
                      fail(err){
                        console.log(err)
                        if (err.errMsg == 'authorize:fail 系统错误，错误码：-12006,auth deny') {
                        uni.showModal({
                          content: '检测到您没打开授权相册功能权限，是否去设置打开？',
                          confirmText: "确认",
                          cancelText: '取消',
                          success: (res) => {
                            if (res.confirm) {
                              uni.openSetting({
                                success: (res) => {
                                  console.log(res);
                                }
                              })
                            } else {
                              console.log('取消');
                            }
                          }
                        })
                                          
                        }
                    //  console.log('用户拒绝授权相册') 
                        
                      }
                    })		 
                }
                }
              })
            }else{
              that.saveImgToAlbum(str);
            }
          },
          fail: () => {
          console.log('点击了拒绝')
          
          }
      })
    },
      // 保存二维码图片到相册
    saveImgToAlbum(qrcode) {
      var fileManager = uni.getFileSystemManager();
      fileManager.writeFile({
        filePath: wx.env.USER_DATA_PATH+'/img.jpg', // 指定图片的临时路径
        data: qrcode, // 要写入的文本或二进制数据
        encoding: 'base64', // 指定写入文件的字符编码
        success: res => {
          console.log('写入文件成功', res)
          console.log(wx.env.USER_DATA_PATH + '/img.jpg')
          uni.saveImageToPhotosAlbum({ // 保存图片到相册
            filePath: wx.env.USER_DATA_PATH + '/img.jpg',
            success: function (res) {
              console.log('保存成功', res)
              uni.showToast({
                title: '保存成功',
              })
            },
            fail: function (err) {
              console.log('保存失败', err)
            }
          })
        },
        file: err => {
          console.log('写入文件失败', err)
        }
      })
    }, 

    // 获取分享参数
    async getShareContent() {
      const {
        nickname: userName,
        shareImgUrl: gmImgUrl,
        goodsTitle: gmName,
        price: gmPrice,
        oldPrice
      } = this.goodsPostInfo

      let data
      switch (this.source) {
        case 0:
          data = {
            shareUrl: 'pages/index/index',
            scene: `shareId=`,
            // scene: `shareId=${this.memberId}`,
            shareCode: 'ShopPoster',
            userName
          }
          break

        case 1:
          const isMini = process.env.VUE_APP_PLATFORM === 'mp-weixin'
          let obj = {
            shopId:this.shopInfo.gmId,
            shareId:this.memberId,
            specId:this.specId
          }
          let res = await this.setParams(JSON.stringify(obj))
          let miniParams = `gParams=${res}`
          let otherParams = `shopId=${this.shopInfo.gmId}&shareId=${this.memberId}&specId=${this.specId}`
          data = {
            shareUrl: 'pagesA/shopping-info/shopping-info',
            scene: isMini ? miniParams : otherParams,
            shareCode: '',
            gmImgUrl,
            gmName,
            gmPrice,
            oldPrice,
            userName
          }
          break
      }
      const params = {
        data
      }
      const { projectType } = this.$cmMth.getProjectConfig()

      // #ifdef  H5
      params.data.shareType = 'h5'
      params.data.appletId = projectType 
      // #endif

      // #ifdef  MP-WEIXIN
      params.data.shareType = 'mini'
      params.data.appletId = projectType
      // #endif

      const { data: res } = await this.$mallApi.data.getShareContent(params)
      this.shareInfo = res
    },
    async setParams(objStr) {
      const params = {
        data:{
          params:objStr
        }
      }
      const { data: res } = await this.$mallApi.data.setShareMiniParams(params)
      return res
    },

    // 获取海报图的项目logo
    async getConfigLogo() {
      const params = {
        pathParams: '/ShopShareHeadTitle'
      }
      const { data: res } = await this.$mallApi.data.getConfigByCode(params)
      this.goodsPostInfo.configLogo = res.configDesc
    },
    async saveImg() {
      switch (this.platformType) {
        case 'H5':
          this.isPosterImgShow = true
          break
        case 'APP':
          this.shareImgByAPP(this.shareInfo.shareImgUrl)
          break
        case 'MP-WEIXIN':
          this.saveImageOfMiniPro(this.shareInfo.shareImgUrl)
          break
      }
    },
    copyData(type) {
      let content, messageText
      switch (type) {
        case 1:
          if (this.source == 1) {
            // content = `${this.goodsPostInfo.goodsTitle}，${this.specObj.price?'价格：'+this.specObj.price+'，':""}${this.specObj.promotionActivity?'折扣价：'+this.specObj.promotionActivity.activityPrice+'，':""}抢购链接：${this.shareInfo.shareShortUrl}`
            content = `${this.goodsPostInfo.goodsTitle}，价格：${this.specObj.price}元，原价：${this.specObj.oldPrice}元，抢购链接：${this.shareInfo.shareShortUrl}`
          } else {
            content = `${this.shareInfo.shareTitle}，抢购链接：${this.shareInfo.shareShortUrl}`
          }
          messageText = '复制全部成功！'
          break

        default:
          content = this.shareInfo.shareShortUrl
          messageText = '复制链接成功！'
          break
      }

      const self = this
      // H5时提示：API `setClipboardData` is not yet implemented
      uni.setClipboardData({
        data: content,
        success: function() {
          self.$refs['elMessage'].open({
            message: messageText
          })
        }
      })
    },
    copyH5Data(type) {
      let content, messageText
      switch (type) {
        case 1:
          if (this.source == 1) {
            // content = `${this.goodsPostInfo.goodsTitle}，${this.specObj.price?'价格：'+this.specObj.price+'，':""}${this.specObj.promotionActivity?'折扣价：'+this.specObj.promotionActivity.activityPrice+'，':""}抢购链接：${this.shareInfo.shareShortUrl}`
            content = `${this.goodsPostInfo.goodsTitle}，价格：${this.specObj.price}元，原价：${this.specObj.oldPrice}元，抢购链接：${this.shareInfo.shareShortUrl}`
          } else {
            content = `${this.shareInfo.shareTitle}，抢购链接：${this.shareInfo.shareShortUrl}`
          }
          messageText = '复制全部成功！'
          break

        default:
          content = this.shareInfo.shareShortUrl
          messageText = '复制链接成功！'
          break
      }

      let clipboard = new Clipboard('.copy-h5', {
        text: () => {
          return content
        }
      })

      clipboard.on('success', e => {
        console.log('Text', e.text)

        e.clearSelection() // 清除选中的文字的选择状态

        this.$refs['elMessage'].open({
          message: messageText
        })
      })

      clipboard.on('error', e => {
        console.log('error', e)
      })
    },
    shareLinkByAPP() {
      let type = 0 // 0:图片  1：链接
      let title = this.source == 1 ? this.goodsPostInfo.goodsTitle : this.shareInfo.shareTitle // 商品标题
      let desc = ''
      let url = this.shareInfo.shareShortUrl // 商品链接

      EbeiPlugins.shareURLToWeixin(type, title, desc, url)
    },
    async shareImgByAPP(base64Img) {
      EbeiPlugins.shareByApp(
        'wechatsession',
        'image',
        {
          title: '海报分享',
          description: '海报图片分享',
          imageUrl: base64Img
        },
        function() {},
        function() {}
      )
    },
    // 微信小程序专用，下载图片，保存图片到系统相册
    async saveImageOfMiniPro(url) {
      // 错误打印
      const message = {
        base(info = { success: false, data: undefined, message: '' }) {
          return info
        },
        success(data = '', message = '') {
          return this.base({ success: true, data, message })
        },
        fail(message = '') {
          return this.base({ success: false, data: undefined, message })
        }
      }

      // 下载文件
      function downloadFile(url) {
        return new Promise(resolve => {
          uni.downloadFile({
            url,
            success: ({ tempFilePath, statusCode }) => {
              if (statusCode === 200) resolve(message.success(tempFilePath, '图片下载成功'))
              else resolve(message.fail('图片下载失败'))
            },
            fail: () => {
              resolve(message.fail('图片下载失败'))
            }
          })
        })
      }

      // 保存图片到系统相册
      function saveImageToPhotosAlbum(filePath) {
        return new Promise(resolve => {
          uni.saveImageToPhotosAlbum({
            filePath,
            success: () => {
              resolve(message.success(undefined, '保存图片成功！'))
            },
            fail: () => {
              resolve(message.fail(undefined, '保存图片失败！'))
            }
          })
        })
      }

      // 获取权限
      function authorize() {
        return new Promise(resolve => {
          uni.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => resolve(message.success('', '授权成功！')),
            fail: () => resolve(message.fail('授权失败！'))
          })
        })
      }

      await authorize()
      const dfRes = await downloadFile(url)
      const stpaRes = await saveImageToPhotosAlbum(dfRes.data)

      this.$refs.elMessage.open({
        message: stpaRes.message
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wa-box {
  width: 100%;
  padding: 32rpx 24rpx;
  background-color: #fff;
  box-sizing: border-box;
}
.msg-box {
  width: 100%;
  padding: 20rpx 24rpx;
  background-color: #f5f5f5;
  box-sizing: border-box;
  border-radius: 12rpx;
  font-size: 26rpx;
  word-break: break-all;
  margin-bottom: 32rpx;

  .text-link {
    text-decoration: underline;
    color: rgb(86, 143, 196);
  }
}
.btn-box {
  @include flx-dsp(flex-end, center, row);
}
.placeholder-h {
  width: 100%;
  height: 20rpx;
  background-color: #fafafa;
}
.header-box {
  width: 100%;
  height: 64rpx;
  @include flx-dsp(center, center, row);
  color: $uni-color-main;
  font-size: 30rpx;
  border-bottom: 2rpx solid #f2f2f2;

  .text-sub::after {
    position: relative;
    content: '';
    width: 46rpx;
    height: 6rpx;
    display: block;
    background-color: $uni-color-main;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 30rpx;
  }
}
.footer-box {
  width: 80%;
  margin: 0 auto;
  ::v-deep .cl-button {
    font-size: 28rpx;
    height: 80rpx;
  }
}
.footer-webviewAPP {
  width: 100%;
  display: flex;

  ::v-deep .cl-button {
    font-size: 28rpx;
    height: 80rpx;
    line-height: 80rpx;
    width: 50%;
  }
}
.content-box {
  width: 100%;
  // @include flx-dsp(flex-start, center, column);

  .poster-box {
    width: 280px;
    // padding: 22rpx 10px 68rpx;
    padding: 10px;
    // box-sizing: border-box;
    /* background-color: #f5f5f5; */
    margin: 22rpx auto 68rpx;
  }
}

.copy-btn {
  width: 150rpx;
  height: 60rpx;
  line-height: 60rpx;
  border: 1rpx solid $uni-color-main;
  border-radius: 100rpx;
  color: $uni-color-main;
  font-size: 26rpx;
  text-align: center;
  margin-left: 20rpx;
}
</style>