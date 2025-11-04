import uniHttp from "./uni-request";
const servicePath = "/returnVisit"; // 接口服务路径名

// 获取回访任务列表
export const getVisitTaskList = (params) => uniHttp.request({
  url: servicePath + '/question/satisfyTask/selectSatisfyTaskByAppPage',
  method: 'POST',
  params: {
    header: {
      'content-type': 'application/json'
    },
    hideLoading: true,
    responseToast: false,
    ...params
  }
})

// 获取回访任务详情
export const getVisitDetailById = (params) => uniHttp.request({
  url: servicePath + '/question/satisfyTask/findReturnVisitListByInfoId',
  method: 'POST',
  params: {
    hideLoading: true,
    responseToast: false,
    ...params
  }
})

// 获取回访评价内容
export const getVisitQuestionList = (params) => uniHttp.request({
  url: servicePath + '/question/returnVisit/viewQuestionnaireAnswer',
  method: 'GET',
  params: {
    hideLoading: true,
    responseToast: false,
    ...params
  }
})

// 其他回访列表
export const getOtherVisitTaskList = (params) => uniHttp.request({
  url: servicePath + '/question/satisfyTask/selectOtherSatisfyTaskByAppPage',
  method: 'POST',
  params: {
    header: {
      'content-type': 'application/json'
    },
    hideLoading: true,
    responseToast: false,
    ...params
  }
})

// 获取客户拜访列表
export const getCustomerVisitList = (params) => uniHttp.request({
  url: servicePath + '/visit/visitManage/visitTaskList',
  method: 'POST',
  params
})

// 获取客户拜访计划列表
export const getCustomerVisitPlanList = (params) => uniHttp.request({
  url: servicePath + '/visit/visitManage/visitPlanList',
  method: 'POST',
  params: {
    hideLoading: true,
    responseToast: false,
    ...params
  }
})

// 根据拜访任务id获取房间列表
export const getVisitRoomListById = (params) => uniHttp.request({
  url: servicePath + '/visit/visitManage/getVisitTaskDetailById',
  method: 'POST',
  params
})

// 获取拜访详情
export const getCustomerVisitDetailById = (params) => uniHttp.request({
  url: servicePath + '/visit/visitManage/getVisitRecordDetail',
  method: 'POST',
  params
})

// 上传拜访记录
export const uploadCustomerVisitInfo = (params) => uniHttp.request({
  url: servicePath + '/visit/visitManage/uploadVisitRecord',
  method: 'POST',
  params: {
    header: {
      'content-type': 'application/json'
    },
    responseToast: false,
    ...params
  }
})