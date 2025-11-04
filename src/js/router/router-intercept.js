import { changePageTitle } from './router-utils'

export default function routerInterceptor() {
  return {
    // 路由进入事件，包括进入页面的操作（触发的是onLoad），返回页面的操作（触发的是onShow），都会触发
    onEnter(to, from) {
    },
    onShow(to, from) {
      changePageTitle(to, from)
    },
    // 页面离开时，包括页面的展示隐藏操作（触发的是onHide），页面的卸载操作（触发的是onUnload），都会触发
    onLeave(fullPath) {
    },
  }
}