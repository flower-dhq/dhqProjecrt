/**
 * @typedef claimOption
 * @property [string] id
 * @property [string] alias
 * @property [string] label
 * 
 * @param {claimOption} option
 */
export function claimStatus(option) {
  let map = [
    { label: '进行中', id: '1', alias: 'doing' },
    { label: '已完成', id: '2', alias: 'finish' },
    { label: '已取消', id: '-1', alias: 'cancel' },
    { label: '我发布的', id: '', alias: 'publish' }
  ]

  if (!option || Object.keys(option).length === 0) {
    // 不传，或者传空对象
    return map
  }
  
  for (let [optKey, optVal] of Object.entries(option)) {
    for (let item of map) {
      if (item[optKey] === optVal) {
        return { ...item }
      }
    }
  }

  return undefined
}