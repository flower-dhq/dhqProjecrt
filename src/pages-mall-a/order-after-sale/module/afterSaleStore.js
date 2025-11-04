const orderInfo = [
  // 等待审核
  {
    key: { asState: 1, type: 'pendingReview' },
    value: {
      pageInfo: {
        progress: { status: '等待审核', descript: '您的申请已提交，等待商家审核' },
        bottomBtn: { isEnable: true, text: '取消申请', success: '取消申请成功', failed: '取消申请失败' }
      }
    }
  },
  // 审核已拒绝
  {
    key: { asState: 2, type: 'refundRefused' },
    value: {
      pageInfo: {
        progress: { status: '审核拒绝', descript: '拒绝原因：商家拒绝申请售后' },
        bottomBtn: { isEnable: true, text: '删除售后单', success: '删除申请成功', failed: '删除申请失败' }
      }
    }
  },
  // 等待发货（审核通过，下一步是等待收货）
  {
    key: { asState: 3, type: 'waitForDelivery' },
    value: {
      pageInfo: {
        progress: { status: '审核通过', descript: '请按照商家提供的收货地址发货' },
        bottomBtn: { isEnable: true, text: '提交单号', success: '快递信息提交成功', failed: '快递信息提交失败' }
      }
    }
  },
  // 等待收货（审核通过，下一步是收到货）
  {
    key: { asState: 4, type: 'waitForDelivery' },
    value: {
      pageInfo: {
        progress: { status: '等待收货', descript: '等待商家收到货' },
        bottomBtn: { isEnable: false }
      }
    }
  },
  // 收到货（下一步是退款成功）
  {
    key: { asState: 5, type: 'received' },
    value: {
      pageInfo: {
        progress: { status: '等待退款', descript: '收到货，等待商家退款' },
        bottomBtn: { isEnable: false }
      }
    }
  },
  // 退款成功
  {
    key: { asState: 6, type: 'refundSuccess' },
    value: {
      pageInfo: {
        progress: { status: '退款成功', descript: '商家已退款' },
        bottomBtn: { isEnable: true, text: '删除售后单', success: '删除申请成功', failed: '删除申请失败' }
      }
    }
  },
  // 售后申请已取消
  {
    key: { asState: 7, type: 'refundCancel' },
    value: {
      pageInfo: {
        progress: { status: '申请已取消', descript: '您的退货申请已取消' },
        bottomBtn: { isEnable: true, text: '删除售后单', success: '删除申请成功', failed: '删除申请失败' }
      }
    }
  },
  // 退款失败
  {
    key: { asState: 9, type: 'refundFailed' },
    value: {
      pageInfo: {
        progress: { status: '退款失败', descript: '退款失败，需要联系商家' },
        bottomBtn: { isEnable: false }
      }
    }
  },
  // 退款中
  {
    key: { asState: 10, type: 'received' },
    value: {
      pageInfo: {
        progress: { status: '退款中', descript: '商家已同意你的申请，等待商家退款' },
        bottomBtn: { isEnable: false }
      }
    }
  }
]

const setupList = {
  pendingReview: {
    prefix: { isEnable: true, type: 'icon', content: '/pages-mall/static/shop/line_one_icon.png' },
    suffix: { isEnable: true, type: 'text', content: '待审核' }
  },
  waitForDelivery: {
    prefix: { isEnable: true, type: 'icon', content: '/pages-mall/static/shop/line_two_icon.png' },
    suffix: { isEnable: true, type: 'text', content: '已通过' }
  },
  received: {
    prefix: { isEnable: true, type: 'icon', content: '/pages-mall/static/shop/line_three_icon.png' },
    suffix: { isEnable: true, type: 'text', content: '收到退货' }
  },
  refundSuccess: {
    prefix: { isEnable: true, type: 'icon', content: '/pages-mall/static/shop/line_four_icon.png' },
    suffix: { isEnable: true, type: 'text', content: '退款成功' }
  },
  refundRefused: {
    prefix: { isEnable: true, type: 'icon', content: '/pages-mall/static/shop/line_five_icon.png' },
    suffix: { isEnable: true, type: 'text', content: '已拒绝' }
  },
  refundCancel: {
    prefix: { isEnable: true, type: 'icon', content: '/pages-mall/static/shop/line_five_icon.png' },
    suffix: { isEnable: true, type: 'text', content: '已取消' }
  },
  refundFailed: {
    prefix: { isEnable: true, type: 'icon', content: '/pages-mall/static/shop/line_four_icon.png' },
    suffix: { isEnable: true, type: 'text', content: '退款失败' }
  }
}

// key: asType, value: orderInfo.key.asState
const afterSaleType = {
  // 我要退货退款
  '50': ['pendingReview', 'waitForDelivery', 'received', 'refundSuccess'],
  // 我要换货
  '20': ['pendingReview', 'waitForDelivery', 'refundSuccess'],
  // 仅退款(无需退货)
  '40': ['pendingReview', 'waitForDelivery', 'refundSuccess']
}

class AfterSaleStore {
  constructor() {
    this.init()
  }

  init() {
    this._store = new WeakMap()

    // default data
    orderInfo.forEach(item => {
      this._store.set(item.key, item.value)
    })
  }

  /**
   * 获取orderInfo的key
   * @param {number|string} val
   * @example getKey(1)
   * getKey('pendingReview')
   */
  getKey(val) {
    const selObj = orderInfo.find(item => {
      const temp = item.key
      return temp.asState === val || temp.type === val
    })

    if (typeof selObj === 'undefined') {
      throw new Error(`The after sale order type '${val}' is not defined.`)
    }

    return (selObj && selObj.key) || undefined
  }

  /**
   * 获取ordernfo的value
   * @param {number|string} val
   * @example getValue(1)
   * getValue('pendingReview')
   */
  getValue(val) {
    const mapKey = this.getKey(val)
    return this._store.get(mapKey)
  }

  /**
   * 根据售后订单类型获取步骤条数据setupList
   * @param {number} asState 对应orderInfo.key
   * @param {number} asType 退货类型
   * @example getSetupList(1)
   * getSetupList('pendingReview')
   */
  getSetupList(asState, asType) {
    if (asState === 2) {
      // 审核拒绝
      return ['pendingReview', 'refundRefused'].map(type => ({ ...setupList[type], label: type }))
    } else if (asState === 9) {
      // 退款失败
      return ['refundFailed'].map(type => ({ ...setupList[type], label: type }))
    } else if (asState === 7) {
      // 申请已取消
      return ['pendingReview', 'refundCancel'].map(type => ({ ...setupList[type], label: type }))
    } else {
      // 其他情况
      return afterSaleType[asType].map(type => ({ ...setupList[type], label: type }))
    }
  }

  /**
   * 根据售后订单类型获取页面展示内容
   * @param {number|string} val
   * @example getPageInfo(1)
   * getPageInfo('pendingReview')
   */
  getPageInfo(val) {
    const mapValue = this.getValue(val)

    return mapValue.pageInfo
  }
}

export default new AfterSaleStore()
