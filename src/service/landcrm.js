import uniHttp from './uni-request'

let servicePath = '/landcrm'  
 /**上传图片 */
export const uploadMutiFile = (filePath) => uniHttp.request({
  url: servicePath + '/rest/uploadFileInfo/uploadMutiFile',
  method: 'POST',
  params: {
    filePath,
    name: 'file'
  },
  apiType: 'upload'
})

export const uploadMutiFileOnlyFile2 = (params) => uniHttp.request({
  url: servicePath + '/rest/uploadFileInfo/uploadMutiFile',
  method: 'POST',
  params,
  apiType: 'upload'
})  

// 获取夜间报事配置
export const getIsServiceTime = (params = {}) => {
	const args = {
		url: servicePath + "/rest/crmFeedBackInfo/getIsServiceTime",
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

//加载认证地址
export const findBuildLocation2 = (pathArr, params = {}) => {
	const args = {
		url: "/community/ownerAuthInfo/findBuildLocation/" + pathArr,
		method: "POST",
		params
	};
	return uniHttp.request(args);
};

//获取投诉保修反馈列表
export const feedBackOrderLists = (params = {}) => {  
  const args = {
    url: servicePath + "/rest/crmFeedBackInfo/feedBackOrderListsToJson",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

//获取投诉保修反馈详情
export const feedBackOrderDetailToJson = (params = {}) => {  
  const args = {
    url: servicePath + "/rest/crmFeedBackInfo/feedBackOrderDetailToJson",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

//获取投诉保修反馈进度
export const feedBackTrackNew = (params = {}) => {  
  const args = {
    url: servicePath + "/rest/crmFeedBackInfo/feedBackTrackNew",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

//上传反馈 & 提交保修
export const uploadFeedBackOrder = (params = {}) => {  
  const args = {
    url: servicePath + "/rest/crmFeedBackInfo/uploadFeedBackOrder2",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};


// 获取字典
export const getDictDetail = (params = {}) => {
  const args = {
    url: servicePath + "/rest/dictDetailInfo/getDictDetail",
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