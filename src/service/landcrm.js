import uniHttp from "./uni-request";
const servicePath = "/landcrm"; // 接口服务路径名


// 获取任务信息
export const getQuestionTaskList = (params = {}) => {
  const args = {
    url: servicePath + "/rest/houseInfo/getQuestionTaskList",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// 获取任务详情
export const getProblemDetail = (params = {}) => {
  const args = {
    url: servicePath + "/sync_SyncQuesTask_getQuesRecordListTI.do",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// 获取区域
export const getAreaListByAsset = (params = {}) => {
  const args = {
    url: servicePath + "/rest/areaInfo/getAreaListByAsset",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};
// 获取项目
export const getProjectListByAsset = (params = {}) => {
  const args = {
    url: servicePath + "/rest/projectInfo/getProjectListByAsset",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};
// 获取专业
export const getWorkTypeListAll = (params = {}) => {
  const args = {
    url: servicePath + "/rest/houseInfo/getWorkTypeListAll",
    method: "POST",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};
// 抢单工单池
export const getRepairQuesTaskListAll = (params = {}) => {
  const args = {
    url: servicePath + "/rest/houseInfo/getRepairQuesTaskListAll",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};
// 新建工单
export const saveQuestionTask = (params = {}) => {
  const args = {
    url: servicePath + "/rest/questionTaskInfo/saveQuestionTask",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 更新工单
export const updateQuestionTask = (params = {}) => uniHttp.request({
  url: servicePath + "/rest/syncTaskInfo/updateQuestionTask",
  method: "POST",
  params
})

// 获取区域
export const getAreaList = (params = {}) => {
  const args = {
    url: servicePath + "/rest/areaInfo/getAreaList",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// 获取业主信息
export const ownerInfoList = (params = {}) => {
  const args = {
    url: servicePath + "/rest/questionTaskInfo/ownerInfoList",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取维修分类
export const getServerTypeByTypeReport = (params = {}) => {
  const args = {
    url: servicePath + "/rest/questionTaskInfo/getServerTypeByTypeReport",
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
    params
  };
  return uniHttp.request(args);
};

// 上传图片
export const uploadMutiFile = (params = {}) => {
  const args = {
    url: servicePath + '/rest/uploadFileInfo/uploadMutiFile',
    method: "POST",
    params,
    apiType: 'upload'
  };
  return uniHttp.request(args);
};


// 获取岗位接口
export const getJobArch = (params = {}) => {
  const args = {
    url: servicePath + "/rest/jobInfo/getJobArch",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取上级人员
export const getSuperiorJobArchs = (params = {}) => {
  const args = {
    url: servicePath + "/rest/jobInfo/getSuperiorJobArchs",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取岗位成员
export const getJobArchUsers = (params = {}) => {
  const args = {
    url: servicePath + "/rest/jobInfo/getJobArchUsers",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 工单的岗位成员
export const getJobArchUserMsg = (params ={}) => uniHttp.request({
  url: servicePath + '/rest/jobInfo/getJobArchUserMsg',
  method: 'POST',
  params
})

// 我的工单列表
export const getBuildingQuesTaskList = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/houseInfo/getBuildingQuesTaskList',
  method: 'GET',
  params
})
// 从单聊进到我的工单页面，按业主所属的项目权限，查询业主的工单列表
export const getOwnerQuesTaskList = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/questionTaskInfo/getOwnerQuesTaskList',
  method: 'GET',
  params
})
// 工单管理列表
export const getRealTimeQuesTaskListPool = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/houseInfo/getRealTimeQuesTaskListAll',
  method: 'POST',
  params: {
    header: {
      'content-type': 'application/json'
    },
    ...params
  }
})


// 获取项目
export const getProjectList = (params = {}) => {
  const args = {
    url: servicePath + "/rest/projectInfo/getProjectList",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// 获取楼栋
export const getBuildingDetailList = (params = {}) => {
  const args = {
    url: servicePath + "/rest/buildingInfo/buildingDetailList",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取房间
export const getAllRoomInfo = (params = {}) => {
  const args = {
    url: servicePath + "/rest/houseInfo/getAllRoomInfo",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取房间
export const getOwnerInfo = (params = {}) => {
  const args = {
    url: servicePath + "/rest/ownerAuthInfo/getOwnerInfo",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取房间
export const getHouseAddrInfoListToPage = (params = {}) => {
  const args = {
    url: servicePath + "/rest/baseDataInfo/getHouseAddrInfoListToPage",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取业主
export const getNewOwnerInfosByHouseInfo = (params = {}) => {
  const args = {
    url: servicePath + "/rest/baseDataInfo/getNewOwnerInfosByHouseInfo",
    method: "POST",
    params
  };
  return uniHttp.request(args);
};

// 获取业主
export const getDeviceInfoByQrcode = (params = {}) => {
  const args = {
    url: "/device/equip/simpleInfo",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// 获取专业筛选列表
export const getWorkTypeList = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/workTypeInfo/selectWorkTypeList',
  method: 'POST',
  params
})

// 预警列表
export const getWarnOrderList = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/crmWarnRecordInfo/orderAndWarnReportsDetails',
  method: 'POST',
  params
})

export const findQuestionTaskList = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/syncTaskInfo/findQuestionTaskList',
  method: 'POST',
  params
})

// 工单按钮操作
export const handleQuestionTask = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/syncTaskInfo/handleQuestionTask',
  method: 'POST',
  params
})

// 更改受理人，处理人，跟进人
export const questionTaskGiveOut = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/syncTaskInfo/questionTaskGiveOut',
  method: 'POST',
  params
})

/**
 * 查询项目的工单配置
 * CRM -> 日常服务 -> 初始化设置 -> 项目参数设置
 */
export const getProjectSetting = (projectId) => uniHttp.request({
  url: servicePath + '/rest/crmProjectPaySettingInfo/getProjectSetting',
  method: 'POST',
  params: {
    data: {
      type: 2,
      archId: projectId
    },
    hideLoading: true
  }
})

/**
 * 根据问题分类id，获取材料费用，是否对外回复
 * 查看 CRM -> 日常服务 -> 问题标准库
 */
 export const getCrmserverTypeinfos = (serverId) => uniHttp.request({
  url: servicePath + '/rest/crmServerTypeInfo/getCrmserverTypeinfos',
  method: 'POST',
  params: {
    data: {
      serverId
    },
    hideLoading: true
  }
})

/**
 * 根据id查询维修单或业主评价设置
 * CRM -> 日常服务 -> 初始化设置 -> 维修单设置
 */
export const getSettingDetailById = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/repairAndOwnerSettingInfo/getSettingDetail',
  method: 'POST',
  params
})

// 获取工单详情
export const getQuesTaskDetailRecord = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/syncTaskInfo/getQuesTaskDetailRecord',
  method: 'POST',
  params
})

// 获取审批列表
export const getCrmApproval = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/crmApprovalInfo/getCrmApproval',
  method: 'POST',
  params
})

// 工单审批
export const agreeOrReject = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/syncTaskInfo/agreeOrReject',
  method: 'POST',
  params
})

// 微信小程序授权   
export const getAuth = (params = {}) => {
  const args = {
    url: servicePath + "/rest/weChatInfo/appletLogin",
    method: "POST",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};
// 用于h5模拟员工登录   
export const qpiUserLogin = (params = {}) => {
  const args = {
    url: servicePath + "/rest/userInfo/qpiUserLogin",
    method: "POST",
    params 
  };
  return uniHttp.request(args);
}; 
// 获取院区
export const getCourtyardByProjectId = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/projectInfo/getCourtyardByProjectId',
  method: 'POST',
  params
})
// 首页菜单权限   
export const getFunctionButtons2 = (params = {}) => {
  const args = {
    url: servicePath + "/rest/postInfo/getFunctionButtons2",
    method: "POST",
    params 
  };
  return uniHttp.request(args);
}; 

// 获取房间列表
export const getHouseAddrInfoListToPageForUnion = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/baseDataInfo/getHouseAddrInfoListToPageForUnion',
  method: 'POST',
  params
})

// 根据房间id获取业主列表
export const getOwnerInfoListByParam = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/baseDataInfo/getOwnerInfoListByParam',
  method: 'POST',
  params
})

// 根据业主id查询业主信息
export const getOwnerInfoById = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/baseDataInfo/getOwnerInfoById',
  method: 'POST',
  params
})

// 获取业主档案的日常服务列表
export const getQuestionTasksByOwnerInfoId = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/baseDataInfo/getQuestionTasksByOwnerInfoId',
  method: 'POST',
  params
})

// 工单的“新建工单”和“派单”操作后，需要推送消息
export const sendQuesTaskAgentMsg = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/questionTaskInfo/sendQuesTaskAgentMsg',
  method: 'POST',
  params: {
    header: {
      'content-type': 'application/json'
    },
    ...params
  }
})

/**
 * 获取工单基础配置
 * CRM -> 日常服务 -> 初始化设置 -> 工单基础参数配置/基础信息配置
 */
export const getCrmAutoPhoneSetting = (userId) => uniHttp.request({
  url: servicePath + '/rest/crmAutoPhoneSettingInfo/getCrmAutoPhoneSetting',
  method: 'POST',
  params: {
    data: {
      userId
    },
    hideLoading: true
  }
})

// 获取工单按钮权限
export const getMenuButtonsByTaskId = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/taskProcessFlowInfo/getMenuButtonsByTaskId',
  method: 'POST',
  params
})

// 根据userId获取部门
export const getPostByUserId = (userId) => uniHttp.request({
  url: servicePath + '/rest/postInfo/getPostByUserId',
  method: 'POST',
  params: {
    data: {
      userId
    },
    hideLoading: true
  }
})

/**
 * 获取专业
 */
export const findWorkUserList = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/professionManageInfo/findWorkUserList',
  method: 'POST',
  params
})

/**
 * 我的工单页面，获取我的工单里全部的受理人数据
 */
export const getQuesTaskOriginalUser = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/houseInfo/getQuesTaskOriginalUser',
  method: 'POST',
  params: {
    header: {
      'content-type': 'application/json'
    },
    ...params
  }
})

// 报修处理完成时，保存工单然后去支付
export const saveBillToPay = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/crmTaskInfo/saveBill',
  method: 'POST',
  params
})

// 报修有偿处理完成时，生成二维码支付图片
export const saveQRcode = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/crmTaskInfo/saveQRcode',
  method: 'POST',
  params
})

// 更新编辑资料
export const updateCrmOnwerInfo = (params = {}) => uniHttp.request({
  url: servicePath + '/rest/crmServiceInfo/updateCrmOwnerInfo',
  method: "POST",
  params
})

// 获取客户拜访人列表
export const getCustomerVisitUserList = (params) => uniHttp.request({
  url: servicePath + '/rest/baseDataInfo/getUsers',
  method: 'POST',
  params: {
    hideLoading: true,
    responseToast: false,
    ...params
  }
})

// 获取客户拜访方式
export const getCustomerVisitType = (params) => uniHttp.request({
  url: servicePath + '/rest/dictDetailInfo/getDictDetailWithComapnyIdList',
  method: 'POST',
  params: {
    hideLoading: true,
    responseToast: false,
    ...params
  }
})

// 客户拜访下获取房间下的所有业主
export const getUserListByRoom = (params) => uniHttp.request({
  url: servicePath + '/rest/baseDataInfo/getowner',
  method: 'POST',
  params
})

// 刷新支付二维码，判断支付状态
export const isPaySuccess = (params) => uniHttp.request({
  url: servicePath + '/rest/crmTaskInfo/isPaySuccess',
  method: 'POST',
  params
})


/**上传图片 */
export const uploadMutiFileOnlyFile = (files) =>
  uniHttp.request({
    url: servicePath + '/rest/uploadFileInfo/uploadMutiFile',
    method: 'POST',
    params: {
      files,
      name: 'file'
    },
    apiType: 'upload'
  })

export const uploadMutiFileOnlyFile2 = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/uploadFileInfo/uploadMutiFile',
    method: 'POST',
    params,
    apiType: 'upload'
  })  

export const ownerInfoListNew = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/questionTaskInfo/ownerInfoListNew',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })

export const getCompanyJobArch = (params) => uniHttp.request({
  url: servicePath + '/rest/archInfo/getCompanyJobArch', 
  method: 'POST',
  params: {
		...params,
		header:{
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		}
	}
})

// 加时登记
export const saveOvertimeApply = (params) => uniHttp.request({
  url: servicePath + '/rest/tsOvertimeApplyInfo/saveOvertimeApply', 
  method: 'POST',
  params: {
		...params,
    header:{
			'Content-Type': 'application/json',
		}
	}
})


// 申请加时参数配置--查询接口
export const selectOvertimeConfig = (params) => uniHttp.request({
  url: servicePath + '/rest/tsOvertimeConfigInfo/selectOvertimeConfig', 
  method: 'POST',
  params: {
		...params,
    header:{
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		}
	}
})


// 申请加时--申请加时页面列表表头数据查询
export const selectOvertimeApplyInfoCount = (params) => uniHttp.request({
  url: servicePath + '/rest/tsOvertimeApplyInfo/selectOvertimeApplyInfoCount', 
  method: 'POST',
  params: {
		...params,
    header:{
			'Content-Type': 'application/json',
		}
	}
})

// 申请加时--申请加时页面列表查询/员工端/业主端列表查询
export const selectOvertimeApplyInfoList = (params) => uniHttp.request({
  url: servicePath + '/rest/tsOvertimeApplyInfo/selectOvertimeApplyInfoList', 
  method: 'POST',
  params: {
		...params,
    header:{
			'Content-Type': 'application/json',
		}
	}
})

// 申请加时-申请加时详情查询
export const selectOvertimeApplyInfoById = (params) => uniHttp.request({
  url: servicePath + '/rest/tsOvertimeApplyInfo/selectOvertimeApplyInfoById', 
  method: 'POST',
  params: {
		...params,
    header:{
			'Content-Type': 'application/json',
		}
	}
})

// 申请加时--申请加时操作记录查询
export const selectOvertimeApplyInfoRecords = (params) => uniHttp.request({
  url: servicePath + '/rest/tsOvertimeApplyInfo/selectOvertimeApplyInfoRecords', 
  method: 'POST',
  params: {
		...params,
    header:{
			'Content-Type': 'application/json',
		}
	}
})

// 申请加时审核--申请单状态变更接口
export const updateStatusChangesOvertimeApplyInfo = (params) => uniHttp.request({
  url: servicePath + '/rest/tsOvertimeApplyInfo/reviseStatusChangesOvertimeApplyInfo', 
  method: 'POST',
  params: {
		...params,
    header:{
			'Content-Type': 'application/json',
		}
	}
})

// 申请加时-获取对应房间
export const getHouseInfoById = (params) => uniHttp.request({
  url: servicePath + '/rest/houseInfo/getHouseInfoById', 
  method: 'POST',
  params: {
		...params
	}
})

// 查询最近7天加时是否可约 
export const getReservationDateList = (params) => uniHttp.request({
  url: servicePath + '/rest/tsOvertimeApplyInfo/getReservationDateList', 
  method: 'POST',
  params: {
		...params,
    header:{
			'Content-Type': 'application/json',
		}
	}
})


// 申请加时编辑
export const editOvertimeApply = (params) => uniHttp.request({
  url: servicePath + '/rest/tsOvertimeApplyInfo/editOvertimeApply', 
  method: 'POST',
  params: {
		...params,
    header:{
			'Content-Type': 'application/json',
		}
	}
})