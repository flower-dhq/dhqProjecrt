import uniHttp from './uni-request'
const servicePath = "/activiti"; // 接口服务路径名

// 根据查询流程管理列表
export const getApproveListByAuditUserId = (params = {}) => {
  const args = {
    url: servicePath + "/activiti/process/getApproveListByAuditUserId",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// 获取指定人可以审批的审批项列表
export const getApproveListByLaunchUserId = (params = {}) => {
  const args = {
    url: servicePath + "/activiti/process/getApproveListByLaunchUserId",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// 获取抄送我的审批项列表
export const getApproveListByCopyUserId = (params = {}) => {
  const args = {
    url: servicePath + "/activiti/process/getApproveListByCopyUserId",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// 获取tab数量
export const getApproveListByAuditUserIdCount = (params = {}) => {
  const args = {
    url: servicePath + "/activiti/process/getApproveListByAuditUserIdCount",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// 获取审批详情
export const getQueryApproveDetailById = (params = {}) => {
  const args = {
    url: servicePath + '/activiti/process/queryApproveDetailById',
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// 审批
export const executeApprove = (params = {}) => {
  const args = {
    url: servicePath + '/activiti/process/executeApprovejson',
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 撤销审批
export const revokeProcess = (params = {}) => {
  const args = {
    url: servicePath + '/activiti/process/revokeProcess',
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 评论
export const saveComment = (params = {}) => {
  const args = {
    url: servicePath + '/activiti/process/saveComment',
    method: "POST",
    params
  };
  return uniHttp.request(args);
};






// 查询问卷列表
export const selectQuestionnaireByPage = (params = {}) => {
  const args = {
    url: servicePath + "/question/questionnaire/selectQuestionnaireByPage",
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

// 根据项目和楼栋查询会员信息
export const pushPage = (params = {}) => {
  const args = {
    url: servicePath + "/question/questionnaire/pushPage",
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

// 根据问卷id获取到问卷
export const viewWxQuestionnaireAnswer = (params = {}) => {
  const args = {
    url: servicePath + "/question/questionnaire/viewWxQuestionnaireAnswer",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// 获取会员活动列表
export const getActivityList = (params = {}) => uniHttp.request({
  url: servicePath + '/activity/crm/list',
  method: 'POST',
  params: {
    ...params,
    header: {
      'content-type': 'application/json'
    }
  }
})

// 获取会员活动详情
export const getActivityDetail = (params = {}) => uniHttp.request({
  url: servicePath + '/activity/crm/getActivityByIdConvert',
  method: 'GET',
  params
})