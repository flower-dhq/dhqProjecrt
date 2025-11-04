import uniHttp from './uni-request';

let servicePath = '/wycrm_6.0';

export const getQuesTaskServerSettingTree = (params = {}) => {
  const args = {
    url: servicePath + '/rest/crmFeedBackInfo/getQuesTaskServerSettingTree',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    },
  };
  return uniHttp.request(args);
};

/**
 * 提交工单
 * @param {*} params
 * @returns
 */
export const submitCrmTask = (params = {}) => {
  const args = {
    url: servicePath + '/rest/crmFeedBackInfo/submitCrmTask',
    method: 'POST',
    params,
  };
  return uniHttp.request(args);
};

/**
 * 获取报事报修列表
 * @param {*} params
 * @returns
 */
export const getCrmTaskListByMemberId = (params = {}) => {
  const args = {
    url: servicePath + '/rest/crmFeedBackInfo/getCrmTaskListByMemberId',
    method: 'POST',
    params,
  };
  return uniHttp.request(args);
};

/**
 * 根据ID 获取工单详情
 * @param {*} params
 * @returns
 */
export const getCrmTaskDetailByTaskID = (params = {}) => {
  const args = {
    url: servicePath + '/rest/crmFeedBackInfo/getCrmTaskDetailByTaskID',
    method: 'POST',
    params,
  };
  return uniHttp.request(args);
};

/**
 * 评价保存
 * @param {*} params
 * @returns
 */
export const saveAndUpdateQuestionTask = (params = {}) => {
  const args = {
    url: servicePath + '/rest/questionTask/saveAndUpdateQuestionTask',
		method: 'POST',
		params,
  };
  return uniHttp.request(args);
};

/** 保存到自定义工单里 */
export const saveQuestionTask = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/questionTask/saveQuestionTask',
  method: 'POST',
  params
})

/** 获取自定义工单列表 */
export const findOwnerTaskListByPage = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/myTask/findOwnerTaskListByPage',
  method: 'GET',
  params
})

/** 获取自定义工单进度 */
export const findOwnerTaskProgress = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/quesRecord/findOwnerTaskProgress',
  method: 'GET',
  params,
})

/** 获取楼栋和项目的派单人员 */
export const getDispatchByLocation = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/user/fetchPdUser',
  method: 'POST',
  params
})

/** 获取自定义工单详情 */
export const getQuestionTaskDetailByQuesTaskId = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/questionTask/getQuestionTaskDetailByQuesTaskId',
  method: 'POST',
  params
})
/**
 * 根据工单id获取缴费信息
 * @param {*} params
 * @returns
 */
export const customerWaitPay = (params = {}) => {
  const args = {
    url: servicePath + '/rest/questionTaskPaid/customerWaitPay',
    method: 'POST',
    params,
  };
  return uniHttp.request(args);
};
