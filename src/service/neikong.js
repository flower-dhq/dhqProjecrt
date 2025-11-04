import uniHttp from './uni-request'
import appConfig from '@/app-config';
const servicePath = '/neikong'

// 获取房产列表
export const getHouseListByOwnerId = (params = {}) => uniHttp.request({
  url: servicePath + '/customer/getHouseListByOwnerId',
  method: 'POST',
  params
})

