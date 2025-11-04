const { getAppConfig } = require('./utils');

module.exports = (() => {
  const {} = getAppConfig();

  // 主包 (独有)
  const pages = []
  // 分包 (独有)
  const subPackages = [
    {
      root: 'pages-a',
      pages: [
        {
          path: 'test/test', // 假设test页只有新一代有
          style: {
            navigationBarTitleText: 'Test',
          },
        },
				{
				  path: 'test/web', // 假设test页只有新一代有
				  style: {
				    navigationBarTitleText: '浏览器',
				  },
				},
      ],
    },
		{
			root: 'pages-b',
			pages: [
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
      ],
		},
    {
			root: 'pages-c',
			pages: [
        {
          path: 'exposure/list', 
          style: {
            navigationBarTitleText: '曝光台',
            enablePullDownRefresh: true
          },
        },
				{
          path: 'exposure/detail', 
          style: {
            navigationBarTitleText: '曝光详情',
          },
        },
        {
          path: 'exposure/publish', 
          style: {
            navigationBarTitleText: '我要曝光',
          }
        },
        {
          path: 'exposure/success', 
          style: {
            navigationBarTitleText: '提交成功',
          }
        },
        {
          path: 'exposure/history', 
          style: {
            navigationBarTitleText: '投稿历史',
            enablePullDownRefresh: true
          }
        }
      ],
		}
  ]
  
  const config = {
    // 项目编码
    PROJECT_CODE: 'ZR',
    // pages.json 配置
    PAGES_JSON: {
      globalStyle: {
        navigationBarTextStyle: 'white',
        navigationBarTitleText: '社区',
        navigationBarBackgroundColor: '#60D4A3',
        backgroundColor: '#60D4A3',
      },
      tabBar: {
        color: '#666',
        selectedColor: '#00C6D2',
        borderStyle: 'white',
        backgroundColor: '#ffffff',
        list: [],
      }
    },
    CALL_BACK: (pagesJs) => {
      mergePages(pagesJs)
    }
  };

  // 合并分包页面, 只有新一代特有的
  const mergePages = (pagesJs) => {
    const subPackageList = pagesJs.subPackages
    const findSubpackage = (list, root) => list.findIndex((item) => item.root === root)

    // 合并分包
    subPackages.forEach(item => {
      const { root, pages} = item
      const subPackagesIndex = findSubpackage(subPackageList, root)
      // 不存在分包，新建
      if (subPackagesIndex === -1) {
        pagesJs.subPackages.push(item)
      } else {
        pages.forEach(page => {
          pagesJs.subPackages[subPackagesIndex].pages.push(page)
        })
      }
    })

    // 合并主包

  }

  return config;
})();
