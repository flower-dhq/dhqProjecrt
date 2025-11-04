import uniHttp from "./uni-request";
 
const servicePath ="/community-service"; // 接口服务路径名

// 获取首页活动
export const activity = (params = {}) => {
  const args = {
    url: servicePath + "/activity",
    method: "POST",
    params,
  };
  return uniHttp.request(args);
};
// 通知公告
export const alist = (params = {}) => {
  const args = {
    url: servicePath + "/media/knowledge/article/alist",
    method: "POST",
    params,
  };
  return uniHttp.request(args);
};
// 获取栏目
export const columnList = (params = {}) => {
  const args = {
    url: servicePath + "/media/knowledge/column/list",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};
// 活动详情
export const getActivityByUser = (params = {}) => {
  const args = {
    url: servicePath + "/activity/getActivityByUser",
    method: "POST",
    params,
  };
  return uniHttp.request(args);
};
// 更新阅读量
export const addClickCountById = (params = {}) => {
  const args = {
    url: servicePath + "/media/knowledge/article/addClickCountById",
    method: "POST",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  };
  return uniHttp.request(args);
};
// 活动报名
export const saveActivitySignUp = (params = {}) => {
  const args = {
    url: servicePath + "/activity/signUp",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
// 问卷调查列表
export const selectQuestionnaireByPage = (params = {}) => {
  const args = {
    url: servicePath + "/question/questionnaire/selectQuestionnaireByPage",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
// 问卷调查详情
export const getQuestionnaireById = (params = {}) => {
  const args = {
    url: servicePath + "/question/questionnaire/getQuestionnaireById",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};
// 更新访问问卷人数
export const updateQuestionnaireVisitorsNum = (params = {}) => {
  const args = {
    url: servicePath + "/question/questionnaire/updateQuestionnaireVisitorsNum",
    method: "POST",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  };
  return uniHttp.request(args);
};
// 提交问卷
export const addQuestionnaireAnswer = (params = {}) => {
  const args = {
    url: servicePath + "/question/questionnaire/addQuestionnaireAnswer",
    method: "POST",
    params 
  };
  return uniHttp.request(args);
};
// 评价结果
export const viewWxQuestionnaireAnswer = (params = {}) => {
  const args = {
    url: servicePath + "/question/questionnaire/viewWxQuestionnaireAnswer",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  };
  return uniHttp.request(args);
};
// 点击阅读
export const updateStatus = (params = {}) => {
  const args = {
    url: servicePath + "/pushRecord/updateStatus",
    method: "POST", 
    params
  };
  return uniHttp.request(args);
};


// 宣传列表
export const queryArticalList = (params = {}) => {
  const args = {
    url: servicePath + "/media/knowledge/article/alist",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
//更新阅读量
export const addClickCountByIds = (params = {}) => {
  const args = {
    url: servicePath + "/media/knowledge/article/addClickCountById",
    method: "POST",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  };
  return uniHttp.request(args);
};

/**获取宣传文章详情 */
export const loadArticleDetails = (params) => uniHttp.request({
  url: servicePath + '/media/knowledge/article',
  method: 'GET',
  params
})



/**
 * 阳光家园
 */

 export const selectFacilitiesCount = (params = {}) => {
  const args = {
    url: servicePath + "/sunshine/weixin/sunshineHome/getList",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
export const selectFacilitiesCountNumber = (params = {}) => {
  const args = {
    url: servicePath + "/sunshine/weixin/sunshineHome/getSum",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

/**
 * 阳光团队
 */
 export const getEmployeeInfo = (params = {}) => {
  const args = {
    url: servicePath + "/sunshine/weixin/sunshineTeam/getList",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

/**
 * 阳光故事列表
 */
export const getArticleList = (params = {}) => {
  const args = {
    url: servicePath + "/media/knowledge/article/alist",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

/*阳光故事详情*/
export const getStoryDetail = (params) => uniHttp.request({
  url: servicePath + '/media/knowledge/article',
  method: 'GET',
  params
})


/**
 * 获取会员类型状态
 */
 export const selectSupremePosition = (params = {}) => {
  const args = {
    url: servicePath + "/walter/ownerAuthInfo/selectSupremePosition",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

/**
 * 点赞
 */
 export const giveArticleLike = (params = {}) => {
  const args = {
    url: servicePath + "/media/knowledge/like/add",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

/**
 * 点赞
 */
export const giveArticleLikeCancel = (params = {}) => {
  const args = {
    url: servicePath + "/media/knowledge/like/cancel",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

/**
 *  评论
 */
 export const getCommentAdd = (params = {}) => {
  const args = {
    url: servicePath + "/media/knowledge/comment/add",
    method: "PUT",
    params
  };
  return uniHttp.request(args);
};

/**物品放行申请 */
export const insertDecpass = (data = {}) => uniHttp.request({
  url: servicePath + '/communityservice/decpassManagement/insertDecpass',
  method: 'POST',
  params: {
    data,
    responseToast:false
  }
})

/**获取放行详情 */
export const getApplyVisitDetail = (id = '') => uniHttp.request({
  url: servicePath + '/communityservice/decpassManagement/app/' + id,
  method: 'GET',
  params: {}
})

/**获取放行历史列表 */
export const findDecPassList = (data = {}) => uniHttp.request({
  url: servicePath + '/communityservice/decpassManagement/findDecPassList',
  method: 'POST',
  params: {
    data,
    hideLoading: true
  }
})

/**取消放行 */
export const updateDecPass = (data = {}) => uniHttp.request({
  url: servicePath + '/communityservice/decpassManagement/updateDecPass',
  method: 'POST',
  params: {
    data
  }
})

/**放心审核 */
export const authDecpass = (data = {}) => uniHttp.request({
  url: servicePath + '/communityservice/decpassManagement/authDecpass',
  method: 'POST',
  params: {
    data
  }
})

/**生成放行条 */
export const createDecpass = (data = {}) => uniHttp.request({
  url: servicePath + '/communityservice/decpassManagement/createDecpass',
  method: 'POST',
  params: {
    data
  }
})

/**查询业主所在楼栋的管家 */
export const findStewardByBuilding = (params) => uniHttp.request({
  url: servicePath + '/steward/app/findStewardByBuilding',
  method: 'POST',
  params
})

/**获取便民电话列表 */
// export const getConvenienceTel = (params) => uniHttp.request({
//   url: servicePath + '/steward/phone/phoneList',
//   method: 'POST',
//   params
// })
export const getConvenienceTel = (params = {}) => {
  const args = {
    url: servicePath + "/steward/phone/phoneList",
    method: "POST",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  };
  return uniHttp.request(args);
};
/**保存管家联系方式 */
export const saveStewardContactRecord = (params) => uniHttp.request({
  url: servicePath + '/app/saveStewardContactRecord',
  method: 'POST',
  params
})

/**获取公告文章详情 */
export const loadArticleDetail = (params) => uniHttp.request({
  url: servicePath + '/media/knowledge/article',
  method: 'GET',
  params
})

/**选择房屋地址 */
export const selectAssestsByParentId = (params = {}) => { 
  const args = {
    url: servicePath + "/core/BuildingLocationInfo/selectAssestsByParentId",
    method: "POST",
    params
  };
 return uniHttp.request(args);
};
  

/**活动取消报名 */
export const cancelSignUpByAsuid = (params = {}) => { 
  const args = {
    url: servicePath + "/activity/cancelSignUpByAsuid",
    method: "POST",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  };
 return uniHttp.request(args);
};
  
/**访客管理——访客邀请记录列表 */
export const getVisitRecordList = (params = {}) => { 
  const args = {
    url: servicePath + "/visitApprovalInfo/getVisitApprovalRecordList",
    method: "POST",
    params
  };
 return uniHttp.request(args);
};
  
/**访客管理——访客邀请记录的统计记录 */
export const getVisitRecordListCount = (params = {}) => { 
  const args = {
    url: servicePath + "/visitApprovalInfo/visitApprovalRecordListStatistical",
    method: "POST",
    params
  };
 return uniHttp.request(args);
};

/**访客管理——访客邀请的审核/取消操作 */
export const auditVisitApproval = (params = {}) => { 
  const args = {
    url: servicePath + "/visitApprovalInfo/auditOrCancel",
    method: "POST",
    params
  };
 return uniHttp.request(args);
};

/**访客管理——访客邀请详情列表 */
export const getVisitRecordDetailList = (params) => uniHttp.request({
  url: servicePath + '/visitApprovalInfo/detail',
  method: 'GET',
  params
})

// 获取通行码
export const BindGenerateCode = (params = {}) => {
  const args = {
    url: servicePath + "/access/app/accesscontrol/BindGenerateCode",
    method: "POST",
    params: {
      ...params,
			responseType:'arraybuffer'
    }
  };
  return uniHttp.request(args);
};

// 获取我的活动
export const myActivities = (params = {}) => {
  const args = {
    url: servicePath +"/activity/wx/activities/orders",
    method: "GET",
    params,
  };
  return uniHttp.request(args);
};

// 保存曝光
export const saveMiniExposure = (params = {}) => {
  const args = {
    url: servicePath +"/exposure/saveMiniExposure",
    method: "POST",
    params,
  };
  return uniHttp.request(args);
};

// 曝光列表
export const getMiniExposurePage = (params = {}) => {
  const args = {
    url: servicePath +"/exposure/getMiniExposurePage",
    method: "POST",
    params,
  };
  return uniHttp.request(args);
};

// 曝光详情
export const getMiniExposureDetail = (params = {}) => {
  const args = {
    url: servicePath +"/exposure/getMiniExposureDetail",
    method: "GET",
    params,
  };
  return uniHttp.request(args);
};

// 阅读量
export const addReadNum = (params = {}) => {
  const args = {
    url: servicePath +"/exposure/addReadNum",
    method: "POST",
    params,
  };
  return uniHttp.request(args);
};


// 曝光投稿历史
export const getMiniExposureListByMemberId = (params = {}) => {
  const args = {
    url: servicePath +"/exposure/getMiniExposureListByMemberId",
    method: "POST",
    params,
  };
  return uniHttp.request(args);
};

// 取消曝光
export const cancelMiniExposure = (params = {}) => {
  const args = {
    url: servicePath +"/exposure/cancelMiniExposure",
    method: "POST",
    params,
  };
  return uniHttp.request(args);
};



 // 获取当月评价
 export const getStewardEvaluate = (params = {}) => uniHttp.request({
  url: servicePath + '/steward/app/getStewardEvaluate',
  method: 'POST',
  params
})

// 对管家进行评价
export const saveStewardEvaluate = (params = {}) => uniHttp.request({
  url: servicePath + '/steward/app/saveStewardEvaluate',
  method: 'POST',
  params
})

// 获取管家评价标签
 export const getStewardTag = () => uniHttp.request({
  url: servicePath + '/steward/app/findStewardTags',
  method: 'GET',
  params: {}
})
//获取阳光故事-评论
export const getCommentList = (params = {}) => uniHttp.request({
  url: servicePath + '/media/knowledge/comment/list',
  method: 'POST',
  params
})
//获取会员卡信息
export const getMemberInfoByApp = (params = {}) => uniHttp.request({
  url: servicePath + '/manage/getMemberInfoByApp',
  method: 'POST',
  params
})
//获取会员卡类型
export const getMemberGradePage = (params = {}) => uniHttp.request({
  url: servicePath +'/manage/memberGrade/getMemberGradePage',
  method: 'POST',
  params
})

export const colListAll = (params) => uniHttp.request({
  url: servicePath + '/media/knowledge/column/colListAll',
  method: 'GET',
  params
})

//获取未阅数量

export const getPushRecordCount = (params = {}) => uniHttp.request({
  url: servicePath +'/pushRecord/getPushRecordCount',
  method: 'POST',
  params
})

//改变点阅状态为已阅
export const changeUpdateStatus = (params = {}) => uniHttp.request({
  url: servicePath +'/pushRecord/updateStatus',
  method: 'POST',
  params
})
//系统群发消息
export const getMasspushList = (params = {}) => uniHttp.request({
  url: servicePath +'/manage/masspush/page/getMasspushList',
  method: 'POST',
  params
})

// 获取群发文本详情
export const getMassPushById = (params = {}) => {
  const args = {
    url: servicePath + "/manage/masspush/detail/getMassPushById/",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  };
  return uniHttp.request(args);
};

export const getSignByProjectType = (params) => uniHttp.request({
  url: servicePath + '/manage/wechatToken/selectUpdateToken',
  method: 'GET',
  params
})