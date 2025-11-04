/**
 * 当页面返回时，需要刷新返回后的页面
 */
const pageRefresh = {
  refreshType: new Set(), // 空数组: 表示不需要刷新页面;
  /**
   * 
   * @param {string|array} type 如果为空，表示清除所有；如果传字符串，表示只清除某种情况；如果传数组，表示同时清除多个
   */
  restore(type) {
    if (!type) this.refreshType.clear()
    else if (Array.isArray(type)) {
      type.forEach(item => {
        this.refreshType.delete(item)
      })
    }
    else this.refreshType.delete(type)

    console.log(`【page-refresh】清除刷新标志 ${!type ? '所有': type}`)
  },
  /**
   * 当返回后的页面需要刷新时，在返回前的页面设置刷新标识符
   * @param {string} type 刷新标识符
   */
  setRefresh(type) {
    if (!validator(type)) {
      console.log(`【page-refresh】请填写刷新类型 ${type}`)
      return
    }

    const isHas = this.refreshType.has(type)
    if (type && isHas) {
      console.log(`【page-refresh】刷新类型 ${type} 已重复`)
      return
    }

    if (type && !isHas) {
      console.log(`【page-refresh】设置刷新标志 ${type}`)
      this.refreshType.add(type)
    }
  },
  /**
   * 是否需要刷新页面
   * @param {string|array} type 如果为null(不能是undefined)，表示判断有任一种情况下都要刷新页面；如果传字符串，表示判断指定情况下才需要刷新页面；如果传数组，表示多种情况下才需要刷新页面
   * @param {boolean} auto 默认false。如果需要刷新，返回true，并且自动 restore(type) 重置
   * @returns 
   */
  isRefresh(type, auto) {
    let hasItem = false
    if (type === null) {
      hasItem = !!this.refreshType.size
    } else if (Array.isArray(type)) {
      hasItem = type.every(item => this.refreshType.has(item))
    } else {
      hasItem = this.refreshType.has(type)
    }

    if (hasItem && auto) this.restore(type)

    return hasItem
  }
}

/**需要自己填写pageType，方便调试，请填写大写和下划线 */
function validator(type) {
  const pageType = [
    'OWNER_INFO', // 业户档案的业主资料
    'WORK_ORDER_DETAIL', // 工单详情页面
    'WORK_ORDER_APPROVAL', // 工单审批页面
    'YQWORK_DETAIL', // 舆情预警详情页面
    'KONWLEDGE_DETAIL', // 知识库详情
    'WORK_ORDER_EDIT', // 工单编辑页面
  ]

  return pageType.includes(type)
}

export default pageRefresh