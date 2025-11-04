import uniHttp from './uni-request'

const servicePath = '/walter'

/**获取商城广告信息 */
export const getShelvesList = (data = {}) => uniHttp.request({
  url: servicePath + '/gbSlideInfo/getShelvesList',
  method: 'POST',
  params: {
    data
  }
})
