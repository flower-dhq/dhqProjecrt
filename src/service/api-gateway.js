import uniHttp from "./uni-request";
const servicePath = "/api-gateway"; // 接口服务路径名

// 根据外部联系人id同步企微外部联系人到业主表里
export const syncOwnerInfo = (userId) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/ownerInfo/sync/' + userId,
  method: 'GET',
  params: {
    hideLoading: true,
    responseToast: false
  }
})

// 通过chatId获取群聊成员
export const getOwnerByChatId = (params) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/contactGroup/getOwnerByChatId',
  method: 'GET',
  params
})

// 根据业主ID获取企微的外部联系人客户信息
export const getQYInfoByOwnerId = (ownerId) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/ownerInfo/getByOwnerId/' + ownerId,
  method: 'GET',
  params: {}
})

// 根据员工ID获取企微的企业成员信息
export const getQYInfoByUserId = (ownerId) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/ownerInfo/getUserById/' + ownerId,
  method: 'GET',
  params: {}
})

// 获取手机号码的验证码
export const getSmsCode = (params) => uniHttp.request({
  url: servicePath + '/mall-core-service/app/member/getSmsCode/',
  method: 'POST',
  params
})

// 获取级别列表
export const earlyWarningList = (params) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/earlyWarning/list',
  method: 'GET',
  params
})

// 获取公司应用素材列表
export const getCompanyAgentMaterialList = (params) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/companyAgentMaterial/getCompanyAgentMaterialList',
  method: 'POST',
  params
})

// 我的任务查询列表数据
export const getMyTaskList = (params) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/employeeMassSendingTask/getMyTaskList/' + params.data.size + '/' + params.data.current,
  method: 'POST',
  params: {
    ...params,
    header: {
      'Content-Type': 'application/json'
    }
  }
})

// 总任务查询列表数据
export const massSendingTask = (params) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/massSendingTask/page/' + params.data.size + '/' + params.data.current,
  method: 'POST',
  params: {
    ...params,
    header: {
      'Content-Type': 'application/json'
    }
  }
})

// 我的任务详情
export const getMyTaskInfo = (taskId) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/employeeMassSendingTask/getMyTaskInfo/' + taskId,
  method: 'GET',
  params: {}
})

// 总任务详情
export const getMassSendingTaskDetail = (taskId) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/massSendingTask/byId/' + taskId,
  method: 'GET',
  params: {}
})

// 子任务执行情况详情
export const employeeMassSendingTask = (params) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/employeeMassSendingTask/page/' + params.data.size + '/' + params.data.current,
  method: 'POST',
  params: {
    ...params,
    header: {
      "Content-Type": "application/json",
    },
  },
})

// 提醒成员发送消息
export const remindSendMsg = (taskId) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/massSendingTask/remindSendMsg',
  method: 'GET',
  params: {
    data: {
      taskId
    }
  },
})

// 上传文件到企微的临时素材
export const mediaUpload = (params) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/media/upload',
  method: 'POST',
  params: {
    ...params,
    header: {
      'Content-Type': 'application/json'
    }
  }
})

// 获取客户群
export const contactGroup = (params) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/contactGroup/groupList?groupOwner=' + params.data.groupOwner,
  method: 'POST',
  params: {}
})

// 上传群发送记录
export const uploadRecord = (params) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/EmpMassSendingTaskRecord/uploadRecord',
  method: 'POST',
  params: {
    ...params,
    header: {
      'Content-Type': 'application/json'
    }
  }
})

// 获取业主端获取配置接口
export const getAppShareConfig = (params) => uniHttp.request({
  url: servicePath + '/enterprise-wechat-service/company/getAppShareConfig',
  method: 'POST',
  params
})