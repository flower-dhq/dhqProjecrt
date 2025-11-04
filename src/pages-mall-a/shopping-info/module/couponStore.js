/**
 * 处理优惠券
 */
import { miniStore } from '@/js/miniStore'
import dayjs from 'cl-uni/utils/dayjs'

export const state = miniStore('couponStore', () => {
  return {
    selCouponId: '',
    selCoupon: {}
  }
})

export const mutations = {
  setSelCoupon(id = '', obj = {}) {
    state().selCouponId = id
    state().selCoupon = obj
  }
}

/**
 * 格式化数据
 */
export function formatCoupon(arr = []) {
  // couponType: 优惠券类型 { 1: 满x元减y元, 2: 满x件减y元, 3: 满x元减y折扣, 4: 满x件减y折扣, 5: 无门槛立减y元, 11: 优惠码(可给他人使用) }
  function fnDesc(type, x, y) {
    const tmp = {
      1: `满${x}元减${y}元`,
      2: `满${x}件减${y}元`,
      3: `满${x}元减${y}折`,
      4: `满${x}件减${y}折`,
      5: `无门槛立减${y}元`
    }
    return tmp[type]
  }

  // 如果是元，x和y 表示分，所以要除以100
  function fnStartNumber(type, x) {
    return [1, 3].includes(type) ? x / 100 : x
  }

  /**
   * 如果是元，x和y 表示分，所以要除以100
   * 如果是折，x和y 表示百分制，所以要除以10
   */
  function fnEndNumber(type, y) {
    let res = 0

    switch (type) {
      case 1:
      case 2:
      case 5:
        res = y / 100
        break
      case 3:
      case 4:
        res = y / 10
        break
      default:
        res = y
    }
    return res
  }

  // effectiveType: 有效类型 { 1: 固定日期:yyyy-MM-dd HH:mm:ss, 2: 倒计时:天 }
  function fnEffective(type, num) {
    let res = ''
    switch (type) {
      case 1:
        // 判断有效期是否为今日过期
        const isEffect = dayjs(new Date(num)).format('YYYY-MM-DD') === dayjs(Date.now()).format('YYYY-MM-DD')
        res = isEffect ? '今日到期' : '有效期至 ' + dayjs(new Date(num)).format('YYYY-MM-DD')
        break
      case 2:
        res = '自领取之日起' + num + '天内有效'
        break
    }

    return res
  }

  return arr.map(item => {
    const startNum = fnStartNumber(item.couponType, item.couponStartNumber)
    const endNum = fnEndNumber(item.couponType, item.couponValue)

    // 优惠券状态 receiveState: 领取状态 { 1: 可领取, 2: 已领取 }
    // const couponState = item.receiveState === 1 ? 'receiving' : 'useing'

    return {
      ...item,
      couponStartNumber: startNum,
      couponValue: endNum,
      couponTypeSrc: fnDesc(item.couponType, startNum, endNum),
      effectiveTypeSrc: fnEffective(item.effectiveType, item.effectiveTime.replace(/\-/g, '/').replace(/\.[0-9]+$/, '')),
    }
  })
}