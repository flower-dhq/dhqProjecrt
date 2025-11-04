/**
 * 处理规格
 */
import { miniStore } from '@/js/miniStore'
import Vue from 'vue'

const __specTypeConfig = {
  0: 'default', // 普通商品
  1: 'group', // 团购商品
  2: 'second', // 秒杀商品
  3: 'integral', // 积分商品
  4: 'default', // 分销商品
  default: 'default' // 默认值，默认为普通商品
}

export const state = miniStore('specStore', () => {
  return {
    specMap: Object.freeze(new Map()), // 规格数据
    selSpecId: '', // 被选中的规格id
    shopNum: 0, // 商品数量
    isCodeIn: false, //判断该商品是不是扫码进来
    isStock: true //是否有库存   true 有库存   false  无库存
  }
})

export const mutations = {
  setSpecMap(list = []) {
    // state().specMap = Object.freeze(new Map()) //解决state值更新后，getters没有更新的问题
    state().specMap.clear()
    list.forEach(item => {
      const stockCount = item.promotionActivity?.stockCount || item.storeCount

      state().specMap.set(item.gsId, {
        ...item,
        disabled: stockCount <= 0
      })
    })
  },
  setSpecDisable(gsId = '', bool = false) {
    const val = state().specMap.get(gsId)
    Vue.set(val, 'disabled', bool)
  },
  setSelSpecId(val) {
    state().selSpecId = val
  },
  setShopNum(num = 0) {
    state().shopNum = num < 0 ? 0 : num
  },
  setIsStock(val) {
    state().isStock = val
  }
}

export const getters = {
  getSelSpec() {
    return state().specMap.get(state().selSpecId) || {}
  },
  getSelSpecType() {
    const tmp = getters.getSelSpec()
    let key = tmp.promotionActivity?.promotionTypeNum || '0'
    return __specTypeConfig[key] || __specTypeConfig['default']
  },
  // 如果是普通商品，返回'default'；如果是活动商品，判断是已到活动时间(startState = true)，返回'startActive'，还没到活动时间，返回'noActive'
  isStartActive() {
    // [default, startActive, noActive]
    return getters.getSelSpecType() === 'default'
      ? 'default'
      : getters.getSelSpec().promotionActivity.startState
      ? 'startActive'
      : 'noActive'
  },
  // 原来价格
  getDefaultPrice() {
    if (state().isCodeIn && getters.getSelSpec().promotionActivity) {
      //促销活动专用
      return Number(getters.getSelSpec().promotionActivity.activityPrice)
    }
    return Number(getters.getSelSpec().price)
  },
  // 活动价格
  getPromoPrice() {
    return getters.getSelSpecType() === 'default' ? 0 : Number(getters.getSelSpec().promotionActivity.activityPrice)
  },
  // 如果是活动商品，则获取活动价格；如果是普通商品，则获取原来价格
  getSpecPrice() {
    return getters.getSelSpecType() === 'default' ? getters.getDefaultPrice() : getters.getPromoPrice()
  },
  // 如果是活动商品，则获取promotionActivity里的库存；如果是普通商品，则获取普通库存
  getStoreCount() {
    return getters.getSelSpecType() === 'default'
      ? getters.getSelSpec().storeCount
      : getters.getSelSpec().promotionActivity?.availableCount
  }
}

/**
 * 获取默认的规格id
 * 注意，如果是普通商品，则获取isDefault=1的规格；
 * 如果是活动，则获取当前活动相关的规格；
 * 如果规格库存为0，则获取规格库存不为0的；
 * 否则，默认获取第一个规格
 * @param {string} shopType 商品类型
 */
export function defaultSpecId(shopType, specId) {
  const list = getMapValues()
  if (list.length === 0) return ''
  let gsId = ''

  if (shopType === 'default') {
    const res = list.find(item => item.isDefault === 1)

    gsId = !res ? '' : res.storeCount ? res.gsId : ''
  } else {
    const res = list.find(item => {
      if (item.promotionActivity) {
        const key = item.promotionActivity.promotionTypeNum
        return shopType === __specTypeConfig[key]
      } else {
        return false
      }
    })

    gsId = !res ? '' : res.storeCount ? res.gsId : ''
  }

  if (!gsId) {
    const res = list.find(item => item.storeCount)
    gsId = res ? res.gsId : ''
  }

  if (!!specId) {
    //首次今天有规格id优先显示
    gsId = specId
  }

  return gsId || list[0].gsId || ''
}

/**
 * 团购活动使用，如果是通过 “我要开团” 和 “参团” 模式选择规格的话，需要将不是团购类型的规格禁止掉，等退出选择规格后再显示出来
 */
export function disableSpecByGroup(bool = false) {
  for (let [key, item] of state().specMap.entries()) {
    if (item.promotionActivity?.promotionTypeNum !== 1) {
      mutations.setSpecDisable(key, bool)
    }
  }
  // 需要调用 this.$forceUpdate() 强制更新
}

/**
 * 将getSelSpecType转换为数字
 */
export function transformTextToNum(text) {
  const arr = Object.keys(__specTypeConfig).slice(0, -1)
  const val = text || getters.getSelSpecType()
  const key = arr.find(key => __specTypeConfig[key] === val)
  return Number(key)
}

/**
 * __specTypeConfig，将key转换为value
 */
export function transformNumToText(num) {
  const val = __specTypeConfig[num] || __specTypeConfig['defualt']
  return val
}

/**
 * 用于v-for遍历
 */
export function getMapValues() {
  return Array.from(state().specMap.values())
}
