import uniHttp from "./uni-request";
import mpaasFetch from '@/js/mpassFetch';
import appConfig from '@/app-config';
const leasingPath = appConfig.LEASING_V6 ? '/leasing-60' : "/leasing"; // 接口服务路径名
const neikongPath = appConfig.NEIKONG_V6 ? '/neikong-60' : "/neikong"; // 接口服务路径名
const leasingdata = appConfig.LEASING_V6 ? '/leasingbi-60' : "/leasingbi";
const energyPath = appConfig.ENERGY_V6 ? '/energy-charging-60' : "/energy-charging";
const community = '/community-service';

// 房屋租赁合同--列表
export const getHouseConstractList = (params = {}) => {
  const args = {
    url: leasingPath + "/houseContract/getHouseConstractList",
    method: "GET",
    params: {
      // header: {
      //   'content-type': 'application/json'
      // },
      ...params
    }
  };
  return uniHttp.request(args);
};

// 车位合同--列表
export const getCarPageList = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklot/pageListNew",
    method: "GET",
    params: {
      ...params
    }
  };
  return uniHttp.request(args);
};

export const getCarPageDetail = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklot/detail",
    method: "GET",
    params: {
      ...params
    }
  };
  return uniHttp.request(args);
};

// 车合同-应收
export const getParkingList = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractFeeitemSetting/parklotFeeitemList",
    method: "GET",
    params: {
      ...params
    }
  };
  return uniHttp.request(args);
};

// 房屋合同详情
export const getHouseContractInfo = (params = {}) => {
  const args = {
    url: leasingPath + "/houseContract/getHouseContractInfo",
    method: "GET",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};

// 资源合同详情
export const getResourceContractInfo = (params = {}) => {
  const args = {
    url: leasingPath + "/resourceContract/getResourceContractInfo",
    method: "GET",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};

// 有偿合同详情
export const getDetailBySerialNumber = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractPaidServiceSerialnum/getDetailBySerialNumber",
    method: "POST",
    params: {
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};

// 合同附件
export const getLeasingFileInfoList = (params = {}) => {
  const args = {
    url: neikongPath + "/fileInfo/getLeasingFileInfoList",
    method: "GET",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};


// 获取单元
export const getCellInfo = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractBaseRoom/getCellInfo",
    method: "GET",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};

//获取单元房间
export const getRoomIdListByBuildingId = (params = {}) => {
  const args = {
    url: leasingPath + "/houseContract/getRoomIdListByBuildingId",
    method: "GET",
    params: {
      ...params
    }
  };
  return uniHttp.request(args);
};

// 费项
export const getRelatedFeeItemList = (params = {}) => {
  const args = {
    url: leasingPath + "/feeItem/getRelatedFeeItemList",
    method: "GET",
    params
  };
  return uniHttp.request(args);
};

// 有偿服务合同--列表
export const getListLeasingContract = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractPaidServiceSerialnum/listLeasingContract",
    method: "POST",
    params: {
      header: {
        // 'content-type': 'application/json',
        'userId': '2063435',
        'x-companyId-header': '300',
        'x-user-header': '2063435',
        'x-userAccount-header': 'ybwlkjadmin',
        'x-userId-header': '2063435',
        'x-userName-header': '%E7%AE%A1%E7%90%86%E5%91%98',
        'x-userPhone-header': '17899990000',
        'token': '31f2c751fba1f3f045be8a2c698c6a35'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};

// 资源合同--列表
export const getResourceConstractList = (params = {}) => {
  const args = {
    url: leasingPath + "/resourceContract/getResourceConstractList",
    method: "GET",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};

export const getResourceMenuManger = (params = {}) => {
  const args = {
    url: leasingPath + "/resourceMenuManger/getResourceMenuManger",
    method: "GET",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};


export const getOrderListXS = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingTicketMessageManagementApp/getOrderListXS",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const getOwnerRoomByMemberId = (params = {}) => {
  const args = {
    url: neikongPath + "/ownerInfo/getOwnerRoomByMemberId",
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
export const printToPdf = (params = {}) => {
  const args = {
    url: leasingdata + "/htmlToPdf/printToPdf",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const getOwnerByMemberId = (params = {}) => {
  const args = {
    url: neikongPath + "/ownerInfo/getOwnerByMemberId",
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
export const getSysCodeValueList = (params = {}) => {
  const args = {
    url: leasingPath + "/feeItem/getSysCodeValueList",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const getCustomerDetailByCustomerId = (params = {}) => {
  const args = {
    url: neikongPath + "/customerInfo/getCustomerDetailByCustomerId",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const makeOutAnInvoiceForHisNew = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingInvoiceInAdvance/makeOutAnInvoiceForHisNew",
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
export const getTicketMessageListXSAPP = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingTicketMessageManagementApp/getTicketMessageListXSAPP",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const getSearchType = (params = {}) => {
  const args = {
    url: leasingPath + "/chargeReceivableOnline/getSearchType",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const getReceiptHistoryList = (params = {}) => {
  const args = {
    url: leasingPath + "/chargeReceivableOnline/getReceiptHistoryList",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const selectBillRecordByCustomerId = (params = {}) => {
  const args = {
    url: leasingPath + "/addBillRecord/selectBillRecordByCustomerId",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const selectRoomCodesByCustomerId = (params = {}) => {
  const args = {
    url: leasingPath + "/addBillRecord/selectRoomCodesByCustomerId",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const getBillDetailRecordByConfig = (params = {}) => {
  const args = {
    url: leasingPath + "/chargeReceivableOnline/getBillDetailRecordByConfig",
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
export const getPayOnlineSetting = (params = {}) => {
  const args = {
    url: leasingPath + "/baseSetting/getPayOnlineSetting",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const getPayOnlineSettingStaff = (params = {}) => {
  const args = {
    url: leasingPath + "/baseSetting/getPayOnlineSettingStaff/v2",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const getWxAppIdByCompanyId = (params = {}) => {
  const args = {
    url: neikongPath + "/ownerInfo/getWxAppIdByCompanyId",
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
export const selectReminderBySerialNumberAndRoomId = (params = {}) => {
  const args = {
    url: leasingPath + "/reminderNew/selectReminderBySerialNumberAndRoomId",
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
export const saveLog = (params = {}) => {
  const args = {
    url: leasingPath + "/chargeReceivableOnline/saveLog",
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
export const addReceivableHistoryOnline = (params = {}) => {
  const args = {
    url: leasingPath + "/chargeReceivableOnline/addReceivableHistoryOnline",
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
export const getPermissionProjects = (params = {}) => {
  const args = {
    url: neikongPath + "/cus/getPermissionProjects",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const getCustomerTree = (params = {}) => {
  const args = {
    url: leasingPath + "/customerInfo/getCustomerTree",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
//单元ID查楼层与房间
export const getFloorRoomInfoByCell = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractBaseRoom/getFloorRoomInfoByCell",
    method: "GET",
    params: {
      ...params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const getBillDetailRecordByCustomerId = (params = {}) => {
  const args = {
    url: leasingPath + "/chargeReceivableOnline/getBillDetailRecordByCustomerId",
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

//根据后台配置获取员工端欠费列表
export const getBillDetailRecordByConfigStaff = (params = {}) => {
  const args = {
    url: leasingPath + "/chargeReceivableOnline/getBillDetailRecordByConfigStaff",
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

// 查询账单列表
export const selectBillRecordByOwnerInfoId = (params = {}) => uniHttp.request({
  url: leasingPath + '/addBillRecord/selectBillRecordByOwnerInfoId',
  method: 'GET',
  params
})
//根据资产、客户名称快速模糊匹配(新)
export const getInfoByKeyword = (params = {}) => uniHttp.request({
  url: leasingPath + '/contractSettlement/getInfoByKeyword',
  method: 'GET',
  params
})
//根据合同号或者客户ID查询客户信息
export const getCustomerInfoByContractCode2 = (params = {}) => uniHttp.request({
  url: leasingPath + '/customerInfo/getCustomerInfoByContractCode2',
  method: 'GET',
  params
})
//获取临时性费项列表
export const getRelatedFeeItemList3 = (params = {}) => uniHttp.request({
  url: leasingPath + '/feeItem/getRelatedFeeItemList3',
  method: 'GET',
  params
})
// 查询客户资产
export const getPropertyByCustomerId = (params = {}) => uniHttp.request({
  url: leasingPath + '/contractSettlement/getPropertyByCustomerId',
  method: 'GET',
  params
})
// 临时费用新增-online
export const addBillDetailRecordAndReceivableRecordOnline = (params = {}) => uniHttp.request({
  url: leasingPath + '/billDetailRecord/addBillDetailRecordAndReceivableRecordOnline',
  method: 'POST',
  params
})
export const checkBillDetailRecordForCharge = (params = {}) => uniHttp.request({
  url: leasingPath + '/billDetailRecord/checkBillDetailRecordForCharge',
  method: 'GET',
  params
})
// 获取订单号
export const getOrderNum = (params = {}) => uniHttp.request({
  url: leasingPath + '/chargeReceivableOnline/getOrderNum',
  method: 'POST',
  params
})
// 获取二维码付款码
export const getPayInfoNew = (params = {}) => uniHttp.request({
  url: community + '/payCommon/v2/getPay',
  method: 'POST',
  params: {
    ...params,
    header: {
      "Content-Type": "application/json;charset=utf-8",
    },
  },
})
// 获取二维码付款码
export const isPaySuccess2 = (params = {}) => uniHttp.request({
  url: community + '/payCommon/v2/isPaySuccess',
  method: 'POST',
  params: {
    ...params,
    header: {
      "Content-Type": "application/json;charset=utf-8",
    },
  },
})
// 账单分享
export const makeBillSharingSetting = (params = {}) => uniHttp.request({
  url: leasingPath + '/chargeReceivableOnline/makeBillSharingSetting',
  method: 'POST',
  params
})
// 获取账单分享时间
export const getBillSharingSettingTime = (params = {}) => uniHttp.request({
  url: leasingPath + '/chargeReceivableOnline/getBillSharingSettingTime',
  method: 'GET',
  params
})


// 查询资源列表
export const getResourceList = (params = {}) => uniHttp.request({
  url: leasingPath + '/resourceManger/getResourceList',
  method: 'GET',
  params
})

// 新增资源
export const addResourceManger = (params = {}) => uniHttp.request({
  url: leasingPath + '/resourceManger/addResourceManger',
  method: 'POST',
  params
})
// 编辑资源
export const editResourceManger = (params = {}) => uniHttp.request({
  url: leasingPath + '/resourceManger/editResourceManger',
  method: 'POST',
  params
})
// 删除资源
export const deleteResourceManger = (params = {}) => uniHttp.request({
  url: leasingPath + '/resourceManger/deleteResourceManger',
  method: 'POST',
  params
})
// 资源点位详情
export const getResourceByResourceId = (params = {}) => uniHttp.request({
  url: leasingPath + '/resourceManger/getResourceByResourceId',
  method: 'GET',
  params
})
// 获取分类详情
export const getResourceMenuMangerDetailById = (params = {}) => uniHttp.request({
  url: leasingPath + '/resourceMenuManger/getResourceMenuMangerDetailById',
  method: 'GET',
  params
})

// 获取分类详情
export const getLastLevelList = (params = {}) => uniHttp.request({
  url: leasingPath + '/resourceMenuManger/getLastLevelList',
  method: 'GET',
  params
})

// 获取催缴单列表
export const getReminderNewListPagination = (params = {}) => uniHttp.request({
  url: leasingPath + '/reminderNew/listPagination',
  method: 'GET',
  params
})

// 更改催缴状态
export const updateReminderBatch = (params = {}) => uniHttp.request({
  url: leasingPath + '/reminderNew/reminderBatch',
  method: 'GET',
  params
})

// 单聊获取客户信息
export const getCustomerDetailByUnionId = (params = {}) => uniHttp.request({
  url: neikongPath + '/customerInfo/getCustomerDetailByUnionId',
  method: 'GET',
  params
})
// 更改催缴状态
export const cancelChargePayOrder = (params = {}) => uniHttp.request({
  url: leasingPath + '/chargeReceivableOnline/cancelChargePayOrder',
  method: 'POST',
  params
})

// 根据资产信息获取支付渠道
export const getPayChannelByPayAssetsParams = (params = {}) => {
  const args = {
    url: community + "/payCommon/v2/getPayChannelByPayAssetsParams",
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

// 根据资产信息获取支付方式
export const getPayTypeListByPayAssetsParams = (params = {}) => {
  const args = {
    url: community + "/payCommon/v2/getPayTypeListByPayAssetsParams",
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

//查询仪表信息接口
export const getMeterByCustomerIdAndRoomId = (params = {}) => {
  const args = {
    url: energyPath + "/egyPrepaidMeterRecord/getMeterByCustomerIdAndRoomId",
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

