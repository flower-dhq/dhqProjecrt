import uniHttp from './uni-request'

// 提交个人信息
export const checkUserInfo = (params = {}) => {  
  const args = {
    url: "/sdcp/wechatCustomer/checkUserInfo",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取问卷题目
export const getIssue = (params = {}) => {  
  const args = {
    url: "/sdcp/wechatQuestion/getIssue",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 提交问卷
export const submitQuestion = (params = {}) => {  
  const args = {
    url: "/sdcp/wechatQuestion/submitIssue",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//查看结果
export const getQuestionResult = (params = {}) => {  
  const args = {
    url: "/sdcp/wechatQuestion/getIssueResult",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

//获取结果id
export const getIssueId = (params = {}) => {  
  const args = {
    url: "/sdcp/wechatCustomer/getIssueId",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};



