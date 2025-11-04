import { getFunctionButtons2 } from '@/service/landcrm'
import constant from '@/js/constant'
import utils from '@/js/utils'

let isReq = false // 是否请求过接口
let responseData = {} // 存储接口返回的数据

/**
 * 菜单权限，需要在Vue实例属性上配置 authName，要和 接口返回的权限名称 匹配一致
 * @example
 * ```js
 * export default {
 *   authName: '菜单权限名称'
 * }
 * ```
 */
export default {
  async onLoad() {
    // 通过组件实例上的属性 authName ，判断当前页面是否有菜单权限
    const authName = this.$options.authName // 要和 接口返回的权限名称 匹配一致
    if (!authName) return

    const isEnable = useEnableQw()
    if (!isEnable.success) {
      uni.reLaunch({ url: '/pages-a/permission?errorCode=login' })
      return
    }

    if (!isReq) {
      isReq = true

      const params = {
        data: {
          userId: isEnable.data,
          menuTypes: 101,
          belongSystem: 'gj_applet'
        },
        hideLoading: true,
        responseToast: false,
      }
      const result = await getFunctionButtons2(params)
      responseData = result
    }
    
    const systemList = responseData?.data ?? []
    const authList = systemList?.[0]?.items ?? []

    const isFlag = authList.some(group => {
      // 分组
      const arrTmp = group?.items ?? []
      // 判断 当前页面的权限名称，是否和 接口返回的菜单权限名称 匹配一致
      return arrTmp.some(menu => menu.name === authName)
    })
    if (!isFlag) {
      uni.reLaunch({ url: '/pages-a/permission?errorCode=menu' })
    }
  }
}

/**判断用户是否开启企微配置 */
function useEnableQw() {
  const { O_USER_INFO } = constant
  const userInfo = utils.storageAction({ key: O_USER_INFO, action: 'get' })
  
  return (userInfo && userInfo.isEnableQw == '1') ?
    { success: true, data: userInfo.userId } :
    { success: false }
}