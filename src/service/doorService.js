import uniHttp from "./uni-request";
const servicePath = "/community-service"; // 接口服务路径名

// 解除消息提醒
export const updateIsWarn = (params = {}) => {
  const args = {
    url: servicePath + "/entranceGuardBindRecord/updateIsWarnById",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取人脸列表(新一代)
export const getFaceListById = (params = {}) => {
  const args = {
    url: servicePath + "/entranceGuardBindRecord/getUserById",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 人脸图片校验接口
export const faceImgCheckout = (params = {}) => {
  const args = {
    url: servicePath + "/entranceGuardBindRecord/imgCheckout",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//人脸更新证件号
export const updateIdCardByUserId = (params = {}) => {
  const args = {
    url: servicePath + "/entranceGuardBindRecord/updateIdCardByUserId",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//新一代视频监控列表
export const getVideoList = (params = {}) => {
  const args = {
    url: servicePath + "/entranceGuardBindRecord/getVideoList",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//新一代视频监控视频流地址
export const getPreviewURLs = (params = {}) => {
  const args = {
    url: servicePath + "/entranceGuardBindRecord/getPreviewURLs",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

export const saveCrmVisitPassForBluetooth = (params = {}) => {
  const args = {
    url: servicePath + "/crmVisitPass2/saveCrmVisitPassForBluetooth",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

export const getCrmVisitPassDetailForBluetooth = (params = {}) => {
  const args = {
    url: servicePath + "/crmVisitPass2/getCrmVisitPassDetailForBluetooth",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
// 获取访客记录
export const getVisitors = (params = {}) => {
  const args = {
    url: servicePath + "/crmVisitPass/getVisitors",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
// 用户门禁列表
export const getAllDrivesByOwnerId = (params = {}) => {
  const args = {
    url: servicePath + "/appletManage/getAllDrivesByOwnerId",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
// 华业物业格美特门禁生成二维码
export const huaYeGetDoorQrCode = (params = {}) => {
  const args = {
    url: servicePath + "/accessDevice/huaYeGetDoorQrCode",
    method: "POST",
    params 
  };
  return uniHttp.request(args);
};
// 华业物业格美特门禁远程开门
export const huaYeRemoteOpenDoor = (params = {}) => {
  const args = {
    url: servicePath + "/accessDevice/huaYeRemoteOpenDoor",
    method: "POST",
    params 
  };
  return uniHttp.request(args);
};

// 华业物业，保存访客邀请
export const saveCrmVisitPassForHuaYe = (params) => uniHttp.request({
  url: servicePath + '/crmVisitPass/saveCrmVisitPassForHuaYe',
  method: 'POST',
  params
})