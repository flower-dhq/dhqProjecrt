let store = null
restore()

/**
 * 重置数据
 */
function restore() {
  console.log('【review-store】restore method')

  store = {
    // 数据
    taskInfo: {
      // CRM配置了按钮的条件权限
      settingAuth: {}
    },
    // 按钮操作类型，参考 ./taskButton.js btnMap 配置
    modelType: {
      name: '',
      id: ''
    }
  }
}

function setData(key, value) {
  if (!Object.keys(store).includes(key)) {
    console.error(`【review-store】key (${key}) 不存在`)
    return
  }

  console.log(`【review-store】setData method, ${key} = `, value)
  store[key] = value
}

function getData(key) {
  if (!key) {
    return Object.assign({}, store)
  } else {
    return store[key]
  }
}

/**
 * 当 工单详情页面 跳转到 操作页面 时，把需要传递的参数保存起来
 */
export default {
  restore,
  setData,
  getData
}