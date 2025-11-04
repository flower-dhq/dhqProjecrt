import uniHttp from './uni-request';
const servicePath = '/api-gateway'; // 接口服务路径名


/** 商城新的接口写在这 **/

// 根据会员id登录
export const loginByMemberId = (postParams) => {
  const arg = {
    url: servicePath + '/mall-core-service/app/member/loginByMemberId',
    params: postParams || {},
    method: 'POST',
  };
  return uniHttp.request(arg);
};
// 根据Token登录商城
export const getTokenLogin = (postParams) => {
  const arg = {
    url: servicePath + '/mall-core-service/app/member/tokenLogin',
    params: postParams || {},
    method: 'GET',
  };
  return uniHttp.request(arg);
};

// 获取用户信息
export const getUserInfo = (postParams) => {
  const arg = {
    url: servicePath + '/mall-core-service/app/member/byId',
    params: postParams || {},
    method: 'GET',
  };
  return uniHttp.request(arg);
};