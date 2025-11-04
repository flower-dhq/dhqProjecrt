const { getAppConfig } = require('./utils');


module.exports = (() => {
  //  需要条件编译 process.env.VUE_APP_PLATFORM 判断，命名语意方法名修改对应pages.json属性
  const platform = process.env.VUE_APP_PLATFORM; // h5 网页 mp-weixin 微信小程序 app-plus APP, 其他值看文档
  const { THEME_NAME, ENABLED_MALL } = getAppConfig();

  // 配置对象
  const config = {
    // 项目编码
    PROJECT_CODE: 'COMMON', // 通用配置 跟/src/app-config/project下PROJECT_CODE配置一致的
    // pages.json 配置
    PAGES_JSON: {
      pages: [
        {
          path: 'pages/index/index',
          style: {
            navigationBarTitleText: '首页',
            navigationBarTextStyle: 'white',
            navigationBarBackgroundColor: '#2761FF',

          },
        },
        {
          path: 'pages/dingIndex/index',
          style: {
            navigationBarTitleText: '首页',
            navigationBarTextStyle: 'white',
            navigationBarBackgroundColor: '#2761FF',
          },
        },
        {
          path: 'pages/kanban/index',
          style: {
            navigationBarTitleText: ''
          }
        },
        {
          path: 'pages/webview/webview'
        },
        {
          path: 'pages/workorder/index',
          style: {
            navigationBarTitleText: '新建工单'
          }
        }
      ],
      subPackages: [
        {
          root: 'pages-kanban',
          pages: [
            {
              path: 'kanban/index',
              style: {
                navigationBarTitleText: '看板',
              },
            },
            {
              path: 'kanban/tableDetail',
              style: {
                navigationBarTitleText: '看板列表详情',
              },
            },
          ]
        },
        {
          root: 'pages-a',
          pages: [
            {
              path: 'related-submission/form',
            },
            {
              path: 'related-submission/repair-category',
              style: {
                navigationBarTitleText: '问题分类',
              }
            },
            {
              path: 'related-submission/handler',
              style: {
                navigationBarTitleText: '人员列表',
              }
            },
            {
              path: 'related-submission/select-project',
              style: {
                navigationBarTitleText: '选择项目',
              }
            },
            {
              path: 'related-submission/select-unit',
              style: {
                navigationBarTitleText: '物业管家',
              }
            },
            {
              path: 'auth',
              style: {
                navigationBarTitleText: '授权',
              }
            },
            {
              path: 'resourcePoints/list',
              style: {
                navigationBarTitleText: '资源管理',
              }
            },
            {
              path: 'resourcePoints/newResources',
              style: {
                navigationBarTitleText: '新增资源',
              }
            },
						{
						  path: 'resourcePoints/newResourcesDetail',
						  style: {
						    navigationBarTitleText: '资源详情',
						  }
						},
            {
              path: 'resourcePoints/resourceCategories',
              style: {
                navigationBarTitleText: '选择分类',
              }
            },
            {
              path: 'commonPage/index',
              style: {
                navigationBarTitleText: '常用链接',
              }
            },
            {
              path: 'permission',
              style: {
                navigationBarTitleText: '无权限',
              }
            }
          ]
        },
        {
          root: 'pages-workorder',
          pages: [
            {
              path: 'my-workorder/list',
              config: {
                authName: '我的工单'
              },
              style: {
                navigationBarTitleText: '我的工单',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              },
            },
            {
              path: 'workorder-manage/list',
              style: {
                navigationBarTitleText: '工单管理',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              },
            },
						{
						  path: 'authen-manage/list',
						  style: {
						    navigationBarTitleText: '认证管理',
						    enablePullDownRefresh: true,
						    onReachBottomDistance: 50
						  },
						},
            {
              path: 'authen-manage/detail',
              style: {
                navigationBarTitleText: '认证详情'
              },
            },
						{
						  path: 'authen-manage/cause-remark',
						  style: {
						    navigationBarTitleText: '填写原因',
						    enablePullDownRefresh: true,
						    onReachBottomDistance: 50
						  },
						},
						{
						  path: 'authen-manage/room-list',
						  style: {
						    navigationBarTitleText: '房间列表',
						    enablePullDownRefresh: true,
						    onReachBottomDistance: 50
						  },
						},
						{
						  path: 'authen-manage/member-list',
						  style: {
						    navigationBarTitleText: '客户列表',
						    enablePullDownRefresh: true,
						    onReachBottomDistance: 50
						  },
						},
            {
              path: 'graborder-pool/list',
              style: {
                navigationBarTitleText: '抢单工单池',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              },
            },
            {
              path: 'workorder-approval/list',
              style: {
                navigationBarTitleText: '工单审批',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              },
            },
            {
              path: 'workorder-detail/detail',
              style: {
                navigationBarTitleText: '问题详情'
              },
            },
            {
              path: 'workorder-detail/review',
              style: {
                navigationBarTitleText: '工单操作'
              },
            },
            {
              path: 'workorder-approval/approval',
              style: {
                navigationBarTitleText: '审批操作'
              },
            },
            {
              path: 'my-workorder/auth-order',
              style: {
                navigationBarTitleText: '跳转中',
              },
            },
            {
              path: 'repair-order/add',
              style: {
                navigationBarTitleText: '维修完成'
              },
            }, {
              path: 'opinion/list',
              style: {
                navigationBarTitleText: '舆情管理',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              },
            },
            {
              path: 'opinion/detail',
              style: {
                navigationBarTitleText: '舆情详情',
              },
            },
            {
              path: 'opinion-workorder/list',
              style: {
                navigationBarTitleText: '舆情工单',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              },
            },
            {
              path: 'opinion/earlyWarningModel',
              style: {
                navigationBarTitleText: '',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              },
            },
            {
              path: 'report/add',
              style: {
                navigationBarTitleText: '自查报修',
              },
            },
            {
              path: 'contract/contractList',
              style: {
                navigationBarTitleText: '合同类型',
              },
            },
            {
              path: 'contract/roomList',
              style: {
                navigationBarTitleText: '房屋合同台账',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              },
            },
            {
              path: 'contract/payList',
              style: {
                navigationBarTitleText: '有偿合同台账',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              },
            },
            {
              path: 'contract/contractDetailRoom',
              style: {
                navigationBarTitleText: '房屋合同详情',   //房屋合同详情
              },
            },
            {
              path: 'contract/contractDetailPay',
              style: {
                navigationBarTitleText: '有偿合同详情',   //有偿合同详情
              },
            },
            {
              path: 'contract/contractDetailZy',
              style: {
                navigationBarTitleText: '资源合同详情',   //资源合同详情
              },
            },
            {
              path: 'contract/ziyuanList',
              style: {
                navigationBarTitleText: '资源合同台账',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              },
            },
            {
              path: 'contract/contractDetailCar',
              style: {
                navigationBarTitleText: '车位合同详情',   //资源合同详情
              },
            },
            {
              path: 'contract/carList',
              style: {
                navigationBarTitleText: '车位合同台账',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              },
            },
            {
              path: 'opinion/session-list',
              style: {
                navigationBarTitleText: '会话',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              },
            }
          ]
        },
        {
          root: 'pages-meter',
          pages: [
            {
              path: 'meterList',
              style: {
                navigationBarTitleText: '移动抄表',
                // enablePullDownRefresh: true,
                // onReachBottomDistance: 50
              },
            },
            {
              path: 'meterInfo',
              style: {
                navigationBarTitleText: '仪表信息',
              },
            },
            {
              path: 'addMeterReading',
              style: {
                navigationBarTitleText: '抄表',
              },
            },
            {
              path: 'successMeter',
              style: {
                navigationBarTitleText: '抄表成功',
              },
            },
          ]
        },
        {
          root: 'pages-leasing',
          pages: [
            {
              path: 'selectPropertyForTools',
              style: {
                navigationBarTitleText: '缴费',
              },
            },
            {
              path: 'selectProperty',
              style: {
                navigationBarTitleText: '缴费',
              },
            },
            {
              path: 'staffPayment',
              style: {
                navigationBarTitleText: '缴费',
              },
            },
            {
              path: 'quickSearch',
              style: {
                navigationBarTitleText: '快速查询',
              },
            },
            {
              path: 'addFee',
              style: {
                navigationBarTitleText: '新增临时费用',
              },
            },
            {
              path: 'replacePay',
              style: {
                navigationBarTitleText: '发起代付',
              },
            },
          ]
        },
        {
          root: 'pages-archives',
          pages: [
            {
              // 房间选择
              path: 'room-info/list',
              style: {
                navigationBarTitleText: '业户档案'
              },
            },
            {
              path: 'billing-info/detail',
              style: {
                navigationBarTitleText: '账单明细'
              },
            },
            {
              path: 'billing-info/list',
              style: {
                navigationBarTitleText: '账款信息'
              },
            },
            {
              // 群成员列表
              path: 'owner-document/list',
              style: {
                navigationBarTitleText: '业户档案',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              },
            },
            {
              // 业主详情
              path: 'owner-document/detail',
              style: {
                navigationBarTitleText: '业户档案'
              },
            },
            {
              path: 'owner-order/list',
              style: {
                navigationBarTitleText: '日常服务',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
            // 从单聊/群聊进入业主档案
            {
              path: 'redirect-owner/index',
              style: {
                navigationBarTitleText: '跳转中'
              }
            },
            {
              path: 'owner-document/edit-owner',
              style: {
                navigationBarTitleText: '编辑资料'
              }
            }
          ]
        },
        {
          root: 'pages-payment',
          pages: [
            {
              path: 'demend-payment/list',
              style: {
                navigationBarTitleText: '催缴管理'
              },
            },
            {
              path: 'workorder-pay/pay',
              style: {
                navigationBarTitleText: '扫码支付'
              }
            },
            {
              path: 'workorder-pay/change-price',
              style: {
                navigationBarTitleText: '支付'
              }
            },
            {
              path: 'WeChatPay/WeChatPay',
              style: {
                navigationBarTitleText: '微信支付'
              }
            }
          ]
        },
        {
          root: 'pages-visit',
          pages: [
            {
              path: 'visit-workorder/list',
              style: {
                navigationBarTitleText: '工单回访',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
            {
              path: 'visit-workorder/detail',
              style: {
                navigationBarTitleText: '回访详情'
              }
            },
            {
              path: 'visit-workorder/choose',
              style: {
                navigationBarTitleText: '选择回访任务'
              }
            },
            {
              path: 'customer-visit/detail',
              style: {
                navigationBarTitleText: '拜访详情'
              }
            },
            {
              path: 'customer-visit/edit',
              style: {
                navigationBarTitleText: '拜访详情'
              }
            },
            {
              path: 'customer-visit/list',
              style: {
                navigationBarTitleText: '拜访任务',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
            {
              path: 'customer-visit/room-list',
              style: {
                navigationBarTitleText: '选择房间'
              }
            },
            {
              path: 'questionnaire/list',
              style: {
                navigationBarTitleText: '问卷调查',
                enablePullDownRefresh: true,
              },
            },
            {
              path: 'questionnaire/detail',
              style: {
                navigationBarTitleText: '问卷详情',
              },
            },
            {
              path: 'questionnaire/investigation',
              style: {
                navigationBarTitleText: '调研名单',
                enablePullDownRefresh: true,
              },
            },
          ]
        },
        {
          root: 'pages-reportforms',
          pages: [
            {
              path: 'main-report-forms',
              style: {
                navigationBarTitleText: '运营日志'
              },
            },
            {
              path: 'log/OperationLog',
              style: {
                navigationBarTitleText: '运营日志'
              }
            },
            {
              path: 'journalPush',
              style: {
                navigationBarTitleText: '每日推送'
              }
            },
            {
              path: 'userDataReport',
              style: {
                navigationBarTitleText: '运行日志'
              }
            },
          ]
        },
        {
          root: 'pages-activity',
          pages: [
            {
              path: 'member-activity/list',
              style: {
                navigationBarTitleText: '会员活动',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
            {
              path: 'member-activity/detail',
              style: {
                navigationBarTitleText: '活动详情'
              }
            },
            {
              path: 'member-activity/article',
              style: {
                navigationBarTitleText: '活动文章'
              }
            }
          ]
        },
        {
          root: 'pages-knowledge',
          pages: [
            {
              path: 'knowledge-base/list',
              style: {
                navigationBarTitleText: '知识库',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
            {
              path: 'knowledge-base/detail',
              style: {
                navigationBarTitleText: '知识库详情'
              }
            }
          ]
        },
        {
          root: 'pages-approve',
          pages: [
            {
              path: 'approveList',
              style: {
                navigationBarTitleText: '流程管理',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
            {
              path: 'approveDetail',
              style: {
                navigationBarTitleText: '审批详情'
              }
            },
            {
              path: 'approveSubmit',
              style: {
                navigationBarTitleText: '同意'
              }
            }
          ]
        },
        {
          root: 'pages-tasks',
          pages: [
            {
              path: 'share-task/list',
              style: {
                navigationBarTitleText: '分享任务',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
            {
              path: 'group-send/detail',
              style: {
                navigationBarTitleText: '消息群发'
              }
            },
            {
              path: 'task-detail/index',
              style: {
                navigationBarTitleText: '任务详情'
              }
            },
            {
              path: 'group-send/group-list',
              style: {
                navigationBarTitleText: '选择群聊'
              },
            },
            {
              path: 'goods-release/goods-release',
              style: {
                navigationBarTitleText: '物品放行'
              },
            },
            {
              path: 'goods-release/goods-release-detail',
              style: {
                navigationBarTitleText: '物品放行详情'
              },
            },
            {
              path: 'specialProblemClassification/specialProblemClassification',
              style: {
                navigationBarTitleText: '问题分类'
              },
            },
            {
              path: 'checkItems/checkItems',
              style: {
                navigationBarTitleText: '核查项目'
              },
            },
          ]
        },
        {
          root: 'pages-order',
          pages: [
            {
              path: 'order/list',
              style: {
                navigationBarTitleText: '工单池',
                "enablePullDownRefresh": true
              }
            },
            {
              path: 'order/myTaskList',
              style: {
                navigationBarTitleText: '我的工单 ',
                "enablePullDownRefresh": true
              }
            },
            {
              path: 'order/taskList',
              style: {
                navigationBarTitleText: '工单管理',
                "enablePullDownRefresh": true
              }
            },
            {
              path: 'order/add',
              style: {
                navigationBarTitleText: '新增任务'
              }
            },
            {
              path: 'select/selectProject',
              style: {
                navigationBarTitleText: '选择项目'
              }
            },
            {
              path: 'select/selectType',
              style: {
                navigationBarTitleText: '业务类别'
              }
            },
            {
              path: 'select/selectOwner',
              style: {
                navigationBarTitleText: '选择客户',
                enablePullDownRefresh: true
              }
            },
            {
              path: 'editor/imageEditor',
              style: {
                navigationBarTitleText: '选择图片',
                enablePullDownRefresh: false
              }
            },
            {
              path: 'order/detail',
              style: {
                navigationBarTitleText: '工单详情'
              },
            },
            {
              path: 'order/report',
              style: {
                navigationBarTitleText: '工单统计'
              },
            },
            {
              path: 'order/batchOperation',
              style: {
                navigationBarTitleText: '领单'	,
								"app-plus": {
								  "titleNView": {
								    "buttons": [{
								      "text": "提交",
											 "float":"right",
											 "fontSize": "28rpx",
											 "color":"#FFFFFF"
								    }]
								  }
								}
              },
            },
            {
              path: 'order/choosePeople',
              style: {
                navigationBarTitleText: '处理人'
              },
            },
						{
						  path: 'order/warehouseList',
						  style: {
						    navigationBarTitleText: '物料选择',
								enablePullDownRefresh: true
						  },
						},
						{
						  path: 'order/followUser',
						  style: {
						    navigationBarTitleText: '跟进人列表',
						  },
						},
						{
						  path: 'order/signName',
						  style: {
						    navigationBarTitleText: '签名',
						  },
						},
						{
						  path: 'select/selectDecorate',
						  style: {
						    navigationBarTitleText: '关联装修单号',
						    enablePullDownRefresh: true
						  }
						},
						{
						  path: 'select/selectDevice',
						  style: {
						    navigationBarTitleText: '选择设备',
						    enablePullDownRefresh: true
						  }
						},
          ]
        },
        {
          root: 'pages-decoration',
          pages: [
            {
              path: 'decorationList',
              style: {
                navigationBarTitleText: '装修管理',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
            {
              path: 'decorationDetail',
              style: {
                navigationBarTitleText: '装修详情',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
          ]
        },
        {
          root: 'pages-todoTask',
          pages: [
            {
              path: 'todo-task/todoTask',
              style: {
                navigationBarTitleText: '我的待办',
                "enablePullDownRefresh": true
              }
            },
            {
              path: 'system-notice/systemNotice',
              style: {
                navigationBarTitleText: '系统公告',
                "enablePullDownRefresh": true
              }
            },
            {
              path: 'system-notice/mySystemNotice',
              style: {
                navigationBarTitleText: '系统公告',
                "enablePullDownRefresh": true
              }
            },
            {
              path: 'system-notice/noticeDetail',
              style: {
                navigationBarTitleText: '公告详情',
                "enablePullDownRefresh": true
              }
            },
            {
              path: 'messageDetail',
              style: {
                navigationBarTitleText: '待阅消息',
                "enablePullDownRefresh": false
              }
            },
          ]
        },
        {
          root: 'pages-visitor',
          pages: [
            {
              path: 'visitorAccess',
              style: {
                navigationBarTitleText: '访客通行',
                "enablePullDownRefresh": true
              }
            },
            {
              path: 'visitorInfo',
              style: {
                navigationBarTitleText: '访客详情',
                "enablePullDownRefresh": true
              }
            },
          ]
        },
      ],
      componentPlaceholder: {
        'points-mall': 'view'
      },
      tabBar: {
        color: '#666',
        borderStyle: 'black',
        backgroundColor: '#ffffff',
        list: [],
        custom:true,
      },
      globalStyle: {
        navigationBarTextStyle: 'white',
        navigationBarTitleText: '社区',
        navigationBarBackgroundColor: '#2761FF',
        backgroundColor: '#2761FF',
        "app-plus": {
          "bounce": "none"
        }
      },
      easycom: {
        autoscan: true,
        custom: {
          '^uni-(.*)': '@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue',
          '^u-(.*)': 'uview-ui/components/u-$1/u-$1.vue',
          "^custom-(.*)": "@/components/custom-$1/custom-$1.vue",
          '^cl-(.*)': 'cl-uni/components/cl-$1/cl-$1.vue'
        },
      },
    },
  };

  // 条件编译方式：
  const h5HideNavigationbar = (config) => {
    if (platform === 'h5') {
      config.PAGES_JSON.globalStyle.navigationStyle = 'custom';
    }
  };

  // 设置小程序tabbar
  const setMpweixinTabbar = (config) => {
    if (platform === 'mp-weixin') {
      config.PAGES_JSON.tabBar.custom = true
      config.PAGES_JSON.tabBar.list = [
        {
          pagePath: 'pages/index/index'
        },
        {
          pagePath: 'pages/kanban/index'
        }
      ]
    }
  }

  //  隐藏 H5导航栏
  h5HideNavigationbar(config);
  // 设置小程序tabbar
  setMpweixinTabbar(config);

  return config;
})();
