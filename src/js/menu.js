export let menu = [{
    configName: '通行',
    detailCode: 'tongxing',
    icon: "icon-tx", //图片名称
    service: "2", //服务页布局，比如1：1 22，33
    serviceIndex:2,
    registered:true,
    page:'/pages-c/parkManagement/thePassQrcode'
 }, {
    configName: '便民电话',
    detailCode: 'conveniencePhone',
    icon: "icon-bmdh", //图片名称
    service: "3", //服务页布局，比如1：1 22，33
    serviceIndex:2,
    page:'/pages-b/phone-book/phone-book-list'
 },
 {
    configName: '卡证办理',
    detailCode: 'cardHandling',
    icon: "icon_kzbl", //图片名称
    service: "3", //服务页布局，比如1：1 22，33
    // serviceIndex:2,
    page:'/pages-d/card-manage/card-handle-list'
 },
//  {
//     configName: '会员卡',
//     detailCode: 'memberCard',
//     icon: "icon-hyk", //图片名称
//     service: "3", //服务页布局，比如1：1 22，33
//     // serviceIndex:2,
//     page:'/pages-b/membersCard/myMembersCard'
//  },
 {
    configName: '企业拜访',
    detailCode: 'visitRelease',
    icon: "icon-fk",
    auth:'1',
    service: "2",
    serviceIndex:2,
    page:'/pages-a/visit-apply/visit-list'

}, {
    configName: '停车缴费',
    detailCode: 'parkingPayment',
    icon: "icon-tc",
    service: "2",
    serviceIndex:2,
    page:'/pages-d/parking/parking'


}, {
    configName: '物品放行',
    auth:'1',
    detailCode: 'releaseSlipApplication',
    icon: "icon-fx",
    service: "2",
    page: '/pages-c/goods-release/add-goods-release'
}, {
    configName: '出行指南',
    detailCode: 'travelGuide',
    icon: "icon-cxzl",
    service: "2",
    page: '/pages-b/guide/index?colId=16'
}, {
    configName: '办事指南',
    detailCode: 'handlingGuideline',
    icon: "icon-bszl",
    service: "2",
    page: '/pages-b/guide/index?colId=17'
}, 
{
    configName: '社区新闻',
    detailCode: 'communityNews',
    icon: "icon-sqxw",
    service: "2",
    page: '/pages-b/guide/index?colId=53'
}, 
 {
    configName: '览园',
    detailCode: 'lanyuan',
    icon: "icon-ly",
    service: "2",
    // url:"https://tg1.chacewang.com/api/home/Guest?act=tgn&name=next"

}, {
    configName: '装修申请',
    auth:'1',
    detailCode: 'decorateApply',
    icon: "icon-zxsq",
    service: "2",
    page:'/pages-c/houseCorrelation/decorateApply',
    registered:true,

},{
    configName: '报事报修',
    detailCode: 'repair',
    icon: "icon-bx",
    service: "1",
    auth:'1', //auth=1，需要授权
    page:'/pages-a/repair/reportingRorRepairs?taskType=1',
    registered:true,

},{
    configName: '我的月卡',
    detailCode: 'monthCardList60',
    icon: 'icon-yksq',
    auth:'2',
    service: "2", //服务页布局，比如1：1 22，33
    registered:true,
    page: '/pages-leasing/monthlyCardApplication/myparkingSpot'
},{
    configName: '投诉建议',
    detailCode: 'complaint',
    icon: "icon-jy",
    service: "1",
    auth:'1', //auth=1，需要授权
    page:'/pages-a/repair/reportingRorRepairs?taskType=2',
    registered:true,

}, {
    configName: '更多',
    detailCode: 'more',
    icon: "icon-more",
    page:'/pages/service/service',
    isTabbar:true

}, {
    configName: '通知',
    detailCode: 'announcement',
    icon: "icon-tz",
    service: "1",
    auth:'1', //auth=1，需要授权
    page: '/pages-b/announcement/list'
 }, {
    configName: '活动',
    detailCode: 'activity',
    icon: "icon-hdll",
    service: "1",
     mine: "",
     page: '/pages-d/activity/activityList'
}, {
    configName: '宣传',
    detailCode: 'propertyPublicity',
    icon: "icon-xc",
    service: "1",
    serviceIndex:1,
    page:"/pages-d/propertyPublicity/list"
 }, {
    configName: '问卷调查',
    detailCode: 'questionnaire',
    icon: "icon-wq",
    service: "1",
    serviceIndex:1,
    auth:'1',
    page:"/pages-c/questionnaire/list",
    registered: true
},{
    configName: '阳光故事',
    detailCode: 'sunStory',
    icon: "icon-yggs",
    service: "1",
    serviceIndex:1,
    page:"/pages-d/sunStory/sunStory"
},{
    configName: '阳光家园',
    detailCode: 'huiHomeScene',
    icon: "icon-ygjy",
    service: "1",
    serviceIndex:1,
    page:"/pages-d/huiKing/huiHomeScene"
},{
    configName: '阳光团队',
    detailCode: 'huiFamilyScene',
    icon: "icon-ygtd",
    service: "1",
    serviceIndex:1,
    page:"/pages-d/huiKing/huiFamilyScene"
}, {
    configName: '前沿',
    detailCode: 'qianyan',
    icon: "icon-qy",
    service: "3",
 }, {
    configName: '政策',
    detailCode: 'zhengce',
    icon: "icon-zc",
    service: "3",
    url:"https://tg1.chacewang.com/api/home/Guest?act=tgn&name=next"
}, {
    configName: '商城',
    detailCode: 'store',
    icon: "icon-sp",
    service: "3",
 }, {
    configName: '会议厅预订',
    detailCode: 'meetingRoomList',
    icon: "icon_hysyd",
    auth:'1',
    service: "2",
    page: '/pages-c/meeting-room/room-list'
 },
 {
    configName: '房屋认证',
    detailCode: 'houseAuth',
    icon: "icon-fwrz",
    auth:'1', //auth=1，需要授权
    mine: "1",
    page:'/pages-b/house-info/add-house-address',
},
 {
    configName: '企业认证',
    detailCode: 'enterpriseAuth',
    icon: "icon-qyrz",
    auth:'1', //auth=1，需要授权
    mine: "6",
    page:'/pages-d/enterprise-info/enterprise-auth-list',
}, {
    configName: '邀请员工',
    detailCode: 'inviteStaff',
    icon: "icon-yqyg",
    auth:'1',
    mine: "6",
    userTypeNum:[4,9,10,11,12],//哪些身份的人可以使用此功能
    page:'/pages-d/enterprise-info/invite-staff',
    registered: true
}, {
    configName: '我的员工',
    detailCode: 'myStaff',
    icon: "icon-wdyg",
    auth:'1',
    mine: "6",
    page:'/pages-d/enterprise-info/my-staff-approval',
    registered: true
}, {
    configName: '房源管理',
    detailCode: 'houseManage',
    icon: "icon-fygl",
    auth:'1', //auth=1，需要授权
    mine: "1",
    page:'/pages-b/house-info/house-auth-list',
}, {
    configName: '邀请家人/租户',
    detailCode: 'inviteFamilyOrTenant',
    icon: "icon-yqjrzh",
    auth:'1',
    mine: "1",
    userTypeNum:[2,10,14],//哪些身份的人可以使用此功能
    page:'/pages-b/house-info/invite-family',
    registered: true
}, {
    configName: '家人管理',
    detailCode: 'familyManage',
    icon: "icon-jrgl",
    auth:'1',
    mine: "1",
    page:'/pages-b/house-info/my-family-house',
    registered: true
},{
    configName: '个人钱包',
    detailCode: 'pWallet',
    icon: "grqb-icon",
    // auth:'1',
    mine: "7",
    page:'/pages-d/myWallet/index?type=1',
    // registered: true
},{
    configName: '企业钱包',
    detailCode: 'bWallet',
    icon: "icon-qyqb",
    // auth:'1',
    mine: "7",
    page:'/pages-d/myWallet/index?type=2',
    // registered: true
},{
    configName: '我的积分',
    detailCode: 'integral',
    icon: "icon-wdjf",
    // auth:'1',
    mine: "7",
    page:'/pages-d/integral/detail',
}, {
    title:'物业报事报修', //特殊设置，我的页面进入未完成页面浏览器title取这个值，使用方法，比如在我的页面，我的报事报修
    configName: '未完成',
    detailCode: 'myRepair-wwc',
    icon: "icon-bxwwc",
    auth:'1',
    mine: "2",
    page:"/pages-a/repair/myReportAndRepair?categories=5,11&taskType=1",
    registered: true
}, {
    title:'物业报事报修',
    configName: '已完成',
    detailCode: 'myRepair-ywc',
    icon: "icon-bxywc",
    auth:'1',
    mine: "2",
    page:"/pages-a/repair/myReportAndRepair?categories=5,11&type=done&taskType=1",
    registered: true
}, {
    title:'物业投诉建议',
    configName: '未完成',
    detailCode: 'mySuggest-wwc',
    icon: "icon-jywwc",
    auth:'1',
    mine: "3",
    page:"/pages-a/repair/myReportAndRepair?categories=6,9&taskType=2",
    registered: true
}, {
    title:'物业投诉建议',
    configName: '已完成',
    detailCode: 'mySuggest-ywc',
    icon: "icon-jyywc",
    auth:'1',
    mine: "3",
    page:"/pages-a/repair/myReportAndRepair?categories=6,9&type=done&taskType=2",
    registered: true
},  {
    configName: '我的消息',
    detailCode: 'myMessage',
    icon: "icon-xx",
    auth:'1',
    mine: "5",
    registered: true
},
{
    configName: '我的装修',
    detailCode: 'myDecorateList',
    icon: "icon-zx",
    auth:'1',
    mine: "5",
		page:'/pages-c/houseCorrelation/myDecorateList',
    registered: true
},{
    configName: '我的访客',
    detailCode: 'myVisitRelease',
    icon: "icon-wdfk",
    auth:'1',
    mine: "5",
    page:'/pages-d/visit-apply/myVisitorsRecord',
    registered: false
}, {
    configName: '设置',
    detailCode: 'set',
    icon: "icon-szi",
    auth:'1',
    mine: "5",
    page:'/pages-b/myConfig/myConfig'

}, {
    configName: '放行历史',
    // detailCode: 'releaseAnnounceList',
    detailCode: 'releaseHistory',
    icon: 'icon-fxls',
    auth:'1',
    mine: '5',
    page: '/pages-c/goods-release/goods-release-list'
}, {
    configName: '放行申请',
    detailCode: 'addReleaseAnnounce',
    icon: '',
    service: '2',
    page: '/pages-c/goods-release/add-release-announce'
}, {
    configName: '我的人脸',
    detailCode: 'faceList',
    icon: 'icon_wdrl',
    auth:'1',
    mine: '5',
    page: '',
    page: '/pages-b/xinyidaiFaceManage/newFaceForm'
},{
    configName: '乘梯码',
    detailCode: 'elevatorCode',
    icon: 'icon-tx',
    auth:'1',
    service: '2',
    page: '',
    page: '/pages-b/xinyidaiFaceManage/elevatorCode'
}, {
    configName: '一键开门',
    detailCode: 'openDoor',
    icon: 'icon-yjkm',
    service: '1',
    page: '/pages-d/keyopen/selectOpenDoorType'
}, {
    configName: '钥匙借用',
    detailCode: 'key',
    icon: 'icon-ysjy',
    service: '2',
    page: '/pages-c/housekeeper/keyCollection',
    registered: true

}, {
    configName: '快递代收',
    auth:'1',
    detailCode: 'goodsCollection',
    icon: 'icon-kdds',
    service: '2',
    page: '/pages-c/housekeeper/goodsCollection',
    registered: true

}, {
    configName: '住宅拜访',
    detailCode: 'homeVisitRelease',
    icon: 'icon-zzbf',
    service: '2',
    page: '/pages-a/visit-apply/houseVisitApply'
}, {
    configName: '企业拜访',
    detailCode: 'companyVisitRelease',
    icon: 'icon-jyywc',
    service: '2',
    page: '/pages-a/visit-apply/xydCompanyVisitApply'
}, {
    configName: '会议厅订单',
    detailCode: 'myMeetingRoomList',
    icon: 'icon_fill_hyt',
    auth:'1',
    mine: "5",
    page: '/pages-c/meeting-room/myMeetingRoomList'
}, {
    configName: '开票抬头',
    detailCode: 'companyVisitRelease',
    icon: 'icon-jyywc',
    auth:'1',
    mine: "5",
    page: '/pages-a/visit-apply/xydCompanyVisitApply'
}, {
    configName: '我的活动',
    detailCode: 'myActivity',
    icon: "icon-hd",
    auth:'1',
    mine: "5",
    page: '/pages-c/my-activitiy/my-ctivityList'
},
{
    configName: '我的卡证订单',
    detailCode: 'myCard',
    icon: "icon_kzdd",
    auth:'1',
    mine: "5",
    page: '/pages-d/card-manage/my-card-list'
},
{
    configName: '我的快递',
    detailCode: '',
    icon: "",
    auth:'',
    mine: "",
    page: '/pages-c/housekeeper/moreMyGoodCollection'
},

{
    configName: '产投动态',
    detailCode: 'chantou',
    icon: "icon-ctdt",
    service: "1",
    url:'https://xyd-visit-web.9zdata.cn/mp/homepage?__biz=Mzg5NjU4MTY2OQ==&hid=7&sn=9bd24d3a372c6cc9bff1bd69ee3f6551&scene=18#wechat_redirect'
}, {
    configName: '产业Link',
    detailCode: 'link',
    icon: "icon-cyLink",
    service: "3",
    url:'/pages/expo/expo', //小程序目标页面
    appId:'wx6faf6cc1e8b83bc7', //第三方小程序appId
    originalId:'gh_b76a9caa50df', //第三方小程序原始Id
}, {
    configName: '产业商机',
    detailCode: 'zhaobiao',
    icon: "icon-cysj",
    service: "3",
    url:'', //小程序目标页面
    appId:'wxb131b2ad90150d6d', //第三方小程序appId
    originalId:'gh_0a07d4e6cd35', //第三方小程序原始Id
},{
    configName: '智慧芽',
    detailCode: 'zhihuiya',
    icon: "icon-ctdt",
    service: "3",
    url:'', //小程序目标页面
    appId:'wx4ddc482d33513336', //第三方小程序appId
    originalId:'gh_5ad1db8d8a85', //第三方小程序原始Id
},
{
    configName: '空间对接',
    detailCode: 'duijie',
    icon: "icon-kjdj",
    service: "3",
    url:'https://xyd-visit-web.9zdata.cn/wechat/map'
}, {
    configName: '焕园发声',
    detailCode: 'fasheng',
    icon: "icon-wq", //暂用问卷图标
    service: "1",
    url:'https://forms.ebdan.net/ls/l3B6wqpl?share_time=1670917364697&bt=yxy&from_id=cf8eee8b-9&eqrcode=1&share_level=2&from_user=202212138a9471ab'
}, {
    configName: '失物招领',
    detailCode: 'shiwuzhaoling',
    icon: 'icon-swzl',
    service: '2',
    serviceIndex: 2,
    page: '/pages-b/claim-item-manage/claim-item-list?itemType=claim'
}, {
    configName: '寻物启事',
    detailCode: 'xunwuqishi',
    icon: 'icon-xwqs',
    service: '2',
    serviceIndex: 2,
    page: '/pages-b/claim-item-manage/claim-item-list?itemType=find'
}, {
    configName: '曝光台',
    detailCode: 'bgt',
    icon: 'icon-bgt',
    service: '1',
    serviceIndex: 1,
    page: '/pages-c/exposure/list'
},
    {
        configName: '发票开具',
        detailCode: 'orderList',
        icon: 'icon-wydd',
        auth:'1',
        mine: "5",
        page: '/pages-leasing/makeInvoice'
    },
    {
        configName: '发票列表',
        detailCode: 'invoiceList',
        icon: 'icon-fplb',
        auth:'1',
        mine: "5",
        page: '/pages-leasing/makeInvoiceHistory'
    },
    {
        configName: '生活缴费',
        detailCode: 'paymentCenterNew',
        icon: 'icon-shjf',
        auth:'1',
        service: "2", //服务页布局，比如1：1 22，33
        registered:true,
        page: '/pages-leasing/paymentinfo/newPaymentCenter'
    },
    {
        configName: '缴费记录',
        detailCode: 'paymentRecord',
        icon: 'icon_jfjl',
        auth:'1',
        mine: "5",
        page: '/pages-leasing/payMentHistory'
    },
    // {
    //     configName: '400电话',
    //     detailCode: '400phone',
    //     icon: "icon-400",
    //     service: "1",
    //     serviceIndex:1,
    // },
{
    configName: '访客申请',
    detailCode: 'zr_visit_approval',
    icon: "icon-zrva",
    service: "2",
    page:'/pages-d/visitor/visitorApplication'
    // registered: true
}, 
{
    configName: '访客申请二维码',
    detailCode: '',
    icon: "",
    page:'/pages-d/visitor/visitorCode',
  },
  {
    configName: '关于我们',
    detailCode: 'aboutUs',
    icon: 'icon-us',
    auth:'1',
    mine: "5",
    page: '/pages-b/aboutUs/aboutUs'
},
{
    configName: '访客邀请',
    detailCode: 'visitor',
    icon: "icon-fkyq",
    service: "2",
    page:'/pages-b/inviteVisitor/inviteVisitor',
    auth:'1', //auth=1，需要授权
    registered: true
}, 
{
    configName: '访客记录',
    detailCode: '',
    icon: "",
    service: "2",
    page:'/pages-b/inviteVisitor/inviteVisitorRecord'
    // registered: true
},
{
    configName: '贴心管家',
    detailCode: 'intimateHousekeeper',
    icon: "icon-bmdh", //图片名称
    service: "4", //服务页布局，比如1：1 22，33
    serviceIndex:2,
    page:'/pages-b/phone-book/phone-book-list'
 },
 {
    configName: '系统消息',
    detailCode: '',
    icon: "",
    service: "1",
    page: '/pages-b/systemMessages/systemList'
 },
  {
    configName: '诺普顿开门',
    detailCode: 'openDoorByNPD',
    icon: 'icon-yjkm',
    auth:'1',
    service: '1',
    page: '/pages-d/keyopen/deviceList?menuCode=openDoorByNPD'
  },
  {
    configName: '工单处理进度',
    detailCode: 'repairProgress',
    icon: 'myRepair-wwc',
    auth: '1',
    mine: '2',
    page: '/pages-a/repair/processingProgress',
    registered: true
  },
  {
    configName: '缴费账单',
    detailCode: 'staffPayment',
    icon: 'myRepair-wwc',
    auth: '1',
    mine: '2',
    page: '/pages-leasing/paymentinfo/WXSharePage',
    registered: true
  },
  {
    configName: '会员活动',
    detailCode: 'activityDetail',
    icon: 'myRepair-wwc',
    auth: '1',
    mine: '2',
    page: '/pages-d/activity/activityDetail',
    registered: true
  },
  {
    configName: '商场',
    detailCode: 'market',
    icon: "icon-cysj",
    service: "3",
    appId:'wx93f539e1620164e6',
    url:''
  },
  {
    configName: '问卷调查详情',
    detailCode: 'questionDetail',
    icon: 'myRepair-wwc',
    auth: '1',
    mine: '2',
    page: '/pages-c/questionnaire/detail',
    registered: true
 }, {
    configName: '加时申请',
    detailCode: 'overtimeApplication',
    icon: "icon-jssq",
    service: "1",
    auth:'1', //auth=1，需要授权
    page:'/pages-e/overtimeManage/overtimeApplication?type=add',
    registered:true,
  }, {
    configName: '加时记录',
    detailCode: 'overtimeApplicationRecord',
    icon: "icon-jskl",
    auth:'1',
    mine: "5",
    page: '/pages-e/overtimeManage/overtimeApplicationRecord'
  },
  {
    configName: '报事报修(新工单)',
    detailCode: 'repair-custom',
    icon: 'icon-bx',
    service: '5',
    auth: '1',
    page: '/pages-a/customOrder/reportingRorRepairs?taskType=1',
    registered: true,
  },
  {
    configName: '投诉建议(新工单)',
    detailCode: 'suggest-custom',
    icon: 'icon-jy',
    service: '5',
    auth: '1',
    page: '/pages-a/customOrder/reportingRorRepairs?taskType=2',
    registered: true,
  },
  {
		configName: '工单记录',
		detailCode: 'repairHistory',
		icon: 'icon-gdjl',
		auth:'1',
		mine: "5",
		page: '/pages-order/order/repairHistory?tab=0'
	},
	{
		configName: '新增工单',
		detailCode: 'orderAdd',
		icon: 'icon-gdjl',
		auth: '1',
		mine: "5",
		page: '/pages-order/order/add'
	},
]
