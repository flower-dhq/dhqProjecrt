import uniHttp from "./uni-request";
import mpaasFetch from '@/js/mpassFetch';
import appConfig from '@/app-config';
const leasingPath = appConfig.LEASING_V6 ? '/leasing-60' : "/leasing"; // 接口服务路径名
const neikongPath = appConfig.NEIKONG_V6 ? '/neikong-60' : "/neikong"; // 接口服务路径名
const leasingdata = appConfig.LEASING_V6 ? '/leasingbi-60' : "/leasingbi";

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
export const checkBillDetailRecordForCharge = (params = {}) => {
  const args = {
    url: leasingPath + "/billDetailRecord/checkBillDetailRecordForCharge",
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
export const getOrderNum = (params = {}) => {
  const args = {
    url: leasingPath + "/chargeReceivableOnline/getOrderNum",
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
export const chinaumsPay = (params = {}) => {
  const args = {
    url: leasingPath + "/chargeReceivableOnline/chinaumsPay",
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
export const isPaySuccess = (params = {}) => {
  const args = {
    url: leasingPath + "/chargeReceivableOnline/isPaySuccess",
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

export const getBillSharingSettingTime = (params = {}) => {
  const args = {
    url: leasingPath + "/chargeReceivableOnline/getBillSharingSettingTime",
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
export const selectBillSharingSettingByKey = (params = {}) => {
  const args = {
    url: leasingPath + "/chargeReceivableOnline/selectBillSharingSettingByKey",
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
// 取消订单
export const cancelChargePayOrder = (params = {}) => uniHttp.request({
  url: leasingPath + '/chargeReceivableOnline/cancelChargePayOrder',
  method: 'POST',
  params: {
    ...params,
    header: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  },
})
export const geProjectsByCompanyId = (params = {}) => {
  const args = {
    url: neikongPath + "/projectTab/geProjectsByCompanyIdorProjectName",
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
export const getYbkOrderNum = (params = {}) => {
  const args = {
    url: leasingPath + "/chargeReceivableOnline/getYbkOrderNum",
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
export const getResourceMenuManger = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCard/getParklotList",
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
export const getParklotListForOwner = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCard/getParklotListForOwner",
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
export const getLeasingParklotList = (params = {}) => {
  const args = {
    url: leasingPath + "/parklot/getLeasingParklotList",
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
export const getDictDetailByCompanyAndCode = (params = {}) => {
  const args = {
    url: neikongPath + "/dict/getDictDetailByCompanyAndCode",
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
export const getDictDetailByCode = (params = {}) => {
  const args = {
    url: neikongPath + "/dict/getDictDetailByCode",
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
export const selectParklotMonthCardListByPageNew = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCard/selectOwnerList",
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
export const getOwnerContractCategoryList = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCard/getOwnerContractCategoryList",
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
export const getFeeItemsByCategoryId = (params = {}) => {
  const args = {
    url: leasingPath + "/contractSetting/getFeeItemsByCategoryId",
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
export const generatorSerialNum = (params = {}) => {
  const args = {
    url: leasingPath + "/serialnum/generatorSerialNum",
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
export const saveOrDeleteFileInfo = (params = {}) => {
  const args = {
    url: leasingPath + "/fileInfo/saveOrDeleteFileInfo",
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
export const MonthCardSettingselect = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCardSerialnumRSettingController/select",
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
export const commitParklotMonthCardApprove = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCard/commitOwnerParklotMonthCard",
    method: "POST",
    params: {
      ...params,
      header: {
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};

export const renewalsOwnerParklotMonthCard = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCard/renewalsOwnerParklotMonthCard",
    method: "POST",
    params: {
      ...params,
      header: {
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};

export const getParklotMonthCardFeeItemByCategoryId = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCard/getParklotMonthCardFeeItemByCategoryId",
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
export const getParklotMonthCardDetail = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCard/getParklotMonthCardDetail",
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
export const renewalsParklotMonthCard = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCard/renewalsParklotMonthCard",
    method: "POST",
    params: {
      ...params,
      header: {
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const changeParklotMonthCard = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCard/changeParklotMonthCard",
    method: "POST",
    params: {
      ...params,
      header: {
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  };
  return uniHttp.request(args);
};
export const checkMonthCardOpenCardTime = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCard/checkMonthCardOpenCardTime",
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
export const getMonthCardCancellation = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCard/getMonthCardCancellation",
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

//发起合同签署接口
export const initiateFileSigning = (params = {}) => {
  const args = {
    url: leasingPath + "/eSignature/initiateFileSigning",
    method: "POST",
    params: {
      ...params,
      // header: {
      //   "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      // },
    },
  };
  return uniHttp.request(args);
};
// 退租功能
export const rescindParklotMonthCard = (params = {}) => {
  const args = {
    url: leasingPath + "/leasingContractParklotMonthCard/rescindParklotMonthCard",
    method: "POST",
    params: {
      ...params,
    },
  };
  return uniHttp.request(args);
};