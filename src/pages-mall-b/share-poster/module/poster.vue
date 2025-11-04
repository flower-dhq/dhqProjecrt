<template>
  <view class="poster">
    <canvas canvas-id="share-image" :style="{ width: '200px', height: '300px' }" />
  </view>
</template>

<script>
/**
 * 海报
 * @method generalImg 生成base64
 * @method downloadImg 保存图片到本地
 * @params postInfo  海报信息
 */
export default {
  options: { styleIsolation: 'shared' },
  data() {
    return {}
  },
  props:{
    postInfo:{
      type: Object
    },
  },
  mounted() {
    // 避免canvas在页面渲染之前就挂载了
    setTimeout(() => {
      this.drawImg()
    }, 800)
  },
  methods: {
    // canvas生成海报
    drawImg() {
      return new Promise((resolve, reject) => {
        
        const ctx = uni.createCanvasContext('share-image', this)
        // ctx.drawImage('/pages-mall-b/static/poster.png', 0, 0, 200, 239)
        ctx.drawImage(this.postInfo.shareImgUrl, 0, 0, 200, 239)

        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 239, 200, 61)
        ctx.save()

        ctx.beginPath()
        ctx.drawImage(this.postInfo.headimg, 6, 251.5, 36, 36)
        ctx.save()

        ctx.beginPath()
        ctx.setFillStyle('#333')
        ctx.setFontSize(10)
        ctx.fillText(this.postInfo.nickname, 48, 268)
        ctx.setFillStyle('#999')
        ctx.setFontSize(7)
        ctx.fillText('推荐您享受内购优惠', 48, 281)
        ctx.save()

        ctx.beginPath()
        ctx.drawImage(this.postInfo.qrCode, 150, 243, 40, 40)
        ctx.setFillStyle('#999')
        ctx.setFontSize(6)
        ctx.fillText('长按识别二维码', 148, 291)
        ctx.save()

        ctx.draw(true,() => {
          resolve()
        },this)
      })
    },
    // canvas转为图片
    generalImg() {
      return new Promise((resolve, reject) => {
        uni.canvasToTempFilePath(
          {
            canvasId: 'share-image',
            fileType: 'jpg',
            success: res => {
              resolve(res.tempFilePath)
              console.log(res)
            },
            fail: res => {
              reject(res)
            }
          },
          this
        )
      })
    },
    // 保存图片到相册
    saveImg(tempFilePath) {
      uni.showModal({
        title: '提示',
        content: '确定保存图片吗',
        showCancel: true,
        success: ({ confirm, cancel }) => {
          if (confirm) {
            // #ifdef MP-WEIXIN
            uni.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success: () => {
                uni.showToast({
                  title: '保存成功',
                  icon: 'none'
                })
              },
              fail: () => {
                uni.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              }
            })
            // #endif

            // #ifdef H5
            this.saveH5Img(tempFilePath)
            // #endif
          }
        }
      })
    },
    async downloadImg() {
      const base64 = await this.generalImg()
      console.log("base64-------",base64);
      return base64
      // this.saveImg(base64)
    },
    saveH5Img(url){
      let labelA = document.createElement("a")
      labelA.download ="分享图"
      labelA.href = url
      document.body.appendChild(labelA)
      labelA.click()
      labelA.remove()
    },
    // 根据url生成二维码
    generalQR(url) {
      
    }
  }
}
</script>

<style lang="scss" scoped>
</style>