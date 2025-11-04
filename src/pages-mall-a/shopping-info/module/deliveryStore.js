/**
 * 处理配送方式
 */
import { miniStore } from '@/js/miniStore'

const __deliParamConfig = {
  1: '4',
  2: '5',
  3: '6',
  4: '7'
}
const __deliMethodConfig = {
  1: '快递配送',
  2: '商家配送',
  3: '自取'
}

export const state = miniStore('deliveryStore', () => {
  return {
    deliveryMethod: Object.freeze(new Map()),
    selDeliveryId: '' // 被选中的配送方式的id
  }
})

export const mutations = {
  setDeliveryMethod(arr = []) {
    arr.forEach(item => state().deliveryMethod.set(item.deliveryMethod, { key: item.deliveryMethod, value: __deliMethodConfig[item.deliveryMethod] }))
  },
  setSelDeliveryId(val) {
    state().selDeliveryId = val
  }
}

export const getters = {
  getSelDelivery() {
    return state().deliveryMethod.get(state().selDeliveryId)
  }
}

/**
 * 获取默认的配送方式
 * 默认选择第一个配送方式
 */
export function defaultDeliId() {
  const list = Array.from(state().deliveryMethod.keys())

  return list[0] || ''
}

/**
 * 加入购物车时使用
 * 获取配送方式。{ 1: 快递配送, 2: 商家配送, 3: 自取 }
 */
export function getDeliveryMode() {
  if (Object.values(__deliParamConfig).includes(state().selDeliveryId)) {
    return 1
  } else {
    return Number(state().selDeliveryId)
  }
}

/**
 * 用于v-for遍历
 */
export function getMapValues() {
  return Array.from(state().deliveryMethod.values())
}

/**
 * 根据__deliMethodConfig，将key转换为value
 */
export function getTextByDeliMethod(key) {
  return __deliMethodConfig[key] || ''
}
