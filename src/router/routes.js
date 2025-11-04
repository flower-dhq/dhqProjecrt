import Main from '@/components/main.vue';

// 系统菜单内页
const menuRoutes = [
  {
    path: '/index',
    name: '',
    component: Main,
    redirect: '/index/homeArea',
    children: [
      {
        path: 'homeArea',
        meta: { title: '首页' },
        name: 'homeArea',
        component: () => import('@/pages/home/homeArea.vue'),
      },
      {
        path: 'sclasses', //班次设置
        meta: { title: '班次设置' },
        name: 'sclassesList',
        component: () => import('@/pages/sclasses/sclassesList.vue')
      },
      {
        path: 'scheduling', //排班列表
        meta: { title: '排班列表' },
        name: 'schedulingList',
        component: () => import('@/pages/scheduling/schedulingList.vue')
      },
      {
        path: 'reportList', //汇报列表
        meta: { title: '汇报列表' },
        name: 'reportList',
        component: () => import('@/pages/reportList/reportList.vue')
      },
      {
        path: 'allReports', //全部汇报
        meta: { title: '全部汇报' },
        name: 'allReports',
        component: () => import('@/pages/allReports/allReports.vue')
      },
      {
        path: 'warningSetting', //预警设置
        meta: { title: '预警设置' },
        name: 'warningSetting',
        component: () => import('@/pages/warningSetting/warningSetting.vue')
      },
      {
        path: 'ListOfPublicNumbers',
        meta: { title: '公众号列表' },
        name: 'ListOfPublicNumbers',
        component: () => import('@/pages/home/index.vue'),
      },
      {
        path: 'questionnaireSurvey',
        name: 'questionnaireSurvey',
        meta: { title: '模板管理/问卷调查' },
        component: () => import('@/pages/home/index.vue'),
      },
      {
        path: 'indexEdit',
        name: 'indexEdit',
        meta: { title: '功能配置' },
        component: () => import('@/pages/changeShifts/shiftRecord/shifting-record-list.vue'),
      },
      {
        path: 'shiftingConfig',
        name: 'shiftingConfig',
        meta: { title: '交接班配置' },
        component: () => import('@/pages/changeShifts/shiftConfiguration.vue'),
      },
      {
        path: 'shiftingRecord',
        name: 'shiftingRecord',
        meta: { title: '交接班记录' },
        component: () => import('@/pages/changeShifts/shiftRecord/shifting-record-list.vue'),
      },
      {
        path: 'shiftingOverTimeConfig',
        name: 'shiftingOverTimeConfig',
        meta: { title: '交接班超时配置' },
        component: () => import('@/pages/changeShifts/shiftingOverTimeConfig.vue'),
      },
      // 钥匙管理keyManage 
      {
        path: 'keyBorrow',
        name: 'keyBorrow',
        meta: { title: '钥匙借用' },
        component: () => import('@/pages/keyManage/keyBorrow.vue'),
      },
      {
        path: 'keyBorrowingRecords',
        name: 'keyBorrowingRecords',
        meta: { title: '借用记录' },
        component: () => import('@/pages/keyManage/keyBorrowingRecords.vue'),
      },
      {
        path: 'keyParamsConfig',
        name: 'keyParamsConfig',
        meta: { title: '参数配置' },
        component: () => import('@/pages/keyManage/keyParamsConfig.vue'),
      },
    ],
  },
  {
    path: '/shiftDetails',
    name: 'shiftDetails',
    meta: { title: '交接班详情' },
    component: () => import('@/pages/changeShifts/shiftRecord/shiftDetails.vue'),
  },
  {
    path: '/applicationCenter',
    name: '',
    component: Main,
    redirect: '/applicationCenter/home',
    children: [
      {
        path: 'home',
        meta: { title: '首页' },
        name: 'home',
        component: () => import('@/pages/home/index.vue'),
      },
      {
        path: 'accessControlList',
        name: 'accessControlList',
        meta: { title: '门禁列表' },
        component: () => import('@/pages/home/index.vue'),
      },
      {
        path: 'openingDoorRecord',
        name: 'openingDoorRecord',
        meta: { title: '开门记录' },
        component: () => import('@/pages/home/index.vue'),
      },
      {
        path: 'vehicleList',
        name: 'vehicleList',
        meta: { title: '车辆列表' },
        component: () => import('@/pages/home/index.vue'),
      },
      {
        path: 'parkingRecord',
        name: 'parkingRecord',
        meta: { title: '停车记录' },
        component: () => import('@/pages/home/index.vue'),
      },
      {
        path: 'zombieVehicle',
        name: 'zombieVehicle',
        meta: { title: '僵尸车' },
        component: () => import('@/pages/home/index.vue'),
      },
      {
        path: 'unlawfulParking',
        name: 'unlawfulParking',
        meta: { title: '车辆违停' },
        component: () => import('@/pages/home/index.vue'),
      },
    ],
  },
  {
    path: '/earlyWarningCenter',
    redirect: '/earlyWarningCenter/overview',
    component: Main,
    children: [
      {
        path: 'overview',
        meta: { title: '首页' },
        name: 'overview',
        component: () => import('@/pages/home/index.vue'),
      },
      {
        path: 'realtimeWarning',
        name: 'realtimeWarning',
        meta: { title: '实时预警' },
        component: () => import('@/pages/home/index.vue'),
      },
      {
        path: 'historyWarning',
        name: 'historyWarning',
        meta: { title: '历史预警' },
        component: () => import('@/pages/home/index.vue'),
      },
      {
        path: 'earlyWarningSetting',
        name: 'earlyWarningSetting',
        meta: { title: '预警设置' },
        component: () => import('@/pages/home/index.vue'),
      },
    ],
  },
  {
    path: '/configManagement',
    name: '',
    component: Main,
    children: [
      {
        path: 'deviceType',
        meta: { title: '设备类型' },
        name: 'deviceType',
        component: () => import('@/pages/home/index.vue'),
      },
      {
        path: 'deviceList',
        meta: { title: '设备列表' },
        name: 'deviceList',
        component: () => import('@/pages/home/index.vue'),
      }
    ],
  },
];

// 非系统菜单内页
const nonMenuRoutes = [
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: () => import('@/pages/login/login.vue'),
  },
  {
    path: '/tokenLogin',
    name: 'tokenLogin',
    meta: { title: '令牌登录' },
    component: () => import('@/pages/login/token.vue'),
  },
  {
    path: '/error',
    name: 'error',
    meta: { title: 'error' },
    component: () => import('@/pages/error/error.vue'),
  },
  {
    path: '/shiftDetails',
    name: 'shiftDetails',
    meta: { title: '交接班详情' },
    component: () => import('@/pages/changeShifts/shiftRecord/shiftDetails.vue'),
  },
]

const allRoutes = [
  ...nonMenuRoutes,
  ...menuRoutes,
  {
    path: '/',
    redirect: { path: '/index/homeArea' },
  },
  {
    path: '/:pathMatch(.*)',
    redirect: {
      path: '/error'
    }
  }
]

export {
  allRoutes,
  nonMenuRoutes
}


