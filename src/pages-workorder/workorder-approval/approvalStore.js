let store = null
restore()

/**
 * 重置数据
 */
function restore() {
  console.log('【approval-store】restore method')

  store = {
    // agress: 同意, reject: 拒绝
    flagText: 'reject',
    // 工单id
    quesTaskId: '',
    // 从哪个页面跳转过来的
    fromPage: '',
    // 如果是对外回复，需要显示对外回复内容
    externalReply: ''
  }
}

function setData(key, value) {
  if (!Object.keys(store).includes(key)) {
    console.error(`【approval-store】key (${key}) 不存在`)
    return
  }

  console.log(`【approval-store】setData method, ${key} = `, value)
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