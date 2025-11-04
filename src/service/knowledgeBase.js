import uniHttp from "./uni-request";
const servicePath = "/knowledgeBase"; // 接口服务路径名

export const getQuesLibList = (params = {}) => {  //查询知识列表
    const args = {
      url: servicePath + "/queslib/getQuesLibList",
      method: "POST",
      params
    };
    return uniHttp.request(args);
  };
  export const collectQues = (params = {}) => {  //收藏知识列表
    const args = {
      url: servicePath + "/quesCollect/updateCollect",
      method: "POST",
      params
    };
    return uniHttp.request(args);
  };
  export const updateQuesTopStatus = (params = {}) => {  //置顶知识列表
    const args = {
      url: servicePath + "/queslib/updateQuesTopStatus",
      method: "POST",
      params
    };
    return uniHttp.request(args);
  };
  export const getQuesCategoryList = (params = {}) => {
    const args = {
      url: servicePath + "/quesCategory/getQuesCategoryList",
      method: "GET",
      params
    };
    return uniHttp.request(args);
  };
  export const getCategoryTreeList = (params = {}) => {
    const args = {
      url: servicePath + "/quesCategory/getCategoryTreeList",
      method: "GET",
      params
    };
    return uniHttp.request(args);
  };
  export const getQuesDetail = (params = {}) => {
    const args = {
      url: servicePath + "/queslib/getQuesDetail",
      method: "GET",
      params
    };
    return uniHttp.request(args);
  };
  export const addQuesQuoteNum = (params = {}) => {  //新增引用量
    const args = {
      url: servicePath + "/queslib/addQuesQuoteNum",
      method: "POST",
      params
    };
    return uniHttp.request(args);
  };

  export const getNoticeDetail = (params = {}) => {  //获取公告详情
    const args = {
      url: servicePath + "/notice/getNoticeDetail",
      method: "POST",
      params
    };
    return uniHttp.request(args);
  };
