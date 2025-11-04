/**
 * 将接口返回的null转换为undefined
 * @param {any} data 接口返回的数据
 * @param {object} options 配置
 * @param {boolean} options.deep 是否深遍历，默认false
 */
export default function handleDataOfNull(data, options = { deep: false }) {
  if (options.deep) {
    // 深遍历
    return deepLoop(data)
  } else {
    // 浅遍历
    return shallowLoop(data)
  }
}

/**
 * 判断是否为null
 * @param {any} val
 */
function isNull(val) {
  return val === null
}

/**
 * 获取类型
 * @param {any} val
 */
function getType(val) {
  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      return 'array'
    } else if (val === null) {
      return 'null'
    } else {
      return 'object'
    }
  } else if (typeof val === 'number') {
    return isNaN(val) ? 'NaN' : 'number'
  } else {
    return typeof val
  }
}

/**
 * 深遍历
 */
function deepLoop(data) {
  const type = getType(data)

  if (type === 'object') {
    return Object.keys(data).reduce((pre, key) => {
      const val = data[key]

      pre[key] = deepLoop(val)
      return pre
    }, {})
  } else if (type === 'array') {
    return data.map(item => deepLoop(item))
  } else if (type === 'null') {
    return undefined
  } else {
    return data
  }
}

/**
 * 浅遍历
 */
function shallowLoop(data) {
  const type = getType(data)
  
  if (type === 'object') {
    return Object.keys(data).reduce((pre, key) => {
      const val = data[key]

      pre[key] = isNull(val) ? undefined : val
      return pre
    }, {})
  } else if (isNull(data)) {
    return undefined
  } else {
    return data
  }
}