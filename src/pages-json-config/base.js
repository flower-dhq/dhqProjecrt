const { getAppConfig } = require('./utils');


module.exports = (() => {
  //  需要条件编译 process.env.VUE_APP_PLATFORM 判断，命名语意方法名修改对应pages.json属性
  const platform = process.env.VUE_APP_PLATFORM; // h5 网页 mp-weixin 微信小程序 app-plus APP, 其他值看文档
  const { THEME_NAME, ENABLED_MALL } = getAppConfig();

  // 配置对象
  const config = {
    // 项目编码
    PROJECT_CODE: 'BASE', 
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
