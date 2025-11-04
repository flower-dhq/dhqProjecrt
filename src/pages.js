const { hot } = require('uni-pages-hot-modules');
const { mergePagesJson } = require('./pages-json-config/utils');

module.exports = hot(() => {
  // 合并pages.js配置
  return mergePagesJson();
});
