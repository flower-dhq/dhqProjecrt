let pageTitleStore = {
  title: ''
}

/**
 * 跨页面级的修改标题
 * @typedef {object} TitleOptions
 * @property {string} title
 * 
 * @param {TitleOptions} options
 */
export function savePageTitle(options = {}) {
  pageTitleStore.title = options.title
}

/**
 * 只有来自tabbar页面的操作，才需要修改新页面的标题
 * @param {string} to 新路由的路径，格式：[page]?[query]
 * @param {string} from 上一级路由的路径，格式：[page]?[query]
 */
export function changePageTitle(to, from) {
  const fromPath = splitRoute(from).path
  let tabbar = ['/pages/index/index', '/pages/service/service', '/pages/mine/mine']
  if (tabbar.includes(fromPath) && !tabbar.includes(to) && pageTitleStore.title) {
    uni.setNavigationBarTitle({
      title: pageTitleStore.title
    })
  }
}

/**
 * 根据路由地址分割出信息
 * @param {string} url
 */
export function splitRoute(url) {
  url = decodeURIComponent(url || '')
  let index = url.indexOf('?')
  index = index == -1 ? url.length : index
  
  const pathTmp = url.substring(0, index)
  const queryTmp = url
    .substring(index + 1)
    .split('&')
    .reduce((store, item) => {
      const [key, value] = item.split('=')
      if (key && value) {
        store[key] = value
      } else if (key && !value) {
        store[key] = undefined
      }

      return store
    }, {})

  return {
    fullPath: url,
    path: pathTmp,
    query: queryTmp
  }
}