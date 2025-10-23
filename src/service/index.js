const requireContext = require.context('.', false, /\.js$/);
const excluedFile = ['./index.js'];
const files = requireContext.keys().filter((name) => !excluedFile.includes(name));

// 引入所有接口
const apiModule = {};

files.forEach((item) => {
  const { name, api } = requireContext(item).default;
  apiModule[name] = api;
});

export default apiModule;
