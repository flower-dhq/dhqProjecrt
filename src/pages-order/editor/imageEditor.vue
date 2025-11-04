<style lang="scss" scoped>
.image-editor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  .page-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24rpx 40rpx;
    background: rgba(#000000, 0.15);
    .colors-btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-top: 10rpx;
      padding-bottom: 20rpx;
      .colors-wrap {
        flex: 1;
        overflow: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        .color-wrap {
          width: 60rpx;
          height: 60rpx;
          margin-right: 12rpx;
          display: flex;
          align-items: center;
          .color-body {
            width: 36rpx;
            height: 36rpx;
            border-radius: 50%;
            overflow: hidden;
            border: 6rpx solid #ffffff;
          }
          .color-active {
            width: 40rpx;
            height: 40rpx;
            border: 10rpx solid #ffffff;
          }
        }
      }
      .cancel-icon {
        font-size: 40rpx;
        margin-left: 20rpx;
      }
    }

    .option-wrap {
      display: flex;
      flex-direction: row;
      .btns-wrap {
        flex: 1;
        display: flex;
        align-items: center;
        .op-icon {
          font-size: 50rpx;
          color: #ffffff;
          width: 25%;
        }
        .active {
          color: #67c23a;
        }
      }
      .submit-wrap {
        padding: 12rpx 30rpx;
        color: #ffffff;
        border-radius: 8rpx;
        background: #67c23a;
        font-size: 30rpx;
      }
    }
  }
  .edit-footer {
    background: linear-gradient(to top, rgba(#000000, 0.15), transparent);
  }
}
</style>

<template>
  <view class="image-editor">
    <canvas disable-scroll canvas-id="myCanvas" id="myCanvas" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" :style="{ width: attribute.showWidth + 'px', height: attribute.showHeight + 'px' }"></canvas>
    <view class="page-footer">
      <view class="colors-btn" v-if="operateType === '1'">
        <view class="colors-wrap">
          <view class="color-wrap" v-for="(co, index) in colors" :key="index">
            <view class="color-body" @click="setColor(co)" :class="{ 'color-active': activeColor === co }" :style="{ background: co }"></view>
          </view>
        </view>
        <text class="iconfont cancel-icon" :style="{ color: drawInfo.length ? '#000000' : '#ffffff' }" @click="cancelDraw">&#xe60e;</text>
      </view>
      <view class="option-wrap">
        <view class="btns-wrap">
          <text class="iconfont op-icon" @click="setOperate('1')" :class="{ active: operateType === '1' }">&#xe609;</text>
          <!-- <text class="iconfont op-icon" @click="setOperate('2')" :class="{ active: operateType === '2' }">&#xe69b;</text>
          <text class="iconfont op-icon" @click="setOperate('3')" :class="{ active: operateType === '3' }">&#xe676;</text> -->
        </view>
        <view class="submit-wrap" @click="saveImg"> 完成 </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'image-editor',
  data() {
    return {
      colors: ['#ffffff', '#000000', '#f85051', '#fa9d3a', '#fbc200', '#90d202', '#30c15f', '#35adff'],
      activeColor: '#f85051',
      operateType: '1',
      thumbUrl: '',
      attribute: {
        width: 0,
        height: 0,
        HW: 0,
        WH: 0,
        showWidth: 0,
        showHeight: 0
      },
      context: null,
      // 储存坐标信息
      drawInfo: [],
      points: [],
      isDraw: false,
      oldUrl: '',
      projectName: '',
      userInfo: {}
    }
  },
  onLoad(query) {
    const { O_USER_INFO } = this.$constant;
    this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
    this.oldUrl = query.thumb || ''
    this.thumbUrl = query.thumb || ''
    this.projectName = query.projectName || ''
  },
  onReady() {
    this.context = uni.createCanvasContext('myCanvas', this)
    if (this.thumbUrl) {
      this.getImgInfo()
    }
  },
  methods: {
    setColor(val) {
      this.activeColor = val
    },
    setOperate(val) {
      this.operateType = val
    },
    getImgInfo() {
      uni.getImageInfo({
        src: this.thumbUrl,
        success: (img) => {
          const { screenWidth } = uni.getSystemInfoSync()
          this.attribute.width = img.width
          this.attribute.height = img.height
          this.attribute.HW = Number((img.width / img.height).toFixed(4))
          this.attribute.WH = Number((img.height / img.width).toFixed(4))
          this.attribute.showWidth = screenWidth
          this.attribute.showHeight = this.attribute.showWidth * this.attribute.WH
          setTimeout(() => {
            this.context.drawImage(this.thumbUrl, 0, 0, this.attribute.showWidth, this.attribute.showHeight)
            this.context.draw(true)
          }, 500)
        }
      })
    },
    touchstart(e) {
      if (this.operateType === '1') {
        this.isDraw = true
        let startX = e.changedTouches[0].x
        let startY = e.changedTouches[0].y
        let startPoint = {
          X: startX,
          Y: startY
        }
        this.points.push(startPoint)
        this.context.beginPath()
        this.context.setStrokeStyle(this.activeColor)
        this.context.setLineWidth(2)

        this.drawInfo.push({
          color: this.activeColor,
          lineWidth: 2,
          startPoint: startPoint,
          points: []
        })
        if (this.timer) {
          clearTimeout(this.timer)
        }
      }
    },
    touchmove(e) {
      if (!this.isDraw) {
        return
      }
      let moveX = e.changedTouches[0].x
      let moveY = e.changedTouches[0].y
      let movePoint = {
        X: moveX,
        Y: moveY
      }
      this.points.push(movePoint) //存点
      this.drawInfo[this.drawInfo.length - 1].points.push(movePoint)
      let len = this.points.length
      if (len >= 2) {
        this.draw() //绘制路径
      }
    },
    touchend() {
      this.isDraw = false
      this.points = []
      this.drawWithInfo()
    },
    draw() {
      let point1 = this.points[0]
      let point2 = this.points[1]
      this.points.shift()
      this.context.moveTo(point1.X, point1.Y)
      this.context.lineTo(point2.X, point2.Y)
      this.context.stroke()
      this.context.draw(true)
    },
    // 根据坐标信息绘制图形
    drawWithInfo() {
      this.context.clearRect(0, 0, this.attribute.showWidth, this.attribute.showHeight)
      this.context.drawImage(this.thumbUrl, 0, 0, this.attribute.showWidth, this.attribute.showHeight)
      this.drawInfo.forEach((item) => {
        this.context.strokeStyle = item.color
        this.context.beginPath()
        this.context.moveTo(item.startPoint.X, item.startPoint.Y)
        item.points.forEach((point) => {
          this.context.lineTo(point.X, point.Y)
        })
        this.context.stroke()
        this.context.draw(true)
      })
    },
    cancelDraw() {
      if (this.drawInfo.length) {
        this.drawInfo.pop()
        this.drawWithInfo()
        if (!this.drawInfo.length) {
          this.context.draw(true)
        }
      }
    },
    saveImg() {
      console.log(this.attribute)
      // 开始绘制矩形
      this.context.rect(this.attribute.showWidth - 150, this.attribute.showHeight - 60, 140, 50)
      this.context.setFillStyle('#6a8f82')
      this.context.setGlobalAlpha(0.6)
      this.context.fill()
      // 开始绘制文字
      this.context.setGlobalAlpha(1)
      this.context.setFillStyle('#ffffff')
      this.context.setTextBaseline('bottom')
      this.context.setFontSize(12)
      this.context.fillText(this.userInfo.userName, this.attribute.showWidth - 140, this.attribute.showHeight - 40, 40)
      const metrics = this.context.measureText(this.userInfo.userName)
      this.context.setFontSize(10)
      let date = this.$dayjs().format('YYYY/MM/DD')
      let dateLeftWidth = this.attribute.showWidth - 135 + (metrics.width && metrics.width > 40 ? 40 : metrics.width)
      this.context.fillText(date, dateLeftWidth, this.attribute.showHeight - 40, 60)
      // 开始绘制分割线
      this.context.beginPath()
      this.context.moveTo(this.attribute.showWidth - 140, this.attribute.showHeight - 35)
      this.context.lineTo(this.attribute.showWidth - 20, this.attribute.showHeight - 35)
      this.context.strokeStyle = '#ffffff'
      this.context.setLineWidth(1)
      this.context.stroke()
      // 开始绘制项目名
      this.context.setFontSize(10)
      this.context.fillText(this.projectName, this.attribute.showWidth - 140, this.attribute.showHeight - 20, 130)
      this.context.draw(true)
      uni.canvasToTempFilePath({
        canvasId: 'myCanvas',
        destWidth: this.attribute.width > 800 ? 800 : this.attribute.width,
        destHeight: this.attribute.width > 800 ? 800 * this.attribute.WH : this.attribute.height,
        success: (res) => {
          // 在H5平台下，tempFilePath 为 base64
          console.log(res.tempFilePath)
          const eventChannel = this.getOpenerEventChannel()
          eventChannel.emit('imgEvent', res.tempFilePath)
          uni.navigateBack();
        }
      })
    }
  }
}
</script>
