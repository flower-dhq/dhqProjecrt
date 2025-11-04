import uniHttp from "./uni-request";
const { PROJECT_CODE } = (process.env.VUE_APP_CONFIG && JSON.parse(process.env.VUE_APP_CONFIG)) || {};
const servicePath = "/datawarehouse"; // 接口服务路径名

// 运营日志-工单情况
export const operationsLogWorkOrder= (params = {}) => {
  const args = {
    url: servicePath + "/operateReport/operateLogsDataInfo/getTicketData",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 运营日志-综合巡检
export const operationsLogComprehensivePatrol= (params = {}) => {
  const args = {
    url: servicePath + "/operateReport/operateLogsDataInfo/getIntegratedPatrol",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 运营日志-设备巡检
export const operationsLogDevicePatrol= (params = {}) => {
  const args = {
    url: servicePath + "/operateReport/operateLogsDataInfo/getDevicePatrol",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 运营日志-收费
export const operationsLogCharge= (params = {}) => {
  const args = {
    url: servicePath + "/operateReport/operateLogsDataInfo/getChargesData",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}
// 运营日志-查询员工运营报告订阅数量
export const getUserSubscribeCount= (params = {}) => {
  const args = {
     url: servicePath + "/operateReport/subscribeBusinessLog/getUserSubscribeCount",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
  }
  };
  return uniHttp.request(args);
}
// 运营日志-查询员工运营订阅推送日志列表并分页
export const getUserPushLogListByPage= (params = {}) => {
  const args = {
     url: servicePath + "/operateReport/subscribeBusinessLog/getUserPushLogListByPage",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
  }
  };
  return uniHttp.request(args);
}

// 运营日志-工单详情
export const orderDetail= (params = {}) => {
  const args = {
    url: servicePath + "/operateReport/operateLogsDataInfo/getTicketDetailData",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 运营日志-综合巡检详情
export const integratedPatrolDetail= (params = {}) => {
  const args = {
    url: servicePath + "/operateReport/operateLogsDataInfo/getIntegratedPatrolDetail",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 运营日志-设备巡检详情
export const devicePatrolDetail= (params = {}) => {
  const args = {
    url: servicePath + "/operateReport/operateLogsDataInfo/getDevicePatrolDetail",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 运营日志-收费详情
export const chargesDetail= (params = {}) => {
  const args = {
    url: servicePath + "/operateReport/operateLogsDataInfo/getChargesDetailData",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 运营日志-运营订阅推送日志已读状态
export const updatePushLogRead= (params = {}) => {
  const args = {
    url: servicePath + "/operateReport/subscribeBusinessLog/updatePushLogRead",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 看板-客户服务-工单情况
export const getTaskSituation= (params = {}) => {
  const args = {
    url: servicePath + "/portal/questionTask/getTaskSituation",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 看板-客户服务-工单状态占比
export const getTaskState= (params = {}) => {
  const args = {
    url: servicePath + "/portal/questionTask/getTaskState",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 看板-客户服务-工单处理情况
export const getTaskDisposeSituation= (params = {},size,index) => {
  const args = {
    url: servicePath + `/portal/questionTask/getTaskDisposeSituation/${size}/${index}`,
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}


// 社区运营-运营概览
export const getOperational= (params = {}) => {
  const args = {
    url: servicePath + "/portal/butlerInfo/getOperational",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-认证分析
export const getCertificationAnalysis= (params = {}) => {
  const args = {
    url: servicePath + "/portal/butlerInfo/getCertificationAnalysis",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-社区舆情
export const getWarningRecordInfo= (params = {}) => {
  const args = {
    url: servicePath + "/portal/earlyWarningRecord/getWarningRecordInfo",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-舆情态势图
export const getWarningKeyWordList= (params = {}) => {
  const args = {
    url: servicePath + "/portal/earlyWarningRecord/getWarningKeyWordList",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-社区出行
export const getPedestrianTraffic= (params = {}) => {
  const args = {
    url: servicePath + "/portal/butlerInfo/getPedestrianTraffic",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-重点人群出行
export const getPriorityPersonTraffic= (params = {}) => {
  const args = {
    url: servicePath + "/portal/butlerInfo/getPriorityPersonTraffic",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-人员出行趋势图
export const getPedestrianTrendCharts= (params = {}) => {
  const args = {
    url: servicePath + "/portal/butlerInfo/getPedestrianTrendCharts",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-车辆出行趋势图
export const getCarTrendCharts= (params = {}) => {
  const args = {
    url: servicePath + "/portal/butlerInfo/getCarTrendCharts",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-服务收入
export const getServiceRevenue= (params = {}) => {
  const args = {
    url: servicePath + "/portal/butlerInfo/getServiceRevenue",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-重点人群
export const getFocusGroups= (params = {}) => {
  const args = {
    url: servicePath + "/portal/butlerInfo/getFocusGroups",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-认证明细项目
export const getCertifiedProjectId= (params = {},size,index) => {
  const args = {
    url: servicePath + `/portal/butlerInfo/getCertifiedProjectId/${size}/${index}`,
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-认证分析区域明细情况
export const getCertifiedDetails= (params = {},size,index) => {
  const args = {
    url: servicePath + `/portal/butlerInfo/getCertifiedDetails/${size}/${index}`,
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-服务收入明细项目查询
export const getIncomeBreakdownProjectId= (params = {},size,index) => {
  const args = {
    url: servicePath + `/portal/butlerInfo/getIncomeBreakdownProjectId/${size}/${index}`,
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-服务收入明细区域询
export const getIncomeBreakdown= (params = {},size,index) => {
  const args = {
    url: servicePath + `/portal/butlerInfo/getIncomeBreakdown/${size}/${index}`,
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 看板-客户服务-工单趋势图
export const getTaskTrendCharts= (params = {}) => {
  const args = {
    url: servicePath + "/portal/questionTask/getTaskTrendCharts",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 看板-关键指标-商城环比图
export const getBusinessIncome= (params = {}) => {
  const args = {
    url: servicePath + "/portal/dsqOnlineStore/getBusinessIncome",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 看板-关键指标- 查询设备管控数据
export const getDeviceControl= (params = {}) => {
  const args = {
    url: servicePath + "/portal/deviceInfo/getDeviceControl",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 看板-关键指标- 品质管理
export const getQualityManagement= (params = {}) => {
  const args = {
    url: servicePath + "/portal/qualityScreenInfoData/getQualityManagement",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 看板-关键指标- 品质管理趋势图
export const getQualityTrendCharts= (params = {}) => {
  const args = {
    url: servicePath + "/portal/qualityScreenInfoData/getQualityTrendCharts",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 看板-关键指标- 认证管理
export const getAuthentication= (params = {}) => {
  const args = {
    url: servicePath + "/portal/authenticationInfo/getAuthentication",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 品质巡检排行榜
export const getQualityRanking= (params = {},size,index) => {
  const args = {
    url: servicePath + `/portal/qualityScreenInfoData/getQualityRanking/${size}/${index}`,
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}


// 看板-关键指标- 巡逻分析
export const getPatrolCount= (params = {}) => {
  const args = {
    url: servicePath + "/portal/ruleTaskInfo/getPatrolCount",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 看板-关键指标- 巡逻分析趋势图
export const getPatrolTrend= (params = {}) => {
  const args = {
    url: servicePath + "/portal/ruleTaskInfo/getPatrolTrend",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 看板-关键指标-管理概览
export const getSysBasicDataCount= (params = {}) => {
  const args = {
    url: servicePath + "/portal/sysBasicDataInfo/getSysBasicDataCount",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 设备巡检排行榜-区域
export const getAreaPatrolInspectionRanking= (params = {},size,current) => {
  const args = {
    url: servicePath + `/portal/questionTask/getAreaPatrolInspectionRanking/${size}/${current}`,
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}
// 设备巡检排行榜-项目
export const getProjectPatrolInspectionRanking= (params = {},size,current) => {
  const args = {
    url: servicePath + `/portal/questionTask/getProjectPatrolInspectionRanking/${size}/${current}`,
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}
// 看板-关键指标-舆情明细
export const getWarningRecordDetail= (params = {},size,current) => {
  const args = {
    url: servicePath + `/portal/earlyWarningRecord/getWarningRecordDetail/${size}/${current}`,
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}
//设备管理
export const getDeviceManage= (params = {}) => {
  const args = {
    url: servicePath + "/portal/deviceInfo/getDeviceManage",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}
//设备组成
export const getDeviceComposition= (params = {}) => {
  const args = {
    url: servicePath + "/portal/deviceInfo/getDeviceComposition",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

//社区舆情
export const getCommunityCommunication= (params = {}) => {
  const args = {
    url: servicePath + "/portal/WxGroupController/getCommunityCommunication",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}


//房屋数据填报统计
export const getHouseDataReportCount= (params = {}) => {
  const args = {
    url: servicePath + "/portal/houseDataReport/getHouseDataReportCount",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-服务收入明细项目查询
export const getServeIncomeDetailByProject = (params = {},size,index) => {
  const args = {
    url: servicePath + `/portal/butlerInfo/getServeIncomeDetailByProject/${size}/${index}`,
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 社区运营-服务收入明细区域询
export const getServeIncomeDetailByArea= (params = {},size,index) => {
  const args = {
    url: servicePath + `/portal/butlerInfo/getServeIncomeDetailByArea/${size}/${index}`,
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 自定义工单--工单分析接口
export const getTaskAnalysis= (params = {}) => {
  const args = {
    url: servicePath + "/portal/customizeTask/getTaskAnalysis",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 自定义工单--工单趋势图
export const getCustomTaskTrendCharts = (params = {}) => {
  const args = {
    url: servicePath + "/portal/customizeTask/getTaskTrendCharts",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 自定义工单--工单状态占比情况分析
export const getCustomTaskState = (params = {}) => {
  const args = {
    url: servicePath + "/portal/customizeTask/getTaskState",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}


// 自定义工单--工单处理情况按区域
export const getTaskDisposeSituationByArea = (params = {}) => {
  const args = {
    url: servicePath + "/portal/customizeTask/getTaskDisposeSituationByArea",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 自定义工单--工单处理情况按项目
export const getTaskDisposeSituationByProject = (params = {}) => {
  const args = {
    url: servicePath + "/portal/customizeTask/getTaskDisposeSituationByProject",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 代办-获取系统分类列表
export const getSystemConfigurationCount = (params = {}) => {
  const args = {
    url: servicePath + "/agent/businessSystemConfiguration/getSystemConfigurationCount",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 代办-获取代办列表
export const getPendingTaskPageList = (params = {}) => {
  const args = {
    url: servicePath + "/agent/treatAlreadyOffice/getPendingTaskPageList",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}
// 代办-待办详情
export const getPendingTaskById = (params = {}) => {
  const args = {
    url: servicePath + "/agent/treatAlreadyOffice/getPendingTaskById",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  };
  return uniHttp.request(args);
}


// 代办-修改待办是否已读状态（系统公告）
export const updateReadingStatus = (params = {}) => {
  const args = {
    url: servicePath + "/agent/treatAlreadyOffice/updateReadingStatus",
    method: "POST",
    params:{
      ...params,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

