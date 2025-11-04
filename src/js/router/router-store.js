import routerInterceptor from './router-intercept'
import { splitRoute } from './router-utils'

const interceptor = routerInterceptor()

// 存储 新路由，上一级路由 的路径，和路由状态信息
let pageInfo = initPageInfo()
global.pageInfo = pageInfo


/**
 * 初始化pageInfo
 */
function initPageInfo() {
  return {
    to: '', // 新路由的路径，格式：[path]?[query]
    from: '', // 上一级路由的路径，格式：[path]?[query]
    isEnter: false,
    isLeave: false,
    isShow: false,
  }
}

/**
 * 重置pageInfo
 */
function resetPageInfo() {
  pageInfo = initPageInfo()
  global.pageInfo = pageInfo
}

function leaveEvent() {
  if (!this.$mp.page) return

  // 当前路由的路径
  const curRoute = this.$mp.page.$page.fullPath
  const curPath = splitRoute(curRoute).path
  const toPath = splitRoute(pageInfo.to).path

  if (toPath === curPath) return
  pageInfo.isLeave = true

  interceptor.onLeave.call(null, curRoute)
}

export const myRouterPlugin = {
  install(vue) {
    vue.mixin({
      onLoad() {
        if (this.$options.__file && this.$options.__file.includes('App.vue')) return
        if (this.$root !== this) return

        const toPath = splitRoute(pageInfo.to).path
        const fromPath = splitRoute(pageInfo.from).path
        const newRoute = this.$mp.page.$page.fullPath
        const newPath = splitRoute(newRoute).path
        const oldRoute = toPath === newPath ? pageInfo.from : pageInfo.to
        const oldPath = splitRoute(oldRoute).path

        if (toPath === newPath && fromPath === oldPath && pageInfo.isEnter) return
        // 页面返回操作时，onShow
        if (toPath !== newPath || fromPath !== oldPath) resetPageInfo()

        pageInfo.to = newRoute
        pageInfo.from = oldRoute
        pageInfo.isEnter = true

        interceptor.onEnter.call(null, newRoute, oldRoute)
      },
      onShow() {
        // 排除APP.vue页面
        if (this.$options.__file && this.$options.__file.includes('App.vue')) return
        // 排除不是最顶层页面
        if (this.$root !== this) return

        // 旧路由的路径
        const toPath = splitRoute(pageInfo.to).path
        const fromPath = splitRoute(pageInfo.from).path
        // 当前路由的路径
        const newRoute = this.$mp.page.$page.fullPath
        const newPath = splitRoute(newRoute).path
        // 上一级路由的路径
        const oldRoute = toPath === newPath ? pageInfo.from : pageInfo.to
        const oldPath = splitRoute(oldRoute).path

        if (toPath === newPath && fromPath === oldPath && pageInfo.isEnter) {
          if (!pageInfo.isShow) {
            // 进入新页面操作时，onLoad -> onShow
            pageInfo.isShow = true
            interceptor.onShow.call(null, newRoute, oldRoute)
          }

          return
        }
        // 页面返回操作时，onShow
        if (toPath !== newPath || fromPath !== oldPath) resetPageInfo()
  
        pageInfo.to = newRoute
        pageInfo.from = oldRoute
        pageInfo.isEnter = true

        interceptor.onEnter.call(null, newRoute, oldRoute)
        interceptor.onShow.call(null, newRoute, oldRoute)
      },
      onHide() {
        if (this.$root !== this) return

        leaveEvent.call(this)
      },
      onUnload() {
        if (this.$root !== this) return

        leaveEvent.call(this)
      },
    })
  }
}

