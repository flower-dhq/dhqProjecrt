import Vue from 'vue';
import uniHttp from "./uni-request";
import Utils from '@/js/utils'
const servicePath = "/meeting"; // 接口服务路径名

// 会议室列表 - 分页查询列表
export const getMeetingRoomList = (params = {}) => {
  const { O_USER_INFO } = Vue.prototype.$constant;
  const { phoneNumber, companyId, id } = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
  const args = {
    url: servicePath + '/owner/meeting/reserve/queryPage',
    method: 'POST',
    params: {
      ...params,
      header: {
        "myPhone": phoneNumber,
        "myCompanyId": companyId,
        "companyId": companyId,
        "myUserId": encodeURI(id),
        "x-user-id": encodeURI(id),
        "userId": encodeURI(id),
      },
    },
  };
  return uniHttp.request(args);
};

// 会议室详情 - 获取会议室详情
export const getMeetingReserveDetail = (params = {}) => {
  const { O_USER_INFO } = Vue.prototype.$constant;
  const { phoneNumber, companyId, id } = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
  const args = {
    url: servicePath + '/owner/meeting/reserve/getMeetingReserveDetail',
    method: 'POST',
    params: {
      ...params,
      header: {
        "myPhone": phoneNumber,
        "myCompanyId": companyId,
        "companyId": companyId,
        "myUserId": encodeURI(id),
        "x-user-id": encodeURI(id),
        "userId": encodeURI(id),
      },
    },
  };
  return uniHttp.request(args);
};

export const submitMeetingReserve = (params = {}) => {
  const { O_USER_INFO } = Vue.prototype.$constant;
  const { phoneNumber, companyId, id, fullName } = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
  const args = {
    url: servicePath + '/owner/meeting/reserve/submitMeetingReserve',
    method: 'POST',
    params: {
      ...params,
      header: {
        "myPhone": phoneNumber,
        "myCompanyId": companyId,
        "companyId": companyId,
        "myUserId": encodeURI(id),
        "myUserName": fullName?encodeURI(fullName):'empty',
        "x-user-id": encodeURI(id),
        "userId": encodeURI(id),
      },
    },
  };
  return uniHttp.request(args);
};

// 查询发票抬头信息
export const getInvoiceInfoByPhone = (params = {}) => {
  const args = {
    url: '/neikong/customerInfo/getInvoiceInfoByPhone',
    method: 'GET',
    params: {
      ...params,
      // header: {
      //   "myPhone": phoneNumber,
      //   "myCompanyId": companyId,
      //   "companyId": companyId,
      //   "myUserId": encodeURI(memberId),
      //   "x-user-id": encodeURI(memberId),
      //   "userId": encodeURI(memberId),
      // },
    },
  };
  return uniHttp.request(args);
};
// 我的会议室 - 获取各状态数
export const queryPageMyMeetingCount = (params = {}) => {
  const { O_USER_INFO } = Vue.prototype.$constant;
  const { phoneNumber, companyId, id } = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
  const args = {
    url: servicePath + '/owner/meeting/reserve/queryPageMyMeetingCount',
    method: 'post',
    params: {
      ...params,
      header: {
        "myPhone": phoneNumber,
        "myCompanyId": companyId,
        "companyId": companyId,
        "myUserId": encodeURI(id),
        "x-user-id": encodeURI(id),
        "userId": encodeURI(id),
      },
    },
  };
  return uniHttp.request(args);
}; 
// 我的会议室 - 列表数据
export const queryPageMyMeeting = (params = {}) => {
  const { O_USER_INFO } = Vue.prototype.$constant;
  const { phoneNumber, companyId, id } = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
  const args = {
    url: servicePath + '/owner/meeting/reserve/queryPageMyMeeting',
    method: 'post',
    params: {
      ...params,
      header: {
        "myPhone": phoneNumber,
        "myCompanyId": companyId,
        "companyId": companyId,
        "myUserId": encodeURI(id),
        "x-user-id": encodeURI(id),
        "userId": encodeURI(id),
      },
    },
  };
  return uniHttp.request(args);
};

// 我的会议室 - 订单详情
export const queryMyMeetingDetail = (params = {}) => {
  const { O_USER_INFO } = Vue.prototype.$constant;
  const { phoneNumber, companyId, id } = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
  const args = {
    url: servicePath + '/owner/meeting/reserve/queryMyMeetingDetail',
    method: 'post',
    params: {
      ...params,
      header: {
        "myPhone": phoneNumber,
        "myCompanyId": companyId,
        "companyId": companyId,
        "myUserId": encodeURI(id),
        "x-user-id": encodeURI(id),
        "userId": encodeURI(id),
      },
    },
  };
  return uniHttp.request(args);
};
// 我的会议室 - 取消会议室预定
export const cancelMyMeeting = (params = {}) => {
  const { O_USER_INFO } = Vue.prototype.$constant;
  const { phoneNumber, companyId, id } = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
  const args = {
    url: servicePath + '/owner/meeting/reserve/cancelOrder',
    method: 'post',
    params: {
      ...params,
      header: {
        "myPhone": phoneNumber,
        "myCompanyId": companyId,
        "companyId": companyId,
        "myUserId": encodeURI(id),
        "x-user-id": encodeURI(id),
        "userId": encodeURI(id),
      },
    },
  };
  return uniHttp.request(args);
};
