import uniHttp from './uni-request'
const servicePath = '/wechat_guanjia'

export const getOwnerByChatId = (params = {}) => uniHttp.request({
  url: servicePath + '/contactGroup/getOwnerByChatId',
  method: 'GET',
  params
})