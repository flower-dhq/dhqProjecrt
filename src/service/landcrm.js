import Axios from './axios'
const servicePath = '/landcrm'  

// 示例
export const refreshToken = (params) => {
  const args = {
    url: `${servicePath}/client/example`,
    params: params || {},
    method: 'post'
  }
  return request(args)
}

// 登录
export const qpiUserLogin = (params) => {
  const args = {
    url: `${servicePath}/rest/userInfo/qpiUserLogin`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}

// 退出登录
export const logout = (params) => {
  const args = {
    url: `${servicePath}/rest/userInfo/logout`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}

// 获取验证码
export const getVerifyCode = (params) => {
  const args = {
    url: `${servicePath}/rest/userInfo/getVerifyCode`,
    params: params || {},
    method: 'get'
  }
  return Axios.request(args)
}

// 获取菜单
export const getFunctionButtons2 = (params) => {
  const args = {
    url: `${servicePath}/rest/postInfo/getFunctionButtons2`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}


// 获取菜单
export const getUserButtons = (params) => {
  const args = {
    url: `${servicePath}/rest/postInfo/getUserButtons`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}


// 获得区域列表
export const getAreaList = (params) => {
  const args = {
    url: `${servicePath}/rest/areaInfo/getAreaList`,
    params: params || {},
    method: 'get',
  }
  return Axios.request(args)
}
// 获取组织架构
export const getArchInfo = (params) => {
  const args = {
    url: `${servicePath}/rest/archInfo/list`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}
//区域
export const getAreaLists = (params) => {
  const args = {
    url: `${servicePath}/rest/areaInfo/getAreaList?userId=${params}`,
    params: params ,
    method: 'get',
  }
  return Axios.request(args)
}

//项目
export const getProjectLists = (userId,areaId) => {
  const args = {
    url: `${servicePath}/rest/projectInfo/getProjectList?userId=${userId}&areaId=${areaId}`,
    params: {userId,areaId} ,
    method: 'get',
  }
  return Axios.request(args)
}

//专业
export const getDictDetail = (params) => {
  const args = {
    url: `${servicePath}/rest/dictDetailInfo/getDictDetail`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}

// 获得项目列表
export const getProjectList = (params) => {
  const args = {
    url: `${servicePath}/rest/projectInfo/getProjectList`,
    params: params || {},
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}

// 获得不受权限限制的区域列表
export const getAreaListByCompanyId = (param) => {
  const args = {
    url: `${servicePath}/rest/areaInfo/getAreaListByCompanyId`,
    params: param,
    method: 'get',
  }
  return Axios.request(args)
}

// 获得不受权限限制的项目列表
export const getProjectsByAreaId = (params) => {
  const args = {
    url: `${servicePath}/rest/projectInfo/projectList`,
    params: params || {},
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}



// 交接班配置
export const getShiftingElement = (params) => {
  const args = {
    url: '/officeSystem/shiftingElement/list',
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

// 交接班超时配置
export const getShiftingConfigList = (params) => {
  const args = {
    url: '/officeSystem/shiftingConfig/getShiftingConfigList',
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

// 交接班超时时间配置编辑保存
export const saveOrUpdate = (params) => {
  const args = {
    url: '/officeSystem/shiftingConfig/saveOrUpdate',
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

// 交接班岗位配置详情
export const getShiftingDetail = (params) => {
  const args = {
    url: '/officeSystem/shiftingElement/detail',
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

export const getJobList = (params) => {
  const args = {
    url: `${servicePath}/rest/jobInfo/getJobArch`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}

// 交接班岗位配置保存
export const saveShifting = (params) => {
  const args = {
    url: '/officeSystem/shiftingElement/save',
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

// 交接班记录列表
export const getShiftingRecordList = (params) => {
  const args = {
    url: '/officeSystem/shiftingRecordInfo/getShiftingRecordList',
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
  }
//详情
  export const getShiftingRecordDetail = (Id) => {
    const args = {
      url: `/officeSystem/shiftingRecordInfo/getShiftingRecordDetail/${Id}`,
      params: Id || {},
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return Axios.request(args)
    }
// 交接班记录导出列表
export const exportShiftingRecord = (params) => {
  const args = {
    url: '/officeSystem/shiftingRecordInfo/exportShiftingRecord',
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'blob'
  }
  return Axios.request(args)
  }

  // 交接班岗位配置保存
export const approveShifting = (params) => {
  const args = {
    url: '/officeSystem/shiftingRecordInfo/approveShifting',
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return Axios.request(args)
}

//获取人员
export const getJobArchUsers = (params) => {
  const args = {
    url: `${servicePath}/rest/jobInfo/getJobArchUsers`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}

//获取房间列表
export const getHouseAddrInfoListToPage = (params) => {
  const args = {
    url: `${servicePath}/rest/baseDataInfo/getHouseAddrInfoListToPage`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}

// 获取岗位信息
export const getUserList = (params) => {
  const args = {
    url: `${servicePath}/rest/userTabInfo/getUserList`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}

// 获取公司岗位列表
export const getPostList = (params) => {
  const args = {
    url: `${servicePath}/rest/postInfo/getPostList`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}

// 获取岗位
export const getJobArchByCompanyId = (params) => {
  const args = {
    url: `${servicePath}/rest/jobInfo/getJobArchByCompanyId`,
    params: params || {},
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}

export const postGroupList = (params) => {
  const args = {
    url: `${servicePath}/rest/postInfo/postGroupList`,
    params: params || {},
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Axios.request(args)
}