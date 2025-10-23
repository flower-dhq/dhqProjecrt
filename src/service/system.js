import uniHttp from './uni-request'

/**
 * 校验用户
 * @param {Object} company
 * @param {Object} name
 */
export const checkUser = (params = {}) => {  
  const args = {
    url: "/sdcp/system/checkUserInfo",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// export function checkUser(unit,name){
// 	return request.post('system/checkUserInfo',{unit,name})
// } 