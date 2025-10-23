const { getAppConfig } = require('./utils');
// const requireMallPages = require('./mall');
const pages = require('../pages');

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
        // {
        //   path: 'pages/index/index',
        //   style: {
        //     navigationBarTitleText: '首页',
        //     // "navigationStyle": "custom", // 隐藏原生导航栏
        //     // usingComponents:{
        //     //   "uniPop":"/components/uniPop/uniPop"
        //     // },
        //     "app-plus": {
        //       "titleNView": {
        //         "buttons": [{
        //           "text": "\ue606",
        //           "fontSize": "26px",
        //           "fontSrc":"/static/iconfont/message.ttf",
        //           "float":"right"
        //         }]
        //       }
        //     }
        //   },
        // },
        {
          path: 'pages/questionnaire-Instructions',
          style: {
            navigationBarTitleText: '问卷指导语',
            "app-plus": {
              "titleNView": {
              }
            }
          },
        },
        {
          path: 'pages/questionnaire-baseInfo',
          style: {
            navigationBarTitleText: '基本信息',
            "app-plus": {
              "titleNView": {
              }
            }
          },
        },
        {
          path: 'pages/questionnaire-list',
          style: {
            navigationBarTitleText: '问卷调查',
            "app-plus": {
              "titleNView": {
              }
            }
          },
        },

        {
          path: 'pages/guide/guide',
          style: {
            navigationBarTitleText: "问卷指导语",
          },
        },
        {
          path: 'pages/basic-info/basic-info',
          style: {
            navigationBarTitleText: "基本信息",
          },
        },
        {
          path: 'pages/questionnaire/questionnaire',
          style: {
            navigationBarTitleText: "问卷调查",
          },
        },
        {
          path: 'pages/result/result',
          style: {
            navigationBarTitleText: "完成",
          },
        },
      ],
      subPackages: [
        {
          root: 'pages-a',
          pages: [
            // {
            //   path: 'authorization/login',
            //   style: {
            //     navigationBarTitleText: '',
            //     navigationStyle: 'custom',
            //   },
            // },
          ]
        },
      ],
      componentPlaceholder: {
        'points-mall': 'view'
      },
      globalStyle: {
        navigationBarTitleText: '问卷调查系统',
        navigationBarBackgroundColor: '#667eea',
        backgroundColor: '#F8F8F8',
        navigationBarTextStyle: "#fff",
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

  //  隐藏 H5导航栏
  h5HideNavigationbar(config);

  return config;
})();
