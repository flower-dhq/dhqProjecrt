/**账单详情 */
let detailList = []

export function setAccountDetail(list = []) {
  detailList = list || []
}

export function getAccountDetail() {
  return detailList || []
}