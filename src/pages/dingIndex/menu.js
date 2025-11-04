export const menuList = [
  {
    label:'服务',
    menuCode:'fuwu',
    list:[
      { icon: 'yhda', name: '业户档案', menuCode:'yehudangan', path: '/pages-archives/room-info/list' },
      { icon: 'customer-visit-icon', name: '客户拜访', menuCode:'kehubaifang', path: '' },
      { icon: 'zsk', name: '知识库', menuCode:'zhishiku', path: '/pages-knowledge/knowledge-base/list' },
      { icon: 'lcgl', name: '流程管理', menuCode:'liuchengguanli', path: '/pages-approve/approveList' },
      { icon: 'yxrz', name: '运行日志', menuCode:'yunxingrizhi', path: '/pages-reportforms/userDataReport' },
      { icon: 'zxgl', name: '装修管理', menuCode:'zhuangxiuguanli', path: '' },
      { icon: 'zsk', name: '分享任务', menuCode:'fenxiangrenwu', path: '/pages-tasks/share-task/list' },
    ]
  },
  {
    label:'财务',
    menuCode:'caiwu',
    list:[
      { icon: 'htgl', name: '合同管理', menuCode:'hetongguanli', path: '/pages-workorder/contract/contractList' },
      { icon: 'zydw', name: '资源点位', menuCode:'ziyuandianwei', path: '/pages-a/resourcePoints/list' },
      { icon: 'ysgl', name: '应收管理', menuCode:'yingshouguanli', path: '/pages-leasing/selectProperty' },
      { icon: 'csgl', name: '催缴管理', menuCode:'cuijiaoguanli', path: '/pages-payment/demend-payment/list' },
    ]
  },
  {
    label:'工单',
    menuCode:'gongdan',
    list:[
      { icon: 'xjrw2', name: '新建任务', menuCode:'xinjianrenwu', path: '', showModal: 'showAddOrder' },
      { icon: 'wdgd', name: '我的工单', menuCode:'wodegongdan', path: '/pages-workorder/my-workorder/list' },
      { icon: 'gdgl', name: '工单管理', menuCode:'gongdanguanli', path: '/pages-workorder/workorder-manage/list' },
      { icon: 'gdc2', name: '工单池', menuCode:'gongdanchi', path: '/pages-workorder/graborder-pool/list' },
      { icon: 'gdsp', name: '工单审批', menuCode:'gongdanshenpi', path: '/pages-workorder/workorder-approval/list' },
      { icon: 'order-visit-icon', name: '工单回访', menuCode:'gongdanhuifang', path: '/pages-visit/visit-workorder/list' },
    ]
  },
  {
    label:'大工单',
    menuCode:'dagongdan',
    list:[
      { icon: 'xjgd', name: '新建工单', menuCode:'xinjiangongdan', path: '' },
      { icon: 'jbgd', name: '经办工单', menuCode:'jingbangongdan', path: '' },
      { icon: 'ywgl', name: '业务管理', menuCode:'yewuguanli', path: '' },
      { icon: 'gdc2', name: '工单池', menuCode:'big_gongdanchi', path: '/pages-workorder/graborder-pool/list' },
    ]
  },
  {
    label:'运营',
    menuCode:'yunying',
    list:[
      { icon: 'wjdc', name: '问卷调查', menuCode:'wenjuandiaocha', path: '/pages-visit/questionnaire/list' },
      { icon: 'hyhd', name: '会员活动', menuCode:'huiyuanhuodong', path: '/pages-activity/member-activity/list' },
      { icon: 'wpfx', name: '物品放行', menuCode:'wupinfangxing', path: '/pages-tasks/goods-release/goods-release' },
      { icon: 'scdd', name: '商城订单', menuCode:'shangchengdingdan', path: '' },
      { icon: 'fxpt', name: '分销平台', menuCode:'fenxiaopingtai', path: '' },
      { icon: 'fxdd', name: '分销订单', menuCode:'fenxiaodingdan', path: '' },
      { icon: 'txgl', name: '提现管理', menuCode:'tixianguanli', path: '' },
      { icon: 'yqyj', name: '舆情预警', menuCode:'yuqingyujing', path: '/pages-workorder/opinion/list' },
      { icon: 'rzgl', name: '认证管理', menuCode:'renzhengguanli', path: '/pages-workorder/authen-manage/list' },
      { icon: 'fkyq', name: '访客通行', menuCode:'fangkeyaoqing', path: '/pages-visitor/visitorAccess' },
    ]
  },
  {
    label:'设备',
    menuCode:'shebei',
    list:[
      { icon: 'shwbei-xjrw', name: '巡检任务', menuCode:'xunjianrenwu', path: '' },
      { icon: 'xjrwc', name: '巡检任务池', menuCode:'xunjianrenwuchi', path: '' },
      { icon: 'wbrw', name: '维保任务', menuCode:'weibaorenwu', path: '' },
      { icon: 'wbrwc', name: '维保任务池', menuCode:'weibaorenwuchi', path: '' },
      { icon: 'sbda', name: '设备档案', menuCode:'shebeidangan', path: '' },
      { icon: 'sbck', name: '设备查看', menuCode:'shebeichakan', path: '' },
      { icon: 'ydcb', name: '移动抄表', menuCode:'yidongchaobiao', path: '' },
    ]
  },
  {
    label:'综巡',
    menuCode:'zongxun',
    list:[
      { icon: 'zhxj', name: '综合巡检', menuCode:'zonghexunjian', path: '' },
      { icon: 'xlrwc', name: '巡逻任务池', menuCode:'xunluorenwuchi', path: '' },
    ]
  },
  {
    label:'品质',
    menuCode:'pinzhi',
    list:[
      { icon: 'xmhc', name: '项目核查', menuCode:'xiangmuhecha', path: '' },
      { icon: 'gshc', name: '公司核查', menuCode:'gongsihecha', path: '' },
      { icon: 'zxhc', name: '专项核查', menuCode:'zhuanxianghecha', path: '' },
    ]
  },
  {
    label:'仓库',
    menuCode:'cangku',
    list:[
      { icon: 'ckgl', name: '仓库管理', menuCode:'cangkuguanli', path: '' },
    ]
  },
]