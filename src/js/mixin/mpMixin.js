import Util from '@/js/utils'

export default {
  // #ifdef MP-WEIXIN
  // 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性
  options: {
    virtualHost: true
  },
  // #endif
  props: {
    // 自定义类名
    customClass: {
      type: [Object, Array, String],
      default: () => []
    },
    // 自定义样式
    customStyle: {
      type: [Object, String],
      default: () => ({})
    },
  },
  computed: {
    getCustomClass() {
      let tmp = this.customClass
      if (Util.kindOf(tmp) == 'string') {
        return tmp.trim().split(/\s+/)
      } else if (Util.kindOf(tmp) == 'object') {
        return obj2Arr(tmp)
      }
      return tmp
    },
    getCustomStyle() {
      if (Util.kindOf(this.customStyle) == 'string') {
        return uni.$u.addStyle(this.customStyle, 'object')
      }
      return this.customStyle
    }
  }
}

/**
 * 将对象转为数组
 */
function obj2Arr(target = {}) {
  let res = Object.keys(target).reduce((res, key) => {
    if (target[key]) {
      res.push(key)
    }
    return res
  }, [])
  return res
}