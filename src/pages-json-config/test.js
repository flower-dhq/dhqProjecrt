const { getAppConfig } = require('./utils');

module.exports = (() => {
  const { } = getAppConfig();
  
  const config = {
    // 项目编码
    PROJECT_CODE: 'TEST', 
    // pages.json 配置
    PAGES_JSON: {
      subPackages: [
        {
          root: 'pages-a',
          pages: [
            // {
            //   path: 'test/test',
            //   style: {
            //     navigationBarTitleText: 'Test',
            //   },
            // }
          ],
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
