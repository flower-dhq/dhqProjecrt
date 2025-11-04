import uniHttp from './uni-request'
const servicePath = '/wycrm_6.0'
const baseUrl = '/wuyecrm'
const wareUrl = '/warehouseManage'
const otherUrl = '/crm400'

/**
 *  业务配置-根据操作查询业务配置字段信息
 */
export const getServerSettingFiledInfoByOperate = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/quesTaskServerSetting/getServerSettingFiledInfoByOperate',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 *  业务配置-根据操作查询业务配置字段信息
 */
export const getQuestionTaskDetailByQuesTaskId = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/questionTask/getQuestionTaskDetailByQuesTaskId',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 *  业务配置-根据节点Key查询节点按钮信息
 */
export const getServerSettingBtnByTaskNodeKey = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/quesTaskServerSetting/getServerSettingBtnByTaskNodeKey',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 *  业务工单-根据工单ID查询记录
 */
export const getQuesRecordList = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/quesRecord/getQuesRecordList',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 * 业务工单-查询当前节点操作人
 */
export const getOrignUserList = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/questionTask/getUserList',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 * 获取分期
 */
export const getProjectList = (params) =>
  uniHttp.request({
    url: baseUrl + '/rest/projectInfo/getProjectList',
    method: 'GET',
    params: {
      ...params
    }
  })
/**
 * 获取岗位
 */
export const getJobArch = (params) =>
  uniHttp.request({
    url: baseUrl + '/rest/jobInfo/getJobArch',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 * 人员选择
 */
export const getJobArchUsers = (params) =>
  uniHttp.request({
    url: baseUrl + '/rest/jobInfo/getJobArchUsers',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 * 获取仓库接口
 */
export const getWarehouseList = (params) =>
  uniHttp.request({
    url: wareUrl + '/warehouse/warehouse/selectWarehouseList',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 * 获取材料分类
 */
export const getMaterialsCategory = (params) =>
  uniHttp.request({
    url: wareUrl + '/warehouse/goodsCategory/getGoodsCategoryList',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 * 获取材料列表
 */
export const getMaterialList = (params) =>
  uniHttp.request({
    url: wareUrl + '/warehouse/goodsInventory/getGimGoodsListForAPP',
    method: 'POST',
    params: params,
    header: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
/**
 * 获取材料列表
 */
export const getMaterialListNew = (params) =>
  uniHttp.request({
    url: wareUrl + '/syncXhw/getXhwGimList',
    method: 'POST',
    params: params,
    header: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
/**
 * 获取维修材料配置信息
 */
export const getMaterialSetting = (params) =>
  uniHttp.request({
    url: otherUrl + '/rest/repairAndOwnerSettingInfo/getCompanySettingjson',
    method: 'POST',
    params: params,
    header: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
/**
 * 获取问题材料的信息
 */
export const getMaterialInfoById = (params) =>
  uniHttp.request({
    url: otherUrl + '/rest/questionTaskInfo/findMaterialsByQuestaskIdNew',
    method: 'GET',
    params: {
      ...params
    }
  })
/**
 * 更新问题材料
 */
export const updateMaterialInfo = (params) =>
  uniHttp.request({
    url: otherUrl + '/rest/houseInfo/updateMaterialjson',
    method: 'POST',
    params: params,
    header: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
/**
 * 更新材料数据
 */
export const uploadMaterial = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/questionTaskInfo/saveWarehouseAndTaskNewjson',
    method: 'POST',
    params: params,
    header: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
/**
 * 领料出库
 */
export const saveWarehouseAndTaskNew = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/questionTask/saveWarehouseAndTaskNew',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 * 查询仓库物料使用明细列表
 */
export const getTbiMaterialList = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/questionTask/getTbiMaterialList',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 * 获取跟进人列表
 */
export const getFollowUserList = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/questionTask/getFollowUserList',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 * APP端完成率关闭率报表
 */
export const getQuestionTaskMonthRate = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/questionTaskReport/getQuestionTaskMonthRate',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 * app报表数据概览
 */
export const getQuestionTasDataOverview = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/questionTaskReport/getQuestionTasDataOverview',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })
/**
 * app报表预警中心
 */
export const getQuestionTaskWarnReport = (params) =>
  uniHttp.request({
    url: servicePath + '/rest/questionTaskReport/getQuestionTaskWarnReport',
    method: 'POST',
    params: {
      ...params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  })

  export const usergetProjectUserList = (params) => uniHttp.request({
    url: servicePath + '/rest/user/getProjectUserList', 
    method: 'POST',
    params: {
      ...params,
      header:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      }
    }
  })

  export const getHelperSetting = (params) => uniHttp.request({
    url: servicePath + '/rest/questionTask/getHelperSetting', 
    method: 'POST',
    params: {
      ...params,
      header:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      }
    }
  })
  /**
	 * 获取装修列表
	 */
	export const getDecorationTableList = (params) =>
	  uniHttp.request({
	    url: '/decorationManage/decoration/page/'+params.data.size+'/'+params.data.current,
	    method: 'POST',
	    params: params,
	    header: {
	      'Content-Type': 'application/json;charset=utf-8'
	    }
	  })
    /**
         * 获取装修详情
         */
    export const selectDecoration = (params) =>
      uniHttp.request({
        url: decorateUrl + '/decoration/selectDecoration/' + params.data.decorationId,
        method: 'GET',
        params: {
          ...params
        }
      }) 
  	/**
		 * 获取设备列表
		 */
		export const getDevicesByParam = (params) =>
		  uniHttp.request({
		    url: '/device/device/getDevicesByParam/'+params.data.pageSize+'/'+params.data.pageIndex,
		    method: 'POST',
		    params: params,
		    header: {
		      'Content-Type': 'application/json;charset=utf-8'
		    }
		  })

      		/**
		 *  根据工单ID查询所关联的设备
		 */
		export const queryByTaskId = (params) =>
			uniHttp.request({
				url: servicePath + '/taskFacilityCorrelation/queryByTaskId',
				method: 'POST',
				params: params,
				header: {
					'Content-Type': 'application/json;charset=utf-8'
				}
			})
      	/**
		 * 修改关联设备
		 */
		export const editDevice = (params) =>
			uniHttp.request({
				url: servicePath + '/taskFacilityCorrelation/edit',
				method: 'POST',
				params: params,
				header: {
					'Content-Type': 'application/json;charset=utf-8'
				}
			})