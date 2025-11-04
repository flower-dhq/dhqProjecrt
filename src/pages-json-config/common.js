const { getAppConfig } = require('./utils');
const requireMallPages = require('./mall');

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
            usingComponents:{
              "uniPop":"/components/uniPop/uniPop"
            },
            "app-plus": {
              "titleNView": {
                "buttons": [{
                  "text": "\ue606",
                  "fontSize": "26px",
                  "fontSrc":"/static/iconfont/message.ttf",
                  "float":"right"
                }]
              }
            }
          },
        },
        {
          path: 'pages/service/service',
          style: {
            navigationBarTitleText: '服务',
            usingComponents:{
              "uniPop":"/components/uniPop/uniPop"
            }
          },
        },
        {
          path: 'pages/code/passCode',
          style: {
            navigationBarTitleText: '码上通行',
            // usingComponents:{
            //   "uniPop":"/components/uniPop/uniPop"
            // }
          },
        },
        {
          path: 'pages/industry/industry',
          style: {
            navigationBarTitleText: '产业',
            usingComponents:{
              "uniPop":"/components/uniPop/uniPop"
            }
          },
        },
        {
          path: 'pages/mine/mine',
          style: {
            navigationBarTitleText: '我的',
            usingComponents:{
              "uniPop":"/components/uniPop/uniPop"
            }
          },
        },
      ],
      subPackages: [
        {
          root: 'pages-a',
          pages: [
            {
              path: 'authorization/login',
              style: {
                navigationBarTitleText: '',
                navigationStyle: 'custom',
              },
            },
            {
              path: 'authorization/reset-password',
              style: {
                navigationBarTitleText: '重置密码',
              },
            },
            {
              path: 'authorization/privacy',
              style: {
                navigationBarTitleText: '用户协议',
              },
            },
            {
              path: 'authorization/complete-profile',
              style: {
                navigationBarTitleText: '完善资料',
              },
            },
            {
              path: 'authorization/auth-jump'
            },
            {
              path: 'authorization/auth-certify',
              style: {
                navigationBarTitleText: ''
              }
            },
            {
              path: 'profile/profile',
              style: {
                navigationBarTitleText: '个人信息',
              },
            },
            // {
            //   path: 'activity/activityList',
            //   style: {
            //     navigationBarTitleText: '活动列表',
            //   },
            // }, {
            //   path: 'activity/activityDetail',
            //   style: {
            //     navigationBarTitleText: '活动详情',
            //   },
            // }, {
            //   path: 'webview/webview',
            // },
            // {
            //   path: 'propertyPublicity/list',
            //   style: {
            //     navigationBarTitleText: '宣传',
            //   },
            // },
            // {
            //   path: 'propertyPublicity/viewRes',
            //   style: {
            //     navigationBarTitleText: '宣传详情',
            //   },
            // },
            // {
            //   path: 'sunStory/sunStory',
            //   style: {
            //     navigationBarTitleText: '阳光故事',
            //   },
            // },
            // {
            //   path: 'sunStory/sunStoryDetail',
            //   style: {
            //     navigationBarTitleText: '故事详情',
            //   },
            // },
            // {
            //   path: 'sunStory/sunStoryComment',
            //   style: {
            //     navigationBarTitleText: '更多评论',
            //   },
            // },
            // {
            //   path: 'huiKing/huiHomeScene',
            //   style: {
            //     navigationBarTitleText: '阳光家园',
            //   },
            // },
            // {
            //   path: 'huiKing/huiFamilyScene',
            //   style: {
            //     navigationBarTitleText: '阳光团队',
            //   },
            // },
            // {
            //   path: 'announcement/list',
            //   style: {
            //     navigationBarTitleText: '通知公告'
            //   }
            // },
            // {
            //   path: 'announcement/detail',
            //   style: {
            //     navigationBarTitleText: '公告详情'
            //   }
            // } ,

            {
						  path: 'repair/reportingRorRepairs',
						  style: {
						    navigationBarTitleText: '报事报修',
						  },
						},
						{
						  path: 'repair/myReportAndRepair',
						  style: {
						    navigationBarTitleText: '物业报事报修',
						  },
						},
						{
						  path: 'repair/processingProgress',
						  style: {
						    navigationBarTitleText: '处理进度',
						  },
            },
            {
						  path: 'repair/returnVisitQuestionnaireDetail',
						  style: {
						    navigationBarTitleText: '评价',
						  },
            }, 
            {
              path: 'visit-apply/houseVisitApply',
              style: {
                navigationBarTitleText: '住宅拜访',
              }
            },
            {
              path: 'visit-apply/companyVisitApply',
              style: {
                navigationBarTitleText: '企业拜访',
              }
            },
            {
              path: 'visit-apply/xydCompanyVisitApply',
              style: {
                navigationBarTitleText: '企业拜访',
              }
            },
            {
              path: 'visit-apply/visit-regist',
              style: {
                navigationBarTitleText: '访客登记'
              }
            },
            {
              path: 'visit-apply/visit-list',
              style: {
                navigationBarTitleText: '预约记录',
                enablePullDownRefresh: true
              }
            },
            {
              path: 'visit-apply/visit-detail',
              style: {
                navigationBarTitleText: '访客登录',
              }
            },
            {
              path: 'visit-apply/choose-houses',
              style: {
                navigationBarTitleText: '选择房屋',
              }
            },
						{
						  path: 'switchProject/switchProject',
						  style: {
						    navigationBarTitleText: '选择社区',
						  }
						},
						{
						  path: 'authorization/bindingMobile',
						  style: {
						    navigationBarTitleText: '绑定手机号',
						  }
						},
            // -----自定义工单-----
            {
              path: 'customOrder/myReportAndRepair',
              style: {
						    navigationBarTitleText: '物业报事报修',
						  },
            },
            {
              path: 'customOrder/reportingRorRepairs',
              style: {
						    navigationBarTitleText: '报事报修',
						  },
            },
						{
						  path: 'customOrder/processingProgress',
						  style: {
						    navigationBarTitleText: '处理进度',
						  },
						},
						{
						  path: 'customOrder/returnVisitQuestionnaireDetail',
						  style: {
						    navigationBarTitleText: '评价',
						  },
            },
            // ----------
          ]
        },
        {
          root: 'pages-b',
          pages: [
            {
              path: 'house-info/house-auth-list',
              style: {
                navigationBarTitleText: '房源管理',
              },
            },
            {
              path: 'house-info/add-house-address',
              style: {
                navigationBarTitleText: '新增房屋',
              },
            },
            {
              path: 'house-keeper/houserkeeperEvaluation',
              style: {
                navigationBarTitleText: '管家评价'
              }
            },
            {
              path: 'house-info/city-index-list',
              style: {
                navigationBarTitleText: '选择城市',
              },
            },
            {
              path: 'myConfig/myConfig',
              style: {
                navigationBarTitleText: '设置',
              },
            }, {
              path: 'myConfig/editPassword',
              style: {
                navigationBarTitleText: '修改密码',
              },
            },
            {
              path: 'house-info/auth-address-list',
              style: {
                navigationBarTitleText: '认证地址',
              },
            },
            {
              path: 'house-info/visit-address-list',
              style: {
                navigationBarTitleText: '到访地址',
              },
            },
            {
              path: 'house-info/my-family-house',
              style: {
                navigationBarTitleText: '我的家人',
              },
            },
            {
              path: 'house-info/invite-family',
              style: {
                navigationBarTitleText: '邀请家人',
              },
            },
            {
              path: 'phone-book/phone-book-list',
              style: {
                navigationBarTitleText: '便民电话',
              }
            },
            {
              path: 'membersCard/myMembersCard',
              style: {
                navigationBarTitleText: '会员卡',
              }
            },
            {
              path: 'aboutUs/aboutUs',
              style: {
                navigationBarTitleText: '关于我们',
              }
            },
            {
              path: 'aboutUs/agreement',
              style: {
                navigationBarTitleText: '协议'
              }
            },
            {
              path: 'aboutUs/canse',
              style: {
                navigationBarTitleText: ''
              }
            },
            {
              path: 'house-info/choose-houses',
              style: {
                navigationBarTitleText: '选择房产地址',
              },
            },
            {
              path: 'announcement/list',
              style: {
                navigationBarTitleText: '通知公告'
              }
            },
            {
              path: 'announcement/detail',
              style: {
                navigationBarTitleText: '公告详情'
              }
            },
            {
              path: 'claim-item-manage/claim-item-list',
              style: {
                navigationBarTitleText: '寻物启事',
                enablePullDownRefresh: true
              }
            },
            {
              path: 'claim-item-manage/claim-item-detail',
              style: {
                navigationBarTitleText: '寻物详情'
              }
            },
            {
              path: 'claim-item-manage/add-claim-item',
              style: {
                navigationBarTitleText: '失物登记'
              }
            },
            {
              path: 'guide/index',
              style: {
                navigationBarTitleText: '指南'
              }
            },
            {
						  path: 'inviteVisitor/inviteVisitor',
						  style: {
						    navigationBarTitleText: '访客申请',
						  }
						},
            {
						  path: 'inviteVisitor/inviteVisitorRecord',
						  style: {
						    navigationBarTitleText: '访客记录',
						  }
						},
            {
              path: 'knowledgeBase/messageContent',
              style: {
                navigationBarTitleText: '消息内容',
              },
            },
            {
              path: 'systemMessages/systemList',
              style: {
                navigationBarTitleText: '系统消息',
              },
            },
            {
						  path: 'systemMessages/systemDetail',
						  style: {
						    navigationBarTitleText: '消息详情',
						  },
            },
            {
						  path: 'systemMessages/systemNewDetail',
						  style: {
						    navigationBarTitleText: '消息详情',
						  },
            },
            {
              path: 'xinyidaiFaceManage/faceList', 
              style: {
                navigationBarTitleText: '人脸列表',
              },
            },
            {
              path: 'xinyidaiFaceManage/faceIdentity',
              style: {
                navigationBarTitleText: '身份信息',
              },
            },
            {
              path: 'xinyidaiFaceManage/newFaceForm',
              style: {
                navigationBarTitleText: '录入人脸',
              },
            },
            {
              path: 'xinyidaiFaceManage/elevatorCode',
              style: {
                navigationBarTitleText: '乘梯码',
              },
            },
          ]
        }, {
          root: 'pages-c',
          pages: [
            {
              path: 'goods-release/add-goods-release',
              style: {
                navigationBarTitleText: '物品放行'
              }
            },
            {
              path: 'goods-release/goods-release-detail',
              style: {
                navigationBarTitleText: '放行结果'
              }
            },
            {
              path: 'goods-release/goods-release-list',
              style: {
                navigationBarTitleText: '放行历史',
                enablePullDownRefresh: true
              }
            },
            {
              path: 'goods-release/add-release-announce',
              style: {
                navigationBarTitleText: '放行条申请'
              }
            },
            {
              path: 'goods-release/release-announce-detail',
              style: {
                navigationBarTitleText: '放行条结果'
              }
            },
            {
              path: 'goods-release/release-announce-list',
              style: {
                navigationBarTitleText: '放行条历史',
                enablePullDownRefresh: true
              }
            },
            {
              path: 'housekeeper/goodsCollection',
              style: {
                navigationBarTitleText: '快递代收'
              }
            },
            {
              path: 'housekeeper/moreMyGoodCollection',
              style: {
                navigationBarTitleText: '我的快递'
              },
            },
            {
              path: 'housekeeper/keyCollection',
              style: {
                navigationBarTitleText: '钥匙借用'
              }
            },
            {
              path: 'questionnaire/list',
              style: {
                navigationBarTitleText: '问卷调查',
              },
            },
            {
              path: 'questionnaire/detail',
              style: {
                navigationBarTitleText: '问卷详情',
              },
            },
            {
              path: 'questionnaire/viewResults',
              style: {
                navigationBarTitleText: '问卷结果',
              },
            },
            {
              path: 'questionnaire/questionnaireAuth',
              style: {
                navigationBarTitleText: '客户满意度调查',
              },
            },
            {
              path: 'customer-visit/question',
              style: {
                navigationBarTitleText: '拜访问卷'
              }
            },
            {
              path: 'meeting-room/room-list',
              style: {
                navigationBarTitleText: '会议厅预定列表',
                enablePullDownRefresh: true
              },
            },
            {
              path: 'meeting-room/room-detail',
              style: {
                navigationBarTitleText: '会议厅预定详情',
              },
            },
            {
              path: 'meeting-room/room-edit',
              style: {
                navigationBarTitleText: '会议厅预定提交',
              },
            },
            {
              path: 'meeting-room/myMeetingRoomList',
              style: {
                navigationBarTitleText: '会议厅订单',
               },
            }, {
              path: 'meeting-room/my-meeting-detail',
              style: {
                navigationBarTitleText: '会议厅订单详情',
               },
            },
            {
              path: 'meeting-room/meeting-examine',
              style: {
                navigationBarTitleText: '审核中',
              },
            },
            {
              path: 'meeting-room/meeting-map',
              style: {
                navigationBarTitleText: '地图',
              },
            },
            {
              path: 'parkManagement/thePassQrcode',
              style: {
                navigationBarTitleText: '通行',
              },
            },
            {
              path: 'my-activitiy/my-ctivityList',
              style: {
                navigationBarTitleText: '我的活动列表',
              },
            },
						{
						  path: 'houseCorrelation/myDecorateList',
						  style: {
						    navigationBarTitleText: '装修申请列表',
						  },
						},
						{
						  path: 'houseCorrelation/decorateApply',
						  style: {
						    navigationBarTitleText: '装修申请',
						  },
						},
            {
						  path: 'houseCorrelation/decorateInfo',
						  style: {
						    navigationBarTitleText: '装修详情',
                enablePullDownRefresh: true
						  },
						},
          ]
        }, {
          root: 'pages-d',
          pages: [
            {
              path: 'card-manage/card-handle-list',
              style: {
                navigationBarTitleText: '卡证办理列表',
                enablePullDownRefresh: true
              }
            },
            {
              path: 'card-manage/card-handle-detail',
              style: {
                navigationBarTitleText: '卡证办理'
              }
            },
            {
              path: 'card-manage/my-card-apply',
              style: {
                navigationBarTitleText: '我的卡证申请'
              }
            },
            {
              path: 'card-manage/my-card-list',
              style: {
                navigationBarTitleText: '我的卡证记录',
                enablePullDownRefresh: true
              }
            },
            {
              path: 'card-manage/my-card-detail',
              style: {
                navigationBarTitleText: '我的卡证详情'
              }
            }, {
              path: 'enterprise-info/enterprise-auth-list',
              style: {
                navigationBarTitleText: '企业认证列表',
              },
            },
            {
              path: 'enterprise-info/join-company',
              style: {
                navigationBarTitleText: '加入企业',
              },
            },
            {
              path: 'enterprise-info/select-company',
              style: {
                navigationBarTitleText: '公司列表',
              },
            },
            {
              path: 'enterprise-info/my-staff-approval',
              style: {
                navigationBarTitleText: '我的员工',
              },
            },
            {
              path: 'enterprise-info/invite-staff',
              style: {
                navigationBarTitleText: '邀请员工',
              },
            },
            {
              path: 'keyopen/aKeyOpenDoor',
              style: {
                navigationBarTitleText: '一键开门',
              }
            }, 
            {
              path: 'keyopen/selectOpenDoorType',
              style: {
                navigationBarTitleText: '一键开门',
              }
            },
            {
              path: 'keyopen/codeOpenDoor',
              style: {
                navigationBarTitleText: '二维码开门',
              }
            },
            {
              path: 'keyopen/remoteOpenDoor',
              style: {
                navigationBarTitleText: '远程开门',
              }
            },
						{
						  path: 'visit-apply/myVisitorsRecord',
						  style: {
						    navigationBarTitleText: '我的访客记录',
						  }
						},
            {
						  path: 'visitor/visitorApplication',
						  style: {
						    navigationBarTitleText: '访客申请',
						  }
						},
            {
						  path: 'visitor/visitorCode',
						  style: {
						    navigationBarTitleText: '访客申请',
						  }
						},
            {
						  path: 'visitor/visitorList',
						  style: {
						    navigationBarTitleText: '访客记录',
						  }
						},
						{
						  path: 'visit-apply/myVisitorsRecordDetail',
						  style: {
						    navigationBarTitleText: '访客记录详情',
						  }
						},
            {
						  path: 'parking/parking',
						  style: {
						    navigationBarTitleText: '停车',
						  }
						},
            {
              path: 'activity/activityList',
              style: {
                navigationBarTitleText: '活动列表',
              },
            }, {
              path: 'activity/activityDetail',
              style: {
                navigationBarTitleText: '活动详情',
              },
            }, {
              path: 'webview/webview',
            },
            {
              path: 'propertyPublicity/list',
              style: {
                navigationBarTitleText: '宣传',
              },
            },
            {
              path: 'propertyPublicity/viewRes',
              style: {
                navigationBarTitleText: '宣传详情',
              },
            },
            {
              path: 'sunStory/sunStory',
              style: {
                navigationBarTitleText: '阳光故事',
              },
            },
            {
              path: 'sunStory/sunStoryDetail',
              style: {
                navigationBarTitleText: '故事详情',
              },
            },
            {
              path: 'sunStory/sunStoryComment',
              style: {
                navigationBarTitleText: '更多评论',
              },
            },
            {
              path: 'huiKing/huiHomeScene',
              style: {
                navigationBarTitleText: '阳光家园',
              },
            },
            {
              path: 'huiKing/huiFamilyScene',
              style: {
                navigationBarTitleText: '阳光团队',
              },
            },
            {
              path: 'keyopen/nuopudun',
              style: {
                navigationBarTitleText: '一键开门',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
            {
              path: 'keyopen/deviceList',
              style: {
                navigationBarTitleText: '门禁列表',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
            {
              path: 'myWallet/index',
              style: {
                navigationBarTitleText: '个人钱包',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
            {
              path: 'myWallet/recharge',
              style: {
                navigationBarTitleText: '钱包充值',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
            {
              path: 'myWallet/payTip',
              style: {
                navigationBarTitleText: '支付结果',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            },
            {
              path: 'integral/detail',
              style: {
                navigationBarTitleText: '积分明细',
                enablePullDownRefresh: true,
                onReachBottomDistance: 50
              }
            }
          ]
        }, {
          root: 'pages-leasing',
          pages: [
            {
              path: 'makeInvoice',
              style: {
                navigationBarTitleText: '物业订单',
              }
            },
            {
              path: 'addMakeInvoice',
              style: {
                navigationBarTitleText: '开票详情',
              }
            },
            {
              path: 'selectedOrder',
              style: {
                navigationBarTitleText: '已选订单',
              }
            },
            {
              path: 'makeInvoiceHistory',
              style: {
                navigationBarTitleText: '发票列表',
              }
            },
            {
              path: 'paymentinfo/newPaymentCenter',
              style: {
                navigationBarTitleText: '生活缴费',
              }
            },
            {
              path: 'paymentinfo/components/billFeeDetail',
              style: {
                navigationBarTitleText: '账单明细',
              }
            },
            {
              path: 'paymentinfo/newPayResult',
              style: {
                navigationBarTitleText: '支付结果',
              }
            },
            {
              path: 'payMentHistory',
              style: {
                navigationBarTitleText: '缴费记录',
              }
            },
            {
              path: 'paymentinfo/WXSharePage',
              style: {
                navigationBarTitleText: '账单分享',
              }
            },
            {
              path: 'paymentinfo/WXSharePageGzhOauth',
              style: {
                navigationBarTitleText: '账单分享',
              }
            },
            {
              path: 'monthlyCardApplication/myparkingSpot',
              style: {
                navigationBarTitleText: '我的车位',
              }
            },
            {
              path: 'monthlyCardApplication/addmonthlyCardApplication',
              style: {
                navigationBarTitleText: '月卡申请',
              }
            },
            // {
            //   path: 'pdfDemo/pdfView',
            //   style: {
            //     navigationBarTitleText: '预览',
            //   }
            // },
            {
              path: 'monthlyCardApplication/selectParkingLot',
              style: {
                navigationBarTitleText: '选择车场',
              }
            },
            {
              path: 'monthlyCardApplication/selectProject',
              style: {
                navigationBarTitleText: '选择项目',
              }
            },
            {
              path: 'monthlyCardApplication/selectParking',
              style: {
                navigationBarTitleText: '选择车位',
              }
            },
            {
              path: 'monthlyCardApplication/selectLicensePlate',
              style: {
                navigationBarTitleText: '选择车牌',
              }
            },
            {
              path: 'monthlyCardApplication/newPayResult',
              style: {
                navigationBarTitleText: '月保卡支付结果',
              }
            },
          ]
        },
        {
          root: 'pages-order',
          pages:[
            {
              path: 'order/add',
              style: {
                navigationBarTitleText: '新增工单',
              }
            },
            {
              path: 'order/quotation',
              style: {
                navigationBarTitleText: '报价单',
              }
            },
            {
              path: 'order/repairHistory',
              style: {
                navigationBarTitleText: '工单记录',
              }
            },
            {
              path: 'order/repairDetail',
              style: {
                navigationBarTitleText: '工单详情',
              }
            },
            {
              path: 'order/toPay',
              style: {
                navigationBarTitleText: '支付订单',
              }
            },
            {
              path: 'order/payResult',
              style: {
                navigationBarTitleText: '支付状态',
              }
            }
          ]
        }
      ],
      componentPlaceholder: {
        'points-mall': 'view'
      },
      tabBar: {
        color: '#666',
        borderStyle: 'black',
        backgroundColor: '#ffffff',
        custom:true,
        list: [
          {
            pagePath: 'pages/index/index',
            // iconPath: 'static/tabbar_home.png',
            // selectedIconPath: `static/${THEME_NAME}/tabbar_home.png`,
            // text: '首页',
          },
          {
            pagePath: 'pages/service/service',
            // iconPath: 'static/tabbar_service.png',
            // selectedIconPath: `static/${THEME_NAME}/tabbar_service.png`,
            // text: '服务',
          },
          {
            pagePath: 'pages/code/passCode',
            // iconPath: 'static/tabbar_code.png',
            // selectedIconPath: `static/${THEME_NAME}/tabbar_code.png`,
            // text: '码上通行',
          },
          {
            pagePath: 'pages/industry/industry',
          },
          {
            pagePath: 'pages/mine/mine',
            // iconPath: 'static/tabbar_mine.png',
            // selectedIconPath: `static/${THEME_NAME}/tabbar_mine.png`,
            // text: '我的',
          },
        ],
      },
      globalStyle: {
        navigationBarTextStyle: 'black',
        navigationBarTitleText: '社区',
        navigationBarBackgroundColor: '#F8F8F8',
        backgroundColor: '#F8F8F8',
        "app-plus": {
          "bounce": "none"
        }
      },
      easycom: {
        autoscan: true,
        custom: {
          '^uni-(.*)': '@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue',
          '^u-(.*)': 'uview-ui/components/u-$1/u-$1.vue',
          'cl-(.*)': 'cl-uni/components/cl-$1/cl-$1.vue',
          "^custom-(.*)": "@/components/custom-$1/custom-$1.vue"
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

  // 合并商城
  const mergeMall = (config) => {
    //  是否配置商城模块;
    if (ENABLED_MALL) {
      // 插入tabbar
      const mallpage = {
        path: 'pages/common/mall',
        style: {
          navigationBarTitleText: '商城',
        },
      };
      const mallBar = {
        pagePath: 'pages/common/mall',
        // iconPath: 'static/tabbar_mall.png',
        // selectedIconPath: `static/${THEME_NAME}/tabbar_mall.png`,
        // text: '商城',
      };
      config.PAGES_JSON.pages.splice(2, 0, mallpage);
      config.PAGES_JSON.tabBar.list.splice(2, 0, mallBar);
      // 合并pages
      const subPackages = config.PAGES_JSON.subPackages;
      const mallPages = requireMallPages();
      if (Array.isArray(subPackages)) {
        mallPages.forEach((item) => {
          config.PAGES_JSON.subPackages.push(item);
        });
      } else {
        config.PAGES_JSON.subPackages = mallPages;
      }
    }
  };

  //  隐藏 H5导航栏
  h5HideNavigationbar(config);

  // 合并商城
  mergeMall(config);

  return config;
})();
