/**
 * 处理商品
 */
import { miniStore } from '@/js/miniStore'

const __shopTypeConfig = {
  0: 'default', // 普通商品
  1: 'group', // 团购商品
  2: 'second', // 秒杀商品
  3: 'integral', // 积分商品
  4: 'seller', // 分销商品
  default: 'default', // 默认值，默认为普通商品
}

export const state = miniStore('shopStore', () => {
  return {
    shopInfo: {},
    shopId: '',
    shopType: '',
    carouselImg: [], // 轮播图
    shopName: '',
    isFavority: false, // 是否收藏
    source: '', // 商品来源
  }
})

export const mutations = {
  setShopInfo(obj = {}) {
    state().shopInfo = Object.freeze(obj)
    state().carouselImg = state().shopInfo.files || []
    state().shopName = state().shopInfo.gmName
    mutations.setisFavority(state().shopInfo.favorites)
    mutations.setSource(state().shopInfo.sellerSource)
  },
  setShopId(val) {
    state().shopId = val
  },
  setShopType(key = '0') {
    state().shopType = __shopTypeConfig[key] || __shopTypeConfig['default']
  },
  setisFavority(bool) {
    state().isFavority = bool
  },
  setSource(num) {
    const tmp = {
      0: '自营',
      default: '加盟'
    }
    state().source = tmp[num] || tmp['default']
  }
}


