import uniHttp from './uni-request'
const servicePath = "/community-service"; // 接口服务路径名


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

// 物品放行
export const findPassList = (params = {}) => {
  const args = {
    url: servicePath + "/communityservice/decpassManagement/findPassList",
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

// 物品放行详情
export const findPassDetail = (params = {},releaseId) => {
  const args = {
    url: servicePath + `/communityservice/decpassManagement/app/${releaseId}`,
    method: 'GET',
    params
  };
  return uniHttp.request(args);
};

// 物品放行详情
export const updateDecPass = (params = {}) => {
  const args = {
    url: servicePath + `/communityservice/decpassManagement/updateDecPass`,
    method: 'POST',
    params: {
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    },
  };
  return uniHttp.request(args);
};

// 访客放行列表
export const getVisitRecord = (params = {},size,page) => {
  const args = {
    url: servicePath + `/zrVisit/app/getVisitRecord/${size}/${page}`,
    method: 'POST',
    params: {
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    },
  };
  return uniHttp.request(args);
};

//访客放行详情
export const getVisitorDetail = (id,params = {}) => {
  const args = {
    url: servicePath + `/zrVisit/${id}`,
    method: 'GET',
    params
  };
  return uniHttp.request(args);
};

//访客放行
export const passThrough = (params = {}) => {
  const args = {
    url: servicePath + `/zrVisit/passThrough`,
    method: 'POST',
    params: {
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    },
  };
  return uniHttp.request(args);
};