<template>
  <view class="poster">
    <canvas canvas-id="share-image" :style="{ width: '200px', height: '350px' }" />
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
    return {
      text: "这是测试的商品标题,这是测试的商品标题,这是测试的商品标题,这是测试的商品标题,这是测试的商品标题,",
    }
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
    }, 1500)
  },
  methods: {
    // canvas生成海报
    drawImg() {
      return new Promise((resolve, reject) => {
        const cvsWidth = 200;
        const cvsHeight = 200 + 30 + 70 + 40 + 10;  // canvas高 = 主图高 + 标题高 + 其他图高 + logo高（和外边距20）+ 价格高
        const QRcodeW = 45;  // 二维码的宽高
        const headImgW = 35; // 用户头像的宽高
        const logoWidth = 100; // 项目logo的宽
        const logoHeight = 20; // 项目logo的高

        const ctx = uni.createCanvasContext('share-image', this)

        // 设置白色底图 (Ps:使用 fillRect 画图之后会与下面 arc 方法冲突，导致无法头像切圆)
        ctx.drawImage('/pages-mall-b/static/poster-bg.jpg', 0, 0, cvsWidth, cvsHeight)
      
        // 上图
        ctx.drawImage(this.postInfo.configLogo, 50, 10, logoWidth, logoHeight) // logo图
        ctx.drawImage(this.postInfo.shareImgUrl, 0, logoHeight + 20, cvsWidth, cvsWidth) // 商品主图
				this.drawCircular(ctx,this.postInfo.headimg, 6, cvsWidth + 50 + logoHeight + 20 + 15, headImgW, headImgW)  // 头像切圆
				ctx.drawImage(this.postInfo.qrCode, cvsWidth-QRcodeW-6, cvsWidth + 45 + logoHeight + 20 + 10, QRcodeW, QRcodeW) // 二维码

        // 设置标题
        ctx.setFontSize(10);      
				ctx.setFillStyle('#333'); 
        this.moreLinesOmit(ctx,cvsWidth,this.postInfo.goodsTitle) // 标题超出两行显示省略

        // 价格
        ctx.setFillStyle('#ED8D57')
        ctx.setFontSize(12)
        ctx.fillText('￥'+ this.postInfo.price, 5, cvsWidth + 50 + logoHeight + 20 + 5)
        const priceWidth = ctx.measureText(this.postInfo.price).width;

        // 历史价格
        ctx.setFillStyle('#999')
        ctx.setFontSize(10)
        ctx.fillText('价格￥'+ this.postInfo.oldPrice, 5 + priceWidth + 20, cvsWidth + 50 + logoHeight + 20 + 5)
        // 设置历史价格删除线
        ctx.save();
        ctx.beginPath();
        const oldPriceWidth = ctx.measureText(this.postInfo.oldPrice).width;
        ctx.rect(5 + priceWidth + 20 + 30, cvsWidth + 50 + logoHeight + 20, oldPriceWidth, 2);
        ctx.fillStyle = '#999';
        ctx.fill();  

        // 其他信息
        ctx.setFillStyle('#333')
        ctx.setFontSize(10)
        ctx.fillText(this.postInfo.nickname, 6 + headImgW + 6, cvsWidth + 50 + 15 + logoHeight + 20 + 15)

        ctx.setFillStyle('#999')
        ctx.setFontSize(7)
        ctx.fillText('推荐您享受内购优惠', 6 + headImgW + 6, cvsWidth + 50 + 28 + logoHeight + 20 + 15)

        ctx.setFillStyle('#999')
        ctx.setFontSize(6)
        ctx.fillText('长按识别二维码', cvsWidth-QRcodeW-6, cvsWidth + 45 + QRcodeW + 5 + logoHeight + 20 + 10)
      

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
    // 画圆形图片
    drawCircular(ctx, url, x, y, width, height) {
        // ctx.clearRect(x, y, width+20, height+20)
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2 + x, height / 2 + y, width / 2, 0, Math.PI * 2, false);
        ctx.clip();
        ctx.drawImage(url, x, y, width, height);
        ctx.restore();
    },
    //  超出两行省略处理
    moreLinesOmit(ctx,cvsWidth,text){
      let strlineW = 0;      // 整行行字符串的宽度
      let startSubIndex = 0; //每次开始截取的字符串的索引
      let strToTopHeight = cvsWidth  + 15 + 40; //绘制字体距离canvas顶部的初始高度
      let lineNum = 1;
      for(let i = 0; i < text.length; i++) {
        strlineW += ctx.measureText(text[i]).width
        if(strlineW > cvsWidth - 10){
          if(lineNum == 2 && 2){
            ctx.fillText(text.substring(startSubIndex, i-2)+'...', 6, strToTopHeight);
            strlineW = 0;
            startSubIndex = i;
            lineNum ++;
            break;
          } else {
            ctx.fillText(text.substring(startSubIndex, i), 6, strToTopHeight);
            strlineW = 0;
            strToTopHeight += 20;
            startSubIndex = i;
            lineNum++;
          }
        } else if( i == text.length - 1){
          ctx.fillText(text.substring(startSubIndex, i + 1), 6, strToTopHeight);
          strlineW = 0;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>