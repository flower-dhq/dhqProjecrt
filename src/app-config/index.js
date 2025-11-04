const appEnvJson = require('./env');

// 导出App配置
export default (() => {
  // 优先取node 环境变量，若不使用npm run script，直接执行原本uni-app命令， 需要执行npm run switch切换项目配置
  return (process.env.VUE_APP_CONFIG && JSON.parse(process.env.VUE_APP_CONFIG)) || appEnvJson || {};
})();
