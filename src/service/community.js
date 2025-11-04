import uniHttp from "./uni-request"; 
const servicePath = "/community-service"; // 接口服务路径名

export const getCompanyConfig = (params = {}) => {
  const args = {
    url: servicePath + "/companyConfig/getCompanyConfig",
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

// 获取验证码
export const getSmsCode = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/getSmsCode",
    method: "POST",
    params
  };
  return uniHttp.request(args);
}

// 获取楼栋
export const getbuldingInfoByParam = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/getbuldingInfoByParam",
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
// 认证管理列表
export const getRoomPage = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/getRoomPageByBuildingIds",
    method: "POST",
    params:{
			...params,
			header: {
			  "Content-Type": "application/json",
			},
		}
  };
  return uniHttp.request(args);
};

// 新认证管理列表  20231128
export const getRoomInfoPage = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/getRoomInfoPage",
    method: "POST",
    params:{
			...params,
			header: {
			  "Content-Type": "application/json",
			},
		}
  };
  return uniHttp.request(args);
};

// 获取认证率
export const getStatistic = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/getStatistic",
    method: "POST",
    params:{
			...params,
			header: {
			  "Content-Type": "application/json",
			},
		}
  };
  return uniHttp.request(args);
};

// PC后台认证、拒绝接口
export const approvalAuthCommBg = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/approvalAuthCommBg",
    method: "POST",
    params:{
			...params,
			header: {
			  "Content-Type": "application/json",
			},
		}
  };
  return uniHttp.request(args);
};

// PC后台重新认证
export const reApprove = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/reApprove",
    method: "POST",
    params:{
			...params,
			header: {
			  "Content-Type": "application/json",
			},
		}
  };
  return uniHttp.request(args);
};

// PC后台取消认证
export const cancelApproveBg = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/cancelApproveBg",
    method: "POST",
    params:{
			...params,
			header: {
			  "Content-Type": "application/json",
			},
		}
  };
  return uniHttp.request(args);
};

// 未认证-客户列表 
export const getNoAuthOwnerInfoPage = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/getNoAuthOwnerInfoPage",
    method: "POST",
    params:{
			...params,
			header: {
			  "Content-Type": "application/json",
			},
		}
  };
  return uniHttp.request(args);
};

// 未认证-房间列表 
export const getNoAuthHouseInfoPage = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/getNoAuthHouseInfoPage",
    method: "POST",
    params:{
			...params,
			header: {
			  "Content-Type": "application/json",
			},
		}
  };
  return uniHttp.request(args);
};

// 发短信
export const smsMessage = (params = {}) => {
  const args = {
    url: servicePath + "/ownerAuthInfo/smsMessage",
    method: "POST",
    params:{
			...params,
			header: {
			  "Content-Type": "application/json",
			},
		}
  };
  return uniHttp.request(args);
};
// 获取全部标签列表
export const getPeopleTags = (params = {}) => uniHttp.request({
  url: servicePath + '/label/getAllLabel',
  method: 'POST',
  params
})

// 获取业主的标签列表
export const getCustomerTagList = (params = {}) => uniHttp.request({
  url: servicePath + '/label/getUnifiedMemberLabelById',
  method: 'GET',
  params
})

// 更新业主的标签
export const updateCustomerTagForMoreIds = (params = {}) => uniHttp.request({
  url: servicePath + '/label/updateUnifiedMemberLabel',
  method: 'POST',
  params: {
    header: {
      'content-type': 'application/json'
    },
    ...params
  }
})

// 获取该房间下的所有业主
export const getOwnerInfoByAddrId = (params = {}) => uniHttp.request({
  url: servicePath + '/ownerAuthInfo/getOwnerInfo',
  method: 'POST',
  params: {
    header: {
      'content-type': 'application/json'
    },
    ...params
  }
})

// 认证管理的发送短信邀请
export const inviteMemberBySMS = (params = {}) => uniHttp.request({
  url: servicePath + '/ownerAuthInfo/inviteMemberBySMS',
  method: 'POST',
  params: {
    header: {
      'content-type': 'application/json'
    },
    ...params
  }
})