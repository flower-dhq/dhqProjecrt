import Vue from 'vue';
const { PROJECT_CODE } = Vue.prototype.$appConfig;
const menuList = [
  {
    label: '常用应用',
    list: [
      { icon: 'xjrw', name: '新建任务', path: '', showModal: 'showAddOrder' },
      { icon: 'sjbg', name: '运行日志', path: '/pages-reportforms/userDataReport' },
    ],
  },
  {
    label: PROJECT_CODE == 'NANJINGHUAXIN' ? '工单管理' : '工单系统',
    list: [
      { icon: 'wdgd', name: '经办工单', path: '/pages-order/order/myTaskList' },
      { icon: 'gdc', name: '工单列表', path: '/pages-order/order/list' },
      { icon: 'xjgd', name: '新建工单', path: '/pages-order/order/add' },
      { icon: 'gdgl', name: '业务管理', path: '/pages-order/order/taskList' },
      { icon: 'order-visit-icon', name: '工单回访', path: '/pages-visit/visit-workorder/list' },
    ],
  },
  {
    label: '客户服务',
    list: [
      { icon: 'wdgd', name: '我的工单', path: '/pages-workorder/my-workorder/list' },
      { icon: 'gdc', name: '工单池', path: '/pages-workorder/graborder-pool/list' },
      { icon: 'gdsp', name: '工单审批', path: '/pages-workorder/workorder-approval/list' },
      { icon: 'gdgl', name: '工单管理', path: '/pages-workorder/workorder-manage/list' },
      { icon: 'yqyj', name: '舆情预警', path: '/pages-workorder/opinion/list' },
      { icon: 'yhda', name: '业户档案', path: '/pages-archives/room-info/list' },
      { icon: 'rzgl', name: '认证管理', path: '/pages-workorder/authen-manage/list' },
      { icon: 'customer-visit-icon', name: '客户拜访', path: '/pages-visit/customer-visit/list' },
      { icon: 'wjdc', name: '问卷调查', path: '/pages-visit/questionnaire/list' },
      { icon: 'hyhd', name: '会员活动', path: '/pages-activity/member-activity/list' },
      { icon: 'zsk', name: '知识库', path: '/pages-knowledge/knowledge-base/list' },
      { icon: 'zsk', name: '分享任务', path: '/pages-tasks/share-task/list' },
      { icon: 'wpfx', name: '物品放行', path: '/pages-tasks/goods-release/goods-release' },
      { icon: 'gdsp', name: '流程管理', path: '/pages-approve/approveList' },
      { icon: 'wddb', name: '我的待办', path: '/pages-todoTask/todo-task/todoTask' },
      { icon: 'xtgg', name: '系统公告', path: '/pages-todoTask/system-notice/systemNotice' },
      { icon: 'fkyq', name: '访客通行',  path: '/pages-visitor/visitorAccess' },
      // { icon: 'lcgl', name: '流程管理', path: '/pages-approve/approveList' },
    ],
  },
  // {
  //   label: '舆情管理',
  //   list: [
  //     { icon: 'yqgd', name: '舆情工单', path: '/pages-workorder/opinion-workorder/list' },
  //     { icon: 'gtcd', name: '沟通存档', },
  //   ],
  // },
  {
    label: '收费管理',
    list: [
      { icon: 'ysgl', name: '应收管理', path: '/pages-leasing/selectProperty' },
      // {
      //   icon: 'csgl',
      //   name: '催收管理',
      //   path: 'https://ebeitest.wuyeface.com:1188/wuyeApp/?code=jpj4XHJBdYOs1cxNA8YR_8gr8c3LFCODCLSTADSTopA&state=#/onlinePayment/selectBuild?corpId=ww25f084285b9be81c&agentId=1000004'
      //
      // },
      { icon: 'csgl', name: '催缴管理', path: '/pages-payment/demend-payment/list' },
      { icon: 'ydcb', name: '移动抄表', path: '/pages-meter/meterList' },
      { icon: 'zydw', name: '资源点位', path: '/pages-a/resourcePoints/list' },
      // { icon: 'lcsp', name: '流程审批', },
      { icon: 'htgl', name: '合同管理', path: '/pages-workorder/contract/contractList' },
    ]
  }
]

export default menuList