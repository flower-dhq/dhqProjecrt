class CanvasPosition {
  constructor() {
    this.hasSystem = false
    this.pageHeight = 0 // 页面高度，去除底部安全距离
    this.top = 0 // canvas离页面顶部距离
    this.scrollTop = 0 // 页面滚动的距离
    this.zoomFlag = false // canvas是否放大
  }

  // 获取页面高度
  setPageInfo(otherHeight) {
    if (this.hasSystem) return
    this.hasSystem = true

    uni.getSystemInfo().then(res => {
      const item = Array.isArray(res) ? res.find(token => !!token) : res
      this.pageHeight = item.windowHeight
    })
  }
  
  // 设置canvas的位置信息
  setCanvasInfo(options) {
    options = options || {}
    
    if (this.zoomFlag) {
      this.zoomFlag = false
      this.top = 0
      this.scrollTop = 0
    } else {
      this.top = options.top
      this.scrollTop = options.scrollTop
      this.zoomFlag = true
    }
  }

  // 禁止页面滚动
  disableScroll() {
    if (this.zoomFlag) {
      uni.pageScrollTo({
        scrollTop: this.scrollTop
      })
    }
  }
}

export default CanvasPosition