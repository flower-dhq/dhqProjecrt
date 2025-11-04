import uniHttp from "./uni-request";
import mpaasFetch from '@/js/mpassFetch';
import commLogic from '@/js/comm-logic'

let servicePath = "/community-service"; 
// let servicePath = "/community"; 
export const getCompanyConfig = (params = {}) => {
  const args = {
    url: servicePath + "/companyConfig/getCompanyConfig",
    method: "POST",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
}; 
// 获取验证码
export const getSmsCode = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/getSmsCode",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 会员登录
export const loginMember = (params = {}) => {
  const args = {
    url: servicePath + "/tboMemberInfo/loginMember",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 会员注册
export const registerMember = (params = {}) => {
  const args = {
    url: servicePath + "/tboMemberInfo/registerMember",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 会员密码修改
export const changPwdByCode = (params = {}) => {
  const args = {
    url: servicePath + "/tboMemberInfo/changPwdByCode",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 会员资料编辑
export const editTboMemberInfo = (params = {}) => {
  const args = {
    url: servicePath + "/tboMemberInfo/editTboMemberInfo",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 广告列表
export const getShelvesList = (params = {}) => { 
  const args = {
    url: servicePath + "/gbSlideInfo2/getShelvesList2",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
// 用户消息数据
export const queryMyMessages = (params = {}) => {  
  const args = {
    url: servicePath + "/message/page/client/owner",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
// 获取用户菜单
export const getAppByCode = (params = {}) => {  
  const args = {
    url: servicePath + "/systemConfig/getAppByCode",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 个人信息
export const selectTboMemberInfo = (params = {}) => {
  const args = {
    url: servicePath + "/tboMemberInfo/selectTboMemberInfo",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};


// 获取用户企业房产
export const findCompanyAuthInfoList = (params = {}) => {  
  const args = {
    url: servicePath + "/enterpriseAuth/findCompanyAuthInfoList",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
// 获取用户房产
export const getOwnerBuildingListComm = (params = {}) => {  
  const args = {
    url: servicePath + "/ownerAuthInfo/getOwnerBuildingListComm",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
// 获取城市项目
export const getListByMap = (params = {}) => {  
  const args = {
    url: servicePath + "/projectTab/getListByMap",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 文件上传
export const fileUpload = (params = {}) => {
  const args = {
    url:  "/filemanager/FileUploadAndDownloadServlet",
    method: "POST",
    params,
    apiType: 'upload'
  };
  return uniHttp.request(args);
};
  

// 我的人脸文件上传文件流
export const imageUpload = (params = {}) => {
  const args = {
    url:  "/community-service/enterpriseAuth/imageUpload?memberId="+params.memberId,
    method: "POST",
    params,
    apiType: 'upload'
  };
  return uniHttp.request(args);
};

// 获取二维码乘电梯
export const getCustomerQRCode = (params = {}) => {  
  const args = {
    url: servicePath + "/enterpriseAuth/getCustomerQRCode",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 文件下传
export const fileDownload = (params = {}) => {
  const args = {
    url:  "/filemanager/FileUploadAndDownloadServlet",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};
// 上传订单（活动）
export const saveTbgOrder = (params = {}) => {  
  const args = {
    url: servicePath + "/tbgOrderRecord/saveTbgOrder",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
// 获取房产支付方式
export const getPayChannel = (params = {}) => {  
  const args = {
    url: servicePath + "/payCommon/v2/getPayChannel",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};
// 获取支付参数
export const getPay2 = (params = {}) => {  
  const args = {
    url: servicePath + "/payCommon/v2/getPay",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
// 获取支付状态
export const isPaySuccess2 = (params = {}) => {  
  const args = {
    url: servicePath + "/payCommon/v2/isPaySuccess",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

export const getUserRole = (params = {}) => {  
  const args = {
    url: servicePath + "/ownerAuthInfo/selectSupremePosition",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取房屋列表
export const findLocations = (params = {}) => {  
  const args = {
    url: servicePath + "/ownerAuthInfo/findBuildLocation",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 根据公司id获取企业列表
export const getCompanyListById = (params = {}) => {  
  const args = {
    url: servicePath + "/enterpriseAuth/findCompanyList",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

export const GetHomePageFunction = (params = {}) => {  
  const args = {
    url: servicePath + "/systemConfig/byCodes",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

export const GetHomePageFunctionNew = (params = {}) => {  
  const args = {
    url: servicePath + "/systemConfig/getAppByCode",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 根据微信code登录
export const wxOauthNew = (params = {}) => {
  const args = {
    url: servicePath+"/wechatInfo/wxOauthNew",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// app微信授权登录
export const appLogin = (params = {}) => {
  const args = {
    url: servicePath + "/tboMemberInfo/appLogin",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 微信小程序授权登录
export const appletLogin = (params = {}) => {
  const args = {
    url: servicePath + "/wechatInfo/appletLogin",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 申请加入企业
export const applyJoinCompany = (params = {}) => {
  const args = {
    url: servicePath + "/enterpriseAuth/applyJoinCompany",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 邀请员工认证
export const inviteEmployeeAuth = (params = {}) => {
  const args = {
    url: servicePath + "/enterpriseAuth/inviteEmployeeAuthNew",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 企业认证获取分享链接
export const getInviteEmployeeUrl = (params = {}) => {
  const args = {
    url: servicePath + "/enterpriseAuth/getInviteEmployeeUrl",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 管理员审核员工认证
export const auditAuthApply = (params = {}) => {
  const args = {
    url: servicePath + "/enterpriseAuth/auditAuthApply",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 管理员审核查询列表
export const adminExamineList = (params = {}) => {
  const args = {
    url: servicePath + "/enterpriseAuth/findAuditAuthList",
    method: "POST",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};

// 管理员审核查询列表
export const setDefaultAddress = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/setDefault",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 认证
export const judgeAuthOwner = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/judgeAuthOwner",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 快递列表
export const getExpressList = (params = {}) => {
  const args = {
    url: '/community-service/steward/expressService/getOwnerExpressList',
    method: "POST",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
}

// 保存快递信息 
export const saveExpress = (params = {}) => {
  const args = {
    url: '/community-service/steward/expressService/saveExpress',
    method: "POST",
    params
  };
  return uniHttp.request(args);
}

// /walter  == /community  特别备注  搬运工特别注意
// 钥匙借用
export const getOwnerKeyList = (params = {}) => {
  const args = {
    url: '/community-service/steward/keyBorrowing/getOwnerKeyList',
    method: "POST",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
}

// 保存钥匙借还信息
export const saveKey = (params = {}) => {
  const args = {
    url: '/community-service/steward/keyBorrowing/saveKey',
    method: 'POST',
    params
  };
  return uniHttp.request(args);
}

/**
 * 根据经纬度查城市
 */
 export const geocoder = (params = {}) => {
  const args = {
    url: servicePath + "/mapApi/geocoder",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
// 获取城市列表
export const getCities = (params = {}) => {
  const args = {
    url: servicePath + "/tbbCity/getListByMap",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

//根据城市名称获取项目
export const getProjectsByCity = (params = {}) => {
  const args = {
    url: servicePath + "/projectTab/getListByMap",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//根据城市名称获取项目
export const getMyFamilyList = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/getMyFamilyList",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

/**
 * @raffle 获取微信配置
 * @method POST
 * @param targetUrl, projectType
 * @author jgj
 */

export const putJsSDKConfig = (params = {}) => {
  const args = {
    url: '/community-service/steward/manage/putJsSDKConfig',
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
}
/**
 * 获取一键开门账号
 * @param params
 * @returns
 */
 export const getDoorId = (params,errorPage,errorType) =>{
  let isMpaas = false
   /*#ifdef APP-PLUS*/
      isMpaas = true
   /*#endif*/
   if (isMpaas){
     return mpaasFetch('community.openDoorController.getDoorId',[],'POST',errorPage,errorType)
   } else {
      const args = {
        url: servicePath + "/openDoorController/getDoorId",
        method: "POST",
        params
      };
      return uniHttp.request(args);
   }

   
 }

 /**
 * 获取门禁设备列表
 */
export const getDeviceList = (params) => uniHttp.request({
  url: servicePath + '/accessDevice/getDeviceList',
  method: 'POST',
  params
})

/**
 * 开门记录
 */
export const insertAccessDeviceLog = (params) => uniHttp.request({
  url: servicePath + '/accessDeviceLog/insertAccessDeviceLog',
  method: 'POST',
  params
})

 export const GetMemberInfoByMemberId = (pathArr,params,errorPage,errorType) =>
{
  let isMpaas = false
   /*#ifdef APP-PLUS*/
   isMpaas = true
   /*#endif*/

  if (isMpaas){
    return mpaasFetch('community.tboMemberInfo.selectTboMemberInfo',params,'GET',errorPage,errorType)
  } else {
    const args = {
      url: servicePath + "/tboMemberInfo/selectTboMemberInfo" + params.data.id,
      method: "GET",
      params,
    };
    return uniHttp.request(args);
  }
}

/**
 * @description 获取会员类型状态
 */
 export const selectSupremePosition = (params,errorPage,errorType) =>
 {
  let isMpaas = false
   /*#ifdef APP-PLUS*/
   isMpaas = true
   /*#endif*/
   if (isMpaas){
     return mpaasFetch('community.ownerAuthInfo.selectSupremePosition',params,'POST',errorPage,errorType)
   } else {
      const args = {
        url: servicePath + "/ownerAuthInfo/selectSupremePosition",
        method: "POST",
        params
      };
      return uniHttp.request(args);
   }
 }

//邀请家人
export const invateFamily = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/invateFamily",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//查询用户认证的企业
export const getAuthCompanyList = (params = {}) => {  
  const args = {
    url: servicePath + "/enterpriseAuth/findCompanyAuthInfoList",
    method: "POST",
    params,
		hideLoading: true,
  };
  return uniHttp.request(args);
};

//加载认证地址(手机端获取业主认证房间分页数据)
export const findBuildLocation = (pathArr,params = {}) => {  
  const args = {
    url: servicePath + "/ownerAuthInfo/findBuildLocation/"+pathArr,
    method: "POST",
    params,
		hideLoading: true,
  };
  return uniHttp.request(args);
};

//发放积分
export const grantMemberGrowthIntegral = (params = {}) => {  
  const args = {
    url: servicePath + "/member-growth-integral/grantMemberGrowthIntegral",
    method: "POST",
    params,
		hideLoading: true,
  };
  return uniHttp.request(args);
};


// 访客管理——拜访事由列表
export const getVisitReason = (params = {}) => {  
  const args = {
    url: '/community-service/core/dictionaryConfigDetail/findDictDetailByConfigCode',
    method: "GET",
    params,
		hideLoading: true,
  };
  return uniHttp.request(args);
};

// 认证，获取院区等
export const selectAssestsByParentId = (params = {}) => {  
  const args = {
    url: '/community-service/core/BuildingLocationInfo/selectAssestsByParentId/1000/1',
    method: "POST",
    params,
		hideLoading: true,
  };
  return uniHttp.request(args);
};

//新增房屋认证
export const approvalAuthCommWithCode = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/approvalAuthCommWithCode",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 访客管理——提交访客申请
export const saveVisitApproval = (params = {}) => {
  const args = {
    url: '/community-service/visitApprovalInfo/saveVisitApprovalRecord',
    method: "POST",
    params
  };
  return uniHttp.request(args);
}

// 广告详情点击计数
export const addGbSlideRead = (params = {}) => {
  const args = {
    url: servicePath+'/gbSlideRead/addGbSlideRead',
    method: "POST",
    params
  };
  return uniHttp.request(args);
}

//删除家人
export const DeleteFamily = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/delFamily",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//判断是否加入企业（是否认证）
export const syncCrmEmployeeInfo = (params = {}) => {
  const args = {
    url: servicePath + "/enterpriseAuth/syncCrmEmployeeInfo",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//企业，离职（管理员操作，移除）
export const updateEmployeeDemission = (params = {}) => {
  const args = {
    url: servicePath + "/enterpriseAuth/employeeDemission",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//微信小程序获取登录信息
export const  getAppletWxUserPhone= (params = {}) => {
  const args = {
    url: servicePath + "/wechatInfo/getAppletWxUserPhone",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//微信手机号码注册
export const  registerByWx= (params = {}) => {
  const args = {
    url: servicePath + "/tboMemberInfo/registerByWx",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取企业全部员工
export const getEnterpriseEmployeeListPage = (params = {}) => {  
  const args = {
    url: servicePath + "/enterpriseAuth/getEnterpriseEmployeeListPage",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取审批列表（分页）
export const findAuditAuthListPage = (params = {}) => {  
  const args = {
    url: servicePath + "/enterpriseAuth/findAuditAuthListPage",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取已认证并且是企业联系人的公司列表（分页）
export const findCompanyAuthInfoListPage = (params = {}) => {  
  const args = {
    url: servicePath + "/enterpriseAuth/findCompanyAuthInfoListPage",
    method: "POST",
    params
  };
  return uniHttp.request(args);
}; 

// 校验短信验证码
export const checkCode = (params = {}) => {  
  const args = {
    url: servicePath + "/tboMemberInfo/checkCode",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 失物招领分页查询
export const getClaimItemPage = (params = {}, size = 10, current = 1) => uniHttp.request({
  url: `${servicePath}/lostAndFound/app/page/${size}/${current}`,
  method: 'POST',
  params
})

// 获取失物招领详情
export const getClaimItemDetail = id => uniHttp.request({
  url: `${servicePath}/lostAndFound/byId/${id}`,
  method: 'GET'
})

// 寻物启事分页查询
export const getFindItemPage = (params = {}, size = 10, current = 1) => uniHttp.request({
  url: `${servicePath}/searchNotice/app/page/${size}/${current}`,
  method: 'POST',
  params
})

// 获取寻物启事详情
export const getFindItemDetail = (id) => uniHttp.request({
  url: `${servicePath}/searchNotice/byId/${id}`,
  method: 'GET'
})

// 新增寻物启事订单
export const addFindItemOrder = (params = {}) => uniHttp.request({
  url: `${servicePath}/searchNotice/submitOrder`,
  method: 'POST',
  params
})

// 编辑寻物启事订单
export const editFindItemOrder = (params = {}) => uniHttp.request({
  url: `${servicePath}/searchNotice/editOrder`,
  method: 'POST',
  params
})

// 取消发布寻物启事
export const cancelFindItemOrder = (id) => uniHttp.request({
  url: `${servicePath}/searchNotice/cancel/${id}`,
  method: 'GET'
})

// 完成寻物启事
export const finishFindItemOrder = (params) => uniHttp.request({
  url: `${servicePath}/searchNotice/finishOrder`,
  method: 'POST',
  params
})

// 注销用户
export const cancellationMember = (params) => uniHttp.request({
  url: `${servicePath}/tboMemberInfo/cancellationMember`,
  method: 'POST',
  params
})

//提交访客
export const visitorAcess = (params = {}) => {
  const args = {
    url: '/community-service/zrVisit/add',
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
//访客列表
export const getvisitorList = (params = {}) => {
  const args = {
    url: '/community-service/zrVisit/app/getVisitRecordByMember',
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
//二维码获取参数
export const getSceneMessage = (params = {}) => {  
  const args = {
    url: "/community-service/zrVisit/getSceneMessage",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

//保存管家联系方式
export const saveStewardContactRecord = (params = {}) => {  
  const args = {
    url: "/community-service/steward/app/saveStewardContactRecord",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 根据房产id，获取房产数据
export const getAuthMessageByAddrId = (addrId = '') => uniHttp.request({
  url: `${servicePath}/ownerAuthInfo/getAuthMessageByAddrId`,
  method: 'GET',
  params: {
    pathParams: `/${addrId}`
  },
})
// 微信消息订阅模板组接口
export const getSubscribeTemplateGroup = (params = {}) => uniHttp.request({
  url: `${servicePath}/wechatMsgTemplate/getSubscribeTemplateGroup`,
  method: 'POST',
  params
})

/**
 * 获取业主端的logo，版本号，备案号，用户隐私协议
 */
export const getPrivacyAgreement = (params = {}) => uniHttp.request({
  url: `${servicePath}/companyConfig/getPrivacyAgreement`,
  method: 'POST',
  params: Object.assign({
    data: {
      companyId: commLogic.getProjectConfig().companyId
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }, params)
  
})

// 业主端缴费增加相关积分规则提示
export const tipsBeforePay = (params = {}) => {  
  const args = {
    url: servicePath + "/growth-integral-rule/tipsBeforePay",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取经纬度项目
export const getCityByLatLon = (params = {}) => {
  const args = {
    url: servicePath + "/mapApi/getCityByLatLon",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// 查询钱包余额
export const getAccountBalance = (params = {}) => {
  const args = {
    url: servicePath + "/walletDetails/getAccountBalance",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 小程序查询钱包明细
export const getAppWalletDetailsList = (params = {}) => {
  const args = {
    url: servicePath + "/walletDetails/getAppWalletDetailsList",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 充值回调接口(生产充值记录)
export const applyRechargeNotify = (params = {}) => {
  const args = {
    url: servicePath + "/walletDetails/applyRechargeNotify",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 企业钱包授权接口
export const walletAuthorize = (params = {}) => {
  const args = {
    url: servicePath + "/walletDetails/walletAuthorize",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};