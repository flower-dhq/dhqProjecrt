import uniHttp from './uni-request'
const servicePath6 = '/wycrm_6.0' // 接口服务路径名
const landcrm = '/landcrm' // 接口服务路径名

export const getFieldAndValList = (params) =>
  uniHttp.request({
    url: servicePath6 + '/rest/quesOaFormField/getFieldAndValList',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })

export const getServerSettingFiledInfoByOperate = (params = {}) => {
  const args = {
    url: servicePath6 + '/rest/quesTaskServerSetting/getServerSettingFiledInfoByOperate',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  }
  return uniHttp.request(args)
}

export const getProjectAndQuesRange = (params) =>
  uniHttp.request({
    url: landcrm + '/rest/baseDataInfo/getProjectAndQuesRange',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })

export const getQuesTaskServerTypeListByPage = (params = {}) => {
  const args = {
    url: servicePath6 + '/rest/quesTaskServerType/getQuesTaskServerTypeListByPage',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  }
  return uniHttp.request(args)
}

export const getQuesTaskServerSettingTree = (params = {}) => {
  const args = {
    url: servicePath6 + '/rest/quesTaskServerSetting/getQuesTaskServerSettingTree',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  }
  return uniHttp.request(args)
}

export const saveAndUpdateQuestionTask = (params = {}) => {
  const args = {
    url: servicePath6 + '/rest/questionTask/saveAndUpdateQuestionTask',
    method: 'POST',
    params: params,
		header: {
		  'Content-Type': 'application/json;charset=utf-8'
		}
  }
  return uniHttp.request(args)
}

export const getLastQuesTaskServerTypeList = (params = {}) => {
  const args = {
    url: servicePath6 + '/rest/quesTaskServerType/getLastQuesTaskServerTypeList',
    method: 'POST',
    params: params,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return uniHttp.request(args)
}

export const findMyTaskListByPage = (params = {}) => {
  const args = {
    url: servicePath6 + '/rest/myTask/findMyTaskListByPage',
    method: 'POST',
    params: params,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return uniHttp.request(args)
}

export const getQuestionTaskListByPage = (params = {}) => {
  const args = {
    url: servicePath6 + '/rest/questionTask/getQuestionTaskListByPage',
    method: 'POST',
    params: params,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return uniHttp.request(args)
}

export const getAllQuesTaskServerTypes = (params = {}) => {
  const args = {
    url: servicePath6 + '/rest/quesTaskServerType/getAllQuesTaskServerTypes',
    method: 'POST',
    params: params,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return uniHttp.request(args)
}
