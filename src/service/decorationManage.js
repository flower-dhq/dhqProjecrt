import uniHttp from './uni-request'

const servicePath = '/decorationManage'

//我的装修申请 - 获取装修申请列表
export const getDecorateApplyList = (pathArr,params = {}) => {  
  const args = {
    url: servicePath + "/decorationApp/page/"+pathArr[0]+'/'+pathArr[1],
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//装修申请统计
export const selectNumber = (params = {}) => {  
  const args = {
    url: servicePath + "/decoration/selectNumber",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//申请验收
export const applyAcceptance = (decorationId,params = {}) => {  
  const args = {
    url: servicePath + "/decorationApp/applyAcceptance/"+decorationId,
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//取消装修
export const cancelDecorate = (params = {}) => {  
  const args = {
    url: servicePath + "/decorationApp/cancel",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//装修类型
export const getDicDetailType = (params = {}) => {  
  const args = {
    url: servicePath + "/dicDetail/getDicDetailType",
    method: "POST",
    params:{data:params}
  };
  console.log("params",params);
  return uniHttp.request(args);
};

//装修申请 - 添加申请
export const addAPPDecoration = (params = {}) => {  
  const args = {
    url: servicePath + '/decorationApp/addAPPDecoration',
    method: "POST",
    params
  };
  return uniHttp.request(args);
};


//获取灭火器数量
export const fireExtinguisherNum = (infoId,params = {}) => {  
  const args = {
    url: servicePath + `/decorationApp/fireExtinguisherNum/${infoId}`,
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//装修详情
export const selectDecoration = (params = {}) => {  
  const args = {
    url: servicePath + "/decoration/selectDecoration",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};