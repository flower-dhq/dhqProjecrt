import uniHttp from './uni-request';
const servicePath = '/knowledgeBase'; // 接口服务路径名


/** 知识库接口写在这 **/

// 获取详情
export const getQuesDetail = (params = {}) => {
    const args = {
      url: servicePath + "/queslib/getQuesDetail",
      method: "GET",
      params
    };
    return uniHttp.request(args);
  };