const { getAppConfig } = require('./utils');

module.exports = (() => {
  const { } = getAppConfig();
  
  const config = {
    // 项目编码
    PROJECT_CODE: 'KANBAN', 
    // pages.json 配置
    PAGES_JSON: {
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
          ]
        },
      ],
      globalStyle: {
        navigationBarTitleText: '测试项目',
      },
      easycom: {
        '^u-(.*)': 'uview-ui/components/u-$1/u-$1.vue',
      },
    }
  };

  return config;
})();
