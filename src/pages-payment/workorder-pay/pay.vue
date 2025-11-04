<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="img-panel">
      <text class="img-desc">扫描二维码，支付费用</text>
      <u--text mode="price" :text="price" size="60rpx" :color="THEME_COLOR" margin="0 0 48rpx 0" align="center" customStyle="font-weight: bold;" />
      <canvas v-if="!imgUrl" id="qrcode" canvas-id="qrcode" class="qrcode" />
      <image v-else :src="imgUrl" class="qrcode" />
      <u--text text="点击刷新二维码" prefixIcon="reload" size="28rpx" :color="THEME_COLOR" :iconStyle="{color: THEME_COLOR}" margin="48rpx 0 0 0" align="center" @click="saveQRcode" />
    </view>

    <u-toast ref="messageEl" />
    <yb-complete ref="completeEl" />
  </view>
</template>

<script>
import UQRCode from 'uqrcodejs'
import pageRefresh from '@/js/pageRefresh'
import YbComplete from '@/components/yb-complete/yb-complete.vue'
import { saveQRcode, isPaySuccess } from '@/service/landcrm'

export default {
  components: {
    YbComplete
  },
  data() {
    this.timeId = null

    return {
      taskId: '', // 工单id
      price: '0.00', // 金额
      codeUrl: '', // 二维码的链接
      imgUrl: '', // 二维码图片地址
    }
  },
  onLoad(options) {
    this.taskId = options.taskId || ''
    this.price = options.price || '0.00'
    this.saveQRcode()
    this.isPaySuccess()
  },
  beforeDestroy() {
    clearTimeout(this.timeId)

    // 返回上一页（工单详情页）时候，刷新页面
    pageRefresh.setRefresh('WORK_ORDER_DETAIL')
  },
  methods: {
    async saveQRcode() {
      this.imgUrl = ''
      const params = {
        data: {
          taskId: this.taskId,
          ip: this.$appConfig.DOMAIN_PRO
        }
      }
      const res = await saveQRcode(params)
      if (res.qrCode) {
        this.codeUrl = res.qrCode || ''
        this.creatQrCode()
      } else {
        this.$refs.messageEl.show({
          message: res.desc
        })
      }
    },
    //  生成二维码
    creatQrCode() {
      const qr = new UQRCode()
      // 设置二维码内容
      qr.data = this.codeUrl
      // 设置二维码大小，必须与canvas设置的宽高一致
      qr.size = 220
      // 调用制作二维码方法
      qr.make()
      // 获取canvas上下文
      const canvasContext = uni.createCanvasContext('qrcode', this) // 如果是组件，this必须传入
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = canvasContext
      // 调用绘制方法将二维码图案绘制到canvas上
      qr.drawCanvas()

      setTimeout(() => {
        // canvas层级问题，会挡住弹出提示窗，所以需要转为图片显示
        uni.canvasToTempFilePath({
          canvasId: 'qrcode',
          width: 220,
          height: 220,
          quality: 1,
          complete: (res) => {
            this.imgUrl = res.tempFilePath || ''
          }
        })
      }, 500)
    },
    // 判断支付状态
    async isPaySuccess() {
      const params = {
        data: {
          taskId: this.taskId
        },
        hideLoading: true,
        responseToast: false
      }
      const res = await isPaySuccess(params)
      const isPay = res?.data?.payState // -1、已关闭，0、创建，1、已支付，2、已退款，3、部分退款 
      if (isPay == 1) {
        this.$refs.completeEl.showMessage('支付成功', (next) => {
          // 返回到工单详情页面
          uni.navigateBack({ delta: 1 })
        })
      } else {
        this.timeId = setTimeout(() => {
          this.isPaySuccess()
        }, 3000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  width: 100%;
  height: 100vh;
  padding: 100rpx 50rpx 0;
  box-sizing: border-box;
  background-image: url('@/static/theme-default/payment/bg-pay.png');
  background-size: 100%;
  background-repeat: no-repeat;
}
.img-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8rpx;
  padding: 80rpx 124rpx;
  box-sizing: border-box;
  position: relative;

  &::before {
    content: '';
    display: block;
    width: 302rpx;
    height: 326rpx;
    background-image: url('@/static/theme-default/payment/qrcode-pay.png');
    background-size: 100%;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    left: 0;
    transform: rotateZ(180deg);
  }
  &::after {
    content: '';
    display: block;
    width: 302rpx;
    height: 326rpx;
    background-image: url('@/static/theme-default/payment/qrcode-pay.png');
    background-size: 100%;
    background-repeat: no-repeat;
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
.img-desc {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 24rpx;
}
.qrcode {
  width: 220px;
  height: 220px;
  background-color: #f5f5f5;
}
</style>