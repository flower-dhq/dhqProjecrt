
import uniHttp from "./uni-request"; 
const servicePath = "/leasingbi_new"; // 接口服务路径名
const { CHARGE_DEV_BASE_URL, CHARGE_PROD_BASE_URL } = (process.env.VUE_APP_CONFIG && JSON.parse(process.env.VUE_APP_CONFIG)) || {};
const prodBaseUrl = CHARGE_PROD_BASE_URL
const devBaseUrl = CHARGE_DEV_BASE_URL

// 收缴情况
export const getCollectionAnalysis = (params = {}) => {
  const args = {
    url: servicePath + "/collectionAnalysis/getCollectionAnalysis",
    method: "POST",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
      header: {
        "Content-Type": "application/json",
      },
    },
  };
  return uniHttp.request(args);
}

// 收缴趋势
export const getCollectionTrend = (params = {}) => {
  const args = {
    url: servicePath + '/collectionAnalysis/getCollectionTrend',
    method: "POST",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
      header: {
        "Content-Type": "application/json",
      },
    },
  };
  return uniHttp.request(args);
}

// 支付方式分析
export const getPaymentAnalysis = (params = {}) => {
  const args = {
    url: servicePath + '/leasingPortalLargeScreen/getPaymentAnalysis',
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}


// 收缴率排名
export const getCollectionRanking = (params = {}) => {
  const args = {
    url: servicePath + '/collectionAnalysis/getCollectionRanking',
    method: "POST",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
      header: {
        "Content-Type": "application/json",
      },
    },
  };
  return uniHttp.request(args);
}

// 现金流情况
export const getCashFlowSituation = (params = {}) => {
  const args = {
    url: servicePath + '/leasingPortalLargeScreen/getCashFlowSituation',
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}

// 现金流趋势
export const getCashFlowTrend = (params = {}) => {
  const args = {
    url: servicePath + '/leasingPortalLargeScreen/getCashFlowTrend',
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}


// 收缴率排名
export const getAdvanceCollectionAnalysis = (params = {}) => {
  const args = {
    url: servicePath + '/advanceCollectionAnalysis/getAdvanceCollectionAnalysis',
    method: "POST",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
      header: {
        "Content-Type": "application/json",
      },
    },
  };
  return uniHttp.request(args);
}

// 预收率排名
export const getAdvanceCollectionRanking = (params = {}) => {
  const args = {
    url: servicePath + '/advanceCollectionAnalysis/getAdvanceCollectionRanking',
    method: "POST",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
      header: {
        "Content-Type": "application/json",
      },
    },
  };
  return uniHttp.request(args);
}

// 现清欠分析
export const getClearArrearsAnalysisData = (params = {}) => {
  const args = {
    url: servicePath + "/clearArrearsAnalysis/getClearArrearsAnalysisData",
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}

// 欠费账龄分析
export const getArrearsAccountAgeData = (params = {}) => {
  const args = {
    url: servicePath + "/clearArrearsAnalysis/getArrearsAccountAgeData",
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}


// 欠费账龄分析
export const getClearArrearsTrendChart = (params = {}) => {
  const args = {
    url: servicePath + "/clearArrearsAnalysis/getClearArrearsTrendChart",
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}


// 清欠排名情况列表
export const getClearArrearsList = (params = {}) => {
  const args = {
    url: servicePath + "/clearArrearsAnalysis/getClearArrearsList",
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}

// 多经收入情况
export const getDjStatisticsData = (params = {}) => {
  const args = {
    url: servicePath + '/dj/getDjStatisticsData',
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}

// 多经收入排名
export const getDjRankData = (params = {}) => {
  const args = {
    url: servicePath + '/dj/getDjRankData',
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}

// 招商分析情况
export const getContractStatisticsData = (params = {}) => {
  const args = {
    url: servicePath + '/contract/getContractStatisticsData',
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}

// 招商趋势分析
export const getContractTrendData = (params = {}) => {
  const args = {
    url: servicePath + '/contract/getContractTrendData',
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}

// 获取类型
export const getTargetSettingByPortal = (params = {}) => {
  const args = {
    url: servicePath + '/leasingPortalLargeScreen/getTargetSettingByPortal',
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}

// 经营成本
export const getOperatingCost = (params = {}) => {
  const args = {
    url: servicePath + '/leasingPortalLargeScreen/getOperatingCost',
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}

// 收缴情况分析/收入情况分析
export const collectionSituation = (params = {}) => {
  const args = {
    url: servicePath + '/leasingPortalLargeScreen/collectionSituation',
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}

// 收缴趋势图/收入趋势图
export const collectionChart = (params = {}) => {
  const args = {
    url: servicePath + '/leasingPortalLargeScreen/collectionChart',
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}

// 清欠情况分析
export const clearSituation = (params = {}) => {
  const args = {
    url: servicePath + '/leasingPortalLargeScreen/clearSituation',
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}

// 清欠情况分析
export const clearChart = (params = {}) => {
  const args = {
    url: servicePath + '/leasingPortalLargeScreen/clearChart',
    method: "GET",
    params: {
      ...params,
      devBaseUrl,
      prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}


//房屋数据填报统计
export const getHouseDataReportCount= (params = {}) => {

  const args = {
    url: "/datawarehouse/portal/houseDataReport/getHouseDataReportCount",
    method: "POST",
    params:{
      ...params,
      devBaseUrl,
      prodBaseUrl,
      header: {
        "Content-Type": "application/json",
      },
    }
  };
  return uniHttp.request(args);
}

// 车位数
export const getParkinglotNum = (params = {}) => {
  const args = {
    url: servicePath + '/parkinglot/getParkinglotNum',
    method: "GET",
    params: {
      ...params,
      // devBaseUrl,
      // prodBaseUrl,
    }
  };
  return uniHttp.request(args);
}
// export const getParkinglotNum = (params) => request({
//   method: 'GET',
//   // dataType:'JSON',
//   url: BASE_URL + '/parkinglot/getParkinglotNum',
//   headers: {
//     'Accept': 'application/json, text/plain, */*',
//     'Content-Type': 'application/json;charset=UTF-8'
//   },
//   params,
// })