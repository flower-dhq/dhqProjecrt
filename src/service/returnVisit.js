import uniHttp from './uni-request'
import Utils from '@/js/utils'

const servicePath = '/returnVisit'

/**获取卡证列表 */
export const getCardList = (data = {}) => uniHttp.request({
  url: Utils.spliceGetUrl(servicePath + '/cardManage/getCardList', data),
  method: 'GET',
  params: {}
})

/**获取卡证详情 */
export const getCardDetail = (data = {}) => uniHttp.request({
  url: Utils.spliceGetUrl(servicePath + '/cardManage/getCardDetail', data),
  method: 'GET',
  params: {}
})

/**新增卡证办理 */
export const saveCardHandle = (data = {}) => uniHttp.request({
  url: servicePath + '/card/cardHandle/saveCardHandle',
  method: 'POST',
  params: {
    data
  }
})

/**根据id获取卡证详细信息 */
export const selectCardHandleById = (data = {}) => uniHttp.request({
  url: servicePath + '/card/cardHandle/selectCardHandleById',
  method: 'POST',
  params: {
    data
  }
})

/**提交卡证审批（支付成功后调用） */
export const commitCardHandle = (data = {}) => uniHttp.request({
  url: servicePath + '/card/cardHandle/commitCardHandle',
  method: 'POST',
  params: {
    data
  }
})

/**获取卡证办理信息列表数据 */
export const selectCardHandleByPage = (data = {}) => uniHttp.request({
  url: servicePath + '/card/cardHandle/selectCardHandleByPage',
  method: 'POST',
  params: {
    data
  }
})

/**卡证办理取消待支付 */
export const editCardHandle = (data = {}) => uniHttp.request({
  url: servicePath + '/card/cardHandle/editCardHandle',
  method: 'POST',
  params: {
    data
  }
})
/**
 *  查询回访记录接口
 * 回访id 多个以逗号分割
 */
export const getReturnVisitRecordById = (data = {}) => uniHttp.request({
  url: Utils.spliceGetUrl(servicePath + '/question/returnVisit/getReturnVisitRecordById', data),
  method: 'GET',
  params: {}
})

/**获取问卷详情 */
export const getQuestionnaireById = (data = {}) => uniHttp.request({
  url: Utils.spliceGetUrl(servicePath + '/question/returnVisit/getQuestionnaireDetail', data),
  method: 'GET',
  params: {}
})

/**
 * @desc 成功回访保存
 * @param visitId 必传 回访ID
 * @param ownerNameye 业主name
 * @param ownerTel 业主电话
 * @param houseInfoId 房间id
 * @param address 地址
 * @param mpqId 问卷id
 * @param desc 问卷描述
 * @param subjectAnswers 答题内容 必传  题目ID和分数值
 * 		[{
				subjectsId: '', //题目id
				title: '', //标题
				elements: '', //单选/多选-答案  选项id
				text: '', //问答题/评分 - 答案
			}]
 * @param visitDesc 回访说明
 * @param userId 当前用户id
 */
export const saveQuestionnaire = (data = {}) => uniHttp.request({
  url: servicePath + '/question/returnVisit/saveQuestionnaireAnswer',
  method: 'POST',
  params: {
    data
  }
})

/**
 * @desc 查询回访结果
 * @param visitId 回访id
 */
export const getAnswerValueById = (data = {}) => uniHttp.request({
  url: Utils.spliceGetUrl(servicePath + '/question/returnVisit/viewQuestionnaireAnswer', data),
  method: 'GET',
  params: {}
})

/**
 * 获取拜访详情
 */
export const getCustomerVisitDetailById = (params) => uniHttp.request({
  url: servicePath + '/visit/visitManage/getVisitRecordDetail',
  method: 'POST',
  params: {
    ...params,
    hideLoading: true,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
})

/**
 * 提交客户拜访的问卷答案
 */
export const uploadCustomerVisitInfo = (params) => uniHttp.request({
  url: servicePath + '/visit/visitManage/uploadVisitRecord',
  method: 'POST',
  params: {
    ...params,
    responseToast: false
  }
})

/**
 * 获取拜访的字典表
 */
export const getDictDetailList = (params) => uniHttp.request({
  url: servicePath + '/dict/getDictDetailList',
  method: 'POST',
  params: {
    ...params,
    header: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    responseToast: false
  }
})
/**
 * 判断扫码客户是否在该计划范围内
 */
export const getVisitPlanCustomer = (params) => uniHttp.request({
  url: servicePath + '/questionnaire/tcsvisitplan/getVisitPlanCustomer',
  method: 'POST',
  params: {
    ...params, 
    responseToast: false
  }
})
/**
 * 判断扫码客户是否在该计划范围内
 */
export const saveQuestionnaireAnswerNew = (params) => uniHttp.request({
  url: servicePath + '/question/questionnaire/saveQuestionnaireAnswer',
  method: 'POST',
  params: {
    ...params, 
    responseToast: false
  }
})

/**获取问卷详情 */
export const getQuestionnaireByIdNew = (data = {}) => uniHttp.request({
  url: Utils.spliceGetUrl(servicePath + '/question/questionnaire/getQuestionnaireById', data),
  method: 'GET',
  params: {}
})

