const { getAppConfig } = require('./utils');

module.exports = () => {
  const subPackages = [
    {
      root: 'pages-mall',
      pages: [
        {
          path: 'index/index',
          style: {
            navigationBarTitleText: '首页',
            enablePullDownRefresh: true,
          },
        },
        {
          path: 'category/category',
          style: {
            navigationBarTitleText: '分类',
            enablePullDownRefresh: true,
          },
        },
        {
          path: 'shopping-cart/shopping-cart',
          style: {
            navigationBarTitleText: '购物车',
            enablePullDownRefresh: true,
          },
        },
        {
          path: 'mine/mine',
          style: {
            navigationBarTitleText: '我的',
          },
        },
        // {
        //   path: 'WeChatPay/WeChatPay',
        //   style: {
        //     navigationBarTitleText: '支付',
        //   },
        // },
      ],
    },
    {
      root: 'pages-mall-a',
      pages: [
        {
          path: 'authorization/binding-phone',
          style: {
            navigationBarTitleText: '绑定手机',
          },
        },
        {
          path: 'authorization/logout',
          style: {
            navigationBarTitleText: '注销登录',
          },
        },
        {
          path: 'shopping-info/shopping-info',
          style: {
            navigationBarTitleText: '商品详情',
          },
        },
        {
          path: 'shopping-info/shopping-comment',
          style: {
            navigationBarTitleText: '商品评价',
            enablePullDownRefresh: true,
          },
        },
        {
          path: 'search-list/search-list',
          style: {
            navigationBarTitleText: '商品列表',
            enablePullDownRefresh: true,
            'app-plus': {
              pullToRefresh: {
                style: 'default',
                offset: '93',
              },
            },
          },
        },
        {
          path: 'coupon-manage/coupon-manage',
          style: {
            navigationBarTitleText: '领券中心',
            enablePullDownRefresh: true,
          },
        },
        {
          path: 'coupon-manage/mine-coupon',
          style: {
            navigationBarTitleText: '我的优惠券',
            enablePullDownRefresh: true,
            'app-plus': {
              pullToRefresh: {
                style: 'default',
                offset: '40rpx',
              },
            },
          },
        },
        {
          path: 'order/pay-order',
          style: {
            navigationBarTitleText: '确认订单',
          },
        },
        {
          path: 'order/pay-result',
          style: {
            navigationBarTitleText: '支付结果',
            disableScroll: true,
          },
        },
        {
          path: 'order/list',
          style: {
            navigationBarTitleText: '商品订单',
            disableScroll: true,
          },
        },
        {
          path: 'order/order-detail',
          style: {
            navigationBarTitleText: '订单详情',
          },
        },
        {
          path: 'address-mng/address-mng',
          style: {
            navigationBarTitleText: '收货地址',
          },
        },
        {
          path: 'address-mng/create-edit-addr',
          style: {
            navigationBarTitleText: '新增地址',
          },
        },
        {
          path: 'order-after-sale/return-approval-info',
          style: {
            navigationBarTitleText: '退货详情',
          },
        },
        {
          path: 'order-after-sale/return-approval-progress',
          style: {
            navigationBarTitleText: '售后进度',
          },
        },
        {
          path: 'order-after-sale/return-approval-list',
          style: {
            navigationBarTitleText: '售后订单',
            enablePullDownRefresh: true,
            'app-plus': {
              pullToRefresh: {
                style: 'default',
                offset: '40rpx',
              },
            },
          },
        },
        {
          path: 'shop/list',
          style: {
            navigationBarTitleText: '商家列表',
            enablePullDownRefresh: true,
          },
        },
        {
          path: 'shop/detail',
          style: {
            navigationBarTitleText: '商家详情',
            disableScroll: true,
          },
        },
        {
          path: 'order/logistics-list',
          style: {
            navigationBarTitleText: '订单物流列表',
          },
        },
        {
          path: 'order/logistics',
          style: {
            navigationBarTitleText: '物流详情',
          },
        },
        {
          path: 'favorites/favorites',
          style: {
            navigationBarTitleText: '我的收藏',
            enablePullDownRefresh: true,
            'app-plus': {
              pullToRefresh: {
                style: 'default',
                offset: '53rpx',
              },
            },
          },
        },
        {
          path: 'editor-upload/editor-upload',
          style: {
            navigationBarTitleText: '评价',
          },
        },
        {
          path: 'editor-upload/return-request',
          style: {
            navigationBarTitleText: '退货申请',
          },
        },
        {
          path: 'integral/integral-mall',
          style: {
            navigationBarTitleText: '积分商城',
            disableScroll: true,
          },
        },
        {
          path: 'seckill/limit-time-seckill',
          style: {
            navigationBarTitleText: '限时秒杀',
            disableScroll: true,
          },
        },
        {
          path: 'group-buy/today-group-buy',
          style: {
            navigationBarTitleText: '今日必拼',
            disableScroll: true,
          },
        },
        {
          path: 'become-seller/become-seller',
          style: {
            navigationBarTitleText: '成为商家',
          },
        },
        {
          path: 'custom-bar/custom-list',
          style: {
            navigationBarTitleText: '',
            disableScroll: true,
          },
        },
        {
          path: 'address-mng/get-location',
          style: {
            navigationBarTitleText: '选择项目',
            disableScroll: true,
          },
        },
        {
          path: 'my-message/my-message',
          style: {
            navigationBarTitleText: '我的消息',
            enablePullDownRefresh: true,
          },
        },
        {
          path: 'message-center/system-message',
          style: {
            navigationBarTitleText: '系统消息',
            disableScroll: true,
          },
        },
        {
          path: 'message-center/type-message',
          style: {
            navigationBarTitleText: '',
            disableScroll: true,
          },
        },
        {
          path: 'dev-env/operate-user-info',
          style: {
            navigationBarTitleText: '开发版',
          },
        },
        {
          path: 'order/evaluation',
          style: {
            navigationBarTitleText: '评价中心',
            disableScroll: true,
          },
        },
        {
          path: 'authorization/refresh-token',
          style: {
            navigationBarTitleText: '令牌刷新'
          },
        },
      ],
    },
    {
      root: 'pages-mall-b',
      pages: [
        {
          path: 'share-poster/share-poster',
          style: {
            navigationBarTitleText: '分享',
          },
        },
        {
          path: 'invoices/invoices',
          style: {
            navigationBarTitleText: '发票',
          },
        },
        {
          path: 'staff-approve/staff-approve',
          style: {
            navigationBarTitleText: '员工认证',
          },
        },
        {
          path: 'web-view/web-view',
          style: {
            navigationBarTitleText: '外部链接',
          },
        },
        {
          path: 'browsing-history/browsing-history',
          style: {
            navigationBarTitleText: '我的足迹',
            disableScroll: true,
          },
        },
        {
          path: 'subscription/subscription',
          style: {
            navigationBarTitleText: '我的订阅',
            disableScroll: true,
          },
        },
        {
          path: 'integral/integral-detail',
          style: {
            navigationBarTitleText: '积分明细',
          },
        },
        {
          path: 'search/history-search',
          style: {
            navigationBarTitleText: '商品搜索',
          },
        },
        {
          path: 'coupon/advertising',
          style: {
            navigationBarTitleText: '',
          },
        },
        {
          path: 'chatroom/chatroom',
          style: {
            navigationBarTitleText: '客户服务',
          },
        },
        {
          path: 'downPriceNotice/downPriceNotice',
          style: {
            navigationBarTitleText: '降价通知',
          },
        },
        {
          path: 'about-company/about-company',
          style: {
            navigationBarTitleText: '关于我们',
          },
        },
        {
          path: 'about-company/article-info',
          style: {
            navigationBarTitleText: '关于我们',
          },
        },
        {
          path: 'setting/setting',
          style: {
            navigationBarTitleText: '设置',
          },
        },
        {
          path: 'setting/change-password',
          style: {
            navigationBarTitleText: '修改密码',
          },
        },
        {
          path: 'myShop/myShop',
          style: {
            navigationBarTitleText: '我的店铺',
          },
        },
        {
          //东孚缴费
          path: 'dfPayment/dfPayment',
          style: {
            navigationBarTitleText: '缴费页面',
          },
        },
      ],
    }
  ];

  return subPackages
};
