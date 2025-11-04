<template>
  <canvas class="sign-position" id="sign-canvas" canvas-id="sign-canvas" :style="{width: canvas.width, height: canvas.height, border: '1px dashed #ebebeb'}" disable-scroll @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" />
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import { uploadMutiFile } from '@/service/landcrm'

/**
 * 客户签名
 */
export default {
  name: 'SignatureCanvas',
  mixins: [mpMixin],
  data() {
    return {
      ctx: null,
      points: [], // 路径点集合
      lineStyle: {
        width: '4', // 线条宽度
        color: '#000', // 线条颜色
      },
      canvas: {
        width: '100%',
        height: '300rpx'
      },
      formObj: {
        sigFileIds: '', // 文件id
        sigFilesrcs: '', // 文件路径
      },
      filePath: '',
      isDraw: false, // 是否绘画过
    }
  },
  mounted() {
    this.ctx = uni.createCanvasContext('sign-canvas', this)
    
    this.getCanvasInfo()
  },
  methods: {
    // 监听触摸事件，获取到起点
    touchStart(e) {
      const startX = e.changedTouches[0].x
      const startY = e.changedTouches[0].y

      const startPoint = { x: startX, y: startY }
      this.points.push(startPoint)

      // 每次触摸开始，开启新的路径
      this.ctx.beginPath()
    },
    // 监听触摸移动事件，获取到路径点
    touchMove(e) {
      let moveX = e.changedTouches[0].x
      let moveY = e.changedTouches[0].y

      moveX = moveX < 0 ? 0 : moveX
      moveY = moveY < 0 ? 0 : moveY

      const movePoint = { x: moveX, y: moveY }
      this.points.push(movePoint)

      const len = this.points.length
      if (len >= 2) {
        this.draw() // 绘制路径
      }
    },
    // 监听触摸结束事件，将未绘制的点清空防止对后续路径产生干扰
    touchEnd(e) {
      this.points = []
    },
    draw() {
      this.isDraw = true

      const point1 = this.points[0]
      const point2 = this.points[1]

      this.points.shift()

      this.ctx.moveTo(point1.x, point1.y)
      this.ctx.lineTo(point2.x, point2.y)
      this.ctx.setLineWidth(4)
      this.ctx.setStrokeStyle('#000')
      this.ctx.setLineCap('round')
      this.ctx.setLineJoin('round')
      this.ctx.stroke()
      this.ctx.draw(true)
    },
    // 清空画布
    clear() {
      uni.getSystemInfo({
        success: (res) => {
          this.isDraw = false

          const canvasW = res.windowWidth
          const canvasH = res.windowHeight
          this.ctx.clearRect(0, 0, canvasW, canvasH)
          this.ctx.draw(true)
        },
      })
    },
    // 完成绘画并保存到本地
    finish(isTemp) {
      return new Promise(resolve => {
        if (isTemp && this.isDraw) {
          // 每次缩小操作时，先检查是否已经签名，是则先临时保存张图片，防止超出canvas部分丢失
          uni.canvasToTempFilePath({
            canvasId: 'sign-canvas',
            success: (res) => {
              this.filePath = res.tempFilePath
              resolve({})
            }
          }, this)
        } else if (this.filePath) {
          // 如果放大过后，已经保存过图片了，就拿之前
          uploadMutiFile({ filePath: this.filePath, name: 'file' }).then(fileRes => {
            resolve({
              sigFileIds: fileRes.fileInfo.fid,
              sigFilesrcs: fileRes.fileInfo.resPath
            })
          })
        } else {
          // 否则需要保存图片
          uni.canvasToTempFilePath({
            canvasId: 'sign-canvas',
            success: async (res) => {
              const fileRes = await uploadMutiFile({ filePath: res.tempFilePath, name: 'file' })
              resolve({
                sigFileIds: fileRes.fileInfo.fid,
                sigFilesrcs: fileRes.fileInfo.resPath
              })
            }
          }, this)
        }
      })
    },
    // 全屏
    allScreen(isAll) {
      if (isAll) {
        this.canvas.height = '100%'
        this.ctx.restore()
      } else {
        this.canvas.height = '300rpx'
        this.ctx.restore()
      }
    },
    // 获取canvas信息
    getCanvasInfo() {
      const query = uni.createSelectorQuery().in(this)
      query.select('#sign-canvas').boundingClientRect(res => {
        this.canvas.width = res.width + 'px'
        this.canvas.height = res.height + 'px'
      }).exec()
    },
    // 被外部调用。获取是否已经签名了
    getIsSign() {
      return this.isDraw
    }
  }
}
</script>

<style lang="scss" scoped>
#sign-position {
  transition-property: all;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
}
</style>