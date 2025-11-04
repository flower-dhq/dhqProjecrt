import Axios from './axios'

const servicePath = '/officeSystem'

// 汇报列表
export const reportList = (params,size,page) => {
  const args = {
    url: `${servicePath}/weeklyreport/page/${size}/${page}`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }

  }
  return Axios.request(args)
}

// 全部汇报
export const allReports = (params,size,page) => {
  const args = {
    url: `${servicePath}/weeklyreport/allPage/${size}/${page}`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

// 预警查询
export const warnList = (params,size,page) => {
  const args = {
    url: `${servicePath}/weeklyreportwarn/page/${size}/${page}`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

//转派员工列表
export const getEmployeeInfo = (params) => {
  const args = {
    url: `${servicePath}/shiftingRecordInfo/getEmployeeInfo`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

//转派
export const updateTbbShiftingRecord = (params) => {
  const args = {
    url: `${servicePath}/shiftingRecordInfo/updateTbbShiftingRecord`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 钥匙信息列表
export const keyInfoListPage = (params) => {
  const args = {
    url: `${servicePath}/keyInfo/keyInfoListPage`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 新增钥匙信息
export const addKeyInfo = (params) => {
  const args = {
    url: `${servicePath}/keyInfo/addKeyInfo`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 根据id获取钥匙详情
export const getKeyInfoId = (params) => {
  const args = {
    url: `${servicePath}/keyInfo/getKeyInfoId`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 删除钥匙信息
export const deleteKeyInfo = (params) => {
  const args = {
    url: `${servicePath}/keyInfo/deleteKeyInfo`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 编辑钥匙信息
export const upDateKeyInfo = (params) => {
  const args = {
    url: `${servicePath}/keyInfo/upDateKeyInfo`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 钥匙借用登记
export const saveKeyLending = (params) => {
  const args = {
    url: `${servicePath}/keyInfo/saveKeyLending`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 钥匙借用记录列表分页
export const keyLendingListPage = (params) => {
  const args = {
    url: `${servicePath}/keyLending/keyLendingListPage`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 钥匙借用记录详情
export const keyLendCondition = (params) => {
  const args = {
    url: `${servicePath}/keyLending/keyLendCondition`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 钥匙借用操作记录
export const keyLendRecord = (params) => {
  const args = {
    url: `${servicePath}/keyLending/keyLendRecord`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 钥匙借用审批
export const keyLendingAudit = (params) => {
  const args = {
    url: `${servicePath}/keyLending/keyLendingAudit`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 获取借用记录数量
export const keyLendingAuditNum = (params) => {
  const args = {
    url: `${servicePath}/keyLending/keyLendingAuditNum`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 钥匙借出
export const keyLending = (params) => {
  const args = {
    url: `${servicePath}/keyLending/keyLending`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 钥匙归还
export const recoverKey = (params) => {
  const args = {
    url: `${servicePath}/keyLending/recoverKey`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 钥匙借用历史
export const keyLendHistory = (params) => {
  const args = {
    url: `${servicePath}/keyInfo/keyLendHistory`,
    params: params || {},
    method: 'post'
  }
  return Axios.request(args)
}

// 钥匙借用下载二维码
export const keyInfoDownloadQrCode = (params) => {
  const args = {
    url: `${servicePath}/keyInfo/keyInfoDownloadQrCode`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    // responseType: 'blob'
  }
  return Axios.request(args)
}



  // 提交工作日志
export const saveOrUpdate = (params) => {
  const args = {
    url: `${servicePath}/weeklyreport/saveOrUpdate`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

  // 删除日志
  export const deleteReport = (id) => {
    const args = {
      url: `${servicePath}/weeklyreport/delete/${id}`,
      params: {},
      method: 'get',
    }
    return Axios.request(args)
  }

  // 获取日志详情
  export const getReportDetail = (params) => {
    const args = {
      url: `${servicePath}/weeklyreport/detailById`,
      params: params || {},
      method: 'get',
    }
    return Axios.request(args)
  }

  // 查询钥匙借用流程审批设置
export const getKeyAuditFlow = (params) => {
  const args = {
    url: `${servicePath}/keyAuditFlow/getKeyAuditFlow`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  return Axios.request(args)
}

// 保存钥匙借用设置
export const saveOrUpdateKeyLendingSetting = (params) => {
  const args = {
    url: `${servicePath}/keyLendingSetting/saveOrUpdateKeyLendingSetting`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  return Axios.request(args)
}

// 保存钥匙借用设置
export const getKeyLendingSetting = (params) => {
  const args = {
    url: `${servicePath}/keyLendingSetting/getKeyLendingSetting`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  return Axios.request(args)
}

// 校验钥匙借用流程审批是否可以修改
export const checkKeyAuditFlow = (params) => {
  const args = {
    url: `${servicePath}/keyAuditFlow/checkKeyAuditFlow`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  return Axios.request(args)
}

// 保存钥匙借用流程审批设置
export const saveOrUpdateKeyAuditFlow = (params) => {
  const args = {
    url: `${servicePath}/keyAuditFlow/saveOrUpdateKeyAuditFlow`,
    params: params || [],
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  return Axios.request(args)
}

// 钥匙信息导出
export const exportKeyInfo = (params) => {
  const args = {
    url: `${servicePath}/keyInfo/exportKeyInfo`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'blob'
  }
  return Axios.request(args)
}

//作废钥匙借用记录
export const invalidKeyInfo = (params) => {
  const args = {
    url: `${servicePath}/keyInfo/invalidKeyInfo`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  return Axios.request(args)
}

// 钥匙借用记录导出
export const exportKeyLend = (params) => {
  const args = {
    url: `${servicePath}/keyLending/exportKeyLend`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'blob'
  }
  return Axios.request(args)
}

// 钥匙借用批量下载二维码
export const keyInfoDownloadQrCodeList = (params) => {
  const args = {
    url: `${servicePath}/keyInfo/keyInfoDownloadQrCodeList`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'blob'
  }
  return Axios.request(args)
}

//保存预警
export const warnSaveOrUpdate = (params) => {
  const args = {
    url: `${servicePath}/weeklyreportwarn/saveOrUpdate`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  return Axios.request(args)
}


// 排班查询
export const getShiftScheduleList = (params,size,page,userId) => {
  const args = {
    url: `${servicePath}/shiftSchedule/page/${size}/${page}`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Userid-Header': userId
    }
  }
  return Axios.request(args)
}

// 部门
export const getAllDept = (params) => {
  const args = {
    url: `${servicePath}/shiftSchedule/getAllDept`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

// 班次查询
export const getShiftSettingsList = (params,size,page, userId) => {
  const args = {
    url: `${servicePath}/shiftSettings/page/${size}/${page}`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Userid-Header': userId
    }
  }
  return Axios.request(args)
}

// 班次保存
export const saveSclassOrUpdate = (params) => {
  const args = {
    url: `${servicePath}/shiftSettings/saveOrUpdate`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

// 班次查询
export const getSclassById = (id) => {
  const args = {
    url: `${servicePath}/shiftSettings/getById/${id}`,
    params: {},
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

// 班次删除
export const deleteSclassById = (id) => {
  const args = {
    url: `${servicePath}/shiftSettings/delete/${id}`,
    params: {},
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

export const updateSclassById = (params) => {
  const args = {
    url: `${servicePath}/shiftScheduleRecord/updateInfo`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

export const exportShiftInfo = (params) => {
  const args = {
    url: `${servicePath}/shiftSchedule/exportShiftInfo`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'blob'
  }
  return Axios.request(args)
}

export const downloadTemplate = (params) => {
  const args = {
    url: `${servicePath}/shiftSchedule/downloadTemplate`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'blob'
  }
  return Axios.request(args)
}

// 排班信息导入
export const importShiftSchedule = (params) => {
  const args = {
    url: `${servicePath}/shiftSchedule/importShiftSchedule`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  return Axios.request(args)
}

// 排班删除
export const deleteShiftSchedule = (id) => {
  const args = {
    url: `${servicePath}/shiftSchedule/delete/${id}`,
    params: {},
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}



//预警详情
export const warnDetail = (id) => {
  const args = {
    url: `${servicePath}/weeklyreportwarn/byId/${id}`,
    params: {},
    method: 'get',
  }
  return Axios.request(args)
}

//删除预警
export const deleteWarn = (id) => {
  const args = {
    url: `${servicePath}/weeklyreportwarn/delete/${id}`,
    params: {},
    method: 'get',
  }
  return Axios.request(args)
}

//启用和禁用预警
export const changeWarnState = (id,type) => {
  //type 0：禁用；1：启用
  const args = {
    url: `${servicePath}/weeklyreportwarn/enable/${id}/${type}`,
    params: {},
    method: 'get',
  }
  return Axios.request(args)
}

//获取岗位id集合
export const getAuditJobIds = (params) => {
  const args = {
    url: `${servicePath}/keyLending/getAuditJobIds`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

//获取日报总数
export const getReportCount = (params) => {
  const args = {
    url: `${servicePath}/weeklyreport/pageCount`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

// 班次清空
export const deleteShiftScheduleRecord = (id) => {
  const args = {
    url: `${servicePath}/shiftScheduleRecord/delete/${id}`,
    params: {},
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}