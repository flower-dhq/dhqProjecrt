import uniHttp from "./uni-request"; 
const servicePath = "/api-gateway/enterprise-wechat-service"; // 接口服务路径名
const providerServicePath = "/api-gateway/enterprise-wechat-service-provider"; // 商务服务路径名

// 获取舆情预警列表
export const getEarlyWarningPage = (params = {}) => {
  const args = {
    url: servicePath + "/earlyWarningRecord/page",
    method: "POST",
    params
  };
  return uniHttp.request(args);
}; 
// 获取舆情预警详情
export const getEarlyWarningDetailById = (params = {}) => {
  const args = {
    url: servicePath + "/earlyWarningRecord/byId",
    method: "GET",
    params 
  };
  return uniHttp.request(args);
}; 
// 获取舆情预警操作日志
export const getLogList = (params = {}) => {
  const args = {
    url: servicePath + "/earlyWarningRecord/logList",
    method: "GET",
    params 
  };
  return uniHttp.request(args);
}; 
// 处理预警
export const confirmreportProgress = (params = {}) => {
  const args = {
    url: servicePath + "/earlyWarningRecord/confirm",
    method: "POST",
    params 
  };
  return uniHttp.request(args);
}; 
// 关闭预警
export const closeProgress = (params = {}) => {
  const args = {
    url: servicePath + "/earlyWarningRecord/close",
    method: "POST",
    params 
  };
  return uniHttp.request(args);
}; 
// 汇报进展
export const reportProgress = (params = {}) => {
  const args = {
    url: servicePath + "/earlyWarningRecord/reportProgress",
    method: "POST",
    params
  };
  return uniHttp.request(args);
}; 
// 获取群组
export const getContactGroupList = (params = {}) => {
  const args = {
    url: servicePath + "/contactGroup/getContactGroupList",
    method: "POST",
    params 
  };
  return uniHttp.request(args);
}; 
// 企微授权登录
export const staffLogin = (params = {}) => {
  const args = {
    url: servicePath + "/authOwner/staffLogin",
    method: "GET",
    params 
  };
  return uniHttp.request(args);
}; 
// 企微商务授权登录
export const staffproviderLogin = (params = {}) => {
  const args = {
    url: providerServicePath + "/authOwner/staffLogin",
    method: "GET",
    params 
  };
  return uniHttp.request(args);
}; 
// 常用链接
export const getCompanyAgentMaterialList = (params = {}) => {
  const args = {
    url: servicePath + "/companyAgentMaterial/getCompanyAgentMaterialList",
    method: "POST",
    params 
  };
  return uniHttp.request(args);
}; 
// 根据外部联系人ID查询详情
export const getOwnerInfoByUserId = (params = {}) => {
  const args = {
    url: servicePath + "/ownerInfo/getOwnerInfoByUserId",
    method: "GET",
    params 
  };
  return uniHttp.request(args);
}; 

// 获取舆情预警列表
export const getWarningRecordPageInMini = (params = {}) => {
  const args = {
    url: servicePath + "/earlyWarningRecord/getWarningRecordPageInMini",
    method: "POST",
    params: {
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    },
  };
  return uniHttp.request(args);
}; 

// 获取触发人信息
export const getTriggerUserInfo = (params = {}) => {
  const args = {
    url: servicePath + "/earlyWarningRecord/getTriggerUserInfo",
    method: "GET",
    params
  };
  return uniHttp.request(args);
}; 

// 获取聊天记录
export const getWechatRecord = (params = {}) => {
  const args = {
    url: servicePath + "/earlyWarningRecord/getWechatRecord",
    method: "GET",
    params
  };
  return uniHttp.request(args);
}; 
