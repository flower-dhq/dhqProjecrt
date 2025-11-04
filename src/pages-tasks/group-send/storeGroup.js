let groupList = []

/**
 * 选择群聊-存储选择的群聊数据
 */
const storeGroup = {
  /**
   * 初始化数据
   * @param {Array} arr
   */
  init(arr) {
    arr = Array.isArray(arr) ? arr : []

    groupList = [].concat(arr)
    return groupList
  },
  /**
   * 存入数据
   * @param {*} item 
   */
  set(item) {
    groupList.push(item)
  },
  /**
   * 获取选择的群聊数据
   */
  get() {
    return [].concat(groupList)
  }
}
export default storeGroup